/**
 * Generiert Hintergrund-Objekte für das Level
 * @returns {Array} Array von BackgroundObject Objekten
 */
function generateBackgrounds() {
    const backgrounds = [];
    const layers = [
        '../assets/img/5_background/layers/air.png',
        '../assets/img/5_background/layers/3_third_layer/full.png',
        '../assets/img/5_background/layers/2_second_layer/full.png',
        '../assets/img/5_background/layers/1_first_layer/full.png'
    ];

    for (let x = levelStart; x <= levelEnd; x += canvasWidth * 2) {
        backgrounds.push(new BackgroundObject(layers[0], x));
        backgrounds.push(new BackgroundObject(layers[1], x));
        backgrounds.push(new BackgroundObject(layers[2], x));
        backgrounds.push(new BackgroundObject(layers[3], x));
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
    const cloudCount = 120;

    for (let i = 0; i < cloudCount; i++) {
        clouds.push(new Cloud(300 + cloudSpacing * i));
    }

    return clouds;
}

/**
 * Generiert Status-Bars für das Level
 * @param {number} amount - Anzahl der Coins im Level (0 = keine Coin-Bar)
 * @returns {Array} Array von StatusBar Objekten
 */
function generateStatusBars(amount) {
    const statusBars = [];
    const barTypes = ['imagesHealthBar', 'imagesBottleBar', 'imagesCoinBar', 'imagesHealthBarEndboss'];

    barTypes.forEach(barType => {
        // Überspringe imagesCoinBar wenn keine Münzen im Level
        if (barType === 'imagesCoinBar' && amount === 0) {
            return; // Skippe diese Bar
        }

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
function generateChickens(count, chickenSpeed) {
    const chickens = [];

    for (let i = 0; i < count; i++) {
        chickens.push(new Chicken(levelEnd, chickenSpeed));
    }

    return chickens;
}

/**
 * Generiert kleine Chickens für das Level
 * @param {number} count - Anzahl der kleinen Chickens
 * @returns {Array} Array von ChickenSmall Objekten
 */
function generateSmallChickens(count, chickenSpeed) {
    const chickens = [];

    for (let i = 0; i < count; i++) {
        chickens.push(new ChickenSmall(levelEnd, chickenSpeed));
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
    const minX = levelStart + 50;
    const maxX = levelEnd - 100;

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
    const minX = levelStart + 50;
    const maxX = levelEnd - 100;

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
