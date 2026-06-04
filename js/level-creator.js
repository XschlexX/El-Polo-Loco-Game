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
    return new Level(
        new Character(lvlData.characterHP, lvlData.characterBottles),
        generateBackgrounds(),
        generateClouds(),
        generateStatusBars(lvlData.coinsAmount),
        [
            ...generateSmallChickens(lvlData.smallChickenAmount, lvlData.chickenSpeed),
            ...generateChickens(lvlData.bigChickenAmount, lvlData.chickenSpeed)
        ],
        [
            new Endboss(lvlData.endbossHP),
        ],
        [
            new GameTimer()
        ],
        [
            new LevelDisplay(lvlData.levelNumber)
        ],
        generateBottlesWithMinDistance(lvlData.bottleAmount, 100),
        generateCoinsWithMinDistance(lvlData.coinsAmount, 50)
    );
}
