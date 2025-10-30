const boxes = document.querySelectorAll(".box");
const resetButton = document.getElementById("reset_game");
const winningText = document.getElementById("winner");
const winningBanner = document.getElementById("winning_banner");
const main = document.getElementById("main");
const playAgainButton = document.getElementById("play_again");
const playerXPoints = document.getElementById("player_x");
const playerOPoints = document.getElementById("player_o");
const playerTurnMessage = document.getElementById("player_turn");
const clearBoardButton = document.getElementById("clear_board");

let turnForX = true;
let playerX = 0;
let playerO = 0;
playerXPoints.textContent = playerX;
playerOPoints.textContent = playerO;
playerTurnMessage.textContent = "Player O Turn";

const winingPattern = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Winner message Methode....
const showWinner = (winner) => {
    if (winner === 'X')
        playerXPoints.textContent = ++playerX;
    else
        playerOPoints.textContent = ++playerO;
    winningBanner.classList.remove("hidden");
    main.classList.add("blur")
    winningText.textContent = `Player ${winner} Win`;
    disableBoxes();
};

// Checking Turn of X or O
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if(turnForX) {
            playerTurnMessage.textContent = "Player X Turn";
            box.value = "O";
            turnForX = false;
        } else {
            playerTurnMessage.textContent = "Player O Turn";
            box.value = "X";
            turnForX = true;
        }
        box.disabled = true;

        checkWinner();
    });
});

// Checking Winner.....
const checkWinner = () => {
    for(let pattern of winingPattern) {
        let pos1Val = boxes[pattern[0]].value;
        let pos2Val = boxes[pattern[1]].value;
        let pos3Val = boxes[pattern[2]].value;

        if(pos1Val != "" && pos2Val != "" && pos3Val != "") {
            if(pos1Val === pos2Val && pos2Val === pos3Val) {
                showWinner(pos1Val);
            }
        }
    }
};

// Disable all All Button methode after winning....
const disableBoxes = () => {
    for(let box of boxes) {
        box.disabled = true;
    }
}

//Reset Game Function....
const resetGame = () => {
    turnForX = true;
    playerTurnMessage.textContent = "Player O Turn";
    playerX = 0;
    playerO = 0;
    playerXPoints.textContent = playerX;
    playerOPoints.textContent = playerO;
    enableBoxes();
};

// Play Again Methode...
const playAgain = () => {
    winningBanner.classList.add("hidden");
    main.classList.remove("blur")
    enableBoxes();
};

// Enabling all Button methode after resetting the game...
const enableBoxes = () => {
    for(let box of boxes) {
        box.disabled = false;
        box.value = "";
    }
}

resetButton.addEventListener("click", resetGame);
play_again.addEventListener("click", playAgain);
clearBoardButton.addEventListener("click", enableBoxes);