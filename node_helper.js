const NodeHelper = require("node_helper");
const ical = require("ical");
const moment = require("moment");
const fetch = require("node-fetch"); // Stelle sicher, dass node-fetch installiert ist

module.exports = NodeHelper.create({
    start() {
        this.updateInterval = null;
        this.url = null;
    },

    socketNotificationReceived(notification, payload) {
        if (notification === "LOAD_FERIEN") {
            this.url = payload;
            this.loadFerien(); // Initial load
            this.startHourlyUpdates(); // Start hourly refresh
        }
    },

    async loadFerien() {
        if (!this.url) return;
        try {
            const response = await fetch(this.url);
            if (!response.ok) {
                throw new Error(`Failed to fetch iCal: ${response.status} ${response.statusText}`);
            }
            const icalData = await response.text();
            const data = ical.parseICS(icalData);
            const ferien = {};
            for (let k in data) {
                const ev = data[k];
                if (ev.type === "VEVENT") {
                    const start = moment(ev.start);
                    const end = moment(ev.end);
                    for (let m = moment(start); m.isBefore(end); m.add(1, "days")) {
                        ferien[m.format("DD.MM.YYYY")] = true;
                    }
                }
            }
            this.sendSocketNotification("FERIEN", ferien);
        } catch (err) {
            console.error("[Ferien] Error loading iCal:", err);
        }
    },

    startHourlyUpdates() {
        if (this.updateInterval) clearInterval(this.updateInterval);
        this.updateInterval = setInterval(() => {
            console.log("[Ferien] Updating calendar data...");
            this.loadFerien();
        }, 60 * 60 * 1000); // 60min
    }
});
