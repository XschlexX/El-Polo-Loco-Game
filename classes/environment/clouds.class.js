/**
 * Represents a cloud layer that slowly drifts across the sky.
 * @extends MovableObjects
 */
class Cloud extends MovableObjects {
    y = 0;
    width = 1440;
    height = 480;
    speed = 0.15;

    /**
     * Creates a new cloud at the specified horizontal position.
     * @param {number} x - Horizontal position of the cloud
     */
    constructor(x) {
        super().loadImage('assets/img/5_background/layers/4_clouds/full.png');
        this.x = x;
        this.animateCloud();
    }

    /**
     * Starts the cloud movement interval for continuous leftward drift.
     */
    animateCloud() {
        const cloudCallback = () => {
            this.moveLeft(false, this.speed, levelStart - canvas.width * 100);
        };
        const intervalId = setInterval(cloudCallback, 1000 / 60);
        GlobalIntervalManager.register(intervalId, 'Cloud movement', this, 1000 / 60, cloudCallback);
    }
}
