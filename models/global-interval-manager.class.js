/**
 * GLOBAL INTERVAL MANAGER
 * Centralized system to track all active intervals in the game
 * 
 * FEATURES:
 * - Register intervals with descriptive names
 * - Track interval ownership (which object created the interval)
 * - Clear intervals individually or by category
 * - Get live statistics about active intervals
 * - Access intervals via console for debugging
 */
class GlobalIntervalManager {
    static intervals = {}; // Map of all intervals
    static intervalCounter = 0; // Counter for unique IDs

    /**
     * REGISTER INTERVAL
     * Registers a setInterval call with tracking information
     * 
     * @param {number} intervalId - The ID returned from setInterval
     * @param {string} name - Descriptive name for the interval
     * @param {object} owner - The object that created the interval (e.g., character, enemy)
     * @param {number} delay - The interval delay in milliseconds
     * @returns {number} The registered interval ID (same as input)
     */
    static register(intervalId, name, owner, delay) {
        this.intervalCounter++;
        const registrationId = this.intervalCounter;

        this.intervals[registrationId] = {
            id: registrationId,
            intervalId: intervalId,
            name: name,
            owner: owner?.constructor?.name || 'Unknown',
            ownerRef: owner,
            delay: delay,
            createdAt: new Date().toLocaleTimeString(),
            isActive: true
        };

        return intervalId;
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
