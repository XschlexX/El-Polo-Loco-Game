/**
 * BASE OVERLAY CLASS
 * Gemeinsame Basis-Klasse für alle Canvas-Overlays
 * Enthält gemeinsame Funktionalität wie Button-Handling, Zeichnen, etc.
 */
class Overlay {
    world;
    isVisible = false;
    buttons = [];

    constructor() {
        // Wird von Subklassen überschrieben
    }

    /**
     * Zeigt das Overlay an
     */
    show() {
        this.isVisible = true;
    }

    /**
     * Versteckt das Overlay
     */
    hide() {
        this.isVisible = false;
    }

    /**
     * Togglet die Sichtbarkeit des Overlays
     */
    toggle() {
        this.isVisible = !this.isVisible;
    }

    /**
     * Zeichnet das Overlay auf dem Canvas
     * MUSS von Subklassen überschrieben werden
     * @param {CanvasRenderingContext2D} ctx - Canvas Context
     */
    draw(ctx) {
        if (!this.isVisible) return;
        // Wird von Subklassen implementiert
    }

    /**
     * Zeichnet den halbtransparenten Hintergrund
     * @param {CanvasRenderingContext2D} ctx - Canvas Context
     * @param {number} opacity - Transparenz (0-1)
     */
    drawBackground(ctx, opacity = 0.7) {
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        ctx.fillRect(0, 0, 720, 480);
    }

    /**
     * Zeichnet einen Button mit abgerundeten Ecken
     * @param {CanvasRenderingContext2D} ctx - Canvas Context
     * @param {Object} button - Button-Objekt
     */
    drawButton(ctx, button) {
        // Button-Hintergrund mit Farbverlauf
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
            gradient.addColorStop(0, '#ff9d00');
            gradient.addColorStop(0.5, '#ffdb00');
            gradient.addColorStop(1, '#ff9d00');
        }
        ctx.fillStyle = gradient;

        // Zeichne Button mit abgerundeten Ecken
        ctx.beginPath();
        this.drawRoundedRect(ctx, button.x, button.y, button.width, button.height, 12);
        ctx.fill();

        // Button-Rahmen
        ctx.strokeStyle = '#a0220a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        this.drawRoundedRect(ctx, button.x, button.y, button.width, button.height, 12);
        ctx.stroke();

        // Button-Text mit Text-Stroke
        ctx.fillStyle = 'orange';
        ctx.strokeStyle = '#a0220a';
        ctx.lineWidth = 5;
        ctx.font = button.fontSize || 'bold 24px Rye, Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Zeichne Text-Umriss (Stroke)
        ctx.strokeText(button.text, button.x + button.width / 2, button.y + button.height / 2);
        // Zeichne Text-Füllung
        ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
    }

    /**
     * Zeichnet Text mit Schatten und Outline
     * @param {CanvasRenderingContext2D} ctx - Canvas Context
     * @param {string} text - Der anzuzeigende Text
     * @param {number} x - X-Position
     * @param {number} y - Y-Position
     * @param {string} font - Font-String
     * @param {string} fillColor - Füllfarbe
     * @param {string} strokeColor - Umriss-Farbe
     * @param {number} strokeWidth - Umriss-Breite
     */
    drawText(ctx, text, x, y, font = 'bold 32px Rye, Arial', fillColor = 'orange', strokeColor = '#a0220a', strokeWidth = 1) {
        ctx.font = font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;

        // Text-Schatten
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Zeichne Text-Umriss und Füllung
        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);

        // Reset Shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    /**
     * Behandelt Klick-Events
     * @param {number} mouseX - X-Position der Maus
     * @param {number} mouseY - Y-Position der Maus
     * @returns {string|null} - Action des geklickten Buttons oder null
     */
    handleClick(mouseX, mouseY) {
        if (!this.isVisible) return null;

        for (let button of this.buttons) {
            if (this.isButtonClicked(button, mouseX, mouseY)) {
                return button.action;
            }
        }
        return null;
    }

    /**
     * Behandelt Hover-Events
     * @param {number} mouseX - X-Position der Maus
     * @param {number} mouseY - Y-Position der Maus
     * @returns {boolean} - true wenn ein Button gehovered wird
     */
    handleHover(mouseX, mouseY) {
        if (!this.isVisible) return false;

        let anyHovered = false;
        this.buttons.forEach(button => {
            button.isHovered = this.isButtonClicked(button, mouseX, mouseY);
            if (button.isHovered) anyHovered = true;
        });
        return anyHovered;
    }

    /**
     * Prüft ob ein Button geklickt wurde
     * @param {Object} button - Button-Objekt
     * @param {number} mouseX - X-Position der Maus
     * @param {number} mouseY - Y-Position der Maus
     * @returns {boolean} - true wenn Button geklickt wurde
     */
    isButtonClicked(button, mouseX, mouseY) {
        return mouseX >= button.x &&
            mouseX <= button.x + button.width &&
            mouseY >= button.y &&
            mouseY <= button.y + button.height;
    }

    /**
     * Zeichnet ein Rechteck mit abgerundeten Ecken
     * @param {CanvasRenderingContext2D} ctx - Canvas Context
     * @param {number} x - X-Position
     * @param {number} y - Y-Position
     * @param {number} width - Breite
     * @param {number} height - Höhe
     * @param {number} radius - Border-Radius
     */
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
