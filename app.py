from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, leave_room, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
socketio = SocketIO(app, cors_allowed_origins="*")
rooms = {}   # for track rooms and players

###########  All Routes Here ########
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/playerToPlayer')
def player_to_player():
    return render_template('playerToPlayer.html')

@app.route('/playOnline')
def play_online():
    return render_template('playOnline.html')

@app.route('/playWithAI')
def play_with_ai():
    return render_template('playWithAI.html')

@app.route('/rules')
def rules():
    return render_template('rules.html')

#################### All Routes End Here #######

@socketio.on('join_room')
def _join_room(data):
    room = data['room']     # room ID Must be an Integer
    username = data['username']

    if room not in rooms:
        rooms[room] = []

    if len(rooms[room]) >= 2:
        emit('room_full', room)

    # Adding Player to Room
    rooms[room].append(username)
    join_room(room)
    emit('joined_room', {'room': room, 'username': username})

@socketio.on('leave_room')
def leave_room(data):
    room = data['room']
    username = data['username']

    if room in rooms and username in rooms[room]:
        rooms[room].remove(username)

    leave_room(room)
    emit('left_room', {'room': room, 'username': username})

@socketio.on('send_message')
def send_message(data):
    room = data['room']
    username = data['username']
    message = data['message']

    emit('receive_message', {'room': room, 'username': username, 'message': message}, room=room)

@socketio.on('disconnect')
def disconnect():
    for room in rooms:
        for username in rooms[room]:
            emit('left_room', {'room': room, 'username': username})

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)