/**
 * Base class for collectable items that can be picked up by the player.
 * Extends MovableObjects with animation support and staggered start timing.
 */
class CollectableObject extends MovableObjects {
    /** @type {number|null} Timeout ID for delayed animation start */
    animationTimeoutId = null;

    /**
     * Starts a looping animation with optional random delay for visual variety.
     * @param {number} interval - Animation interval in milliseconds
     * @param {number} [delay=0] - Maximum random delay before animation starts
     */
    animate(interval, delay = 0) {
        const randomDelay = Math.random() * delay;

        const startAnimationCallback = () => {
            if (this.animationTimeoutId !== null) {
                GlobalIntervalManager.clearTimeout(this.animationTimeoutId, 'CollectableObject animation start');
                this.animationTimeoutId = null;
            }

            const animationCallback = () => {
                this.playAnimation(this.images);
            };
            const intervalId = setInterval(animationCallback, interval);
            GlobalIntervalManager.register(intervalId, 'CollectableObject animation', this, interval, animationCallback);
        };

        if (randomDelay === 0) {
            startAnimationCallback();
        } else {
            this.animationTimeoutId = setTimeout(startAnimationCallback, randomDelay);
            GlobalIntervalManager.registerTimeout(this.animationTimeoutId, 'CollectableObject animation start', this, randomDelay, startAnimationCallback);
        }
    }
}
