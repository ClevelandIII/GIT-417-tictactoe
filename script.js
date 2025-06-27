let playerTurn = true;
let computerMoveTimeout = 0;

const gameStatus = {
    MORE_MOVES_LEFT: 1,
    HUMAN_WINS: 2,
    COMPUTER_WINS: 3,
    DRAW_GAME: 4,
};

window.addEventListener("DOMContentLoaded", domLoaded);

function domLoaded() {
    // Setup the click event for the "New game" button
    const newBtn = document.getElementById("newGameButton");
    newBtn.addEventListener("click", newGame);

    // Create click-event handlers for each game board button
    const buttons = getGameBoardButtons();
    for (let button of buttons) {
        button.addEventListener("click", function () {
            boardButtonClicked(button);
        });
    }

    // Clear the board
    newGame();
}

// Returns an array of 9 <button> elements that make up the game board. The first 3
// elements are the top row, the next 3 the middle row, and the last 3 the
// bottom row.
function getGameBoardButtons() {
    return document.querySelectorAll("#gameBoard > button");
}

function checkForWinner() {
    const buttons = getGameBoardButtons();

    // Ways to win
    const possibilities = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], // rows
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], // columns
        [0, 4, 8],
        [2, 4, 6], // diagonals
    ];

    // Check for a winner first
    for (let indices of possibilities) {
        if (
            buttons[indices[0]].innerHTML !== "" &&
            buttons[indices[0]].innerHTML === buttons[indices[1]].innerHTML &&
            buttons[indices[1]].innerHTML === buttons[indices[2]].innerHTML
        ) {
            // Found a winner
            if (buttons[indices[0]].innerHTML === "X") {
                return gameStatus.HUMAN_WINS;
            } else {
                return gameStatus.COMPUTER_WINS;
            }
        }
    }

    // See if any more moves are left
    for (let button of buttons) {
        if (button.innerHTML !== "X" && button.innerHTML !== "O") {
            return gameStatus.MORE_MOVES_LEFT;
        }
    }

    // If no winner and no moves left, then it's a draw
    return gameStatus.DRAW_GAME;
}

function newGame() {
    clearTimeout(computerMoveTimeout);
    computerMoveTimeout = 0;

    let button = getGameBoardButtons();

    for (let b of button) {
        b.textContent = "";
        b.classList = "";
        b.disabled = false;
    }

    playerTurn = true;
    document.getElementById("turnInfo").textContent = "Your turn";
}

function boardButtonClicked(button) {
    if (playerTurn == true) {
        button.textContent = "X";
        button.classList = "x";
        button.disabled = true;
    }
    switchTurn();
}

function switchTurn() {
    let status = checkForWinner();

    if (status == gameStatus.MORE_MOVES_LEFT) {
        if(playerTurn){
            computerMoveTimeout = setTimeout(makeComputerMove, 1000);
        }
        playerTurn = !playerTurn;

        if (playerTurn == false) {
            document.getElementById("turnInfo").textContent = "Computer's turn";
        } else {
            document.getElementById("turnInfo").textContent = "Your turn";
        }
    } else {
        playerTurn = false;

        if (status == gameStatus.HUMAN_WINS) {
            document.getElementById("turnInfo").textContent = "You win!";
        } else if (status == gameStatus.COMPUTER_WINS) {
            document.getElementById("turnInfo").textContent = "Computer wins!";
        } else if (status == gameStatus.DRAW_GAME) {
            document.getElementById("turnInfo").textContent = "Draw game";
        }
    }
}

function makeComputerMove() {
	// THIS CODE HAS BEEN COMPLETED FOR YOU
    // Find indices of available buttons
	const buttons = getGameBoardButtons();
	let indices = [];
	buttons.forEach((button, i) => {
		if (button.innerHTML !== "X" && button.innerHTML !== "O") {
			indices.push(i);
		}
	});

	// If an index is available, pick randomly
	if (indices.length > 0) {
		const index = indices[Math.floor(Math.random() * indices.length)];
		buttons[index].innerHTML = "O";
		buttons[index].classList.add("o");

		// Don't allow user to click this button
		buttons[index].disabled = true;

		// Switch turn back to player
		switchTurn();
	}
}