// Initial variables
var board = []; //2D Array that consists of rows and columns 
var rows = 8;   // row count (depended on the difficulty)
var columns = 8; // column count (depended on the difficulty)
// initalizing difficulty flags
var beginner = false;   
var advanced = false;

// Mine related variables
var minesCount = 10; // how many mines are present on the board (dep. difficulty)
var minesLocation = [];  // "2-2", "3-4", "2-1" based on the 2D Array of the board

// variable to determine how many tiles have been clicked on the board
var tilesClicked = 0;
// bool to check if flags are enabled
var flagEnabled = false;
// number of active flags
var activeFlags = 0;
var gameOver = false;

// Element references
const startPage = document.querySelector('#start-page');
// const startButton = document.querySelector('#start-button');
const startBeginner = document.querySelector('#start-button-beginner');
const startAdvanced = document.querySelector('#start-button-advanced');
const instructionsButton = document.querySelector('#instructions-button');
const Instructions = document.querySelector('#Instructions');
const closeInstructions = document.querySelector('#close-instructions');
const gamePage = document.querySelector('#gamePage');
const restartBtn = document.querySelector('#restart-btn');
const backToMenu = document.querySelector('#backTo-btn');
const boardReference = document.querySelector('#board');
const restartMenu = document.querySelector('#restart');


// Start game in Beginner difficulty
startBeginner.addEventListener('click', () => {
    // set visibility of Game UI
    startPage.style.display = 'none';
    gamePage.style.display = 'block';
    // adjust flags to the beginner difficulty
    advanced = false;
    beginner = true;
    startGame();
});

// Start game in Advanced difficulty
startAdvanced.addEventListener('click', () => {
    startPage.style.display = 'none';
    gamePage.style.display = 'block';
    beginner = false;
    advanced = true;
    startGame();
});

// Instructions button
instructionsButton.addEventListener('click', () => {
    Instructions.style.display = 'flex';
});

closeInstructions.addEventListener('click', () => {
    Instructions.style.display = 'none';
});

// Restart button
restartBtn.addEventListener('click', () => {
    startGame();
})

// Back to Main menu Button
backToMenu.addEventListener('click', () => {
    startPage.style.display = 'flex';
    gamePage.style.display = 'none';
});

// Function to setup the game
// Will be called when any difficulty has been chosen in the Main menu
function startGame() {
    // reset Game to reset UI and reset game variables
    resetGame();
    // determining mine position based on the columns and rows
    setMines();
    // populate the 2D board Array
    // Iterat through every row
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) { // iterating through every column in the current row
            // creating tile div element in the current column
            let tile = document.createElement("div");
            // Adjusted board and tile styling based on the chosen difficulty
            tile.classList.add("tile")
            if (beginner) {
                boardReference.style.width = "400px";
                boardReference.style.height = "400px";
                tile.style.width = "48px";
                tile.style.height = "48px";
                tile.style.fontSize = "30px";
            }
            else if (advanced) {
                boardReference.style.width = "515px";
                boardReference.style.height = "515px";
                tile.style.width = "30px";
                tile.style.height = "30px";
                tile.style.fontSize = "20px";
            }
            // Initialising tile ID, to identify mine location
            // r => row-count, c => column-count
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile)
            document.querySelector("#board").append(tile);
            row.push(tile)
        }
        board.push(row)
    }
}
/*
  Randomly places a specified number of mines on a grid.
  Ensures that each mine is placed in a unique location.
 
  - Iterates until all mines are placed.
  - Generates random row (r) and column (c) indices.
  - Converts coordinates to a string ID.
  - Adds the ID to the minesLocation array if not already present.
 */
function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

/*
    Ensures that variables will be resetted, to avoid using old values.

    - sets columns, rows and minesCount based on difficulty
    - game specific variables are resetted to default
    - resetting Game UI
*/
function resetGame() {
    if (beginner) {
        rows = 8;
        columns = 8;
        minesCount = 10;
    }
    else if (advanced) {
        rows = 16;
        columns = 16;
        minesCount = 40
    }
    board = [];
    gameOver = false;
    flagEnabled = false;
    activeFlags = 0;
    tilesClicked = 0;

    minesLocation = [];

    document.querySelector('#board').innerHTML = "";
    document.querySelector("#mines-count").innerText = minesCount;
    document.querySelector('#flag-button').addEventListener("click", setFlag);
    restartMenu.style.display = 'none';
}


/*
  toggles flag-button and flagEnabled when called   
*/
function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.querySelector('#flag-button').style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.querySelector('#flag-button').style.backgroundColor = "darkgray";
    }
}
/*
  Handles the tile click event in the Minesweeper game.
  
  Functionality:
    1. Prevents interaction if the game is over or the tile has already been clicked.
    2. If flag mode is enabled (`flagEnabled` is true):
        - Places a flag (🚩) on an unmarked tile.
        - Removes a flag if the tile is already flagged.
        - Updates the displayed remaining mine count.
    3. If the clicked tile contains a mine:
        - Ends the game (`gameOver` set to true).
        - Displays the restart menu.
        - Calls `revealMines()` to show all mine locations.
    4. If the tile is not a mine:
        - Extracts row and column indices from the tile's ID.
        - Calls `checkMine(r, c)` to determine the next game action.
*/
function clickTile() {
    // Prevents clicking if the game is over or the tile is already clicked
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    // flag logic handling
    if (flagEnabled) {
        if (tile.innerText == "") { // set flag on tile
            activeFlags++;
            if (activeFlags > minesCount) {
                activeFlags = minesCount; // Prevent exceeding the number of mines
            }
            document.querySelector("#mines-count").innerText = minesCount - activeFlags
            tile.innerText = "🚩"
        }
        else if (tile.innerText == "🚩") { // remove flag from tile
            activeFlags--;
            var result = minesCount - activeFlags;
            if (result > minesCount) {
                result = minesCount;
            }
            document.querySelector("#mines-count").innerText = result
            tile.innerText = "";
        }
        return; // Exit after flagging
    }
    // check if the clicked tile is a mine, end the game
    if (minesLocation.includes(tile.id)) {
        gameOver = true;
        restartMenu.style.display = 'flex'; // Show restart menu
        revealMines(); // Reveal all mine locations
        return;
    }
    // Extract row and column indices from the tile ID 
    let coords = tile.id.split("-");
    let r = parseInt(coords[0])
    let c = parseInt(coords[1])

    // Check for surrounding mines and update the board
    checkMine(r, c);
}
// When called reveals all mine locations on the board
function revealMines() {
    // iterates through every row and column
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c]; // gets reference of the current tile
            // check if the tile id is present in the minesLocation Array
            if (minesLocation.includes(tile.id)) { 
                // reveal mine on the board
                tile.innerHTML = `<img src="./assets/images/Mine_sprite.png" width="${document.querySelector('.tile').style.width} height="${document.querySelector('.tile').style.height}"/>`
                tile.style.backgroundColor = "red"
            }

        }
    }
}
/*
  Checks if a tile at position (r - row index of tile, c - column index of tile) contains a mine or is adjacent to mines.
  
  Functionality:
    1. Ensures the tile is within bounds and hasn't been clicked already.
    2. Marks the tile as clicked and increments `tilesClicked`.
    3. Counts adjacent mines using `checkTile()` in all 8 directions.
    4. If adjacent mines are found, displays the count and adds a corresponding class.
    5. If no mines are found, recursively reveals surrounding tiles.
    6. If all safe tiles are clicked, the game is won, displaying "Cleared" and triggering the restart menu.
 */
function checkMine(r, c) {
    // checking if tile is within bounds
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }

    // Skip if the tile has already been clicked
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    // set class of tile to clicked and increment tilesClicked 
    board[r][c].classList.add("tile-clicked")
    tilesClicked += 1;
    let minesFound = 0;

    // Check for adjacent mines (8 directions)
    // top row (3 tiles)
    minesFound += checkTile(r - 1, c - 1);  // Top left
    minesFound += checkTile(r - 1, c);      // Top 
    minesFound += checkTile(r - 1, c + 1);  // Top right

    // left and right
    minesFound += checkTile(r, c - 1) // left
    minesFound += checkTile(r, c + 1) // right

    // bottom row (3 tiles)
    minesFound += checkTile(r + 1, c - 1);  // bottom left
    minesFound += checkTile(r + 1, c);      // bottom 
    minesFound += checkTile(r + 1, c + 1);  // bottom right

    // if mines are found, display the count and style the tile
    if (minesFound > 0) {
        board[r][c].innerText = minesFound // set inner text to the mines found 
        // adds css class for styling
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        // Recursively check surrounding tiles if no mines are nearby

        //top 3
        checkMine(r - 1, c - 1)
        checkMine(r - 1, c)
        checkMine(r - 1, c + 1)

        checkTile(r, c - 1) // left
        checkTile(r, c + 1) // right

        // bottom 3
        checkTile(r + 1, c - 1);  // bottom left
        checkTile(r + 1, c);  // bottom 
        checkTile(r + 1, c + 1);  // bottom right
    }

    // Check if all non-mine tiles have been revealed
    if (tilesClicked == rows * columns - minesCount) {
        document.querySelector("#mines-count").innerText = "Cleared"
        restartMenu.style.display = 'flex';  // Show restart menu
        gameOver = true; // mark the game as won
    }
}
/*
    - if tile is out of bounds => return 0;
    - if tile ID is included in mine Location => return 1;

    else return 0;
*/
function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    } 
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}
