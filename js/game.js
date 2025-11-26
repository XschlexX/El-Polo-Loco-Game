'use strict';

let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    startScreen();

}

window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') {
        keyboard.LEFT = true;
    } else if (e.code === 'ArrowRight') {
        keyboard.RIGHT = true;
    } else if (e.code === 'Space') {
        keyboard.SPACE = true;
    } else if (e.code === 'ArrowUp') {
        keyboard.UP = true;
    } else if (e.code === 'ArrowDown') {
        keyboard.DOWN = true;
    }
    keyboard.ANY = true;
    // console.log(e);
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft') {
        keyboard.LEFT = false;
    } else if (e.code === 'ArrowRight') {
        keyboard.RIGHT = false;
    } else if (e.code === 'Space') {
        keyboard.SPACE = false;
    } else if (e.code === 'ArrowUp') {
        keyboard.UP = false;
    } else if (e.code === 'ArrowDown') {
        keyboard.DOWN = false;
    }

    // Prüfe, ob noch eine Taste gedrückt ist  
    const anyKeyStillPressed =
        keyboard.LEFT ||
        keyboard.RIGHT ||
        keyboard.SPACE ||
        keyboard.UP ||
        keyboard.DOWN;

    // Setze ANY nur auf false, wenn keine andere Taste mehr gedrückt ist  
    if (!anyKeyStillPressed) {
        keyboard.ANY = false;
    }
});


// Level-Function
/**
 * Generiert Hintergrund-Objekte für das Level
 * @returns {Array} Array von BackgroundObject Objekten
 */
function generateBackgrounds() {
    const backgrounds = [];
    const layers = [
        '../assets/img/5_background/layers/air.png',
        '../assets/img/5_background/layers/3_third_layer/',
        '../assets/img/5_background/layers/2_second_layer/',
        '../assets/img/5_background/layers/1_first_layer/'
    ];

    // Generiere Hintergründe von -1440 bis 2160 (alle 720px)
    for (let x = levelStart; x <= levelEnd; x += 720) {
        const imageIndex = ((x - levelStart) / 720) % 2 + 1; // Wechselt zwischen 1 und 2

        backgrounds.push(new BackgroundObject(layers[0], x)); // Air layer
        backgrounds.push(new BackgroundObject(layers[1] + imageIndex + '.png', x));
        backgrounds.push(new BackgroundObject(layers[2] + imageIndex + '.png', x));
        backgrounds.push(new BackgroundObject(layers[3] + imageIndex + '.png', x));
    }

    return backgrounds;
}

/**
 * Generiert Wolken für das Level
 * @returns {Array} Array von Cloud Objekten
 */
function generateClouds() {
    const clouds = [];
    const cloudSpacing = 1440;
    const cloudCount = 12;

    for (let i = 0; i < cloudCount; i++) {
        clouds.push(new Cloud(300 + cloudSpacing * i));
    }

    return clouds;
}

/**
 * Generiert Status-Bars für das Level
 * @returns {Array} Array von StatusBar Objekten
 */
function generateStatusBars() {
    const statusBars = [];
    const barTypes = ['imagesHealthBar', 'imagesBottleBar', 'imagesCoinBar', 'imagesHealthBarEndboss'];

    barTypes.forEach(barType => {
        for (let i = 0; i < 3; i++) {
            statusBars.push(new StatusBar(barType, i));
        }
    });

    return statusBars;
}

/**
 * Generiert Chickens für das Level
 * @param {number} count - Anzahl der Chickens
 * @returns {Array} Array von Chicken Objekten
 */
function generateChickens(count) {
    const chickens = [];

    for (let i = 0; i < count; i++) {
        chickens.push(new Chicken(levelEnd));
    }

    return chickens;
}

/**
 * Generiert kleine Chickens für das Level
 * @param {number} count - Anzahl der kleinen Chickens
 * @returns {Array} Array von ChickenSmall Objekten
 */
function generateSmallChickens(count) {
    const chickens = [];

    for (let i = 0; i < count; i++) {
        chickens.push(new ChickenSmall(levelEnd));
    }

    return chickens;
}

/**
 * Generiert Flaschen mit Mindestabstand zueinander im Bereich levelStart bis levelEnd
 * @param {number} count - Anzahl der Flaschen
 * @param {number} minDistance - Mindestabstand in Pixeln
 * @returns {Array} Array von CollectableBottle Objekten
 */
function generateBottlesWithMinDistance(count, minDistance) {
    const bottles = [];
    const minX = levelStart;
    const maxX = levelEnd - 50;

    for (let i = 0; i < count; i++) {
        let newX;
        let validPosition = false;
        let attempts = 0;
        const maxAttempts = 500; // Mehr Versuche

        while (!validPosition && attempts < maxAttempts) {
            newX = minX + Math.random() * (maxX - minX);
            validPosition = true;

            // Prüfe Abstand zu allen existierenden Flaschen
            for (let bottle of bottles) {
                if (Math.abs(newX - bottle.x) < minDistance) {
                    validPosition = false;
                    break;
                }
            }
            attempts++;
        }

        // Nur hinzufügen wenn gültige Position gefunden wurde
        if (validPosition) {
            const bottle = new CollectableBottle(newX);
            bottles.push(bottle);
        } else {
            console.warn(`Konnte Flasche ${i + 1} nicht mit Mindestabstand platzieren`);
        }
    }

    return bottles;
}

/**
 * Generiert Münzen mit Mindestabstand zueinander im Bereich levelStart bis levelEnd
 * @param {number} count - Anzahl der Münzen
 * @param {number} minDistance - Mindestabstand in Pixeln
 * @returns {Array} Array von CollectableCoin Objekten
 */
function generateCoinsWithMinDistance(count, minDistance) {
    const coins = [];
    const minX = levelStart;
    const maxX = levelEnd - 50;

    for (let i = 0; i < count; i++) {
        let newX;
        let validPosition = false;
        let attempts = 0;
        const maxAttempts = 500; // Mehr Versuche

        while (!validPosition && attempts < maxAttempts) {
            newX = minX + Math.random() * (maxX - minX);
            validPosition = true;

            // Prüfe Abstand zu allen existierenden Münzen
            for (let coin of coins) {
                if (Math.abs(newX - coin.x) < minDistance) {
                    validPosition = false;
                    break;
                }
            }
            attempts++;
        }

        // Nur hinzufügen wenn gültige Position gefunden wurde
        if (validPosition) {
            const coin = new CollectableCoin(newX);
            coins.push(coin);
        } else {
            console.warn(`Konnte Münze ${i + 1} nicht mit Mindestabstand platzieren`);
        }
    }

    return coins;
}