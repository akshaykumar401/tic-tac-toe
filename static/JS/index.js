const playerToPlayer = document.getElementById('player_to_player');
const playOnline = document.getElementById('play_online');
const playWithAI = document.getElementById('play_with_ai');

playerToPlayer.addEventListener('click', () => {
    window.location.href = '/playerToPlayer';
});

playOnline.addEventListener('click', () => {
    window.location.href = '/patchUser';
});

playWithAI.addEventListener('click', () => {
    window.location.href = '/playWithAI';
});