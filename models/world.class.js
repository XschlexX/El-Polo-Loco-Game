class World {
    character;
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    throwableObjects = [];
    lastThrow;
    settingsButton;
    settingsOverlay;
    soundManager;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.lastThrow = new Date().getTime();
        this.character = this.level.character; // Character aus dem Level holen
        this.character.world = this; // World-Referenz setzen
        this.soundManager = window.soundManager;
        window.world = this;

        // Erstelle Settings-Button und Overlay
        this.settingsButton = new SettingsButton();
        this.settingsButton.world = this;
        this.settingsOverlay = new SettingsOverlay();
        this.settingsOverlay.world = this;

        this.draw();
        this.setWorld();
        this.runGame();
        this.setupCanvasListeners();
    }

    setWorld() {
        this.character.world = this;
        this.throwableObjects.forEach(object => {
            object.world = this;
        });
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });

        // Setze world-Referenz für DebugInfo
        this.level.debugInfo.forEach(debug => {
            debug.world = this;
        });
    }

    runGame() {
        const collisionCallback = () => {
            this.checkCollisions();
            this.checkThrowableObject();
            this.checkBottleCollection(); // Prüfe ob Character Flaschen einsammelt
            this.checkCoinCollection(); // Prüfe ob Character Münzen einsammelt
        };
        const collisionIntervalId = setInterval(collisionCallback, 200);
        GlobalIntervalManager.register(collisionIntervalId, 'World collision checks', this, 200, collisionCallback);

        // Häufigere Prüfung der Flaschen-Kollisionen für bessere Treffergenauigkeit
        const bottleCallback = () => {
            this.checkBottleCollisions();
        };
        const bottleIntervalId = setInterval(bottleCallback, 50);
        GlobalIntervalManager.register(bottleIntervalId, 'World bottle collision checks', this, 50, bottleCallback);
    }

    checkCollisions() {
        this.level.enemies.forEach(enemy => {
            // Ignoriere tote oder sterbende Gegner
            if (enemy.isDying || enemy.isDead()) {
                return;
            }

            // Ignoriere Endboss während Ramming (soll durchlaufen)
            if (enemy instanceof Endboss && enemy.ramming.isActive) {
                return;
            }

            if (this.character.isColliding(enemy)) {
                // Prüfe zuerst, ob der Charakter von oben auf den Gegner springt (NUR für normale Feinde, nicht für Endboss!)
                const isJumpingOnEnemy = !(enemy instanceof Endboss) && this.isJumpingOnEnemy(this.character, enemy);

                if (isJumpingOnEnemy) {
                    // Character springt auf Gegner - Gegner stirbt
                    enemy.hit();
                    // Kleiner Bounce-Effekt
                    this.character.jump(4);
                } else if (!this.character.isHurt() && !isJumpingOnEnemy) { // Nur Schaden nehmen, wenn es KEIN Sprung von oben war
                    // Normale Kollision von der Seite - Character nimmt Schaden
                    this.character.hit();
                    this.character.resetSleepTimer();

                    // Wenn es ein Endboss ist, aktiviere Ramming-Modus
                    if (enemy instanceof Endboss && enemy.onCharacterCollision && !enemy.ramming.isActive) {
                        enemy.onCharacterCollision();
                    }
                }
            }
        });
    }

    isJumpingOnEnemy(character, enemy) {
        // Charakter Positionen
        const characterBottom = character.y + character.height - character.hitBoxBottom;
        // const characterFeetY = character.y + character.height;

        // Gegner Positionen
        const enemyTop = enemy.y + enemy.hitBoxTop + 30;
        // const enemyBottom = enemy.y + enemy.height - enemy.hitBoxBottom;
        const enemyMiddle = enemy.y + (enemy.height / 2);

        // Prüfe ob:
        // 1. Character fällt (speedY > 0)
        // 2. Character's Füße sind über der Oberkante des Gegners
        // 3. Character's Füße sind unterhalb der Mitte des Gegners
        // 4. Character ist horizontal über dem Gegner
        const isFalling = character.speedY < 0;
        // console.log('Is falling:', isFalling);
        const isAboveEnemyTop = characterBottom < enemyMiddle; // Untere Hälfte des Gegners
        // const isNotTooFarAbove = characterBottom > enemyTop - 30; // Etwas mehr Toleranz nach oben
        // const isHorizontallyAligned =
        //     (character.x + character.width - character.hitBoxRight) > enemy.x &&
        //     character.x < (enemy.x + enemy.width - enemy.hitBoxRight);

        return isFalling && isAboveEnemyTop;
    }

    checkBottleCollisions() {
        this.throwableObjects.forEach(bottle => {
            this.level.enemies.forEach(enemy => {
                // Ignoriere tote oder sterbende Gegner
                if (enemy.isDying || enemy.isDead()) {
                    return;
                }

                if (bottle.isColliding(enemy) && !bottle.hasSplashed) {
                    bottle.splash(); // Flasche zerbricht
                    enemy.hit(); // Gegner nimmt Schaden

                    // Wenn es ein Endboss ist, triggere Alert/Attack Sequenz
                    if (enemy instanceof Endboss && enemy.onBottleHit) {
                        enemy.onBottleHit();
                        // Spiele Endboss-Hurt Sound ab
                        if (this.soundManager) {
                            this.soundManager.play('endbossHurt');
                        }
                    }
                }
            });
        });
    }

    checkBottleCollection() {
        this.level.collectableBottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle) && this.character.bottles < 10) {
                // Character sammelt Flasche ein
                this.level.collectableBottles.splice(index, 1); // Entferne Flasche aus Level
                this.character.bottles++; // Erhöhe Flaschenanzahl
                if (this.character.bottles > 10) {
                    this.character.bottles = 10; // Maximum 10 Flaschen
                }
                // Spiele Collect-Sound ab
                if (this.soundManager) {
                    this.soundManager.play('bottleCollect');
                }
            }
        });
    }

    checkCoinCollection() {
        this.level.collectableCoins.forEach((coin, index) => {
            if (this.character.isColliding(coin) && this.character.coins < 10) {
                // Character sammelt Münze ein
                this.level.collectableCoins.splice(index, 1); // Entferne Münze aus Level
                this.character.coins++; // Erhöhe Münzenanzahl
                // Spiele Collect-Sound ab
                if (this.soundManager) {
                    this.soundManager.play('coinCollect'); // Benutze gleichen Sound wie Flaschen
                }
            }
        });
    }

    checkThrowableObject() {
        if (this.keyboard.SPACE && this.throwInterval() && this.character.bottles > 0) {
            let bottle = new ThrowableObject(this.character);
            bottle.world = this; // Setze World-Referenz
            this.throwableObjects.push(bottle);
            this.character.bottles--; // Reduziere Flaschenanzahl
            this.lastThrow = new Date().getTime();

            // Spiele Throw-Sound ab
            if (this.soundManager) {
                this.soundManager.play('bottleThrow');
            }
        }
    }

    throwInterval() {
        let timeSinceLastThrow = new Date().getTime() - this.lastThrow;
        timeSinceLastThrow = timeSinceLastThrow / 1000;
        return timeSinceLastThrow > 1;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);

        this.ctx.translate(-this.camera_x, 0);
        this.addObjectsToMap(this.level.statusBars);
        this.addObjectsToMap(this.level.gameTimer);
        this.addObjectsToMap(this.level.levelDisplay);

        // Zeichne Settings-Button
        this.settingsButton.draw(this.ctx);

        // Debug-Info zeichnen (falls vorhanden)
        if (this.level.debugInfo && this.level.debugInfo.length > 0) {
            this.addObjectsToMap(this.level.debugInfo);
        }

        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.collectableBottles); // Zeichne sammelbare Flaschen
        this.addObjectsToMap(this.level.collectableCoins); // Zeichne sammelbare Coins
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);

        // Zeichne Settings-Overlay (falls sichtbar)
        this.settingsOverlay.draw(this.ctx);

        let self = this;
        requestAnimationFrame(() => self.draw());
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            // Objekte, die zum Löschen markiert sind, nicht zeichnen
            if (!o.markedForDeletion) {
                this.addToMap(o);
            }
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        // mo.drawFrame(this.ctx);
        // mo.drawCollisionFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = -mo.x;
    }

    flipImageBack(mo) {
        this.ctx.restore();
        mo.x = -mo.x;
    }

    setupCanvasListeners() {
        // Click-Event für Settings-Button und Overlay
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Prüfe zuerst Overlay-Buttons
            const action = this.settingsOverlay.handleClick(mouseX, mouseY);
            if (action === 'exit') {
                this.exitGame();
            } else if (action === 'restart') {
                startGame();
            } else if (action === 'resume') {
                this.resumeGame();
            } else if (!this.settingsOverlay.isVisible && this.settingsButton.isClicked(mouseX, mouseY)) {
                // Öffne Settings nur wenn Overlay nicht sichtbar ist
                this.pauseGame();
            }
        });

        // Mousemove-Event für Hover-Effekt
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Prüfe Overlay-Buttons zuerst
            const overlayHovered = this.settingsOverlay.handleHover(mouseX, mouseY);
            const buttonHovered = this.settingsButton.isHovering(mouseX, mouseY);

            if (overlayHovered || buttonHovered) {
                this.canvas.style.cursor = 'pointer';
            } else {
                this.canvas.style.cursor = 'default';
            }
        });
    }

    exitGame() {
        // Stoppe alle Game-Loops
        location.reload(); // Lädt die Seite neu und beendet das Spiel
    }

    restartGame() {
        // Starte das Spiel neu
        location.reload(); // Lädt die Seite neu und startet das Spiel von vorne
    }

    pauseGame() {
        console.log('[World] Pausing game...');

        // 1. Zeige Settings-Overlay
        this.settingsOverlay.show();

        // 2. Pausiere alle Intervals
        GlobalIntervalManager.pauseAll();

        // 3. Pausiere alle Sounds und starte menuTheme
        if (this.soundManager) {
            this.soundManager.pauseAllSounds();
            this.soundManager.playMusic('menuTheme');
        }

        console.log('[World] Game paused');
    }

    resumeGame() {
        console.log('[World] Resuming game...');

        // 1. Verstecke Settings-Overlay
        this.settingsOverlay.hide();

        // 2. Setze alle Intervals fort
        GlobalIntervalManager.resumeAll();

        // 3. Stoppe menuTheme und setze Spiel-Sounds fort
        if (this.soundManager) {
            this.soundManager.stopMusic('menuTheme');
            this.soundManager.resumeAllSounds();
        }

        console.log('[World] Game resumed');
    }

}
