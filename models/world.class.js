class World {

    // character = new Character(keyboard);
    character = new Character(keyboard);
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    throwableObjects = [];
    lastThrow;


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.lastThrow = new Date().getTime();
        window.world = this;

        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.throwableObjects.forEach(object => {
            object.world = this;
        });
        // this.level.character = this.character;
        // this.statusBar.setPercentage(this.character.energy);
    }



    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowableObject();
        }, 200);
    }

    checkCollisions() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy) && !this.character.isHurt()) {
                this.character.hit();
                console.log('Energy: ', this.character.energy);
            }
        });
    }

    checkThrowableObject() {
        if (this.keyboard.SPACE && this.throwInterval()) {
            let bottle = new ThrowableObject(this.character);
            this.throwableObjects.push(bottle);
            this.lastThrow = new Date().getTime();
        }
    }

    throwInterval() {
        let timeSinceLastThrow = new Date().getTime() - this.lastThrow;
        timeSinceLastThrow = timeSinceLastThrow / 1000;
        return timeSinceLastThrow > 1;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);

        this.ctx.translate(-this.camera_x, 0);
        this.addObjectsToMap(this.level.statusBars);
        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(() => self.draw());
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        mo.drawCollisionFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = -mo.x;
    }

    flipImageBack(mo) {
        this.ctx.restore();
        mo.x = -mo.x;
    }

}
