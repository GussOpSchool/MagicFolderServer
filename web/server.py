from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
from pathlib import Path

app = FastAPI()

# 📁 Carpeta donde guardar archivos
BASE_DIR = Path(__file__).parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# 🌍 Permitir que tu HTML llame al servidor
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # si quieres puedes limitarlo a tu IP de tailscale
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📂 Servir los archivos subidos para descarga directa
@app.get("/uploads/{filename}")
async def download_file(filename: str):
    file_path = UPLOAD_DIR / filename
    if file_path.exists():
        return FileResponse(path=file_path, filename=filename, media_type='application/octet-stream')
    return {"error": "File not found"}

@app.post("/upload")
async def upload(files: list[UploadFile] = File(...)):
    saved = []

    for file in files:
        filepath = UPLOAD_DIR / file.filename
        with open(filepath, "wb") as f:
            f.write(await file.read())
        saved.append(file.filename)

    return {"uploaded": saved}

@app.get("/files")
async def list_files():
    # Listar archivos en la carpeta de uploads
    files = []
    if UPLOAD_DIR.exists():
        files = [f.name for f in UPLOAD_DIR.iterdir() if f.is_file()]
    return {"files": files}
