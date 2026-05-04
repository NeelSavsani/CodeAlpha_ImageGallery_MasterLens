let images = document.querySelectorAll(".gallery img");
let currentIndex = 0;
let isAnimating = false;

// ELEMENTS
const preview = document.getElementById("preview");
const img = document.getElementById("preview-img");
const zoomIcon = document.getElementById("zoom-icon");

// ZOOM STATE
let scale = 1;
let posX = 0;
let posY = 0;
let zoomed = false;

// ================= OPEN / CLOSE =================
function openImage(imgEl) {
    preview.style.display = "flex";
    img.src = imgEl.src;

    currentIndex = Array.from(images).indexOf(imgEl);
    resetZoom();
}

function closeImage() {
    preview.style.display = "none";
    isDragging = false;
    img.style.cursor = "grab";
}

// ================= NAVIGATION =================
function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    changeImage();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    changeImage();
}

function changeImage() {
    if (isAnimating) return;
    isAnimating = true;

    img.style.opacity = 0;

    setTimeout(() => {
        img.src = images[currentIndex].src;
        resetZoom();
        img.style.opacity = 1;

        setTimeout(() => {
            isAnimating = false;
        }, 200);

    }, 150);
}

// ================= KEYBOARD =================
document.addEventListener("keydown", function(e) {
    if (preview.style.display === "flex") {
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "Escape") closeImage();
    }
});

// ================= ZOOM BUTTON =================
function toggleZoom() {
    if (!zoomed) {
        scale = 2;
        zoomed = true;

        zoomIcon.classList.remove("fa-magnifying-glass-plus");
        zoomIcon.classList.add("fa-magnifying-glass-minus");
    } else {
        resetZoom();
    }

    updateTransform();
}

// ================= TRANSFORM =================
function updateTransform() {
    const maxOffset = 300;

    posX = Math.max(Math.min(posX, maxOffset), -maxOffset);
    posY = Math.max(Math.min(posY, maxOffset), -maxOffset);

    img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
}

// ================= RESET =================
function resetZoom() {
    scale = 1;
    posX = 0;
    posY = 0;
    zoomed = false;

    zoomIcon.classList.remove("fa-magnifying-glass-minus");
    zoomIcon.classList.add("fa-magnifying-glass-plus");

    updateTransform();
}

// ================= DRAG TO PAN =================
let isDragging = false;
let startX = 0;
let startY = 0;

img.addEventListener("mousedown", (e) => {
    if (!zoomed) return;

    e.preventDefault();
    isDragging = true;

    startX = e.clientX - posX;
    startY = e.clientY - posY;

    img.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    posX = e.clientX - startX;
    posY = e.clientY - startY;

    updateTransform();
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    img.style.cursor = "grab";
});