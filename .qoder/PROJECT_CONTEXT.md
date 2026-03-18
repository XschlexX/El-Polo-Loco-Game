# El Pollo Loco - Projekt Kontext & Dokumentation

## Projektübersicht

**El Pollo Loco** ist ein browserbasiertes 2D-Jump-and-Run Spiel im Western-Stil. Der Spieler steuert den Charakter "Pepe" durch eine Wüstenlandschaft, bekämpft Hühner-Gegner, sammelt Salsa-Flaschen als Waffen und Münzen als Punkte, um am Ende gegen den Endboss "Señora Gallina" zu kämpfen.

### Spielkonzept

- **Genre**: Jump-and-Run, Action, Arcade
- **Setting**: Mexikanische Wüste / Western
- **Ziel**: Überlebe, sammle Flaschen, besiege den Endboss
- **Technologie**: Vanilla JavaScript (ES6+), HTML5 Canvas, CSS3

---

## Projektstruktur

```
el_polo_loco/
├── index.html                    # Hauptseite, lädt alle Scripts
├── style.css                     # Globale Styles, Responsive Design
├── js/
│   ├── game.js                   # Haupt-Game-Logik, Keyboard/Touch-Handling
│   ├── global.js                 # Globale Variablen, Konstanten
│   ├── start.js                  # Spielstart, Screens, Overlays
│   ├── template.js               # HTML-Templates für UI
│   ├── level-creator.js          # Level-Factory
│   └── level-gen-functions.js    # Level-Generierungs-Funktionen
├── models/
│   ├── base/
│   │   ├── drawable-object.class.js      # Basisklasse für alle zeichnbaren Objekte
│   │   ├── movable-objects.class.js      # Erweitert DrawableObject mit Bewegung
│   │   └── collectable-objects.class.js  # Basisklasse für einsammelbare Objekte
│   ├── entities/
│   │   ├── character.class.js    # Spieler-Charakter (Pepe)
│   │   ├── chicken.class.js      # Normale Hühner-Gegner
│   │   ├── chicken-small.class.js # Kleine Hühner-Gegner
│   │   └── endboss.class.js      # Endboss (Señora Gallina)
│   ├── collectables/
│   │   ├── collectable-bottle.class.js   # Sammelbare Flaschen
│   │   └── collectable-coins.class.js    # Sammelbare Münzen
│   ├── environment/
│   │   ├── background-object.class.js    # Parallax-Hintergründe
│   │   └── clouds.class.js               # Wolken-Objekte
│   ├── systems/
│   │   ├── world.class.js        # Haupt-Spielwelt, Rendering-Loop
│   │   ├── level.class.js        # Level-Container
│   │   ├── sound-manager.class.js # Audio-Verwaltung
│   │   ├── keyboard.class.js     # Keyboard-Input-Handler
│   │   ├── thowable-object.class.js # Wurf-Objekte (Flaschen)
│   │   ├── asset-loader.class.js # Bild-Preloading
│   │   └── global-interval-manager.class.js # Zentrales Interval-Management
│   └── ui/
│       ├── status-bar.class.js   # HP/Flaschen/Münzen-Anzeige
│       ├── game-timer.class.js   # Spiel-Timer
│       ├── level-display.class.js # Level-Anzeige
│       ├── debug-info.class.js   # Debug-Informationen
│       ├── overlay.class.js      # Basis-Overlay-Klasse
│       ├── settings-overlay.class.js # Einstellungen-Overlay
│       ├── settings-button.class.js  # Einstellungen-Button
│       ├── victory-overlay.class.js  # Sieg-Bildschirm
│       └── defeat-overlay.class.js   # Niederlage-Bildschirm
├── assets/
│   ├── fonts/                    # Rye, Smokum (Western-Fonts)
│   ├── icon/                     # Mute/Unmute Icons
│   └── img/                      # Alle Spiel-Grafiken
│       ├── 2_character_pepe/     # Pepe-Animationen
│       ├── 3_enemies_chicken/    # Hühner-Animationen
│       ├── 4_enemie_boss_chicken/ # Endboss-Animationen
│       ├── 5_background/         # Hintergrund-Layer
│       ├── 6_salsa_bottle/       # Flaschen-Grafiken
│       ├── 7_statusbars/         # Statusbar-Grafiken
│       ├── 8_coin/               # Münzen-Grafiken
│       └── 9_intro_outro_screens/ # Start/Game-Over-Screens
└── sounds/                       # Alle Audio-Dateien
    ├── music/                    # Hintergrundmusik
    ├── effects/                  # Soundeffekte
    └── win-lose/                 # Sieg/Niederlage-Sounds
```

---

## Klassenhierarchie

```
DrawableObject (Base)
├── MovableObjects
│   ├── Character (Spieler)
│   ├── Chicken (Gegner)
│   ├── ChickenSmall (Gegner)
│   ├── Endboss (Boss-Gegner)
│   └── ThrowableObject (Wurf-Flaschen)
├── CollectableObjects
│   ├── CollectableBottle
│   └── CollectableCoin
├── BackgroundObject
├── Clouds
└── UI-Klassen (StatusBar, GameTimer, etc.)
```

---

## Kern-Systeme

### 1. World (Spielwelt)

**Datei**: `models/systems/world.class.js`

Die World-Klasse ist das Herzstück des Spiels:

- **Rendering-Loop**: `draw()` mit `requestAnimationFrame`
- **Parallax-Hintergründe**: Mehrere Layer mit unterschiedlichen Geschwindigkeiten
- **Kollisions-Detection**:
  - Character vs Enemies (200ms Interval)
  - Bottle vs Enemies (50ms Interval für präzisere Treffer)
  - Bottle Collection (Flaschen einsammeln)
  - Coin Collection (Münzen einsammeln)
- **Kamera-System**: Folgt dem Character mit Easing (weiche Bewegung)
- **Game States**: pauseGame(), resumeGame(), stopGame()

**Wichtige Methoden**:

- `draw()` - Haupt-Render-Loop
- `checkCollisions()` - Character-Enemy Kollisionen
- `checkBottleCollisions()` - Flasche trifft Gegner
- `drawParallaxBackgrounds()` - Parallax-Effekt
- `bounceFromEndboss()` - Rückstoß nach Endboss-Kollision

### 2. Character (Spieler)

**Datei**: `models/entities/character.class.js`

Der spielbare Charakter "Pepe":

- **Attribute**: HP (500), Flaschen (0-10), Münzen (0-10)
- **Bewegung**: Links/Rechts laufen, Springen (mit Gravity)
- **Animationen**: Idle, Long Idle (Schlafen nach 3 Sekunden), Walk, Jump, Throw, Hurt, Dead
- **Sounds**: Run (Loop), Jump, Land, Sleep, Hurt, Dead
- **Kamera**: Berechnet Kamera-Position mit asymmetrischem Offset

**Wichtige Methoden**:

- `animate()` - Startet alle Bewegungs- und Animations-Intervals
- `startThrowAnimation()` / `throwBottle()` - Flaschen werfen
- `resetSleepTimer()` - Schlaf-Timer zurücksetzen
- `updateCamera()` - Kamera mit Easing aktualisieren

### 3. Endboss (Hauptgegner)

**Datei**: `models/entities/endboss.class.js`

Der finale Boss "Señora Gallina":

- **HP**: Konfigurierbar (Standard: 20)
- **Zustände**: Patrol, Alert, Attack, Chase, Ramming, Dead
- **KI-Verhalten**:
  1. **Patrol**: Geht im Bereich hin und her
  2. **Alert**: Spielt Alert-Animation wenn Character gesehen
  3. **Attack**: Attack-Animation, dann Chase-Modus
  4. **Chase**: Verfolgt den Character
  5. **Ramming**: Nach Kollision - rennt weiter durch
- **Sichtweite**: 100px in Blickrichtung (keine 360° Sicht!)

**Wichtige Methoden**:

- `canSeeCharacter()` - Prüft ob Character in Sichtweite
- `playAlertAnimationOnce()` - Alert → Attack → Chase Sequenz
- `onCharacterCollision()` - Aktiviert Ramming-Modus
- `onBottleHit()` - Reagiert auf Flaschen-Treffer

### 4. Sound Manager

**Datei**: `models/systems/sound-manager.class.js`

Zentrale Audio-Verwaltung:

- **Globaler Cache**: Sounds werden nur einmal geladen
- **Loop-Sounds**: menuTheme, gameTheme, characterRun, endbossAngry, characterSleep
- **Muted-Status**: Standardmäßig gemutet (true)
- **Methoden**: play(), playMusic(), stopMusic(), muteAll(), unmuteAll()

**Wichtige Sounds**:

- Musik: menuTheme, gameTheme, endbossTheme
- Character: jump, land, run, hurt, dead, sleep
- Enemies: chickenDead, endbossHurt, endbossAngry, endbossDead
- Items: bottleCollect, bottleThrow, bottleSplash, coinCollect

### 5. Global Interval Manager

**Datei**: `models/systems/global-interval-manager.class.js`

Zentrales Management für alle `setInterval` und `setTimeout`:

- **Registrierung**: Jedes Interval wird mit Beschreibung und Owner registriert
- **Cleanup**: `clearByOwner(obj)` löscht alle Intervals eines Objekts
- **Pause/Resume**: Für Settings-Overlay
- **Vermeidet**: Memory Leaks durch vergessene Intervals

---

## Spiel-Mechaniken

### Kollisions-System

- **Hitboxen**: Jedes Objekt hat `hitBoxLeft/Top/Right/Bottom` Offsets
- `isColliding(obj)` - Prüft Rechteck-Kollision mit Offsets
- **Gegner besiegen**: Nur durch Springen von oben (nicht für Endboss!)
- **Flaschen**: Werfen mit SPACE, treffen Gegner von allen Seiten

### Sammel-System

- **Flaschen**: Max 10, werden für Wurf verbraucht
- **Münzen**: Max 10, rein visuelle Sammlung
- **Spawn**: Zufällig im Level verteilt

### Level-System

- **Level-Größe**: Konfigurierbar (levelStart bis levelEnd)
- **Hintergrund**: 4 Parallax-Layer (Faktor 0, 0.2, 0.5, 1)
- **Gegner**: Chicken und ChickenSmall werden prozedural platziert
- **Endboss**: Steht am Level-Ende

### UI/Overlay System

- **HTML-basiert**: Overlays sind echte HTML-Elemente (nicht Canvas)
- **Screens**: Main Menu, Info, Controls, Loading, Victory, Defeat
- **Settings Overlay**: Pause-Menü mit Sound-Toggle, Resume, Restart, Exit
- **Touch-Controls**: Mobile Buttons für Links/Rechts/Jump/Throw

---

## Wichtige Konstanten & Variablen

### Globale Variablen (global.js)

```javascript
canvasWidth = 720;
canvasHeight = 480;
levelStart = 0;
levelEnd = 720 * 6; // Level-Länge

// Level-Generierung
chickenCount = 15;
smallChickenCount = 10;
bottleCount = 15;
coinCount = 15;

// Bildpfade (imagePaths-Objekt)
character: {
  (imagesIdle,
    imagesLongIdle,
    imagesWalk,
    imagesJump,
    imagesThrow,
    imagesHurt,
    imagesDead);
}
chicken: {
  (imagesWalking, imagesDead);
}
chickenSmall: {
  (imagesWalking, imagesDead);
}
endboss: {
  (imagesWalk,
    imagesAlert,
    imagesAttack,
    imagesAttackRun,
    imagesHurt,
    imagesDead);
}
```

### Keyboard-Mapping (game.js)

```javascript
KEY_CODE_MAP = {
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
  ArrowUp: "UP",
  Space: "SPACE",
};

BUTTON_KEY_MAP = {
  "btn-left": "LEFT",
  "btn-right": "RIGHT",
  "btn-jump": "UP",
  "btn-throw": "SPACE",
};
```

---

## Entwicklungs-Richtlinien (Rules)

### Code-Qualität

- **Max 14 Zeilen** pro Funktion (HTML ausgenommen)
- **Max 400 LOC** pro Datei
- **1-2 Leerzeilen** zwischen Funktionen
- **JSDoc** Dokumentation für alle Funktionen

### Performance

- Intervalle müssen sauber aufgeräumt werden (GlobalIntervalManager)
- Bilder/Assets vorladen (AssetLoader)
- Tote Gegner/verbrauchte Flaschen aus Arrays entfernen
- `requestAnimationFrame` für Animationen bevorzugen

### Spielmechanik

- Animationen müssen flüssig sein
- Keine Lücken zwischen Hintergrundbildern
- Character: Idle + Sleep nach 3 Sekunden
- Statusbars korrekt aktualisieren
- Mute-Button stoppt alle Sounds

### Mobile

- Touch-Buttons nur bei Tablet/Handy sichtbar
- Touch-Buttons: `touchstart`/`touchend` Events
- Mindestens 44x44px Touch-Target-Größe
- Querformat-Zwangsansicht für Mobile

### Kollisionen

- Gegner nur bei Treffer von oben sterben (Springen)
- Offsets müssen korrekt sein
- Endboss stärker als normale Gegner

---

## Häufige Dateien für Änderungen

### Charakter-Anpassungen

- `models/entities/character.class.js` - Bewegung, Animationen, Sounds

### Gegner-Anpassungen

- `models/entities/chicken.class.js` - Normale Hühner
- `models/entities/chicken-small.class.js` - Kleine Hühner
- `models/entities/endboss.class.js` - Endboss KI und Verhalten

### Kollisions-Änderungen

- `models/systems/world.class.js` - `checkCollisions()`, `checkBottleCollisions()`
- `models/base/movable-objects.class.js` - `isColliding()`

### Sound-Änderungen

- `models/systems/sound-manager.class.js` - Neue Sounds hinzufügen
- `sounds/` - Neue Audio-Dateien ablegen

### UI-Änderungen

- `js/template.js` - HTML-Templates
- `style.css` - Styling
- `js/start.js` - Overlay-Logik

### Level-Änderungen

- `js/level-gen-functions.js` - Level-Generierung
- `js/level-creator.js` - Level-Factory

---

## Debug & Testing

### Debug-Info

- `models/ui/debug-info.class.js` - Zeigt FPS, Positionen, Hitboxen
- Aktivieren über Level-Konfiguration

### Entwicklungsmodus

- Mehr Leben für einfacheres Testen
- Konsolenausgaben nur im Debug-Modus

### Test-Szenarien

1. Character läuft, springt, wirft Flaschen
2. Gegner werden bei Sprung von oben besiegt
3. Flaschen treffen Gegner von allen Seiten
4. Endboss-KI: Patrol → Alert → Attack → Chase → Ramming
5. Mobile Touch-Controls funktionieren
6. Sound Mute/Unmute funktioniert
7. Pause/Resume im Settings-Overlay
8. Victory/Defeat Screens erscheinen korrekt

---

## Bekannte Besonderheiten

1. **Sound-Autoplay**: Browser blockieren Autoplay → Sound startet gemutet
2. **Parallax-Hintergründe**: Layer mit Faktor 0 bewegen sich nicht (ferner Hintergrund)
3. **Endboss-Sicht**: Nur 100px in Blickrichtung - Spieler kann von hinten schleichen
4. **Flaschen-Wurf**: Animation startet sofort, Flasche wird nach 200ms geworfen
5. **Sleep-Timer**: 3 Sekunden Inaktivität → Character schläft ein
6. **Kamera-Easing**: Sanfte Kamera-Bewegung (5% der Distanz pro Frame)

---

## Erstellt

- **Projekt**: El Pollo Loco
- **Typ**: Developer Akademie Modul 12
- **Dokumentation erstellt**: März 2026
- **Zweck**: Kontext für KI-Assistenz bei zukünftigen Änderungen
