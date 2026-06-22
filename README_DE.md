# 🐔 El Polo Loco 🌶️

Ein actiongeladenes HTML5-Canvas-Jump-and-Run-Spiel, entwickelt in purem JavaScript unter Verwendung von objektorientierter Programmierung (OOP).

---

## 🎮 Über das Spiel

In **El Polo Loco** schlüpfst du in die Rolle von **Pepe**, einem mutigen mexikanischen Helden. Deine Mission ist es, dich durch eine Wüstenlandschaft voller wilder Hühner und kleiner Küken zu kämpfen, Münzen und Salsa-Flaschen zu sammeln und schließlich den gefürchteten **Endboss** (ein riesiges, wütendes Huhn) zu besiegen!

---

## ✨ Features

- **Pures JavaScript (OOP)**: Vollständig objektorientiert strukturiert mit Basisklassen (`DrawableObject`, `MovableObject`), Mixins für Kollisionen/Rendering und einem sauberen Event-Handling.
- **Dynamic Entity System**: Verschiedene Gegnertypen mit individuellen KI-Verhaltensweisen (normale Hühner, kleine Küken, fliegende Projektile, Endboss).
- **Interaktive Spielwelt**:
  - Einsammeln von Münzen zur Score-Steigerung.
  - Einsammeln von Flaschen, die als Wurfgeschosse dienen, um Gegner aus der Ferne zu besiegen.
- **Responsives Design & Touch-Steuerung**: Optimiert für Desktop und mobile Endgeräte (inklusive automatischer Erkennung des Hochformats mit Bitte zur Bildschirmrotation).
- **Sound & Audio-System**: Ein robuster Sound-Manager für Hintergrundmusik, Wurf- und Treffersounds, Münzsammeln und Jump-Effekte.
- **Benutzeroberfläche (UI)**:
  - Dynamische Statusleisten für Gesundheit (HP), Münzen und gesammelte Flaschen.
  - Pausen- und Einstellungsmenüs für Sound- und Musiksteuerung.
  - Debug-Overlay (falls aktiviert) für Entwicklungs- und Testzwecke.

---

## ⌨️ Steuerung

### Desktop (Tastatur)

| Aktion | Taste | Beschreibung |
| :--- | :--- | :--- |
| **Nach links bewegen** | `⬅️` (Pfeiltaste links) | Pepe läuft nach links |
| **Nach rechts bewegen** | `➡️` (Pfeiltaste rechts) | Pepe läuft nach rechts |
| **Springen** | `⬆️` (Pfeiltaste oben) | Pepe springt in die Luft |
| **Flasche werfen** | `Leertaste` (Space) | Pepe wirft eine Salsa-Flasche |

### Mobile (Touch-Steuerung)

Auf mobilen Geräten werden virtuelle On-Screen-Tasten angezeigt:
- **Pfeiltasten links/rechts** auf der linken Seite zum Laufen.
- **Sprung- und Wurftasten** auf der rechten Seite.
- *Hinweis:* Das Spiel läuft im **Querformat (Landscape Mode)**. Drehe dein Gerät ins Querformat, um spielen zu können.

---

## 🚀 Installation & Starten

Du kannst das Spiel ganz einfach lokal auf deinem Rechner ausführen. Da es sich um eine reine Webanwendung handelt, benötigst du keinen komplexen Build-Prozess.

### Option 1: Direktes Öffnen (Lokal)
1. Klone das Repository:
   ```bash
   git clone https://github.com/XschlexX/El-Polo-Loco-Game.git
   ```
2. Öffne die Datei `index.html` direkt in einem modernen Webbrowser deiner Wahl (z.B. Chrome, Firefox, Edge, Safari).

### Option 2: Über einen lokalen Server (Empfohlen)
Um Ladefehler bei Assets oder Scripten (CORS-Probleme bei bestimmten Browsern) zu vermeiden, wird die Ausführung über einen lokalen Webserver empfohlen:
- **VS Code Live Server**: Installiere die Extension "Live Server" in VS Code, klicke unten rechts auf `Go Live` und starte das Spiel direkt im Browser.
- **NPM (http-server)**:
  ```bash
  npx http-server .
  ```
  Öffne danach die in der Konsole angezeigte Adresse (meist `http://localhost:8080`).

---

## 📁 Projektstruktur

```
el_polo_loco/
│
├── assets/                  # Bilder und Grafiken für Animationen, Hintergründe, UI
├── classes/                 # Objektorientierte Spielklassen
│   ├── base/                # Basis-Klassen (DrawableObject, MovableObject, CollectableObjects)
│   ├── collectables/        # Münzen, Flaschen
│   ├── entities/            # Pepe (Character), Hühner, Endboss
│   ├── environment/         # Wolken, Hintergrundebenen
│   ├── systems/             # Sound-Manager, Level, Tastatur, Kollisionsabfrage
│   └── ui/                  # Statusleisten, Timer, Debug-Overlays
│
├── css/                     # Modulspezifische CSS-Stylesheets
├── js/                      # Globale Logik- und Initialisierungs-Skripte
├── sounds/                  # Audio-Effekte und Hintergrundmusik
│
├── index.html               # Einstiegspunkt der Anwendung
├── style.css                # Globale Styling-Regeln
└── README.md                # Dokumentation
```

---

## 🛠️ Technologien

- **HTML5 Canvas** (Spiele-Rendering)
- **CSS3** (Responsive Layout, Overlays, Custom Properties)
- **Vanilla JavaScript** (OOP ES6+, Mixins, modularer Aufbau)

---

Entwickelt im Rahmen des Web-Development-Kurses der Developer Akademie.
