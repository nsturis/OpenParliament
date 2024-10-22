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

    # # Remove special characters and digits
    # text = re.sub(r"[^a-zæøå\s]", "", text)

    # Remove extra whitespace
    text = re.sub(r"\s+", " ", text).strip()

    # # Remove stopwords
    # words = text.split()
    # words = [word for word in words if word not in danish_stopwords]

    # # Join words back into a string
    # text = " ".join(words)

    # Remove any HTML tags or script tags and other non-text content and their contents
    text = re.sub(r"<[^>]*>", "", text)

    return text


def split_text_into_chunks(text, chunk_size=512, overlap=50) -> List[str]:
    # Preprocess the text before splitting
    preprocessed_text = preprocess_danish_text(text)
    words = preprocessed_text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i : i + chunk_size])
        chunks.append(chunk)
    return chunks


# # Lead Ministral 8B
# llm_model, llm_tokenizer = load("mlx-community/Ministral-8B-Instruct-2410-8bit")


# Modify the DocumentRequest and DocumentResponse classes
class DocumentRequest(BaseModel):
    text: str


class DocumentResponse(BaseModel):
    status: str
    chunks: List[str]
    embeddings: List[List[float]]


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
        # Split the content into chunks
        chunks = split_text_into_chunks(request.text)

        # Generate embeddings for each chunk
        embeddings = []
        for chunk in chunks:
            inputs = tokenizer(
                chunk, return_tensors="pt", truncation=True, max_length=512
            )
            with torch.no_grad():
                outputs = model(**inputs)

            # Use the last hidden state as the embedding (without mean pooling)
            embedding = outputs.last_hidden_state[
                0, 0, :
            ].tolist()  # Using the [CLS] token embedding
            embeddings.append(embedding)

        return DocumentResponse(status="success", chunks=chunks, embeddings=embeddings)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/get_embedding", response_model=TextEmbeddingResponse)
async def get_embedding(request: TextEmbeddingRequest):
    try:
        print(f"Received request: {request.text}")  # Add logging

        # Preprocess the text before generating embedding
        preprocessed_text = preprocess_danish_text(request.text)

        # Tokenize and generate embedding
        inputs = tokenizer(
            preprocessed_text, return_tensors="pt", truncation=True, max_length=512
        )
        with torch.no_grad():
            outputs = model(**inputs)

        # Use the last hidden state as the embedding (without mean pooling)
        embedding = outputs.last_hidden_state[
            0, 0, :
        ].tolist()  # Using the [CLS] token embedding

        print(f"Generated embedding: {embedding[:5]}...")  # Log part of the embedding
        return TextEmbeddingResponse(embedding=embedding)
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
