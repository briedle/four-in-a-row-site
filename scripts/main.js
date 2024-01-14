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



// Creating the playing grid
document.addEventListener("DOMContentLoaded", function() {
const gridContainer = document.getElementById("grid-container");
const newGameButton = document.getElementById("new-game-button");
let currentPlayer = 1; // 1 represents Player 1, 2 represents Player 2
let movesCount = 0;

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


//   // Check for a winning condition
// function checkForWin(row, col) {
//     // Check horizontally, vertically, and diagonally
//     if (
//         checkLine(row, col, 0, 1) ||
//         checkLine(row, col, 1, 0) ||
//         checkLine(row, col, -1, 1) ||
//         checkLine(row, col, 1, 1)
//       ) {
//         return true;
//       }
//     // Check for a tie game
//     movesCount++;
//     if (movesCount === 42) {
//       alert("It's a cat's game!");
//       createGrid(); // Reset the game
//       movesCount = 0; // Reset moves count
//     }
//     return false;
// }

function checkForWin(row, col) {
    // Check horizontally, vertically, and diagonally
    if (
        checkHorizontal(row, col) ||
        checkVertical(row, col) ||
        checkDiagonal(row, col)
      ) {
        return true;
      }
    // Check for a tie game
    movesCount++;
    if (movesCount === 42) {
      alert("It's a cat's game!");
      createGrid(); // Reset the game
      movesCount = 0; // Reset moves count
    }
    return false;
}

// function checkLine(row, col, rowIncrement, colIncrement) {
//     const playerClass = `player-${currentPlayer}`;
//     // Iterate through the range of four cells
//     for (let i = 0; i < 4; i++) {
//         const checkRow = row + i * rowIncrement;
//         const checkCol = col + i * colIncrement;
//         const cell = document.querySelector(
//             `.cell[data-row="${checkRow}"][data-col="${checkCol}"]`
//         );

//         // Check if the cell exists
//         if (!cell) {
//             return false;
//         }
        
//         // Check if the cell belongs to the current player or is empty
//         if (cell.classList.contains(playerClass)) {
//             continue; // Move to the next cell in the sequence
//         } else {
//             return false; // If the cell belongs to the opponent, it breaks the sequence
//         }
//     }
//     return true; // All four cells are either empty or belong to the current player
// }

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

function checkDiagonal(row, col) {
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

function resetGame() {
    currentPlayer = 1;
    createGrid(); // Reset the game
    movesCount = 0; // Reset moves count
}

// Handle cell click
function handleCellClick(cell) {
    const row = cell.getAttribute("data-row");
    const col = cell.getAttribute("data-col");
    console.log(`Player ${currentPlayer} clicked on cell at row ${row}, column ${col}`);
  
    // Get the bottommost unfilled cell in the clicked column
    const bottomCell = getBottomCell(col);
  
    // Check if the cell is already colored and the column is not full
    if (bottomCell && !bottomCell.classList.contains("filled")) {
        // Toggle color based on the current player
        bottomCell.classList.add(`player-${currentPlayer}`);
        bottomCell.classList.add("filled");
  
      // Check for a winning condition or a tie game
        if (checkForWin(parseInt(row), parseInt(col))) {
            alert(`Player ${currentPlayer} wins!`);
            resetGame();
        } else {
            // Switch to the next player
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            // Increment moves count
            movesCount++;
        }
    }
}
  

// Initialize the grid
resetGame();
  
// // Add event listener to each cell
// const cells = document.querySelectorAll(".cell");
// cells.forEach(cell => {
//     cell.addEventListener("click", () => {
//     handleCellClick(cell);
//     });
// });

// Add event listener to the New Game button
newGameButton.addEventListener("click", resetGame);

});