class MovableObjects {
    height = 75;
    width = this.height * 0.8;
    groundLevel = 440 - this.height;
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

    playAnimation(arr) {
        let i = this.currentImage % arr.length;
        let path = arr[i];
        this.img = this.imageCache[path];
        this.currentImage++;

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
