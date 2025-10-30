class CollectableObject extends MovableObjects {

    animate(interval) {
        // Sanfte Animations-Wechsel zwischen den beiden Flaschen-Bildern
        setInterval(() => {
            this.playAnimation(this.images);
        }, interval); // Alle 300ms wechseln für eine ruhige Animation
    }
}