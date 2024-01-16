"use strict";
let board;
let boardView;
let game;

// Get a function that initializes the board, boardView and Game once the 
// DOMContent has been loaded
function initializeEverything() {
    const newRows = parseInt(document.getElementById('rows').value, 10);
    const newColumns = parseInt(document.getElementById('columns').value, 10);
    const newPlayer1Type = document.getElementById('player1-type-selector').value;
    const newPlayer2Type = document.getElementById('player2-type-selector').value;

    if (board) {
        board = null;
    }
    if (boardView) {
        boardView = null;
    }
    if (game) {
        game = null;
    }
    board = new ConnectFourBoard(newRows, newColumns);
    boardView = new ConnectFourBoardView(board);
    game = new ConnectFourGame(board, newPlayer1Type, newPlayer2Type);
}

document.addEventListener('DOMContentLoaded', initializeEverything);
document.getElementById('updateBoardSize').addEventListener('click', initializeEverything);
document.getElementById('player1-type-selector').addEventListener('change', initializeEverything);
document.getElementById('player2-type-selector').addEventListener('change', initializeEverything);


class IllegalMoveError extends Error {
    constructor(message) {
        super(message); // Pass message to the parent Error class
        this.name = "IllegalMoveError"; // Custom name for the error type
    }
}

class ConnectFourBoard {

    constructor(rows, columns) {
        this.boardViews = []; // observers of board
        this.rows = rows;
        this.columns = columns;
        // create board, the underlying data structure
        this.initializeBoard()
        // get the currently legal moves (which will be all columns at init)
        this.updateLegalMoves()  
        this.mostRecentMove = {row: null, column: null};
        this.mostRecentPlayer = null;
        // gameState will be either 'undecided', 'win' or 'draw'
        this.gameState = 'undecided'
        this.winner = null;
        this.winningCells = null;
    }

    registerBoardView(boardView) {
        this.boardViews.push(boardView);
    }

    notifyBoardViews() {
        for (const boardView of this.boardViews) {
            boardView.updateBoardView();
        }
    }

    /**
     * This method (1) checks that proposed move is legal, (2) if it is, adds the move to board, (3) updates the boardView accordingly and (4) checks if the move causes a win or tie.
     * 
     * @param {number} column - the column where the move was attempted to be made
     * @param {number} player - the player number (1 or 2) attempting to make the move 
     * @returns -- need to think about this; it is going to need to return something like "illegal", "winner" or "tie" I think.
     */
    updateBoard(column, player) {
        // Make sure player is either 1 or 2
        if (player !== 1 && player !== 2) {
            throw new Error("Invalid value for 'player'. It must be 1 or 2.");
        }
        // Make sure the proposed move is legal (i.e. column exists and
        // is not filled up).  Note that the given move has not 
        // been added to the board yet, so we do not need to 
        // re-calculate which moves are legal.
        if (!this.legalMoves.includes(column)) {
            console.log("Illegal move. Try another column.");
            throw new IllegalMoveError('Illegal move. Column is likely full.');
        }
        // Add the move to the board and capture which row the move occurs in as well, so that it can then be added to BoardView
        const new_row = this.addMoveToBoard(column, player);
        // Update the most recent move (row, col) so that it can be used
        // by the boardView
        this.mostRecentMove = {row: new_row, column: column};
        this.mostRecentPlayer = player;
        // check for a win.  If there is a winner then, then updates gameState, winner and winningCells accordingly.
        this.checkWin(player);
        // update legal moves, and if no legal moves remain, then 
        // we want to return 'tie'
        this.updateLegalMoves()
        if (this.legalMoves.length === 0) {
            this.gameState = 'tie';
        }
        // finally notify the boardView(s) about the board being updated.
        this.notifyBoardViews();
    }

    initializeBoard() {
        this.board = [];
        for (let i = 0; i < this.rows; i++) {
            let row = new Array(this.columns).fill(0); // Filling the row with 0s (empty spaces)
            this.board.push(row); // Adding the row at the beginning of the array
        }
    }

    updateLegalMoves() {
        this.legalMoves = [];
        for (let col = 0; col < this.board[0].length; col++) {
            // We only need to check the top row to see if a move is legal.
                if (this.board[0][col] === 0) {
                    this.legalMoves.push(col);
                }
            }
        }
    
    /** This method (1) based on the column, determines the first open row, (2) adds the given player's piece to this given (row, column) and (3) returns the row.
     * 
     * @param {number} column -- the number of the column where the move was made
     * @param {number} player -- the player number (either 1 or 2)
     * @returns {number} the row of where the piece landed
     */
    addMoveToBoard(column, player) {
        // Note to self:  This feels like it could be wrong.  This looks like it will be starting at the top of the board and, for that column,  if there is zero there it will make the move there.
        for (let row = this.board.length - 1; row >= 0; row--) {
            if (this.board[row][column] === 0) {
                this.board[row][column] = player;
                return row;
            }
        }
    }


    /**
     * Checks whether `player` won the game.  If so, updates this.gameState to 'win', this.winner = player and updates this.winningCells to be the cells that caused the win.
     * @param {number} player The number of the player (either 1 or 2)
     * @returns 
     */
    checkWin(player) {
        // Check horizontal
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[0].length - 3; col++) {
                if (
                    this.board[row][col] === player && 
                    this.board[row][col + 1] === player &&
                    this.board[row][col + 2] === player && 
                    this.board[row][col + 3] === player
                ) {
                    this.gameState = 'win';
                    this.winner = player;
                    this.winningCells = [
                        {row: row, column: col}, 
                        {row: row, column: col + 1}, 
                        {row: row, column: col + 2}, 
                        {row: row, column: col + 3}
                    ];

                }
            }
        }
        // Check vertical
        for (let col = 0; col < this.board[0].length; col++) {
            for (let row = 0; row < this.board.length - 3; row++) {
                if (
                    this.board[row][col] === player && 
                    this.board[row + 1][col] === player &&
                    this.board[row + 2][col] === player && 
                    this.board[row + 3][col] === player
                ) {
                    this.gameState = 'win';
                    this.winner = player;
                    this.winningCells = [
                        {row: row, column: col}, 
                        {row: row + 1, column: col}, 
                        {row: row + 2, column: col}, 
                        {row: row + 3, column: col}
                    ];
                }
            }
        }
        // Check diagonal (positive slope)
        for (let row = 0; row < this.board.length - 3; row++) {
            for (let col = 0; col < this.board[0].length - 3; col++) {
                if (
                    this.board[row][col] === player && 
                    this.board[row + 1][col + 1] === player &&
                    this.board[row + 2][col + 2] === player && 
                    this.board[row + 3][col + 3] === player
                ) {
                    this.gameState = 'win';
                    this.winner = player;
                    this.winningCells = [
                        {row: row, column: col}, 
                        {row: row + 1, column: col + 1}, 
                        {row: row + 2, column: col + 2}, 
                        {row: row + 3, column: col + 3}
                    ];
                }
            }
        }
    
        // Check diagonal (negative slope)
        for (let row = 3; row < this.board.length; row++) {
            for (let col = 0; col < this.board[0].length - 3; col++) {
                if (this.board[row][col] === player && 
                    this.board[row - 1][col + 1] === player &&
                    this.board[row - 2][col + 2] === player && 
                    this.board[row - 3][col + 3] === player
                ) {
                    this.gameState = 'win';
                    this.winner = player;
                    this.winningCells = [
                        {row: row, column: col}, 
                        {row: row - 1, column: col + 1}, 
                        {row: row - 2, column: col + 2}, 
                        {row: row - 3, column: col + 3}
                    ];
                }
            }
        }
        return false
    }
}


class ConnectFourBoardView {

    constructor(board, max_cell_size = 300) {
        this.board = board;
        this.max_cell_size = max_cell_size;
        this.initializeBoardView();
        board.registerBoardView(this);

    }

    initializeBoardView() {
        this.boardView = document.getElementById('gameBoard');
        this.boardView.innerHTML = '';
    
        const cellWidth = Math.min(
            window.innerWidth / (1.5 * this.board.columns),
            window.innerHeight / (1.5 * this.board.rows),
             this.max_cell_size
        );
        const cellHeight = cellWidth;
        console.log(`window.innerWidth: ${window.innerWidth}`)
        console.log(`window.innerHeight: ${window.innerHeight}`)
        console.log(`cell width: ${cellWidth}`)
        console.log(`cell height: ${cellHeight}`)
    
        for (let row = 0; row < this.board.rows; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'board-row';
    
            for (let col = 0; col < this.board.columns; col++) {
                const cellDiv = document.createElement('div');
                cellDiv.className = 'board-cell';
                cellDiv.style.width = `${cellWidth}px`;
                cellDiv.style.height = `${cellHeight}px`;
                cellDiv.dataset.column = col;
                rowDiv.appendChild(cellDiv);
            }
            this.boardView.appendChild(rowDiv);
        }
    }

    updateBoardView() {
        this.addMoveToBoardView();
        if (this.board.gameState === 'win') {
            this.highlightWinningCells();
        }
    }

    addMoveToBoardView() {
        let cell = document.querySelector(
            `.board-row:nth-child(${this.board.mostRecentMove.row + 1}) .board-cell:nth-child(${this.board.mostRecentMove.column + 1})`
        );
        if (this.board.mostRecentPlayer === 1) {
            cell.classList.add('player-1')
        } else {
            cell.classList.add('player-2')
        }
    }

    highlightWinningCells() {
        this.board.winningCells.forEach(cell => {
            let winningCellView = document.querySelector(
                `.board-row:nth-child(${cell.row + 1}) 
                .board-cell:nth-child(${cell.column + 1})`
            );
            winningCellView.classList.add('winning-cell');
        }) 
    }
}

function addBoardListener(gameBoard, game) {
    const boundHandleBoardClick = function(event) {
        handleBoardClick(event, game);
    };
    gameBoard.addEventListener('click', boundHandleBoardClick);
    // Optionally store the bound function on the game object to remove it later
    game.boundHandleBoardClick = boundHandleBoardClick;
}

function removeBoardListener(gameBoard, game) {
    if (gameBoard && game.boundHandleBoardClick) {
        gameBoard.removeEventListener('click', game.boundHandleBoardClick);
        game.boundHandleBoardClick = null; // Clean up the reference
    }
}

function handleBoardClick(event, game) {
    if (event.target && event.target.matches('.board-cell')) {
        // Take away any ability to affect board until after the current move
        // has been accounted for.
        var gameBoard = document.getElementById('gameBoard');
        removeBoardListener(gameBoard, game);
        const clickedColumn = parseInt(event.target.dataset.column);
        game.makeMove(clickedColumn);
        // Immediately remove the event listener to prevent further moves
    }
}

class ConnectFourGame {

    constructor(board, player1Type, player2Type) {
        this.board = board;
        this.player1Type = player1Type;
        this.player2Type = player2Type;
        this.currentPlayer = 1;
        this.currentPlayerType = player1Type;
        console.log(`current player: ${this.currentPlayer}`)
        console.log(`current player type: ${this.currentPlayerType}`)
        // Bind the event handler to this instance
        this.boundHandleBoardClick = (event) => handleBoardClick(event, this);
        this.updateListeners();
    }

    updateListeners() {
        var gameBoard = document.getElementById('gameBoard');
        if (this.currentPlayerType === 'human') {
            addBoardListener(gameBoard, this);
        } else {
            removeBoardListener(gameBoard, this);
        }
    }

    makeMove(column) {
        // Try updating the board and if the move is illegal 
        // (and was made by a human), then add the board listener back and 
        // essentially try again, waiting for a legal board click.
        // I am not quite sure yet what to do if a computer player tries to
        // make an illegal move, but I don't think we need to worry about 
        // that right now.
        try {
            this.board.updateBoard(column, this.currentPlayer);
        } catch (error) {
            if (
                error instanceof IllegalMoveError &&
                this.currentPlayerType === 'human'
            ) {
                alert('This columns is full!');
                var gameBoard = document.getElementById('gameBoard');
                addBoardListener(gameBoard, this);
                return;
            }
            else if (
                error instanceof IllegalMoveError &&
                this.currentPlayerType === 'computer'
            ) {
                console.error("Computer player made an illegal move");
            }
        }
        // Alert when the game is a tie.
        if (this.board.gameState === 'tie') {
            console.log("It's a cat's game!!!");
            alert("It's a cat's game!!!");
        }
        if (this.board.gameState === 'win') {
            var gameBoard = document.getElementById('gameBoard');
            removeBoardListener(gameBoard, this);
        }
        // Celebrate a human's victory
        if (
            this.board.gameState === 'win' && 
            this.currentPlayerType === 'human'
        ) {
            new WinningCelebration(this.currentPlayer).showWinningModal();
        }

        // Switch players and their types.
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        if (this.currentPlayer === 1) {
            this.currentPlayerType = this.player1Type;
        } else {
            this.currentPlayerType = this.player2Type;
        }
        console.log(`current player: ${this.currentPlayer}`)
        console.log(`current player type: ${this.currentPlayerType}`)
        this.updateListeners();
    }


}

class WinningCelebration {

    constructor(player) {
        this.player = player;
    }

    showWinningModal() {
        const modal = document.getElementById("winning-modal");
        const modalContent = document.getElementById("modal-content");
    
        // Create a new element for the winning message
        const winnerMessage = document.createElement("div");
        winnerMessage.id = "winner-message";
        winnerMessage.textContent = `Player ${this.player} wins!! 🎉`;
    
        // Apply styling to the new element
        winnerMessage.style.fontSize = "150px";
        winnerMessage.style.color = "#3498db";
        winnerMessage.style.fontWeight = "bold";
    
        // Append the new element to the modal content
        modalContent.appendChild(winnerMessage);
    
        // Show the modal
        modal.style.display = "block";
    
        // You can add animations or other visual effects here
        this.addBalloons(10, 5000);
    
        // Close the modal after a delay (e.g., 5 seconds)
        setTimeout(() => {
            modal.style.display = "none";
            // resetGame();
    
            // Remove the winner message element
            modalContent.removeChild(winnerMessage);
        }, 5000);
    }

    createBalloon() {
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
    addBalloons(numBalloons, duration) {
        const balloonsContainer = document.getElementById("balloons-container");

        for (let i = 0; i < numBalloons; i++) {
            const balloon = this.createBalloon();
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
}





// let t = new ConnectFourBoard(6, 7);
// let tView = new ConnectFourBoardView(t);
// t.updateBoard(1, 1);
// t.updateBoard(1, 2);
// t.updateBoard(2, 1);
// t.updateBoard(0, 1);
// console.log('Before winning move:');
// console.log(t.gameState);
// console.log(t.winner);
// console.log(t.winningCells);
// t.updateBoard(3, 1);
// console.log('After winnning move:')
// console.log(t.gameState);
// console.log(t.winner);
// console.log(t.winningCells);
// console.log(t.board);