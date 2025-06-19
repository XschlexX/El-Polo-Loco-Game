class Cloud extends MovableObjects {
    y = 0;
    width = 1440;
    height = 480;
    speed = 0.15;

    constructor() {
        super().loadImage('../assets/img/5_background/layers/4_clouds/full.png');
        this.x = Math.random() * 500;
        this.animateCloud();
    }

    animateCloud() {
        setInterval(() => {
            this.moveLeft(false);
        }, 1000 / 60);
    }
}