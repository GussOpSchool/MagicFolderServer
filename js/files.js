async function loadFiles() {
    const listContainer = document.querySelector("section"); // Container of folders
    const h2 = listContainer.querySelector("h2"); // "Root Folder" heading

    // Clear existing static articles (Image 1, 2, 3...)
    // Keeping h2
    const articles = listContainer.querySelectorAll("article.foldersect");
    articles.forEach(article => article.remove());

    try {
        const response = await fetch("http://127.0.0.1:8000/files");
        const data = await response.json();

        if (data.files && data.files.length > 0) {
            data.files.forEach(fileObj => {
                const article = document.createElement("article");
                article.className = "foldersect";

                // Use date from server
                const dateStr = fileObj.date || "Unknown Date";
                const filename = fileObj.name;

                // Link to download/view file
                const fileUrl = `http://127.0.0.1:8000/uploads/${filename}`;

                article.innerHTML = `
                    <a class="button" href="${fileUrl}" download="${filename}">${filename}</a>
                    <div>
                        <label>Fecha de Creación:</label>
                        <p id="date">${dateStr}</p>
                    </div>
                `;

                listContainer.appendChild(article);
            });
        } else {
            const msg = document.createElement("p");
            msg.textContent = "No files found.";
            listContainer.appendChild(msg);
        }

    } catch (e) {
        console.error("Failed to load files:", e);
    }
}

document.addEventListener("DOMContentLoaded", loadFiles);
