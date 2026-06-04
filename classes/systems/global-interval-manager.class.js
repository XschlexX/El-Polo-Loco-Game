/**
 * Centralized system to track all active intervals and timeouts in the game.
 * Supports registration, clearing, pause/resume, and live statistics.
 */
class GlobalIntervalManager {
    /** @type {Object.<number, Object>} Map of all registered intervals */
    static intervals = {};
    /** @type {Object.<number, Object>} Map of all registered timeouts */
    static timeouts = {};
    /** @type {number} Counter for unique interval registration IDs */
    static intervalCounter = 0;
    /** @type {number} Counter for unique timeout registration IDs */
    static timeoutCounter = 0;
    /** @type {boolean} Global pause state */
    static isPaused = false;
    /** @type {Array} Stored paused interval data for resume */
    static pausedIntervals = [];
    /** @type {Array} Stored paused timeout data for resume */
    static pausedTimeouts = [];
    /** @type {number} Timestamp when pause started */
    static pauseStartTime = 0;

    /**
     * Registers a setInterval call with tracking information.
     * @param {number} intervalId - The ID returned from setInterval
     * @param {string} name - Descriptive name for the interval
     * @param {Object} owner - The object that created the interval
     * @param {number} delay - The interval delay in milliseconds
     * @param {Function} [callback] - The callback function for pause/resume
     * @returns {number} The registered interval ID
     */
    static register(intervalId, name, owner, delay, callback = null) {
        this.intervalCounter++;
        const registrationId = this.intervalCounter;

        this.intervals[registrationId] = {
            id: registrationId,
            intervalId: intervalId,
            name: name,
            owner: owner?.constructor?.name || 'Unknown',
            ownerRef: owner,
            delay: delay,
            callback: callback,
            createdAt: new Date().toLocaleTimeString(),
            isActive: true
        };

        return intervalId;
    }

    /**
     * Registers a setTimeout call with tracking information.
     * @param {number} timeoutId - The ID returned from setTimeout
     * @param {string} name - Descriptive name for the timeout
     * @param {Object} owner - The object that created the timeout
     * @param {number} delay - The timeout delay in milliseconds
     * @param {Function} callback - The callback function for pause/resume
     * @returns {number} The registered timeout ID
     */
    static registerTimeout(timeoutId, name, owner, delay, callback) {
        this.timeoutCounter++;
        const registrationId = this.timeoutCounter;

        this.timeouts[registrationId] = {
            id: registrationId,
            timeoutId: timeoutId,
            name: name,
            owner: owner?.constructor?.name || 'Unknown',
            ownerRef: owner,
            delay: delay,
            callback: callback,
            createdAt: new Date().toLocaleTimeString(),
            startTime: Date.now(),
            isActive: true
        };

        return timeoutId;
    }

    /**
     * Stops a tracked timeout and marks it as inactive.
     * @param {number} timeoutId - The timeout ID to clear
     * @param {string} [name] - Optional name for logging
     */
    static clearTimeout(timeoutId, name = '') {
        for (const key in this.timeouts) {
            if (this.timeouts[key].timeoutId === timeoutId) {
                clearTimeout(timeoutId);
                this.timeouts[key].isActive = false;
                this.timeouts[key].clearedAt = new Date().toLocaleTimeString();
                return;
            }
        }
        clearTimeout(timeoutId);
    }

    /**
     * Stops a tracked interval and marks it as inactive.
     * @param {number} intervalId - The interval ID to clear
     * @param {string} [name] - Optional name for logging
     */
    static clear(intervalId, name = '') {
        for (const key in this.intervals) {
            if (this.intervals[key].intervalId === intervalId) {
                clearInterval(intervalId);
                this.intervals[key].isActive = false;
                this.intervals[key].clearedAt = new Date().toLocaleTimeString();
                return;
            }
        }
        clearInterval(intervalId);
    }

    /**
     * Stops all intervals and timeouts, including paused ones.
     */
    static clearAll() {
        this.clearAllIntervals();
        this.clearAllTimeouts();
        this.isPaused = false;
        this.pausedIntervals = [];
        this.pausedTimeouts = [];
    }

    /** Clears all registered intervals */
    static clearAllIntervals() {
        for (const key in this.intervals) {
            const interval = this.intervals[key];
            if (interval.isActive || interval.intervalId) {
                clearInterval(interval.intervalId);
                interval.isActive = false;
            }
        }
    }

    /** Clears all registered timeouts */
    static clearAllTimeouts() {
        for (const key in this.timeouts) {
            const timeout = this.timeouts[key];
            if (timeout.isActive || timeout.timeoutId) {
                clearTimeout(timeout.timeoutId);
                timeout.isActive = false;
            }
        }
    }

    /**
     * Stops all intervals belonging to a specific owner object.
     * @param {Object} owner - The owner object whose intervals should be cleared
     */
    static clearByOwner(owner) {
        const ownerName = owner?.constructor?.name || 'Unknown';
        let clearedCount = 0;

        for (const key in this.intervals) {
            if (this.intervals[key].ownerRef === owner && this.intervals[key].isActive) {
                clearInterval(this.intervals[key].intervalId);
                this.intervals[key].isActive = false;
                clearedCount++;
            }
        }
    }

    /**
     * Returns an array of currently active intervals.
     * @returns {Array} Active interval registrations
     */
    static getActive() {
        return Object.values(this.intervals).filter(interval => interval.isActive);
    }

    /**
     * Returns statistics about interval usage.
     * @returns {Object} Statistics including total active, total registered, and breakdown by owner
     */
    static getStats() {
        const active = this.getActive();
        const allIntervals = Object.values(this.intervals);
        const byOwner = {};

        active.forEach(interval => {
            if (!byOwner[interval.owner]) {
                byOwner[interval.owner] = 0;
            }
            byOwner[interval.owner]++;
        });

        return {
            totalActive: active.length,
            totalRegistered: allIntervals.length,
            byOwner: byOwner,
            intervals: active
        };
    }

    /**
     * Pauses all active intervals and timeouts by clearing them and storing their data.
     */
    static pauseAll() {
        if (this.isPaused) return;
        this.pauseStartTime = Date.now();
        this.pausedIntervals = [];
        this.pausedTimeouts = [];
        this.pauseAllIntervals();
        this.pauseAllTimeouts();
        this.isPaused = true;
    }

    /** Pauses all active intervals */
    static pauseAllIntervals() {
        for (const key in this.intervals) {
            const interval = this.intervals[key];
            if (interval.isActive) {
                this.pausedIntervals.push({ key, name: interval.name, owner: interval.ownerRef, delay: interval.delay, callback: interval.callback });
                clearInterval(interval.intervalId);
                interval.isActive = false;
            }
        }
    }

    /** Pauses all active timeouts, storing remaining delay */
    static pauseAllTimeouts() {
        for (const key in this.timeouts) {
            const timeout = this.timeouts[key];
            if (timeout.isActive) {
                const remaining = Math.max(0, timeout.delay - (Date.now() - timeout.startTime));
                this.pausedTimeouts.push({ key, name: timeout.name, owner: timeout.ownerRef, remainingDelay: remaining, callback: timeout.callback });
                clearTimeout(timeout.timeoutId);
                timeout.isActive = false;
            }
        }
    }

    /**
     * Resumes all paused intervals and timeouts by recreating them.
     */
    static resumeAll() {
        if (!this.isPaused) return;
        this.resumeAllIntervals();
        this.resumeAllTimeouts();
        this.pausedIntervals = [];
        this.pausedTimeouts = [];
        this.isPaused = false;
    }

    /** Resumes all paused intervals */
    static resumeAllIntervals() {
        this.pausedIntervals.forEach(paused => {
            const interval = this.intervals[paused.key];
            if (interval?.callback) {
                interval.intervalId = setInterval(interval.callback, paused.delay);
                interval.isActive = true;
            }
        });
    }

    /** Resumes all paused timeouts */
    static resumeAllTimeouts() {
        this.pausedTimeouts.forEach(paused => {
            const timeout = this.timeouts[paused.key];
            if (timeout?.callback) {
                timeout.timeoutId = setTimeout(timeout.callback, paused.remainingDelay);
                timeout.startTime = Date.now();
                timeout.delay = paused.remainingDelay;
                timeout.isActive = true;
            }
        });
    }

    /**
     * Prints a formatted status report of all intervals to the console.
     */
    static printStatus() {
        const stats = this.getStats();

        for (const owner in stats.byOwner) {
        }

        stats.intervals.forEach((interval, index) => {
        });
    }
}

window.intervalManager = GlobalIntervalManager;
