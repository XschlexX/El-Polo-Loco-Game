class Character extends MovableObjects {
    height = 280;
    width = this.height * 0.5;
    speed = 5;
    imagesIdle = [
        '../assets/img/2_character_pepe/1_idle/idle/I-1.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-2.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-3.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-4.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-5.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-6.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-7.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-8.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-9.png',
        '../assets/img/2_character_pepe/1_idle/idle/I-10.png'
    ];
    imagesWalk = [
        '../assets/img/2_character_pepe/2_walk/W-21.png',
        '../assets/img/2_character_pepe/2_walk/W-22.png',
        '../assets/img/2_character_pepe/2_walk/W-23.png',
        '../assets/img/2_character_pepe/2_walk/W-24.png',
        '../assets/img/2_character_pepe/2_walk/W-25.png',
        '../assets/img/2_character_pepe/2_walk/W-26.png'
    ];
    imagesJump = [

    ];
    world;


    constructor() {
        super();
        this.groundLevel = 430 - this.height; // Neuberechnung von groundLevel  
        this.y = this.groundLevel; // y-Position basierend auf neuem groundLevel
        this.loadImage('../assets/img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.imagesWalk);
        // this.animateIdle();
        this.animate();
    }

    // animateIdle() {
    //     setInterval(() => {
    //         let i = this.currentImage % this.imagesIdle.length;
    //         let path = this.imagesIdle[i];
    //         this.img = this.imageCache[path];
    //         this.currentImage++;
    //     }, 150);
    // }

    animate() {
        setInterval(() => {
            if (this.world.keyboard.RIGHT) {
                this.x += this.speed;
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT && this.x > -1340) {
                this.x -= this.speed;
                this.otherDirection = true;
            }
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);
        setInterval(() => {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                let i = this.currentImage % this.imagesWalk.length;
                let path = this.imagesWalk[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 150);
    }

    jump() {
        console.log('Jumping');
    }

}

