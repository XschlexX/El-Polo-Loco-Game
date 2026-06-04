/**
 * Represents a static background layer element with optional parallax scrolling.
 * @extends MovableObjects
 */
class BackgroundObject extends MovableObjects {
    y = 0;
    width = 1440;
    height = 480;
    parallaxFactor = 1;

    /**
     * Creates a new background object with the specified image and position.
     * @param {string} imagePath - Path to the background image file
     * @param {number} x - Horizontal position of the background object
     * @param {number} [parallaxFactor=1] - Parallax speed factor (1 = full camera speed)
     */
    constructor(imagePath, x, parallaxFactor = 1) {
        super().loadImage(imagePath);
        this.x = x;
        this.parallaxFactor = parallaxFactor;
    }
}
