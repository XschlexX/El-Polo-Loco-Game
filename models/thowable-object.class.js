class ThrowableObject extends MovableObjects {

    height = 70;
    width = this.height * 0.3;
    groundLevel = 445 - this.height;
    world;

    imagesRotate = [
        '../assets/img/6_salsa_bottle/bottle_rotation/1_1_bottle_rotation.png',
        '../assets/img/6_salsa_bottle/bottle_rotation/1_2_bottle_rotation.png',
        '../assets/img/6_salsa_bottle/bottle_rotation/1_3_bottle_rotation.png',
        '../assets/img/6_salsa_bottle/bottle_rotation/2_1_bottle_rotation.png',
        '../assets/img/6_salsa_bottle/bottle_rotation/2_2_bottle_rotation.png',
        '../assets/img/6_salsa_bottle/bottle_rotation/2_3_bottle_rotation.png',
        '../assets/img/6_salsa_bottle/bottle_rotation/3_1_bottle_rotation.png',
        '../assets/img/6_salsa_bottle/bottle_rotation/3_2_bottle_rotation.png',
        '../assets/img/6_salsa_bottle/bottle_rotation/3_3_bottle_rotation.png',
        '../assets/img/6_salsa_bottle/bottle_rotation/4_1_bottle_rotation.png',
        '../assets/img/6_salsa_bottle/bottle_rotation/4_2_bottle_rotation.png',
        '../assets/img/6_salsa_bottle/bottle_rotation/4_3_bottle_rotation.png'
    ];


    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;

        this.loadImage(this.imagesRotate[0]);
        this.loadImages(this.imagesRotate);
        this.animate();
        this.throw(x, y);
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.imagesRotate);
            this.height = this.img.naturalHeight * 0.2;
            this.width = this.img.naturalWidth * 0.2;
        }, 50);
    }

    throw(x, y) {
        this.x = x;
        this.y = y;
        this.speedY = 7;
        this.applyGravity(this.groundLevel);
        setInterval(() => {
            this.x += 6;
        }, 1000 / 60);

    }
}
