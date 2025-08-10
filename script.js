const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const modeSelect = document.getElementById('mode');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let gameMode = modeSelect.value; // 'pvp' or 'ai'

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

// Update game mode when user changes dropdown
modeSelect.addEventListener('change', () => {
  gameMode = modeSelect.value;
  restartGame();
});

function handleClick(e) {
  const cell = e.target;
  const index = cell.dataset.index;

  if (board[index] !== "" || !gameActive) return;

  if (gameMode === "ai" && currentPlayer === "O") {
    // Ignore clicks if it's AI's turn
    return;
  }

  makeMove(index, currentPlayer);

  if (gameMode === "ai" && gameActive && currentPlayer === "O") {
    // AI moves after a short delay
    setTimeout(aiMove, 500);
  }
}

function makeMove(index, player) {
  board[index] = player;
  const cell = document.querySelector(`.cell[data-index='${index}']`);
  cell.textContent = player;
  cell.classList.add(player); // Add class 'X' or 'O' for color styling

  if (checkWin(player)) {
    statusElement.textContent = `Player ${player} wins!`;
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusElement.textContent = "It's a tie!";
    gameActive = false;
    return;
  }

  currentPlayer = player === "X" ? "O" : "X";
  statusElement.textContent = `Player ${currentPlayer}'s turn`;
}

function aiMove() {
  if (!gameActive) return;

  const emptyIndices = board
    .map((val, idx) => (val === "" ? idx : null))
    .filter(idx => idx !== null);

  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  makeMove(randomIndex, "O");
}

function checkWin(player) {
  return winConditions.some(condition =>
    condition.every(index => board[index] === player)
  );
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusElement.textContent = `Player ${currentPlayer}'s turn`;
  document.querySelectorAll('.cell').forEach(cell => {
    cell.textContent = "";
    cell.classList.remove('X', 'O'); // remove colored classes
  });
}

document.querySelectorAll('.cell').forEach(cell =>
  cell.addEventListener('click', handleClick)
);
restartBtn.addEventListener('click', restartGame);
