const symbols = ['🍎', '🍎', '🍊', '🍊', '🍇', '🍇', '🍉', '🍉', '🍌', '🍌', '🍓', '🍓', '🍍', '🍍', '🥝', '🥝'];
const totalCards = symbols.length;

const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const attemptsDisplay = document.getElementById('attempts');
const restartButton = document.getElementById('restart-btn');
const modal = document.getElementById('modal');

let firstCard = null;
let secondCard = null;
let locked = false;
let score = 0;
let matches = 0;
let timer = 0;
let attempts = 0;
let intervalId;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createCard(value) {
  const card = document.createElement('div');
  card.classList.add('card');
  const front = document.createElement('div');
  front.classList.add('front');
  const back = document.createElement('div');
  back.classList.add('back');
  back.textContent = value;
  card.appendChild(front);
  card.appendChild(back);
  card.addEventListener('click', () => {
    if (locked || card.classList.contains('flipped')) return;
    card.classList.add('flipped');
    if (!firstCard) {
      firstCard = card;
    } else {
      secondCard = card;
      checkMatch();
    }
  });
  return card;
}

function checkMatch() {
  locked = true;
  attempts++;
  attemptsDisplay.textContent = `Attempts: ${attempts}`;

  if (firstCard.querySelector('.back').textContent === secondCard.querySelector('.back').textContent) {
    matches++;
    score += 10;
    scoreDisplay.textContent = `Score: ${score}`;
    if (matches === totalCards / 2) {
      clearInterval(intervalId);
      showGameOverModal();
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
    }, 1000);
  }

  setTimeout(() => {
    locked = false;
    resetCards();
  }, 1000);
}

function resetCards() {
  firstCard = null;
  secondCard = null;
}

function startTimer() {
  intervalId = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Timer: ${timer}s`;
  }, 1000);
}

function showGameOverModal() {
  // Calculate time taken in minutes and seconds
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  // Create overlay element
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  modalContent.innerHTML = `
    <h2>Congratulations! You Won!</h2>
    <p>Your score: ${score}</p>
    <p>Time taken: ${minutes} minutes ${seconds} seconds</p>
    <p>Number of attempts: ${attempts}</p>
    <button id="restart-btn-modal">Play Again</button>
  `;
  
  // Append modal content to overlay
  overlay.appendChild(modalContent);

  // Append overlay to body
  document.body.appendChild(overlay);

  // Add event listener to restart button
  const restartBtnModal = modalContent.querySelector('#restart-btn-modal');
  restartBtnModal.addEventListener('click', () => {
    // Remove overlay
    overlay.remove();
    restartGame();
  });
}


function restartGame() {
  score = 0;
  matches = 0;
  timer = 0;
  attempts = 0;
  clearInterval(intervalId);
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Timer: ${timer}s`;
  attemptsDisplay.textContent = `Attempts: ${attempts}`;
  startGame();
}

function startGame() {
  while (gameContainer.firstChild) {
    gameContainer.firstChild.remove();
  }

  shuffle(symbols);
  startTimer();

  for (let i = 0; i < totalCards; i++) {
    const cardValue = symbols[i];
    const card = createCard(cardValue);
    gameContainer.appendChild(card);
  }
}

restartButton.addEventListener('click', restartGame);

startGame();
