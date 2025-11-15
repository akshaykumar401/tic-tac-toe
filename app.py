from flask import Flask, render_template, request
from flask_socketio import SocketIO, join_room, leave_room, emit
import secrets

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
socketio = SocketIO(app, cors_allowed_origins="*")
games = {}   # for track rooms and players

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

@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')

@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected: {request.sid}')
    # Clean up games when player disconnects
    for room in list(games.keys()):
        if request.sid in games[room]['players']:
            del games[room]['players'][request.sid]
            if len(games[room]['players']) == 0:
                del games[room]
            else:
                socketio.emit('opponent_left', room=room)

@socketio.on('create_room')
def handle_create_room():
    room = secrets.token_hex(3).upper()
    print(f'Creating room: {room}')
    games[room] = {
        'players': {request.sid: 'X'},
        'board': [''] * 9,
        'turn': 'X',
        'started': False
    }
    join_room(room)
    emit('room_created', {'room': room, 'symbol': 'X'})

@socketio.on('join_room')
def handle_join_room(data):
    room = data['room']
    print(f'Joining room: {room}')
    
    if room not in games:
        emit('error', {'message': 'Room not found'})
        return
    
    if len(games[room]['players']) >= 2:
        emit('error', {'message': 'Room is full'})
        return
    
    games[room]['players'][request.sid] = 'O'
    games[room]['started'] = True
    join_room(room)
    
    emit('room_joined', {'room': room, 'symbol': 'O'})
    socketio.emit('game_start', {
        'board': games[room]['board'],
        'turn': games[room]['turn']
    }, room=room)

@socketio.on('make_move')
def handle_move(data):
    room = data['room']
    index = data['index']
    
    print(f'Move in room {room} at index {index}')
    
    if room not in games:
        print('Room not found')
        return
    
    game = games[room]
    player_symbol = game['players'].get(request.sid)
    
    if not player_symbol:
        print('Player not in game')
        return
        
    if game['turn'] != player_symbol:
        print(f'Not player turn. Current turn: {game["turn"]}, Player: {player_symbol}')
        return
    
    if game['board'][index] != '':
        print('Cell already occupied')
        return
    
    game['board'][index] = player_symbol
    winner = check_winner(game['board'])
    
    if winner:
        socketio.emit('move_made', {
            'board': game['board'],
            'winner': winner,
            'turn': game['turn']
        }, room=room)
    else:
        game['turn'] = 'O' if game['turn'] == 'X' else 'X'
        socketio.emit('move_made', {
            'board': game['board'],
            'winner': None,
            'turn': game['turn']
        }, room=room)

@socketio.on('reset_game')
def handle_reset(data):
    room = data['room']
    print(f'Resetting game in room {room}')
    if room in games:
        games[room]['board'] = [''] * 9
        games[room]['turn'] = 'X'
        socketio.emit('game_reset', {
            'board': games[room]['board'],
            'turn': games[room]['turn']
        }, room=room)

@socketio.on('leave_room')
def handle_leave_room(data):
    room = data['room']
    print(f'Player leaving room {room}')
    if room in games:
        leave_room(room)
        if request.sid in games[room]['players']:
            del games[room]['players'][request.sid]
        
        if len(games[room]['players']) == 0:
            del games[room]
        else:
            socketio.emit('opponent_left', room=room)

def check_winner(board):
    lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  # rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  # columns
        [0, 4, 8], [2, 4, 6]              # diagonals
    ]
    
    for line in lines:
        if board[line[0]] and board[line[0]] == board[line[1]] == board[line[2]]:
            return board[line[0]]
    
    if '' not in board:
        return 'draw'
    
    return None
# @socketio.on('join_room')
# def _join_room(data):
#     room = data['room']     # room ID Must be an Integer
#     username = data['username']

#     if room not in rooms:
#         rooms[room] = []

#     if len(rooms[room]) == 2:
#         emit('Player_info', {'room':rooms, 'message': 'Room is full.'})

#     if len(rooms[room]) >= 2:
#         emit('room_full', {'room':room, 'message': 'Room is full.'})

#     # Adding Player to Room
#     rooms[room].append(username)
#     join_room(room)
#     emit('joined_room', {'room': room, 'username': username})

# @socketio.on('check_room_status')
# def check_room_status(data):
#     room = data['room']
#     emit('room_status', {'room': rooms, 'status': len(rooms[room])})

# @socketio.on('leave_room')
# def leave_room(data):
#     room = data['room']
#     username = data['username']

#     if room in rooms and username in rooms[room]:
#         rooms[room].remove(username)

#     leave_room(room)
#     emit('left_room', {'room': room, 'username': username})

# @socketio.on('get_rooms_info')
# def get_rooms_info(data):
#     room = data['room']
#     # filter rooms with players
#     emit('room_info', {'room': rooms, 'room_id': room}, room=room)

# @socketio.on('send_message')
# def send_message(data):
#     room = data['room']
#     username = data['username']
#     message = data['message']

#     emit('receive_message', {'room': room, 'username': username, 'message': message}, room=room)

# @socketio.on('patch_board')
# def patch_board(data):
#     board = data['board']
#     turn = data['turn']
#     player = data['player']

#     emit('patch_board', {'board': board, 'turn': turn, 'player': player}, room=room)

# @socketio.on('disconnect')
# def disconnect():
#     for room in rooms:
#         for username in rooms[room]:
#             emit('left_room', {'room': room, 'username': username})

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)