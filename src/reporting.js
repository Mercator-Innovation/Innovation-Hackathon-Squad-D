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
    summaryLabel: "How many KPIs are red, amber and green",
    target: "Target",
    noRag: "For information",
    planVsActual: "Planned and actual, May to October",
    planned: "Planned",
    actual: "Actual",
    month: "Month",
    showNumbers: "Show the numbers (earlier months made up)",
    thisMonth: "This month (so far)",
    healthNote: "Housing officers ask, with the household's agreement. Engineers never collect health information.",
    publishedHeading: "How this links to Cloch's published measures",
    publishedHint: "Cloch's own figures, published for every Scottish social landlord. They cover the whole service, not just damp, so the tool can only help move them.",
    publishedCols: ["Measure", "Cloch", "Scottish average", "How this tool can help"],
    better: "Better than average",
    worse: "Below average",
    source: "Source:"
  };

  const C = window.CONTENT, D = window.DATA, $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);

  // RAG status: a symbol and a word as well as a colour, so it never relies on colour alone
  const RAG = {
    red: { name: "Red", label: "off track", icon: "✕" },
    amber: { name: "Amber", label: "at risk", icon: "!" },
    green: { name: "Green", label: "on track", icon: "✓" }
  };
  function ragFor(k) {
    if (k.up === undefined) return null;
    if (k.up) return k.value >= k.green ? "green" : k.value >= k.amber ? "amber" : "red";
    return k.value <= k.green ? "green" : k.value <= k.amber ? "amber" : "red";
  }
  // The rules in words, for example "Green 90%+ · Amber 50–89% · Red under 50%"
  function rules(k) {
    const u = k.unit || "";
    return k.up
      ? `Green ${k.green}${u}+ · Amber ${k.amber}–${k.green - 1}${u} · Red under ${k.amber}${u}`
      : `Green ${k.green} · Amber ${k.green + 1}–${k.amber} · Red over ${k.amber}`;
  }

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

    // Each KPI: the value, what it means, and its RAG rules (example rules for Cloch to set).
    // up: bigger is better (green at `green` or more, amber at `amber` or more). down: smaller is better.
    const sensorPct = Math.round(((readings - missed) / readings) * 1000) / 10;
    const risk = [
      { id: "reviewed", value: pct(reviewed.length, higher.length), unit: "%", text: `of higher-risk homes reviewed by staff (${reviewed.length} of ${higher.length})`, up: true, green: 90, amber: 50, target: 100 },
      { id: "acted", value: pct(acted.length, higher.length), unit: "%", text: `of higher-risk homes have an action: a visit, a call, a referral or a repair (${acted.length} of ${higher.length})`, up: true, green: 90, amber: 50, target: 90 },
      { id: "vulnerable", value: waitingVulnerable.length, text: "higher-risk homes where someone may be more vulnerable, not reviewed yet", up: false, green: 0, amber: 10 },
      { id: "unassigned", value: unassigned.length, text: `visits booked with no engineer yet (of ${visits.length} booked)`, up: false, green: 0, amber: 2 }
    ];
    const gaps = [
      { id: "dpc", value: pct(dpcKnown, homes.length), unit: "%", text: `of homes have had the damp-proof course checked (${homes.length - dpcKnown} still to check)`, up: true, green: 95, amber: 85, target: 95 },
      { id: "asked", value: pct(asked, lived.length), unit: "%", text: `of households asked about health (${lived.length - asked} not asked yet). ${W.healthNote}`, up: true, green: 80, amber: 60, target: 80 },
      { value: fillable, text: "missing facts engineers can check on visits already booked" },
      { id: "sensor", value: sensorPct, unit: "%", text: `of sensor readings received from ${sensors.length} pilot homes (${missed} missed)`, up: true, green: 98, amber: 95, target: 98 }
    ];
    risk.concat(gaps).forEach((k) => (k.rag = ragFor(k)));

    // This month's row comes from the live numbers
    const dpcUnknown = homes.length - dpcKnown;
    const months = (D.progress || [])
      .map((m) => ({ month: m.month, higher: higher.length + m.higherMore, dpcUnknown: dpcUnknown + m.dpcUnknownMore, visits: m.visits }))
      .concat([{ month: null, higher: higher.length, dpcUnknown, visits: visits.length }]);
    const max = (k) => Math.max(...months.map((m) => m[k]), 1);
    // The last row also says how much it changed since last month, and whether that's good
    const bar = (v, k, i, downIsGood) => {
      const prev = i > 0 ? months[i - 1][k] : null;
      const diff = prev === null || i < months.length - 1 ? "" : v - prev;
      const change = diff === "" || diff === 0 ? "" :
        `<span class="kpi-change ${(diff < 0) === downIsGood ? "good" : "bad"}">${diff < 0 ? "↓" : "↑"} ${Math.abs(diff)}</span>`;
      return `<span class="kpi-bar ${k}"><i style="width:${Math.round((v / max(k)) * 100)}%"></i></span>${v}${change}`;
    };

    const all = risk.concat(gaps).filter((k) => k.rag);
    const count = (r) => all.filter((k) => k.rag === r).length;

    $("progress").innerHTML = `
      <h2 id="progress-heading">${esc(W.heading)}</h2>
      <p class="hint">${esc(W.hint)}</p>
      <ul class="rag-summary" aria-label="${esc(W.summaryLabel)}">
        ${["red", "amber", "green"].map((r) => `<li class="rag-${r}"><span class="num">${count(r)}</span><span>${RAG[r].icon} ${esc(RAG[r].name)}: ${esc(RAG[r].label)}</span></li>`).join("")}
      </ul>
      <h3>${esc(W.riskHeading)}</h3>${cards(risk)}
      <h3>${esc(W.gapsHeading)}</h3>${cards(gaps)}
      <h3>${esc(W.trendHeading)}</h3>
      <p class="hint">${esc(W.trendHint)}</p>
      <div class="table-wrap"><table class="kpi-trend">
        <thead><tr>${W.trendCols.map((c) => `<th scope="col">${esc(c)}</th>`).join("")}</tr></thead>
        <tbody>${months.map((m, i) => `<tr>
          <th scope="row">${m.month ? monthName(m.month) : esc(W.thisMonth)}</th>
          <td>${bar(m.higher, "higher", i, true)}</td><td>${bar(m.dpcUnknown, "dpcUnknown", i, true)}</td><td>${bar(m.visits, "visits", i, false)}</td>
        </tr>`).join("")}</tbody>
      </table></div>
      ${published()}`;
  }

  // Cloch's published figures (data/cloch-kpis.js), with what the tool could do for each
  function published() {
    const P = D.clochKpis;
    if (!P) return "";
    return `<h3>${esc(W.publishedHeading)}</h3>
      <p class="hint">${esc(W.publishedHint)}</p>
      <div class="table-wrap"><table class="kpi-published">
        <thead><tr>${W.publishedCols.map((c) => `<th scope="col">${esc(c)}</th>`).join("")}</tr></thead>
        <tbody>${P.measures.map((m) => {
          const ahead = m.higherIsBetter ? m.cloch >= m.scotland : m.cloch <= m.scotland;
          return `<tr class="${ahead ? "" : "behind"}">
            <th scope="row">${esc(m.name)}</th>
            <td>${m.cloch.toFixed(1)}${esc(m.unit)}<span class="kpi-compare">${ahead ? "✓ " + esc(W.better) : "! " + esc(W.worse)}</span></td>
            <td>${m.scotland.toFixed(1)}${esc(m.unit)}</td>
            <td>${esc(m.link)}</td>
          </tr>`;
        }).join("")}</tbody>
      </table></div>
      <p class="hint">${esc(W.source)} <a href="${esc(P.url)}">${esc(P.source)}</a></p>`;
  }

  function cards(items) {
    return `<ul class="kpis">${items.map((k) => {
      const r = k.rag ? RAG[k.rag] : null;
      const pill = r
        ? `<span class="rag-pill">${r.icon} ${esc(r.name)}<span class="rag-pill-label">: ${esc(r.label)}</span></span>`
        : `<span class="rag-pill">${esc(W.noRag)}</span>`;
      // A bar towards 100%, with a line where the target is (percentages only)
      const meter = k.unit === "%"
        ? `<span class="kpi-meter" aria-hidden="true"><i style="width:${Math.min(k.value, 100)}%"></i>${k.target ? `<b style="left:${k.target}%"></b>` : ""}</span>` : "";
      return `<li class="rag-${k.rag || "none"}">
        ${pill}
        <span class="num">${esc(k.value)}${esc(k.unit || "")}</span>
        <span class="kpi-text">${esc(k.text)}</span>
        ${meter}
        ${r ? `<span class="kpi-rules">${k.target !== undefined ? `${esc(W.target)} ${k.target}${esc(k.unit || "")}. ` : ""}${esc(rules(k))}</span>` : ""}
        ${planChart(k)}
      </li>`;
    }).join("")}</ul>`;
  }

  // Planned vs actual, month by month, as pairs of bars: planned is an outline, actual is solid.
  // Earlier months come from data/kpiPlan in progress.js (made up); this month's actual is live.
  function planChart(k) {
    const P = D.kpiPlan, series = P && P[k.id];
    if (!series) return "";
    const pc = k.unit === "%";
    const round = (v) => Math.round(v * 10) / 10;
    const clamp = (v) => Math.max(0, pc ? Math.min(100, v) : v);
    const actual = series.actualMore.map((d) => clamp(round(k.value + d))).concat([k.value]);
    const plan = series.plan;
    const top = pc ? 100 : Math.max(1, ...plan, ...actual);
    const w = 300, h = 120, base = 100, bw = 16, gap = w / plan.length;
    const y = (v) => base - (v / top) * (base - 8);
    const short = (m) => new Date(m + "-01").toLocaleDateString("en-GB", { month: "short" });
    const bars = plan.map((p, i) => {
      const x = i * gap + (gap - bw * 2 - 2) / 2;
      return `<rect class="plan" x="${x}" y="${y(p)}" width="${bw}" height="${base - y(p)}"></rect>
        <rect class="actual" x="${x + bw + 2}" y="${y(actual[i])}" width="${bw}" height="${Math.max(base - y(actual[i]), 1)}"></rect>
        <text x="${i * gap + gap / 2}" y="${h - 4}" text-anchor="middle">${short(P.months[i])}</text>`;
    }).join("");
    const u = k.unit || "";
    const last = plan.length - 1;
    const label = `${W.planVsActual}: this month planned ${plan[last]}${u}, actual ${actual[last]}${u}`;
    const rows = plan.map((p, i) => `<tr><th scope="row">${monthName(P.months[i])}</th><td>${p}${esc(u)}</td><td>${actual[i]}${esc(u)}</td></tr>`).join("");
    return `<div class="kpi-plan">
      <span class="kpi-plan-key"><i class="plan"></i>${esc(W.planned)} <i class="actual"></i>${esc(W.actual)}</span>
      <svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}"><line class="axis" x1="0" x2="${w}" y1="${base}" y2="${base}"></line>${bars}</svg>
      <details><summary>${esc(W.showNumbers)}</summary>
        <table><thead><tr><th scope="col">${esc(W.month)}</th><th scope="col">${esc(W.planned)}</th><th scope="col">${esc(W.actual)}</th></tr></thead><tbody>${rows}</tbody></table>
      </details>
    </div>`;
  }

  function monthName(m) {
    const [y, mo] = m.split("-").map(Number);
    return new Date(y, mo - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  }
})();
