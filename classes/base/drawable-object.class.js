/**
 * Base class for all renderable game objects.
 * Provides image loading, caching, drawing with rotation/opacity, and debug frame rendering.
 */
class DrawableObject {
    x;
    y;
    width;
    height;
    img;
    imageCache = {};
    currentImage = 0;

    /** @type {Object.<string, HTMLImageElement>} Shared cache for all drawable instances to avoid duplicate image loading */
    static globalImageCache = {};

    /**
     * Loads a single image from the given path, using the global cache to avoid duplicate loading.
     * @param {string} path - Path to the image file
     */
    loadImage(path) {
        if (DrawableObject.globalImageCache[path]) {
            this.img = DrawableObject.globalImageCache[path];
        } else {
            this.img = new Image();
            this.img.src = path;
            DrawableObject.globalImageCache[path] = this.img;
        }
    }

    /**
     * Loads multiple images into the instance imageCache, using the global cache when available.
     * @param {string[]} arr - Array of image file paths
     */
    loadImages(arr) {
        arr.forEach(path => {
            if (DrawableObject.globalImageCache[path]) {
                this.imageCache[path] = DrawableObject.globalImageCache[path];
            } else {
                let img = new Image();
                img.src = path;
                this.imageCache[path] = img;
                DrawableObject.globalImageCache[path] = img;
            }
        });
    }

    /**
     * Draws the current image onto the canvas context with optional rotation and opacity support.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    draw(ctx) {
        ctx.save();
        this.applyRotation(ctx);
        this.applyOpacity(ctx);
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.restore();
    }

    /**
     * Applies rotation to the canvas context if rotation is defined.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    applyRotation(ctx) {
        const rotationValue = this.rotation?.current !== undefined ? this.rotation.current : this.rotation;
        if (rotationValue) {
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            ctx.translate(centerX, centerY);
            ctx.rotate(rotationValue * Math.PI / 180);
            ctx.translate(-centerX, -centerY);
        }
    }

    /**
     * Applies opacity to the canvas context if opacity is defined.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    applyOpacity(ctx) {
        if (this.opacity !== undefined && this.opacity < 1) {
            ctx.globalAlpha = this.opacity;
        }
    }

    /**
     * Draws a blue debug bounding box around the object (full dimensions).
     * Only renders for Character, Chicken, Endboss, and CollectableBottle instances.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof CollectableBottle) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'blue';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Draws a red debug collision box using the object's hitBox offsets.
     * Only renders for collidable entity types.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    drawCollisionFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof ChickenSmall || this instanceof Endboss || this instanceof ThrowableObject || this instanceof CollectableBottle || this instanceof CollectableCoin) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x + this.hitBoxLeft, this.y + this.hitBoxTop, this.width - this.hitBoxRight, this.height - this.hitBoxBottom);
        }
    }

}

