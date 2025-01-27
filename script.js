var board = [];
var rows = 8;
var columns = 8;

var minesCount = 5;
var minesLocation = [];  // "2-2", "3-4", "2-1" based on the 2D Array of the board

var tilesClicked = 0; // goal to click all tiles except the ones containing mines
var flagEnabled = false;

var gameOver = false;

// Später noch ändern
window.onload = function(){
    startGame();
}

function setMines(){
    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if(!minesLocation.includes(id)){
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function startGame() {
    document.querySelector("#mines-count").innerText = minesCount;
    document.querySelector('#flag-button').addEventListener("click", setFlag)
    setMines();

    // populate board
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile)
            document.querySelector("#board").append(tile);
            row.push(tile)
        }
        board.push(row)
    }
    console.log(board);
}

function setFlag(){
    if(flagEnabled){
        flagEnabled = false;
        document.querySelector('#flag-button').style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.querySelector('#flag-button').style.backgroundColor = "darkgray";
    }
}

function clickTile(){
    if (gameOver || this.classList.contains("tile-clicked")){
        return;
    }

    let tile = this;
    if(flagEnabled){
        if(tile.innerText == ""){
            tile.innerText = "🚩"
        }
        else if(tile.innerText == "🚩"){
            tile.innerText = "";
        }
        return;
    }

    if(minesLocation.includes(tile.id)){
        // alert("Game Over");
        gameOver = true;
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
            if(minesLocation.includes(tile.id)){
                tile.innerText = "💣"
                tile.style.backgroundColor = "red"
            }
            
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns){
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }
    board[r][c].classList.add("tile-clicked")
    tilesClicked += 1;
    let minesFound = 0;

    // top 3
    minesFound += checkTile(r-1, c-1);  // top left
    minesFound += checkTile(r-1, c);  // top 
    minesFound += checkTile(r-1, c+1);  // top right
    // left and right
    minesFound += checkTile(r, c-1) // left
    minesFound += checkTile(r, c+1) // right

    // bottom 3
    minesFound += checkTile(r+1, c-1);  // bottom left
    minesFound += checkTile(r+1, c);  // bottom 
    minesFound += checkTile(r+1, c+1);  // bottom right

    if(minesFound > 0){
        board[r][c].innerText = minesFound
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        //top 3
        checkMine(r-1, c-1)
        checkMine(r-1, c)
        checkMine(r-1, c+1)

        checkTile(r, c-1) // left
        checkTile(r, c+1) // right

        // bottom 3
        checkTile(r+1, c-1);  // bottom left
        checkTile(r+1, c);  // bottom 
        checkTile(r+1, c+1);  // bottom right
    }

    if(tilesClicked == rows * columns - minesCount){
        document.querySelector("#mines-count").innerText = "Cleared"
        gameOver = true;
    }
}

function checkTile(r, c){
    if (r < 0 || r >= rows || c < 0 || c >= columns){
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-"+c.toString())){
        return 1;
    }
    return 0;
}
