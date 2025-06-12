class MovableObjects {
    height = 75;
    width = 60;
    groundLevel = 425 - this.height;
    x = 50;
    y = this.groundLevel;
    img;
    imageCache = {};
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;



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

    moveRight() {
        console.log('Moving right');
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
}
