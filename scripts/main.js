"use strict";
import { ConnectFourBoard } from './ConnectFourClasses.js';
import { ComputerPlayer } from './ConnectFourClasses.js';
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
        board.reset(newRows, newColumns);
    } else {
        board = new ConnectFourBoard(newRows, newColumns);
    }
    if (boardView) {
        boardView.reset()
    } else {
        boardView = new ConnectFourBoardView(board)
    }
    if (game) {
        game.reset(newPlayer1Type, newPlayer2Type)
    } else {
        game = new ConnectFourGame(
            board, 
            boardView, 
            newPlayer1Type, 
            newPlayer2Type
        )
    }
}

document.addEventListener('DOMContentLoaded', initializeEverything);
document.getElementById('updateBoardSize').addEventListener('click', initializeEverything);
document.getElementById('new-game-button').addEventListener('click', initializeEverything);
document.getElementById('player1-type-selector').addEventListener('change', initializeEverything);
document.getElementById('player2-type-selector').addEventListener('change', initializeEverything);


class IllegalMoveError extends Error {
    constructor(message) {
        super(message); // Pass message to the parent Error class
        this.name = "IllegalMoveError"; // Custom name for the error type
    }
}










class ConnectFourBoardView {

    constructor(board, max_cell_size = 300) {
        this.board = board;
        this.max_cell_size = max_cell_size;
        this.initializeBoardView();
        board.registerBoardView(this);

    }

    reset() {
        this.boardView.innerHTML = '';
        this.initializeBoardView();
    }

    initializeBoardView() {
        this.boardView = document.getElementById('gameBoard');
        this.boardView.innerHTML = '';
    
        const cellWidth = Math.min(
            window.innerWidth / (1.4 * this.board.columns),
            window.innerHeight / (1.4 * this.board.rows),
             this.max_cell_size
        );
        const cellHeight = cellWidth;
        // console.log(`window.innerWidth: ${window.innerWidth}`)
        // console.log(`window.innerHeight: ${window.innerHeight}`)
        // console.log(`cell width: ${cellWidth}`)
        // console.log(`cell height: ${cellHeight}`)
    
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
class ConnectFourGame {

    constructor(board, boardView, player1Type, player2Type) {
        this.board = board;
        this.boardView = boardView;
        this.player1Type = player1Type;
        this.player2Type = player2Type;
        this.initializeComputerPlayers();
        this.currentPlayer = 1;
        this.currentPlayerType = this.player1Type;
        console.log(`current player: ${this.currentPlayer}`)
        console.log(`current player type: ${this.currentPlayerType}`)
        // Bind the event handler to this instance
        // this.boundHandleBoardClick = (event) => handleBoardClick(event, this);
        // Define resetListener as an arrow function so that 'this' is automatically 
        // bound to the ConnectFourGame instance
        // this.resetListener = () => {
        //     this.reset(this.player1Type, this.player2Type);
        //     var gameBoard = document.getElementById('gameBoard');
        //     gameBoard.removeEventListener('click', this.resetListener);
        // };
        // Define the click handler function as an arrow function so that 'this' is
        // automatically bound to the ConnectFourGame instance, even when
        // it is called by the event listener.
        this.handleBoardClick = (event) => {
            if (event.target && event.target.matches('.board-cell')) {
                const clickedColumn = parseInt(event.target.dataset.column);
                this.play(clickedColumn);
            }
        };
        // Create a bound version of reset that is always the same method,
        // so that we can then use it when we add or remove an event listener
        // that restarts the game once the game has completed.
        this.boundReset = this.reset.bind(this);
        this.updateListeners();
        if (this.currentPlayerType === 'computer') {
            this.executeComputerMove();
        }
    }

    reset(player1Type, player2Type) {
        if (!(player1Type instanceof Event)) {
            // Note: the logical OR operator returns the first truthy value.
            this.player1Type = player1Type || this.player1Type;
            this.player2Type = player2Type || this.player2Type;
        }
        this.initializeComputerPlayers();
        this.board.reset(); 
        this.boardView.reset();
        this.currentPlayer = 1;
        this.currentPlayerType = this.player1Type;
        // remove the event listener that resets the game upon a click on 
        // the board after a victory or tie.
        var gameBoard = document.getElementById('gameBoard');
        gameBoard.removeEventListener('click', this.boundReset);
        this.updateListeners();
        console.log(`current player: ${this.currentPlayer}`)
        console.log(`current player type: ${this.currentPlayerType}`)
        if (this.currentPlayerType === 'computer') {
            this.executeComputerMove();
        }
    }

    play(column) {
        console.log('play called')
        // if (this.currentPlayerType === 'computer') {
        //     column = this.executeComputerMove();
        // }
        try {
            this.registerMove(column);
        } catch (error) {
            if (
                error instanceof IllegalMoveError &&
                this.currentPlayerType === 'human'
            ) { 
                // If the move was illegal, then I need to re-instantiate a listener
                this.updateListeners();
                return;
            }
        }
        console.log(
            `game history: ${JSON.stringify(this.board.gameHistory.getMoveHistory())}`
        );
        this.alertWinOrTie();

        if (this.board.gameState === 'undecided') {
            this.switchPlayers();
            // Note that triggerNextMove calls createComputerMove 
            // (assuming computer's turn), but this call to createComputerMove
            // is done with a delay, so the logs will say that 
            // triggerNextMove is finished, and then play is finished
            // and only after that is createComputerMove called.
            //  But the order in which these things were registered is 
            // different than the order in which they actually occur.
            if (this.currentPlayerType === 'computer') {
                this.executeComputerMove();
            }
        } else {
            // Upon clicking the board, reset the board in the case of a 
            // victory or tie
            var gameBoard = document.getElementById('gameBoard');
            gameBoard.addEventListener('click', this.boundReset);
        }
        console.log('play finished')
    }

    switchPlayers() {
        // Switch players and their types.
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.currentPlayerType = this.currentPlayer === 1 
            ? this.player1Type 
            : this.player2Type;
        this.updateListeners();
        console.log(`current player: ${this.currentPlayer}`)
        console.log(`current player type: ${this.currentPlayerType}`)
    }

    
    updateListeners() {
        var gameBoard = document.getElementById('gameBoard');
        if (this.currentPlayerType === 'human') {
            // Directly attach the listener
            gameBoard.addEventListener('click', this.handleBoardClick);
            console.log('Board listener added');
        } else {
            // Directly remove the listener
            gameBoard.removeEventListener('click', this.handleBoardClick);
            console.log('Board listener removed');
        }
    }
    
    // resetListener() {
    //     this.reset(this.player1Type, this.player2Type);
    //     // Remove event listeners to prevent multiple resets
    //     var gameBoard = document.getElementById('gameBoard');
    //     gameBoard.removeEventListener('click', this.boundResetListener);
    // }
    
    executeComputerMove() {
        console.log('executeComputerMove called')
        if (this.currentPlayerType === 'computer') {
            // Fetch the delay from the input element
            const requestedDelay = parseInt(document.getElementById('delay-time').value, 10);
            const minimumDelay = 100;
            const defaultDelay = 750; // Default delay if input is invalid
            // Use Math.max to ensure the delay is not less than the minimum
            const delay = Math.max(isNaN(requestedDelay) ? defaultDelay : requestedDelay, minimumDelay);
    
            setTimeout(() => {
                // additional check because the player may have switched
                // to human.
                if (this.currentPlayerType === 'computer') { 
                    const computerMove = this.calculateComputerMove();
                    this.play(computerMove);
                }
            }, delay);
        }
        // If it's a human player's turn, the next move will be triggered by a click event
        console.log('executeComputerMove finished')
    }

    calculateComputerMove() {
        // technically when the computer player is making random moves, then we 
        // don't need two computer players ever, but trying to make this extensible for 
        // if and when we can make more intelligent computer players.
        console.log('calculateComputerMove called')
        console.log(`ConnectFourGame.createComputerMove current player: ${this.currentPlayer}`)
        if (this.currentPlayer === 1) {
            return this.computerPlayer1.makeComputerMove();
        } else if (this.currentPlayer === 2) {
            return this.computerPlayer2.makeComputerMove();
        }
        console.log('calculateComputerMove finished')
    }


    registerMove(column) {
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
                throw error;
            }
            else if (
                error instanceof IllegalMoveError &&
                this.currentPlayerType === 'computer'
            ) {
                console.error("Computer player made an illegal move");
            }
        }
    }

    alertWinOrTie() {
        if (
            this.board.gameState === 'win' && 
            this.currentPlayerType === 'human'
        ) {
            new WinningCelebration(this.currentPlayer).showWinningModal();
        } else if (
            this.board.gameState === 'win' && 
            this.currentPlayerType === 'computer'
        ) {
            showNotification(`Player ${this.currentPlayer} Wins`);
        } else if (this.board.gameState === 'tie') {
            console.log("It's a cat's game!!!");
            alert("It's a cat's game!!!");
        }
        // Celebrate a human's victory, but don't reset board yet
        // because we don't want the player switching logic to 
        // cause issues.

    }

    initializeComputerPlayers() {
        this.computerPlayer1 = (this.player1Type === 'computer') 
            ? new ComputerPlayer(this.board, 1) 
            : null;
        this.computerPlayer2 = (this.player2Type === 'computer') 
            ? new ComputerPlayer(this.board, 2) 
            : null;
    }
}  





function logTurnStart(turnNumber) {
    console.log('%cStart of Turn ' + turnNumber, 'font-weight: bold; color: red; font-size: 16px;');
}


   // advancedBlockingStrategy(board) {
    //     let blockingScore = 0;
    //     let opponent = this.player === 1 ? 2 : 1;

    //     // Check all directions for potential immediate threats
    //     blockingScore += this.checkImmediateThreats(board, opponent, 0, 1); // Horizontal
    //     blockingScore += this.checkImmediateThreats(board, opponent, 1, 0); // Vertical
    //     blockingScore += this.checkImmediateThreats(board, opponent, 1, 1); // Diagonal (positive slope)
    //     blockingScore += this.checkImmediateThreats(board, opponent, -1, 1); // Diagonal (negative slope)

    //     return blockingScore;
    // }

    // checkImmediateThreats(board, opponent, rowIncrement, colIncrement) {
    //     let threatScore = 0;
        
    //     for (let row = 0; row < board.rows; row++) {
    //         for (let col = 0; col < board.columns; col++) {
    //             let opponentCount = 0;
    //             let emptyCount = 0;
    //             let emptyPosition = null;

    //             for (let i = 0; i < 4; i++) {
    //                 let currentRow = row + i * rowIncrement;
    //                 let currentCol = col + i * colIncrement;

    //                 // Skip out-of-bound positions
    //                 if (currentRow < 0 || currentRow >= board.rows || currentCol < 0 || currentCol >= board.columns) {
    //                     break;
    //                 }

    //                 if (board.board[currentRow][currentCol] === opponent) {
    //                     opponentCount++;
    //                 } else if (board.board[currentRow][currentCol] === 0) {
    //                     emptyCount++;
    //                     emptyPosition = { row: currentRow, column: currentCol };
    //                 }
    //             }

    //             // Check if there's a line with 3 opponent pieces and one empty space
    //             if (opponentCount === 3 && emptyCount === 1) {
    //                 // Assign a high negative score to discourage leaving this threat open
    //                 threatScore -= 100; // You can adjust this value based on testing

    //                 // Optional: You could also return the position to block this threat
    //                 // return emptyPosition;
    //             }
    //         }
    //     }

    //     return threatScore;
    // }

    // multipleThreatsScore(board) {
    //     let threatsScore = 0;
        
    //     for (let move of board.legalMoves) {
    //         let boardCopy = board.clone();
    //         boardCopy.updateBoard(move, this.player);
            
    //         // Check if this move leads to multiple threats
    //         if (this.createsMultipleThreats(boardCopy)) {
    //             threatsScore += 100; // Assign a high score to encourage such moves
    //         }
    //     }

    //     return threatsScore;
    // }

    // createsMultipleThreats(board) {
    //     let threatCount = 0;

    //     for (let move of board.legalMoves) {
    //         let boardCopy = board.clone();
    //         boardCopy.updateBoard(move, this.player);
            
    //         if (boardCopy.gameState === 'win') {
    //             threatCount++;
    //             if (threatCount >= 2) { // Check if there are at least two winning moves
    //                 return true;
    //             }
    //         }
    //     }

    //     return false;
    // }


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

             // Remove all balloons
        //     while (balloonsContainer.firstChild) {
        //         balloonsContainer.removeChild(balloonsContainer.firstChild);
        // }
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


function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, duration);
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