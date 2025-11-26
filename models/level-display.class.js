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
        
        // Hintergrund für die Level-Anzeige
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.roundRect(this.x, this.y, this.width, this.height, 8);
        ctx.fill();
        
        // Text "LEVEL"
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = '#FFA500';
        ctx.textAlign = 'center';
        ctx.fillText('LEVEL', this.x + this.width / 2, this.y + 18);
        
        // Level-Nummer
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.fillText(this.levelNumber, this.x + this.width / 2, this.y + 42);
        
        ctx.restore();
    }
}
