/**
 * Generates parallax background objects for the level.
 * @returns {Array} Array of BackgroundObject instances
 */
function generateBackgrounds() {
    const backgrounds = [];

    const layers = [
        { path: 'assets/img/5_background/layers/air.png', factor: 0 },
        { path: 'assets/img/5_background/layers/3_third_layer/full.png', factor: 0.6 },
        { path: 'assets/img/5_background/layers/2_second_layer/full.png', factor: 0.8 },
        { path: 'assets/img/5_background/layers/1_first_layer/full.png', factor: 1 }
    ];

    for (let x = levelStart; x <= levelEnd; x += canvasWidth * 2) {
        layers.forEach(layer => {
            backgrounds.push(new BackgroundObject(layer.path, x, layer.factor));
        });
    }

    return backgrounds;
}

/**
 * Generates cloud objects spread evenly across the level.
 * @returns {Array} Array of Cloud instances
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
 * Generates status bar UI elements for the HUD.
 * @param {number} coinAmount - Number of coins in the level (0 skips the coin bar)
 * @returns {Array} Array of StatusBar instances
 */
function generateStatusBars(amount) {
    const statusBars = [];
    const barTypes = ['imagesHealthBar', 'imagesBottleBar', 'imagesCoinBar', 'imagesHealthBarEndboss'];

    barTypes.forEach(barType => {
        if (barType === 'imagesCoinBar' && amount === 0) {
            return;
        }

        if (barType === 'imagesHealthBarEndboss' && !endboss) {
            return;
        }

        for (let i = 0; i < 3; i++) {
            statusBars.push(new StatusBar(barType, i));
        }
    });

    return statusBars;
}

/**
 * Generates regular chicken enemies for the level.
 * @param {number} count - Number of chickens to spawn
 * @param {number} chickenSpeed - Movement speed of each chicken
 * @returns {Array} Array of Chicken instances
 */
function generateChickens(count, chickenSpeed) {
    const chickens = [];

    for (let i = 0; i < count; i++) {
        chickens.push(new Chicken(levelEnd, chickenSpeed));
    }

    return chickens;
}

/**
 * Generates small chicken enemies for the level.
 * @param {number} count - Number of small chickens to spawn
 * @param {number} chickenSpeed - Movement speed of each small chicken
 * @returns {Array} Array of ChickenSmall instances
 */
function generateSmallChickens(count, chickenSpeed) {
    const chickens = [];

    for (let i = 0; i < count; i++) {
        chickens.push(new ChickenSmall(levelEnd, chickenSpeed));
    }

    return chickens;
}

/**
 * Generates bottles with a minimum distance between each, within the level bounds.
 * @param {number} count - Number of bottles to place
 * @param {number} minDistance - Minimum pixel distance between bottles
 * @returns {Array} Array of CollectableBottle instances
 */
function generateBottlesWithMinDistance(count, minDistance) {
    const bottles = [];
    const minX = levelStart + 50;
    const maxX = levelEnd - 100;

    for (let i = 0; i < count; i++) {
        let newX;
        let validPosition = false;
        let attempts = 0;
        const maxAttempts = 500;

        while (!validPosition && attempts < maxAttempts) {
            newX = minX + Math.random() * (maxX - minX);
            validPosition = true;

            for (let bottle of bottles) {
                if (Math.abs(newX - bottle.x) < minDistance) {
                    validPosition = false;
                    break;
                }
            }
            attempts++;
        }

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
 * Generates coins with a minimum distance between each, within the level bounds.
 * @param {number} count - Number of coins to place
 * @param {number} minDistance - Minimum pixel distance between coins
 * @returns {Array} Array of CollectableCoin instances
 */
function generateCoinsWithMinDistance(count, minDistance) {
    const coins = [];
    const minX = levelStart + 50;
    const maxX = levelEnd - 100;

    for (let i = 0; i < count; i++) {
        let newX;
        let validPosition = false;
        let attempts = 0;
        const maxAttempts = 500;

        while (!validPosition && attempts < maxAttempts) {
            newX = minX + Math.random() * (maxX - minX);
            validPosition = true;

            for (let coin of coins) {
                if (Math.abs(newX - coin.x) < minDistance) {
                    validPosition = false;
                    break;
                }
            }
            attempts++;
        }

        if (validPosition) {
            const coin = new CollectableCoin(newX);
            coins.push(coin);
        } else {
            console.warn(`Konnte Münze ${i + 1} nicht mit Mindestabstand platzieren`);
        }
    }

    return coins;
}
