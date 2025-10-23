class Level {
    clouds;
    enemies;
    backgroundObjects;
    statusBars;
    collectableBottles;
    levelEndX = 2160;

    constructor(clouds, enemies, backgroundObjects, statusBars, collectableBottles) {
        this.clouds = clouds;
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
        this.statusBars = statusBars;
        this.collectableBottles = collectableBottles || []; // Optional, falls nicht übergeben
    }
}
