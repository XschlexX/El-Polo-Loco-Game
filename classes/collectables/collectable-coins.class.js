/**
 * Represents a collectable coin in the game world.
 * Extends CollectableObject with coin-specific dimensions, collision offsets, and a looping image animation.
 */
class CollectableCoin extends CollectableObject {
    /** @type {number} Height of the coin in pixels */
    height = 120;
    /** @type {number} Width of the coin in pixels */
    width = this.height * 1;
    /** @type {number} Y-coordinate of the ground level for coin placement */
    groundLevel = 430 - this.height;
    /** @type {number} Current Y position of the coin */
    y = this.groundLevel;

    /** @type {number} Left collision offset from the coin's X position */
    hitBoxLeft = this.width * 0.35;
    /** @type {number} Top collision offset from the coin's Y position */
    hitBoxTop = this.height * 0.35;
    /** @type {number} Right collision boundary offset */
    hitBoxRight = this.width * 0.35 + this.hitBoxLeft;
    /** @type {number} Bottom collision boundary offset */
    hitBoxBottom = this.height * 0.35 + this.hitBoxTop;

    /** @type {string[]} Image paths for the coin animation frames */
    images = [
        'assets/img/8_coin/coin_1.png',
        'assets/img/8_coin/coin_2.png'
    ];

    /**
     * Creates a new CollectableCoin at the given horizontal position with a randomized vertical offset.
     * @param {number} x - Horizontal position of the coin
     */
    constructor(x) {
        super();
        this.x = x;
        this.y = this.groundLevel - Math.random() * 160;

        this.loadImage(this.images[0]);
        this.loadImages(this.images);

        this.animate(300, 1000);
    }
}
