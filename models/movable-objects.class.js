class MovableObjects {
    height = 75;
    width = 60;
    groundLevel = 425 - this.height;
    x = 50;
    y = this.groundLevel;
    img;


    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    moveRight() {
        console.log('Moving right');
    }

    moveLeft() {
        console.log('Moving left');
    }
}
