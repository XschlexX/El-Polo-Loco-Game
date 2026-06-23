/**
 * Base class for collectable items that can be picked up by the player.
 * Extends MovableObjects with animation support and staggered start timing.
 */
class CollectableObject extends MovableObjects {
    animationTimeoutId = null;

    /**
     * Starts a looping animation with optional random delay for visual variety.
     * @param {number} interval - Animation interval in milliseconds
     * @param {number} [delay=0] - Maximum random delay before animation starts
     */
    animate(interval, delay = 0) {
        const randomDelay = Math.random() * delay;
        if (randomDelay === 0) {
            this.startAnimation(interval);
        } else {
            const startCallback = () => this.startAnimation(interval);
            this.animationTimeoutId = setTimeout(startCallback, randomDelay);
            GlobalIntervalManager.registerTimeout(this.animationTimeoutId, 'CollectableObject animation start', this, randomDelay, startCallback);
        }
    }

    /**
     * Clears startup timeout and sets up the animation loop.
     * @param {number} interval - Animation interval in milliseconds.
     */
    startAnimation(interval) {
        this.clearAnimationTimeout();
        this.setupAnimationLoop(interval);
    }

    /**
     * Clears any active animation startup timeout.
     */
    clearAnimationTimeout() {
        if (this.animationTimeoutId !== null) {
            GlobalIntervalManager.clearTimeout(this.animationTimeoutId, 'CollectableObject animation start');
            this.animationTimeoutId = null;
        }
    }

    /**
     * Sets up the animation interval and registers it with the interval manager.
     * @param {number} interval - Animation interval in milliseconds.
     */
    setupAnimationLoop(interval) {
        const animationCallback = () => this.playAnimation(this.images);
        const intervalId = setInterval(animationCallback, interval);
        GlobalIntervalManager.register(intervalId, 'CollectableObject animation', this, interval, animationCallback);
    }
}
