class SettingsOverlay {
    world;
    isVisible = false;
    buttons = [];

    constructor() {
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

    show() {
        this.isVisible = true;
    }

    hide() {
        this.isVisible = false;
    }

    toggle() {
        this.isVisible = !this.isVisible;
    }

    draw(ctx) {
        if (!this.isVisible) return;

        // Speichere den Canvas-Status
        ctx.save();

        // Halbtransparenter schwarzer Hintergrund
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, 720, 480);

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
            // Button-Hintergrund mit Farbverlauf und abgerundeten Ecken
            let gradient;
            if (button.isHovered) {
                // Hellerer Verlauf beim Hover
                gradient = ctx.createLinearGradient(button.x, button.y, button.x, button.y + button.height);
                gradient.addColorStop(0, '#ffb820');
                gradient.addColorStop(0.5, '#ffd820');
                gradient.addColorStop(1, '#ffb820');
            } else {
                // Normaler Verlauf
                gradient = ctx.createLinearGradient(button.x, button.y, button.x, button.y + button.height);
                gradient.addColorStop(0, '#ffa500');
                gradient.addColorStop(0.5, '#ffc800');
                gradient.addColorStop(1, '#ffa500');
            }
            ctx.fillStyle = gradient;

            // Zeichne Button mit abgerundeten Ecken (border-radius: 12px)
            ctx.beginPath();
            this.drawRoundedRect(ctx, button.x, button.y, button.width, button.height, 12);
            ctx.fill();

            // Button-Rahmen mit abgerundeten Ecken
            ctx.strokeStyle = '#a0220a';
            ctx.lineWidth = 2;
            ctx.beginPath();
            this.drawRoundedRect(ctx, button.x, button.y, button.width, button.height, 12);
            ctx.stroke();

            // Button-Text mit Text-Stroke (orange mit rotem Umriss)
            ctx.fillStyle = 'orange';
            ctx.strokeStyle = '#a0220a';
            ctx.lineWidth = 5;
            ctx.font = 'bold 24px Rye, Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Zeichne Text-Umriss (Stroke)
            ctx.strokeText(button.text, button.x + button.width / 2, button.y + button.height / 2);
            // Zeichne Text-Füllung
            ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
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
