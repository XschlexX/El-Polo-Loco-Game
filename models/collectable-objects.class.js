class CollectableObject extends MovableObjects {

    animate(interval, delay = 0) {
        // Sanfte Animations-Wechsel zwischen den beiden Flaschen-Bildern
        const randomDelay = Math.random() * delay;
        setTimeout(() => {
            setInterval(() => {
                this.playAnimation(this.images);
            }, interval);
        }, randomDelay);
    }
}