document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    let currentRoom = null;
    let playerSymbol = null;
    let gameActive = false;

    const createRoom = document.getElementById("create_room");
    const joinRoom = document.getElementById("join_room");
    const resetGame = document.getElementById("reset_game");
    const leave_room = document.getElementById("leave_room");

    // Function for checking is the Browser supports WebSockets...
    socket.on("connect", () => {
        console.log("Connected to Server");
    });

    // Function for checking is the Browser supports WebSockets...
    socket.on("disconnect", () => {
        console.log("Player Disconnected from Server");
    });

    // Function that send message to Server to Create Room...
    const createRoomFunction = () => {
        socket.emit("create_room");
    };

    // Function that send message to Server to Join Room...
    const joinRoomFunction = () => {
        const room = document
            .getElementById("joinRoomInput")
            .value.trim()
            .toUpperCase();

        if (room) {
            socket.emit("join_room", { room: room });
        } else {
            alert("Please enter a room code");
        }
    };

    // Leave Room Function...
    const leaveRoomFunction = () => {
        if (currentRoom) {
            socket.emit("leave_room", { room: currentRoom });

            document.getElementById("setupScreen").classList.remove("hidden");
            document.getElementById("gameScreen").classList.add("hidden");

            currentRoom = null;
            playerSymbol = null;
            gameActive = false;
            document.getElementById("joinRoomInput").value = "";
        }
    };

    // Function that send Move message to Server...
    const makeMove = (index) => {
        if (gameActive && currentRoom) {
            socket.emit("make_move", { room: currentRoom, index: index });
        }
    };

    // Function that send Reset message to Server...
    const resetGameFunction = () => {
        if (currentRoom) {
            socket.emit("reset_game", { room: currentRoom });
        }
    };

    // Socket Event Handlers room created...
    socket.on("room_created", (data) => {
        currentRoom = data.room;
        playerSymbol = data.symbol;

        // Update the score for the player who joined the room...
        document.getElementById("player_x").innerText = data.X_Score;
        document.getElementById("player_o").innerText = data.O_Score;
        
        document.getElementById("setupScreen").classList.add("hidden");
        document.getElementById("gameScreen").classList.remove("hidden");
        document.getElementById("roomCode").textContent =
            "Room Code: " + currentRoom;
        document.getElementById("playerInfo").textContent =
            "You are: " + playerSymbol;

        updateStatus("Waiting for opponent...");
        createBoard();
    });

    // Socket Event Handlers room joined...
    socket.on("room_joined", (data) => {
        currentRoom = data.room;
        playerSymbol = data.symbol;

        // Update the score for the player who joined the room...
        document.getElementById("player_x").innerText = data.X_Score;
        document.getElementById("player_o").innerText = data.O_Score;

        document.getElementById("setupScreen").classList.add("hidden");
        document.getElementById("gameScreen").classList.remove("hidden");
        document.getElementById("roomCode").textContent =
            "Room Code: " + currentRoom;
        document.getElementById("playerInfo").textContent =
            "You are: " + playerSymbol;
        createBoard();
    });

    // Socket Event Handlers game started...
    socket.on("game_start", (data) => {
        gameActive = true;
        updateBoard(data.board);
        updateStatus(data.turn === playerSymbol ? "Your turn!" : "Opponent's turn");
    });

    // Socket Event Handlers move made...
    socket.on("move_made", (data) => {
        updateBoard(data.board);
        const winningCombination = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        // Condition to highlight winning combination...
        if (data.winner && data.winner !== "draw") {
            for (let combo of winningCombination) {
                if (
                    data.board[combo[0]] === data.winner &&
                    data.board[combo[1]] === data.winner &&
                    data.board[combo[2]] === data.winner
                ) {
                    const cells = document.querySelectorAll(".cell");
                    cells[combo[0]].classList.add("bg-green-200");
                    cells[combo[1]].classList.add("bg-green-200");
                    cells[combo[2]].classList.add("bg-green-200");
                }
            }
        }

        // Condition to Show winner status...
        if (data.winner) {
            // Update the score for the player who joined the room...
            document.getElementById("player_x").innerText = data.X_Score;
            document.getElementById("player_o").innerText = data.O_Score;
            gameActive = false;
            if (data.winner === "draw") {
                updateStatus("It's a draw! 🤝");
            } else {
                updateStatus(
                    data.winner === playerSymbol ? "You won! 🎉" : "You lost! 😢"
                );
            }
            highlightWinnerBoard();
        } else {
            updateStatus(
                data.turn === playerSymbol ? "Your turn!" : "Opponent's turn"
            );
            highlightWinnerBoard();
        }
    });

    // Socket Event Handlers game reset...
    socket.on("game_reset", (data) => {
        gameActive = true;
        updateBoard(data.board);
        updateStatus(data.turn === playerSymbol ? "Your turn!" : "Opponent's turn");
    });

    // Socket Event Handlers opponent left...
    socket.on("opponent_left", () => {
        gameActive = false;
        updateStatus("Opponent left the game 👋");
    });

    // Socket Event Handlers error...
    socket.on("error", (data) => {
        console.error("Error:", data);
        alert(data.message);
    });

    // Function that creates the Game Board...
    const createBoard = () => {
        const board = document.getElementById("board");
        if (!board) return;
        board.innerHTML = "";
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement("button");
            cell.className =
                "cell w-20 h-20 border border-gray-400 text-4xl font-bold text-center";
            cell.onclick = () => makeMove(i);
            board.appendChild(cell);
        }
    };

    // Function that Updates the Game Board...
    const updateBoard = (boardState) => {
        const cells = document.querySelectorAll(".cell");
        const baseClass =
            "cell w-20 h-20 border border-gray-400 text-4xl font-bold text-center";
        cells.forEach((cell, index) => {
            const val = (boardState && boardState[index]) || "";
            cell.textContent = val;
            cell.disabled = val !== "" || !gameActive;
            cell.className = baseClass;
            if (val === "X") cell.classList.add("x");
            if (val === "O") cell.classList.add("o");
        });
    };

    // Function that Updates the Status Message Like "Waiting for opponent"...
    const updateStatus = (message) => {
        const statusEl = document.getElementById("status");
        if (statusEl) statusEl.textContent = message;
    };

    // Handliing all Event Listeners...
    if (createRoom) createRoom.addEventListener("click", createRoomFunction);
    if (joinRoom) joinRoom.addEventListener("click", joinRoomFunction);
    if (resetGame) resetGame.addEventListener("click", resetGameFunction);
    if (leave_room) leave_room.addEventListener("click", leaveRoomFunction);
});
