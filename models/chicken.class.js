class Chicken extends MovableObjects {
    imagesWalk = [
        '../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        '../assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        '../assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];



    constructor() {
        super();
        this.loadImage('../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 200 + Math.random() * 500;
        this.speed = 0.25 + Math.random() * 0.5;
        this.loadImages(this.imagesWalk);
        this.animateChickenWalk();
    }

    animateChickenWalk() {
        this.moveLeft();
        setInterval(() => {
            let i = this.currentImage % this.imagesWalk.length;
            let path = this.imagesWalk[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 150);
    }
}