class DebugInfo extends DrawableObject {
    world;

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
                debugModus = !debugModus;
                console.log('Debug Info:', debugModus ? 'AN' : 'AUS');
            }
        });
    }

    /**
     * Zeichnet die Debug-Informationen auf dem Canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas Context
     */
    draw(ctx) {
        // Nur zeichnen wenn world existiert und Debug aktiviert ist
        if (!debugModus) {
            return;
        }

        // Debug-Info für den Charakter
        if (characterDebug) {
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

        if (endbossDebug) {
            const boss = this.world.level.enemies.find(e => e instanceof Endboss);
            if (!boss) return;

            const fieldX = 400;
            const fieldY = 120;
            const fieldWidth = 300;
            const textGap = 15;

            // Zeige x + width wenn nach rechts, sonst nur x
            const displayX = boss.otherDirection ?
                Math.round(boss.x + boss.width) :
                Math.round(boss.x);

            // Debug-Informationen als Array definieren
            const debugInfo = [
                'Endboss Debug:',
                `Position: (${displayX})`,
                `StartX: ${Math.round(boss.startX)}`,
                `Level End: ${Math.round(boss.levelEnd || levelEnd)}`,
                `Energy: ${boss.energy}`,
                `State: ${boss.state.isChasing ? 'CHASING' : 'PATROL'}`,
                `Direction: ${boss.otherDirection ? 'RECHTS →' : '← LINKS'}`
            ];

            // Höhe des Feldes basierend auf der Anzahl der Debug-Zeilen berechnen
            const fieldHeight = debugInfo.length * textGap + 10;

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
    }
}
