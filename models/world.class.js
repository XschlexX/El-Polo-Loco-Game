class World {

    character = new Character(keyboard);
    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken()
    ];
    clouds = [
        new Cloud()
    ];
    backgroundObjects = [
        new BackgroundObject('../assets/img/5_background/layers/air.png'),
        new BackgroundObject('../assets/img/5_background/layers/3_third_layer/1.png'),
        new BackgroundObject('../assets/img/5_background/layers/2_second_layer/1.png'),
        new BackgroundObject('../assets/img/5_background/layers/1_first_layer/1.png'),
    ];
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

        this.addObjectsToMap(this.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.clouds);

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
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            mo.x = -mo.x;
            // this.ctx.drawImage(mo.img, 0, 0, mo.width, mo.height);
        }
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        if (mo.otherDirection) {
            this.ctx.restore();
            mo.x = -mo.x;
        }
    }
}
