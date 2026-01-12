function init() {
    const uploader = document.getElementById("uploader");
    const uploadBtn = document.getElementById("upload");
    const fileSym = document.querySelector(".filesym");
    const nameDisplay = document.getElementById("name");
    const fileInfoSection = document.querySelector(".fileup");

    // Hide file info initially
    if (fileInfoSection) {
        fileInfoSection.style.display = "none";
    }

    if (uploader) {
        uploader.addEventListener("change", function () {
            const file = this.files[0];
            if (file) {
                // Show file info section
                if (fileInfoSection) {
                    fileInfoSection.style.display = "block"; // Assuming flex, or 'block' depending on CSS. Using flex as per likely layout.
                }

                // Update Name
                if (nameDisplay) {
                    const extension = file.name.split('.').pop().toUpperCase();
                    nameDisplay.textContent = extension;
                }

                // Preview Image
                if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        // Apply 200x200 crop style and source
                        fileSym.src = e.target.result;
                        fileSym.style.objectFit = "cover";
                        fileSym.style.width = "200px";
                        fileSym.style.height = "200px";
                    };
                    reader.readAsDataURL(file);
                } else {
                    // Reset or set generic icon if not image
                    // Keeping custom logic simple for now
                    fileSym.src = "https://placehold.co/200/FFFFFF/1e2c3c?text=File";
                }
            }
        });
    }

    if (uploadBtn) {
        uploadBtn.addEventListener("click", function (e) {
            e.preventDefault(); // Prevent form submission
            const file = uploader.files[0];
            if (!file) {
                alert("Please select a file first.");
                return;
            }

            const formData = new FormData();
            formData.append("files", file);

            // Use port 5501
            fetch("http://127.0.0.1:5501/upload", {
                method: "POST",
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    alert("Upload successful!");
                    console.log(data);
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("Upload failed.");
                });
        });
    }
}

document.addEventListener("DOMContentLoaded", init);
