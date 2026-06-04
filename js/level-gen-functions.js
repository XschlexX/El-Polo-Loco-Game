/**
 * Generates parallax background objects for the level.
 * @returns {Array} Array of BackgroundObject instances
 */
function generateBackgrounds() {
    const backgrounds = [];

    const factors = [0, 0.6, 0.8, 1];
    const layers = imagePaths.background.imagesLayers.map((path, i) => ({
        path: path,
        factor: factors[i]
    }));

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
    return generateEntities(count, Chicken, levelEnd, chickenSpeed);
}

/**
 * Generates small chicken enemies for the level.
 * @param {number} count - Number of small chickens to spawn
 * @param {number} chickenSpeed - Movement speed of each small chicken
 * @returns {Array} Array of ChickenSmall instances
 */
function generateSmallChickens(count, chickenSpeed) {
    return generateEntities(count, ChickenSmall, levelEnd, chickenSpeed);
}

/**
 * Creates multiple instances of a given entity class.
 * @param {number} count - Number of entities to create
 * @param {Function} Factory - Constructor class for the entity
 * @param {...*} args - Arguments passed to the constructor
 * @returns {Array} Array of created instances
 */
function generateEntities(count, Factory, ...args) {
    const entities = [];
    for (let i = 0; i < count; i++) entities.push(new Factory(...args));
    return entities;
}

/**
 * Generates bottles with a minimum distance between each, within the level bounds.
 * @param {number} count - Number of bottles to place
 * @param {number} minDistance - Minimum pixel distance between bottles
 * @returns {Array} Array of CollectableBottle instances
 */
function generateBottlesWithMinDistance(count, minDistance) {
    return spawnWithMinDistance(count, minDistance, CollectableBottle, 'Flasche');
}

/**
 * Generates coins with a minimum distance between each, within the level bounds.
 * @param {number} count - Number of coins to place
 * @param {number} minDistance - Minimum pixel distance between coins
 * @returns {Array} Array of CollectableCoin instances
 */
function generateCoinsWithMinDistance(count, minDistance) {
    return spawnWithMinDistance(count, minDistance, CollectableCoin, 'Münze');
}

/**
 * Spawns collectable objects with a minimum distance between each.
 * @param {number} count - Number of objects to place
 * @param {number} minDistance - Minimum pixel distance between objects
 * @param {Function} Factory - Constructor class for the collectable
 * @param {string} label - Label for warning messages
 * @returns {Array} Array of spawned instances
 */
function spawnWithMinDistance(count, minDistance, Factory, label) {
    const items = [];
    const minX = levelStart + 50;
    const maxX = levelEnd - 100;
    for (let i = 0; i < count; i++) {
        const x = findValidPosition(items, minX, maxX, minDistance);
        if (x !== null) items.push(new Factory(x));
        else console.warn(`Konnte ${label} ${i + 1} nicht mit Mindestabstand platzieren`);
    }
    return items;
}

/**
 * Finds a random x-position with minimum distance to existing items.
 * @param {Array} items - Already placed items
 * @param {number} minX - Minimum x boundary
 * @param {number} maxX - Maximum x boundary
 * @param {number} minDistance - Required minimum distance
 * @returns {number|null} Valid x-position or null if none found
 */
function findValidPosition(items, minX, maxX, minDistance) {
    for (let attempt = 0; attempt < 500; attempt++) {
        const newX = minX + Math.random() * (maxX - minX);
        if (items.every(item => Math.abs(newX - item.x) >= minDistance)) return newX;
    }
    return null;
}
