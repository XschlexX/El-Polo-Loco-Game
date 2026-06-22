# 🐔 El Polo Loco 🌶️

An action-packed HTML5 Canvas Jump-and-Run game built with pure JavaScript using Object-Oriented Programming (OOP) principles.

*Read this in other languages: [Deutsch](README_DE.md).*

---

## 🎮 About the Game

In **El Polo Loco**, you take on the role of **Pepe**, a brave Mexican hero. Your mission is to fight your way through a desert landscape full of wild chickens and tiny chicks, collect coins and salsa bottles, and ultimately defeat the feared **Endboss** (a giant, angry chicken)!

---

## ✨ Features

- **Pure JavaScript (OOP)**: Fully structured using Object-Oriented Programming with base classes (`DrawableObject`, `MovableObject`, `CollectableObjects`), mixins for collisions/rendering, and clean event handling.
- **Dynamic Entity System**: Different enemy types with individual AI behaviors (normal chickens, small chicks, throwable projectiles, and the Endboss).
- **Interactive Game World**:
  - Collect coins to increase your score.
  - Collect salsa bottles to use as throwable weapons to defeat enemies from a distance.
- **Responsive Design & Touch Controls**: Optimized for desktop and mobile devices (includes automatic portrait mode detection with a prompt to rotate your screen).
- **Audio System**: A robust sound manager handling background music, throw/hit sounds, coin collection, and jump effects.
- **User Interface (UI)**:
  - Dynamic status bars tracking health (HP), coins, and collected bottles.
  - Pause and settings menus for sound and music toggles.
  - Debug overlay (if enabled) for development and testing.

---

## ⌨️ Controls

### Desktop (Keyboard)

| Action | Key | Description |
| :--- | :--- | :--- |
| **Move Left** | `⬅️` (Left Arrow Key) | Pepe runs to the left |
| **Move Right** | `➡️` (Right Arrow Key) | Pepe runs to the right |
| **Jump** | `⬆️` (Up Arrow Key) | Pepe jumps into the air |
| **Throw Bottle** | `Spacebar` (Space) | Pepe throws a salsa bottle |

### Mobile (Touch Controls)

On mobile devices, virtual on-screen buttons are displayed:
- **Left/Right arrows** on the left side to move.
- **Jump/Throw buttons** on the right side.
- *Note:* The game runs in **Landscape Mode**. Please rotate your device to landscape to play.

---

## 🚀 Installation & Getting Started

You can easily run the game locally on your computer. Since it is a pure client-side web application, no complex build process is required.

### Option 1: Direct Execution (Local)
1. Clone the repository:
   ```bash
   git clone https://github.com/XschlexX/El-Polo-Loco-Game.git
   ```
2. Open the `index.html` file directly in any modern web browser (e.g., Chrome, Firefox, Edge, Safari).

### Option 2: Using a Local Web Server (Recommended)
To prevent potential CORS issues or asset loading errors in some browsers, running the game on a local web server is highly recommended:
- **VS Code Live Server**: Install the "Live Server" extension in VS Code, click `Go Live` in the bottom-right corner, and play the game in your browser.
- **NPM (http-server)**:
  ```bash
  npx http-server .
  ```
  Then open the address displayed in the terminal (usually `http://localhost:8080`).

---

## 📁 Project Structure

```
el_polo_loco/
│
├── assets/                  # Images and graphics for animations, backgrounds, UI
├── classes/                 # Object-Oriented game classes
│   ├── base/                # Base classes (DrawableObject, MovableObject, CollectableObjects)
│   ├── collectables/        # Coins, bottles
│   ├── entities/            # Pepe (Character), chickens, Endboss
│   ├── environment/         # Clouds, background layers
│   ├── systems/             # Sound manager, level, keyboard, collision detection
│   └── ui/                  # Status bars, timer, debug overlays
│
├── css/                     # Module-specific CSS stylesheets
├── js/                      # Global logic and initialization scripts
├── sounds/                  # Audio effects and background music
│
├── index.html               # Main entry point of the application
├── style.css                # Global styling rules
└── README.md                # Documentation (English)
```

---

## 🛠️ Tech Stack

- **HTML5 Canvas** (Game rendering)
- **CSS3** (Responsive layout, overlays, custom properties)
- **Vanilla JavaScript** (OOP ES6+, Mixins, modular structure)

---

Developed as part of the Web Development Course at the Developer Akademie.
