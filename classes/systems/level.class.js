class Level {
    character;
    backgroundObjects;
    clouds;
    enemies;
    statusBars;
    gameTimer;
    levelDisplay;
    collectableBottles;
    collectableCoins;

    constructor(character, backgroundObjects, clouds, statusBars, enemies, endbossArray, gameTimer, levelDisplay, collectableBottles, collectableCoins) {
        this.character = character;
        this.backgroundObjects = backgroundObjects;
        this.clouds = clouds;
        this.enemies = [...enemies, ...(endboss ? endbossArray : [])]; // Endboss nur wenn global.endboss = true
        this.statusBars = statusBars;
        this.gameTimer = gameTimer;
        this.levelDisplay = levelDisplay;
        this.collectableBottles = collectableBottles || [];
        this.collectableCoins = collectableCoins || [];
    }
}
