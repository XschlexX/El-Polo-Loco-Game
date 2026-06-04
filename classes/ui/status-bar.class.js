/**
 * HUD status bar that displays health, bottle, coin, or endboss health indicators.
 * Supports three render types per bar: background (0), fill (1), and icon (2).
 * Automatically updates fill width based on the associated character or endboss state.
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
    imagesHealthBar = [
        'assets/img/7_statusbars/4_bar_elements/statusbar_empty_modified.png',
        'assets/img/7_statusbars/4_bar_elements/statusbar_blue_modified.png',
        'assets/img/7_statusbars/3_icons/icon_health.png'
    ];

    imagesBottleBar = [
        'assets/img/7_statusbars/4_bar_elements/statusbar_empty_modified.png',
        'assets/img/7_statusbars/4_bar_elements/statusbar_blue_modified.png',
        'assets/img/7_statusbars/3_icons/icon_salsa_bottle.png'
    ];

    imagesCoinBar = [
        'assets/img/7_statusbars/4_bar_elements/statusbar_empty_modified.png',
        'assets/img/7_statusbars/4_bar_elements/statusbar_blue_modified.png',
        'assets/img/7_statusbars/3_icons/icon_coin.png'
    ];

    imagesHealthBarEndboss = [
        'assets/img/7_statusbars/4_bar_elements/statusbar_empty_endboss.png',
        'assets/img/7_statusbars/4_bar_elements/statusbar_blue_endboss.png',
        'assets/img/7_statusbars/3_icons/icon_health_endboss.png'
    ];

    x = 30;
    y = 20;
    width = 200;
    maxWidth = 200;
    height = 20;
    gap = 35;
    statusbar;
    type;
    character;
    multiplier;


    /**
     * @param {string} statusbar - The image set key (e.g. 'imagesHealthBar', 'imagesBottleBar')
     * @param {number} type - The render type: 0 = background, 1 = fill, 2 = icon
     */
    constructor(statusbar, type) {
        super();
        this.statusbar = statusbar;
        this.type = type;
        this.setPosition();
        this.loadImage(this[statusbar][type]);

        if (statusbar === 'imagesBottleBar' && type === 1 || statusbar === 'imagesCoinBar' && type === 1) {
            this.width = 0;
        }

        if (statusbar === 'imagesHealthBar' || statusbar === 'imagesBottleBar' || statusbar === 'imagesCoinBar') {
            this.setCharacter();
        } else if (statusbar === 'imagesHealthBarEndboss') {
            this.setEndboss();
        }
    }

    /**
     * Binds the bar to the player character and starts periodic width updates.
     */
    setCharacter() {
        const timeoutId = setTimeout(() => {
            if (world) {
                this.character = world.character;
                if (this.statusbar === 'imagesBottleBar') {
                    this.multiplier = this.maxWidth / 10;
                } else if (this.statusbar === 'imagesCoinBar') {
                    this.multiplier = this.maxWidth / 10;
                } else {
                    this.multiplier = this.maxWidth / this.character.energy;
                }
                this.setWidth();
            } else {
                console.error('Character nicht gefunden');
            }
        }, 500);
        GlobalIntervalManager.registerTimeout(timeoutId, 'StatusBar setCharacter', this, 500, null);
    }

    /**
     * Binds the bar to the endboss and starts periodic width updates.
     */
    setEndboss() {
        const timeoutId = setTimeout(() => {
            if (world) {
                this.endboss = world.level.enemies.find(enemy => enemy instanceof Endboss);
                if (this.endboss) {
                    this.endbossMultiplier = this.width / this.endboss.energy;
                    this.initialWidth = this.width;
                    this.initialX = this.x;
                    this.setEndbossWidth();
                } else {
                    console.error('Endboss nicht gefunden');
                }
            }
        }, 500);
        GlobalIntervalManager.registerTimeout(timeoutId, 'StatusBar setEndboss', this, 500, null);
    }

    /**
     * Starts a periodic interval that updates the fill width based on character stats.
     */
    setWidth() {
        const intervalCallback = () => {
            if (this.statusbar === 'imagesHealthBar' && this.type === 1) {
                this.width = this.character.energy * this.multiplier;
            } else if (this.statusbar === 'imagesBottleBar' && this.type === 1) {
                this.width = this.character.bottles * this.multiplier;
            } else if (this.statusbar === 'imagesCoinBar' && this.type === 1) {
                this.width = this.character.coins * this.multiplier;
            }
        };
        const intervalId = setInterval(intervalCallback, 100);
        GlobalIntervalManager.register(intervalId, 'StatusBar width update', this, 100, intervalCallback);
    }

    /**
     * Starts a periodic interval that updates the endboss health bar width and position.
     */
    setEndbossWidth() {
        const intervalCallback = () => {
            if (this.statusbar === 'imagesHealthBarEndboss' && this.type === 1 && this.endboss) {
                let newWidth = this.endboss.energy * this.endbossMultiplier;
                let widthDifference = this.initialWidth - newWidth;

                this.x = this.initialX + widthDifference;
                this.width = newWidth;
            }
        };
        const intervalId = setInterval(intervalCallback, 100);
        GlobalIntervalManager.register(intervalId, 'StatusBar endboss width update', this, 100, intervalCallback);
    }

    /**
     * Adjusts position and dimensions based on the statusbar type and render variant.
     */
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
