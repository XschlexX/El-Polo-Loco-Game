/**
 * Displays the current level number on the canvas.
 * Renders a rounded-rect badge with "LEVEL" label and the level number.
 * @extends DrawableObject
 */
class LevelDisplay extends DrawableObject {

    levelNumber = 1;
    x = 320;
    y = 10;
    width = 80;
    height = 50;

    /**
     * @param {number} levelNumber - The level number to display
     */
    constructor(levelNumber) {
        super();
        this.levelNumber = levelNumber;
    }

    /**
     * Draws the level display badge on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    draw(ctx) {
        ctx.save();
        this.drawBackground(ctx);
        this.drawLabel(ctx);
        this.drawLevelNumber(ctx);
        ctx.restore();
    }

    /**
     * Draws the semitransparent rounded rectangle background for the badge.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    drawBackground(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, 8);
        ctx.fill();
    }

    /**
     * Draws the 'LEVEL' header text.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    drawLabel(ctx) {
        ctx.font = 'bold 12px Rye, Arial';
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'center';
        ctx.fillText('LEVEL', this.x + this.width / 2, this.y + 18);
    }

    /**
     * Draws the level number text.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    drawLevelNumber(ctx) {
        ctx.font = 'bold 24px Rye, Arial';
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'center';
        ctx.fillText(this.levelNumber, this.x + this.width / 2, this.y + 42);
    }

    /**
     * Draws a rounded rectangle path on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Rectangle width
     * @param {number} height - Rectangle height
     * @param {number} radius - Corner radius
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
