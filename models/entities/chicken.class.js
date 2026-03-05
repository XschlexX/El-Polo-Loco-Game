class Chicken extends MovableObjects {
    height = 75;
    width = this.height * 0.8;
    groundLevel = 435 - this.height;
    y = this.groundLevel;
    hitBoxLeft = 0;
    hitBoxTop = 1;
    hitBoxRight = 0;
    hitBoxBottom = 5 + this.hitBoxTop;
    world;
    markedForDeletion = false;
    isDying = false;
    opacity = 1;
    movingLeft = true; // Startrichtung: nach links
    minX; // Linke Grenze (wird aus Level geladen)
    maxX; // Rechte Grenze (Startposition)

    imagesWalk = [
        '../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        '../assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        '../assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    imagesDead = [
        '../assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];



    constructor(levelEnd, chickenSpeed) {
        super();
        this.loadImage('../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
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
        GlobalIntervalManager.register(moveInterval, 'Chicken movement', this, 1000 / 60, moveCallback);

        const animationCallback = () => {
            if (this.isDead()) {
                this.playDeadAnimation();
            } else {
                this.playAnimation(this.imagesWalk);
            }
        };
        const animationInterval = setInterval(animationCallback, 150);
        GlobalIntervalManager.register(animationInterval, 'Chicken animation', this, 150, animationCallback);
    }

    playDeadAnimation() {
        if (!this.isDying) {
            this.isDying = true;
            // Lade das Dead-Bild direkt aus dem Cache
            this.img = this.imageCache[this.imagesDead[0]];
            // Stoppe alle Intervals dieses Objekts
            GlobalIntervalManager.clearByOwner(this);

            // Spiele Chicken-Dead-Sound ab
            if (this.world && this.world.soundManager) {
                this.world.soundManager.play('chickenDead');
            }

            // Fade-Out-Effekt über 2 Sekunden
            const fadeCallback = () => {
                this.opacity -= 0.02; // Reduziere Opacity
                if (this.opacity <= 0) {
                    this.opacity = 0;
                    GlobalIntervalManager.clear(fadeInterval, 'Chicken fade');
                    this.markedForDeletion = true; // Erst NACH Fade-Out markieren
                    this.removeFromWorld();
                }
            };
            let fadeInterval = setInterval(fadeCallback, 40); // Alle 40ms (ergibt ca. 2 Sekunden für komplettes Fade-Out)
            GlobalIntervalManager.register(fadeInterval, 'Chicken fade-out', this, 40, fadeCallback);
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