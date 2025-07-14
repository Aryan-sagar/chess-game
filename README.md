# Firebase Chess Multiplayer

A real-time, turn-based multiplayer chess game built using HTML, JavaScript, and Firebase Realtime Database. No backend server required.

---

## Features

- Full 8×8 chessboard with Unicode pieces
- Real-time multiplayer via Firebase
- Turn-based player control and synchronization
- Move validation for all standard pieces
- Check and basic checkmate detection
- Simple computer opponent (optional)
- No backend server needed

---

## Live Demo

Coming soon — can be deployed on GitHub Pages or Firebase Hosting.

---

## Tech Stack

| Technology   | Purpose                       |
|--------------|-------------------------------|
| HTML/CSS     | Structure and styling          |
| JavaScript   | Game logic and UI interaction |
| Firebase     | Realtime multiplayer sync     |

---

## Project Structure

chess-multiplayer/
├── index.html # Game UI and Firebase integration
├── script.js # Core game logic and rendering
└── README.md # Project documentation

2. Open index.html in your browser
You can use Live Server in VS Code or open the file manually.

3. Set up Firebase
Go to Firebase Console

Create a new project

Enable Realtime Database

Add a Web App to the project

Replace the firebaseConfig object in index.html with your app's configuration

How It Works
Each move updates the Firebase Realtime Database

Opponent clients receive updates and re-render the board

The game enforces turn-based logic

game1 is used as the default room (can be expanded)

Future Improvements
En passant, promotion, and castling enhancements

Smarter AI opponent

Multiple game rooms

In-game chat using Firebase

UI improvements and mobile responsiveness

License
This project is licensed under the MIT License.
