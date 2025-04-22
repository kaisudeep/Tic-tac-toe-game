let currentPlayer = 'X';
const cells = [];

const gameBoard = document.getElementById('game-board');
const status = document.getElementById('status');

// Create grid
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('click', () => cellClicked(i));
    gameBoard.appendChild(cell);
    cells.push(cell);
}

function cellClicked(index) {
    if (cells[index].textContent !== '') return;

    cells[index].textContent = currentPlayer;

    if (checkWin()) {
        status.textContent = `${currentPlayer} wins!`;
        sendResultToServer('Player X', 'Player O', currentPlayer);
        disableBoard();
    } else if (cells.every(cell => cell.textContent !== '')) {
        status.textContent = 'Draw!';
        sendResultToServer('Player X', 'Player O', 'Draw');
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return cells[a].textContent === currentPlayer &&
               cells[a].textContent === cells[b].textContent &&
               cells[a].textContent === cells[c].textContent;
    });
}

function disableBoard() {
    cells.forEach(cell => cell.style.pointerEvents = 'none');
}

function sendResultToServer(player1, player2, winner) {
    fetch('http://localhost:3000/save-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player1, player2, winner })
    })
    .then(res => res.json())
    .then(data => console.log('Game saved:', data))
    .catch(err => console.error('Save error:', err));
}
