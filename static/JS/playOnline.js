const socket = io()

const username = document.getElementById('username');
const roomButton = document.getElementById('rooms_buttons');
const createRoom = document.getElementById('create_room');
const joinRoom = document.getElementById('join_room');
const joinRoomDiv = document.getElementById('join_room_div');
const joinRoomId = document.getElementById('join_room_id');
const joinRoomBtn = document.getElementById('join_room_btn');
const roomIdDiv = document.getElementById('room_id_div');
const roomIdValue = document.getElementById('room_id_value');
const status = document.getElementById('status');

const gameSection = document.getElementById('game_section');
const patchUser = document.getElementById('patch_user');
const playerXName = document.getElementById('player_x_name');
const playerOName = document.getElementById('player_o_name');

let ROOM_ID;

// Create Room....
const createRoomFunction = () => {
    username.disabled = true;
    const roomId = Math.floor(Math.random() * 900000) + 100000;
    ROOM_ID = roomId;
    roomIdDiv.classList.remove('hidden');
    roomButton.classList.add('hidden');
    roomIdValue.textContent = roomId;
    let statusText = "Waiting for players to join";

    intervalId = setInterval(() => {
        socket.emit('check_room_status', {'room': roomId})
        socket.on('room_status', (data) => {
            if (data.status === 2) {
                statusText = "Room is ready";
                gameSection.classList.remove('hidden');
                patchUser.classList.add('hidden');

                socket.emit('get_rooms_info', {'room': joinRoomId.value})
                socket.on('room_info', (data) => {
                    playerXName.textContent = `${data.room[ROOM_ID][0]}:`;
                    playerOName.textContent = `${data.room[ROOM_ID][1]}:`;
                })
                clearInterval(intervalId);
            }
        })
        if (statusText === "Waiting for players to join....") {
            statusText = "Waiting for players to join";
        } else {
            statusText += ".";
        }
    }, 500);
    status.textContent = statusText;
    socket.emit('join_room', { username: username.value, room: Number(roomId) });
};

// Display Join Room Div....
const displayJoinRoomDiv = () => {
    joinRoomDiv.classList.remove('hidden');
    roomButton.classList.add('hidden');
};

// Join Room....
const joinRoomFunction = () => {
    socket.on('room_full', (data) => {
        alert(data.message);
        return;
    });
    ROOM_ID = joinRoomId.value;
    socket.emit('join_room', { username: username.value, room: Number(joinRoomId.value) });
    gameSection.classList.remove('hidden');
    patchUser.classList.add('hidden');

    socket.emit('get_rooms_info', {'room': joinRoomId.value})
    socket.on('room_info', (data) => {
        playerOName.textContent = `${data.room[ROOM_ID][1]}:`;
        playerXName.textContent = `${data.room[ROOM_ID][0]}:`;
    })
}

createRoom.addEventListener('click', createRoomFunction);
joinRoom.addEventListener('click', displayJoinRoomDiv);
joinRoomBtn.addEventListener('click', joinRoomFunction);


















//const username = document.getElementById("username");
//const room = document.getElementById("room");
//const patch_user_btn = document.getElementById("patch_user_btn");
//const status = document.getElementById("status");
//const message_section = document.getElementById("message_section");
//const message = document.getElementById("message");
//const send_message_btn = document.getElementById("send_message_btn");
//
//socket.on("connect", () => {
//    console.log("Connected to server");
//});
//
//patch_user_btn.addEventListener("click", () => {
//    socket.emit("join_room", { username:username.value, room:Number(room.value) });
//});
//
//socket.on("join_room", (data) => {
//    status.textContent = data;
//});
//
//socket.on("room_full", (data) => {
//    alert(data.message)
//});
//
//socket.on("room_ready", (data) => {
//    status.textContent = data;
//});
//
//send_message_btn.addEventListener("click", () => {
//    socket.emit("send_message", { username:username.value, room:Number(room.value), message:message.value });
//    message.value = "";
//});
//
//socket.on("receive_message", (data) => {
//    const li = document.createElement("li");
//    li.textContent = data.username + ": " + data.message;
//    message_section.appendChild(li);
//});