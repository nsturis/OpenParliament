from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModel
import torch
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from mlx_lm import load, generate
import os
from typing import List
import re
import nltk
from nltk.corpus import stopwords

app = FastAPI()

# Download Danish stopwords
nltk.download("stopwords")
danish_stopwords = set(stopwords.words("danish"))

# Add parliamentary-specific stopwords
parliamentary_stopwords = {
    "folketinget",
    "minister",
    "lovforslag",
    "beslutningsforslag",
    "udvalg",
    "afstemning",
    "paragraf",
    "stk",
    "behandling",
    "møde",
    "dagsorden",
}
danish_stopwords.update(parliamentary_stopwords)

# Load the Danish BERT model
model_name = "Maltehb/danish-bert-botxo"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)


def preprocess_danish_text(text):
    # Convert to lowercase
    text = text.lower()

    # Remove extra whitespace
    text = re.sub(r"\s+", " ", text).strip()

    # Remove stopwords
    words = text.split()
    words = [word for word in words if word not in danish_stopwords]

    # # Join words back into a string
    text = " ".join(words)

    # Remove any HTML tags or script tags and other non-text content and their contents
    text = re.sub(r"<[^>]*>", "", text)

    return text


def split_text_into_chunks(text, chunk_size=512, overlap=50) -> List[str]:
    """
    Splits the input text into sub-chunks of at most `chunk_size` tokens,
    allowing for a given token overlap between consecutive chunks. This
    ensures we never exceed the model's 512-token limit. 
    """
    paragraphs = text.split("\n\n")  # attempt to split on paragraph boundaries
    chunks = []
    current_chunk = []
    current_length = 0

    for paragraph in paragraphs:
        tokens = tokenizer.encode(paragraph, add_special_tokens=False)
        
        # If adding this paragraph to the current chunk stays under the limit, do it
        if current_length + len(tokens) <= chunk_size:
            current_chunk.append(paragraph)
            current_length += len(tokens)
        else:
            # Finish the current chunk
            if current_chunk:
                chunks.append("\n\n".join(current_chunk))
            
            # Handle paragraphs that exceed the chunk size individually
            if len(tokens) > chunk_size:
                for i in range(0, len(tokens), chunk_size - overlap):
                    chunk_tokens = tokens[i : i + chunk_size]
                    chunk_text = tokenizer.decode(chunk_tokens, skip_special_tokens=True)
                    chunks.append(chunk_text)
                current_chunk = []
                current_length = 0
            else:
                current_chunk = [paragraph]
                current_length = len(tokens)

    # Add the final partial chunk (if any)
    if current_chunk:
        chunks.append("\n\n".join(current_chunk))

    return chunks


# # Load Ministral 8B
# llm_model, llm_tokenizer = load("mlx-community/Ministral-8B-Instruct-2410-8bit")


# Modify the DocumentRequest and DocumentResponse classes
class DocumentRequest(BaseModel):
    text: str


class DocumentResponse(BaseModel):
    status: str
    chunks: List[str]
    embeddings: List[List[float]]
    original_text: str


class TextEmbeddingRequest(BaseModel):
    text: str


class TextEmbeddingResponse(BaseModel):
    embedding: List[float]


class QuestionRequest(BaseModel):
    text: str


class QuestionResponse(BaseModel):
    question: str


@app.post("/process_document_embeddings", response_model=DocumentResponse)
async def process_document(request: DocumentRequest):
    try:
        # Store original content
        original_text = request.text
        
        # Preprocess for embedding
        preprocessed_text = preprocess_danish_text(original_text)
        
        # Split into chunks of ≤512 tokens
        chunks = split_text_into_chunks(preprocessed_text, chunk_size=512, overlap=50)
        
        embeddings = []
        for chunk in chunks:
            # Make sure each chunk is still ≤512 tokens; truncation=True ensures no indexing error
            inputs = tokenizer(
                chunk,
                return_tensors="pt",
                truncation=True,
                max_length=512,
                padding=True
            )
            with torch.no_grad():
                outputs = model(**inputs)
            
            # Mean-pool the token embeddings across dimension 1
            pooled_embedding = outputs.last_hidden_state.mean(dim=1)[0].tolist()
            embeddings.append(pooled_embedding)
            
        return DocumentResponse(
            status="success",
            chunks=chunks,
            embeddings=embeddings,
            original_text=original_text
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/get_embedding", response_model=TextEmbeddingResponse)
async def get_embedding(request: TextEmbeddingRequest):
    try:
        print(f"Received request: {request.text}")  # Add logging

        # Preprocess the text before generating embedding
        preprocessed_text = preprocess_danish_text(request.text)

        # Tokenize and generate embedding; truncation will avoid out-of-range errors
        inputs = tokenizer(
            preprocessed_text,
            return_tensors="pt",
            truncation=True,
            max_length=512,
            padding=True
        )
        with torch.no_grad():
            outputs = model(**inputs)

        # Mean-pool the token embeddings across dimension 1
        pooled_embedding = outputs.last_hidden_state.mean(dim=1)[0].tolist()

        print(f"Generated embedding (mean-pooled): {pooled_embedding[:5]}...")  # Log part of the embedding
        return TextEmbeddingResponse(embedding=pooled_embedding)
    except Exception as e:
        print(f"Error in get_embedding: {str(e)}")  # Log any errors
        raise HTTPException(status_code=500, detail=str(e))


# @app.post("/generate_question", response_model=QuestionResponse)
# async def generate_question(request: QuestionRequest):
#     try:
#         # Preprocess the text before generating question
#         preprocessed_text = preprocess_danish_text(request.text)
#         prompt = f"Based on the following Danish text, generate a relevant question:\n\n{preprocessed_text}\n\nQuestion:"

#         response = generate(
#             llm_model,
#             llm_tokenizer,
#             prompt=prompt,
#             max_tokens=100,
#             verbose=True,
#             temp=0.7,
#         )
#         generated_question = response.strip()
#         return QuestionResponse(question=generated_question)
#     except Exception as e:
#         print(f"Error in generate_question: {str(e)}")
#         raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    return {"status": "ok"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
