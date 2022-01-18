const cvs = document.getElementById('game');
const ctx = cvs.getContext('2d');

let bgImage = null,
  retryIcon = null,
  moveAudio = null;

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

async function loadResourses() {
  //load resourses (audio and images)
  const results = await Promise.all([
    loadImages('images/bg.png'),
    loadImages('images/retry.png'),
  ]);
  (bgImage = results[0]), (retryIcon = results[0]);
  newAudio = new Audio('audio/move.mp3');
}

async function initGame() {}

initGame();
