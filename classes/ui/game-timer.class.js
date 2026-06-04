/**
 * In-game timer that displays elapsed time on the canvas.
 * Supports pause and resume functionality.
 * @extends DrawableObject
 */
class GameTimer extends DrawableObject {
    startTime;
    pausedTime = 0;
    isPaused = false;
    width = 120;
    height = 30;
    y = 70;
    x = 720 / 2 - this.width / 2;

    constructor() {
        super();
        this.startTime = new Date().getTime();
    }

    /**
     * Pauses the timer, freezing the elapsed time at the current value.
     */
    pause() {
        if (!this.isPaused) {
            this.pausedTime = new Date().getTime();
            this.isPaused = true;
        }
    }

    /**
     * Resumes the timer after a pause, adjusting the start time.
     */
    resume() {
        if (this.isPaused) {
            const now = new Date().getTime();
            const pauseDuration = now - this.pausedTime;
            this.startTime += pauseDuration;
            this.isPaused = false;
        }
    }

    /**
     * Calculates the elapsed time since the game started.
     * @returns {{ minutes: number, seconds: number }} Object with minutes and seconds
     */
    getElapsedTime() {
        const currentTime = this.isPaused ? this.pausedTime : new Date().getTime();
        const elapsed = Math.floor((currentTime - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        return { minutes, seconds };
    }

    /**
     * Formats the elapsed time as a MM:SS string.
     * @returns {string} Formatted time string
     */
    getFormattedTime() {
        const { minutes, seconds } = this.getElapsedTime();
        const mm = minutes.toString().padStart(2, '0');
        const ss = seconds.toString().padStart(2, '0');
        return `${mm}:${ss}`;
    }

    /**
     * Draws the timer with a rounded-rect background on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    draw(ctx) {
        ctx.save();

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, 8);
        ctx.fill();

        ctx.font = 'bold 18px Rye, Arial';
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            `Zeit: ${this.getFormattedTime()}`,
            this.x + this.width / 2,
            this.y + this.height / 2
        );

        ctx.restore();
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
