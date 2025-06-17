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
const ballCountDiv = document.getElementById('ballCount');
const normalBallCounter = document.getElementById('normalBallCounter');
const normalBallMsg = document.getElementById('normalBallMsg');
const normalBallContinueBtn = document.getElementById('normalBallContinueBtn');
const normalBallEndBtn = document.getElementById('normalBallEndBtn');
const extraHardOptions = document.getElementById('extraHardOptions');
const extraHardOptionBtns = document.querySelectorAll('.extraHardOptionBtn');
const extraHardHealthBar = document.getElementById('extraHardHealthBar');
const extraHardHealth = document.getElementById('extraHardHealth');

let selectedDifficulty = 'normal';
let pong, currentGame = null;
let ballSpeed = 3;
let bestScore = localStorage.getItem('pongBestScore') ? parseInt(localStorage.getItem('pongBestScore')) : 0;
let isExtraEasy = false;
let ballCount = 1;
let normalBallsLeft = 3;
let extraHardOption = 'restore';
let extraHardBalls = [];
let extraHardHealthValue = 100;
let extraHardBallsLost = 0;

difficultyBtns.forEach(btn => {
  btn.onclick = () => {
    difficultyBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedDifficulty = btn.getAttribute('data-speed');
    playPong.style.display = 'inline-block';
    if (selectedDifficulty === 'extrahard') {
      extraHardOptions.style.display = 'block';
    } else {
      extraHardOptions.style.display = 'none';
    }
  };
});
extraHardOptionBtns.forEach(btn => {
  btn.onclick = () => {
    extraHardOptionBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    extraHardOption = btn.getAttribute('data-option');
  };
});

playPong.onclick = () => {
  menuScreen.style.display = 'none';
  canvas.style.display = 'block';
  isExtraEasy = (selectedDifficulty === 'extraeasy');
  if (selectedDifficulty === 'extrahard') {
    extraHardHealthBar.style.display = 'block';
    extraHardHealthValue = 100;
    extraHardBallsLost = 0;
    extraHardHealth.style.width = '100%';
    extraHardHealth.textContent = '100';
  } else {
    extraHardHealthBar.style.display = 'none';
  }
  startPong();
};

function startPong() {
  currentGame = 'pong';
  ballSpeed = (selectedDifficulty === 'hard') ? 6 : (selectedDifficulty === 'extraeasy' ? 3.5 : (selectedDifficulty === 'extrahard' ? 3.5 : 3));
  pong = {
    player: { x: 170, y: 570, w: 60, h: 12, dx: 0 },
    ai: { x: 170, y: 18, w: 60, h: 12 },
    score: 0,
    running: true
  };
  pongGameOver.style.display = 'none';
  extraEasyMsg.style.display = 'none';
  normalBallMsg.style.display = 'none';
  ballCount = 1;
  normalBallsLeft = 3;
  if (selectedDifficulty === 'normal') {
    normalBallCounter.style.display = 'block';
    normalBallCounter.textContent = `Balls left: ${normalBallsLeft}`;
  } else {
    normalBallCounter.style.display = 'none';
  }
  if (selectedDifficulty === 'extrahard') {
    extraHardBalls = [
      { x: 200, y: 300, r: 10, dx: ballSpeed, dy: -ballSpeed },
      { x: 100, y: 200, r: 10, dx: -ballSpeed, dy: -ballSpeed },
      { x: 300, y: 400, r: 10, dx: ballSpeed, dy: ballSpeed }
    ];
    extraHardHealthValue = 100;
    extraHardBallsLost = 0;
    extraHardHealth.style.width = '100%';
    extraHardHealth.textContent = '100';
  }
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
  // Balls
  if (selectedDifficulty === 'extrahard') {
    extraHardBalls.forEach(ball => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = '#6c3483';
      ctx.fill();
    });
  } else {
    ctx.beginPath();
    ctx.arc(pong.ball.x, pong.ball.y, pong.ball.r, 0, Math.PI * 2);
    ctx.fillStyle = '#444';
    ctx.fill();
  }
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
  let aiSpeed = (selectedDifficulty === 'hard') ? 6 : (selectedDifficulty === 'extrahard' ? 7 : 3);
  if (pong.ball && (selectedDifficulty !== 'extrahard')) {
    if (pong.ball.x < pong.ai.x + pong.ai.w/2) pong.ai.x -= aiSpeed;
    else pong.ai.x += aiSpeed;
    if (pong.ai.x < 0) pong.ai.x = 0;
    if (pong.ai.x + pong.ai.w > canvas.width) pong.ai.x = canvas.width - pong.ai.w;
  } else if (selectedDifficulty === 'extrahard') {
    // Advanced AI: Predicts the landing position of the closest ball and moves smoothly
    let closest = extraHardBalls[0];
    let minDist = Math.abs(extraHardBalls[0].x - (pong.ai.x + pong.ai.w/2));
    let predictedX = closest.x;
    let minTime = Infinity;
    for (let b of extraHardBalls) {
      // Predict when the ball will reach the AI paddle (y = pong.ai.y + pong.ai.h)
      if (b.dy < 0) {
        let time = (b.y - (pong.ai.y + pong.ai.h)) / -b.dy;
        if (time > 0 && time < minTime) {
          minTime = time;
          // Predict x position at that time, considering wall bounces
          let predicted = b.x + b.dx * time;
          // Reflect off walls
          let bounces = Math.floor(Math.abs(predicted) / canvas.width);
          if (bounces % 2 === 1) {
            predicted = canvas.width - (Math.abs(predicted) % canvas.width);
          } else {
            predicted = Math.abs(predicted) % canvas.width;
          }
          predictedX = predicted;
          closest = b;
        }
      }
    }
    // AI moves toward predicted landing spot
    let aiSpeed = 8;
    let aiCenter = pong.ai.x + pong.ai.w/2;
    if (Math.abs(predictedX - aiCenter) > aiSpeed) {
      if (predictedX < aiCenter) pong.ai.x -= aiSpeed;
      else pong.ai.x += aiSpeed;
    } else {
      pong.ai.x += (predictedX - aiCenter);
    }
    if (pong.ai.x < 0) pong.ai.x = 0;
    if (pong.ai.x + pong.ai.w > canvas.width) pong.ai.x = canvas.width - pong.ai.w;

    // Move balls and always keep 3 balls on screen
    for (let i = extraHardBalls.length - 1; i >= 0; i--) {
      let ball = extraHardBalls[i];
      ball.x += ball.dx;
      ball.y += ball.dy;
      // Wall collision
      if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) ball.dx *= -1;
      // Paddle collision
      if (
        ball.y + ball.r > pong.player.y &&
        ball.x > pong.player.x && ball.x < pong.player.x + pong.player.w &&
        ball.dy > 0
      ) {
        ball.dy *= -1;
        ball.y = pong.player.y - ball.r;
        pong.score++;
        if (extraHardOption === 'restore') {
          extraHardHealthValue = Math.min(100, extraHardHealthValue + 3);
        }
      }
      if (
        ball.y - ball.r < pong.ai.y + pong.ai.h &&
        ball.x > pong.ai.x && ball.x < pong.ai.x + pong.ai.w &&
        ball.dy < 0
      ) {
        ball.dy *= -1;
        ball.y = pong.ai.y + pong.ai.h + ball.r;
      }
      // Ball lost
      if (ball.y - ball.r < 0 || ball.y + ball.r > canvas.height) {
        extraHardBalls.splice(i, 1);
        extraHardBallsLost++;
        extraHardHealthValue -= 20;
      }
    }
    // Always keep 3 balls on the screen
    while (extraHardBalls.length < 3 && extraHardHealthValue > 0) {
      extraHardBalls.push({
        x: 200,
        y: 300,
        r: 10,
        dx: (Math.random() > 0.5 ? 1 : -1) * ballSpeed,
        dy: (Math.random() > 0.5 ? 1 : -1) * ballSpeed
      });
    }
    // Update health bar
    extraHardHealth.style.width = Math.max(0, extraHardHealthValue) + '%';
    extraHardHealth.textContent = extraHardHealthValue;
    // End game if health is 0
    if (extraHardHealthValue <= 0) {
      pong.running = false;
      if (pong.score > bestScore) {
        bestScore = pong.score;
        localStorage.setItem('pongBestScore', bestScore);
      }
      bestScoreDiv.textContent = `Best High Score: ${bestScore}`;
      ballCountDiv.textContent = `Balls used: ${extraHardBallsLost}`;
      pongGameOver.style.display = 'block';
      extraHardHealthBar.style.display = 'none';
    }
    return;
  }
  // Move ball
  if (pong.ball && (selectedDifficulty !== 'extrahard')) {
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
  }
  // Game over or extra easy/normal logic
  if (pong.ball && (selectedDifficulty !== 'extrahard')) {
    if (pong.ball.y - pong.ball.r < 0 || pong.ball.y + pong.ball.r > canvas.height) {
      if (isExtraEasy) {
        pong.running = false;
        extraEasyMsg.style.display = 'block';
      } else if (selectedDifficulty === 'normal' && normalBallsLeft > 0) {
        pong.running = false;
        normalBallMsg.style.display = 'block';
      } else {
        pong.running = false;
        if (pong.score > bestScore) {
          bestScore = pong.score;
          localStorage.setItem('pongBestScore', bestScore);
        }
        bestScoreDiv.textContent = `Best High Score: ${bestScore}`;
        ballCountDiv.textContent = `Balls used: ${selectedDifficulty === 'normal' ? 4 - normalBallsLeft : ballCount}`;
        pongGameOver.style.display = 'block';
        normalBallCounter.style.display = 'none';
      }
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
  ballCount++;
  requestAnimationFrame(pongLoop);
});

extraEasyEndBtn.addEventListener('click', () => {
  if (pong.score > bestScore) {
    bestScore = pong.score;
    localStorage.setItem('pongBestScore', bestScore);
  }
  bestScoreDiv.textContent = `Best High Score: ${bestScore}`;
  ballCountDiv.textContent = `Balls used: ${ballCount}`;
  extraEasyMsg.style.display = 'none';
  pongGameOver.style.display = 'block';
  normalBallCounter.style.display = 'none';
});

normalBallContinueBtn.addEventListener('click', () => {
  normalBallsLeft--;
  normalBallCounter.textContent = `Balls left: ${normalBallsLeft}`;
  pong.ball.x = 200;
  pong.ball.y = 300;
  pong.ball.dx = ballSpeed;
  pong.ball.dy = -ballSpeed;
  pong.running = true;
  normalBallMsg.style.display = 'none';
  ballCount++;
  requestAnimationFrame(pongLoop);
});

normalBallEndBtn.addEventListener('click', () => {
  if (pong.score > bestScore) {
    bestScore = pong.score;
    localStorage.setItem('pongBestScore', bestScore);
  }
  bestScoreDiv.textContent = `Best High Score: ${bestScore}`;
  ballCountDiv.textContent = `Balls used: ${4 - normalBallsLeft}`;
  normalBallMsg.style.display = 'none';
  pongGameOver.style.display = 'block';
  normalBallCounter.style.display = 'none';
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
