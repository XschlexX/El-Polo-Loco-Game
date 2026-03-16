class BackgroundObject extends MovableObjects {
    y = 0;
    width = 1440;
    height = 480;
    parallaxFactor = 1; // Standard: bewegt sich mit voller Kamerageschwindigkeit

    constructor(imagePath, x, parallaxFactor = 1) {
        super().loadImage(imagePath);
        this.x = x;
        this.parallaxFactor = parallaxFactor;
    }
}
