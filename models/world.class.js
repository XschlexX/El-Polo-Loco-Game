class World {

    character = new Character(keyboard);
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    throwableObjects = [];
    lastThrow;


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.lastThrow = new Date().getTime();
        window.world = this;

        this.draw();
        this.setWorld();
        this.run();
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
                // Prüfe ob Character von oben auf das Huhn springt
                if (this.isJumpingOnEnemy(this.character, enemy)) {
                    // Character springt auf Gegner - Gegner stirbt
                    enemy.hit();
                    this.character.jump(4); // Kleiner Bounce-Effekt
                } else if (!this.character.isHurt()) {
                    // Normale Kollision von der Seite - Character nimmt Schaden
                    this.character.hit();
                    this.character.resetSleepTimer(); // Sleep-Timer zurücksetzen wenn getroffen

                    // Wenn es ein Endboss ist, aktiviere Ramming-Modus (nur wenn nicht bereits ramming)
                    if (enemy instanceof Endboss && enemy.onCharacterCollision && !enemy.ramming.isActive) {
                        enemy.onCharacterCollision();
                    }
                }
            }
        });
    }

    isJumpingOnEnemy(character, enemy) {
        // Prüfe ob Character von oben kommt (fällt), über dem Gegner ist UND in der Luft ist
        return character.speedY < 0 &&
            character.isAboveGround(character.groundLevel) &&
            character.y + character.height - character.rectOffsetBottom < enemy.y + enemy.rectOffsetTop + 20;
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

}
