class Character extends MovableObjects {
    height = 250;
    width = this.height * 0.5;

    constructor() {
        super();
        this.groundLevel = 430 - this.height; // Neuberechnung von groundLevel  
        this.loadImage('../assets/img/2_character_pepe/1_idle/idle/I-1.png');
        this.y = this.groundLevel; // y-Position basierend auf neuem groundLevel 

    }


    jump() {
        console.log('Jumping');
    }

}

