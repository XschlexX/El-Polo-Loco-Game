class StatusBar extends DrawableObject {
    // imagesHealth = [
    //     '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
    //     '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
    //     '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
    //     '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
    //     '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
    //     '../assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    // ];

    imagesHealth = [
        '../assets/img/7_statusbars/4_bar_elements/statusbar_empty_modified.png',
        '../assets/img/7_statusbars/4_bar_elements/statusbar_blue_modified.png'
    ];

    imagesBottle = [
        '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        '../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    imagesCoin = [
        '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        '../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];

    energy;

    percentage = 100;

    constructor() {
        super();
        this.loadImage(this.imagesHealth[0]);
        // this.loadImages(this.imagesHealth);
        this.x = 10;
        this.y = 10;
        this.width = 200;
        this.height = 30;
        // this.setPercentage(100);
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.imagesHealth[this.resolveImageIndex()];
        console.log('path: ', path);
        this.img = this.imageCache[path];
        console.log('this.percentage: ', this.percentage);
    }

    resolveImageIndex() {
        return Math.floor(this.percentage / 20);
    }
}
