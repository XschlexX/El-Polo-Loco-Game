class Chicken extends MovableObjects {
    height = 75;
    width = this.height * 0.8;
    groundLevel = 440 - this.height;
    y = this.groundLevel;
    rectOffsetTop = 1;
    rectOffsetBottom = 5 + this.rectOffsetTop;
    energy = 20;
    world;
    markedForDeletion = false;
    isDying = false;
    moveInterval;
    animationInterval;
    opacity = 1;

    imagesWalk = [
        '../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        '../assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        '../assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    imagesDead = [
        '../assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];



    constructor() {
        super();
        this.loadImage('../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 200 + Math.random() * 500;
        this.speed = 0.25 + Math.random() * .5;
        this.loadImages(this.imagesWalk);
        this.loadImages(this.imagesDead);
        this.animate();
    }

    animate() {
        this.moveInterval = setInterval(() => {
            if (!this.isDead()) {
                this.moveLeft(false);
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

            console.log('Chicken is dead - showing dead image, starting fade-out');

            // Fade-Out-Effekt über 2 Sekunden
            let fadeInterval = setInterval(() => {
                this.opacity -= 0.02; // Reduziere Opacity
                if (this.opacity <= 0) {
                    this.opacity = 0;
                    clearInterval(fadeInterval);
                    this.markedForDeletion = true; // Erst NACH Fade-Out markieren
                    console.log('Fade-out complete, removing chicken from world');
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