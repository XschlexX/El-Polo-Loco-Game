class MovableObjects extends DrawableObject {

    // speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 0.3;
    energy = 100;
    lastHit = 0;
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

    isColliding(mo) {
        return (this.x + this.rectOffset.left + this.width - this.rectOffset.right) > (mo.x + mo.rectOffset.left) &&
            (this.y + this.rectOffset.top + this.height - this.rectOffset.bottom) > (mo.y + mo.rectOffset.top) &&
            (this.x + this.rectOffset.left) < (mo.x + mo.rectOffset.left + mo.width - mo.rectOffset.right) &&
            (this.y + this.rectOffset.top) < (mo.y + mo.rectOffset.top + mo.height - mo.rectOffset.bottom);
    }

    hit() {
        this.energy -= 10;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timeSinceLastHit = new Date().getTime() - this.lastHit;
        timeSinceLastHit = timeSinceLastHit / 1000;
        return timeSinceLastHit < 1;
    }

    isDead() {
        return this.energy == 0;
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
