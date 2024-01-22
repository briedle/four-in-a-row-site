// simulateGames.js
import { ConnectFourBoard } from './ConnectFourClasses.js';
import { ComputerPlayer } from './ConnectFourClasses.js';
import fs from 'fs';


// import { GameHistory } from './GameHistory.js'; // Assuming you have a GameHistory.js

// ... rest of your simulation code ...

function simulateGames(numGames) {
    const results = new Array(numGames); // Array to store each game's result
    const gameHistories = []; // To store the history of each game

    for (let i = 0; i < numGames; i++) {
        const board = new ConnectFourBoard(6, 7); // Assuming 6 rows, 7 columns
        // const gameHistory = new GameHistory();
        const player1 = new ComputerPlayer(board, 1);
        const player2 = new ComputerPlayer(board, 2);
        let currentPlayer = 1;

        while (board.gameState === 'undecided') {
            const move = currentPlayer === 1 ? player1.makeComputerMove() : player2.makeComputerMove();
            board.updateBoard(move, currentPlayer);
            // gameHistory.addMove(move, currentPlayer, board.mostRecentMove.row);

            // Switch players
            currentPlayer = currentPlayer === 1 ? 2 : 1;
        }

        // Record game result
        if (board.gameState === 'win') {
            results[i] = board.winner; // Record the winner (1 or 2)
        } else if (board.gameState === 'draw') {
            results[i] = 0; // Record a draw as 0
        }

        gameHistories.push(board.gameHistory.getMoveHistory()); // Store the history of this game
    }

    return { results, gameHistories };
}

// Simulate 1000 games
const simulationResult = simulateGames(10);
console.log(simulationResult.results); // Summary of wins and draws

fs.writeFile('simulationResults.json', JSON.stringify(simulationResult), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});
