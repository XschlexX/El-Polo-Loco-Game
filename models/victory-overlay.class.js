class VictoryOverlay extends Overlay {
    victoryImage;

    constructor() {
        super();
        this.setupButtons();
        this.loadVictoryImage();
    }

    loadVictoryImage() {
        this.victoryImage = new Image();
        this.victoryImage.src = 'assets/img/You won, you lost/You won A.png';
    }

    setupButtons() {
        // Next Level Button
        this.buttons.push({
            x: 200,
            y: 400,
            width: 140,
            height: 50,
            text: 'Next Level',
            action: 'nextLevel',
            isHovered: false,
            fontSize: 'bold 20px Rye, Arial'
        });

        // Main Menu Button
        this.buttons.push({
            x: 380,
            y: 400,
            width: 140,
            height: 50,
            text: 'Main Menu',
            action: 'mainMenu',
            isHovered: false,
            fontSize: 'bold 20px Rye, Arial'
        });
    }

    draw(ctx) {
        if (!this.isVisible) return;

        // Speichere den Canvas-Status
        ctx.save();

        // Halbtransparenter schwarzer Hintergrund
        this.drawBackground(ctx, 0.3);

        // Titel "Congratulations!"
        this.drawText(ctx, 'Congratulations!', 360, 100, 'bold 32px Rye, Arial');

        // Untertitel "You Won This Level!"
        this.drawText(ctx, 'You Won This Level!', 360, 140, 'bold 28px Rye, Arial');

        // Victory Image (wenn geladen)
        if (this.victoryImage.complete) {
            const imgWidth = 240;
            const imgHeight = (this.victoryImage.height / this.victoryImage.width) * imgWidth;
            const imgX = (720 - imgWidth) / 2;
            const imgY = 200;

            ctx.drawImage(this.victoryImage, imgX, imgY, imgWidth, imgHeight);
        }

        // Buttons zeichnen
        this.buttons.forEach(button => {
            this.drawButton(ctx, button);
        });

        // Stelle den Canvas-Status wieder her
        ctx.restore();
    }

    handleClick(mouseX, mouseY) {
        if (!this.isVisible) return null;

        for (let button of this.buttons) {
            if (this.isButtonClicked(button, mouseX, mouseY)) {
                return button.action;
            }
        }
        return null;
    }

    handleHover(mouseX, mouseY) {
        if (!this.isVisible) return false;

        let anyHovered = false;
        this.buttons.forEach(button => {
            button.isHovered = this.isButtonClicked(button, mouseX, mouseY);
            if (button.isHovered) anyHovered = true;
        });
        return anyHovered;
    }

    isButtonClicked(button, mouseX, mouseY) {
        return mouseX >= button.x &&
            mouseX <= button.x + button.width &&
            mouseY >= button.y &&
            mouseY <= button.y + button.height;
    }

    drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
}
