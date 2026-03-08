class Level {
    character;
    backgroundObjects;
    clouds;
    enemies;
    statusBars;
    gameTimer;
    debugInfo;
    levelDisplay;
    collectableBottles;
    collectableCoins;

    constructor(character, backgroundObjects, clouds, statusBars, enemies, endbossArray, gameTimer, debugInfo, levelDisplay, collectableBottles, collectableCoins) {
        this.character = character;
        this.backgroundObjects = backgroundObjects;
        this.clouds = clouds;
        this.enemies = [...enemies, ...(endboss ? endbossArray : [])]; // Endboss nur wenn global.endboss = true
        this.statusBars = statusBars;
        this.gameTimer = gameTimer;
        this.debugInfo = debugInfo;
        this.levelDisplay = levelDisplay;
        this.collectableBottles = collectableBottles || [];
        this.collectableCoins = collectableCoins || [];

    }
}
