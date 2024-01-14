function initializeBoard(rows=6, cols=7) {
    for (let i = 0; i < rows; i++) {
        let row = new Array(cols).fill(0); // Filling the row with 0s (empty spaces)
        board.unshift(row); // Adding the row at the beginning of the array
    }
}


// let rows = 6; // Number of rows
// let cols = 7; // Number of columns
let board = [];
initializeBoard();

function resetBoard() {
    // Reset the board to its initial state
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            board[row][col] = 0;
        }
    }
    // Reset other game states if necessary (e.g., currentPlayer)
    currentPlayer = 1; // Assuming Player 1 starts the game
}


// Board is now a 6x7 2D array with the bottom row as board[0]

// Function to determine legal moves
function getLegalMoves(board) {
    let legalMoves = [];
    for (let col = 0; col < board[0].length; col++) {
        // Check from the bottom row upwards for the first empty space
        for (let row = 0; row < board.length; row++) {
            if (board[row][col] === 0) {
                legalMoves.push(col);
                break; // Stop searching this column once an
            }
        }
    }
    return legalMoves;
}

console.log('Initial Board: ');
console.log(board);
console.log('legal moves:');
console.log(getLegalMoves(board));

function makeMove(board, column, player) {
    // Check if the move is legal
    if (!getLegalMoves(board).includes(column)) {
        console.log("Illegal move. Column is full.");
        return false;
    }
    // Place the piece in the first empty space in the column
    for (let row = 0; row < board.length; row++) {
        if (board[row][column] === 0) {
            board[row][column] = player;
            return true; // Move was successful
        }
    }
}

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


let currentPlayer = 1; // Start with Player 1

function playGame() {

    let legalMoves = getLegalMoves(board);
    if (legalMoves.length === 0) {
        console.log("It's a cat's game!!!");
        resetBoard();
        return;
    }

    if (currentPlayer === 1) {
        // Wait for Player 1's move (human)
        // This will be triggered by an event, like clicking a column on the UI
    } else {
        // Randomly select a column from the legal moves
        let randomIndex = Math.floor(Math.random() * legalMoves.length);
        let selectedColumn = legalMoves[randomIndex];
        // Make the move for the computer
        makeMove(board, selectedColumn, currentPlayer);
        console.log(`Player ${currentPlayer} (Computer) moved in column ${selectedColumn}`);

        // Check for win
        if (checkWin(board, currentPlayer)) {
            console.log(`Player ${currentPlayer} (Computer) Wins!`);
            resetBoard();
            return;
        }
        // Switch to Player 1 for the next turn
        currentPlayer = 1;
    }

    // Optionally, print the board state after each move
    console.log(`Board after turn:`);
    console.log(board);
}     

// Function to handle Player 1's move (to be called by event handler)
function playerMove(column) {
    if (currentPlayer === 1) {
        if (!getLegalMoves(board).includes(column)) {
            console.log("Illegal move. Try another column.");
            return;
        }
        makeMove(board, column, currentPlayer);
        console.log(`Player ${currentPlayer} moved in column ${column}`);

        if (checkWin(board, currentPlayer)) {
            console.log(`Player ${currentPlayer} Wins!`);
            resetBoard();
        } else {
            // Switch to the computer player
            currentPlayer = 2;
            playGame(); // Continue the game with the computer's move
        }
    }
}


// function playGame(board, maxTurns) {
//     let currentPlayer = 1; // Start with Player 1

//     for (let turn = 0; turn < maxTurns; turn++) {
//         let legalMoves = getLegalMoves(board);
//         if (legalMoves.length === 0) {
//             console.log("It's a cat's game!!!");
//             break;
//         }

//         // Randomly select a column from the legal moves
//         let randomIndex = Math.floor(Math.random() * legalMoves.length);
//         let selectedColumn = legalMoves[randomIndex];

//         // Make the move
//         makeMove(board, selectedColumn, currentPlayer);
//         console.log(`Player ${currentPlayer} moved in col ${selectedColumn}`)

//         // Check for win
//         if (checkWin(board, player=currentPlayer)) {
//             console.log(`Player ${currentPlayer} Wins!`)
//             resetBoard()
//             return;
//         } else {
//             // Switch to the other player for the next turn
//             currentPlayer = currentPlayer === 1 ? 2 : 1;
//         }

//         // Optionally, print the board state after each move

//         console.log(`Board after turn ${turn + 1}:`);
//         console.log(board);
//     }
// }

function checkWin(board, player) {
    // Check horizontal
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length - 3; col++) {
            if (board[row][col] === player && board[row][col + 1] === player &&
                board[row][col + 2] === player && board[row][col + 3] === player) {
                return true;
            }
        }
    }

    // Check vertical
    for (let col = 0; col < board[0].length; col++) {
        for (let row = 0; row < board.length - 3; row++) {
            if (board[row][col] === player && board[row + 1][col] === player &&
                board[row + 2][col] === player && board[row + 3][col] === player) {
                return true;
            }
        }
    }

    // Check diagonal (positive slope)
    for (let row = 0; row < board.length - 3; row++) {
        for (let col = 0; col < board[0].length - 3; col++) {
            if (board[row][col] === player && board[row + 1][col + 1] === player &&
                board[row + 2][col + 2] === player && board[row + 3][col + 3] === player) {
                    return true;
            }
        }
    }

    // Check diagonal (negative slope)
    for (let row = 3; row < board.length; row++) {
        for (let col = 0; col < board[0].length - 3; col++) {
            if (board[row][col] === player && board[row - 1][col + 1] === player &&
                board[row - 2][col + 2] === player && board[row - 3][col + 3] === player) {
                return true;
            }
        }
    }
    return false
}

// Start the game for a maximum of 42 turns (6 rows * 7 columns)
playGame(board, 30);


