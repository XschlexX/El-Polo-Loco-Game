class Level {
    backgroundObjects;
    clouds;
    enemies;
    endboss;
    statusBars;
    gameTimer;
    debugInfo;
    collectableBottles;
    collectableCoins;
    levelStartX; // Level beginnt hier (erstes Hintergrundbild)
    levelEndX; // Level endet hier (letztes Hintergrundbild)

    constructor(levelDistance, backgroundObjects, clouds, statusBars, enemies, endboss, gameTimer, debugInfo, collectableBottles, collectableCoins) {
        this.levelStartX = levelDistance[0];
        this.levelEndX = levelDistance[1];
        this.backgroundObjects = backgroundObjects;
        this.clouds = clouds;
        this.enemies = [...enemies, ...endboss]; // Kombiniere enemies und endboss in ein Array
        this.statusBars = statusBars;
        this.gameTimer = gameTimer; // Timer als eigenes Property
        this.debugInfo = debugInfo; // Debug-Info als eigenes Property

        // this.endboss = endboss[0]; // Erste Endboss aus dem Array
        this.collectableBottles = collectableBottles || []; // Optional, falls nicht übergeben
        this.collectableCoins = collectableCoins || [];

    }
}
