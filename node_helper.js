const NodeHelper = require("node_helper");
const ical = require("ical");
const moment = require("moment");

module.exports = NodeHelper.create({
  socketNotificationReceived(notification, payload) {
    if (notification === "LOAD_FERIEN") {
      ical.fromURL(payload, {}, (err, data) => {
        if (err) return;
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
      });
    }
  }
});
