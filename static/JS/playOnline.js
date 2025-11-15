document.addEventListener('DOMContentLoaded', () => {
    const socket = io()
    let currentRoom = null;
    let playerSymbol = null;
    let gameActive = false;
    
    const createRoom = document.getElementById('create_room');
    const joinRoom = document.getElementById('join_room');
    const resetGame = document.getElementById('reset_game');
    const leave_room = document.getElementById('leave_room');
    
    socket.on('connect', () => {
        console.log('Player Connected to Server');
    });
    
    socket.on('disconnect', function() {
        console.log('Player Disconnected from Server');
    });
    
    const createRoomFunction = () => {
        console.log('Creating Room...');
        socket.emit('create_room');
    }
    
    const joinRoomFunction = () => {
        const room = document
        .getElementById("joinRoomInput")
        .value.trim()
        .toUpperCase();
    
        if (room) {
            console.log('Joining room:', room);
            socket.emit('join_room', {room: room});
        } else {
            alert('Please enter a room code');
        }
    };
    
    const leaveRoomFunction = () => {
        if (currentRoom) {
            socket.emit('leave_room', {room: currentRoom});
    
            document.getElementById("setupScreen").classList.remove("hidden");
            document.getElementById("gameScreen").classList.add("hidden");
    
            currentRoom = null;
            playerSymbol = null;
            gameActive = false;
            document.getElementById('joinRoomInput').value = '';
        }
    };
    
    const makeMove = (index) => {
        if (gameActive && currentRoom) {
            console.log('Making move at index:', index);
            socket.emit('make_move', {room: currentRoom, index: index});
        }
    };
    
    const resetGameFunction = () => {
        if (currentRoom) {
            console.log('Resetting game');
            socket.emit('reset_game', {room: currentRoom});
        }
    };
    
    socket.on('room_created', (data) => {
        console.log('Room created:', data);
        currentRoom = data.room;
        playerSymbol = data.symbol;
    
        document.getElementById("setupScreen").classList.add("hidden");
        document.getElementById("gameScreen").classList.remove("hidden");
        document.getElementById("roomCode").textContent = "Room Code: " + currentRoom;
        document.getElementById("playerInfo").textContent =
        "You are: " + playerSymbol;
    
        updateStatus('Waiting for opponent...');
        createBoard();
    });
    
    socket.on('room_joined', (data) => {
        console.log('Room joined:', data);
        currentRoom = data.room;
        playerSymbol = data.symbol;
    
        document.getElementById('setupScreen').classList.add('hidden');
        document.getElementById('gameScreen').classList.remove('hidden');
        document.getElementById('roomCode').textContent = 'Room Code: ' + currentRoom;
        document.getElementById('playerInfo').textContent = 'You are: ' + playerSymbol;
        createBoard();
    });
    
    socket.on('game_start', (data) => {
        console.log('Game started:', data);
        gameActive = true;
        updateBoard(data.board);
        updateStatus(data.turn === playerSymbol ? "Your turn!" : "Opponent's turn");
    });
    
    socket.on('move_made', (data) => {
        console.log('Move made:', data);
        updateBoard(data.board);
        if (data.winner) {
            gameActive = false;
            if (data.winner === 'draw') {
                updateStatus("It's a draw! 🤝");
            } else {
                updateStatus(data.winner === playerSymbol ? "You won! 🎉" : "You lost! 😢");
            }
        } else {
            updateStatus(data.turn === playerSymbol ? "Your turn!" : "Opponent's turn");
        }
    });
    
    socket.on('game_reset', (data) => {
        console.log('Game reset:', data);
        gameActive = true;
        updateBoard(data.board);
        updateStatus(data.turn === playerSymbol ? "Your turn!" : "Opponent's turn");
    });
    
    socket.on('opponent_left', () => {
        console.log('Opponent left');
        gameActive = false;
        updateStatus('Opponent left the game 👋');
    });
    
    socket.on('error', (data) => {
        console.error('Error:', data);
        alert(data.message);
    });
    
    
    const createBoard = () => {
        const board = document.getElementById('board');
        if (!board) return;
        board.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('button');
            cell.className = 'cell w-20 h-20 border border-gray-400 text-4xl font-bold text-center';
            cell.onclick = () => makeMove(i);
            board.appendChild(cell);
        }
    };
    
    const updateBoard = (boardState) => {
        const cells = document.querySelectorAll('.cell');
        const baseClass = 'cell w-20 h-20 border border-gray-400 text-4xl font-bold text-center';
        cells.forEach((cell, index) => {
            const val = (boardState && boardState[index]) || '';
            cell.textContent = val;
            cell.disabled = val !== '' || !gameActive;
            cell.className = baseClass;
            if (val === 'X') cell.classList.add('x');
            if (val === 'O') cell.classList.add('o');
        });
    };
    
    const updateStatus = (message) => {
        const statusEl = document.getElementById('status');
        if (statusEl) statusEl.textContent = message;
    };
    
    if (createRoom) createRoom.addEventListener('click', createRoomFunction);
    if (joinRoom) joinRoom.addEventListener('click', joinRoomFunction);
    if (resetGame) resetGame.addEventListener('click', resetGameFunction);
    if (leave_room) leave_room.addEventListener('click', leaveRoomFunction);
});