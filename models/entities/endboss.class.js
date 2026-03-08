class Endboss extends MovableObjects {
    height = 400;
    width = this.height * 0.8;
    groundLevel = 450;
    y = this.groundLevel - this.height;
    startX;
    energy;
    hitBoxLeft = 40;
    hitBoxTop = 70;
    hitBoxRight = 40 + this.hitBoxLeft;
    hitBoxBottom = 15 + this.hitBoxTop;
    rightBoundary;
    maxX = levelEnd - this.width;

    // Bewegungs-Parameter
    movement = {
        speed: 0.5,              // Normale Patrol-Geschwindigkeit
        chasingSpeed: 3,         // Geschwindigkeit während Verfolgung
        patrolDistance: 300,       // Patrol-Reichweite
        movingRight: false        // Aktuelle Patrol-Richtung
    };

    // Ramm-Angriff Parameter
    ramming = {
        isActive: false,         // Ramm-Modus aktiv?
        direction: 1,            // 1 = rechts, -1 = links
        distance: 100,  // Wie weit nach Kollision weiterlaufen
        distanceTraveled: 0      // Wie weit bereits gelaufen
    };

    // Zustands-Flags
    state = {
        isChasing: false,              // Verfolgt den Character?
        hasPlayedAlert: false,         // Alert-Animation bereits gespielt?
        hasPlayedAttack: false,        // Attack-Animation bereits gespielt?
        hasPlayedDeath: false,         // Death-Animation bereits gespielt?
        isPlayingAlert: false,         // Alert-Animation läuft gerade?
        isPlayingAttack: false,        // Attack-Animation läuft gerade?
        isPlayingHurt: false,          // Hurt-Animation läuft gerade?
        isPlayingDeath: false          // Death-Animation läuft gerade?
    };

    /**
     * STOP RAMMING MODE
     * Beendet den Ramm-Angriff und setzt alle relevanten Zustände zurück
     * Wird aufgerufen wenn Ramming abgeschlossen ist oder Boundary erreicht wurde
     */
    stopRammingMode() {
        this.ramming.isActive = false;
        this.ramming.distanceTraveled = 0;
        this.otherDirection = !this.otherDirection;
        this.state.isChasing = this.canSeeCharacter();
        this.state.hasPlayedAlert = true;
        this.state.hasPlayedAttack = true;
    }

    // Image paths for the animation
    images = imagePaths.endboss;

    /**
     * CONSTRUCTOR
     * Wird beim Erstellen eines neuen Endboss-Objekts aufgerufen
     * 
     * ABLAUF:
     * 1. Ruft Parent-Constructor auf (MovableObjects)
     * 2. Lädt das erste Walk-Bild als Startbild
     * 3. Lädt alle Animations-Bilder in den Cache
     * 4. Startet die animate() Methode
     */
    constructor(endbossHP) {
        super();
        this.energy = endbossHP;
        this.startX = levelEnd - 700;
        this.x = this.startX;
        this.rightBoundary = Math.min(this.startX + this.movement.patrolDistance + this.width, levelEnd);
        this.loadImage(this.images.imagesWalk[0]);
        this.loadImages(this.images.imagesWalk);
        this.loadImages(this.images.imagesAlert);
        this.loadImages(this.images.imagesAttack);
        this.loadImages(this.images.imagesAttackRun);
        this.loadImages(this.images.imagesHurt);
        this.loadImages(this.images.imagesDead);
        this.animate();
    }

    /**
     * ANIMATE - Hauptmethode für Bewegung und Animation
     * Startet zwei getrennte Intervals:
     * 1. Movement-Interval (60 FPS) - Steuert die Bewegung des Endboss
     * 2. Animation-Interval (150ms) - Steuert welche Animation angezeigt wird
     * 
     * ACHTUNG: Diese Methode startet zwei permanente Intervals!
     */
    animate() {
        // ==================== MOVEMENT INTERVAL (60 FPS) ====================
        // Steuert die Bewegungslogik des Endboss
        const movementCallback = () => {
            // REGEL 1: Während Alert/Attack-Animation stillstehen
            if (this.state.isPlayingAlert || this.state.isPlayingAttack) {
                return;
            }

            // REGEL 2: RAMMING-MODUS (nach Kollision mit Character)
            if (this.ramming.isActive) {
                const newX = this.x + (this.movement.chasingSpeed * this.ramming.direction);

                if (newX >= levelStart && newX <= this.maxX) {
                    this.x = newX;
                    this.ramming.distanceTraveled += this.movement.chasingSpeed;
                } else {
                    this.stopRammingMode();
                    return;
                }

                if (this.ramming.distanceTraveled >= this.ramming.distance) {
                    this.stopRammingMode();
                }
                return;
            }

            // REGEL 3: CHASING-MODUS (Verfolge den Character)
            if (this.state.isChasing) {
                const character = this.world?.character;

                if (character.x > this.x) {
                    const newX = this.x + this.movement.chasingSpeed;
                    if (newX <= this.maxX) {
                        this.x = newX;
                    }
                    this.otherDirection = false;
                    this.ramming.direction = 1;
                } else {
                    const newX = this.x - this.movement.chasingSpeed;
                    if (newX >= levelStart) {
                        this.x = newX;
                    }
                    this.otherDirection = true;
                    this.ramming.direction = -1;
                }
                return;
            }

            // REGEL 4: PATROL-MODUS (Standard-Verhalten)
            if (this.movement.movingRight) {
                this.moveRight(false, this.movement.speed, this.rightBoundary);
                if (this.x + this.width >= this.rightBoundary) {
                    this.movement.movingRight = false;
                }
            } else {
                this.moveLeft(true, this.movement.speed, this.startX);
                if (this.x <= this.startX) {
                    this.movement.movingRight = true;
                }
            }
        };
        const movementInterval = setInterval(movementCallback, 1000 / 60);
        GlobalIntervalManager.register(movementInterval, 'Endboss movement', this, 1000 / 60, movementCallback);

        // ==================== ANIMATION INTERVAL (150ms) ====================
        const animationCallback = () => {
            if (this.isDead()) {
                this.handleDeathAnimation();
            }
            else if (this.state.isPlayingAlert) {
                // Alert-Animation läuft - keine neue Animation starten
            }
            else if (this.state.isPlayingAttack) {
                // Attack-Animation läuft - keine neue Animation starten
            }
            else if (!this.state.hasPlayedAlert && this.canSeeCharacter()) {
                this.handleAlertAnimation();
            }
            else if (!this.canSeeCharacter() && (this.state.hasPlayedAlert || this.state.hasPlayedAttack) && !this.ramming.isActive && !this.state.isChasing) {
                this.state.hasPlayedAlert = false;
                this.state.hasPlayedAttack = false;
                this.state.isChasing = false;
            }
            else if (this.isHurt()) {
                this.playAnimation(this.images.imagesHurt);
            }
            else if (this.state.isChasing || this.ramming.isActive) {
                this.playAnimation(this.images.imagesAttackRun);
            }
            else {
                this.playAnimation(this.images.imagesWalk);
                if (this.world && this.world.soundManager) {
                    this.world.soundManager.stopMusic('endbossAngry');
                }
            }
        };
        const animationInterval = setInterval(animationCallback, 150);
        GlobalIntervalManager.register(animationInterval, 'Endboss animation', this, 150, animationCallback);
    }

    /**
     * HANDLE DEATH ANIMATION
     * Startet die Tod-Animation wenn der Endboss stirbt (energy <= 0)
     * 
     * ABLAUF:
     * 1. Prüft ob Tod-Animation bereits läuft oder gespielt wurde
     * 2. Stoppt ALLE laufenden Intervals (Movement, Animation, Rotation)
     * 3. Stoppt alle laufenden Animationen (Alert, Attack)
     * 4. Startet Hurt-Animation gefolgt von Death-Animation
     */
    handleDeathAnimation() {
        // Verhindere mehrfache Ausführung
        if (this.state.hasPlayedDeath || this.state.isPlayingHurt || this.state.isPlayingDeath) {
            return;
        }

        // Markiere dass Tod-Sequenz gestartet wurde
        this.state.hasPlayedDeath = true;

        // Stoppe ALLE Intervals
        this.stopAllIntervals();

        // Stoppe Endboss-Angry Sound (Attack-Mode Sound)
        if (this.world && this.world.soundManager) {
            this.world.soundManager.stopMusic('endbossAngry');
        }

        // Stoppe alle State-Flags für laufende Animationen
        this.state.isPlayingAlert = false;
        this.state.isPlayingAttack = false;
        this.state.isChasing = false;
        this.ramming.isActive = false;

        // Starte Hurt → Death Sequenz
        this.playHurtAnimationOnce();
    }

    /**
     * STOP ALL INTERVALS
     * Stoppt alle laufenden Intervals des Endboss
     * Wird aufgerufen wenn der Endboss stirbt
     * 
     * Verwendet den GlobalIntervalManager um alle Intervals dieses Objekts zu stoppen
     */
    stopAllIntervals() {
        GlobalIntervalManager.clearByOwner(this);
    }

    /**
     * PLAY HURT ANIMATION ONCE
     * Spielt die Hurt-Animation ab, dann folgt die Death-Animation
     * Wird nur beim Tod aufgerufen
     */
    playHurtAnimationOnce() {
        this.state.isPlayingHurt = true;
        let frameIndex = 0;
        this.img = this.imageCache[this.images.imagesHurt[frameIndex]];

        const hurtCallback = () => {
            frameIndex++;
            if (frameIndex < this.images.imagesHurt.length) {
                this.img = this.imageCache[this.images.imagesHurt[frameIndex]];
            } else {
                GlobalIntervalManager.clear(hurtInterval, 'Endboss hurt');
                this.state.isPlayingHurt = false;
                this.playDeathAnimationOnce();
            }
        };
        const hurtInterval = setInterval(hurtCallback, 150);
        GlobalIntervalManager.register(hurtInterval, 'Endboss hurt animation', this, 150, hurtCallback);
    }

    /**
     * PLAY DEATH ANIMATION ONCE
     * Spielt die Tod-Animation ab OHNE Rotation
     * Wird nach Hurt-Animation aufgerufen
     */
    playDeathAnimationOnce() {
        this.state.isPlayingDeath = true;
        let frameIndex = 0;

        // Spiele Endboss-Death Sound ab
        if (this.world && this.world.soundManager) {
            this.world.soundManager.play('endbossDead');
        }

        this.img = this.imageCache[this.images.imagesDead[frameIndex]];

        const deathCallback = () => {
            frameIndex++;
            if (frameIndex < this.images.imagesDead.length) {
                this.img = this.imageCache[this.images.imagesDead[frameIndex]];
            } else {
                GlobalIntervalManager.clear(deathInterval, 'Endboss death');
                this.state.isPlayingDeath = false;
                showYouWonScreen(1000);
            }
        };
        const deathInterval = setInterval(deathCallback, 150);
        GlobalIntervalManager.register(deathInterval, 'Endboss death animation', this, 150, deathCallback);

    }

    /**
     * CAN SEE CHARACTER
     * Prüft ob der Endboss den Character sehen kann
     * 
     * BEDINGUNGEN:
     * 1. World und Character müssen existieren
     * 2. Character muss in BLICKRICHTUNG des Endboss sein (directional detection)
     * 3. Character muss innerhalb der Sichtweite sein (100px)
     * 
     * WICHTIG:
     * - distance > 0 bedeutet Character ist VOR dem Endboss
     * - distance < 0 bedeutet Character ist HINTER dem Endboss (nicht sichtbar!)
     * - Ermöglicht "Stealth" von hinten
     * 
     * @returns {boolean} true wenn Character sichtbar ist
     */
    canSeeCharacter() {
        const character = this.world?.character;
        let distance;

        if (!this.otherDirection) {
            // Endboss schaut nach rechts
            // Distanz = Character-Start minus Endboss-Ende
            distance = character.x - (this.x + this.width);
        } else {
            // Endboss schaut nach links
            // Distanz = Endboss-Start minus Character-Ende
            distance = (this.x) - (character.x + character.width);
        }

        // Nur sichtbar wenn: VOR dem Endboss (distance > 0) UND nah genug (< 100px)
        return distance > 0 && distance < 100;
    }

    /**
     * HANDLE ALERT ANIMATION
     * Wrapper-Methode die prüft ob Alert-Animation noch nicht gespielt wurde
     * Wird vom Animation-Interval aufgerufen
     * 
     * Startet die Alert-Animation nur einmal pro Kampf
     */
    handleAlertAnimation() {
        if (!this.state.hasPlayedAlert) {
            this.playAlertAnimationOnce();
        }
    }

    /**
     * PLAY ALERT ANIMATION ONCE
     * Spielt die Alert-Animation (Ausrufezeichen-Effekt) genau einmal ab
     * 
     * ABLAUF:
     * 1. Setze hasPlayedAlert = true (damit es nicht nochmal abgespielt wird)
     * 2. Setze isPlayingAlert = true (Movement-Interval stoppt Bewegung)
     * 3. Drehe Endboss zum Character
     * 4. Spiele alle Alert-Frames durch (8 Bilder)
     * 5. Nach Alert: Setze isPlayingAlert = false
     * 6. Starte SOFORT die Attack-Animation
     * 
     * WICHTIG: Nach Alert folgt IMMER Attack!
     */
    playAlertAnimationOnce() {
        this.state.hasPlayedAlert = true;
        this.state.isPlayingAlert = true;

        if (this.world && this.world.soundManager) {
            this.world.soundManager.playMusic('endbossAngry');
        }

        // Drehe Endboss in Richtung des Characters
        const character = this.world?.character;
        this.otherDirection = character.x < this.x;
        let frameIndex = 0;
        this.img = this.imageCache[this.images.imagesAlert[frameIndex]];

        const alertCallback = () => {
            frameIndex++;
            if (frameIndex < this.images.imagesAlert.length) {
                this.img = this.imageCache[this.images.imagesAlert[frameIndex]];
            } else {
                GlobalIntervalManager.clear(alertInterval, 'Endboss alert');
                this.state.isPlayingAlert = false;
                this.handleAttackAnimation();
            }
        };
        const alertInterval = setInterval(alertCallback, 150);
        GlobalIntervalManager.register(alertInterval, 'Endboss alert animation', this, 150, alertCallback);
    }

    /**
     * HANDLE ATTACK ANIMATION
     * Wrapper-Methode die prüft ob Attack-Animation noch nicht gespielt wurde
     * Wird von playAlertAnimationOnce() aufgerufen
     * 
     * Startet die Attack-Animation nur einmal pro Kampf
     */
    handleAttackAnimation() {
        if (!this.state.hasPlayedAttack) {
            this.playAttackAnimationOnce();
        }
    }

    /**
     * PLAY ATTACK ANIMATION ONCE
     * Spielt die Attack-Animation (Angriffs-Pose) genau einmal ab
     * 
     * ABLAUF:
     * 1. Setze hasPlayedAttack = true (damit es nicht nochmal abgespielt wird)
     * 2. Setze isPlayingAttack = true (Movement-Interval stoppt Bewegung)
     * 3. Spiele alle Attack-Frames durch (12 Bilder)
     * 4. Nach Attack: Setze isPlayingAttack = false
     * 5. Aktiviere CHASING-MODUS (isChasing = true)
     * 
     * WICHTIG: Nach Attack startet der Endboss die Verfolgung!
     * Ab hier verfolgt der Endboss den Character bis zur Kollision
     */
    playAttackAnimationOnce() {
        this.state.hasPlayedAttack = true;
        this.state.isPlayingAttack = true;
        let frameIndex = 0;

        // Spiele Endboss-Angry Sound im Loop ab (solange Attack-Mode aktiv ist)
        if (this.world && this.world.soundManager) {
            this.world.soundManager.playMusic('endbossAngry');
        }

        this.img = this.imageCache[this.images.imagesAttack[frameIndex]];

        const attackCallback = () => {
            frameIndex++;
            if (frameIndex < this.images.imagesAttack.length) {
                this.img = this.imageCache[this.images.imagesAttack[frameIndex]];
            } else {
                GlobalIntervalManager.clear(attackInterval, 'Endboss attack');
                this.state.isPlayingAttack = false;
                this.state.isChasing = true;
            }
        };
        const attackInterval = setInterval(attackCallback, 150);
        GlobalIntervalManager.register(attackInterval, 'Endboss attack animation', this, 150, attackCallback);
    }

    /**
     * ON CHARACTER COLLISION
     * Wird von World.checkCollisions() aufgerufen wenn Endboss mit Character kollidiert
     * 
     * ABLAUF:
     * 1. Prüft ob Endboss im Chasing-Modus ist
     * 2. Prüft ob nicht bereits im Ramming-Modus
     * 3. Aktiviert Ramming-Modus
     * 4. Setzt distanceTraveled zurück
     * 
     * WICHTIG:
     * - Wird NUR während Chasing aktiviert (nicht während Patrol)
     * - Startet den "Durchrennen"-Angriff
     * - Nach Ramming wird in animate() wieder isChasing = true gesetzt
     */
    onCharacterCollision() {
        if (this.state.isChasing && !this.ramming.isActive) {
            this.ramming.isActive = true;
            this.ramming.distanceTraveled = 0;
        }
    }

    /**
     * ON BOTTLE HIT
     * Wird aufgerufen wenn Endboss von einer Flasche getroffen wird
     * 
     * ABLAUF:
     * 1. Prüft ob Alert/Attack bereits läuft (dann nichts tun)
     * 2. Dreht Endboss zum Character
     * 3. Triggert Alert-Animation die dann zu Attack führt
     * 
     * WICHTIG:
     * - Funktioniert auch wenn Character außerhalb der Sichtweite ist
     * - Überschreibt Patrol-Modus
     * - Startet komplette Alert → Attack → Chase Sequenz
     */
    onBottleHit() {
        // Ignoriere wenn bereits in Alert/Attack/Chase Sequenz
        if (this.state.hasPlayedAlert || this.state.isPlayingAlert || this.state.isPlayingAttack) {
            return;
        }

        // Drehe Endboss in Richtung des Characters
        const character = this.world?.character;
        this.otherDirection = character.x > this.x;

        // Triggere Alert-Animation (führt dann zu Attack und Chase)
        this.state.hasPlayedAlert = false; // Reset für Neustart
        this.playAlertAnimationOnce();
    }
}

