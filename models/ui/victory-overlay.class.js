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
        const maxLevel = 5;
        const isLastLevel = currentLevelNumber >= maxLevel;

        if (!isLastLevel) {
            // Next Level Button - nur anzeigen wenn es ein nächstes Level gibt
            this.buttons.push({
                x: 200,
                y: 400,
                width: 140,
                height: 50,
                text: `Try Level ${currentLevelNumber + 1}`,
                action: 'nextLevel',
                isHovered: false,
                fontSize: 'bold 20px Rye, Arial'
            });

            // Main Menu Button - rechts daneben
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
        } else {
            // Nur Main Menu Button in der Mitte beim letzten Level
            this.buttons.push({
                x: 290,
                y: 400,
                width: 140,
                height: 50,
                text: 'Main Menu',
                action: 'mainMenu',
                isHovered: false,
                fontSize: 'bold 20px Rye, Arial'
            });
        }
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

        // Nachricht wenn es das letzte Level ist
        if (currentLevelNumber >= 5) {
            this.drawText(ctx, 'You have completed all levels!', 360, 340, 'bold 18px Rye, Arial');
            this.drawText(ctx, 'Thank you for playing!', 360, 365, '16px Rye, Arial');
        }

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
