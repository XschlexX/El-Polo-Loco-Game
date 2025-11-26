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
        ctx.save();

        // Rotation anwenden wenn vorhanden
        // Unterstütze sowohl direkte rotation als auch rotation.current (für Endboss)
        const rotationValue = this.rotation?.current !== undefined ? this.rotation.current : this.rotation;
        if (rotationValue) {
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            ctx.translate(centerX, centerY);
            ctx.rotate(rotationValue * Math.PI / 180);
            ctx.translate(-centerX, -centerY);
        }

        // Opacity-Unterstützung für Fade-Out-Effekt
        if (this.opacity !== undefined && this.opacity < 1) {
            ctx.globalAlpha = this.opacity;
        }

        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.restore();
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof CollectableBottle) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'blue';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    drawCollisionFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof ChickenSmall || this instanceof Endboss || this instanceof ThrowableObject || this instanceof CollectableBottle || this instanceof CollectableCoin) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x + this.rectOffsetLeft, this.y + this.rectOffsetTop, this.width - this.rectOffsetRight, this.height - this.rectOffsetBottom);
        }
    }

}

