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

var tilesClicked = 0; // goal to click all tiles except the ones containing mines
var flagEnabled = false;
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


// Start game button
startBeginner.addEventListener('click', () => {
    startPage.style.display = 'none';
    gamePage.style.display = 'block';
    advanced = false;
    beginner = true;
    startGame();
});
// Start game button
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

// restart button
restartBtn.addEventListener('click', () => {
    startGame();
})

//back To Main menu
backToMenu.addEventListener('click', () => {
    startPage.style.display = 'flex';
    gamePage.style.display = 'none';
});

// Später noch ändern
// window.onload = function(){
//     startGame();
// }



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

function startGame() {
    resetGame();
    setMines();

    // populate board
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
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
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile)
            document.querySelector("#board").append(tile);
            row.push(tile)
        }
        board.push(row)
    }


}

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

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            activeFlags++;
            if (activeFlags > minesCount) {
                activeFlags = minesCount;
            }
            document.querySelector("#mines-count").innerText = minesCount - activeFlags
            tile.innerText = "🚩"
        }
        else if (tile.innerText == "🚩") {
            activeFlags--;
            var result = minesCount - activeFlags;
            if (result > minesCount) {
                result = minesCount;
            }
            document.querySelector("#mines-count").innerText = result
            tile.innerText = "";
        }
        return;
    }

    if (minesLocation.includes(tile.id)) {
        // alert("Game Over");
        gameOver = true;
        restartMenu.style.display = 'flex';
        revealMines()
        return;
    }

    let coords = tile.id.split("-");
    let r = parseInt(coords[0])
    let c = parseInt(coords[1])
    checkMine(r, c);
}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerHTML = `<img src="./assets/images/Mine_sprite.png" width="${document.querySelector('.tile').style.width} height="${document.querySelector('.tile').style.height}"/>`
                // "💣"
                tile.style.backgroundColor = "red"
            }

        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }
    board[r][c].classList.add("tile-clicked")
    tilesClicked += 1;
    let minesFound = 0;

    // top 3
    minesFound += checkTile(r - 1, c - 1);  // top left
    minesFound += checkTile(r - 1, c);  // top 
    minesFound += checkTile(r - 1, c + 1);  // top right
    // left and right
    minesFound += checkTile(r, c - 1) // left
    minesFound += checkTile(r, c + 1) // right

    // bottom 3
    minesFound += checkTile(r + 1, c - 1);  // bottom left
    minesFound += checkTile(r + 1, c);  // bottom 
    minesFound += checkTile(r + 1, c + 1);  // bottom right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
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

    if (tilesClicked == rows * columns - minesCount) {
        document.querySelector("#mines-count").innerText = "Cleared"
        restartMenu.style.display = 'flex';
        gameOver = true;
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}
