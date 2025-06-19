class MovableObjects {
    img;
    imageCache = {};
    currentImage = 0;
    // speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 0.3;
    rectOffset = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    };


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

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'blue';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    drawCollisionFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x + this.rectOffset.left, this.y + this.rectOffset.top, this.width - this.rectOffset.right, this.height - this.rectOffset.bottom);
        }
    }


    isColliding(mo) {
        return (this.x + this.rectOffset.left + this.width - this.rectOffset.right) > (mo.x + mo.rectOffset.left) &&
            (this.y + this.rectOffset.top + this.height - this.rectOffset.bottom) > (mo.y + mo.rectOffset.top) &&
            (this.x + this.rectOffset.left) < (mo.x + mo.rectOffset.left + mo.width - mo.rectOffset.right) &&
            (this.y + this.rectOffset.top) < (mo.y + mo.rectOffset.top + mo.height - mo.rectOffset.bottom);
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
