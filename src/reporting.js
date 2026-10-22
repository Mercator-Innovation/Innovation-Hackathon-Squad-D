// Progress tab: KPIs for Cloch to track whether risk is going down and missing information is being filled in.
// Works out this month's numbers live from the data and the decisions staff have saved. Earlier months come from data/progress.js (made up).
// Its own file so it doesn't clash with app.js. The words are at the top, like content.js.
(function () {
  const W = {
    tab: "Progress",
    heading: "Progress report",
    hint: "How Cloch is doing at lowering risk and filling in what we don't know. Covers all homes, whatever you've picked under Show. The targets are examples for Cloch to set.",
    riskHeading: "Lowering risk",
    gapsHeading: "Filling in what we don't know",
    trendHeading: "Month by month",
    trendHint: "Earlier months are made up for the prototype. This month is worked out from the data.",
    trendCols: ["Month", "Homes at higher risk", "Damp-proof course not checked", "Engineer visits booked"],
    onTrack: "On track",
    behind: "Needs attention",
    target: "Target",
    thisMonth: "This month (so far)",
    healthNote: "Housing officers ask, with the household's agreement. Engineers never collect health information."
  };

  const C = window.CONTENT, D = window.DATA, $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);

  // Score every home the same way app.js does
  const tenantByHome = {};
  D.tenants.forEach((t) => (tenantByHome[t.home] = t));
  const homes = D.homes.map((h) => {
    const tenant = tenantByHome[h.id] || null;
    const raw = D.sensors[h.id] || null;
    const sensor = raw ? Object.assign({}, raw, window.RISK.summariseSensor(raw)) : null;
    return Object.assign({}, h, { tenant, sensor, risk: window.RISK.assess(h, tenant, sensor) });
  });

  $("tab-progress").textContent = W.tab;
  $("tab-progress").addEventListener("click", render);
  render();

  function decisions() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem("damp-decisions") || "{}"); } catch (e) { /* fine: examples only */ }
    return Object.assign({}, D.cases || {}, saved);
  }

  function render() {
    const dec = decisions();
    const visit = C.detail.options[0], noAction = C.detail.options[C.detail.options.length - 1];
    const higher = homes.filter((h) => h.risk.band.id === "higher");
    const reviewed = higher.filter((h) => dec[h.id]);
    const acted = higher.filter((h) => dec[h.id] && dec[h.id].choice !== noAction);
    const waitingVulnerable = higher.filter((h) => !dec[h.id] && window.RISK.isVulnerable(h.tenant));
    const visits = homes.filter((h) => dec[h.id] && dec[h.id].choice === visit);
    const unassigned = visits.filter((h) => !dec[h.id].engineer);

    const dpcKnown = homes.filter((h) => h.dpc !== "Unknown").length;
    const lived = homes.filter((h) => h.tenant);
    const asked = lived.filter((h) => h.tenant.consent !== "Not asked").length;
    const fillable = visits.reduce((n, h) => n + h.risk.unknowns.filter((u) => !/health|Nobody lives/i.test(u)).length, 0);
    const sensors = homes.filter((h) => h.sensor);
    const readings = sensors.reduce((n, h) => n + h.sensor.humidity.length, 0);
    const missed = sensors.reduce((n, h) => n + h.sensor.missing, 0);

    // [headline, what it means, target text, on track?]
    const risk = [
      [pct(reviewed.length, higher.length) + "%", `of higher-risk homes reviewed by staff (${reviewed.length} of ${higher.length})`, "100%", reviewed.length === higher.length],
      [pct(acted.length, higher.length) + "%", `of higher-risk homes have an action: a visit, a call, a referral or a repair (${acted.length} of ${higher.length})`, "90% or more", pct(acted.length, higher.length) >= 90],
      [waitingVulnerable.length, "higher-risk homes where someone may be more vulnerable, not reviewed yet", "0", waitingVulnerable.length === 0],
      [unassigned.length, `visits booked with no engineer yet (of ${visits.length} booked)`, "0", unassigned.length === 0]
    ];
    const gaps = [
      [pct(dpcKnown, homes.length) + "%", `of homes have had the damp-proof course checked (${homes.length - dpcKnown} still to check)`, "95% or more", pct(dpcKnown, homes.length) >= 95],
      [pct(asked, lived.length) + "%", `of households asked about health (${lived.length - asked} not asked yet). ${W.healthNote}`, "80% or more", pct(asked, lived.length) >= 80],
      [fillable, "missing facts engineers can check on visits already booked", "", null],
      [(((readings - missed) / readings) * 100).toFixed(1) + "%", `of sensor readings received from ${sensors.length} pilot homes (${missed} missed)`, "98% or more", (readings - missed) / readings >= 0.98]
    ];

    // This month's row comes from the live numbers
    const dpcUnknown = homes.length - dpcKnown;
    const months = (D.progress || [])
      .map((m) => ({ month: m.month, higher: higher.length + m.higherMore, dpcUnknown: dpcUnknown + m.dpcUnknownMore, visits: m.visits }))
      .concat([{ month: null, higher: higher.length, dpcUnknown, visits: visits.length }]);
    const max = (k) => Math.max(...months.map((m) => m[k]), 1);
    const bar = (v, k) => `<span class="kpi-bar"><i style="width:${Math.round((v / max(k)) * 100)}%"></i></span>${v}`;

    $("progress").innerHTML = `
      <h2 id="progress-heading">${esc(W.heading)}</h2>
      <p class="hint">${esc(W.hint)}</p>
      <h3>${esc(W.riskHeading)}</h3>${cards(risk)}
      <h3>${esc(W.gapsHeading)}</h3>${cards(gaps)}
      <h3>${esc(W.trendHeading)}</h3>
      <p class="hint">${esc(W.trendHint)}</p>
      <div class="table-wrap"><table class="kpi-trend">
        <thead><tr>${W.trendCols.map((c) => `<th scope="col">${esc(c)}</th>`).join("")}</tr></thead>
        <tbody>${months.map((m) => `<tr>
          <th scope="row">${m.month ? monthName(m.month) : esc(W.thisMonth)}</th>
          <td>${bar(m.higher, "higher")}</td><td>${bar(m.dpcUnknown, "dpcUnknown")}</td><td>${bar(m.visits, "visits")}</td>
        </tr>`).join("")}</tbody>
      </table></div>`;
  }

  function cards(items) {
    return `<ul class="kpis">${items.map(([num, text, target, ok]) => `<li class="${ok === null ? "" : ok ? "ok" : "behind"}">
      <span class="num">${esc(num)}</span>${esc(text)}
      ${target ? `<span class="kpi-status">${esc(W.target)}: ${esc(target)}. <strong>${ok ? "✓ " + esc(W.onTrack) : "! " + esc(W.behind)}</strong></span>` : ""}
    </li>`).join("")}</ul>`;
  }

  function monthName(m) {
    const [y, mo] = m.split("-").map(Number);
    return new Date(y, mo - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  }
})();
