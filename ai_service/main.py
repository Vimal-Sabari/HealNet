from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
import uvicorn
import os
import shutil
import tempfile
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import whisper

load_dotenv()

app = FastAPI()

# Load Models
print("Loading semantic model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("Loading Whisper model...")
whisper_model = whisper.load_model("base")

# In-memory FAISS Index
dimension = 384  # Output dimension of all-MiniLM-L6-v2
index = faiss.IndexFlatL2(dimension)
id_map = {}  # Map FAISS ID to MongoDB Experience ID
next_id = 0

class TextInput(BaseModel):
    text: str
    experience_id: str | None = None

class SearchInput(BaseModel):
    text: str
    top_k: int = 5

@app.get("/")
def read_root():
    return {"message": "HealNet AI Service Running"}

@app.post("/index")
def add_to_index(input: TextInput):
    global next_id
    if not input.experience_id:
        raise HTTPException(status_code=400, detail="Experience ID required for indexing")
    
    embedding = model.encode([input.text])
    index.add(np.array(embedding).astype('float32'))
    id_map[next_id] = input.experience_id
    next_id += 1
    return {"message": "Indexed successfully", "faiss_id": next_id - 1}

@app.post("/search")
def search_similar(input: SearchInput):
    if index.ntotal == 0:
        return {"results": []}
        
    query_vector = model.encode([input.text])
    D, I = index.search(np.array(query_vector).astype('float32'), input.top_k)
    
    results = []
    for i in range(len(I[0])):
        idx = I[0][i]
        if idx != -1 and idx in id_map:
            results.append({
                "experience_id": id_map[idx],
                "score": float(D[0][i])
            })
            
    return {"results": results}

@app.post("/summarize")
def summarize_symptoms(input: TextInput):
    mock_summary = f"Based on the symptoms '{input.text}', similar cases often involve consultation with a specialist. Common treatments include rest and hydration. Please consult a doctor for accurate diagnosis."
    return {"summary": mock_summary}

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        # Save temporary file
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name

        # Transcribe
        result = whisper_model.transcribe(tmp_path)
        
        # Cleanup
        os.remove(tmp_path)
        
        return {"text": result["text"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
