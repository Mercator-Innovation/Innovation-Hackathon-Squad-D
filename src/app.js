// Behaviour: works out each home's risk, then draws the summary, map, tables and detail.
(function () {
  const C = window.CONTENT;
  const D = window.DATA;
  const $ = (id) => document.getElementById(id);
  const W = 1000, H = 600, CELL = 40; // the made-up map, and the size of each heat map square
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---------- Join the data and score every home
  const tenantByHome = {};
  D.tenants.forEach((t) => (tenantByHome[t.home] = t));

  // Example decisions first (data/cases.js), then anything saved in this browser on top
  const decisions = Object.assign({}, D.cases || {}, loadDecisions());

  const homes = D.homes.map((h) => {
    const tenant = tenantByHome[h.id] || null;
    const sensorRaw = D.sensors[h.id] || null;
    const sensor = sensorRaw ? Object.assign({}, sensorRaw, window.RISK.summariseSensor(sensorRaw)) : null;
    const risk = window.RISK.assess(h, tenant, sensor);
    const layers = {
      property: window.RISK.groupScore(risk.reasons, ["Home", "Reports", "Sensor"]),
      household: window.RISK.groupScore(risk.reasons, ["Household"])
    };
    return Object.assign({}, h, { tenant, sensor, risk, layers });
  });
  homes.sort((a, b) => b.risk.score - a.risk.score || a.id.localeCompare(b.id));
  const byId = {};
  homes.forEach((h) => (byId[h.id] = h));

  const state = { area: "", setting: "", coast: "", band: "", search: "", sensorOnly: false, unreviewed: false, shown: 25, selected: null, layer: "combined" };

  // ---------- Words
  $("banner").textContent = C.banner;
  $("title").textContent = C.title;
  $("lead").textContent = C.lead;
  $("filters-heading").textContent = C.filters.heading;
  $("map-heading").textContent = C.map.heading;
  $("map-hint").textContent = C.map.hint;
  $("areas-heading").textContent = C.areas.heading;
  $("list-heading").textContent = C.list.heading;
  $("more").textContent = C.list.more;
  $("cases-heading").textContent = C.cases.heading;
  $("today-heading").textContent = C.today.heading;
  document.querySelector('label[for="show-dots"]').textContent = C.map.showDots;
  document.querySelector('label[for="show-pulse"]').textContent = C.map.pulse;

  setupFilters();
  setupTabs();
  render();

  // ---------- Tabs: one view at a time. Arrow keys move between tabs.
  function setupTabs() {
    const tabs = [...document.querySelectorAll('[role="tab"]')];
    $("tab-homes").textContent = C.tabs.homes;
    $("tab-areas").textContent = C.tabs.areas;
    $("tab-visits").textContent = C.tabs.visits;
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => showTab(tab.id));
      tab.addEventListener("keydown", (e) => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (e.key === "Home" || e.key === "End" || step) {
          e.preventDefault();
          const next = e.key === "Home" ? tabs[0] : e.key === "End" ? tabs[tabs.length - 1] : tabs[(i + step + tabs.length) % tabs.length];
          showTab(next.id);
          next.focus();
        }
      });
    });
  }
  function showTab(id) {
    document.querySelectorAll('[role="tab"]').forEach((tab) => {
      const on = tab.id === id;
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.tabIndex = on ? 0 : -1;
      $(tab.getAttribute("aria-controls")).hidden = !on;
    });
    if (state.selected) closeDetail(true);
  }
  function activeTab() {
    return document.querySelector('[role="tab"][aria-selected="true"]').id;
  }

  // ---------- Filters
  function setupFilters() {
    const opts = (all, values) => `<option value="">${esc(all)}</option>` + values.map((v) => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
    const f = C.filters;
    label("f-area", f.area); $("f-area").innerHTML = opts(f.allAreas, D.areas.map((a) => a.name));
    label("f-setting", f.setting); $("f-setting").innerHTML = opts(f.allSettings, ["Urban", "Rural"]);
    label("f-coast", f.coast); $("f-coast").innerHTML = opts(f.allCoast, ["Coastal", "Inland"]);
    label("f-band", f.band); $("f-band").innerHTML = `<option value="">${esc(f.allBands)}</option>` + window.RISK.bands.map((b) => `<option value="${b.id}">${esc(b.label)}</option>`).join("");
    label("f-search", f.search); $("f-search").placeholder = f.searchHint;
    label("f-sensor", f.sensorOnly);
    label("f-unreviewed", f.unreviewed);
    $("f-reset").textContent = f.reset;

    label("f-layer", C.map.layer);
    $("f-layer").innerHTML = C.map.layerOptions.map((o) => `<option value="${esc(o.id)}">${esc(o.label)}</option>`).join("");
    $("f-layer").addEventListener("change", (e) => { state.layer = e.target.value; renderMap(filtered()); });

    const bind = (id, key, prop = "value") => $(id).addEventListener(prop === "value" ? "input" : "change", (e) => {
      state[key] = prop === "value" ? e.target.value.trim() : e.target.checked;
      state.shown = 25;
      render();
    });
    bind("f-area", "area"); bind("f-setting", "setting"); bind("f-coast", "coast"); bind("f-band", "band");
    bind("f-search", "search"); bind("f-sensor", "sensorOnly", "checked"); bind("f-unreviewed", "unreviewed", "checked");
    $("f-reset").addEventListener("click", () => {
      Object.assign(state, { area: "", setting: "", coast: "", band: "", search: "", sensorOnly: false, unreviewed: false, shown: 25 });
      $("filters").reset();
      render();
    });
    $("filters").addEventListener("submit", (e) => e.preventDefault());
    $("more").addEventListener("click", () => { state.shown += 25; renderList(filtered()); });
    $("show-dots").addEventListener("change", (e) => $("map").classList.toggle("no-dots", !e.target.checked));
    $("show-pulse").addEventListener("change", (e) => $("map").classList.toggle("no-pulse", !e.target.checked));
  }

  function label(id, text) { document.querySelector(`label[for="${id}"]`).textContent = text; }

  function filtered() {
    const q = state.search.toUpperCase();
    return homes.filter((h) =>
      (!state.area || h.area === state.area) &&
      (!state.setting || h.setting === state.setting) &&
      (!state.coast || h.coast === state.coast) &&
      (!state.band || h.risk.band.id === state.band) &&
      (!state.sensorOnly || h.sensor) &&
      (!state.unreviewed || !decisions[h.id]) &&
      (!q || h.id.includes(q)));
  }

  function render() {
    const list = filtered();
    renderSummary(list);
    renderToday();
    renderMap(list);
    renderAreas(list);
    renderList(list);
    renderCases();
  }

  // ---------- Summary
  function withinDays(iso, days) {
    const diff = (new Date() - new Date(iso)) / 86400000;
    return diff >= 0 && diff < days;
  }

  function renderSummary(list) {
    const now = new Date();
    const thisMonth = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
    const reviewedThisWeek = list.filter((h) => decisions[h.id] && decisions[h.id].when && withinDays(decisions[h.id].when, 7)).length;
    const newReports = list.reduce((sum, h) => sum + h.reports.filter((r) => r.damp && r.month === thisMonth).length, 0);
    const noContact = list.filter((h) => h.tenant && h.tenant.monthsSinceContact >= 12).length;
    const items = [
      ["reviewed", reviewedThisWeek, C.summary.reviewedThisWeek],
      ["reports", newReports, C.summary.newReports],
      ["no-contact", noContact, C.summary.noContact],
      ["sensors", list.filter((h) => h.sensor).length, C.summary.sensors]
    ];
    $("summary").innerHTML = items.map(([cls, n, text]) => `<li class="${cls}"><span class="num">${n}</span>${esc(text)}</li>`).join("");
  }

  // ---------- Today: a housing officer's workflow, not just a count of homes
  function isToday(iso) {
    const d = new Date(iso);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  }

  function renderToday() {
    const visitChoice = C.detail.options[0];
    const visits = homes.filter((h) => decisions[h.id] && decisions[h.id].choice === visitChoice);
    const T = C.today;
    const plural = (n, text) => text.replace("{s}", n === 1 ? "" : "s");
    const tasks = [
      { n: homes.filter((h) => h.risk.band.id === "higher" && !decisions[h.id]).length, text: T.toReview, none: T.toReviewNone, button: T.toReviewButton, tab: "tab-homes", setup: () => { state.band = "higher"; state.unreviewed = true; $("f-band").value = "higher"; $("f-unreviewed").checked = true; state.shown = 25; } },
      { n: visits.filter((h) => !decisions[h.id].engineer).length, text: T.needsEngineer, none: T.needsEngineerNone, button: T.needsEngineerButton, tab: "tab-visits" },
      { n: visits.filter((h) => decisions[h.id].when && isToday(decisions[h.id].when)).length, text: T.bookedToday, none: T.bookedTodayNone, button: T.bookedTodayButton, tab: "tab-visits" }
    ].map((t) => Object.assign(t, { text: plural(t.n, t.text) }));
    // The most urgent task becomes one big card with a real button; the rest are a short line each.
    const heroIndex = tasks.reduce((best, t, i) => (t.n > tasks[best].n ? i : best), 0);
    const hero = tasks[heroIndex];
    const minor = tasks.filter((_, i) => i !== heroIndex);

    const heroHtml = hero.n
      ? `<div class="today-hero due">
          <span class="num">${hero.n}</span>
          <p>${esc(hero.text)}</p>
          <button type="button" class="primary" data-task="${heroIndex}">${esc(hero.button)}</button>
        </div>`
      : `<div class="today-hero clear"><p>${esc(T.allClear)}</p></div>`;

    const minorHtml = `<ul class="today-minor">` + minor.map((task) => {
      const i = tasks.indexOf(task);
      return `<li>${task.n
        ? `<button type="button" class="link-button" data-task="${i}"><span class="num">${task.n}</span> ${esc(task.text)}</button>`
        : `<span class="num">${task.n}</span> ${esc(task.none)}`}</li>`;
    }).join("") + `</ul>`;

    $("today-tasks").innerHTML = heroHtml + minorHtml;
    $("today-tasks").querySelectorAll("button[data-task]").forEach((b) => b.addEventListener("click", () => {
      const task = tasks[Number(b.dataset.task)];
      if (task.setup) task.setup();
      render();
      showTab(task.tab);
      $(task.tab).focus();
    }));
  }

  // ---------- Heat map
  function heatClass(avg) {
    // Average score per square, in five steps
    return avg >= 15 ? 5 : avg >= 12 ? 4 : avg >= 9 ? 3 : avg >= 6 ? 2 : 1;
  }

  function scoreFor(h) {
    return state.layer === "property" ? h.layers.property : state.layer === "household" ? h.layers.household : h.risk.score;
  }

  function renderMap(list) {
    const layerLabel = (C.map.layerOptions.find((o) => o.id === state.layer) || {}).label || "";
    const onHousehold = state.layer === "household";
    $("map-hint").textContent = onHousehold ? C.map.hint + " " + C.map.householdNote : C.map.hint;

    const cells = {};
    list.forEach((h) => {
      const key = Math.floor(h.x / CELL) + "," + Math.floor(h.y / CELL);
      (cells[key] = cells[key] || []).push(h);
    });
    const squares = Object.entries(cells).map(([key, group]) => {
      const [cx, cy] = key.split(",").map(Number);
      const avg = group.reduce((sum, h) => sum + scoreFor(h), 0) / group.length;
      const known = group.filter((h) => h.tenant && h.tenant.consent === "Yes").length;
      const title = onHousehold
        ? `${group.length} homes, average ${esc(layerLabel.toLowerCase())} score ${avg.toFixed(1)}. ${known} of ${group.length} have told Cloch about their health.`
        : `${group.length} homes, average ${esc(layerLabel.toLowerCase())} score ${avg.toFixed(1)}.`;
      const heat = `<rect x="${cx * CELL}" y="${cy * CELL}" width="${CELL}" height="${CELL}" fill="var(--heat-${heatClass(avg)})" opacity="0.9"><title>${title}</title></rect>`;
      const hatch = onHousehold && known / group.length < 0.5
        ? `<rect x="${cx * CELL}" y="${cy * CELL}" width="${CELL}" height="${CELL}" fill="url(#unknown-hatch)"><title>${title}</title></rect>` : "";
      return heat + hatch;
    }).join("");

    // A pulsing ring sits behind the dot of each higher-risk home where someone may be more vulnerable
    const pulses = list.filter((h) => h.risk.band.id === "higher" && window.RISK.isVulnerable(h.tenant))
      .map((h) => `<circle class="pulse ${h.risk.band.id}" cx="${h.x}" cy="${h.y}" r="7" aria-hidden="true"></circle>`).join("");
    const dots = list.map((h) => {
      const vulnerable = window.RISK.isVulnerable(h.tenant) ? ", someone may be more vulnerable" : "";
      return `<circle class="dot ${h.risk.band.id}${state.selected === h.id ? " selected" : ""}" cx="${h.x}" cy="${h.y}" r="${state.selected === h.id ? 8 : 4}" data-id="${h.id}"><title>${h.id}, ${esc(h.area)}: ${esc(h.risk.band.label)} (${h.risk.score})${vulnerable}</title></circle>`;
    }).join("");

    const labels = D.areas.map((a) => `<text class="area-label" x="${a.x}" y="${a.y - 58}" text-anchor="middle">${esc(a.name)}</text>`).join("");

    const higher = list.filter((h) => h.risk.band.id === "higher").length;
    $("map").innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Made-up map of ${list.length} homes, coloured by ${esc(layerLabel.toLowerCase())}. ${higher} at higher overall risk. The table of areas has the same information.">
      <defs>
        <pattern id="unknown-hatch" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="8" stroke="var(--ink)" stroke-width="3" opacity="0.3"></line>
        </pattern>
      </defs>
      <path class="water" d="M0 0 H${W} V40 C800 60 650 30 500 55 C350 70 200 35 0 50 Z"></path>
      <text class="water-label" x="20" y="30">${esc(C.map.water)}</text>
      <text class="made-up" x="${W - 20}" y="${H - 14}" text-anchor="end">${esc(C.map.madeUp)}</text>
      ${squares}<g class="pulses">${pulses}</g>${dots}${labels}
    </svg>`;

    $("map").querySelectorAll(".dot").forEach((dot) => dot.addEventListener("click", () => openDetail(dot.dataset.id)));

    $("legend").innerHTML = `<span>${esc(C.map.legendLow)}</span>` +
      [1, 2, 3, 4, 5].map((i) => `<span class="swatch" style="background:var(--heat-${i})"></span>`).join("") +
      `<span>${esc(C.map.legendHigh)}</span>` +
      (onHousehold ? `<span class="dot-key"><i class="hatch-swatch"></i>${esc(C.map.legendUnknown)}</span>` : "") +
      window.RISK.bands.map((b) => `<span class="dot-key"><i style="background:var(--${b.id})"></i>${esc(b.label)}</span>`).join("") +
      `<span class="dot-key pulse-key"><i></i>${esc(C.map.legendPulse)}</span>`;
  }

  // ---------- Areas table
  function renderAreas(list) {
    const rows = D.areas.map((a) => {
      const inArea = list.filter((h) => h.area === a.name);
      const higher = inArea.filter((h) => h.risk.band.id === "higher").length;
      const share = inArea.length ? higher / inArea.length : 0;
      const avg = inArea.length ? inArea.reduce((s, h) => s + h.risk.score, 0) / inArea.length : 0;
      return { a, n: inArea.length, higher, share, avg, sensors: inArea.filter((h) => h.sensor).length };
    }).filter((r) => r.n > 0).sort((x, y) => y.avg - x.avg);

    const head = C.areas.cols.map((c, i) => `<th scope="col"${i > 1 ? ' class="num"' : ""}>${esc(c)}</th>`).join("");
    $("areas").innerHTML = `<thead><tr>${head}</tr></thead><tbody>` + rows.map((r) => {
      const step = heatClass(r.avg);
      const style = `background:var(--heat-${step});${step >= 4 ? "color:#fff" : ""}`;
      return `<tr>
        <th scope="row"><button type="button" data-area="${esc(r.a.name)}">${esc(r.a.name)}</button></th>
        <td>${esc(r.a.setting)}, ${esc(r.a.coast.toLowerCase())}</td>
        <td class="num">${r.n}</td>
        <td class="num">${r.higher}</td>
        <td class="num">${Math.round(r.share * 100)}%</td>
        <td class="num heat" style="${style}">${r.avg.toFixed(1)}</td>
        <td class="num">${r.sensors}</td>
      </tr>`;
    }).join("") + "</tbody>";

    $("areas").querySelectorAll("button[data-area]").forEach((b) => b.addEventListener("click", () => {
      state.area = b.dataset.area; $("f-area").value = state.area; state.shown = 25; render();
      $("list").focus();
    }));
  }

  // ---------- Priority list
  function renderList(list) {
    const shown = list.slice(0, state.shown);
    $("list-hint").textContent = list.length ? C.list.hint.replace("{n}", shown.length).replace("{total}", list.length) : C.list.none;
    const head = C.list.cols.map((c, i) => `<th scope="col"${i === 3 || i === 4 ? ' class="num"' : ""}>${c ? esc(c) : '<span class="visually-hidden">Actions</span>'}</th>`).join("");
    $("homes").innerHTML = `<thead><tr>${head}</tr></thead><tbody>` + shown.map((h) => {
      // The Age column already shows when it was built, so don't repeat that reason here too
      const top = h.risk.reasons.filter((r) => !/^Built /.test(r.short)).sort((a, b) => b.points - a.points).slice(0, 3);
      const d = decisions[h.id];
      return `<tr>
        <th scope="row">${h.id}</th>
        <td>${esc(h.area)}</td>
        <td>${esc(h.type)}</td>
        <td class="num">${h.built}</td>
        <td class="num">${h.risk.score}</td>
        <td><span class="badge ${h.risk.band.id}">${esc(h.risk.band.label)}</span></td>
        <td><ul class="reasons">${top.map((r) => `<li>${esc(r.short)}</li>`).join("")}</ul></td>
        <td class="decision">${d ? esc(d.choice) : "Not reviewed"}</td>
        <td><button type="button" class="secondary" data-id="${h.id}" style="margin:0">${esc(C.list.review)} <span class="visually-hidden">${h.id}</span></button></td>
      </tr>`;
    }).join("") + "</tbody>";
    $("homes").querySelectorAll("button[data-id]").forEach((b) => b.addEventListener("click", () => openDetail(b.dataset.id)));
    $("more").hidden = shown.length >= list.length;
  }

  // ---------- Visits booked (homes decided as "Visit and check the home")
  function renderCases() {
    const visitChoice = C.detail.options[0];
    const cases = homes.filter((h) => decisions[h.id] && decisions[h.id].choice === visitChoice);
    $("cases-hint").textContent = cases.length ? C.cases.hint.replace("{n}", cases.length) : C.cases.none;
    const head = C.cases.cols.map((c) => `<th scope="col">${c ? esc(c) : '<span class="visually-hidden">Actions</span>'}</th>`).join("");
    $("cases-table").innerHTML = `<thead><tr>${head}</tr></thead><tbody>` + cases.map((h) => {
      const d = decisions[h.id];
      // Engineers check the home only. They must never be asked to collect health information.
      const checks = h.risk.unknowns.filter((u) => !/health/i.test(u));
      const missing = checks.length
        ? checks.map((u) => `<li>${esc(u)}</li>`).join("")
        : `<li>${esc(C.cases.nothingMissing)}</li>`;
      return `<tr>
        <th scope="row">${h.id}</th>
        <td>${esc(h.area)}</td>
        <td>
          <label class="visually-hidden" for="eng-${h.id}">${esc(C.cases.engineer)}, ${h.id}</label>
          <input type="text" id="eng-${h.id}" data-id="${h.id}" value="${esc(d.engineer || "")}" placeholder="${esc(C.cases.engineerHint)}">
        </td>
        <td><ul class="reasons">${missing}</ul></td>
        <td><button type="button" class="secondary" data-id="${h.id}" style="margin:0">${esc(C.cases.review)} <span class="visually-hidden">${h.id}</span></button></td>
      </tr>`;
    }).join("") + "</tbody>";

    $("cases-table").querySelectorAll("input[id^='eng-']").forEach((inp) => inp.addEventListener("change", (e) => {
      const id = e.target.dataset.id;
      decisions[id] = Object.assign({}, decisions[id], { engineer: e.target.value.trim() });
      saveDecisions();
      renderToday();
    }));
    $("cases-table").querySelectorAll("button[data-id]").forEach((b) => b.addEventListener("click", () => openDetail(b.dataset.id)));
  }

  // ---------- Detail for one home
  function openDetail(id) {
    const h = byId[id];
    if (!h) return;
    state.selected = id;
    renderMap(filtered());
    const t = h.tenant, r = h.risk, Cd = C.detail;
    const missingTag = `<span class="tag">${esc(Cd.missingTag)}</span>`;
    const notSharedTag = `<span class="tag">${esc(Cd.notSharedTag)}</span>`;
    // A health answer we don't have: not asked yet (missing) or the household chose not to share
    const healthGap = t && t.consent !== "Yes" ? (t.consent === "No" ? notSharedTag + "Chose not to share" : missingTag + "Not asked") : "";
    const yes = (v) => (v === null || v === undefined ? (healthGap || missingTag + "Not known") : v ? "Yes" : "No");
    // A row in a list of facts, highlighted when we don't have the answer
    const row = (label, value, missing) => missing
      ? `<dt class="missing">${label}</dt><dd class="missing">${value}</dd>`
      : `<dt>${label}</dt><dd>${value}</dd>`;

    // What's missing, and what to do about each gap
    const G = Cd.gaps, gaps = [];
    if (!t) gaps.push(G.vacant);
    else if (t.consent === "No") gaps.push(Object.assign({ shared: true }, G.healthNotShared));
    else if (t.consent !== "Yes") gaps.push(G.healthNotAsked);
    if (h.dpc === "Unknown") gaps.push(G.dpc);
    if (!h.sensor) gaps.push(G.sensor);
    else if (h.sensor.missing > 0) gaps.push({ what: G.sensorGaps.what, next: G.sensorGaps.next.replace("{n}", h.sensor.missing) });
    const missingList = gaps.length
      ? `<ul class="missing-list">${gaps.map((g) => `<li>${g.shared ? notSharedTag : missingTag}<strong>${esc(g.what)}:</strong> ${esc(g.next)}</li>`).join("")}</ul>`
      : `<p>${esc(Cd.nothingMissing)}</p>`;

    const why = r.reasons.slice().sort((a, b) => b.points - a.points)
      .map((x) => `<li><span class="pts">+${x.points}</span> ${esc(x.label)} <span class="group">(${esc(x.group)})</span></li>`).join("");

    const household = t ? `<p class="privacy">${esc(Cd.householdNote)}</p><dl>
        <dt>People</dt><dd>${t.people}</dd>
        <dt>Child under 5</dt><dd>${yes(t.under5)}</dd>
        <dt>Someone over 75</dt><dd>${yes(t.over75)}</dd>
        <dt>Agreed to share health</dt><dd>${esc(t.consent)}</dd>
        ${row("Breathing condition", yes(t.breathing), t.breathing === null)}
        ${row("Other health condition", yes(t.otherHealth), t.otherHealth === null)}
        <dt>Disability</dt><dd>${yes(t.disability)}</dd>
        <dt>Low income</dt><dd>${yes(t.lowIncome)}</dd>
        <dt>Prepayment meter</dt><dd>${yes(t.prepayment)}</dd>
        <dt>Rent arrears</dt><dd>${yes(t.arrears)}</dd>
        <dt>Language</dt><dd>${esc(t.language)}${t.easyRead ? ", needs easy read" : ""}</dd>
        <dt>Uses the app</dt><dd>${yes(t.appUser)}</dd>
        <dt>Last in touch</dt><dd>${t.monthsSinceContact === 0 ? "This month" : t.monthsSinceContact + " months ago"}</dd>
      </dl>` : `<p>${esc(Cd.empty)}</p>`;

    const reports = h.reports.length
      ? `<ul>${h.reports.slice().reverse().map((x) => `<li>${monthName(x.month)}: ${esc(x.what)}</li>`).join("")}</ul>`
      : `<p>${esc(Cd.noReports)}</p>`;

    const d = decisions[h.id] || {};
    const options = Cd.options.map((o, i) => `<div class="radio"><input type="radio" name="decision" id="opt-${i}" value="${esc(o)}"${d.choice === o ? " checked" : ""}><label for="opt-${i}">${esc(o)}</label></div>`).join("");

    $("detail").innerHTML = `
      <button type="button" class="link-button" id="close-detail">${esc(Cd.close)}</button>
      <h2 id="detail-heading">${h.id}, ${esc(h.area)}</h2>
      <p class="score-line">Score <strong>${r.score}</strong> <span class="badge ${r.band.id}">${esc(r.band.label)}</span></p>
      <div class="detail-column">
          <h3>${esc(Cd.why)}</h3>
          <ul class="why">${why || "<li>Nothing flagged</li>"}</ul>
          <section class="missing-box" aria-labelledby="missing-heading">
            <h3 id="missing-heading">${esc(Cd.missing)} (${gaps.length})</h3>
            <p class="hint">${esc(Cd.missingHint)}</p>
            ${missingList}
          </section>
          <h3>${esc(Cd.home)}</h3>
          <dl>
            <dt>Type</dt><dd>${esc(h.type)}, ${esc(h.size)}</dd>
            <dt>Built</dt><dd>${h.built}</dd>
            <dt>Setting</dt><dd>${esc(h.setting)}, ${esc(h.coast.toLowerCase())}</dd>
            <dt>Floor</dt><dd>${esc(h.floor)}</dd>
            <dt>Walls</dt><dd>${esc(h.walls)}</dd>
            <dt>Energy rating</dt><dd>${esc(h.epc)}</dd>
            <dt>Heating</dt><dd>${esc(h.heating)}</dd>
            <dt>Ventilation</dt><dd>${esc(h.ventilation)}</dd>
            <dt>Exposure</dt><dd>${esc(h.exposure)}</dd>
            ${row("Damp-proof course", h.dpc === "Unknown" ? missingTag + "Not checked" : esc(h.dpc), h.dpc === "Unknown")}
            ${h.sensor ? "" : row("Sensor", missingTag + "No sensor in this home", true)}
          </dl>
          <h3>${esc(Cd.reports)}</h3>
          ${reports}
          ${h.sensor ? `<h3>${esc(Cd.sensor)}</h3><p class="hint">${esc(Cd.sensorHint)}</p><div class="chart">${chart(h.sensor)}</div>
            <p class="hint">${Math.round(h.sensor.dampShare * 100)}% of the week at 70% or more. Average ${h.sensor.avgTemp.toFixed(1)}°C. Pattern: ${esc(h.sensor.story.toLowerCase())}.</p>` : ""}
          <h3>${esc(Cd.household)}</h3>
          ${household}
          <form id="decide">
            <fieldset>
              <legend><h3 style="margin:16px 0 0">${esc(Cd.decide)}</h3></legend>
              <p class="hint">${esc(Cd.decideHint)}</p>
              ${options}
            </fieldset>
            <label for="engineer" style="font-weight:600;display:block">${esc(Cd.engineer)}</label>
            <input type="text" id="engineer" value="${esc(d.engineer || "")}" placeholder="${esc(Cd.engineerHint)}">
            <label for="note" style="font-weight:600;display:block">${esc(Cd.note)}</label>
            <textarea id="note">${esc(d.note || "")}</textarea>
            <p><button type="submit" class="primary">${esc(Cd.save)}</button><span class="saved" id="saved" aria-live="polite"></span></p>
          </form>
      </div>`;
    $("detail").hidden = false;
    $("detail").focus();
    $("detail").scrollIntoView({ behavior: "smooth", block: "start" });

    $("close-detail").addEventListener("click", closeDetail);
    $("decide").addEventListener("submit", (e) => {
      e.preventDefault();
      const choice = ($("decide").querySelector("input[name=decision]:checked") || {}).value;
      if (!choice) { $("saved").textContent = "Choose an option first"; return; }
      decisions[h.id] = { choice, note: $("note").value.trim(), engineer: $("engineer").value.trim(), when: (d.when && choice === d.choice) ? d.when : new Date().toISOString() };
      saveDecisions();
      $("saved").textContent = C.detail.saved;
      renderList(filtered());
      renderCases();
      renderToday();
    });
  }

  // quiet: closing because the tab changed, so leave focus on the tab
  function closeDetail(quiet) {
    const id = state.selected;
    state.selected = null;
    $("detail").hidden = true;
    renderMap(filtered());
    if (quiet === true) return;
    // Back to the button that opened it, in whichever tab is showing
    const panel = $(document.getElementById(activeTab()).getAttribute("aria-controls"));
    const btn = panel.querySelector(`button[data-id="${id}"]`);
    (btn || $(activeTab())).focus();
  }

  // A week of humidity as a line, with the 70% line dashed
  function chart(s) {
    const w = 600, h = 200, pad = 28, n = s.humidity.length;
    const x = (i) => pad + (i / (n - 1)) * (w - pad - 8);
    const y = (v) => h - pad - ((v - 30) / 70) * (h - pad - 8);
    let path = "", pen = false;
    s.humidity.forEach((v, i) => {
      if (v === null) { pen = false; return; }
      path += (pen ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1) + " ";
      pen = true;
    });
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => `<text x="${x(i * 48 + 24)}" y="${h - 8}" text-anchor="middle">${d}</text>`).join("");
    return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Humidity over the week: ${Math.round(s.dampShare * 100)}% of readings at 70% or more">
      <line class="limit" x1="${pad}" x2="${w - 8}" y1="${y(70)}" y2="${y(70)}"></line>
      <text x="2" y="${y(70) + 4}">70%</text><text x="2" y="${y(100) + 10}">100%</text><text x="2" y="${y(30)}">30%</text>
      <path class="hum" d="${path}"></path>${days}
    </svg>`;
  }

  function monthName(m) {
    const [y, mo] = m.split("-").map(Number);
    return new Date(y, mo - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  }

  // Decisions stay in this browser only, for the prototype
  function loadDecisions() {
    try { return JSON.parse(localStorage.getItem("damp-decisions") || "{}"); } catch (e) { return {}; }
  }
  function saveDecisions() {
    try { localStorage.setItem("damp-decisions", JSON.stringify(decisions)); } catch (e) { /* fine: kept for this visit */ }
  }
})();
