class Endboss extends MovableObjects {
    // Basis-Properties (von Parent geerbt: x, y, width, height, energy, etc.)
    height = 400;
    width = this.height * 0.8;
    groundLevel = 450 - this.height;
    y = this.groundLevel;
    startX = 1200;
    x = this.startX;
    energy = 50;
    rectOffsetTop = 70;
    rectOffsetBottom = 15 + this.rectOffsetTop;
    rectOffsetLeft = 40;
    rectOffsetRight = 40 + this.rectOffsetLeft;

    // Bewegungs-Parameter
    movement = {
        speed: 0.5,              // Normale Patrol-Geschwindigkeit
        chasingSpeed: 4,         // Geschwindigkeit während Verfolgung
        moveDistance: 300,       // Patrol-Reichweite
        movingRight: true        // Aktuelle Patrol-Richtung
    };

    // Ramm-Angriff Parameter
    ramming = {
        isActive: false,         // Ramm-Modus aktiv?
        direction: 1,            // 1 = rechts, -1 = links
        distance: this.width * 1.5,  // Wie weit nach Kollision weiterlaufen
        distanceTraveled: 0      // Wie weit bereits gelaufen
    };

    // Zustands-Flags
    state = {
        isChasing: false,              // Verfolgt den Character?
        hasPlayedAlert: false,         // Alert-Animation bereits gespielt?
        hasPlayedAttack: false,        // Attack-Animation bereits gespielt?
        hasPlayedDeath: false,         // Death-Animation bereits gespielt?
        isPlayingAlert: false,         // Alert-Animation läuft gerade?
        isPlayingAttack: false         // Attack-Animation läuft gerade?
    };

    // Rotations-Parameter
    rotation = {
        current: 0,              // Aktuelle Rotation in Grad
        target: 0,               // Ziel-Rotation in Grad
        intervalId: null         // Interval für sanfte Rotation
    };

    // Interval-IDs
    intervals = {
        movement: null,
        animation: null
    };

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
        '../assets/img/4_enemie_boss_chicken/3_attack/G20.png',
        '../assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        '../assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        '../assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        '../assets/img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    imagesAttackRun = [
        '../assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G4.png',
        '../assets/img/4_enemie_boss_chicken/3_attack/G13.png',
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
        this.loadImages(this.imagesAttackRun);
        this.loadImages(this.imagesHurt);
        this.loadImages(this.imagesDead);
        this.animate();
    }

    animate() {
        // Bewegung hin und her
        this.intervals.movement = setInterval(() => {
            // Keine Bewegung während Alert- oder Attack-Animation
            if (this.state.isPlayingAlert || this.state.isPlayingAttack) {
                return;
            }

            // Ramming-Modus: Läuft nach Kollision weiter
            if (this.ramming.isActive) {
                this.x += this.movement.chasingSpeed * this.ramming.direction;
                this.ramming.distanceTraveled += this.movement.chasingSpeed;

                // Wenn genug weit gelaufen, drehe um und gehe zurück in Chasing-Modus
                if (this.ramming.distanceTraveled >= this.ramming.distance) {
                    this.ramming.isActive = false;
                    this.ramming.distanceTraveled = 0;
                    this.otherDirection = !this.otherDirection;
                }
                return;
            }

            // Chasing-Modus: Verfolge den Character
            if (this.state.isChasing && this.world && this.world.character) {
                const character = this.world.character;

                if (character.x > this.x) {
                    this.x += this.movement.chasingSpeed;
                    this.otherDirection = true;
                    this.ramming.direction = 1;
                } else {
                    this.x -= this.movement.chasingSpeed;
                    this.otherDirection = false;
                    this.ramming.direction = -1;
                }
                return;
            }

            // Normale Patrol-Bewegung
            if (this.movement.movingRight) {
                this.x += this.movement.speed;
                this.otherDirection = true;
                if (this.x >= this.startX + this.movement.moveDistance) {
                    this.movement.movingRight = false;
                }
            } else {
                this.x -= this.movement.speed;
                this.otherDirection = false;
                if (this.x <= this.startX) {
                    this.movement.movingRight = true;
                }
            }
        }, 1000 / 60);

        // Animation basierend auf Zustand
        this.intervals.animation = setInterval(() => {
            if (this.isDead()) {
                this.handleDeathAnimation();
            } else if (this.state.isPlayingAlert) {
                // Alert-Animation läuft gerade
            } else if (this.state.isPlayingAttack) {
                // Attack-Animation läuft gerade
            } else if (!this.state.hasPlayedAlert && this.canSeeCharacter()) {
                this.handleAlertAnimation();
            } else if (!this.canSeeCharacter() && (this.state.hasPlayedAlert || this.state.hasPlayedAttack)) {
                // Character außer Sichtweite - Reset
                this.state.hasPlayedAlert = false;
                this.state.hasPlayedAttack = false;
                this.state.isChasing = false;
            } else if (this.isHurt()) {
                this.playAnimation(this.imagesHurt);
            } else if (this.state.isChasing || this.ramming.isActive) {
                this.playAnimation(this.imagesAttackRun);
            } else {
                this.playAnimation(this.imagesWalk);
            }
        }, 150);
    }

    handleDeathAnimation() {
        if (!this.state.hasPlayedDeath) {
            this.stopAllIntervals();
            this.img = this.imageCache[this.imagesDead[0]];
            this.playDeathAnimationOnce();
        }
    }

    stopAllIntervals() {
        if (this.intervals.movement) {
            clearInterval(this.intervals.movement);
            this.intervals.movement = null;
        }
        if (this.intervals.animation) {
            clearInterval(this.intervals.animation);
            this.intervals.animation = null;
        }
        if (this.rotation.intervalId) {
            clearInterval(this.rotation.intervalId);
            this.rotation.intervalId = null;
        }
    }

    playDeathAnimationOnce() {
        this.state.hasPlayedDeath = true;
        let frameIndex = 0;

        this.img = this.imageCache[this.imagesDead[frameIndex]];
        this.rotation.current = 0;
        this.rotation.target = 45;
        this.smoothRotate();

        const deathAnimationInterval = setInterval(() => {
            frameIndex++;
            if (frameIndex < this.imagesDead.length) {
                this.img = this.imageCache[this.imagesDead[frameIndex]];

                if (frameIndex === 1) {
                    this.rotation.current = 0;
                    this.rotation.target = 45;
                    this.smoothRotate();
                } else if (frameIndex === 2) {
                    if (this.rotation.intervalId) {
                        clearInterval(this.rotation.intervalId);
                        this.rotation.intervalId = null;
                    }
                    this.rotation.current = 0;
                    this.rotation.target = 0;
                }
            } else {
                clearInterval(deathAnimationInterval);
            }
        }, 150);
    }

    smoothRotate() {
        if (this.rotation.intervalId) {
            clearInterval(this.rotation.intervalId);
        }

        const duration = 150;
        const fps = 60;
        const totalFrames = (duration / 1000) * fps;
        const rotationStep = (this.rotation.target - this.rotation.current) / totalFrames;

        this.rotation.intervalId = setInterval(() => {
            if (Math.abs(this.rotation.target - this.rotation.current) > Math.abs(rotationStep)) {
                this.rotation.current += rotationStep;
            } else {
                this.rotation.current = this.rotation.target;
                clearInterval(this.rotation.intervalId);
                this.rotation.intervalId = null;
            }
        }, 1000 / fps);
    }

    canSeeCharacter() {
        if (!this.world || !this.world.character) {
            return false;
        }
        // Endboss sieht Character wenn dieser in Sichtweite (z.B. 500px) ist
        const character = this.world.character;
        const distance = Math.abs(this.x - character.x);
        return distance < 300;
    }

    handleAlertAnimation() {
        if (!this.state.hasPlayedAlert) {
            this.playAlertAnimationOnce();
        }
    }

    playAlertAnimationOnce() {
        this.state.hasPlayedAlert = true;
        this.state.isPlayingAlert = true;

        if (this.world && this.world.character) {
            const character = this.world.character;
            this.otherDirection = character.x > this.x;
        }

        let frameIndex = 0;
        this.img = this.imageCache[this.imagesAlert[frameIndex]];

        const alertAnimationInterval = setInterval(() => {
            frameIndex++;
            if (frameIndex < this.imagesAlert.length) {
                this.img = this.imageCache[this.imagesAlert[frameIndex]];
            } else {
                clearInterval(alertAnimationInterval);
                this.state.isPlayingAlert = false;
                this.handleAttackAnimation();
            }
        }, 150);
    }

    handleAttackAnimation() {
        if (!this.state.hasPlayedAttack) {
            this.playAttackAnimationOnce();
        }
    }

    playAttackAnimationOnce() {
        this.state.hasPlayedAttack = true;
        this.state.isPlayingAttack = true;
        let frameIndex = 0;

        this.img = this.imageCache[this.imagesAttack[frameIndex]];

        const attackAnimationInterval = setInterval(() => {
            frameIndex++;
            if (frameIndex < this.imagesAttack.length) {
                this.img = this.imageCache[this.imagesAttack[frameIndex]];
            } else {
                clearInterval(attackAnimationInterval);
                this.state.isPlayingAttack = false;
                this.state.isChasing = true;
            }
        }, 150);
    }

    // Wird von World aufgerufen, wenn der Endboss mit dem Character kollidiert
    onCharacterCollision() {
        if (this.state.isChasing && !this.ramming.isActive) {
            this.ramming.isActive = true;
            this.ramming.distanceTraveled = 0;
        }
    }

}
