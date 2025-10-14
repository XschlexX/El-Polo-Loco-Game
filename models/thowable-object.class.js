class ThrowableObject extends MovableObjects {

    height = 70;
    width = this.height * 0.3;
    groundLevel = 445 - this.height;
    character;
    // world;

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

    imagesSplash = [
        '../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        '../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        '../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        '../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        '../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        '../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];


    constructor(character) {
        super();
        this.character = character;
        this.x = character.x;
        this.y = character.y;

        this.loadImage(this.imagesRotate[0]);
        this.loadImages(this.imagesRotate);
        this.loadImages(this.imagesSplash);
        this.animate();
        this.throw(this.x, this.y);
        // this.isBroken();
    }

    animate() {
        setInterval(() => {
            if (this.isAboveGround(this.groundLevel)) {
                this.playAnimation(this.imagesRotate);
            } else {
                this.playAnimation(this.imagesSplash);
                // console.log(world);
            }
            this.height = this.img.naturalHeight * 0.2;
            this.width = this.img.naturalWidth * 0.2;
        }, 50);
        // world.throwableObjects.splice(world.throwableObjects.indexOf(this), 1);
    }

    throw(x, y) {
        let throwDirection = this.character.otherDirection ? -2 : 2;
        if (!this.character.otherDirection) {
            this.x = x + this.character.width - this.character.rectOffsetLeft;
        } else {
            this.x = x + this.character.rectOffsetLeft - this.width;
        }
        this.y = y + this.character.rectOffsetTop;
        this.speedY = 9;
        this.applyGravity(this.groundLevel);
        setInterval(() => {
            this.x += throwDirection;
        }, 1000 / 60);

        // console.log(this.character.otherDirection);
    }

    isBroken() {
        console.log(this.isAboveGround(this.groundLevel));
        return this.isAboveGround(this.groundLevel);
    }
}
