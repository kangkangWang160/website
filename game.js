const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Kitten image (cuter)
const kittenImg = new Image();
// Source: Pixabay, free for commercial use
kittenImg.src = 'https://cdn.pixabay.com/photo/2017/11/09/21/41/cat-2934720_1280.png';

const GRAVITY = 0.35; // Weaker gravity
const FLAP = -10;     // Stronger flap
const PIPE_WIDTH = 60;
const PIPE_GAP = 220; // Bigger gap

let kitten = { x: 80, y: 300, w: 48, h: 48, velocity: 0 };
let pipes = [];
let score = 0;
let gameOver = false;

function resetGame() {
  kitten.y = 300;
  kitten.velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
}

function drawKitten() {
  // Draw the kitten image in a circle (face focus)
  ctx.save();
  ctx.beginPath();
  ctx.arc(kitten.x + kitten.w / 2, kitten.y + kitten.h / 2, kitten.w / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(kittenImg, kitten.x, kitten.y, kitten.w, kitten.h);
  ctx.restore();

  // Draw cute pink blush on cheeks
  ctx.beginPath();
  ctx.arc(kitten.x + 15, kitten.y + 38, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#ffb6c1';
  ctx.globalAlpha = 0.7;
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.beginPath();
  ctx.arc(kitten.x + 33, kitten.y + 38, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#ffb6c1';
  ctx.globalAlpha = 0.7;
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // Draw sparkly eyes
  ctx.beginPath();
  ctx.arc(kitten.x + 20, kitten.y + 22, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.shadowColor = '#fff';
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(kitten.x + 28, kitten.y + 22, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.shadowColor = '#fff';
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Draw a tiny pink nose
  ctx.beginPath();
  ctx.arc(kitten.x + 24, kitten.y + 30, 2, 0, Math.PI * 2);
  ctx.fillStyle = '#ff69b4';
  ctx.fill();

  // Draw a smiling mouth
  ctx.beginPath();
  ctx.arc(kitten.x + 24, kitten.y + 33, 5, Math.PI * 0.15, Math.PI * 0.85);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#e57373';
  ctx.stroke();
}

function drawPipes() {
  ctx.fillStyle = '#81d4fa';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, PIPE_WIDTH, canvas.height - pipe.bottom);
  });
}

function drawScore() {
  ctx.fillStyle = '#d81b60';
  ctx.font = '32px Comic Sans MS';
  ctx.fillText(score, 20, 50);
}

function updatePipes() {
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    const top = Math.random() * (canvas.height - PIPE_GAP - 100) + 50;
    pipes.push({
      x: canvas.width,
      top: top,
      bottom: top + PIPE_GAP
    });
  }
  pipes.forEach(pipe => {
    pipe.x -= 1.3; // Slower pipe speed
  });
  if (pipes.length && pipes[0].x + PIPE_WIDTH < 0) {
    pipes.shift();
    score++;
  }
}

function checkCollision() {
  if (kitten.y + kitten.h > canvas.height || kitten.y < 0) {
    return true;
  }
  for (let pipe of pipes) {
    if (
      kitten.x < pipe.x + PIPE_WIDTH &&
      kitten.x + kitten.w > pipe.x &&
      (kitten.y < pipe.top || kitten.y + kitten.h > pipe.bottom)
    ) {
      return true;
    }
  }
  return false;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawKitten();
  drawPipes();
  drawScore();

  if (!gameOver) {
    kitten.velocity += GRAVITY;
    kitten.y += kitten.velocity;
    updatePipes();
    if (checkCollision()) {
      gameOver = true;
    }
  } else {
    ctx.fillStyle = '#d81b60';
    ctx.font = '48px Comic Sans MS';
    ctx.fillText('Game Over', 80, 300);
    ctx.font = '24px Comic Sans MS';
    ctx.fillText('Press Space to Restart', 80, 350);
    if (score < 10) {
      ctx.font = '28px Comic Sans MS';
      ctx.fillStyle = '#e57373';
      ctx.fillText('You are trash at the game!', 30, 400);
    }
  }
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    if (gameOver) {
      resetGame();
    } else {
      kitten.velocity = FLAP;
    }
  }
});

kittenImg.onload = () => {
  gameLoop();
};
