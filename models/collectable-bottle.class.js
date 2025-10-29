class CollectableBottle extends MovableObjects {
    height = 60;
    width = this.height * 0.6;
    groundLevel = 430 - this.height;
    y = this.groundLevel;

    // Kollisions-Offsets
    rectOffsetTop = 10;
    rectOffsetBottom = 10 + this.rectOffsetTop;
    rectOffsetLeft = 10;
    rectOffsetRight = 10 + this.rectOffsetLeft;

    // Animations-Bilder
    imagesIdle = [
        '../assets/img/6_salsa_bottle/1-1_salsa_bottle_on_ground.png',
        '../assets/img/6_salsa_bottle/2-1_salsa_bottle_on_ground.png'
    ];

    constructor(x) {
        super();
        // X-Position als Parameter übergeben oder random falls nicht angegeben
        this.x = x;
        this.y = this.y + Math.random() * 40;

        // Lade Bilder
        this.loadImage(this.imagesIdle[0]);
        this.loadImages(this.imagesIdle);

        // Starte Animation
        this.animate();
    }

    animate() {
        // Sanfte Animations-Wechsel zwischen den beiden Flaschen-Bildern
        setInterval(() => {
            this.playAnimation(this.imagesIdle);
        }, 500); // Alle 300ms wechseln für eine ruhige Animation
    }
}
