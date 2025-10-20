class Endboss extends MovableObjects {
    height = 400;
    width = this.height * 0.8;
    groundLevel = 450 - this.height;
    y = this.groundLevel;
    x = 400;
    energy = 50;
    rectOffsetTop = 70;
    rectOffsetBottom = 15 + this.rectOffsetTop;
    rectOffsetLeft = 40;
    rectOffsetRight = 40 + this.rectOffsetLeft;
    speed = 0.5;
    startX = 400;
    moveDistance = 500;
    movingRight = true;
    movementInterval = null;
    animationInterval = null;
    hasPlayedDeathAnimation = false;
    rotation = 0;
    targetRotation = 0;
    rotationInterval = null;

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
        this.movementInterval = setInterval(() => {
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
        this.animationInterval = setInterval(() => {
            if (this.isDead()) {
                this.handleDeathAnimation();
            } else if (this.isHurt()) {
                this.playAnimation(this.imagesHurt);
            } else {
                this.playAnimation(this.imagesWalk);
            }
        }, 150);
    }

    handleDeathAnimation() {
        if (!this.hasPlayedDeathAnimation) {
            this.stopAllIntervals();
            this.img = this.imageCache[this.imagesDead[0]];
            this.playDeathAnimationOnce();
        }
    }

    stopAllIntervals() {
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
            this.movementInterval = null;
        }
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
            this.rotationInterval = null;
        }
    }

    playDeathAnimationOnce() {
        this.hasPlayedDeathAnimation = true;
        let frameIndex = 0;

        // Erstes Bild anzeigen und zu 45° rotieren
        this.img = this.imageCache[this.imagesDead[frameIndex]];
        this.rotation = 0;
        this.targetRotation = 45;
        this.smoothRotate();

        const deathAnimationInterval = setInterval(() => {
            frameIndex++;
            if (frameIndex < this.imagesDead.length) {
                this.img = this.imageCache[this.imagesDead[frameIndex]];

                if (frameIndex === 1) {
                    // Zweites Bild: Rotation zurücksetzen und zu 45° rotieren
                    this.rotation = 0;
                    this.targetRotation = 45;
                    this.smoothRotate();
                } else if (frameIndex === 2) {
                    // Letztes Bild: Rotation zurücksetzen und NICHT rotieren
                    if (this.rotationInterval) {
                        clearInterval(this.rotationInterval);
                        this.rotationInterval = null;
                    }
                    this.rotation = 0;
                    this.targetRotation = 0;
                }
            } else {
                clearInterval(deathAnimationInterval);
            }
        }, 150);
    }

    smoothRotate() {
        // Altes Rotations-Interval stoppen falls vorhanden
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
        }

        // Berechne Rotationsschritt für sanfte Animation
        const duration = 150; // 150ms bis zum nächsten Bild
        const fps = 60;
        const totalFrames = (duration / 1000) * fps; // Anzahl Frames in 150ms
        const rotationStep = (this.targetRotation - this.rotation) / totalFrames;

        // Neues Rotations-Interval starten
        this.rotationInterval = setInterval(() => {
            if (Math.abs(this.targetRotation - this.rotation) > Math.abs(rotationStep)) {
                this.rotation += rotationStep; // Sanft zur Ziel-Rotation bewegen
            } else {
                this.rotation = this.targetRotation; // Exakte Ziel-Rotation erreicht
                clearInterval(this.rotationInterval);
                this.rotationInterval = null;
            }
        }, 1000 / fps);
    }

}
