let currentLevel;

/**
 * Creates a level based on the given level number.
 * @param {number} levelNumber - The level number (1–5, or 999 for god mode)
 * @returns {Level|null} The created Level object, or null if not found
 */
function createLevel(levelNumber) {
    const lvlData = resolveLevelData(levelNumber);
    if (!lvlData) return null;
    initLevelBounds(lvlData);
    currentLevel = buildLevel(lvlData);
    return currentLevel;
}

/**
 * Resolves the level configuration key and retrieves the data.
 * @param {number} levelNumber - The level number
 * @returns {Object|null} Level configuration data or null if not found
 */
function resolveLevelData(levelNumber) {
    const levelKey = levelNumber === 999 ? 'godModeLevel' : `level${levelNumber}`;
    const lvlData = levels[levelKey];
    if (!lvlData) console.error(`Level ${levelNumber} nicht gefunden!`);
    return lvlData || null;
}

/**
 * Sets global level boundary and number variables from level data.
 * @param {Object} lvlData - Level configuration data
 */
function initLevelBounds(lvlData) {
    currentLevelNumber = lvlData.levelNumber;
    levelStart = lvlData.levelStart;
    levelEnd = lvlData.levelEnd;
}

/**
 * Builds and returns a new Level instance with all game entities.
 * @param {Object} lvlData - Level configuration data
 * @returns {Level} The constructed Level object
 */
function buildLevel(lvlData) {
    const character = new Character(lvlData.characterHP, lvlData.characterBottles);
    const enemies = generateEnemies(lvlData);
    const bottles = generateBottlesWithMinDistance(lvlData.bottleAmount, 100);
    const coins = generateCoinsWithMinDistance(lvlData.coinsAmount, 50);
    const statusBars = generateStatusBars(lvlData.coinsAmount);

    return new Level(
        character, generateBackgrounds(), generateClouds(), statusBars,
        enemies, [new Endboss(lvlData.endbossHP)], [new GameTimer()], [new LevelDisplay(lvlData.levelNumber)],
        bottles, coins
    );
}

/**
 * Generates enemies (chickens and endboss) for the level.
 * @param {Object} lvlData - Level configuration data
 * @returns {Array} List of enemies
 */
function generateEnemies(lvlData) {
    return [
        ...generateSmallChickens(lvlData.smallChickenAmount, lvlData.chickenSpeed),
        ...generateChickens(lvlData.bigChickenAmount, lvlData.chickenSpeed)
    ];
}
