class Character extends MovableObjects {
    height = 280;
    width = this.height * 0.5;
    groundLevel = 445 - this.height;
    x = 50;
    y = this.groundLevel;
    // y = 0;
    speed = 5;
    sleep = false;
    rectOffsetLeft = 50;
    rectOffsetTop = 110;
    rectOffsetRight = 100;
    rectOffsetBottom = 125;
    world;
    imagesIdle = [
        '../assets/img/2_character_pepe/1_idle/idle/I-1.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-2.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-3.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-4.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-5.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-6.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-7.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-8.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-9.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    imagesLongIdle = [
        '../assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
        '../assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
        '../assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
        '../assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
        '../assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
        '../assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
        '../assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
        '../assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
        '../assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
        '../assets/img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];

    imagesWalk = [
        '../assets/img/2_character_pepe/2_walk/W-21.png',
        '../assets/img/2_character_pepe/2_walk/W-22.png',
        '../assets/img/2_character_pepe/2_walk/W-23.png',
        '../assets/img/2_character_pepe/2_walk/W-24.png',
        '../assets/img/2_character_pepe/2_walk/W-25.png',
        '../assets/img/2_character_pepe/2_walk/W-26.png'
    ];

    imagesJump = [
        '../assets/img/2_character_pepe/3_jump/J-31.png',
        '../assets/img/2_character_pepe/3_jump/J-32.png',
        '../assets/img/2_character_pepe/3_jump/J-33.png',
        '../assets/img/2_character_pepe/3_jump/J-34.png',
        '../assets/img/2_character_pepe/3_jump/J-35.png',
        '../assets/img/2_character_pepe/3_jump/J-36.png',
        '../assets/img/2_character_pepe/3_jump/J-37.png',
        '../assets/img/2_character_pepe/3_jump/J-38.png',
        '../assets/img/2_character_pepe/3_jump/J-39.png'
    ];

    imagesThrow = [
        '../assets/img/2_character_pepe/6_throw/th_1.png',
        '../assets/img/2_character_pepe/6_throw/th_2.png',
        '../assets/img/2_character_pepe/6_throw/th_3.png',
        '../assets/img/2_character_pepe/6_throw/th_4.png',
        '../assets/img/2_character_pepe/6_throw/th_5.png'
    ];

    imagesHurt = [
        '../assets/img/2_character_pepe/4_hurt/H-41.png',
        '../assets/img/2_character_pepe/4_hurt/H-42.png',
        '../assets/img/2_character_pepe/4_hurt/H-43.png'
    ];

    imagesDead = [
        '../assets/img/2_character_pepe/5_dead/D-51.png',
        '../assets/img/2_character_pepe/5_dead/D-52.png',
        '../assets/img/2_character_pepe/5_dead/D-53.png',
        '../assets/img/2_character_pepe/5_dead/D-54.png',
        '../assets/img/2_character_pepe/5_dead/D-55.png',
        '../assets/img/2_character_pepe/5_dead/D-56.png',
        '../assets/img/2_character_pepe/5_dead/D-57.png'
    ];

    constructor() {
        super();
        this.loadImage(this.imagesIdle[0]);
        this.loadImages(this.imagesIdle);
        this.loadImages(this.imagesLongIdle);
        this.loadImages(this.imagesWalk);
        this.loadImages(this.imagesJump);
        this.loadImages(this.imagesThrow);
        this.loadImages(this.imagesHurt);
        this.loadImages(this.imagesDead);
        this.applyGravity(this.groundLevel);
        this.animate();
    }

    animate() {
        let sleepTimer;
        const resetSleepTimer = () => {
            clearTimeout(sleepTimer);
            this.sleep = false;
            sleepTimer = setTimeout(() => {
                this.sleep = true;
            }, 3000);
        };

        resetSleepTimer();

        setInterval(() => {
            if (this.world.keyboard.ANY) {
                resetSleepTimer();
            }
        }, 100); // Häufigere Überprüfung, aber nicht zu oft
        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.levelEndX + 100) {
                this.moveRight();
            }
            if (this.world.keyboard.LEFT && this.x > -1340) {
                this.moveLeft(true);
            }
            if (this.world.keyboard.UP && !this.isAboveGround(this.groundLevel)) {
                this.jump();
                this.currentImage = 0;
            }
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.imagesDead);
            } else if (this.isHurt()) {
                this.playAnimation(this.imagesHurt);
            } else {
                if (this.world.keyboard.RIGHT && !this.isAboveGround(this.groundLevel) || this.world.keyboard.LEFT && !this.isAboveGround(this.groundLevel)) {
                    this.playAnimation(this.imagesWalk);
                } else if (this.isAboveGround(this.groundLevel)) {
                    this.playAnimation(this.imagesJump);
                } else if (this.world.keyboard.SPACE) {
                    this.playAnimation(this.imagesThrow);
                } else if (this.sleep) {
                    this.playAnimation(this.imagesLongIdle);
                } else {
                    this.playAnimation(this.imagesIdle);
                }
            }
        }, 150);

    }
}

