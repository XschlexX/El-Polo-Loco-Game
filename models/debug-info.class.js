class DebugInfo extends DrawableObject {
    world;

    constructor() {
        super();
    }

    /**
     * Zeichnet die Debug-Informationen auf dem Canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas Context
     */
    draw(ctx) {
        // Nur zeichnen wenn world existiert und Debug aktiviert ist
        if (!this.world || !this.world.showDebugInfo) {
            return;
        }

        const endboss = this.world.level.enemies.find(enemy => enemy instanceof Endboss);

        if (endboss) {
            ctx.save();
            ctx.font = '16px Arial';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(10, 10, 260, 170);

            ctx.fillStyle = 'lime';
            ctx.fillText('=== ENDBOSS DEBUG INFO ===', 20, 30);
            ctx.fillStyle = 'white';

            // Zeige x + width wenn nach rechts, sonst nur x
            const displayX = endboss.otherDirection ?
                Math.round(endboss.x + endboss.width) :
                Math.round(endboss.x);

            ctx.fillText(`X Position: ${displayX}`, 20, 55);
            ctx.fillText(`StartX: ${Math.round(endboss.startX)}`, 20, 75);
            ctx.fillText(`Level End: ${Math.round(endboss.levelEnd)}`, 20, 95);
            ctx.fillText(`Energy: ${endboss.energy}`, 20, 115);
            ctx.fillText(`State: ${endboss.state.isChasing ? 'CHASING' : 'PATROL'}`, 20, 135);
            ctx.fillText(`Direction: ${endboss.otherDirection ? 'RECHTS →' : '← LINKS'}`, 20, 155);

            ctx.fillStyle = 'yellow';
            ctx.font = '12px Arial';
            ctx.fillText('Drücke F2 zum Ausblenden', 20, 175);
            ctx.restore();
        }
    }
}
