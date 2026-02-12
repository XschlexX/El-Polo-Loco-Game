class SettingsOverlay extends Overlay {
    constructor() {
        super();
        this.setupButtons();
    }

    setupButtons() {
        // Sound Toggle Button
        this.buttons.push({
            x: 260,
            y: 160,
            width: 200,
            height: 50,
            text: 'Sound:  ON',
            action: 'toggleSound',
            isHovered: false
        });

        // Restart Game Button
        this.buttons.push({
            x: 260,
            y: 220,
            width: 200,
            height: 50,
            text: 'Restart Game',
            action: 'restart',
            isHovered: false
        });

        // Exit Game Button
        this.buttons.push({
            x: 260,
            y: 280,
            width: 200,
            height: 50,
            text: 'Exit Game',
            action: 'exit',
            isHovered: false
        });

        // Resume Button
        this.buttons.push({
            x: 260,
            y: 340,
            width: 200,
            height: 50,
            text: 'Resume',
            action: 'resume',
            isHovered: false
        });
    }

    /**
     * Aktualisiert den Text des Sound-Buttons basierend auf dem aktuellen Mute-Status
     */
    updateSoundButtonText() {
        const soundButton = this.buttons.find(b => b.action === 'toggleSound');
        if (soundButton && window.soundManager) {
            soundButton.text = window.soundManager.muted ? 'Sound:  OFF' : 'Sound:  ON';
        }
    }

    /**
     * Zeigt das Overlay an und aktualisiert den Sound-Button-Status
     */
    show() {
        this.isVisible = true;
        this.updateSoundButtonText();
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
