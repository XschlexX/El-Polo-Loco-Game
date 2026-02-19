class DebugInfo extends DrawableObject {
    world;
    showDebugInfo = true; // Debug-Modus Ein/Aus (F2 zum Umschalten)

    constructor() {
        super();
        this.setupDebugToggle();
    }

    /**
     * SETUP DEBUG TOGGLE
     * Richtet die F2-Taste ein um Debug-Infos ein/auszuschalten
     */
    setupDebugToggle() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'F2') {
                this.showDebugInfo = !this.showDebugInfo;
                console.log('Debug Info:', this.showDebugInfo ? 'AN' : 'AUS');
            }
        });
    }

    /**
     * Zeichnet die Debug-Informationen auf dem Canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas Context
     */
    draw(ctx) {
        // Nur zeichnen wenn world existiert und Debug aktiviert ist
        if (!this.world || !this.showDebugInfo) {
            return;
        }

        // Debug-Info für den Charakter
        if (this.world.character) {
            const char = this.world.character;
            const isAboveGround = char.isAboveGround(char.groundLevel);
            const fieldX = 10;
            const fieldY = 120;
            const fieldWidth = 300;
            const textGap = 15;

            // Debug-Informationen als Array definieren
            const debugInfo = [
                'Character Debug:',
                `Position: (${char.x.toFixed(1)}, ${char.y.toFixed(1)})`,
                `bottles: ${char.bottles}`,
                `coins: ${char.coins}`,
                `speedY: ${char.speedY.toFixed(2)}`,
                `isAboveGround: ${isAboveGround}`,
                `isBouncing: ${char.isBouncing}`,
                `otherDirection: ${char.otherDirection}`
            ];

            // Höhe des Feldes basierend auf der Anzahl der Debug-Zeilen berechnen
            const fieldHeight = debugInfo.length * textGap + 10; // +10 für etwas Padding am unteren Rand

            ctx.save();
            ctx.font = '14px Arial';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(fieldX, fieldY, fieldWidth, fieldHeight);

            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';

            // Jede Debug-Zeile zeichnen
            debugInfo.forEach((info, index) => {
                ctx.fillText(info, fieldX + textGap, fieldY + textGap * (index + 1));
            });

            ctx.restore();
        }

        const endboss = this.world.level.enemies.find(enemy => enemy instanceof Endboss);

        // if (endboss) {
        //     ctx.save();
        //     ctx.font = '16px Arial';
        //     ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        //     ctx.fillRect(10, 120, 260, 170);

        //     ctx.fillStyle = 'lime';
        //     ctx.fillText('=== ENDBOSS DEBUG INFO ===', 20, 30);
        //     ctx.fillStyle = 'white';

        //     // Zeige x + width wenn nach rechts, sonst nur x
        //     const displayX = endboss.otherDirection ?
        //         Math.round(endboss.x + endboss.width) :
        //         Math.round(endboss.x);

        //     ctx.fillText(`X Position: ${displayX}`, 20, 55);
        //     ctx.fillText(`StartX: ${Math.round(endboss.startX)}`, 20, 75);
        //     ctx.fillText(`Level End: ${Math.round(endboss.levelEnd)}`, 20, 95);
        //     ctx.fillText(`Energy: ${endboss.energy}`, 20, 115);
        //     ctx.fillText(`State: ${endboss.state.isChasing ? 'CHASING' : 'PATROL'}`, 20, 135);
        //     ctx.fillText(`Direction: ${endboss.otherDirection ? 'RECHTS →' : '← LINKS'}`, 20, 155);

        //     ctx.fillStyle = 'yellow';
        //     ctx.font = '12px Arial';
        //     ctx.fillText('Drücke F2 zum Ausblenden', 20, 175);
        //     ctx.restore();
        // }
    }
}
