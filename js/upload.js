document.addEventListener("DOMContentLoaded", () => {
    const uploader = document.getElementById("uploader");
    const container = document.getElementById("element");
    const uploadBtn = document.getElementById("upload");

    let filesToUpload = [];

    // ---- OPEN FILE PICKER ----
    uploader.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = true;
        input.onchange = (e) => handleFiles(e.target.files);
        input.click();
    });

    // ---- DRAG & DROP ----
    uploader.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploader.style.backgroundColor = "#1b6fa0";
    });

    uploader.addEventListener("dragleave", () => {
        uploader.style.backgroundColor = "#2380be";
    });

    uploader.addEventListener("drop", (e) => {
        e.preventDefault();
        uploader.style.backgroundColor = "#2380be";
        handleFiles(e.dataTransfer.files);
    });

    // ---- HANDLE FILES ----
    function handleFiles(files) {
        for (const file of files) {
            filesToUpload.push(file);
            addFilePreview(file);
        }
    }

    // ---- CREATE PREVIEW ARTICLE ----
    function addFilePreview(file) {
        const ext = file.name.split(".").pop().toUpperCase();

        const article = document.createElement("article");
        article.classList.add("fileup");

        const img = document.createElement("img");
        img.classList.add("filesym");

        if (file.type.startsWith("image/")) {
            img.src = URL.createObjectURL(file);
        } else {
            img.src = "https://placehold.co/200";
        }

        const title = document.createElement("h2");
        title.textContent = "File:";

        const typeSpan = document.createElement("span");
        typeSpan.textContent = ext;

        article.appendChild(img);
        article.appendChild(title);
        article.appendChild(typeSpan);

        container.appendChild(article);
    }

    // ---- SEND FILES TO BACKEND ----
    uploadBtn.addEventListener("click", () => {
        if (filesToUpload.length === 0) {
            alert("No files selected.");
            return;
        }

        const form = new FormData();
        for (const file of filesToUpload) {
            form.append("files", file);
        }

        fetch("http://<tu-ip-tailscale>:5656/upload", {
            method: "POST",
            body: form
        })
        .then(res => res.text())
        .then(text => alert(text))
        .catch(err => alert("Upload failed: " + err));
    });
});
