class Level {
    clouds;
    enemies;
    backgroundObjects;
    statusBars;
    levelEndX = 2160;

    constructor(clouds, enemies, backgroundObjects, statusBars) {
        this.clouds = clouds;
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
        this.statusBars = statusBars;
    }
}
