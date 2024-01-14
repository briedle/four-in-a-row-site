const myImage = document.querySelector("img");

myImage.onclick = () => {
    const mySrc = myImage.getAttribute("src");
    if (mySrc === "images/four-in-a-row.jpg") {
        myImage.setAttribute("src", "images/giant-four-in-a-row.jpg");
    } else {
        myImage.setAttribute("src", "images/four-in-a-row.jpg");
    }
};

let myButton = document.querySelector("button");
let myHeading = document.querySelector("h1");

function setUserName() {
    const myName = prompt("Please enter your name.");
    if (!myName) {
        setUserName();
    } else {
        localStorage.setItem("name", myName);
        myHeading.textContent = `Four-in-a-Row is really fun, ${myName}!`;
    }
}
  
if (!localStorage.getItem("name")) {
    setUserName();
} else {
    const storedName = localStorage.getItem("name");
    myHeading.textContent = `Four-in-a-Row is really fun, ${storedName}!`;
}
  

  myButton.onclick = () => {
    setUserName();
  };


  let movesCount = 0;
// Creating the playing grid
document.addEventListener("DOMContentLoaded", function() {
const gridContainer = document.getElementById("grid-container");
const newGameButton = document.getElementById("new-game-button");
let currentPlayer = 1; // 1 represents Player 1, 2 represents Player 2


// Create the grid
function createGrid() {
    gridContainer.innerHTML = ''; // Clear the grid
    for (let row = 5; row >= 0; row--) {
        for (let col = 0; col < 7; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-row", row);
        cell.setAttribute("data-col", col);
        gridContainer.appendChild(cell);
        }
    }

    // Add event listener to each cell after creating the grid
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
      cell.addEventListener("click", () => {
        handleCellClick(cell);
      });
    });
  }

// Get the bottommost unfilled cell in a column
function getBottomCell(col) {
    const cells = document.querySelectorAll(`.cell[data-col="${col}"]`);
    for (let i = cells.length - 1; i >= 0; i--) {
        if (!cells[i].classList.contains("filled")) {
        return cells[i];
        }
    }
    return null; // Column is full
}

function checkForWin(row, col) {
    // Check horizontally, vertically, and diagonally
    if (
        checkHorizontal(row, col) ||
        checkVertical(row, col) ||
        checkPositiveDiagonal(row, col) || 
        checkNegativeDiagonal(row, col)
      ) {
        return true;
      }
    return false;
}

function checkForTie() {
    // Check for a tie game
    if (movesCount === 42) {
        return true
    }
    return false
}

function checkHorizontal(row, col) {
    const playerClass = `player-${currentPlayer}`;
    // Iterate through the range of four cells
    for (let i = -3; i < 1; i++) {
        for (let j = 0; j < 4; j++) {
            // console.log()
            const checkRow = row;
            const checkCol = col + i + j;
            const cell = document.querySelector(
                `.cell[data-row="${checkRow}"][data-col="${checkCol}"]`
            );
            // Check if the cell exists
            if (!cell) {
                break;
            }
            if (j === 3 && cell.classList.contains(playerClass)) {
                return true
            }
            // Check if the cell belongs to the current player or is empty
            if (cell.classList.contains(playerClass)) {
                continue; // Move to the next cell in the sequence
            } else {
                break; // If the cell belongs to the opponent, it breaks the sequence
            }
        }
    }
    return false
}
    
function checkVertical(row, col) {
    const playerClass = `player-${currentPlayer}`;
    // Iterate through the range of four cells
    for (let i = -3; i < 1; i++) {
        for (let j = 0; j < 4; j++) {
            // console.log()
            const checkRow = row + i + j;
            const checkCol = col;
            const cell = document.querySelector(
                `.cell[data-row="${checkRow}"][data-col="${checkCol}"]`
            );
            // Check if the cell exists
            if (!cell) {
                break;
            }
            if (j === 3 && cell.classList.contains(playerClass)) {
                return true
            }
            // Check if the cell belongs to the current player or is empty
            if (cell.classList.contains(playerClass)) {
                continue; // Move to the next cell in the sequence
            } else {
                break; // If the cell belongs to the opponent, it breaks the sequence
            }
        }
    }
    return false
}

function checkPositiveDiagonal(row, col) {
    const playerClass = `player-${currentPlayer}`;
    // Iterate through the range of four cells
    for (let i = -3; i < 1; i++) {
        for (let j = 0; j < 4; j++) {
            // console.log()
            const checkRow = row + i + j;
            const checkCol = col + i + j;
            const cell = document.querySelector(
                `.cell[data-row="${checkRow}"][data-col="${checkCol}"]`
            );
            // Check if the cell exists
            if (!cell) {
                break;
            }
            // If we have made it all the way to the fourth check of playerClass
            // below, then the current player wins
            if (j === 3 && cell.classList.contains(playerClass)) {
                return true
            }
            // Check if the cell belongs to the current player or is empty
            if (cell.classList.contains(playerClass)) {
                continue; // Move to the next cell in the sequence
            } else {
                break; // If the cell belongs to the opponent, it breaks the sequence
            }
        }
    }
    return false
}

function checkNegativeDiagonal(row, col) {
    const playerClass = `player-${currentPlayer}`;
    // Iterate through the range of four cells
    for (let i = -3; i < 1; i++) {
        for (let j = 0; j < 4; j++) {
            // console.log()
            const checkRow = row - i + j;
            const checkCol = col + i - j;
            const cell = document.querySelector(
                `.cell[data-row="${checkRow}"][data-col="${checkCol}"]`
            );
            // Check if the cell exists
            if (!cell) {
                break;
            }
            // If we have made it all the way to the fourth check of playerClass
            // below, then the current player wins
            if (j === 3 && cell.classList.contains(playerClass)) {
                return true
            }
            // Check if the cell belongs to the current player or is empty
            if (cell.classList.contains(playerClass)) {
                continue; // Move to the next cell in the sequence
            } else {
                break; // If the cell belongs to the opponent, it breaks the sequence
            }
        }
    }
    return false
}

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
        resetGame();

        // Remove the winner message element
        modalContent.removeChild(winnerMessage);
    }, 5000);
}

function resetGame() {
    currentPlayer = 1;
    createGrid(); // Reset the game
    movesCount = 0; // Reset moves count
}

// Handle cell click
function handleCellClick(cell) {
    // Increment moves count
    movesCount++;
    const row = cell.getAttribute("data-row");
    const col = cell.getAttribute("data-col");
    console.log(`Player ${currentPlayer} clicked on cell at row ${row}, column ${col}`);
    console.log(`Total moves: ${movesCount}`)
  
    // Get the bottommost unfilled cell in the clicked column
    const bottomCell = getBottomCell(col);
  
    // Check if the cell is already colored and the column is not full
    if (cell === bottomCell && !bottomCell.classList.contains("filled")) {
        // Toggle color based on the current player
        bottomCell.classList.add(`player-${currentPlayer}`);
        bottomCell.classList.add("filled");
  
      // Check for a winning condition or a tie game
        if (checkForWin(parseInt(row), parseInt(col))) {
            // alert(`Player ${currentPlayer} wins!`);
            // if (currentPlayer === 1) {
            // showWinningModal(player1Name);
            // } else {
            //     showWinningModal(player2Name)
            // }
            showWinningModal(currentPlayer)
            resetGame();
        } else if (checkForTie()) {
            alert("It's a cat's game!!");
            resetGame();
        } else {
            // Switch to the next player
            currentPlayer = currentPlayer === 1 ? 2 : 1;
        }
    } else if (bottomCell.classList.contains("filled")) {
        alert('You cannot go there; that cell is already filled.')
    } else {
        alert('You can only go in the bottommost cell in a column.')
    }
}
  
// // Function to prompt players for their names
// function promptForPlayerNames() {
//     const player1Name = prompt("Enter name for Player 1:");
//     const player2Name = prompt("Enter name for Player 2:");

//     // You can handle the player names as needed (e.g., display them on the UI)
//     console.log(`Player 1: ${player1Name}`);
//     console.log(`Player 2: ${player2Name}`);
// }

// // Initialize the game by prompting for player names
// promptForPlayerNames();
// Initialize the grid
resetGame();
  

// Add event listener to the New Game button
newGameButton.addEventListener("click", resetGame);

});


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
