from fastapi import FastAPI
import uvicorn

app = FastAPI()


@app.get("/process_documents/{sag_id}")
async def process_documents(sag_id: int):
    # Implement document processing logic here
    return {"status": "success", "sag_id": sag_id}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
