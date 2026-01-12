async function loadFiles() {
    const listContainer = document.querySelector("section"); // Container of folders
    const h2 = listContainer.querySelector("h2"); // "Root Folder" heading

    // Clear existing static articles (Image 1, 2, 3...)
    // Keeping h2
    const articles = listContainer.querySelectorAll("article.foldersect");
    articles.forEach(article => article.remove());

    try {
        const response = await fetch("http://127.0.0.1:5501/files");
        const data = await response.json();

        if (data.files && data.files.length > 0) {
            data.files.forEach(filename => {
                const article = document.createElement("article");
                article.className = "foldersect";

                // Using generic date as requested
                const dateStr = "xx/xx/2026";

                // Link to download/view file
                const fileUrl = `http://127.0.0.1:5501/uploads/${filename}`;

                article.innerHTML = `
                    <a class="button" href="${fileUrl}" target="_blank">${filename}</a>
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
