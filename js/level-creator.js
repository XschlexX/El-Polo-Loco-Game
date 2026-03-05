let currentLevel;

/**
 * Erstellt ein Level basierend auf der übergebenen Level-Nummer
 * @param {number} levelNumber - Die Level-Nummer (1-5 oder 999999 für God Mode)
 * @returns {Level} Das erstellte Level-Objekt
 */
function createLevel(levelNumber) {
    // Hole die Level-Konfiguration aus global.js
    const levelKey = levelNumber === 999 ? 'godModeLevel' : `level${levelNumber}`;
    const lvlData = levels[levelKey];

    if (!lvlData) {
        console.error(`Level ${levelNumber} nicht gefunden!`);
        return null;
    }

    currentLevelNumber = lvlData.levelNumber;

    // Setze globale Variablen für die Generator-Funktionen
    // Diese werden in level-gen-functions.js verwendet
    levelStart = lvlData.levelStart;
    levelEnd = lvlData.levelEnd;

    currentLevel = new Level(
        [
            lvlData.levelStart,
            lvlData.levelEnd
        ],
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
            new DebugInfo()
        ],
        [
            new LevelDisplay(lvlData.levelNumber)
        ],
        generateBottlesWithMinDistance(lvlData.bottleAmount, 100),
        generateCoinsWithMinDistance(lvlData.coinsAmount, 50)
    );

    return currentLevel;
}
