function openImage(img) {
    const preview = document.getElementById("preview");
    const previewImg = document.getElementById("preview-img");

    preview.style.display = "flex";
    previewImg.src = img.src;
}

function closeImage() {
    document.getElementById("preview").style.display = "none";
}

// ESC key support
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        closeImage();
    }
});