# Tic Tac Toe.

A real-time Tic Tac Toe web game built using HTML, Tailwind CSS, JavaScript, and a Python Flask backend powered by Flask-SocketIO for online multiplayer functionality.

## Features

- **Player vs Player (Local)** -> Play with another player on the same device.
- **Online Multiplayer** -> Real-time gameplay using WebSockets with Flask-SocketIO.
- **Play with AI (Coming Soon)** -> AI opponent with intelligent move logic.

## Technologies Used

- **FRONTEND**
<br />
  1. <b>HTML</b> -> Game structure
  <br />
  2. <b>Tailwind CSS</b> -> Utility-first styling
  <br />
  3. <b>JavaScript</b> -> Game logic and interactivity
<br />
<br />


- **BACKEND**
  1. <b>Python Flask</b> –> Server-side framework
<br />
  2. <b>Flask-SocketIO</b> –> Real-time communication

## Project Structure

``` arduino
Tic-Tac-Toe/
│
├── node_modules/
├── static/
│   ├── CSS/
│   │   └── output.css
│   │   └── input.css
│   ├── JS/
│   │   └── index.js
│   │   └── playerToPlayer.js
│   │   └── playOnline.js
│   └── images/
│       └── logo.png...
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── playerToPlayer.html
│   ├── playOnline.html
│   ├── playWithAI.html
│   └── rules.html
│
├── .gitignore
├── app.py
├── index.py
├── package.json
├── package-lock.json
├── requirements.txt
├── vercel.json
├── wsgi.py
└── README.md
```

## Install and Setup

1. Clone The Repository
2. Install node Dependencies using
``` bash
npm install
```
3. Install Backend Dependencies
``` bash
pip install -r requirements.txt
```
4. Run the Flask Server
``` bash
python wsgi.py
```

## Tailwind Setup

If you want to rebuild Tailwind styles:

``` bash
npx @tailwindcss/cli -i ./static/CSS/input.css -o ./static/CSS/output.css --watch
```