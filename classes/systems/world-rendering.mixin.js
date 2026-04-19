/**
 * World Rendering Mixin
 * Provides rendering and drawing methods for the World class
 * @mixin
 */
const WorldRenderingMixin = {

    /** Main draw loop */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawParallaxBackgrounds();
        this.drawGameLayer();
        this.drawUILayer();
        this.drawEntitiesLayer();
        this.scheduleNextFrame();
    },

    /** Draws game objects with camera transform */
    drawGameLayer() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);
    },

    /** Draws UI elements without camera transform */
    drawUILayer() {
        this.addObjectsToMap(this.level.statusBars);
        this.addObjectsToMap(this.level.gameTimer);
        this.addObjectsToMap(this.level.levelDisplay);
    },

    /** Draws all game entities with camera transform */
    drawEntitiesLayer() {
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.collectableBottles);
        this.addObjectsToMap(this.level.collectableCoins);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
    },

    /** Schedules the next animation frame */
    scheduleNextFrame() {
        requestAnimationFrame(() => this.draw());
    },

    /**
     * Draws background layers with parallax effect
     * Each layer moves at different speed based on parallaxFactor
     */
    drawParallaxBackgrounds() {
        const factorGroups = this.groupByParallaxFactor();
        const sortedFactors = this.getSortedFactors(factorGroups);
        this.drawParallaxLayers(factorGroups, sortedFactors);
    },

    /**
     * Groups background objects by parallax factor
     * @returns {Object} Groups of background objects
     */
    groupByParallaxFactor() {
        const groups = {};
        this.level.backgroundObjects.forEach(bg => {
            if (!groups[bg.parallaxFactor]) {
                groups[bg.parallaxFactor] = [];
            }
            groups[bg.parallaxFactor].push(bg);
        });
        return groups;
    },

    /**
     * Gets sorted parallax factors
     * @param {Object} factorGroups - Grouped background objects
     * @returns {Array} Sorted factors
     */
    getSortedFactors(factorGroups) {
        return Object.keys(factorGroups)
            .map(f => parseFloat(f))
            .sort((a, b) => a - b);
    },

    /**
     * Draws parallax layers
     * @param {Object} factorGroups - Grouped background objects
     * @param {Array} sortedFactors - Sorted parallax factors
     */
    drawParallaxLayers(factorGroups, sortedFactors) {
        sortedFactors.forEach(factor => {
            const offset = this.camera_x * factor;
            this.ctx.translate(offset, 0);
            this.addObjectsToMap(factorGroups[factor]);
            this.ctx.translate(-offset, 0);
        });
    },

    /**
     * Adds multiple objects to map
     * @param {Array} objects - Objects to add
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            if (!o.markedForDeletion) {
                this.addToMap(o);
            }
        });
    },

    /**
     * Adds single object to map with flip handling
     * @param {MovableObject} mo - Object to add
     */
    addToMap(mo) {
        const shouldFlip = this.shouldFlipImage(mo);
        if (shouldFlip) this.flipImage(mo);
        mo.draw(this.ctx);
        if (shouldFlip) this.flipImageBack(mo);
    },

    /**
     * Determines if image should be flipped
     * @param {MovableObject} mo - Object to check
     * @returns {boolean} True if should flip
     */
    shouldFlipImage(mo) {
        const isEnemy = mo instanceof Chicken || mo instanceof ChickenSmall || mo instanceof Endboss;
        return isEnemy ? !mo.otherDirection : mo.otherDirection;
    },

    /**
     * Flips image horizontally
     * @param {MovableObject} mo - Object to flip
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = -mo.x;
    },

    /**
     * Restores flipped image
     * @param {MovableObject} mo - Object to restore
     */
    flipImageBack(mo) {
        this.ctx.restore();
        mo.x = -mo.x;
    }

};
