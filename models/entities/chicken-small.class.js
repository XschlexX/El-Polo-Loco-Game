class ChickenSmall extends MovableObjects {
    height = 45;
    width = this.height * 0.8;
    groundLevel = 435 - this.height;
    y = this.groundLevel;
    hitBoxLeft = 0;     // Keine Reduzierung links! Volle Breite
    hitBoxTop = -5;     // Keine Reduzierung oben! Volle Höhe
    hitBoxRight = 0;    // Keine Reduzierung rechts! Volle Breite
    hitBoxBottom = 0;   // Keine Reduzierung unten! Volle Höhe
    world;
    markedForDeletion = false;
    isDying = false;
    opacity = 1;
    movingLeft = true; // Startrichtung: nach links

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
        this.x = 200 + Math.random() * (levelEnd);
        this.speed = 0.25 + Math.random() * chickenSpeed;
        this.loadImages(this.imagesWalk);
        this.loadImages(this.imagesDead);
        this.animate();
    }

    animate() {
        const moveCallback = () => {
            if (!this.isDead()) {
                if (this.movingLeft) {
                    this.moveLeft();
                    if (this.x <= levelStart) {
                        this.movingLeft = false;
                    }
                } else {
                    this.moveRight(true);
                    if (this.x + this.width >= levelEnd) {
                        this.movingLeft = true;
                    }
                }
            }
        };
        const moveInterval = setInterval(moveCallback, 1000 / 60);
        GlobalIntervalManager.register(moveInterval, 'ChickenSmall movement', this, 1000 / 60, moveCallback);

        const animationCallback = () => {
            if (this.isDead()) {
                this.playDeadAnimation();
            } else {
                this.playAnimation(this.imagesWalk);
            }
        };
        const animationInterval = setInterval(animationCallback, 150);
        GlobalIntervalManager.register(animationInterval, 'ChickenSmall animation', this, 150, animationCallback);
    }

    playDeadAnimation() {
        if (!this.isDying) {
            this.isDying = true;
            // Lade das Dead-Bild direkt aus dem Cache
            this.img = this.imageCache[this.imagesDead[0]];
            // Stoppe alle Intervals dieses Objekts
            GlobalIntervalManager.clearByOwner(this);

            // Spiele Small-Chicken-Dead-Sound ab
            if (this.world && this.world.soundManager) {
                this.world.soundManager.play('chickenSmallDead');
            }

            // Fade-Out-Effekt über 2 Sekunden
            const fadeCallback = () => {
                this.opacity -= 0.02; // Reduziere Opacity
                if (this.opacity <= 0) {
                    this.opacity = 0;
                    GlobalIntervalManager.clear(fadeInterval, 'ChickenSmall fade');
                    this.markedForDeletion = true; // Erst NACH Fade-Out markieren
                    this.removeFromWorld();
                }
            };
            let fadeInterval = setInterval(fadeCallback, 40); // Alle 40ms (ergibt ca. 2 Sekunden für komplettes Fade-Out)
            GlobalIntervalManager.register(fadeInterval, 'ChickenSmall fade-out', this, 40, fadeCallback);
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