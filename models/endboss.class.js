class Endboss extends MovableObjects {
    height = 400;
    width = this.height * 0.8;
    groundLevel = 450 - this.height;
    y = this.groundLevel;
    x = 400;
    rectOffsetTop = 70;
    rectOffsetBottom = 15 + this.rectOffsetTop;
    rectOffsetLeft = 40;
    rectOffsetRight = 40 + this.rectOffsetLeft;
    speed = 0.5;
    startX = 400;
    moveDistance = 500;
    movingRight = true;

    imagesWalk = [
        '../assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    imagesAlert = [
        '../assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        '../assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        '../assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        '../assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        '../assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        '../assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        '../assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        '../assets/img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    imagesAttack = [
        '../assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        '../assets/img/4_enemie_boss_chicken/3_attack/G14.png',
        '../assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        '../assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        '../assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        '../assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        '../assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        '../assets/img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    imagesHurt = [
        '../assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        '../assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        '../assets/img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    imagesDead = [
        '../assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        '../assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        '../assets/img/4_enemie_boss_chicken/5_dead/G26.png',
    ];


    constructor() {
        super();
        this.loadImage(this.imagesWalk[0]);
        this.loadImages(this.imagesWalk);
        this.loadImages(this.imagesAlert);
        this.loadImages(this.imagesAttack);
        this.loadImages(this.imagesHurt);
        this.loadImages(this.imagesDead);
        this.animate();
    }

    animate() {
        // Bewegung hin und her
        setInterval(() => {
            if (this.movingRight) {
                this.x += this.speed;
                this.otherDirection = true; // Nach rechts = gespiegelt
                // Wechsel Richtung wenn rechte Grenze erreicht
                if (this.x >= this.startX + this.moveDistance) {
                    this.movingRight = false;
                }
            } else {
                this.x -= this.speed;
                this.otherDirection = false; // Nach links = normal
                // Wechsel Richtung wenn linke Grenze erreicht
                if (this.x <= this.startX) {
                    this.movingRight = true;
                }
            }
        }, 1000 / 60);

        // Animation basierend auf Zustand
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.imagesDead);
            } else if (this.isHurt()) {
                this.playAnimation(this.imagesHurt);
            } else {
                this.playAnimation(this.imagesWalk);
            }
        }, 150);
    }

}
