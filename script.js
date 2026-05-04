let images = document.querySelectorAll(".gallery img");
let currentIndex = 0;

function openImage(img) {
    const preview = document.getElementById("preview");
    const previewImg = document.getElementById("preview-img");

    preview.style.display = "flex";
    previewImg.src = img.src;

    // store index
    images.forEach((image, index) => {
        if (image === img) {
            currentIndex = index;
        }
    });
}

function closeImage() {
    document.getElementById("preview").style.display = "none";
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    document.getElementById("preview-img").src = images[currentIndex].src;
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    document.getElementById("preview-img").src = images[currentIndex].src;
}

// Keyboard support
document.addEventListener("keydown", function(e) {
    const preview = document.getElementById("preview");

    if (preview.style.display === "flex") {
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "Escape") closeImage();
    }
});