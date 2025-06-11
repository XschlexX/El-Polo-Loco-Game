class Chicken extends MovableObjects {


    constructor() {
        super();
        this.loadImage('../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 200 + Math.random() * 500;
        // this.y = this.groundLevel - 5;
        this.animateChicken();
    }

    animateChicken() {
        setInterval(() => {
            this.x -= 0.7;
        }, 1000 / 60);
    }
}