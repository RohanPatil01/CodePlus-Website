// Your JavaScript code
let playerText = document.getElementById('playerText');
let restartBtn = document.getElementById('restartBtn');
let boxes = Array.from(document.getElementsByClassName('box'));

const O_TEXT = "O";
const X_TEXT = "X";
let currentPlayer = X_TEXT;
let spaces = Array(9).fill(null);
let xWins = 0;
let oWins = 0;

const startGame = () => {
    boxes.forEach(box => box.addEventListener('click', boxClicked));
};

function boxClicked(e) {
    const id = e.target.id;
    const box = document.getElementById(id);

    if (!spaces[id]) { // Check if the box is empty
        spaces[id] = currentPlayer;
        box.innerText = currentPlayer;

        if (playerHasWon()) {
            playerText.innerHTML = `${currentPlayer} has won!`;
            if (currentPlayer === X_TEXT) {
                xWins++;
                document.getElementById('xWinsCounter').innerText = xWins;
            } else {
                oWins++;
                document.getElementById('oWinsCounter').innerText = oWins;
            }
            setTimeout(resetGameBoard, 1000);
            return;
        } else if (isBoardFull()) {
            playerText.innerHTML = "It's a tie!";
            setTimeout(resetGameBoard, 1000);
            return;
        }

        currentPlayer = currentPlayer == X_TEXT ? O_TEXT : X_TEXT;
    }
}

function resetGameBoard() {
    spaces.fill(null);

    boxes.forEach((box) => {
        box.innerText = '';
        box.style.backgroundColor = ''; // Reset background color
    });

    playerText.innerHTML = 'Tic Tac Toe';

    currentPlayer = X_TEXT;
}

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function playerHasWon() {
    for (const condition of winningCombos) {
        let [a, b, c] = condition;

        if (spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
            return true;
        }
    }
    return false;
}

function isBoardFull() {
    return spaces.every((space) => space !== null);
}

restartBtn.addEventListener('click', restart);

function restart() {
    spaces.fill(null);

    boxes.forEach(box => {
        box.innerText = '';
        box.style.backgroundColor = '';
    });

    playerText.innerHTML = 'Tic Tac Toe';

    currentPlayer = X_TEXT;
}

startGame();
