/**
 * Represents a game level containing all entities and environment objects.
 */
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

    /**
     * Creates a new Level instance.
     * @param {Character} character - The player character
     * @param {BackgroundObject[]} backgroundObjects - Background layer objects
     * @param {Cloud[]} clouds - Cloud objects
     * @param {StatusBar[]} statusBars - UI status bar elements
     * @param {Enemy[]} enemies - Enemy entities
     * @param {Endboss[]} endbossArray - Endboss entities
     * @param {GameTimer} gameTimer - Game timer display
     * @param {LevelDisplay} levelDisplay - Level number display
     * @param {CollectableBottle[]} collectableBottles - Bottles available for pickup
     * @param {CollectableCoin[]} collectableCoins - Coins available for pickup
     */
    constructor(character, backgroundObjects, clouds, statusBars, enemies, endbossArray, gameTimer, levelDisplay, collectableBottles, collectableCoins) {
        this.character = character;
        this.backgroundObjects = backgroundObjects;
        this.clouds = clouds;
        this.enemies = [...enemies, ...(endboss ? endbossArray : [])];
        this.statusBars = statusBars;
        this.gameTimer = gameTimer;
        this.levelDisplay = levelDisplay;
        this.collectableBottles = collectableBottles || [];
        this.collectableCoins = collectableCoins || [];
    }
}
