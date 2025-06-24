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

    x = 50;
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
        this.setCharacter();
        this.statusbar = statusbar;
        this.type = type;
        this.setPosition();
        this.loadImage(this[statusbar][type]);
    }

    setCharacter() {
        setTimeout(() => {
            if (world) {
                this.character = world.character;
                console.log('Character in StatusBar:', this.character.energy);
                this.multiplier = this.width / this.character.energy;
                this.setWidth();
            } else {
                console.error('Character nicht gefunden');
            }
        }, 500);
    }

    setWidth() {
        setInterval(() => {
            if (this.statusbar === 'imagesHealthBar' && this.type === 1) {
                this.width = this.character.energy * this.multiplier;
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
        }
    }
}
