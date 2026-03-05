class World {
    character;
    level = currentLevel;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    throwableObjects = [];
    lastThrow;
    settingsButton;
    settingsOverlay;
    victoryOverlay;
    defeatOverlay;
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
        this.settingsOverlay = new SettingsOverlay();
        this.victoryOverlay = new VictoryOverlay();
        this.defeatOverlay = new DefeatOverlay();

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

                        // Bounce-Effekt für den Character nach Kollision mit Endboss
                        this.bounceFromEndboss(this.character, enemy);
                    }
                }
            }
        });
    }

    isJumpingOnEnemy(character, enemy) {
        // Charakter Positionen
        const characterBottom = character.y + character.height - character.hitBoxBottom;

        const enemyTop = enemy.y + enemy.hitBoxTop + 30;
        const enemyMiddle = enemy.y + (enemy.height / 2);

        const isFalling = character.speedY < 0;
        const isAboveEnemyTop = characterBottom < enemyMiddle; // Untere Hälfte des Gegners

        return isFalling && isAboveEnemyTop;
    }

    /**
     * Gibt dem Character einen Bounce-Effekt nach Kollision mit dem Endboss
     * @param {Character} character - Der Character, der den Bounce-Effekt bekommt
     * @param {Endboss} enemy - Der Endboss, mit dem kollidiert wurde
     */
    bounceFromEndboss(character, enemy) {
        character.jump();

        // Bestimme Richtung für horizontalen Bounce basierend auf Position des Endboss
        let bounceDirection;
        if ((character.x + character.width) / 2 < (enemy.x + enemy.width) / 2) {
            // Character ist links vom Endboss, bewege nach links (weg vom Endboss)
            bounceDirection = 'left';
        } else {
            // Character ist rechts vom Endboss, bewege nach rechts (weg vom Endboss)
            bounceDirection = 'right';
        };

        // Setze Flag, um zu kennzeichnen, dass der Character sich im Bounce-Zustand befindet
        character.isBouncing = true;

        // Callback-Funktion für das Bounce-Intervall
        const bounceCallback = () => {
            if (!character.isAboveGround(character.groundLevel)) {
                // Wenn Character wieder am Boden ist, stoppe das Intervall
                GlobalIntervalManager.clear(bounceIntervalId, 'Character bounce effect');
                character.isBouncing = false;
            } else {
                // Solange der Character in der Luft ist, bewege ihn in die richtige Richtung
                if (bounceDirection === 'left') {
                    character.moveLeft(false);
                } else {
                    character.moveRight(true);
                }
            }
        };

        // Starte Intervall, das den Character solange bewegt, wie er in der Luft ist
        const bounceIntervalId = setInterval(bounceCallback, 1000 / 60); // 60 FPS, gleiche Frequenz wie die Bewegungs-Intervalle
        GlobalIntervalManager.register(bounceIntervalId, 'Character bounce effect', this, 1000 / 60, bounceCallback);
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

        // Zeichne Victory-Overlay (falls sichtbar)
        this.victoryOverlay.draw(this.ctx);
        this.defeatOverlay.draw(this.ctx);

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

            // Prüfe zuerst Victory-Overlay (höchste Priorität)
            const victoryAction = this.victoryOverlay.handleClick(mouseX, mouseY);
            if (victoryAction === 'mainMenu') {
                mainScreen();
                window.soundManager.playMusic('menuTheme');
                return;
            } else if (victoryAction === 'nextLevel') {
                // Aktualisiere globale Level-Variablen
                currentLevelNumber++;

                // Starte das nächste Level
                startGame(currentLevelNumber);
                return;
            }

            // Prüfe Defeat-Overlay
            const defeatAction = this.defeatOverlay.handleClick(mouseX, mouseY);
            if (defeatAction === 'mainMenu') {
                mainScreen();
                window.soundManager.playMusic('menuTheme');
                return;
            } else if (defeatAction === 'tryAgain') {
                startGame();
                return;
            }

            // Prüfe Settings-Overlay-Buttons
            const action = this.settingsOverlay.handleClick(mouseX, mouseY);
            if (action === 'exit') {
                mainScreen();
                window.soundManager.playMusic('menuTheme');
            } else if (action === 'restart') {
                startGame();
            } else if (action === 'resume') {
                this.resumeGame();
            } else if (action === 'toggleSound') {
                this.toggleSound();
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

            // Prüfe Victory-Overlay-Buttons zuerst
            const victoryHovered = this.victoryOverlay.handleHover(mouseX, mouseY);
            const defeatHovered = this.defeatOverlay.handleHover(mouseX, mouseY);
            // Prüfe Settings-Overlay-Buttons
            const overlayHovered = this.settingsOverlay.handleHover(mouseX, mouseY);
            const buttonHovered = this.settingsButton.isHovering(mouseX, mouseY);

            if (victoryHovered || defeatHovered || overlayHovered || buttonHovered) {
                this.canvas.style.cursor = 'pointer';
            } else {
                this.canvas.style.cursor = 'default';
            }
        });
    }

    pauseGame() {
        console.log('[World] Pausing game...');

        // 1. Zeige Settings-Overlay
        this.settingsOverlay.show();

        // 2. Pausiere alle Intervals
        GlobalIntervalManager.pauseAll();

        // 3. Pausiere den GameTimer
        if (this.level.gameTimer && this.level.gameTimer[0]) {
            this.level.gameTimer[0].pause();
        }

        // 4. Pausiere alle Sounds und starte menuTheme
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

        // 3. Setze den GameTimer fort
        if (this.level.gameTimer && this.level.gameTimer[0]) {
            this.level.gameTimer[0].resume();
        }

        // 4. Stoppe menuTheme und setze Spiel-Sounds fort
        if (this.soundManager) {
            this.soundManager.stopMusic('menuTheme');
            this.soundManager.resumeAllSounds();
            this.soundManager.playMusic('gameTheme');
        }

        console.log('[World] Game resumed');
    }

    stopGame() {
        // 1. Stoppe ALLE Intervals permanent
        GlobalIntervalManager.clearAll();

        // 2. Deaktiviere Keyboard-Inputs
        if (this.keyboard) {
            Object.keys(this.keyboard).forEach(key => {
                this.keyboard[key] = false;
            });
        }

        // 3. Stoppe alle Character-spezifischen Sounds
        if (this.character) {
            // Verhindere dass Character einschläft und Sleep-Sound spielt
            this.character.isSleeping = false;
            this.character.isIdle = false;
            if (this.character.sleepTimer) {
                GlobalIntervalManager.clearTimeout(this.character.sleepTimer, 'Character sleep timer');
            }
        }

        // 4. Stoppe nur Sound-Effekte, NICHT die Musik
        if (this.soundManager) {
            // Stoppe alle Sound-Effekte, aber ändere nicht den muted-Status
            this.soundManager.stopAllSounds();
        }

        // console.log('[World] Game stopped');
    }

    /**
     * Toggelt den Sound-Status (Mute/Unmute) und aktualisiert den Button-Text
     */
    toggleSound() {
        if (this.soundManager) {
            if (this.soundManager.muted) {
                this.soundManager.unmuteAll();
                // Wenn im Pause-Menü, spiele menuTheme
                this.soundManager.playMusic('menuTheme');
            } else {
                this.soundManager.muteAll();
            }
            // Aktualisiere den Button-Text im Overlay
            this.settingsOverlay.updateSoundButtonText();
        }
    }

}
