class StatusBar extends DrawableObject {
    // imagesHealth = [
    //     '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
    //     '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
    //     '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
    //     '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
    //     '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
    //     '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    // ];

    // imagesBottle = [
    //     '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
    //     '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
    //     '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
    //     '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
    //     '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
    //     '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    // ];

    // imagesCoin = [
    //     '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
    //     '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
    //     '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
    //     '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
    //     '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
    //     '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    // ];

    imagesHealthBar = [
        '../assets/img/7_statusbars/4_bar_elements/statusbar_empty_modified.png',
        '../assets/img/7_statusbars/4_bar_elements/statusbar_blue_modified.png',
        '../assets/img/7_statusbars/3_icons/icon_health.png'
    ];

    imagesBottleBar = [
        '../assets/img/7_statusbars/4_bar_elements/statusbar_empty_modified.png',
        '../assets/img/7_statusbars/4_bar_elements/statusbar_blue_modified.png',
        '../assets/img/7_statusbars/3_icons/icon_salsa_bottle.png'
    ];

    imagesCoinBar = [
        '../assets/img/7_statusbars/4_bar_elements/statusbar_empty_modified.png',
        '../assets/img/7_statusbars/4_bar_elements/statusbar_blue_modified.png',
        '../assets/img/7_statusbars/3_icons/icon_coin.png'
    ];

    imagesHealthBarEndboss = [
        '../assets/img/7_statusbars/4_bar_elements/statusbar_empty_endboss.png',
        '../assets/img/7_statusbars/4_bar_elements/statusbar_blue_endboss.png',
        '../assets/img/7_statusbars/3_icons/icon_health_endboss.png'
    ];

    x = 30;
    y = 20;
    width = 200;
    height = 20;
    gap = 35;
    statusbar;
    type;
    character;
    multiplier;


    constructor(statusbar, type) {
        super();
        this.statusbar = statusbar;
        this.type = type;
        this.setPosition();
        this.loadImage(this[statusbar][type]);

        // Setze initiale Breite für Bottle-Bar sofort auf 0, damit sie nicht voll angezeigt wird
        if (statusbar === 'imagesBottleBar' && type === 1) {
            this.width = 0;
        }

        // Initialisierung je nach Statusbar-Typ
        if (statusbar === 'imagesHealthBar' || statusbar === 'imagesBottleBar' || statusbar === 'imagesCoinBar') {
            this.setCharacter();
        } else if (statusbar === 'imagesHealthBarEndboss') {
            this.setEndboss();
        }
    }

    setCharacter() {
        setTimeout(() => {
            if (world) {
                this.character = world.character;
                if (this.statusbar === 'imagesBottleBar') {
                    // Multiplier basiert auf Maximum (10 Bottles) und maximaler Breite (200px)
                    this.multiplier = 200 / 10;
                } else {
                    this.multiplier = this.width / this.character.energy;
                }
                this.setWidth();
            } else {
                console.error('Character nicht gefunden');
            }
        }, 500);
    }

    setEndboss() {
        setTimeout(() => {
            if (world) {
                this.endboss = world.level.enemies.find(enemy => enemy instanceof Endboss);
                if (this.endboss) {
                    this.endbossMultiplier = this.width / this.endboss.energy;
                    this.initialWidth = this.width; // Speichere die Anfangsbreite
                    this.initialX = this.x; // Speichere die Anfangs-X-Position
                    this.setEndbossWidth();
                } else {
                    console.error('Endboss nicht gefunden');
                }
            }
        }, 500);
    }

    setWidth() {
        setInterval(() => {
            if (this.statusbar === 'imagesHealthBar' && this.type === 1) {
                this.width = this.character.energy * this.multiplier;
            } else if (this.statusbar === 'imagesBottleBar' && this.type === 1) {
                this.width = this.character.bottles * this.multiplier;
            }
        }, 100);
    }

    setEndbossWidth() {
        setInterval(() => {
            if (this.statusbar === 'imagesHealthBarEndboss' && this.type === 1 && this.endboss) {
                let newWidth = this.endboss.energy * this.endbossMultiplier;
                let widthDifference = this.initialWidth - newWidth;

                // Passe X-Position an, damit die Bar von links nach rechts kleiner wird
                this.x = this.initialX + widthDifference;
                this.width = newWidth;
            }
        }, 100);
    }

    setPosition() {
        if (this.statusbar === 'imagesHealthBar' && this.type === 2) {
            this.x = this.x - 15;
            this.y = this.y - 4;
            this.height = this.height * 1.35;
            this.width = this.height * 1.1;
        } else if (this.statusbar === 'imagesBottleBar' && this.type === 0) {
            this.y = this.y + this.gap;
        } else if (this.statusbar === 'imagesBottleBar' && this.type === 1) {
            this.y = this.y + this.gap;
        } else if (this.statusbar === 'imagesBottleBar' && this.type === 2) {
            this.x = this.x - 8;
            this.y = this.y - 10 + this.gap;
            this.height = this.height * 1.7;
            this.width = this.height * 0.45;
        } else if (this.statusbar === 'imagesCoinBar' && this.type === 0) {
            this.y = this.y + this.gap * 2;
        } else if (this.statusbar === 'imagesCoinBar' && this.type === 1) {
            this.y = this.y + this.gap * 2;
        } else if (this.statusbar === 'imagesCoinBar' && this.type === 2) {
            this.x = this.x - 15;
            this.y = this.y - 8 + this.gap * 2;
            this.height = this.height * 1.55;
            this.width = this.height;
        } else if (this.statusbar === 'imagesHealthBarEndboss' && this.type === 0) {
            this.x = 720 - this.width - this.x;
            this.y = this.y;

        } else if (this.statusbar === 'imagesHealthBarEndboss' && this.type === 1) {
            this.x = 720 - this.width - this.x;
            this.y = this.y;

        } else if (this.statusbar === 'imagesHealthBarEndboss' && this.type === 2) {
            this.y = this.y - 15;
            this.height = this.height * 2.5;
            this.width = this.height * 1.1;
            this.x = 720 - this.width - 6;
        }
    }
}
