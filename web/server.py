from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path

app = FastAPI()

# 📁 Carpeta donde guardar archivos
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# 🌍 Permitir que tu HTML llame al servidor
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # si quieres puedes limitarlo a tu IP de tailscale
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload(files: list[UploadFile] = File(...)):
    saved = []

    for file in files:
        filepath = UPLOAD_DIR / file.filename
        with open(filepath, "wb") as f:
            f.write(await file.read())
        saved.append(file.filename)

    return {"uploaded": saved}
