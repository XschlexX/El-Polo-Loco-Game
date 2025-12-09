class CollectableObject extends MovableObjects {

    animate(interval, delay = 0) {
        // Sanfte Animations-Wechsel zwischen den beiden Flaschen-Bildern
        const randomDelay = Math.random() * delay;
        setTimeout(() => {
            const animationCallback = () => {
                this.playAnimation(this.images);
            };
            const intervalId = setInterval(animationCallback, interval);
            GlobalIntervalManager.register(intervalId, 'CollectableObject animation', this, interval, animationCallback);
        }, randomDelay);
    }
}