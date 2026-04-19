class MovableObjects extends DrawableObject {

    // speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 0.3;
    energy = 10;
    lastHit = 0;
    hitBoxLeft = 0;
    hitBoxTop = 0;
    hitBoxRight = 0;
    hitBoxBottom = 0;


    applyGravity(groundLevel) {
        const gravityCallback = () => {
            if (this.isAboveGround(groundLevel)) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.y = groundLevel;
                this.speedY = 0; // Wichtig: Geschwindigkeit zurücksetzen, wenn wir auf dem Boden sind
            }
        };
        const intervalId = setInterval(gravityCallback, 1000 / 60);
        GlobalIntervalManager.register(intervalId, 'applyGravity', this, 1000 / 60, gravityCallback);
    }

    isAboveGround(groundLevel) {
        return (this.y - this.speedY) < groundLevel;
    }

    isColliding(mo) {
        return (this.x + this.hitBoxLeft + this.width - this.hitBoxRight) > (mo.x + mo.hitBoxLeft) &&
            (this.y + this.hitBoxTop + this.height - this.hitBoxBottom) > (mo.y + mo.hitBoxTop) &&
            (this.x + this.hitBoxLeft) < (mo.x + mo.hitBoxLeft + mo.width - mo.hitBoxRight) &&
            (this.y + this.hitBoxTop) < (mo.y + mo.hitBoxTop + mo.height - mo.hitBoxBottom);
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

    moveRight(directionState = false, speed = this.speed, boundary = levelEnd) {
        if (this.x + this.width < boundary) {
            this.x += speed;
        }
        this.otherDirection = directionState;
    }

    moveLeft(directionState = false, speed = this.speed, boundary = levelStart) {
        if (this.x > boundary) {
            this.x -= speed;
        }
        this.otherDirection = directionState;
    }

    jump(speed = 8) {
        this.speedY = speed;
        this.world.soundManager.play('characterJump');

    }
}
