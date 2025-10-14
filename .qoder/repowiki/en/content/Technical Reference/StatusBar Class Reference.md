# StatusBar Class Reference

<cite>
**Referenced Files in This Document**  
- [status-bar.class.js](file://models/status-bar.class.js)
- [2-world.class.js](file://models/2-world.class.js)
- [1-game.js](file://js/1-game.js)
- [drawable-object.class.js](file://models/drawable-object.class.js)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Image Arrays](#image-arrays)
3. [Positioning Properties](#positioning-properties)
4. [Constructor Parameters](#constructor-parameters)
5. [setCharacter() Method](#setcharacter-method)
6. [setWidth() Method](#setwidth-method)
7. [setPosition() Method](#setposition-method)
8. [Status Bar Types](#status-bar-types)
9. [Usage Examples](#usage-examples)
10. [Troubleshooting Guide](#troubleshooting-guide)

## Introduction
The StatusBar class is responsible for displaying visual indicators of player and boss health, bottle count, and coin collection in the game. It extends the DrawableObject class and integrates with the World object to dynamically update based on character state. The class manages three primary status bar types (health, bottle, coin) and includes special handling for the endboss health bar. Each status bar consists of three components: an empty bar background, a filled bar indicating current value, and an icon representing the status type.

**Section sources**
- [status-bar.class.js](file://models/status-bar.class.js#L0-L132)

## Image Arrays
The StatusBar class defines four image arrays that contain the visual assets for different status bar types. Each array contains three elements: the empty bar background, the filled bar, and the icon.

```mermaid
classDiagram
class StatusBar {
+imagesHealthBar[3]
+imagesBottleBar[3]
+imagesCoinBar[3]
+imagesHealthBarEndboss[3]
}
```

**Diagram sources**
- [status-bar.class.js](file://models/status-bar.class.js#L15-L42)

**Section sources**
- [status-bar.class.js](file://models/status-bar.class.js#L15-L42)

## Positioning Properties
The class includes several properties that control the position and dimensions of status bar components. These properties are modified by the setPosition() method based on the status bar type and component.

```mermaid
classDiagram
class StatusBar {
+x : number
+y : number
+width : number
+height : number
+gap : number
}
```

**Diagram sources**
- [status-bar.class.js](file://models/status-bar.class.js#L44-L49)

**Section sources**
- [status-bar.class.js](file://models/status-bar.class.js#L44-L49)

## Constructor Parameters
The StatusBar constructor accepts two parameters that determine which status bar type to create and which component to display.

```mermaid
classDiagram
class StatusBar {
+statusbar : string
+type : number
+constructor(statusbar : string, type : number)
}
```

**Diagram sources**
- [status-bar.class.js](file://models/status-bar.class.js#L70-L76)

**Section sources**
- [status-bar.class.js](file://models/status-bar.class.js#L70-L76)

## setCharacter() Method
The setCharacter() method asynchronously links the StatusBar instance to the World's character object. It uses a setTimeout to ensure the World object is available before attempting to access it. Once the character is found, it initializes the energy multiplier used for width calculations and triggers the setWidth() method.

```mermaid
sequenceDiagram
participant StatusBar
participant World
participant Character
StatusBar->>StatusBar : setCharacter()
StatusBar->>StatusBar : setTimeout(500ms)
StatusBar->>World : Check if world exists
alt World exists
World->>StatusBar : Return world.character
StatusBar->>StatusBar : Set this.character
StatusBar->>StatusBar : Calculate multiplier
StatusBar->>StatusBar : Call setWidth()
else World not found
StatusBar->>Console : Log error
end
```

**Diagram sources**
- [status-bar.class.js](file://models/status-bar.class.js#L72-L83)
- [2-world.class.js](file://models/2-world.class.js#L3-L3)

**Section sources**
- [status-bar.class.js](file://models/status-bar.class.js#L72-L83)

## setWidth() Method
The setWidth() method dynamically updates the bar width based on the character's energy level. It runs on a 100ms interval and only applies to the filled health bar component (type 1). The width is calculated by multiplying the character's current energy by the pre-calculated multiplier.

```mermaid
flowchart TD
A[Start setWidth Interval] --> B{statusbar == imagesHealthBar AND type == 1?}
B --> |Yes| C[Calculate new width = character.energy * multiplier]
C --> D[Update this.width]
D --> E[Bar visually updates]
B --> |No| F[No width update]
F --> G[Wait for next interval]
E --> G
G --> H[Repeat every 100ms]
```

**Diagram sources**
- [status-bar.class.js](file://models/status-bar.class.js#L85-L91)

**Section sources**
- [status-bar.class.js](file://models/status-bar.class.js#L85-L91)

## setPosition() Method
The setPosition() method contains complex logic for positioning different bar components based on their type and status bar category. It adjusts the x, y, width, and height properties according to specific rules for each combination of statusbar and type values.

```mermaid
flowchart TD
A[Start setPosition] --> B{statusbar == imagesHealthBar AND type == 2?}
B --> |Yes| C[Adjust position for health icon]
B --> |No| D{statusbar == imagesBottleBar AND type == 0 or 1?}
D --> |Yes| E[Move down by gap]
D --> |No| F{statusbar == imagesBottleBar AND type == 2?}
F --> |Yes| G[Adjust position for bottle icon]
F --> |No| H{statusbar == imagesCoinBar AND type == 0 or 1?}
H --> |Yes| I[Move down by gap*2]
H --> |No| J{statusbar == imagesCoinBar AND type == 2?}
J --> |Yes| K[Adjust position for coin icon]
J --> |No| L{statusbar == imagesHealthBarEndboss AND type == 0 or 1?}
L --> |Yes| M[Position from right side of screen]
L --> |No| N{statusbar == imagesHealthBarEndboss AND type == 2?}
N --> |Yes| O[Position endboss health icon]
N --> |No| P[No position changes]
```

**Diagram sources**
- [status-bar.class.js](file://models/status-bar.class.js#L93-L131)

**Section sources**
- [status-bar.class.js](file://models/status-bar.class.js#L93-L131)

## Status Bar Types
The StatusBar class supports three main status bar types with distinct visual representations and positioning rules. Each type has three components (empty bar, filled bar, icon) represented by different type values (0, 1, 2).

```mermaid
classDiagram
class StatusBar {
+imagesHealthBar
+imagesBottleBar
+imagesCoinBar
+imagesHealthBarEndboss
}
StatusBar --> HealthBar : "Player Health"
StatusBar --> BottleBar : "Bottle Count"
StatusBar --> CoinBar : "Coin Collection"
StatusBar --> EndbossHealthBar : "Endboss Health"
```

**Diagram sources**
- [status-bar.class.js](file://models/status-bar.class.js#L15-L42)

**Section sources**
- [status-bar.class.js](file://models/status-bar.class.js#L15-L42)

## Usage Examples
To create different types of status bars, instantiate the StatusBar class with the appropriate image array name and type parameter. The constructor automatically handles character linking, positioning, and image loading.

```mermaid
sequenceDiagram
participant Game
participant StatusBar
participant World
Game->>StatusBar : new StatusBar('imagesHealthBar', 0)
StatusBar->>StatusBar : Initialize properties
StatusBar->>StatusBar : setCharacter()
StatusBar->>StatusBar : setPosition()
StatusBar->>StatusBar : loadImage()
Game->>StatusBar : new StatusBar('imagesBottleBar', 1)
StatusBar->>StatusBar : Initialize properties
StatusBar->>StatusBar : setCharacter()
StatusBar->>StatusBar : setPosition()
StatusBar->>StatusBar : loadImage()
Game->>StatusBar : new StatusBar('imagesHealthBarEndboss', 2)
StatusBar->>StatusBar : Initialize properties
StatusBar->>StatusBar : setCharacter()
StatusBar->>StatusBar : setPosition()
StatusBar->>StatusBar : loadImage()
```

**Diagram sources**
- [status-bar.class.js](file://models/status-bar.class.js#L70-L76)
- [1-game.js](file://js/1-game.js#L3-L8)

**Section sources**
- [status-bar.class.js](file://models/status-bar.class.js#L70-L76)

## Troubleshooting Guide
Common issues with the StatusBar class include undefined character references and misaligned components. These problems typically occur due to timing issues or incorrect parameter values.

```mermaid
flowchart TD
A[Problem: Character not found] --> B{world object undefined?}
B --> |Yes| C[Wait for world initialization]
B --> |No| D[Check World.character exists]
E[Problem: Misaligned components] --> F{Correct type parameter?}
F --> |No| G[Verify type is 0, 1, or 2]
F --> |Yes| H{Correct statusbar parameter?}
H --> |No| I[Use exact array name]
H --> |Yes| J[Check setPosition logic]
K[Problem: Bar not updating] --> L{statusbar and type correct?}
L --> |No| M[Verify parameters match setWidth condition]
L --> |Yes| N[Check character.energy updates]
```

**Diagram sources**
- [status-bar.class.js](file://models/status-bar.class.js#L72-L83)
- [status-bar.class.js](file://models/status-bar.class.js#L85-L91)
- [status-bar.class.js](file://models/status-bar.class.js#L93-L131)

**Section sources**
- [status-bar.class.js](file://models/status-bar.class.js#L72-L131)