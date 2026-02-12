---
description: Game State Management Rule - Zustandsverwaltung und Game-Loop
always_on: true
---

## Game State Management Rule

- Klare Trennung zwischen: Menu, Playing, Paused, GameOver, Victory
- Game-Loop startet/stoppt korrekt bei Zustandsänderungen
- Keine Eingaben während Pause/GameOver verarbeiten
