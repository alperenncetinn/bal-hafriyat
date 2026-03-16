const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

// 192 total frames as required
const frameCount = 192;

// Function to format frame numbers to 3 digits. e.g. ezgif-frame-001.jpg
const currentFrame = index => (
    `./storytelling_photos/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
)

// Preload images into an array for instantaneous rendering
const images = [];

const preloadImages = () => {
    for (let i = 1; i <= frameCount; i++) {
        const image = new Image();
        image.src = currentFrame(i);
        images.push(image);
    }
};

const img = new Image();
img.src = currentFrame(1);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Setup image and canvas to fill area nicely
// (drawImageProp logic remains)
function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
    if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
    }
    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    let iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r,
        nh = ih * r,
        cx, cy, cw, ch, ar = 1;

    if (nw < w) ar = w / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
    nw *= ar;
    nh *= ar;

    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

const updateImage = index => {
    // Use the preloaded image directly! index is 1-based, array is 0-based
    if (images[index - 1]) {
        drawImageProp(context, images[index - 1], 0, 0, canvas.width, canvas.height);
    }
}

// Window resize handler for canvas to stay responsive
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Redraw current frame
    const scrollTop = document.documentElement.scrollTop;
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = maxScrollTop === 0 ? 0 : scrollTop / maxScrollTop;
    const frameIndex = Math.min(frameCount, Math.max(1, Math.ceil(scrollFraction * frameCount)));
    updateImage(frameIndex);
}

window.addEventListener('resize', resize);
resize();


// Scroll Event Listener to update video frame
window.addEventListener('scroll', () => {
    // Find out how far we scrolled down
    const scrollTop = document.documentElement.scrollTop;
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScrollTop;
    const frameIndex = Math.min(
        frameCount,
        Math.ceil(scrollFraction * frameCount)
    );

    // Pre-bound the frame frame
    const frameToDraw = frameIndex < 1 ? 1 : frameIndex;

    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => updateImage(frameToDraw));

    // Intersect for text elements
    revealPanels();
});

preloadImages();

// Hide loader once first image loaded
img.onload = () => {
    document.getElementById('loading').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 500);
    drawImageProp(context, img, 0, 0, canvas.width, canvas.height);

    // Show first panel
    setTimeout(revealPanels, 100);
}

// Intersection Observer equivalent manual logic for panel fade-ins
function revealPanels() {
    const panels = document.querySelectorAll('.glass-panel');
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    panels.forEach(panel => {
        const elementTop = panel.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            panel.classList.add('visible');
        } else {
            // Optional: remove visible class if they scroll back up
            // panel.classList.remove('visible'); 
        }
    });
}
