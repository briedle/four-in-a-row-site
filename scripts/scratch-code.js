let board = [];
MAX_CELL_SIZE = 300;
let rows = 6; // Default rows
let columns = 7; // Default columns
let gameMode = 'humanVsComputer'; // Default game mode
let currentPlayer = 1; // Start with Player 1

// Then call initializeBoard with default values when the page loads
initializeBoard(rows, columns); // Default rows and columns
createBoard(rows, columns); // Create the visual board

// document.getElementById('gameBoard').addEventListener('click', function(event) {
//     if (event.target && event.target.matches('.board-cell')) {
//         const column = parseInt(event.target.dataset.column);
//         handlePlayerMove(column);
//     }
// });

document.getElementById('updateBoard').addEventListener('click', function() {
    const newRows = parseInt(document.getElementById('rows').value, 10);
    const newColumns = parseInt(document.getElementById('columns').value, 10);
    
    // Update the rows and columns globally
    rows = newRows;
    columns = newColumns;

    initializeBoard(rows, columns);
    createBoard(rows, columns);
});

document.addEventListener('DOMContentLoaded', function() {
    // Get the 'New Game' button by its ID
    var newGameButton = document.getElementById('new-game-button');

    // Add click event listener to the button
    newGameButton.addEventListener('click', function() {
        console.log(`board length before resetBoard: ${board.length}`)
        resetBoard(withDelay = false, removeBlocks = true);
        initializeBoard(rows, columns);
        // console.log(`board length before createBoard: ${board.length}`)
        createBoard(rows, columns);
        console.log(`board length before updateBoardDisplay: ${board.length}`)
        updateBoardDisplay();
        console.log(`board length AFTER updateBoardDisplay: ${board.length}`)
        // Any additional logic to start a new game can go here
        // For example, clearing any game-over messages, resetting scores, etc.
        if (gameMode == 'computerVsComputer') {
            currentPlayer = 1;
            makeComputerMove();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var gameModeSelector = document.getElementById('game-mode-selector');
    gameModeSelector.addEventListener('change', function() {
        previousMode = gameMode
        gameMode = this.value; // Update the gameMode variable based on the selection
        console.log(`gameMode went from ${previousMode} to ${gameMode}`)
        // Optionally, you can also reset the game state or board here
        // const rows = parseInt(document.getElementById('rows').value, 10);
        // const columns = parseInt(document.getElementById('columns').value, 10);
        resetBoard(withDelay = false, removeBlocks = true);
        createBoard(rows, columns);
        if (
            gameMode === 'computerVsComputer' ||
            gameMode === 'humanVsComputer'
        ) {
            document.getElementById('delay-option').style.display = 'block';
            currentPlayer = 1; // Start with Player 1
            makeComputerMove(); // Trigger the first computer move
        } else {
            document.getElementById('delay-option').style.display = 'none';
        }
    });
});

function createBoard(rows, cols) {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';

    const cellWidth = Math.min(
        window.innerWidth / (1.5 * cols),
        window.innerHeight / (1.5 * rows),
         MAX_CELL_SIZE
         );
    const cellHeight = cellWidth;
    // const cellWidth = Math.min(window.innerWidth / (2 * cols), MAX_CELL_SIZE);
    // const cellHeight = Math.min(window.innerHeight / (2 * rows), MAX_CELL_SIZE);
    console.log(`window.innerWidth: ${window.innerWidth}`)
    console.log(`window.innerHeight: ${window.innerHeight}`)
    console.log(`cell width: ${cellWidth}`)
    console.log(`cell height: ${cellHeight}`)

    for (let row = 0; row < rows; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'board-row';

        for (let col = 0; col < cols; col++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'board-cell';
            cellDiv.style.width = `${cellWidth}px`;
            cellDiv.style.height = `${cellHeight}px`;
            cellDiv.dataset.column = col;
            // ... rest of your cell setup ...
            rowDiv.appendChild(cellDiv);
        }
        board.appendChild(rowDiv);
    }
    // Need to add an event listener for the board
    if (gameMode === 'humanVsHuman' || gameMode === 'humanVsComputer') {
        document.getElementById('gameBoard').addEventListener('click', playGame);
    }
}

function initializeBoard(rows=6, cols=7) {
    board = [];
    for (let i = 0; i < rows; i++) {
        let row = new Array(cols).fill(0); // Filling the row with 0s (empty spaces)
        board.unshift(row); // Adding the row at the beginning of the array
    }
}


function updateBoardDisplay() {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            let cell = document.querySelector(`.board-row:nth-child(${row + 1}) .board-cell:nth-child(${col + 1})`);
            cell.textContent = ''; 
            cell.classList.remove('winning-cell');
            cell.classList.remove('player-1', 'player-2'); // Remove previous classes
            if (board[row][col] === 1) {
                cell.classList.add('player-1');
            } else if (board[row][col] === 2) {
                cell.classList.add('player-2');
            }
        }
    }
}

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
            if (removeBlocks) {
                cell.classList.remove('player-1', 'player-2');
                cell.style = null;
            }
        });
        // Reset other game states if necessary (e.g., currentPlayer)
        currentPlayer = 1; 
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





function handleBoardClick(event) {
    if (event.target && event.target.matches('.board-cell')) {
        const column = parseInt(event.target.dataset.column);
        handlePlayerMove(column);
        // Immediately remove the event listener to prevent further moves
        document.getElementById('gameBoard').removeEventListener('click', handleBoardClick);
    }
}

function handlePlayerMove(column) {
    if (!getLegalMoves(board).includes(column)) {
        console.log("Illegal move. Try another column.");
        return;
    }


    makeMove(board, column, currentPlayer);
    updateBoardDisplay();

    let checkWinResult = checkWin(board, currentPlayer);
    if (checkWinResult) {
        celebrateWin(checkWinResult, currentPlayer);
    } else {
        // Switch to the next player
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        playGame();
    }
    console.log(`Board after turn:`);
    console.log(board);
}


function makeComputerMove() {
    // Randomly select a column from the legal moves
    let legalMoves = getLegalMoves(board);
    let randomIndex = Math.floor(Math.random() * legalMoves.length);
    let selectedColumn = legalMoves[randomIndex];
    // Make the move for the computer
    makeMove(board, selectedColumn, currentPlayer);
    console.log(
        `Player ${currentPlayer} (Computer) moved in column ${selectedColumn}`
    );
    updateBoardDisplay();
    // Check for win
    let checkWinResult = checkWin(board, currentPlayer)
    if (checkWinResult) {
        celebrateWin(checkWinResult, currentPlayer)
        return;
    } else {
        // Switch to the next player
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        // let delay = parseInt(document.getElementById('delay-time').value);
        // setTimeout(playGame, delay);
        playGame();
    }
    // Optionally, print the board state after each move
    console.log(`Board after turn:`);
    console.log(board);

}

function playGame() {
    console.log(`game mode registered as ${gameMode}`)
    let legalMoves = getLegalMoves(board);
    if (legalMoves.length === 0) {
        console.log("It's a cat's game!!!");
        alert("It's a cat's game!!!")
        resetBoard();
        return;
    }
    // It's a human's turn 
    if (
        gameMode === 'humanVsHuman' ||
        (gameMode === 'humanVsComputer' && currentPlayer === 1)
    ) {
      // Add the event listener for board clicks
      // Note that handleBoardClick ccalls handlePlayerMove, which then removes the event listener
      // so that a player can make multiple game moves
      document.getElementById('gameBoard').addEventListener('click', handleBoardClick);
    } else {
        // Computer's turn in human vs. computer mode
        let delay = parseInt(document.getElementById('delay-time').value);
        setTimeout(makeComputerMove, delay);
        
    }
}




// function playGame() {

//     let legalMoves = getLegalMoves(board);
//     if (legalMoves.length === 0) {
//         alert("It's a cat's game!!!");
//         resetBoard(withDelay=true, removeBlocks = false);
//         return;
//     }

//     if (currentPlayer === 1) {
//         // Wait for Player 1's move (human)
//         document.addEventListener('click', handlePlayerMove);
//     } else {
//         document.removeEventListener('click', handlePlayerMove);
//         // Randomly select a column from the legal moves
//         let randomIndex = Math.floor(Math.random() * legalMoves.length);
//         let selectedColumn = legalMoves[randomIndex];
//         // Make the move for the computer
//         makeMove(board, selectedColumn, currentPlayer);
//         console.log(`Player ${currentPlayer} (Computer) moved in column ${selectedColumn}`);
//         updateBoardDisplay();
//         // Check for win
//         let checkWinResult = checkWin(board, currentPlayer)
//         if (checkWinResult) {
//             celebrateWin(checkWinResult, currentPlayer)
//             return;
//         }
//         // Switch to Player 1 for the next turn
//         currentPlayer = 1;
//         // Optionally, print the board state after each move
//         console.log(`Board after turn:`);
//         console.log(board);
//     }

// }     



















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