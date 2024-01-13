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
  
// Create the grid
function createGrid() {
    gridContainer.innerHTML = ''; // Clear the grid
    for (let row = 0; row < 6; row++) {
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


  // Check for a winning condition
function checkForWin(row, col) {
    // Check horizontally, vertically, and diagonally
    if (
        checkLine(row, col, 0, 1) ||
        checkLine(row, col, 1, 0) ||
        checkLine(row, col, -1, 1) ||
        checkLine(row, col, 1, 1)
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

// Check for four in a row along a specific line
function checkLine(row, col, rowIncrement, colIncrement) {
    const playerClass = `player-${currentPlayer}`;
    const startRow = row - 3 * rowIncrement;
    const startCol = col - 3 * colIncrement;

    for (let i = 0; i < 4; i++) {
      const checkRow = startRow + i * rowIncrement;
      const checkCol = startCol + i * colIncrement;

      const cell = document.querySelector(
        `.cell[data-row="${checkRow}"][data-col="${checkCol}"]`
      );

      if (!cell || !cell.classList.contains(playerClass)) {
        return false;
      }
    }

    alert(`Player ${currentPlayer} wins!`);
    createGrid(); // Reset the game
    movesCount = 0; // Reset moves count
    return true;
}


// Add event listener to each cell
function handleCellClick(cell) {
    const row = cell.getAttribute("data-row");
    const col = cell.getAttribute("data-col");
    console.log(`Clicked on cell at row ${row}, column ${col}`);

    // Get the bottommost unfilled cell in the clicked column
    const bottomCell = getBottomCell(col);  

    // Check for a winning condition or a tie game
    if (checkForWin(parseInt(row), parseInt(col))) {
        // Winning condition alert is handled in checkForWin
    } else {
        // Switch to the next player
        currentPlayer = currentPlayer === 1 ? 2 : 1;
    }
    }
}

// Initialize the grid
createGrid();
  
// // Add event listener to each cell
// const cells = document.querySelectorAll(".cell");
// cells.forEach(cell => {
//     cell.addEventListener("click", () => {
//     handleCellClick(cell);
//     });
// });

// Add event listener to the New Game button
newGameButton.addEventListener("click", () => {
    currentPlayer = 1; // Reset to Player 1
    createGrid(); // Clear the grid and create a new one
});
});