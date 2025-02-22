let backgroundImage = null;
let personImage = null;

const backgroundCanvas = document.getElementById('backgroundCanvas');
const backgroundCtx = backgroundCanvas.getContext('2d');

const personCanvas = document.getElementById('personCanvas');
const personCtx = personCanvas.getContext('2d');

const backgroundDropArea = document.getElementById('backgroundDropArea');
const personDropArea = document.getElementById('personDropArea');

// 背景画像用のドロップエリアの設定
backgroundDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();  // デフォルトのブラウザ動作を無効化
    backgroundDropArea.style.borderColor = '#000';
});

backgroundDropArea.addEventListener('dragleave', () => {
    backgroundDropArea.style.borderColor = '#ccc';
});

backgroundDropArea.addEventListener('drop', async (e) => {
    e.preventDefault();  // デフォルトのブラウザ動作を無効化
    backgroundDropArea.style.borderColor = '#ccc';
    const file = e.dataTransfer.files[0];
    backgroundImage = await loadImageFromFile(file);
    drawBackground();
});

// 人物画像用のドロップエリアの設定
personDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();  // デフォルトのブラウザ動作を無効化
    personDropArea.style.borderColor = '#000';
});

personDropArea.addEventListener('dragleave', () => {
    personDropArea.style.borderColor = '#ccc';
});

personDropArea.addEventListener('drop', async (e) => {
    e.preventDefault();  // デフォルトのブラウザ動作を無効化
    personDropArea.style.borderColor = '#ccc';

    console.log('人物画像がドロップされました');  // デバッグ用ログ

    const file = e.dataTransfer.files[0];
    personImage = await loadImageFromFile(file);

    // 画像が正しく読み込まれたか確認する
    if (personImage) {
        console.log('人物画像が正しく読み込まれました:', personImage);
    } else {
        console.error('人物画像の読み込みに失敗しました');
        return;
    }

    try {
        await removeBackground(personImage);
        console.log('背景除去が完了しました');
    } catch (error) {
        console.error('背景除去に失敗しました:', error);
    }
});

function loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const img = new Image();
        reader.onload = function (e) {
            img.src = e.target.result;
            img.onload = () => resolve(img);
            img.onerror = () => reject('画像の読み込みに失敗しました');
        };
        reader.readAsDataURL(file);
    });
}

function drawBackground() {
    backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    backgroundCtx.drawImage(backgroundImage, 0, 0, backgroundCanvas.width, backgroundCanvas.height);
}

async function removeBackground(image) {
    try {
        const result = await BackgroundRemover.removeBackgroundFromImage(image);
        personCtx.clearRect(0, 0, personCanvas.width, personCanvas.height);
        personCtx.drawImage(result, 0, 0, personCanvas.width, personCanvas.height);
        makeImageDraggable(result);
    } catch (error) {
        console.error('背景除去中にエラーが発生しました:', error);
    }
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
