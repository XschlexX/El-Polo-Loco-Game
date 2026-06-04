/**
 * HTML-based debug overlay that displays runtime debug information.
 * Replaces the canvas-based debug-info.class.js with DOM elements
 * that auto-update without canvas rendering.
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
     * Registers the F2 key listener to toggle debug mode visibility.
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
     * Creates the HTML elements for the debug overlay inside the game container.
     */
    createDebugElements() {
        const gameContainer = document.getElementById('game_container');
        if (!gameContainer) {
            console.error('Game-Container nicht gefunden!');
            return;
        }

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

        const characterPanel = document.createElement('div');
        characterPanel.id = 'debug-character-panel';
        characterPanel.className = 'debug-panel';
        characterPanel.style.cssText = this.getPanelStyles(10, 10);
        debugContainer.appendChild(characterPanel);

        const endbossPanel = document.createElement('div');
        endbossPanel.id = 'debug-endboss-panel';
        endbossPanel.className = 'debug-panel';
        endbossPanel.style.cssText = this.getPanelStylesRight(10, 10);
        debugContainer.appendChild(endbossPanel);

        gameContainer.appendChild(debugContainer);

        this.startUpdateInterval();
    }

    /**
     * Returns CSS styles for a left-aligned debug panel.
     * @param {number} x - Left offset in pixels
     * @param {number} y - Top offset in pixels
     * @returns {string} CSS style string
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
     * Returns CSS styles for a right-aligned debug panel.
     * @param {number} x - Right offset in pixels
     * @param {number} y - Top offset in pixels
     * @returns {string} CSS style string
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
     * Starts the auto-update interval that refreshes debug info every 100ms.
     */
    startUpdateInterval() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateInterval = setInterval(() => {
            if (debugModus && this.world) {
                this.updateDebugInfo();
            }
        }, 100);
    }

    /**
     * Stops the auto-update interval.
     */
    stopUpdateInterval() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * Shows or hides the debug overlay.
     * @param {boolean} show - Whether to show the overlay
     */
    toggleVisibility(show) {
        const debugContainer = document.getElementById('debug-overlay');
        if (debugContainer) {
            debugContainer.style.display = show ? 'block' : 'none';
            this.isVisible = show;
        }
    }

    /**
     * Updates all debug information panels.
     */
    updateDebugInfo() {
        this.updateCharacterDebug();
        this.updateEndbossDebug();
    }

    /**
     * Updates the character debug panel with current state values.
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
     * Updates the endboss debug panel with current state values.
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
     * Sets the world reference. Called after world initialization.
     * @param {Object} world - The game world instance
     */
    setWorld(world) {
        this.world = world;
    }

    /**
     * Cleans up intervals and removes the overlay from the DOM.
     */
    destroy() {
        this.stopUpdateInterval();
        const debugContainer = document.getElementById('debug-overlay');
        if (debugContainer) {
            debugContainer.remove();
        }
    }
}
