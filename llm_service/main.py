from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModel
import torch
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Load the Danish BERT model
model_name = "Maltehb/danish-bert-botxo"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)


class DocumentRequest(BaseModel):
    content: str
    file_id: str


class DocumentResponse(BaseModel):
    status: str
    embedding: list[float]
    error: str = None


class TextEmbeddingRequest(BaseModel):
    text: str


class TextEmbeddingResponse(BaseModel):
    embedding: list[float]


@app.post("/process_document", response_model=DocumentResponse)
async def process_document(request: DocumentRequest):
    try:
        # Tokenize and generate embedding
        inputs = tokenizer(
            request.content, return_tensors="pt", truncation=True, max_length=512
        )
        with torch.no_grad():
            outputs = model(**inputs)

        # Use mean pooling to get document embedding
        embedding = outputs.last_hidden_state.mean(dim=1).squeeze().tolist()

        return DocumentResponse(status="success", embedding=embedding)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/get_embedding", response_model=TextEmbeddingResponse)
async def get_embedding(request: TextEmbeddingRequest):
    try:
        print(f"Received request: {request.text}")  # Add logging
        # Tokenize and generate embedding
        inputs = tokenizer(
            request.text, return_tensors="pt", truncation=True, max_length=512
        )
        with torch.no_grad():
            outputs = model(**inputs)

        # Use mean pooling to get text embedding
        embedding = outputs.last_hidden_state.mean(dim=1).squeeze().tolist()

        print(f"Generated embedding: {embedding[:5]}...")  # Log part of the embedding
        return TextEmbeddingResponse(embedding=embedding)
    except Exception as e:
        print(f"Error in get_embedding: {str(e)}")  # Log any errors
        raise HTTPException(status_code=500, detail=str(e))


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
    uvicorn.run(app, host="0.0.0.0", port=8000)
