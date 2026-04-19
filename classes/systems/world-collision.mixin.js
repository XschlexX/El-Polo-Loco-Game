/**
 * World Collision Mixin
 * Provides collision detection and handling methods for the World class
 * @mixin
 */
const WorldCollisionMixin = {

    /** Checks collisions between character and enemies */
    checkCollisions() {
        const collidingEnemies = [];
        const jumpAttackEnemies = [];
        this.collectCollisions(collidingEnemies, jumpAttackEnemies);
        this.processCollisions(collidingEnemies, jumpAttackEnemies);
    },

    /**
     * Collects all collisions in this frame
     * @param {Array} collidingEnemies - Array to store colliding enemies
     * @param {Array} jumpAttackEnemies - Array to store jump attack enemies
     */
    collectCollisions(collidingEnemies, jumpAttackEnemies) {
        this.level.enemies.forEach(enemy => {
            if (this.shouldSkipEnemy(enemy)) return;
            if (this.character.isColliding(enemy)) {
                collidingEnemies.push(enemy);
                if (this.isJumpAttack(enemy)) {
                    jumpAttackEnemies.push(enemy);
                }
            }
        });
    },

    /**
     * Checks if enemy should be skipped in collision detection
     * @param {Enemy} enemy - The enemy to check
     * @returns {boolean} True if enemy should be skipped
     */
    shouldSkipEnemy(enemy) {
        if (enemy.isDying || enemy.isDead()) return true;
        if (enemy instanceof Endboss && enemy.ramming.isActive) return true;
        return false;
    },

    /**
     * Checks if character is performing a jump attack on enemy
     * @param {Enemy} enemy - The enemy to check
     * @returns {boolean} True if jump attack
     */
    isJumpAttack(enemy) {
        return !(enemy instanceof Endboss) && this.isJumpingOnEnemy(this.character, enemy);
    },

    /**
     * Processes collected collisions
     * @param {Array} collidingEnemies - Array of colliding enemies
     * @param {Array} jumpAttackEnemies - Array of jump attack enemies
     */
    processCollisions(collidingEnemies, jumpAttackEnemies) {
        if (jumpAttackEnemies.length > 0) {
            this.executeJumpAttack(jumpAttackEnemies);
        } else if (collidingEnemies.length > 0 && !this.character.isHurt()) {
            this.handleNormalCollision(collidingEnemies);
        }
    },

    /**
     * Executes jump attack on enemies
     * @param {Array} enemies - Enemies to hit
     */
    executeJumpAttack(enemies) {
        enemies.forEach(enemy => enemy.hit());
        this.character.jump(4);
    },

    /**
     * Handles normal collision from the side
     * @param {Array} enemies - Colliding enemies
     */
    handleNormalCollision(enemies) {
        this.character.hit();
        this.character.resetSleepTimer();
        this.handleEndbossCollision(enemies);
    },

    /**
     * Handles endboss collision for ramming mode
     * @param {Array} enemies - Colliding enemies
     */
    handleEndbossCollision(enemies) {
        const endboss = enemies.find(e => e instanceof Endboss);
        if (endboss && endboss.onCharacterCollision && !endboss.ramming.isActive) {
            endboss.onCharacterCollision();
            this.bounceFromEndboss(this.character, endboss);
        }
    },

    /**
     * Checks if character is jumping on enemy
     * @param {Character} character - The character
     * @param {Enemy} enemy - The enemy
     * @returns {boolean} True if jumping on enemy
     */
    isJumpingOnEnemy(character, enemy) {
        const characterBottom = character.y + character.height - character.hitBoxBottom;
        const enemyTop = enemy.y + enemy.hitBoxTop;
        const isFalling = character.speedY < 0;
        const isAboveEnemy = characterBottom < enemyTop + 40;
        return isFalling && isAboveEnemy;
    },

    /**
     * Gives character bounce effect after endboss collision
     * @param {Character} character - The character
     * @param {Endboss} enemy - The endboss
     */
    bounceFromEndboss(character, enemy) {
        character.jump();
        const direction = this.getBounceDirection(character, enemy);
        character.isBouncing = true;
        this.startBounceInterval(character, direction);
    },

    /**
     * Gets bounce direction based on positions
     * @param {Character} character - The character
     * @param {Endboss} enemy - The endboss
     * @returns {string} 'left' or 'right'
     */
    getBounceDirection(character, enemy) {
        const charCenter = (character.x + character.width) / 2;
        const enemyCenter = (enemy.x + enemy.width) / 2;
        return charCenter < enemyCenter ? 'left' : 'right';
    },

    /**
     * Starts bounce interval for character
     * @param {Character} character - The character
     * @param {string} direction - Bounce direction
     */
    startBounceInterval(character, direction) {
        const callback = () => this.handleBounceFrame(character, direction);
        character.bounceIntervalId = setInterval(callback, 1000 / 60);
        GlobalIntervalManager.register(character.bounceIntervalId, 'Character bounce effect', this, 1000 / 60, callback);
    },

    /**
     * Handles single bounce frame
     * @param {Character} character - The character
     * @param {string} direction - Bounce direction
     */
    handleBounceFrame(character, direction) {
        if (!character.isAboveGround(character.groundLevel)) {
            GlobalIntervalManager.clear(character.bounceIntervalId, 'Character bounce effect');
            character.isBouncing = false;
        } else {
            this.moveBounceCharacter(character, direction);
        }
    },

    /**
     * Moves character during bounce
     * @param {Character} character - The character
     * @param {string} direction - Bounce direction
     */
    moveBounceCharacter(character, direction) {
        if (direction === 'left') {
            character.moveLeft(false);
        } else {
            character.moveRight(true);
        }
    },

    /** Checks bottle collisions with enemies */
    checkBottleCollisions() {
        this.throwableObjects.forEach(bottle => {
            this.level.enemies.forEach(enemy => {
                if (this.shouldSkipEnemy(enemy)) return;
                if (bottle.isColliding(enemy) && !bottle.hasSplashed) {
                    this.handleBottleHit(bottle, enemy);
                }
            });
        });
    },

    /**
     * Handles bottle hit on enemy
     * @param {ThrowableObject} bottle - The bottle
     * @param {Enemy} enemy - The enemy
     */
    handleBottleHit(bottle, enemy) {
        bottle.splash();
        enemy.hit();
        if (enemy instanceof Endboss && enemy.onBottleHit) {
            enemy.onBottleHit();
            this.playEndbossHurtSound();
        }
    },

    /** Plays endboss hurt sound */
    playEndbossHurtSound() {
        if (this.soundManager) {
            this.soundManager.play('endbossHurt');
        }
    },

    /** Checks bottle collection by character */
    checkBottleCollection() {
        this.level.collectableBottles.forEach((bottle, index) => {
            if (this.canCollectBottle(bottle)) {
                this.collectBottle(index);
            }
        });
    },

    /**
     * Checks if character can collect bottle
     * @param {CollectableBottle} bottle - The bottle
     * @returns {boolean} True if can collect
     */
    canCollectBottle(bottle) {
        return this.character.isColliding(bottle) && this.character.bottles < 10;
    },

    /**
     * Collects bottle at index
     * @param {number} index - Index of bottle
     */
    collectBottle(index) {
        this.level.collectableBottles.splice(index, 1);
        this.character.bottles++;
        if (this.character.bottles > 10) {
            this.character.bottles = 10;
        }
        this.playBottleCollectSound();
    },

    /** Plays bottle collect sound */
    playBottleCollectSound() {
        if (this.soundManager) {
            this.soundManager.play('bottleCollect');
        }
    },

    /** Checks coin collection by character */
    checkCoinCollection() {
        this.level.collectableCoins.forEach((coin, index) => {
            if (this.canCollectCoin(coin)) {
                this.collectCoin(index);
            }
        });
    },

    /**
     * Checks if character can collect coin
     * @param {CollectableCoin} coin - The coin
     * @returns {boolean} True if can collect
     */
    canCollectCoin(coin) {
        return this.character.isColliding(coin) && this.character.coins < 10;
    },

    /**
     * Collects coin at index
     * @param {number} index - Index of coin
     */
    collectCoin(index) {
        this.level.collectableCoins.splice(index, 1);
        this.character.coins++;
        this.playCoinCollectSound();
    },

    /** Plays coin collect sound */
    playCoinCollectSound() {
        if (this.soundManager) {
            this.soundManager.play('coinCollect');
        }
    }

};
