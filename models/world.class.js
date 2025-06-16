class World {

    level = level1;
    character = new Character(keyboard);
    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
    }

    setWorld() {
        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);

        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(() => self.draw());
    }

    addObjectsToMap(objects, drawRect) {
        objects.forEach(o => {
            this.addToMap(o, drawRect);
        });
    }

    addToMap(mo, drawRect) {
        if (mo.otherDirection) {
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            mo.x = -mo.x;
            // this.ctx.drawImage(mo.img, 0, 0, mo.width, mo.height);
        }
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        if (mo.drawRect) {
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = 'red';
            this.ctx.strokeRect(mo.x + mo.xOffset, mo.y + mo.yOffset, mo.width - mo.widthOffset, mo.height - mo.heightOffset);
        }
        if (mo.otherDirection) {
            this.ctx.restore();
            mo.x = -mo.x;
        }
    }
}
