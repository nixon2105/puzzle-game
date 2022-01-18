const cvs = document.getElementById('game');
const ctx = cvs.getContext('2d');

const COL_COUNT = 4;
const CELL_SIZE = cvs.width / COL_COUNT;

let bgImage = null,
  retryIcon = null,
  moveAudio = null;

let playField = [];

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

// function initPlayField() {
//   const existedNumbers = [],
//     result = [];
//   for (let row = 0; row < COL_COUNT; row++) {
//     const row = [];
//     for (let col = 0; col < COL_COUNT; col++) {
//       while (row.length !== COL_COUNT) {
//         const randomN = Math.floor(Math.random() * COL_COUNT ** 2);
//         if (existed.includes(randomN)) {
//           row.push(randomN);
//         }
//       }
//     }
//     result.push(row);
//   }
//   return result;
// }

function initPlayField() {
  const existedNumbers = [];
  const results = [];

  for (let i = 0; i < COL_COUNT; i++) {
    const row = [],
      winRow = [];
    for (let j = 0; j < COL_COUNT; j++) {
      while (row.length !== COL_COUNT) {
        const n = Math.floor(Math.random() * 16);
        if (!existedNumbers.includes(n)) {
          existedNumbers.push(n);
          row.push(n);
        }
      }
    }

    results.push(row);
  }

  return results;
}

async function initGame() {
  await loadResourses();
  playField = initPlayField();
  console.log(playField);
}

initGame();
