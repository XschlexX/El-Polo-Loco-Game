class GameTimer extends DrawableObject {
    startTime;
    width = 120;
    height = 30;
    y = 70;   // Unter Level Display (Level Display: y=10 + height=50 + gap=10)
    x = 720 / 2 - this.width / 2;  // Zentriert unter Level Display (Level Display: x=320, width=80, Timer: width=200)

    constructor() {
        super();
        this.startTime = new Date().getTime();
    }

    /**
     * Berechnet die vergangene Zeit seit Spielstart
     * @returns {Object} Objekt mit Minuten und Sekunden
     */
    getElapsedTime() {
        const currentTime = new Date().getTime();
        const elapsed = Math.floor((currentTime - this.startTime) / 1000); // in Sekunden
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        return { minutes, seconds };
    }

    /**
     * Formatiert die Zeit als String (MM:SS)
     * @returns {string} Formatierte Zeit
     */
    getFormattedTime() {
        const { minutes, seconds } = this.getElapsedTime();
        const mm = minutes.toString().padStart(2, '0');
        const ss = seconds.toString().padStart(2, '0');
        return `${mm}:${ss}`;
    }

    /**
     * Zeichnet den Timer auf dem Canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas Context
     */
    draw(ctx) {
        ctx.save();

        // Hintergrund mit abgerundeten Ecken
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, 8);
        ctx.fill();

        // // Rahmen mit abgerundeten Ecken
        // ctx.strokeStyle = '#dabc45';
        // ctx.lineWidth = 2;
        // ctx.beginPath();
        // this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, 8);
        // ctx.stroke();

        // Text
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
