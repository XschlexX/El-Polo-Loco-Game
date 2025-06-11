class Cloud extends MovableObjects {
    y = 0;
    width = 720;
    height = 480;
    speed = 0.15;

    constructor() {
        super().loadImage('../assets/img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 500;
        this.animateCloud();
    }

    animateCloud() {
        this.moveLeft();
    }
}