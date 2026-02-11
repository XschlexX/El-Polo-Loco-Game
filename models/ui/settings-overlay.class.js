class SettingsOverlay extends Overlay {
    constructor() {
        super();
        this.setupButtons();
    }

    setupButtons() {
        // Restart Game Button
        this.buttons.push({
            x: 260,
            y: 190,
            width: 200,
            height: 50,
            text: 'Restart Game',
            action: 'restart',
            isHovered: false
        });

        // Exit Game Button
        this.buttons.push({
            x: 260,
            y: 260,
            width: 200,
            height: 50,
            text: 'Exit Game',
            action: 'exit',
            isHovered: false
        });

        // Resume Button
        this.buttons.push({
            x: 260,
            y: 330,
            width: 200,
            height: 50,
            text: 'Resume',
            action: 'resume',
            isHovered: false
        });
    }

    draw(ctx) {
        if (!this.isVisible) return;

        // Speichere den Canvas-Status
        ctx.save();

        // Halbtransparenter schwarzer Hintergrund
        this.drawBackground(ctx, 0.7);

        // Container mit abgerundeten Ecken
        ctx.fillStyle = 'rgba(110, 194, 255, 0.5)';
        ctx.beginPath();
        this.drawRoundedRect(ctx, 200, 80, 320, 360, 20);
        ctx.fill();

        // Rahmen mit abgerundeten Ecken
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.beginPath();
        this.drawRoundedRect(ctx, 200, 80, 320, 360, 20);
        ctx.stroke();

        // Titel
        ctx.fillStyle = '#333';
        ctx.font = 'bold 32px Rye, Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Menu', 360, 140);

        // Buttons zeichnen
        this.buttons.forEach(button => {
            this.drawButton(ctx, button);
        });

        // Stelle den Canvas-Status wieder her
        ctx.restore();
    }
}
