/**
 * HUD status bar that displays health, bottle, coin, or endboss health indicators.
 * Supports three render types per bar: background (0), fill (1), and icon (2).
 * Automatically updates fill width based on the associated character or endboss state.
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
    imagesHealthBar = imagePaths.statusbar.imagesHealthBar;
    imagesBottleBar = imagePaths.statusbar.imagesBottleBar;
    imagesCoinBar = imagePaths.statusbar.imagesCoinBar;
    imagesHealthBarEndboss = imagePaths.statusbar.imagesHealthBarEndboss;

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
        const timeoutId = setTimeout(() => this.initCharacterBar(), 500);
        GlobalIntervalManager.registerTimeout(timeoutId, 'StatusBar setCharacter', this, 500, null);
    }

    /** Initializes character bar binding and multiplier */
    initCharacterBar() {
        if (!world) {
            console.error('Character nicht gefunden');
            return;
        }
        this.character = world.character;
        this.multiplier = this.getMultiplier();
        this.setWidth();
    }

    /**
     * Calculates the width multiplier based on bar type.
     * @returns {number} The multiplier for width calculation
     */
    getMultiplier() {
        if (this.statusbar === 'imagesBottleBar' || this.statusbar === 'imagesCoinBar') {
            return this.maxWidth / 10;
        }
        return this.maxWidth / this.character.energy;
    }

    /**
     * Binds the bar to the endboss and starts periodic width updates.
     */
    setEndboss() {
        const timeoutId = setTimeout(() => this.initEndbossBar(), 500);
        GlobalIntervalManager.registerTimeout(timeoutId, 'StatusBar setEndboss', this, 500, null);
    }

    /** Initializes endboss bar binding and multiplier */
    initEndbossBar() {
        if (!world) return;
        this.endboss = world.level.enemies.find(enemy => enemy instanceof Endboss);
        if (!this.endboss) {
            console.error('Endboss nicht gefunden');
            return;
        }
        this.endbossMultiplier = this.width / this.endboss.energy;
        this.initialWidth = this.width;
        this.initialX = this.x;
        this.setEndbossWidth();
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
        const configs = {
            imagesHealthBar: { gapMultiplier: 0, dx: -15, dy: -4, hScale: 1.35, wScale: 1.1 },
            imagesBottleBar: { gapMultiplier: 1, dx: -8, dy: -10, hScale: 1.7, wScale: 0.45 },
            imagesCoinBar: { gapMultiplier: 2, dx: -15, dy: -8, hScale: 1.55, wScale: 1.0 },
            imagesHealthBarEndboss: { gapMultiplier: 0, dx: 0, dy: -15, hScale: 2.5, wScale: 1.1, isEndboss: true }
        };
        this.positionBar(configs[this.statusbar]);
    }

    /**
     * Positions statusbar components based on their configuration.
     * @param {Object} config - The positioning configuration for the bar
     */
    positionBar(config) {
        this.y += config.gapMultiplier * this.gap;
        if (this.type === 2) {
            this.x += config.dx;
            this.y += config.dy;
            this.height *= config.hScale;
            this.width = this.height * config.wScale;
            if (config.isEndboss) this.x = 720 - this.width - 6;
        } else if (config.isEndboss) {
            this.x = 720 - this.width - this.x;
        }
    }
}
