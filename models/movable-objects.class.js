class MovableObjects {
    img;
    imageCache = {};
    currentImage = 0;
    // speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 0.3;
    drawRect = true;
    xOffset = 0;
    yOffset = 0;
    widthOffset = 0;
    heightOffset = 0;

    applyGravity(groundLevel) {
        setInterval(() => {
            if (this.isAboveGround(groundLevel)) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.y = groundLevel;
            }
        }, 1000 / 60);
    }

    isAboveGround(groundLevel) {
        return (this.y - this.speedY) < groundLevel;
    }

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    playAnimation(arr) {
        // setInterval(() => {
        let i = this.currentImage % arr.length;
        let path = arr[i];
        this.img = this.imageCache[path];
        this.currentImage++;
        // }, 150);
    }

    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;
    }

    moveLeft(directionState) {
        this.x -= this.speed;
        this.otherDirection = directionState;
    }

    jump() {
        this.speedY = 8;
    }
}
