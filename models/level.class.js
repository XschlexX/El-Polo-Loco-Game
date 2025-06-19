class Level {
    clouds;
    enemies;
    backgroundObjects;
    statusBar;
    levelEndX = 2160;

    constructor(clouds, enemies, backgroundObjects, statusBar) {
        this.clouds = clouds;
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
        this.statusBar = statusBar;
    }
}
