/**
 * GLOBAL INTERVAL MANAGER
 * Centralized system to track all active intervals and timeouts in the game
 * 
 * FEATURES:
 * - Register intervals/timeouts with descriptive names
 * - Track interval/timeout ownership (which object created them)
 * - Clear intervals/timeouts individually or by category
 * - Pause and resume all intervals/timeouts
 * - Get live statistics about active intervals/timeouts
 * - Access intervals/timeouts via console for debugging
 */
class GlobalIntervalManager {
    static intervals = {}; // Map of all intervals
    static timeouts = {}; // Map of all timeouts
    static intervalCounter = 0; // Counter for unique IDs
    static timeoutCounter = 0; // Counter for unique timeout IDs
    static isPaused = false; // Global pause state
    static pausedIntervals = []; // Store paused interval data
    static pausedTimeouts = []; // Store paused timeout data
    static pauseStartTime = 0; // When pause started

    /**
     * REGISTER INTERVAL
     * Registers a setInterval call with tracking information
     * 
     * @param {number} intervalId - The ID returned from setInterval
     * @param {string} name - Descriptive name for the interval
     * @param {object} owner - The object that created the interval (e.g., character, enemy)
     * @param {number} delay - The interval delay in milliseconds
     * @param {function} callback - The callback function (optional, for pause/resume)
     * @returns {number} The registered interval ID (same as input)
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
     * REGISTER TIMEOUT
     * Registers a setTimeout call with tracking information
     * 
     * @param {number} timeoutId - The ID returned from setTimeout
     * @param {string} name - Descriptive name for the timeout
     * @param {object} owner - The object that created the timeout
     * @param {number} delay - The timeout delay in milliseconds
     * @param {function} callback - The callback function (required for pause/resume)
     * @returns {number} The registered timeout ID (same as input)
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
     * CLEAR TIMEOUT
     * Stops a timeout and marks it as inactive
     * 
     * @param {number} timeoutId - The timeout ID to clear
     * @param {string} name - Optional name for logging
     */
    static clearTimeout(timeoutId, name = '') {
        // Find the registration by timeoutId
        for (const key in this.timeouts) {
            if (this.timeouts[key].timeoutId === timeoutId) {
                clearTimeout(timeoutId);
                this.timeouts[key].isActive = false;
                this.timeouts[key].clearedAt = new Date().toLocaleTimeString();
                console.log(`[Interval Manager] Cleared timeout: ${this.timeouts[key].name} (${name})`);
                return;
            }
        }
        // Fallback if not found in tracking
        clearTimeout(timeoutId);
    }

    /**
     * CLEAR INTERVAL
     * Stops an interval and marks it as inactive
     * 
     * @param {number} intervalId - The interval ID to clear
     * @param {string} name - Optional name for logging
     */
    static clear(intervalId, name = '') {
        // Find the registration by intervalId
        for (const key in this.intervals) {
            if (this.intervals[key].intervalId === intervalId) {
                clearInterval(intervalId);
                this.intervals[key].isActive = false;
                this.intervals[key].clearedAt = new Date().toLocaleTimeString();
                console.log(`[Interval Manager] Cleared: ${this.intervals[key].name} (${name})`);
                return;
            }
        }
        // Fallback if not found in tracking
        clearInterval(intervalId);
    }

    /**
     * CLEAR ALL INTERVALS
     * Stops all active intervals
     */
    static clearAll() {
        let clearedCount = 0;
        for (const key in this.intervals) {
            if (this.intervals[key].isActive) {
                clearInterval(this.intervals[key].intervalId);
                this.intervals[key].isActive = false;
                clearedCount++;
            }
        }
        console.log(`[Interval Manager] Cleared all ${clearedCount} intervals`);
    }

    /**
     * CLEAR BY OWNER
     * Stops all intervals belonging to a specific object
     * 
     * @param {object} owner - The owner object
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
        console.log(`[Interval Manager] Cleared ${clearedCount} intervals for ${ownerName}`);
    }

    /**
     * GET ACTIVE INTERVALS
     * Returns an array of currently active intervals
     */
    static getActive() {
        return Object.values(this.intervals).filter(interval => interval.isActive);
    }

    /**
     * GET STATISTICS
     * Returns statistics about interval usage
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
     * PAUSE ALL INTERVALS
     * Pauses all active intervals by clearing them and storing their data
     */
    static pauseAll() {
        if (this.isPaused) {
            console.log('[Interval Manager] Already paused');
            return;
        }

        this.pauseStartTime = Date.now();
        this.pausedIntervals = [];
        this.pausedTimeouts = [];
        let pausedCount = 0;

        // Pause intervals
        for (const key in this.intervals) {
            const interval = this.intervals[key];
            if (interval.isActive) {
                // Store interval data for resume
                this.pausedIntervals.push({
                    key: key,
                    name: interval.name,
                    owner: interval.ownerRef,
                    delay: interval.delay,
                    callback: interval.callback
                });

                // Clear the interval
                clearInterval(interval.intervalId);
                interval.isActive = false;
                pausedCount++;
            }
        }

        // Pause timeouts
        for (const key in this.timeouts) {
            const timeout = this.timeouts[key];
            if (timeout.isActive) {
                // Calculate remaining time
                const elapsed = Date.now() - timeout.startTime;
                const remaining = Math.max(0, timeout.delay - elapsed);

                // Store timeout data for resume
                this.pausedTimeouts.push({
                    key: key,
                    name: timeout.name,
                    owner: timeout.ownerRef,
                    remainingDelay: remaining,
                    callback: timeout.callback
                });

                // Clear the timeout
                clearTimeout(timeout.timeoutId);
                timeout.isActive = false;
                pausedCount++;
            }
        }

        this.isPaused = true;
        console.log(`[Interval Manager] Paused ${pausedCount} intervals/timeouts`);
    }

    /**
     * RESUME ALL INTERVALS
     * Resumes all paused intervals by recreating them
     */
    static resumeAll() {
        if (!this.isPaused) {
            console.log('[Interval Manager] Not paused');
            return;
        }

        let resumedCount = 0;

        // Resume intervals
        this.pausedIntervals.forEach(pausedInterval => {
            const interval = this.intervals[pausedInterval.key];
            if (interval && interval.callback) {
                // Recreate the interval with stored callback
                const newIntervalId = setInterval(interval.callback, pausedInterval.delay);
                interval.intervalId = newIntervalId;
                interval.isActive = true;
                resumedCount++;
            }
        });

        // Resume timeouts
        this.pausedTimeouts.forEach(pausedTimeout => {
            const timeout = this.timeouts[pausedTimeout.key];
            if (timeout && timeout.callback) {
                // Recreate the timeout with remaining delay
                const newTimeoutId = setTimeout(timeout.callback, pausedTimeout.remainingDelay);
                timeout.timeoutId = newTimeoutId;
                timeout.startTime = Date.now();
                timeout.delay = pausedTimeout.remainingDelay;
                timeout.isActive = true;
                resumedCount++;
            }
        });

        this.pausedIntervals = [];
        this.pausedTimeouts = [];
        this.isPaused = false;
        console.log(`[Interval Manager] Resumed ${resumedCount} intervals/timeouts`);
    }

    /**
     * PRINT STATUS
     * Prints a formatted status to console
     */
    static printStatus() {
        const stats = this.getStats();
        console.clear();
        console.log('╔════════════════════════════════════════════════════════════════╗');
        console.log('║         GLOBAL INTERVAL MANAGER - STATUS REPORT                ║');
        console.log('╚════════════════════════════════════════════════════════════════╝');
        console.log(`\n📊 SUMMARY:`);
        console.log(`   Total Active Intervals: ${stats.totalActive}`);
        console.log(`   Total Registered: ${stats.totalRegistered}`);
        console.log(`   Paused: ${this.isPaused ? 'YES' : 'NO'}`);

        console.log(`\n🎯 BY OWNER:`);
        for (const owner in stats.byOwner) {
            console.log(`   ${owner}: ${stats.byOwner[owner]}`);
        }

        console.log(`\n📋 DETAILS:`);
        stats.intervals.forEach((interval, index) => {
            console.log(`   ${index + 1}. ${interval.name}`);
            console.log(`      Owner: ${interval.owner} | Delay: ${interval.delay}ms`);
            console.log(`      Created: ${interval.createdAt}`);
        });
        console.log('\n');
    }
}

// Make it globally accessible
window.intervalManager = GlobalIntervalManager;
