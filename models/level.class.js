class Level {
    clouds;
    enemies;
    backgroundObjects;
    statusBars;
    collectableBottles;
    levelStartX; // Level beginnt hier (erstes Hintergrundbild)
    levelEndX; // Level endet hier (letztes Hintergrundbild)

    constructor(levelDistance, backgroundObjects, clouds, statusBars, enemies, collectableBottles) {
        this.levelStartX = levelDistance[0];
        this.levelEndX = levelDistance[1];
        this.backgroundObjects = backgroundObjects;
        this.clouds = clouds;
        this.enemies = enemies;
        this.statusBars = statusBars;
        this.collectableBottles = collectableBottles || []; // Optional, falls nicht übergeben
    }
}
