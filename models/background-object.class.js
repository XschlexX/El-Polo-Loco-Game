class BackgroundObject extends MovableObjects {
    y = 0;
    width = 720;
    height = 480;
    drawRect = false;

    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
    }
}
