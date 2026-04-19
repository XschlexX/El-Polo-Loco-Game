/**
 * DebugOverlay - HTML-basierte Debug-Informationen
 * Ersetzt die Canvas-basierte debug-info.class.js
 * 
 * Funktionen:
 * - F2-Taste zum Ein-/Ausschalten des Debug-Modus
 * - Zeigt Character-Debug-Informationen an
 * - Zeigt Endboss-Debug-Informationen an
 * - Aktualisiert sich automatisch ohne Canvas-Rendering
 */
class DebugOverlay {
    world;
    updateInterval = null;
    isVisible = false;

    constructor() {
        this.setupDebugToggle();
        this.createDebugElements();
    }

    /**
     * SETUP DEBUG TOGGLE
     * Richtet die F2-Taste ein um Debug-Infos ein/auszuschalten
     */
    setupDebugToggle() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'F2') {
                debugModus = !debugModus;
                this.toggleVisibility(debugModus);
                console.log('Debug Info:', debugModus ? 'AN' : 'AUS');
            }
        });
    }

    /**
     * Erstellt die HTML-Elemente für den Debug-Overlay
     */
    createDebugElements() {
        // Finde den Game-Container
        const gameContainer = document.getElementById('game_container');
        if (!gameContainer) {
            console.error('Game-Container nicht gefunden!');
            return;
        }

        // Hauptcontainer für Debug-Overlay (innerhalb des Game-Containers)
        const debugContainer = document.createElement('div');
        debugContainer.id = 'debug-overlay';
        debugContainer.className = 'debug-overlay';
        debugContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
            display: none;
        `;

        // Character Debug Panel (positioniert innerhalb des Game-Containers)
        const characterPanel = document.createElement('div');
        characterPanel.id = 'debug-character-panel';
        characterPanel.className = 'debug-panel';
        characterPanel.style.cssText = this.getPanelStyles(10, 10);
        debugContainer.appendChild(characterPanel);

        // Endboss Debug Panel (rechte obere Ecke)
        const endbossPanel = document.createElement('div');
        endbossPanel.id = 'debug-endboss-panel';
        endbossPanel.className = 'debug-panel';
        endbossPanel.style.cssText = this.getPanelStylesRight(10, 10);
        debugContainer.appendChild(endbossPanel);

        // Zum Game-Container hinzufügen (nicht zum body)
        gameContainer.appendChild(debugContainer);

        // Starte das Update-Interval
        this.startUpdateInterval();
    }

    /**
     * Gibt die CSS-Styles für ein Debug-Panel zurück (linke Seite)
     */
    getPanelStyles(x, y) {
        return `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            font-family: Arial, sans-serif;
            font-size: 14px;
            padding: 10px 15px;
            border-radius: 5px;
            min-width: 280px;
            pointer-events: none;
        `;
    }

    /**
     * Gibt die CSS-Styles für ein Debug-Panel zurück (rechte Seite)
     */
    getPanelStylesRight(x, y) {
        return `
            position: absolute;
            right: ${x}px;
            top: ${y}px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            font-family: Arial, sans-serif;
            font-size: 14px;
            padding: 10px 15px;
            border-radius: 5px;
            min-width: 280px;
            pointer-events: none;
        `;
    }

    /**
     * Startet das Interval für automatische Updates
     */
    startUpdateInterval() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateInterval = setInterval(() => {
            if (debugModus && this.world) {
                this.updateDebugInfo();
            }
        }, 100); // Update alle 100ms
    }

    /**
     * Stoppt das Update-Interval
     */
    stopUpdateInterval() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * Zeigt oder verbirgt den Debug-Overlay
     */
    toggleVisibility(show) {
        const debugContainer = document.getElementById('debug-overlay');
        if (debugContainer) {
            debugContainer.style.display = show ? 'block' : 'none';
            this.isVisible = show;
        }
    }

    /**
     * Aktualisiert alle Debug-Informationen
     */
    updateDebugInfo() {
        this.updateCharacterDebug();
        this.updateEndbossDebug();
    }

    /**
     * Aktualisiert die Character-Debug-Informationen
     */
    updateCharacterDebug() {
        const panel = document.getElementById('debug-character-panel');
        if (!panel || !characterDebug) {
            if (panel) panel.style.display = 'none';
            return;
        }

        panel.style.display = 'block';

        const char = this.world.character;
        if (!char) {
            panel.innerHTML = '<strong>Character Debug:</strong><br>Character nicht verfügbar';
            return;
        }

        const isAboveGround = char.isAboveGround(char.groundLevel);

        panel.innerHTML = `
            <strong>Character Debug:</strong><br>
            Position: (${char.x.toFixed(1)}, ${char.y.toFixed(1)})<br>
            bottles: ${char.bottles}<br>
            coins: ${char.coins}<br>
            speedY: ${char.speedY.toFixed(2)}<br>
            isAboveGround: ${isAboveGround}<br>
            isBouncing: ${char.isBouncing}<br>
            otherDirection: ${char.otherDirection}
        `;
    }

    /**
     * Aktualisiert die Endboss-Debug-Informationen
     */
    updateEndbossDebug() {
        const panel = document.getElementById('debug-endboss-panel');
        if (!panel || !endbossDebug) {
            if (panel) panel.style.display = 'none';
            return;
        }

        panel.style.display = 'block';

        const boss = this.world.level?.enemies?.find(e => e instanceof Endboss);
        if (!boss) {
            panel.innerHTML = '<strong>Endboss Debug:</strong><br>Endboss nicht verfügbar';
            return;
        }

        // Zeige x + width wenn nach rechts, sonst nur x
        const displayX = boss.otherDirection ?
            Math.round(boss.x) :
            Math.round(boss.x + boss.width);

        panel.innerHTML = `
            <strong>Endboss Debug:</strong><br>
            Position: (${displayX})<br>
            StartX: ${Math.round(boss.startX)}<br>
            Level End: ${Math.round(boss.levelEnd || levelEnd)}<br>
            Energy: ${boss.energy}<br>
            State: ${boss.state?.isChasing ? 'CHASING' : 'PATROL'}<br>
            Direction: ${boss.otherDirection ? '← LINKS' : 'RECHTS →'}<br>
            Rechter Rand: ${boss.rightBoundary}<br>
            Breite: ${boss.width}
        `;
    }

    /**
     * Setzt die World-Referenz
     * Wird von start.js aufgerufen nach der World-Erstellung
     */
    setWorld(world) {
        this.world = world;
    }

    /**
     * Cleanup-Methode für sauberes Entfernen
     */
    destroy() {
        this.stopUpdateInterval();
        const debugContainer = document.getElementById('debug-overlay');
        if (debugContainer) {
            debugContainer.remove();
        }
    }
}
