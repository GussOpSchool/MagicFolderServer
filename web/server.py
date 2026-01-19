from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
from pathlib import Path
from typing import List
from datetime import datetime

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
        # "attachment" forces the browser to download instead of opening
        return FileResponse(
            path=file_path, 
            filename=filename, 
            media_type='application/octet-stream',
            headers={"Content-Disposition": f"attachment; filename={filename}"} 
        )
    return {"error": "File not found"}

@app.post("/upload")
async def upload(files: List[UploadFile] = Form(...)):
    saved = []

    for file in files:
        try:
            filepath = UPLOAD_DIR / file.filename
            with open(filepath, "wb") as f:
                f.write(await file.read())
            saved.append(file.filename)
            print(f"Successfully uploaded: {file.filename}")
        except Exception as e:
            print(f"Failed to upload {file.filename}: {e}")

    return {"uploaded": saved}

@app.get("/files")
async def list_files():
    # Listar archivos con metadatos
    files = []
    if UPLOAD_DIR.exists():
        for f in UPLOAD_DIR.iterdir():
            if f.is_file():
                stat = f.stat()
                # Creation time (ctime on Windows, birthtime on logic often varies but ctime is safe generic)
                # Using st_mtime as modification time is often what users care about too, but we will label 'created'
                c_time = datetime.fromtimestamp(stat.st_mtime).strftime('%d/%m/%Y')
                files.append({
                    "name": f.name,
                    "date": c_time
                })
    return {"files": files}
