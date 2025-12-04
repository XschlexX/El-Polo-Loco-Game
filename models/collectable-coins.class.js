class CollectableCoin extends CollectableObject {
    height = 120;
    width = this.height * 1;
    groundLevel = 430 - this.height;
    y = this.groundLevel;

    // Kollisions-Offsets
    hitBoxLeft = this.width * 0.35;
    hitBoxTop = this.height * 0.35;
    hitBoxRight = this.width * 0.35 + this.hitBoxLeft;
    hitBoxBottom = this.height * 0.35 + this.hitBoxTop;

    // Animations-Bilder
    images = [
        '../assets/img/8_coin/coin_1.png',
        '../assets/img/8_coin/coin_2.png'
    ];

    constructor(x) {
        super();
        this.x = x;
        this.y = this.groundLevel - Math.random() * 160;

        // Lade Bilder
        this.loadImage(this.images[0]);
        this.loadImages(this.images);

        // Starte Animation
        this.animate(300, 1000);
    }
}
