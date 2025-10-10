Module.register("MMM-Stundenplan", {
    defaults: {
        daysToShow: 1,
        ferienCalendarUrl: null,
        kinder: []
    },

    getStyles() {
        return [this.file("MMM-Stundenplan.css")];
    },

    start() {
        this.ferien = {};
        if (this.config.ferienCalendarUrl) {
            this.sendSocketNotification("LOAD_FERIEN", this.config.ferienCalendarUrl);
        }
    },

    socketNotificationReceived(notification, payload) {
        if (notification === "FERIEN") {
            this.ferien = payload;
            this.updateDom();
        }
    },

    getDom() {
        const wrapper = document.createElement("div");
        wrapper.className = "stundenplan-wrapper";
        const jetzt = moment();
        let heute = jetzt.clone();
        if (jetzt.hour() >= 12) {
            heute.add(1, "day");
        }

        let tage = 0;
        let d = 0;
        while (tage < this.config.daysToShow && d < 7) { // maximal 7 Durchläufe
            const tag = heute.clone().add(d, "days");
            const wochentag = tag.day(); // 0: Sonntag, 6: Samstag
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
            header.innerHTML = `${tagName} (${datum})`;
            dayWrapper.appendChild(header);

            const isFerien = this.ferien[datum];
            if (isFerien) {
                const ferienDiv = document.createElement("div");
                ferienDiv.className = "ferien-box";
                ferienDiv.innerHTML = "FERIEN";
                dayWrapper.appendChild(ferienDiv);
                wrapper.appendChild(dayWrapper);
                break; // Zeige nichts an, sobald Ferien sind
            }

            // Stundenplan-Tabelle
            const table = document.createElement("table");
            table.className = "stundenplan-table";
            const thead = document.createElement("thead");
            const headRow = document.createElement("tr");
            const thZeit = document.createElement("th");
            thZeit.innerHTML = "Zeit";
            headRow.appendChild(thZeit);

            this.config.kinder.forEach(k => {
                const th = document.createElement("th");
                th.style.color = k.color;
                th.innerHTML = k.name;
                headRow.appendChild(th);
            });

            thead.appendChild(headRow);
            table.appendChild(thead);

            const tbody = document.createElement("tbody");
            let alleZeiten = new Set();
            this.config.kinder.forEach(k => {
                const stunden = k.plan[tagName] || [];
                stunden.forEach(s => alleZeiten.add(s.zeit));
            });

            alleZeiten = Array.from(alleZeiten).sort();

            if (alleZeiten.length === 0) {
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                td.colSpan = this.config.kinder.length + 1;
                td.className = "keine-stunden";
                td.innerHTML = "Keine Stunden";
                tr.appendChild(td);
                tbody.appendChild(tr);
            } else {
                alleZeiten.forEach(zeit => {
                    const tr = document.createElement("tr");
                    const tdZeit = document.createElement("td");
                    tdZeit.className = "zeit-cell";
                    tdZeit.innerHTML = zeit;
                    tr.appendChild(tdZeit);

                    this.config.kinder.forEach(k => {
                        const td = document.createElement("td");
                        td.className = "stunde-box";
                        td.style.borderColor = "#000";
                        td.style.backgroundColor = k.bgcolor || "#333";
                        td.style.color = k.color || "#fff";
                        const stunde = (k.plan[tagName] || []).find(s => s.zeit === zeit);
                        td.innerHTML = stunde ? (stunde.fach || "") : "";
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
