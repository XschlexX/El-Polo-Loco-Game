class CollectableCoin extends CollectableObject {
    height = 120;
    width = this.height * 1;
    groundLevel = 430 - this.height;
    y = this.groundLevel;

    // Kollisions-Offsets
    rectOffsetTop = this.height * 0.35;
    rectOffsetBottom = this.height * 0.35 + this.rectOffsetTop;
    rectOffsetLeft = this.width * 0.35;
    rectOffsetRight = this.width * 0.35 + this.rectOffsetLeft;

    // Animations-Bilder
    images = [
        '../assets/img/8_coin/coin_1.png',
        '../assets/img/8_coin/coin_2.png'
    ];

    constructor(x) {
        super();
        // X-Position als Parameter übergeben oder random falls nicht angegeben
        this.x = x;
        this.y = this.y + Math.random() * 40;

        // Lade Bilder
        this.loadImage(this.images[0]);
        this.loadImages(this.images);

        // Starte Animation
        this.animate(200);
    }
}
