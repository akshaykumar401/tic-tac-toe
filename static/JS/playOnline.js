const socket = io()
const username = document.getElementById("username");
const room = document.getElementById("room");
const patch_user_btn = document.getElementById("patch_user_btn");
const status = document.getElementById("status");
const message_section = document.getElementById("message_section");
const message = document.getElementById("message");
const send_message_btn = document.getElementById("send_message_btn");

socket.on("connect", () => {
    console.log("Connected to server");
});

patch_user_btn.addEventListener("click", () => {
    socket.emit("join_room", { username:username.value, room:Number(room.value) });
});

socket.on("join_room", (data) => {
    status.textContent = data;
});

socket.on("room_full", (data) => {
    alert(data)
});

socket.on("room_ready", (data) => {
    status.textContent = data;
});

send_message_btn.addEventListener("click", () => {
    socket.emit("send_message", { username:username.value, room:Number(room.value), message:message.value });
    message.value = "";
});

socket.on("receive_message", (data) => {
    const li = document.createElement("li");
    li.textContent = data.username + ": " + data.message;
    message_section.appendChild(li);
});