class DefeatOverlay extends Overlay {
    defeatImage;

    constructor() {
        super();
        this.setupButtons();
        this.loadDefeatImage();
    }

    loadDefeatImage() {
        this.defeatImage = new Image();
        this.defeatImage.src = 'assets/img/You won, you lost/Game Over.png';
    }

    setupButtons() {
        // Next Level Button
        this.buttons.push({
            x: 200,
            y: 400,
            width: 140,
            height: 50,
            text: 'Try Again',
            action: 'tryAgain',
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
        this.drawBackground(ctx, 0.6);

        // Titel "Oh No! You Lost!!"
        this.drawText(ctx, 'Oh No! You Lost!', 360, 50, 'bold 32px Rye, Arial');

        // Untertitel "Try Again!"
        this.drawText(ctx, 'Try Again!', 360, 90, 'bold 24px Rye, Arial');

        // Victory Image (wenn geladen)
        if (this.defeatImage.complete) {
            const imgWidth = 340;
            const imgHeight = (this.defeatImage.height / this.defeatImage.width) * imgWidth;
            const imgX = (720 - imgWidth) / 2;
            const imgY = (480 / 2) - (imgHeight / 2);

            ctx.drawImage(this.defeatImage, imgX, imgY, imgWidth, imgHeight);
        }

        // Buttons zeichnen
        this.buttons.forEach(button => {
            this.drawButton(ctx, button);
        });

        // Stelle den Canvas-Status wieder her
        ctx.restore();
    }
}
