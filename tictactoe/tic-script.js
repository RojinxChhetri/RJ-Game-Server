const board = document.getElementById('board');
const currentPlayer = document.getElementById('current-player');
let currentPlayerTurn = 'X';
let gameActive = true;

function createBoard() {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('click', cellClicked, { once: true });
    board.appendChild(cell);
  }
}

function cellClicked(e) {
  if (gameActive) {
    e.target.innerText = currentPlayerTurn;
    checkForWin();
    currentPlayerTurn = currentPlayerTurn === 'X'? 'O' : 'X';
    currentPlayer.innerText = `Current Player: ${currentPlayerTurn}`;
  }
}

function checkForWin() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  const cells = document.querySelectorAll('.cell');
  let isWin = false;

  winningCombinations.forEach(combination => {
    if (cells[combination[0]].innerText === currentPlayerTurn &&
        cells[combination[1]].innerText === currentPlayerTurn &&
        cells[combination[2]].innerText === currentPlayerTurn) {
      isWin = true;
    }
  });

  if (isWin) {
    currentPlayer.innerText = `Player ${currentPlayerTurn} Wins`;
    gameActive = false;
  } else if (Array.from(cells).every(cell => cell.innerText!== '')) {
    currentPlayer.innerText = 'It\'s a Draw!';
    gameActive = false;
  }
}

document.getElementById('new-game').addEventListener('click', () => {
  board.innerHTML = '';
  createBoard();
  currentPlayerTurn = 'X';
  currentPlayer.innerText = `Current Player: ${currentPlayerTurn}`;
  gameActive = true;
});

createBoard();
