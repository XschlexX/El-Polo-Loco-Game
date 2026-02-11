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
        this.drawBackground(ctx, 0.6);

        // Titel "Congratulations!"
        this.drawText(ctx, 'Congratulations!', 360, 50, 'bold 32px Rye, Arial');

        // Untertitel "You Won This Level!"
        this.drawText(ctx, 'You Won This Level!', 360, 90, 'bold 24px Rye, Arial');

        // Victory Image (wenn geladen)
        if (this.victoryImage.complete) {
            const imgWidth = 240;
            const imgHeight = (this.victoryImage.height / this.victoryImage.width) * imgWidth;
            const imgX = (720 / 2) - (imgWidth / 2);
            const imgY = (480 / 2) - (imgHeight / 2);

            ctx.drawImage(this.victoryImage, imgX, imgY, imgWidth, imgHeight);
        }

        // Buttons zeichnen
        this.buttons.forEach(button => {
            this.drawButton(ctx, button);
        });

        // Stelle den Canvas-Status wieder her
        ctx.restore();
    }
}
