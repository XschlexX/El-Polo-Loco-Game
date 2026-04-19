class LevelDisplay extends DrawableObject {

    levelNumber = 1;
    x = 320;
    y = 10;
    width = 80;
    height = 50;

    constructor(levelNumber) {
        super();
        this.levelNumber = levelNumber;
    }

    draw(ctx) {
        ctx.save();

        // Hintergrund für die Level-Anzeige (rechteckig mit abgerundeten Ecken)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        this.drawRoundedRect(ctx, this.x, this.y, this.width, this.height, 8);
        ctx.fill();

        // Text "LEVEL"
        ctx.font = 'bold 12px Rye, Arial';
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'center';
        ctx.fillText('LEVEL', this.x + this.width / 2, this.y + 18);

        // Level-Nummer
        ctx.font = 'bold 24px Rye, Arial';
        ctx.fillStyle = '#FFD700';
        ctx.fillText(this.levelNumber, this.x + this.width / 2, this.y + 42);

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
