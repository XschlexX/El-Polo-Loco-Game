let currentLevel;

/**
 * Creates a level based on the given level number.
 * @param {number} levelNumber - The level number (1–5, or 999 for god mode)
 * @returns {Level|null} The created Level object, or null if not found
 */
function createLevel(levelNumber) {
    const levelKey = levelNumber === 999 ? 'godModeLevel' : `level${levelNumber}`;
    const lvlData = levels[levelKey];

    if (!lvlData) {
        console.error(`Level ${levelNumber} nicht gefunden!`);
        return null;
    }

    currentLevelNumber = lvlData.levelNumber;

    levelStart = lvlData.levelStart;
    levelEnd = lvlData.levelEnd;

    currentLevel = new Level(
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

    return currentLevel;
}
