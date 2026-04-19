/**
 * World class - Main game world controller
 * Manages game state, initialization, and control flow
 */
class World {
    character;
    level = currentLevel;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    throwableObjects = [];
    lastThrow;
    soundManager;

    /**
     * Creates a new World instance
     * @param {HTMLCanvasElement} canvas - The game canvas
     * @param {Keyboard} keyboard - Keyboard input handler
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.lastThrow = new Date().getTime();
        this.character = this.level.character;
        this.character.world = this;
        this.soundManager = window.soundManager;
        window.world = this;
        this.startGameLoop();
    }

    /** Starts the game loop */
    startGameLoop() {
        this.draw();
        this.setWorld();
        this.runGame();
    }

    /** Sets up world references for game objects */
    setWorld() {
        this.character.world = this;
        this.throwableObjects.forEach(object => object.world = this);
        this.level.enemies.forEach(enemy => enemy.world = this);
    }

    /** Starts game intervals and collision checks */
    runGame() {
        this.startCollisionInterval();
        this.startBottleCollisionInterval();
    }

    /** Starts main collision check interval */
    startCollisionInterval() {
        const callback = () => {
            this.checkCollisions();
            this.checkBottleCollection();
            this.checkCoinCollection();
        };
        const id = setInterval(callback, 50);
        GlobalIntervalManager.register(id, 'World collision checks', this, 50, callback);
    }

    /** Starts bottle collision check interval */
    startBottleCollisionInterval() {
        const callback = () => this.checkBottleCollisions();
        const id = setInterval(callback, 50);
        GlobalIntervalManager.register(id, 'World bottle collision checks', this, 50, callback);
    }

    /**
     * Checks if throw cooldown has passed
     * @returns {boolean} True if can throw
     */
    throwInterval() {
        const timeSinceLastThrow = (new Date().getTime() - this.lastThrow) / 1000;
        return timeSinceLastThrow > 1;
    }

    /** Pauses the game */
    pauseGame() {
        GlobalIntervalManager.pauseAll();
        this.pauseGameTimer();
        this.pauseSounds();
    }

    /** Pauses the game timer */
    pauseGameTimer() {
        if (this.level.gameTimer?.[0]) {
            this.level.gameTimer[0].pause();
        }
    }

    /** Pauses sounds and plays menu theme */
    pauseSounds() {
        if (this.soundManager) {
            this.soundManager.pauseAllSounds();
            this.soundManager.playMusic('menuTheme');
        }
    }

    /** Resumes the game */
    resumeGame() {
        GlobalIntervalManager.resumeAll();
        this.resumeGameTimer();
        this.resumeSounds();
    }

    /** Resumes the game timer */
    resumeGameTimer() {
        if (this.level.gameTimer?.[0]) {
            this.level.gameTimer[0].resume();
        }
    }

    /** Resumes sounds and plays game theme */
    resumeSounds() {
        if (this.soundManager) {
            this.soundManager.stopMusic('menuTheme');
            this.soundManager.resumeAllSounds();
            this.soundManager.playMusic('gameTheme');
        }
    }

    /** Stops the game completely */
    stopGame() {
        GlobalIntervalManager.clearAll();
        this.disableKeyboard();
        this.pauseGameTimer();
        this.stopCharacterSounds();
        this.stopSoundEffects();
    }

    /** Disables all keyboard inputs */
    disableKeyboard() {
        if (this.keyboard) {
            Object.keys(this.keyboard).forEach(key => this.keyboard[key] = false);
        }
    }

    /** Stops character-specific sounds */
    stopCharacterSounds() {
        if (this.character) {
            this.character.isSleeping = false;
            this.character.isIdle = false;
            if (this.character.sleepTimer) {
                GlobalIntervalManager.clearTimeout(this.character.sleepTimer, 'Character sleep timer');
            }
        }
    }

    /** Stops sound effects */
    stopSoundEffects() {
        if (this.soundManager) {
            this.soundManager.stopAllSounds();
        }
    }

    /** Toggles sound mute/unmute */
    toggleSound() {
        if (!this.soundManager) return;
        if (this.soundManager.muted) {
            this.soundManager.unmuteAll();
            this.soundManager.playMusic('menuTheme');
        } else {
            this.soundManager.muteAll();
        }
    }

}

// Apply mixins to World class
Object.assign(World.prototype, WorldCollisionMixin);
Object.assign(World.prototype, WorldRenderingMixin);
