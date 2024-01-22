export class GameHistory {
    constructor() {
        this.moves = []; // Array to store the history of moves
    }

    addMove(column, player, row) {
        // Each move is an object containing the column, player, and row
        this.moves.push({ column, player, row });
    }

    getLastMove() {
        // Retrieve the last move; returns undefined if no moves have been made
        return this.moves.length > 0 ? this.moves[this.moves.length - 1] : undefined;
    }

    undoLastMove() {
        // Remove the last move from the history
        return this.moves.pop();
    }

    reset() {
        // Clear the move history
        this.moves = [];
    }

    getMoveHistory() {
        // Return a copy of the move history
        return [...this.moves];
    }

    // Additional methods can be added here for more complex functionalities
    // like replaying the game from history, analyzing move patterns, etc.
}



export class ConnectFourBoard {

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
        this.gameHistory = new GameHistory();
    }

    registerBoardView(boardView) {
        this.boardViews.push(boardView);
    }

    notifyBoardViews() {
        for (const boardView of this.boardViews) {
            boardView.updateBoardView();
        }
    }

    reset(rows, columns) {
        this.rows = rows || this.rows;
        this.columns = columns || this.columns;
        // Reinitialize the board
        this.initializeBoard();
        // Reset other state variables
        this.updateLegalMoves();
        this.mostRecentMove = {row: null, column: null};
        this.mostRecentPlayer = null;
        this.gameState = 'undecided';
        this.winner = null;
        this.winningCells = null;
        this.gameHistory = new GameHistory();
        // Notify the board views about the reset
        this.notifyBoardViews();
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
        this.gameHistory.addMove(column, player, new_row);
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

    undoMove() {
        // Retrieve the last move
        const lastMove = this.gameHistory.undoLastMove();
    
        // Check if there is a move to undo
        if (lastMove) {
            // Remove the last piece placed
            this.board[lastMove.row][lastMove.column] = 0;
    
            // Revert the most recent move and player
            // If there are no more moves, reset these to null
            if (this.gameHistory.getMoveHistory().length > 0) {
                const previousMove = this.gameHistory.getLastMove();
                this.mostRecentMove = { row: previousMove.row, column: previousMove.column };
                this.mostRecentPlayer = previousMove.player;
            } else {
                this.mostRecentMove = { row: null, column: null };
                this.mostRecentPlayer = null;
            }
    
            // Reset game state
            // Here you may need to re-check for a winner if you're undoing a winning move
            // For simplicity, we'll set it to 'undecided', but consider more complex logic
            this.gameState = 'undecided';
            this.winner = null;
            this.winningCells = null;
    
            // Update legal moves as the last move's column is now available again
            if (!this.legalMoves.includes(lastMove.column)) {
                this.legalMoves.push(lastMove.column);
            }
    
            // If you have an observer pattern in place, notify the observers
            this.notifyBoardViews();
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
    /**
     * Creates a new instance of the ConnectFourBoard class with the same state as the current board.
     * @returns {ConnectFourBoard} A new ConnectFourBoard instance.
     */
    clone() {
        let newBoard = new ConnectFourBoard(this.rows, this.columns);
        
        // Explicitly copy the board state
        newBoard.board = this.board.map(row => [...row]);
    
        // Copy all other necessary properties
        newBoard.gameState = this.gameState;
        newBoard.legalMoves = [...this.legalMoves];
        newBoard.mostRecentMove = { ...this.mostRecentMove };
        newBoard.mostRecentPlayer = this.mostRecentPlayer;
        newBoard.winner = this.winner;
        newBoard.winningCells = this.winningCells ? this.winningCells.map(cell => ({ ...cell })) : null;
        // Do not copy the observers (boardViews)
        newBoard.boardViews = []; // Initialize with an empty array or appropriate value

        return newBoard;
    }
    
}



export class ComputerPlayer {
    constructor(board, player) {
        this.board = board;
        this.player = player;
    }

    makeComputerMove() {
        console.log('ComputerPlayer.makeComputerMove called')
        console.log(`ComputerPlayer.makeComputerMove: ${this.player}`)
        // First, check if the AI has a winning move
        for (let move of this.board.legalMoves) {
            let boardCopy = this.board.clone();
            boardCopy.updateBoard(move, this.player);
            if (boardCopy.gameState === 'win') {
                return move; // AI wins with this move, so take it
            }
        }

        // Next, check if the opponent has a winning move and block it
        let opponent = this.player === 1 ? 2 : 1;
        for (let move of this.board.legalMoves) {
            let boardCopy = this.board.clone();
            boardCopy.updateBoard(move, opponent);
            if (boardCopy.gameState === 'win') {
                return move; // Block opponent's winning move
            }
        }
        return this.chooseBestMove();
    }

    chooseBestMove() {
        let moves = [];
        let alpha = -Infinity;
        let beta = Infinity;
        let depth = 5; // Depth of the minimax algorithm; adjust as needed
        let bestScore = -Infinity;

        for (let move of this.board.legalMoves) {
            let boardCopy = this.board.clone();
            boardCopy.updateBoard(move, this.player);
            let score = this.minimax(boardCopy, depth, alpha, beta, false);
            moves.push({ move, score });
            bestScore = Math.max(bestScore, score);
        }

        // Filter and normalize scores
        moves = moves.map(moveObj => ({
            ...moveObj, 
            normalizedScore: this.normalizeScore(moveObj.score, bestScore)
        }));

        // Select a move based on normalized scores
        return this.probabilisticMoveSelection(moves);
    }

    normalizeScore(score, bestScore) {
        // Normalize score to a range between 0 and 1 based on the best score
        return (score - bestScore) / bestScore;
    }

    probabilisticMoveSelection(moves) {
        // Sum of all normalized scores
        const total = moves.reduce((acc, moveObj) => acc + moveObj.normalizedScore, 0);

        // Generate a random number between 0 and total
        let rand = Math.random() * total;
        
        // Select a move based on the random number
        for (const moveObj of moves) {
            if (rand < moveObj.normalizedScore) return moveObj.move;
            rand -= moveObj.normalizedScore;
        }

        // Default to a random move as a fallback
        return this.chooseRandomMove();
    }
    
    minimax(board, depth, alpha, beta, maximizingPlayer) {
        if (depth === 0 || board.gameState !== 'undecided') {
            return this.evaluateBoard(board);
        }
    
        if (maximizingPlayer) {
            let maxEval = -Infinity;
            for (let move of board.legalMoves) {
                let boardCopy = board.clone();
                boardCopy.updateBoard(move, this.player);
                let evaluation = this.minimax(boardCopy, depth - 1, alpha, beta, false);
                maxEval = Math.max(maxEval, evaluation);
                alpha = Math.max(alpha, evaluation);
                if (beta <= alpha) {
                    break;
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            let opponent = this.player === 1 ? 2 : 1;
            for (let move of board.legalMoves) {
                let boardCopy = board.clone();
                boardCopy.updateBoard(move, opponent);
                let evaluation = this.minimax(boardCopy, depth - 1, alpha, beta, true);
                minEval = Math.min(minEval, evaluation);
                beta = Math.min(beta, evaluation);
                if (beta <= alpha) {
                    break;
                }
            }
            return minEval;
        }
    }
    
    evaluateBoard(board) {
        let score = 0;
    
        // Heuristic 1: Center Column Control
        for (let row = 0; row < board.rows; row++) {
            if (board.board[row][Math.floor(board.columns / 2)] === this.player) {
                score += 3; // Higher score for center pieces
            }
        }
    
        // Heuristic 2: Horizontal Alignment
        for (let row = 0; row < board.rows; row++) {
            for (let col = 0; col < board.columns - 3; col++) {
                score += this.evaluatePosition(board, row, col, 0, 1);
            }
        }
    
        // Heuristic 3: Vertical Alignment
        for (let col = 0; col < board.columns; col++) {
            for (let row = 0; row < board.rows - 3; row++) {
                score += this.evaluatePosition(board, row, col, 1, 0);
            }
        }
    
        // Heuristic 4: Diagonal Alignment (Positive Slope)
        for (let row = 0; row < board.rows - 3; row++) {
            for (let col = 0; col < board.columns - 3; col++) {
                score += this.evaluatePosition(board, row, col, 1, 1);
            }
        }
    
        // Heuristic 5: Diagonal Alignment (Negative Slope)
        for (let row = 3; row < board.rows; row++) {
            for (let col = 0; col < board.columns - 3; col++) {
                score += this.evaluatePosition(board, row, col, -1, 1);
            }
        } 

        score += this.evaluateThreats(board);
        // score += this.advancedBlockingStrategy(board);
        // score += this.multipleThreatsScore(board);
        
        return score;
    }


    evaluateThreats(board) {
        let threatScore = 0;
        let opponent = this.player === 1 ? 2 : 1;
    
        // Check horizontal threats
        for (let row = 0; row < board.rows; row++) {
            for (let col = 0; col < board.columns - 3; col++) {
                if (this.checkThreat(board, row, col, 0, 1, opponent)) {
                    threatScore -= 50;
                }
            }
        }
    
        // Check vertical threats
        for (let col = 0; col < board.columns; col++) {
            for (let row = 0; row < board.rows - 3; row++) {
                if (this.checkThreat(board, row, col, 1, 0, opponent)) {
                    threatScore -= 50;
                }
            }
        }
    
        // Check diagonal threats (positive slope)
        for (let row = 0; row < board.rows - 3; row++) {
            for (let col = 0; col < board.columns - 3; col++) {
                if (this.checkThreat(board, row, col, 1, 1, opponent)) {
                    threatScore -= 50;
                }
            }
        }
    
        // Check diagonal threats (negative slope)
        for (let row = 3; row < board.rows; row++) {
            for (let col = 0; col < board.columns - 3; col++) {
                if (this.checkThreat(board, row, col, -1, 1, opponent)) {
                    threatScore -= 50;
                }
            }
        }
    
        return threatScore;
    }
    
    checkThreat(board, row, col, rowIncrement, colIncrement, opponent) {
        let opponentCount = 0;
        let emptyCount = 0;
    
        for (let i = 0; i < 4; i++) {
            let currentRow = row + i * rowIncrement;
            let currentCol = col + i * colIncrement;
    
            if (currentRow < 0 || currentRow >= board.rows || currentCol < 0 || currentCol >= board.columns) {
                continue; // Skip out-of-bound positions
            }
    
            if (board.board[currentRow][currentCol] === opponent) {
                opponentCount++;
            } else if (board.board[currentRow][currentCol] === 0) {
                emptyCount++;
            }
        }
    
        // Detect a threat (three in a row with an opening)
        return opponentCount === 3 && emptyCount === 1;
    }
    
    evaluatePosition(board, row, col, rowIncrement, colIncrement) {
        let playerCount = 0;
        let emptyCount = 0;
    
        for (let i = 0; i < 4; i++) {
            if (board.board[row + i * rowIncrement][col + i * colIncrement] === this.player) {
                playerCount++;
            } else if (board.board[row + i * rowIncrement][col + i * colIncrement] === 0) {
                emptyCount++;
            }
        }
    
        // Assign scores based on the number of player pieces and empty spaces in the sequence
        if (playerCount === 4) {
            return 100; // Highest score for 4 in a row
        } else if (playerCount === 3 && emptyCount === 1) {
            return 10; // High score for 3 in a row with an empty space for the 4th
        } else if (playerCount === 2 && emptyCount === 2) {
            return 5; // Moderate score for 2 in a row with spaces for the others
        }
    
        return 0;
    }

 
    
    chooseRandomMove() {
        let legalMoves = this.board.legalMoves;
        let randomIndex = Math.floor(Math.random() * legalMoves.length);
        return legalMoves[randomIndex];
    }
}