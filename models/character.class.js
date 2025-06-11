class Character extends MovableObjects {
    height = 250;
    width = this.height * 0.5;
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


    constructor() {
        super();
        this.groundLevel = 430 - this.height; // Neuberechnung von groundLevel  
        this.loadImage('../assets/img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.imagesIdle);
        this.y = this.groundLevel; // y-Position basierend auf neuem groundLevel

        this.animateIdle();

    }


    animateIdle() {
        setInterval(() => {
            let i = this.currentImage % this.imagesIdle.length;
            let path = this.imagesIdle[i];
            this.img = this.imageCache[path];
            this.currentImage++;

        }, 150);
    }

    jump() {
        console.log('Jumping');
    }

}

