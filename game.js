// Ping Pong Game Only
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const menuScreen = document.getElementById('menuScreen');
const playPong = document.getElementById('playPong');
const pongGameOver = document.getElementById('pongGameOver');
const pongRestartBtn = document.getElementById('pongRestartBtn');
const pongReturnBtn = document.getElementById('pongReturnBtn');
const difficultyBtns = document.querySelectorAll('.difficultyBtn');
const bestScoreDiv = document.getElementById('bestScore');
const extraEasyMsg = document.getElementById('extraEasyMsg');
const extraEasyContinueBtn = document.getElementById('extraEasyContinueBtn');
const extraEasyEndBtn = document.getElementById('extraEasyEndBtn');

let selectedDifficulty = 'normal';
let pong, currentGame = null;
let ballSpeed = 3;
let bestScore = localStorage.getItem('pongBestScore') ? parseInt(localStorage.getItem('pongBestScore')) : 0;
let isExtraEasy = false;

difficultyBtns.forEach(btn => {
  btn.onclick = () => {
    difficultyBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedDifficulty = btn.getAttribute('data-speed');
    playPong.style.display = 'inline-block';
  };
});

playPong.onclick = () => {
  menuScreen.style.display = 'none';
  canvas.style.display = 'block';
  isExtraEasy = (selectedDifficulty === 'extraeasy');
  startPong();
};

function startPong() {
  currentGame = 'pong';
  ballSpeed = (selectedDifficulty === 'hard') ? 6 : (selectedDifficulty === 'extraeasy' ? 3.5 : 3);
  pong = {
    player: { x: 170, y: 570, w: 60, h: 12, dx: 0 },
    ball: { x: 200, y: 300, r: 10, dx: ballSpeed, dy: -ballSpeed },
    ai: { x: 170, y: 18, w: 60, h: 12 },
    score: 0,
    running: true
  };
  pongGameOver.style.display = 'none';
  extraEasyMsg.style.display = 'none';
  requestAnimationFrame(pongLoop);
}
function drawPong() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Player paddle
  ctx.fillStyle = '#66ccff';
  ctx.fillRect(pong.player.x, pong.player.y, pong.player.w, pong.player.h);
  // AI paddle
  ctx.fillStyle = '#ffb3b3';
  ctx.fillRect(pong.ai.x, pong.ai.y, pong.ai.w, pong.ai.h);
  // Ball
  ctx.beginPath();
  ctx.arc(pong.ball.x, pong.ball.y, pong.ball.r, 0, Math.PI * 2);
  ctx.fillStyle = '#444';
  ctx.fill();
  // Score
  ctx.fillStyle = '#444';
  ctx.font = '24px Segoe UI, Arial';
  ctx.fillText('Score: ' + pong.score, 10, 40);
}
function pongLoop() {
  if (currentGame !== 'pong') return;
  updatePong();
  drawPong();
  if (pong.running) requestAnimationFrame(pongLoop);
}
function updatePong() {
  // Move player
  pong.player.x += pong.player.dx;
  if (pong.player.x < 0) pong.player.x = 0;
  if (pong.player.x + pong.player.w > canvas.width) pong.player.x = canvas.width - pong.player.w;
  // Move AI
  let aiSpeed = (selectedDifficulty === 'hard') ? 6 : 3;
  if (pong.ball.x < pong.ai.x + pong.ai.w/2) pong.ai.x -= aiSpeed;
  else pong.ai.x += aiSpeed;
  if (pong.ai.x < 0) pong.ai.x = 0;
  if (pong.ai.x + pong.ai.w > canvas.width) pong.ai.x = canvas.width - pong.ai.w;
  // Move ball
  pong.ball.x += pong.ball.dx;
  pong.ball.y += pong.ball.dy;
  // Wall collision
  if (pong.ball.x - pong.ball.r < 0 || pong.ball.x + pong.ball.r > canvas.width) pong.ball.dx *= -1;
  // Paddle collision
  if (
    pong.ball.y + pong.ball.r > pong.player.y &&
    pong.ball.x > pong.player.x && pong.ball.x < pong.player.x + pong.player.w
  ) {
    pong.ball.dy *= -1;
    pong.ball.y = pong.player.y - pong.ball.r;
    pong.score++;
  }
  if (
    pong.ball.y - pong.ball.r < pong.ai.y + pong.ai.h &&
    pong.ball.x > pong.ai.x && pong.ball.x < pong.ai.x + pong.ai.w
  ) {
    pong.ball.dy *= -1;
    pong.ball.y = pong.ai.y + pong.ai.h + pong.ball.r;
  }
  // Game over or extra easy logic
  if (pong.ball.y - pong.ball.r < 0 || pong.ball.y + pong.ball.r > canvas.height) {
    if (isExtraEasy) {
      pong.running = false;
      extraEasyMsg.style.display = 'block';
    } else {
      pong.running = false;
      if (pong.score > bestScore) {
        bestScore = pong.score;
        localStorage.setItem('pongBestScore', bestScore);
      }
      bestScoreDiv.textContent = `Best High Score: ${bestScore}`;
      pongGameOver.style.display = 'block';
    }
  }
}
// Controls for Pong
canvas.addEventListener('mousemove', e => {
  if (currentGame === 'pong') {
    const rect = canvas.getBoundingClientRect();
    pong.player.x = e.clientX - rect.left - pong.player.w/2;
  }
});
document.addEventListener('keydown', e => {
  if (currentGame === 'pong') {
    if (e.code === 'ArrowLeft') pong.player.dx = -6;
    if (e.code === 'ArrowRight') pong.player.dx = 6;
  }
});
document.addEventListener('keyup', e => {
  if (currentGame === 'pong') {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') pong.player.dx = 0;
  }
});
pongRestartBtn.addEventListener('click', () => {
  startPong();
});
pongReturnBtn.addEventListener('click', () => {
  // Return to menu
  menuScreen.style.display = 'block';
  canvas.style.display = 'none';
  pongGameOver.style.display = 'none';
  currentGame = null;
});
extraEasyContinueBtn.addEventListener('click', () => {
  // Reset ball and continue
  pong.ball.x = 200;
  pong.ball.y = 300;
  pong.ball.dx = (selectedDifficulty === 'extraeasy' ? 3.5 : ballSpeed);
  pong.ball.dy = (selectedDifficulty === 'extraeasy' ? -3.5 : -ballSpeed);
  pong.running = true;
  extraEasyMsg.style.display = 'none';
  requestAnimationFrame(pongLoop);
});
extraEasyEndBtn.addEventListener('click', () => {
  if (pong.score > bestScore) {
    bestScore = pong.score;
    localStorage.setItem('pongBestScore', bestScore);
  }
  bestScoreDiv.textContent = `Best High Score: ${bestScore}`;
  extraEasyMsg.style.display = 'none';
  pongGameOver.style.display = 'block';
});
// Instructions modal logic
const instructionsBtn = document.getElementById('instructionsBtn');
const instructionsModal = document.getElementById('instructionsModal');
const closeInstructions = document.getElementById('closeInstructions');

instructionsBtn.onclick = () => {
  instructionsModal.style.display = 'block';
};
closeInstructions.onclick = () => {
  instructionsModal.style.display = 'none';
};
window.onclick = function(event) {
  if (event.target === instructionsModal) {
    instructionsModal.style.display = 'none';
  }
};
