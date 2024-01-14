function testClick(col) {
    console.log("Clicked column: " + col);
}

// Modify the createBoard function
function createBoard(rows, cols) {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';

    for (let row = 0; row < rows; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'board-row';

        for (let col = 0; col < cols; col++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'board-cell';
            cellDiv.dataset.column = col; // Assign column number to each cell
            cellDiv.onclick = function() {
                // testClick(col);
                handlePlayerMove(parseInt(this.dataset.column));
            };
            rowDiv.appendChild(cellDiv);
        }

        board.appendChild(rowDiv);
    }
}

function initializeBoard(rows=6, cols=7) {
    for (let i = 0; i < rows; i++) {
        let row = new Array(cols).fill(0); // Filling the row with 0s (empty spaces)
        board.unshift(row); // Adding the row at the beginning of the array
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Get the 'New Game' button by its ID
    var newGameButton = document.getElementById('new-game-button');

    // Add click event listener to the button
    newGameButton.addEventListener('click', function() {
        resetBoard(withDelay = false, removeBlocks = true);
        // Any additional logic to start a new game can go here
        // For example, clearing any game-over messages, resetting scores, etc.
    });
});



// let rows = 6; // Number of rows
// let cols = 7; // Number of columns
let board = [];
initializeBoard();

function resetBoard(withDelay = true, removeBlocks = false) {

    function resetLogic(removeBlocks) {
        // Reset the board to its initial state
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                board[row][col] = 0;
            }
        }

        // Clear winning cell highlights
        let allCells = document.querySelectorAll('.board-cell');
        allCells.forEach(cell => {
            cell.classList.remove('winning-cell');
            if (removeBlocks) {
                cell.classList.remove('player-1', 'player-2');
                cell.style = null;
            }
        });
        // Reset other game states if necessary (e.g., currentPlayer)
        currentPlayer = 1; // Assuming Player 1 starts the game
    }

    if (withDelay) {
        setTimeout(function() { resetLogic(removeBlocks); }, 5000);
    } else {
        resetLogic(removeBlocks = removeBlocks);
    }
}


// Function to determine legal moves
function getLegalMoves(board) {
    let legalMoves = [];
    for (let col = 0; col < board[0].length; col++) {
        // Check from the bottom row upwards for the first empty space
        for (let row = board.length - 1; row >= 0; row--) {
            if (board[row][col] === 0) {
                legalMoves.push(col);
                break; // Stop searching this column once an
            }
        }
    }
    return legalMoves;
}

// createBoard();
console.log('Initial Board: ');
console.log(board);
console.log('legal moves:');
console.log(getLegalMoves(board));

function makeMove(board, column, player) {
    // Iterate from the bottom row upwards
    for (let row = board.length - 1; row >= 0; row--) {
        if (board[row][column] === 0) {
            board[row][column] = player;
            return true; // Move was successful
        }
    }
    console.log("Illegal move. Column is full.");
    return false;
}

// function makeMove(board, column, player) {
//     // Check if the move is legal
//     if (!getLegalMoves(board).includes(column)) {
//         console.log("Illegal move. Column is full.");
//         return false;
//     }
//     // Place the piece in the first empty space in the column
//     for (let row = 0; row < board.length; row++) {
//         if (board[row][column] === 0) {
//             board[row][column] = player;
//             return true; // Move was successful
//         }
//     }
// }

// console.log("Initial Board:");
// console.log(board);

// Player 1 makes a move in column 3
// makeMove(board, 3, 1);
// console.log("Board after Player 1's move:");
// console.log(board);

// // Player 2 makes a move in the same column
// makeMove(board, 3, -1);
// console.log("Board after Player 2's move:");
// console.log(board);

// for (i = 0; i < 7; i++) {
//     makeMove(board, 3, 1)
//     console.log(`Board after ${i+1}th move `)
//     console.log(board);
// }

// Function to handle Player 1's move (to be called by event handler)
function handlePlayerMove(column) {
    if (currentPlayer === 1) {
        if (!getLegalMoves(board).includes(column)) {
            console.log("Illegal move. Try another column.");
            return;
        }
        makeMove(board, column, currentPlayer);
        // console.log(`Player ${currentPlayer} moved in column ${column}`);
        updateBoardDisplay(); // You will need to implement this function
        // Check for win
        let checkWinResult = checkWin(board, currentPlayer);
        if (checkWinResult) {
            celebrateWin(checkWinResult, currentPlayer);
            return;
        } else {
            // Switch to the computer player
            currentPlayer = 2;
            playGame(); // Continue the game with the computer's move
        }
        // Optionally, print the board state after each move
        console.log(`Board after turn:`);
        console.log(board);
    }
}

function updateBoardDisplay() {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            let cell = document.querySelector(`.board-row:nth-child(${row + 1}) .board-cell:nth-child(${col + 1})`);
            cell.textContent = ''; // Clear previous content

            cell.classList.remove('player-1', 'player-2'); // Remove previous classes
            if (board[row][col] === 1) {
                cell.classList.add('player-1');
            } else if (board[row][col] === 2) {
                cell.classList.add('player-2');
            }
        }
    }
}

function checkWin(board, player) {
    // Check horizontal
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length - 3; col++) {
            if (board[row][col] === player && board[row][col + 1] === player &&
                board[row][col + 2] === player && board[row][col + 3] === player) {
                    return [{row, col}, {row, col: col + 1}, {row, col: col + 2}, {row, col: col + 3}];
                // return true;
            }
        }
    }
    // Check vertical
    for (let col = 0; col < board[0].length; col++) {
        for (let row = 0; row < board.length - 3; row++) {
            if (board[row][col] === player && board[row + 1][col] === player &&
                board[row + 2][col] === player && board[row + 3][col] === player) {
                    return [{row, col}, {row: row + 1, col}, {row: row + 2, col}, {row: row + 3, col}];
                // return true;
            }
        }
    }

    // Check diagonal (positive slope)
    for (let row = 0; row < board.length - 3; row++) {
        for (let col = 0; col < board[0].length - 3; col++) {
            if (board[row][col] === player && board[row + 1][col + 1] === player &&
                board[row + 2][col + 2] === player && board[row + 3][col + 3] === player) {
                    return [{row, col}, {row: row + 1, col: col + 1}, {row: row + 2, col: col + 2}, {row: row + 3, col: col + 3}];
            }
        }
    }

    // Check diagonal (negative slope)
    for (let row = 3; row < board.length; row++) {
        for (let col = 0; col < board[0].length - 3; col++) {
            if (board[row][col] === player && board[row - 1][col + 1] === player &&
                board[row - 2][col + 2] === player && board[row - 3][col + 3] === player) {
                    return [{row, col}, {row: row - 1, col: col + 1}, {row: row - 2, col: col + 2}, {row: row - 3, col: col + 3}];
            }
        }
    }
    return false
}

function celebrateWin(winCheckResult, currentPlayer) {
    winCheckResult.forEach(cell => {
        let winningCell = document.querySelector(`.board-row:nth-child(${cell.row + 1}) .board-cell:nth-child(${cell.col + 1})`);
        winningCell.classList.add('winning-cell');
    });
    showWinningModal(currentPlayer);
    console.log(`Player ${currentPlayer} Wins!`);
    resetBoard(withDelay=true);
}




let currentPlayer = 1; // Start with Player 1

function playGame() {

    let legalMoves = getLegalMoves(board);
    if (legalMoves.length === 0) {
        alert("It's a cat's game!!!");
        resetBoard(withDelay=true);
        return;
    }

    if (currentPlayer === 1) {
        // Wait for Player 1's move (human)
        document.addEventListener('click', handlePlayerMove);
    } else {
        document.removeEventListener('click', handlePlayerMove);
        // Randomly select a column from the legal moves
        let randomIndex = Math.floor(Math.random() * legalMoves.length);
        let selectedColumn = legalMoves[randomIndex];
        // Make the move for the computer
        makeMove(board, selectedColumn, currentPlayer);
        console.log(`Player ${currentPlayer} (Computer) moved in column ${selectedColumn}`);
        updateBoardDisplay();
        // Check for win
        let checkWinResult = checkWin(board, currentPlayer)
        if (checkWinResult) {
            celebrateWin(checkWinResult, currentPlayer)
            return;
        }
        // Switch to Player 1 for the next turn
        currentPlayer = 1;
        // Optionally, print the board state after each move
        console.log(`Board after turn:`);
        console.log(board);
    }

}     



















// Start the game for a maximum of 42 turns (6 rows * 7 columns)
// playGame(board, 30);


// Custom modal function
function showWinningModal(player) {
    const modal = document.getElementById("winning-modal");
    const modalContent = document.getElementById("modal-content");

    // Create a new element for the winning message
    const winnerMessage = document.createElement("div");
    winnerMessage.id = "winner-message";
    winnerMessage.textContent = `Player ${player} wins!! 🎉`;

    // Apply styling to the new element
    winnerMessage.style.fontSize = "150px";
    winnerMessage.style.color = "#3498db";
    winnerMessage.style.fontWeight = "bold";

    // Append the new element to the modal content
    modalContent.appendChild(winnerMessage);

    // Show the modal
    modal.style.display = "block";

    // You can add animations or other visual effects here
    addBalloons(10, 5000);

    // Close the modal after a delay (e.g., 5 seconds)
    setTimeout(() => {
        modal.style.display = "none";
        // resetGame();

        // Remove the winner message element
        modalContent.removeChild(winnerMessage);
    }, 5000);
}



// Function to create a balloon element with string
function createBalloon() {
    const balloon = document.createElement("div");
    balloon.className = "balloon";

    // Create the string element
    const string = document.createElement("div");
    string.className = "string";

    // Append the string to the balloon
    balloon.appendChild(string);

    return balloon;
}


// Function to add balloons to the balloons container
function addBalloons(numBalloons, duration) {
    const balloonsContainer = document.getElementById("balloons-container");

    for (let i = 0; i < numBalloons; i++) {
        const balloon = createBalloon();
        balloonsContainer.appendChild(balloon);

        // Set a random position for each balloon
        const randomX = Math.floor(Math.random() * window.innerWidth);
        const randomY = Math.floor(Math.random() * window.innerHeight);
        balloon.style.left = `${randomX}px`;
        balloon.style.top = `${randomY}px`;
        // Remove the balloon after the specified duration
        setTimeout(() => {
            balloonsContainer.removeChild(balloon);
        }, duration);
    }
}