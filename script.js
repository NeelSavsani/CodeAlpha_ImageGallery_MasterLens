let images = [];
let currentIndex = 0;
let isAnimating = false;

const gallery = document.querySelector(".gallery");

// 🔑 YOUR API KEY
const PEXELS_API_KEY = "YOUR_API_KEY_HERE";

// ELEMENTS
const preview = document.getElementById("preview");
const img = document.getElementById("preview-img");
const zoomIcon = document.getElementById("zoom-icon");

// ZOOM STATE
let scale = 1;
let posX = 0;
let posY = 0;
let zoomed = false;

// ================= LOAD IMAGES =================
async function loadImages() {
    gallery.innerHTML = "Loading images...";

    try {
        let allImages = [];

        for (let i = 1; i <= 5; i++) {
            const res = await fetch(`https://api.pexels.com/v1/curated?page=${i}&per_page=80`, {
                headers: { Authorization: PEXELS_API_KEY }
            });

            if (!res.ok) throw new Error("Pexels failed");

            const data = await res.json();

            allImages = allImages.concat(
                data.photos.map(p => p.src.large)
            );
        }

        images = allImages
            .sort(() => Math.random() - 0.5)
            .slice(0, 400);

        renderGallery();

    } catch {
        console.warn("Fallback → Picsum");

        let allImages = [];

        for (let i = 0; i < 5; i++) {
            let randomPage = Math.floor(Math.random() * 50) + 1;

            const res = await fetch(`https://picsum.photos/v2/list?page=${randomPage}&limit=100`);
            const data = await res.json();

            allImages = allImages.concat(
                data.map(img => img.download_url)
            );
        }

        images = allImages
            .sort(() => Math.random() - 0.5)
            .slice(0, 400);

        renderGallery();
    }
}

// ================= RENDER =================
function renderGallery() {
    gallery.innerHTML = "";

    images.forEach((url, index) => {
        const imgEl = document.createElement("img");
        imgEl.src = url;
        imgEl.loading = "lazy";

        imgEl.addEventListener("click", () => openImage(index));

        gallery.appendChild(imgEl);
    });
}

// ================= OPEN / CLOSE =================
function openImage(index) {
    preview.style.display = "flex";
    currentIndex = index;

    img.src = images[currentIndex];
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
        img.src = images[currentIndex];
        resetZoom();
        img.style.opacity = 1;

        setTimeout(() => {
            isAnimating = false;
        }, 200);

    }, 150);
}

// ================= KEYBOARD =================
document.addEventListener("keydown", (e) => {
    if (preview.style.display === "flex") {
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "Escape") closeImage();
    }
});

// ================= ZOOM =================
function toggleZoom() {
    if (!zoomed) {
        scale = 2;
        zoomed = true;
        zoomIcon.classList.replace("fa-magnifying-glass-plus", "fa-magnifying-glass-minus");
    } else {
        resetZoom();
    }

    updateTransform();
}

function updateTransform() {
    const maxOffset = 300;

    posX = Math.max(Math.min(posX, maxOffset), -maxOffset);
    posY = Math.max(Math.min(posY, maxOffset), -maxOffset);

    img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
}

function resetZoom() {
    scale = 1;
    posX = 0;
    posY = 0;
    zoomed = false;

    zoomIcon.classList.replace("fa-magnifying-glass-minus", "fa-magnifying-glass-plus");
    updateTransform();
}

// ================= DESKTOP DRAG =================
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

// ================= MOBILE TOUCH =================
let touchStartX = 0;
let touchStartY = 0;

// TOUCH START
img.addEventListener("touchstart", (e) => {
    if (zoomed) {
        // PAN MODE
        isDragging = true;
        startX = e.touches[0].clientX - posX;
        startY = e.touches[0].clientY - posY;
    } else {
        // SWIPE MODE
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }
});

// TOUCH MOVE
img.addEventListener("touchmove", (e) => {
    if (!zoomed || !isDragging) return;

    posX = e.touches[0].clientX - startX;
    posY = e.touches[0].clientY - startY;

    updateTransform();
});

// TOUCH END
img.addEventListener("touchend", (e) => {
    if (zoomed) {
        isDragging = false;
        return;
    }

    let touchEndX = e.changedTouches[0].clientX;
    let diffX = touchStartX - touchEndX;

    if (diffX > 50) nextImage();
    if (diffX < -50) prevImage();
});

// ================= AUTO LOAD =================
loadImages();