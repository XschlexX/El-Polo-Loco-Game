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
        this.run();
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



    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowableObject();
            this.checkBottleCollection(); // Prüfe ob Character Flaschen einsammelt
        }, 200);

        // Häufigere Prüfung der Flaschen-Kollisionen für bessere Treffergenauigkeit
        setInterval(() => {
            this.checkBottleCollisions();
        }, 50);
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
                // Prüfe zuerst, ob der Charakter von oben auf den Gegner springt
                const isJumpingOnEnemy = this.isJumpingOnEnemy(this.character, enemy);

                if (isJumpingOnEnemy) {
                    // Character springt auf Gegner - Gegner stirbt
                    enemy.hit();
                    // Kleiner Bounce-Effekt
                    this.character.jump(4);
                }
                // Nur Schaden nehmen, wenn es KEIN Sprung von oben war
                else if (!this.character.isHurt() && !isJumpingOnEnemy) {
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
        const characterBottom = character.y + character.height - character.rectOffsetBottom;
        const characterFeetY = character.y + character.height;

        // Gegner Positionen
        const enemyTop = enemy.y + enemy.rectOffsetTop;
        const enemyBottom = enemy.y + enemy.height - enemy.rectOffsetBottom;
        const enemyMiddle = enemy.y + (enemy.height / 2);

        // Prüfe ob:
        // 1. Character fällt (speedY > 0)
        // 2. Character's Füße sind über der Oberkante des Gegners
        // 3. Character's Füße sind unterhalb der Mitte des Gegners
        // 4. Character ist horizontal über dem Gegner
        const isFalling = character.speedY > 0;
        const isAboveEnemyTop = characterBottom < enemyMiddle; // Untere Hälfte des Gegners
        const isNotTooFarAbove = characterBottom > enemyTop - 30; // Etwas mehr Toleranz nach oben
        const isHorizontallyAligned =
            (character.x + character.width - character.rectOffsetRight) > enemy.x &&
            character.x < (enemy.x + enemy.width - enemy.rectOffsetRight);

        return isFalling && isAboveEnemyTop && isNotTooFarAbove && isHorizontallyAligned;
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
        mo.drawCollisionFrame(this.ctx);

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
                this.settingsOverlay.hide();
                // Stoppe Menu-Musik und setze Game-Musik fort
                if (this.soundManager) {
                    this.soundManager.stopMusic('menuTheme');
                    this.soundManager.resumeMusic('gameTheme');  // ← Resume statt play!
                }
            } else if (!this.settingsOverlay.isVisible && this.settingsButton.isClicked(mouseX, mouseY)) {
                // Öffne Settings nur wenn Overlay nicht sichtbar ist
                this.settingsOverlay.show();
                // Pausiere Game-Musik und starte Menu-Musik
                if (this.soundManager) {
                    this.soundManager.pauseMusic('gameTheme');  // ← Pause statt stop!
                    this.soundManager.playMusic('menuTheme');
                }
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

}
