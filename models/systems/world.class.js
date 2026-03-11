class World {
    character;
    level = currentLevel;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    throwableObjects = [];
    lastThrow;
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

        // Overlays sind jetzt HTML-basiert, keine Canvas-Overlays mehr nötig

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

        // Parallax-Hintergründe zeichnen - jeder Layer mit eigenem Faktor
        this.drawParallaxBackgrounds();

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);

        this.addObjectsToMap(this.level.statusBars);
        this.addObjectsToMap(this.level.gameTimer);
        this.addObjectsToMap(this.level.levelDisplay);

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

        // Overlays sind jetzt HTML-basiert und werden nicht mehr auf dem Canvas gezeichnet

        let self = this;
        requestAnimationFrame(() => self.draw());
    }

    /**
     * Zeichnet Hintergrund-Layer mit Parallax-Effekt
     * Jeder Layer bewegt sich mit unterschiedlicher Geschwindigkeit basierend auf seinem parallaxFactor
     */
    drawParallaxBackgrounds() {
        // Gruppiere nach Faktor
        const factorGroups = {};
        this.level.backgroundObjects.forEach(bg => {
            if (!factorGroups[bg.parallaxFactor]) {
                factorGroups[bg.parallaxFactor] = [];
            }
            factorGroups[bg.parallaxFactor].push(bg);
        });

        // Sortiere Faktoren aufsteigend (von hinten nach vorne: 0, 0.2, 0.5, 1)
        const sortedFactors = Object.keys(factorGroups)
            .map(f => parseFloat(f))
            .sort((a, b) => a - b);

        // Zeichne jede Gruppe mit ihrem Parallax-Offset (von hinten nach vorne)
        sortedFactors.forEach(factor => {
            const parallaxOffset = this.camera_x * factor;
            this.ctx.translate(parallaxOffset, 0);
            this.addObjectsToMap(factorGroups[factor]);
            this.ctx.translate(-parallaxOffset, 0);
        });
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
        // Enemies haben umgekehrte Logik für otherDirection
        const isEnemy = mo instanceof Chicken || mo instanceof ChickenSmall || mo instanceof Endboss;
        const shouldFlip = isEnemy ? !mo.otherDirection : mo.otherDirection;

        if (shouldFlip) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        // mo.drawFrame(this.ctx);
        // mo.drawCollisionFrame(this.ctx);

        if (shouldFlip) {
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
            const coords = this.getCanvasCoordinates(e.clientX, e.clientY);
            this.handleCanvasClick(coords.x, coords.y);
        });

        // Touch-Event für mobile Geräte
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const touch = e.touches[0];
            const coords = this.getCanvasCoordinates(touch.clientX, touch.clientY);
            this.handleCanvasClick(coords.x, coords.y);
        }, { passive: false });

        // Touchend-Event hinzufügen für bessere Kompatibilität
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, { passive: false });

        // Mousemove-Event für Hover-Effekt
        this.canvas.addEventListener('mousemove', (e) => {
            const coords = this.getCanvasCoordinates(e.clientX, e.clientY);
            this.handleCanvasHover(coords.x, coords.y);
        });

        // Touch-Move für Hover-Effekt auf Mobile
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const coords = this.getCanvasCoordinates(touch.clientX, touch.clientY);
            this.handleCanvasHover(coords.x, coords.y);
        }, { passive: false });
    }

    /**
     * Konvertiert Screen-Koordinaten zu Canvas-Koordinaten
     * Berücksichtigt CSS-Scaling und Canvas-Resolution
     * @param {number} clientX - X-Position auf dem Screen
     * @param {number} clientY - Y-Position auf dem Screen
     * @returns {Object} - {x, y} Canvas-Koordinaten
     */
    getCanvasCoordinates(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();

        // Berechne die relative Position im Canvas (0-1)
        const relativeX = (clientX - rect.left) / rect.width;
        const relativeY = (clientY - rect.top) / rect.height;

        // Konvertiere zu Canvas-Koordinaten
        return {
            x: relativeX * this.canvas.width,
            y: relativeY * this.canvas.height
        };
    }

    /**
     * Behandelt Klick-Events auf dem Canvas (für Mouse und Touch)
     * @param {number} x - X-Position des Klicks
     * @param {number} y - Y-Position des Klicks
     */
    handleCanvasClick(x, y) {
        // Overlays sind jetzt HTML-basiert, keine Canvas-Klick-Handler mehr nötig
    }

    /**
     * Behandelt Hover-Events auf dem Canvas (für Mouse und Touch)
     * @param {number} x - X-Position
     * @param {number} y - Y-Position
     */
    handleCanvasHover(x, y) {
        // Overlays sind jetzt HTML-basiert, keine Canvas-Hover-Handler mehr nötig
        this.canvas.style.cursor = 'default';
    }

    pauseGame() {
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
    }

    resumeGame() {
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

        // 3. Pausiere den GameTimer
        if (this.level.gameTimer && this.level.gameTimer[0]) {
            this.level.gameTimer[0].pause();
        }

        // 4. Stoppe alle Character-spezifischen Sounds
        if (this.character) {
            // Verhindere dass Character einschläft und Sleep-Sound spielt
            this.character.isSleeping = false;
            this.character.isIdle = false;
            if (this.character.sleepTimer) {
                GlobalIntervalManager.clearTimeout(this.character.sleepTimer, 'Character sleep timer');
            }
        }

        // 5. Stoppe nur Sound-Effekte, NICHT die Musik
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
        }
    }

}
