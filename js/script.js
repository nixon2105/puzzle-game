const cvs = document.getElementById('game');
const ctx = cvs.getContext('2d');

const COL_COUNT = 4;
const CELL_SIZE = cvs.width / COL_COUNT;

let bgImage = null,
  retryIcon = null,
  moveAudio = null;

let playField = [],
  coords = [],
  finalstate = [];

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

function draw() {}

async function initGame() {
  await loadResourses();
  playField = initPlayField();
  console.log(playField, coords, finalstate);
}

initGame();
