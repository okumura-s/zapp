let backgroundImage = null;
let personImage = null;

const backgroundCanvas = document.getElementById('backgroundCanvas');
const backgroundCtx = backgroundCanvas.getContext('2d');

const personCanvas = document.getElementById('personCanvas');
const personCtx = personCanvas.getContext('2d');

const dropArea = document.getElementById('dropArea');

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.style.borderColor = '#000';
});

dropArea.addEventListener('dragleave', () => {
    dropArea.style.borderColor = '#ccc';
});

dropArea.addEventListener('drop', async (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;

    if (files.length > 0) {
        const file = files[0];
        const img = await loadImageFromFile(file);

        if (!backgroundImage) {
            backgroundImage = img;
            drawBackground();
        } else {
            personImage = img;
            await removeBackground(personImage);
        }
    }
    dropArea.style.borderColor = '#ccc';
});

function loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const img = new Image();
        reader.onload = function (e) {
            img.src = e.target.result;
            img.onload = () => resolve(img);
        };
        reader.readAsDataURL(file);
    });
}

function drawBackground() {
    backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    backgroundCtx.drawImage(backgroundImage, 0, 0, backgroundCanvas.width, backgroundCanvas.height);
}

async function removeBackground(image) {
    const result = await BackgroundRemover.removeBackgroundFromImage(image);
    personCtx.clearRect(0, 0, personCanvas.width, personCanvas.height);
    personCtx.drawImage(result, 0, 0, personCanvas.width, personCanvas.height);
    makeImageDraggable(result);
}

function makeImageDraggable(image) {
    let isDragging = false;
    let startX, startY;

    personCanvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.offsetX;
        startY = e.offsetY;
    });

    personCanvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const dx = e.offsetX - startX;
            const dy = e.offsetY - startY;
            startX = e.offsetX;
            startY = e.offsetY;
            personCtx.clearRect(0, 0, personCanvas.width, personCanvas.height);
            personCtx.drawImage(image, dx, dy, personCanvas.width, personCanvas.height);
        }
    });

    personCanvas.addEventListener('mouseup', () => {
        isDragging = false;
    });

    personCanvas.addEventListener('mouseleave', () => {
        isDragging = false;
    });
}
