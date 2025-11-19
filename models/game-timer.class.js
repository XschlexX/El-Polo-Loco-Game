class GameTimer extends DrawableObject {
    startTime;
    x = 490;
    y = 50;
    width = 200;
    height = 30;

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

        // Hintergrund
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Rahmen
        ctx.strokeStyle = '#dabc45';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Text
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            `Zeit: ${this.getFormattedTime()}`,
            this.x + this.width / 2,
            this.y + this.height / 2
        );

        ctx.restore();
    }
}
