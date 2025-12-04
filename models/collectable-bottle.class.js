class CollectableBottle extends CollectableObject {
    height = 60;
    width = this.height * 0.6;
    groundLevel = 430 - this.height;
    y = this.groundLevel;

    // Kollisions-Offsets
    hitBoxLeft = 10;
    hitBoxTop = 10;
    hitBoxRight = 10 + this.hitBoxLeft;
    hitBoxBottom = 10 + this.hitBoxTop;

    // Animations-Bilder
    images = [
        '../assets/img/6_salsa_bottle/1-1_salsa_bottle_on_ground.png',
        '../assets/img/6_salsa_bottle/2-1_salsa_bottle_on_ground.png'
    ];

    constructor(x) {
        super();
        // X-Position als Parameter übergeben oder random falls nicht angegeben
        this.x = x;
        this.y = this.y + Math.random() * 40;

        // Zufällige Reihenfolge der Bilder (50% Chance für umgekehrte Reihenfolge)
        if (Math.random() > 0.5) {
            this.images = [...this.images].reverse();
        }

        // Lade Bilder
        this.loadImage(this.images[0]);
        this.loadImages(this.images);

        // Starte Animation
        this.animate(500, 1000);
    }
}
