class CollectableObject extends MovableObjects {
    animationTimeoutId = null; // Speichere die Timeout-ID

    animate(interval, delay = 0) {
        // Sanfte Animations-Wechsel zwischen den beiden Flaschen-Bildern
        const randomDelay = Math.random() * delay;

        const startAnimationCallback = () => {
            // Markiere Timeout als abgelaufen (wenn es existiert)
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

        // Wenn kein Delay, starte Animation sofort ohne Timeout
        if (randomDelay === 0) {
            startAnimationCallback();
        } else {
            this.animationTimeoutId = setTimeout(startAnimationCallback, randomDelay);
            GlobalIntervalManager.registerTimeout(this.animationTimeoutId, 'CollectableObject animation start', this, randomDelay, startAnimationCallback);
        }
    }
}
