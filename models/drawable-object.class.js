class DrawableObject {
    x;
    y;
    width;
    height;
    img;
    imageCache = {};
    currentImage = 0;


    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    draw(ctx) {
        // Opacity-Unterstützung für Fade-Out-Effekt
        if (this.opacity !== undefined && this.opacity < 1) {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            ctx.restore();
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'blue';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    drawCollisionFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x + this.rectOffsetLeft, this.y + this.rectOffsetTop, this.width - this.rectOffsetRight, this.height - this.rectOffsetBottom);
        }
    }

}

