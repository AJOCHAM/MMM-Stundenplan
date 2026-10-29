Module.register("MMM-Stundenplan", {
  defaults: {
    daysToShow: 1,
    ferienCalendarUrl: null,
    stundenRaster: [],
    kinder: []
  },

  getStyles: function () {
    return ["MMM-Stundenplan.css"];
  },

  start: function () {
    this.ferien = {};
    if (this.config.ferienCalendarUrl) {
      this.sendSocketNotification("LOADFERIEN", this.config.ferienCalendarUrl);
    }
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "FERIEN") {
      this.ferien = payload;
      this.updateDom();
    }
  },

  getDom: function () {
    const wrapper = document.createElement("div");
    wrapper.className = "stundenplan-wrapper";

    const jetzt = moment();
    let heute = jetzt.clone();

    if (jetzt.hour() >= 12) {
      heute.add(1, "day");
    }

    let tage = 0;
    let d = 0;

    while (tage < this.config.daysToShow && d < 7) {
      const tag = heute.clone().add(d, "days");
      const wochentag = tag.day();

      if (wochentag === 0 || wochentag === 6) {
        d++;
        continue;
      }

      const tagName = tag.format("dddd");
      const datum = tag.format("DD.MM.YYYY");

      const dayWrapper = document.createElement("div");
      dayWrapper.className = "day-wrapper";

      const header = document.createElement("div");
      header.className = "day-header";
      header.innerHTML = `${tagName} <span>${datum}</span>`;
      dayWrapper.appendChild(header);

      const isFerien = this.ferien[datum];
      if (isFerien) {
        const ferienDiv = document.createElement("div");
        ferienDiv.className = "ferien-box";
        ferienDiv.innerHTML = "FERIEN";
        dayWrapper.appendChild(ferienDiv);
        wrapper.appendChild(dayWrapper);
        break;
      }

      const table = document.createElement("table");
      table.className = "stundenplan-table";

      const thead = document.createElement("thead");
      const headRow = document.createElement("tr");

      const thZeit = document.createElement("th");
      thZeit.innerHTML = "Zeit";
      headRow.appendChild(thZeit);

      this.config.kinder.forEach((k) => {
        const th = document.createElement("th");
        th.style.color = k.color || "#fff";
        th.innerHTML = k.name;
        headRow.appendChild(th);
      });

      thead.appendChild(headRow);
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      const raster = this.config.stundenRaster || [];

      if (raster.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = this.config.kinder.length + 1;
        td.className = "keine-stunden";
        td.innerHTML = "Kein Stundenraster konfiguriert";
        tr.appendChild(td);
        tbody.appendChild(tr);
      } else {
        raster.forEach((zeit, index) => {
          const tr = document.createElement("tr");

          const tdZeit = document.createElement("td");
          tdZeit.className = "zeit-cell";
          tdZeit.innerHTML = zeit;
          tr.appendChild(tdZeit);

          this.config.kinder.forEach((k) => {
            const td = document.createElement("td");
            td.className = "stunde-box";
            td.style.borderColor = "#000";
            td.style.backgroundColor = k.bgcolor || "#333";
            td.style.color = k.color || "#fff";

            const tagesPlan = (k.plan && k.plan[tagName]) ? k.plan[tagName] : [];
            const fach = tagesPlan[index] || "";

            td.innerHTML = fach;
            tr.appendChild(td);
          });

          tbody.appendChild(tr);
        });
      }

      table.appendChild(tbody);
      dayWrapper.appendChild(table);
      wrapper.appendChild(dayWrapper);

      tage++;
      d++;
    }

    return wrapper;
  }
});