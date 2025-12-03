class ChickenSmall extends MovableObjects {
    height = 45;
    width = this.height * 0.8;
    groundLevel = 435 - this.height;
    y = this.groundLevel;
    rectOffsetTop = -5;  // Keine Reduzierung oben! Volle Höhe
    rectOffsetBottom = 0;  // Keine Reduzierung unten! Volle Höhe
    rectOffsetLeft = 0;  // Keine Reduzierung links! Volle Breite
    rectOffsetRight = 0;  // Keine Reduzierung rechts! Volle Breite
    world;
    markedForDeletion = false;
    isDying = false;
    moveInterval;
    animationInterval;
    opacity = 1;
    movingLeft = true; // Startrichtung: nach links
    minX; // Linke Grenze (wird aus Level geladen)
    maxX; // Rechte Grenze (Startposition)

    imagesWalk = [
        '../assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        '../assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        '../assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    imagesDead = [
        '../assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];



    constructor(levelEnd, chickenSpeed) {
        super();
        this.loadImage('../assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.x = 200 + Math.random() * (levelEnd + 1000);
        this.speed = 0.25 + Math.random() * chickenSpeed;
        this.loadImages(this.imagesWalk);
        this.loadImages(this.imagesDead);
        this.animate();
    }

    animate() {
        this.moveInterval = setInterval(() => {
            if (!this.isDead()) {
                // Lade Level-Grenzen dynamisch, wenn world verfügbar ist
                if (this.world && this.minX === undefined) {
                    this.minX = this.world.level.levelStartX;
                }

                if (this.movingLeft) {
                    this.x -= this.speed; // Nach links bewegen
                    this.otherDirection = false; // Nach links = nicht gespiegelt
                    // Richtungswechsel wenn linke Grenze erreicht
                    if (this.minX !== undefined && this.x <= this.minX) {
                        this.movingLeft = false;
                    }
                } else {
                    if (this.world && this.maxX === undefined) {
                        this.maxX = this.world.level.levelEndX - this.width;
                    }

                    this.x += this.speed; // Nach rechts bewegen
                    this.otherDirection = true; // Nach rechts = gespiegelt
                    // Richtungswechsel wenn rechte Grenze erreicht
                    if (this.x >= this.maxX) {
                        this.movingLeft = true;
                    }
                }
            }
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if (this.isDead()) {
                this.playDeadAnimation();
            } else {
                this.playAnimation(this.imagesWalk);
            }
        }, 150);
    }

    playDeadAnimation() {
        if (!this.isDying) {
            this.isDying = true;
            // Lade das Dead-Bild direkt aus dem Cache
            this.img = this.imageCache[this.imagesDead[0]];
            // Stoppe alle Intervals
            clearInterval(this.moveInterval);
            clearInterval(this.animationInterval);

            // Spiele Small-Chicken-Dead-Sound ab
            if (this.world && this.world.soundManager) {
                this.world.soundManager.play('chickenSmallDead');
            }

            // Fade-Out-Effekt über 2 Sekunden
            let fadeInterval = setInterval(() => {
                this.opacity -= 0.02; // Reduziere Opacity
                if (this.opacity <= 0) {
                    this.opacity = 0;
                    clearInterval(fadeInterval);
                    this.markedForDeletion = true; // Erst NACH Fade-Out markieren
                    this.removeFromWorld();
                }
            }, 40); // Alle 40ms (ergibt ca. 2 Sekunden für komplettes Fade-Out)
        }
    }

    removeFromWorld() {
        if (this.world) {
            const index = this.world.level.enemies.indexOf(this);
            if (index > -1) {
                this.world.level.enemies.splice(index, 1);
            }
        }
    }
}