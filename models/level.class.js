class Level {
    clouds;
    enemies;
    backgroundObjects;
    levelEndX = 2160;

    constructor(clouds, enemies, backgroundObjects) {
        this.clouds = clouds;
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
    }
}
