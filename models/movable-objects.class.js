class MovableObjects extends DrawableObject {

    // speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 0.3;
    energy = 10;
    lastHit = 0;
    rectOffsetLeft = 0;
    rectOffsetTop = 0;
    rectOffsetRight = 0;
    rectOffsetBottom = 0;


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
        return (this.x + this.rectOffsetLeft + this.width - this.rectOffsetRight) > (mo.x + mo.rectOffsetLeft) &&
            (this.y + this.rectOffsetTop + this.height - this.rectOffsetBottom) > (mo.y + mo.rectOffsetTop) &&
            (this.x + this.rectOffsetLeft) < (mo.x + mo.rectOffsetLeft + mo.width - mo.rectOffsetRight) &&
            (this.y + this.rectOffsetTop) < (mo.y + mo.rectOffsetTop + mo.height - mo.rectOffsetBottom);
    }

    hit() {
        this.energy -= 10;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
            // Spiele Hurt-Sound ab (nur für Character!)
            if (this.world && this.world.soundManager && this instanceof Character) {
                this.world.soundManager.play('characterHurt');
            }
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
        let i = this.currentImage % arr.length;
        let path = arr[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;
    }

    moveLeft(directionState) {
        this.x -= this.speed;
        this.otherDirection = directionState;
    }

    jump(speed) {
        this.speedY = speed;
        this.world.soundManager.play('characterJump');

    }
}
