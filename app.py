from flask import Flask, render_template

app = Flask(__name__)
app.static_folder = 'static'    # Assigning The Static Folder....

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

@app.route('/patchUser')
def patch_user():
    return render_template('patchUser.html')
#################### All Routes End Here #######

if __name__ == "__main__":
    app.run(debug=True)