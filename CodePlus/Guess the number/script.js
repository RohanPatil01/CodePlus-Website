const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const restartButton = document.getElementById("restartButton");
const message = document.getElementById("message");
const attemptCounter = document.getElementById("attempts");
const scoreElement = document.getElementById("scoreValue"); // Score element
let randomNumber; // Declare randomNumber variable outside any function scope
let attempts = 0;
let score = 0; // Initialize score

guessButton.addEventListener("click", checkGuess);
restartButton.addEventListener("click", restartGame);

guessInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    checkGuess();
  }
});

function generateRandomNumber() {
  randomNumber = Math.floor(Math.random() * 100) + 1;
}

function checkGuess() {
  const guess = parseInt(guessInput.value);
  if (isNaN(guess) || guess < 1 || guess > 100) {
    message.textContent = "Please enter a valid number between 1 and 100.";
  } else {
    attempts++;
    attemptCounter.textContent = attempts; // Update attempt counter
    if (guess === randomNumber) {
      message.textContent = `Congratulations! You guessed the number ${randomNumber} in ${attempts} attempts.`;
      message.classList.add("success");
      score += 10; // Increase score by 10 for correct guess
      updateScore(); // Update score display
      disableInput();
    } else if (Math.abs(guess - randomNumber) <= 5) {
      if (guess < randomNumber) {
        message.textContent = `${guess} is close! It's slightly low. Try again.`;
      } else {
        message.textContent = `${guess} is close! It's slightly high. Try again.`;
      }
    } else if (guess < randomNumber) {
      message.textContent = `${guess} is too low! Try again.`;
    } else {
      message.textContent = `${guess} is too high! Try again.`;
    }
  }

  // Do not clear the message automatically
}

function restartGame() {
  attempts = 0;
  score = 0; // Reset score
  attemptCounter.textContent = attempts; // Reset attempt counter
  updateScore(); // Update score display
  message.textContent = "Good luck!";
  guessInput.disabled = false;
  guessButton.disabled = false;
  message.classList.remove("success"); // Remove success class
  generateRandomNumber(); // Regenerate random number
}

function disableInput() {
  guessInput.disabled = true;
  guessButton.disabled = true;
}

function updateScore() {
  scoreElement.textContent = score;
}

// Initial generation of random number
generateRandomNumber();
