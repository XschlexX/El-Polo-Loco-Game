/**
 * Represents a collectable coin in the game world.
 * Extends CollectableObject with coin-specific dimensions, collision offsets, and a looping image animation.
 */
class CollectableCoin extends CollectableObject {
    height = 120;
    width = this.height * 1;
    groundLevel = 430 - this.height;
    y = this.groundLevel;

    hitBoxLeft = this.width * 0.35;
    hitBoxTop = this.height * 0.35;
    hitBoxRight = this.width * 0.35 + this.hitBoxLeft;
    hitBoxBottom = this.height * 0.35 + this.hitBoxTop;

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
