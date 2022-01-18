const cvs = document.getElementById('game');
const ctx = cvs.getContext('2d');

const COL_COUNT = 4;
const CELL_SIZE = cvs.width / COL_COUNT;

let bgImage = null,
  retryIcon = null,
  moveAudio = null,
  gameOver = false,
  hoveredItem = null,
  retryBtnCoords = {};

let playField = [],
  coords = [],
  finalstate = [];

cvs.addEventListener('mousemove', (e) => {
  const clientX = e.offsetX;
  const clientY = e.offsetY;

  if (stillOnHovered(clientX, clientY)) {
    return;
  }

  hoveredItem = getHoveredItem(clientX, clientY);
});

cvs.addEventListener('mouseout', (_) => {
  hoveredItem = null;
});

cvs.addEventListener('click', (e) => {
  const clientX = e.offsetX;
  const clientY = e.offsetY;

  if (gameOver) {
    if (
      clientX > retryBtnCoords.x &&
      clientX < retryBtnCoords.x + 150 &&
      clientY > retryBtnCoords.y &&
      clientY < retryBtnCoords.y + 150
    ) {
      gameOver = false;
      moves = 0;
      time = 0;
      hoveredItem = null;

      moveAudio.play();

      playField = [];
      coords = [];
      gameWinResult = [];

      initPlayField();
    }
    return;
  }

  moveAudio.play();

  if (stillOnHovered(clientX, clientY)) {
    const emptyCell =
      (playField[hoveredItem.row]?.[hoveredItem.col + 1] === 0 && {
        row: hoveredItem.row,
        col: hoveredItem.col + 1,
      }) ||
      (playField[hoveredItem.row]?.[hoveredItem.col - 1] === 0 && {
        row: hoveredItem.row,
        col: hoveredItem.col - 1,
      }) ||
      (playField[hoveredItem.row - 1]?.[hoveredItem.col] === 0 && {
        row: hoveredItem.row - 1,
        col: hoveredItem.col,
      }) ||
      (playField[hoveredItem.row + 1]?.[hoveredItem.col] === 0 && {
        row: hoveredItem.row + 1,
        col: hoveredItem.col,
      });

    if (emptyCell) {
      const currentN = playField[hoveredItem.row][hoveredItem.col];
      playField[hoveredItem.row][hoveredItem.col] = 0;
      playField[emptyCell.row][emptyCell.col] = currentN;
      hoveredItem = null;

      moves++;
      movesBlock.innerHTML = `<h3>Moves: ${moves}<h3>`;

      gameOver = checkWin();
    }
  }
});

function getHoveredItem(clientX, clientY) {
  return coords.find((c) => {
    return (
      clientX > c.x &&
      clientX < c.x + CELL_SIZE &&
      clientY > c.y &&
      clientY < c.y + CELL_SIZE
    );
  });
}

function stillOnHovered(clientX, clientY) {
  return (
    hoveredItem &&
    clientX > hoveredItem.x &&
    clientX < hoveredItem.x + CELL_SIZE &&
    clientY > hoveredItem.y &&
    clientY < hoveredItem.y + CELL_SIZE
  );
}

function gameOverScreen() {
  ctx.fillStyle = 'white';
  (retryBtnCoords.x = (cvs.width - 150) / 2),
    (retryBtnCoords.y = (cvs.height - 150) / 2);
  ctx.fillRect(retryBtnCoords.x, retryBtnCoords.y, 150, 150);
  ctx.drawImage(
    loadedRetryIcon,
    (cvs.width - 100) / 2,
    (cvs.height - 90) / 2,
    100,
    90
  );
}

function loadImages(path) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      reject(e);
    };
  });
}

//load resourses (audio and images)
async function loadResourses() {
  const results = await Promise.all([
    loadImages('images/bg.png'),
    loadImages('images/retry.png'),
  ]);
  (bgImage = results[0]), (retryIcon = results[0]);
  newAudio = new Audio('audio/move.mp3');
}

function initPlayField() {
  const existedNumbers = [];
  const results = [];
  let counter = 1;

  for (let i = 0; i < COL_COUNT; i++) {
    const row = [],
      finalstateRow = [];
    for (let j = 0; j < COL_COUNT; j++) {
      while (row.length !== COL_COUNT) {
        const n = Math.floor(Math.random() * 16);
        if (!existedNumbers.includes(n)) {
          existedNumbers.push(n);
          row.push(n);
        }
      }
      coords.push({ row: i, col: j, x: j * CELL_SIZE, y: i * CELL_SIZE });
      finalstateRow.push(counter);
      counter++;
    }

    results.push(row);
    finalstate.push(finalstateRow);
  }
  finalstate[finalstate.length - 1][COL_COUNT - 1] = 0;
  return results;
}

function drawImage(imgObj, x, y, w, h) {
  if (w && h) {
    ctx.drawImage(imgObj, x, y, w, h);
  }
  ctx.drawImage(imgObj, x, y);
}

function drawPlayField() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  if (bgImage) {
    drawImage(bgImage, 0, 0);
  }
  if (gameOver) {
    // gameOverScreen();
  } else {
    for (let row = 0; row < playField.length; row++) {
      for (let col = 0; col < playField[row].length; col++) {
        const dx = col * CELL_SIZE;
        const dy = row * CELL_SIZE;

        if (playField[row][col]) {
          ctx.beginPath();

          if (hoveredItem && hoveredItem.x === dx && hoveredItem.y === dy) {
            ctx.fillStyle = 'yellow';
          } else {
            ctx.fillStyle = 'white';
          }

          ctx.rect(dx, dy, CELL_SIZE, CELL_SIZE);
          ctx.fill();

          ctx.strokeStyle = 'black';
          ctx.stroke();

          ctx.font = '50px monospace';
          ctx.fillStyle = 'black';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';

          const txt = playField[row][col];
          const measuredText = ctx.measureText(txt);
          const offset = CELL_SIZE - measuredText.width;

          ctx.fillText(
            playField[row][col],
            dx + offset / 2,
            dy + CELL_SIZE / 4
          );
        }
      }
    }
  }
  requestAnimationFrame(drawPlayField);
}

async function initGame() {
  await loadResourses();
  playField = initPlayField();
  drawPlayField();
}

initGame();
