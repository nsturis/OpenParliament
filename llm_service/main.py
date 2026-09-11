"""Embedding service for Danish parliamentary text.

Model: intfloat/multilingual-e5-large (1024-dim, MIT). E5 requires literal
"query: " / "passage: " prefixes at encode time; chunks are stored WITHOUT
the prefix. Input text is fed to the model as-is apart from HTML stripping
and whitespace collapsing — no lowercasing, no stopword removal (both
degrade sentence-embedding quality; the NLTK Danish stopword list even
contains "ikke", which deletes negation).

Endpoints do blocking torch work, so they are plain `def` (FastAPI runs
them in a threadpool) and model access is serialized with a lock — MPS
forward passes are not usefully parallel.
"""

import base64
import re
import threading
from typing import List

import pymupdf
import pymupdf4llm
import torch
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer

MODEL_NAME = "intfloat/multilingual-e5-large"
EMBEDDING_DIMS = 1024
# Content tokens per chunk: 512 model limit minus headroom for the
# "passage: " prefix and special tokens
MAX_CHUNK_TOKENS = 480
ENCODE_BATCH_SIZE = 32
MAX_TEXTS_PER_REQUEST = 256

app = FastAPI()

model = SentenceTransformer(MODEL_NAME)  # auto-selects MPS when available
model_lock = threading.Lock()

# Chunking gets its own tokenizer + lock: sharing model.tokenizer across
# threads races with model.encode's padding/truncation setup (the Rust fast
# tokenizer raises "Already borrowed"), and fast tokenizers are not
# thread-safe between concurrent threadpool requests either.
chunk_tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
chunk_lock = threading.Lock()
pdf_lock = threading.Lock()  # pymupdf is not thread-safe; concurrent conversions fail intermittently
PAGE_NUMBER = re.compile(r"(?m)^[ \t]*\d{1,4}[ \t]*\n")


def clean_text(text: str) -> str:
    text = re.sub(r"<[^>]*>", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def split_into_chunks(text: str) -> List[str]:
    """Split text into chunks of at most MAX_CHUNK_TOKENS tokens.

    Speech segments are the atomic unit and ~96% fit in one chunk; longer
    ones are split at sentence boundaries, never mid-sentence (except
    pathological single sentences longer than the limit).
    """
    if not text:
        return []
    with chunk_lock:
        if len(chunk_tokenizer.encode(text, add_special_tokens=False)) <= MAX_CHUNK_TOKENS:
            return [text]

        sentences = re.split(r"(?<=[.!?])\s+", text)
        chunks: List[str] = []
        current: List[str] = []
        current_tokens = 0

        for sentence in sentences:
            n_tokens = len(chunk_tokenizer.encode(sentence, add_special_tokens=False))
            if n_tokens > MAX_CHUNK_TOKENS:
                # Pathological sentence: flush, then hard-split by token windows
                if current:
                    chunks.append(" ".join(current))
                    current, current_tokens = [], 0
                tokens = chunk_tokenizer.encode(sentence, add_special_tokens=False)
                for i in range(0, len(tokens), MAX_CHUNK_TOKENS):
                    chunks.append(
                        chunk_tokenizer.decode(tokens[i : i + MAX_CHUNK_TOKENS], skip_special_tokens=True)
                    )
            elif current_tokens + n_tokens <= MAX_CHUNK_TOKENS:
                current.append(sentence)
                current_tokens += n_tokens
            else:
                chunks.append(" ".join(current))
                current, current_tokens = [sentence], n_tokens

        if current:
            chunks.append(" ".join(current))
        return chunks


def encode_passages(chunks: List[str]) -> List[List[float]]:
    if not chunks:
        return []
    with model_lock:
        embeddings = model.encode(
            [f"passage: {chunk}" for chunk in chunks],
            batch_size=ENCODE_BATCH_SIZE,
            normalize_embeddings=True,
        )
        # The MPS caching allocator never returns freed blocks to the OS, and
        # length-sorted batches produce a new buffer shape almost every call —
        # without this the process footprint grows past 14 GB on long backfills.
        if model.device.type == "mps":
            torch.mps.empty_cache()
    return embeddings.tolist()


class DocumentRequest(BaseModel):
    text: str


class DocumentResponse(BaseModel):
    status: str
    chunks: List[str]
    embeddings: List[List[float]]
    original_text: str


class BatchDocumentsRequest(BaseModel):
    texts: List[str]


class DocumentResult(BaseModel):
    chunks: List[str]
    embeddings: List[List[float]]


class BatchDocumentsResponse(BaseModel):
    results: List[DocumentResult]


class QueryRequest(BaseModel):
    text: str


class PdfRequest(BaseModel):
    pdf_base64: str


class PdfResponse(BaseModel):
    markdown: str
    pages: int


class QueryResponse(BaseModel):
    embedding: List[float]


@app.post("/embed_documents", response_model=BatchDocumentsResponse)
def embed_documents(request: BatchDocumentsRequest):
    """Chunk and embed a batch of documents in one model pass."""
    if len(request.texts) > MAX_TEXTS_PER_REQUEST:
        raise HTTPException(status_code=400, detail=f"Max {MAX_TEXTS_PER_REQUEST} texts per request")
    try:
        per_text_chunks = [split_into_chunks(clean_text(t)) for t in request.texts]
        flat_embeddings = encode_passages([c for chunks in per_text_chunks for c in chunks])

        results = []
        offset = 0
        for chunks in per_text_chunks:
            results.append(
                DocumentResult(chunks=chunks, embeddings=flat_embeddings[offset : offset + len(chunks)])
            )
            offset += len(chunks)
        return BatchDocumentsResponse(results=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/process_document_embeddings", response_model=DocumentResponse)
def process_document(request: DocumentRequest):
    """Single-document variant (used by the meeting parser and document scripts)."""
    try:
        chunks = split_into_chunks(clean_text(request.text))
        return DocumentResponse(
            # 'empty' keeps pre-rewrite callers fail-closed: updateEmbeddings.ts
            # deletes rows before re-inserting and must not do so for 0 chunks
            status="success" if chunks else "empty",
            chunks=chunks,
            embeddings=encode_passages(chunks),
            original_text=request.text,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/pdf_to_markdown", response_model=PdfResponse)
def pdf_to_markdown(request: PdfRequest):
    """Born-digital ft.dk PDF -> GitHub markdown (headings, bold numbering, paragraphs).

    Same recipe as finanslov-database's pdftext.py: pymupdf4llm layout, then strip the
    typographic characters its text layer carries (soft hyphen, zero-width space, nbsp).
    """
    try:
        with pdf_lock:
            doc = pymupdf.open(stream=base64.b64decode(request.pdf_base64), filetype="pdf")
            # ft.dk PDFs are born-digital; OCR only chews minutes on the masthead logo per page
            markdown = pymupdf4llm.to_markdown(doc, show_progress=False, use_ocr=False)
        markdown = markdown.replace("\u00ad", "").replace("\u2010\n", "").replace("\u200b", "").replace("\u00a0", " ")
        markdown = PAGE_NUMBER.sub("", markdown)  # footer page numbers land as their own paragraph
        return PdfResponse(markdown=markdown, pages=doc.page_count)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PDF parse failed: {e}")


@app.post("/embed_query", response_model=QueryResponse)
def embed_query(request: QueryRequest):
    try:
        with model_lock:
            embedding = model.encode(
                f"query: {clean_text(request.text)}", normalize_embeddings=True
            )
        return QueryResponse(embedding=embedding.tolist())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health_check():
    return {"status": "ok", "model": MODEL_NAME, "dims": EMBEDDING_DIMS, "device": str(model.device)}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
