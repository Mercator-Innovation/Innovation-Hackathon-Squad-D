// The engineer/tradesperson field view: a click-through app, one screen at a time.
// Saves to this browser only (localStorage), under "damp-field-reports".
// Deliberately asks nothing about a household's health: that stays with
// housing officers, and only with the household's consent.
(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const homes = (window.DATA && window.DATA.homes) || [];
  const KEY = "damp-field-reports";

  const WHAT_FOUND = [
    { id: "damp", label: "Damp patches on walls or ceiling" },
    { id: "mould", label: "Mould" },
    { id: "condensation", label: "Condensation on windows" },
    { id: "cold", label: "Cold, or heating not working well" },
    { id: "ventilation", label: "Can't open a window, or no fresh air" },
    { id: "smell", label: "Smell of damp" },
    { id: "leak", label: "A leak" },
    { id: "structural", label: "Crack or damage to the walls or ceiling" },
    { id: "other", label: "Something else" }
  ];
  const URGENCY_LABEL = { ok: "Just noting it", soon: "Needs a look soon", now: "Needs action now" };

  // Engineers identify a home the way they would in person (area, type, floor, age),
  // not by its reference code. The code (h.id) stays in the data so a report can
  // still be matched to the right record; it's just never shown on screen.
  function describeHome(h) {
    return `${h.area} — ${h.type}, ${h.floor}, built ${h.built}`;
  }

  let selectedHome = null;
  let photoData = null;

  // ---------- Screens, in the order a report normally moves through
  const SCREENS = ["start", "home", "about", "found", "urgency", "detail", "review", "sent"];
  const STEP_OF = { home: 1, about: 2, found: 3, urgency: 4, detail: 5 }; // "Step n of 5"
  let history = ["start"];

  function goTo(name, push) {
    SCREENS.forEach((s) => { $("screen-" + s).hidden = s !== name; });
    if (push !== false) history.push(name);
    $("back-btn").hidden = history.length <= 1;
    $("step-label").textContent = STEP_OF[name] ? `Step ${STEP_OF[name]} of 5` : "";
    if (name === "review") renderReview();
    const screen = $("screen-" + name);
    screen.focus();
    screen.scrollIntoView({ block: "start" });
  }

  $("back-btn").addEventListener("click", () => {
    history.pop();
    goTo(history[history.length - 1], false);
  });

  $("start-btn").addEventListener("click", () => goTo("home"));

  // ---------- Build the "what did you find" checkboxes
  $("what-found").innerHTML = WHAT_FOUND.map((w) =>
    `<label class="choice"><input type="checkbox" id="w-${w.id}" value="${w.id}"><span>${esc(w.label)}</span></label>`
  ).join("");
  $("what-found").querySelectorAll('input[type="checkbox"]').forEach((cb) =>
    cb.addEventListener("change", () => {
      $("other-wrap").hidden = !$("w-other").checked;
      $("found-next").disabled = !anyFound();
    })
  );
  function anyFound() {
    return Array.from($("what-found").querySelectorAll('input[type="checkbox"]')).some((cb) => cb.checked);
  }

  // ---------- Screen: home
  $("home-search").addEventListener("input", (e) => {
    const q = e.target.value.trim().toUpperCase();
    if (!q) { $("home-results").hidden = true; return; }
    const matches = homes.filter((h) => h.id.toUpperCase().includes(q) || h.area.toUpperCase().includes(q)).slice(0, 8);
    if (!matches.length) {
      $("home-results").innerHTML = `<div style="padding:12px;color:var(--muted)">No home matches "${esc(e.target.value)}"</div>`;
      $("home-results").hidden = false;
      return;
    }
    $("home-results").innerHTML = matches.map((h) =>
      `<button type="button" data-id="${esc(h.id)}">${esc(describeHome(h))}</button>`
    ).join("");
    $("home-results").hidden = false;
  });

  $("home-results").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-id]");
    if (!btn) return;
    const home = homes.find((h) => h.id === btn.dataset.id);
    if (home) chooseHome(home);
  });

  function chooseHome(home) {
    selectedHome = home;
    $("home-results").hidden = true;
    $("home-search").value = "";
    const card = `<div class="home-card">
      <div><div class="ref">${esc(home.area)}</div><div class="meta">${esc(home.type)}, ${esc(home.floor)}, built ${home.built}</div></div>
    </div>`;
    $("about-home-card").innerHTML = card;
    goTo("about");
  }

  // ---------- Screen: about
  $("about-next").addEventListener("click", () => goTo("found"));

  // ---------- Screen: found
  $("found-next").addEventListener("click", () => goTo("urgency"));

  // ---------- Screen: urgency
  $("screen-urgency").querySelectorAll('input[name="urgency"]').forEach((r) =>
    r.addEventListener("change", () => { $("urgency-next").disabled = false; })
  );
  $("urgency-next").addEventListener("click", () => goTo("detail"));

  // ---------- Screen: detail (photo)
  $("r-photo").addEventListener("change", (e) => {
    const file = e.target.files[0];
    photoData = null;
    $("photo-preview").innerHTML = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      photoData = reader.result;
      $("photo-preview").innerHTML = `<img src="${photoData}" alt="Photo you added">`;
    };
    reader.readAsDataURL(file);
  });
  $("detail-next").addEventListener("click", () => goTo("review"));

  // ---------- Screen: review
  function currentAnswers() {
    const found = Array.from($("what-found").querySelectorAll('input[type="checkbox"]:checked')).map((cb) => cb.value);
    const urgency = ($("screen-urgency").querySelector('input[name="urgency"]:checked') || {}).value;
    const spoke = ($("screen-about").querySelector('input[name="spoke"]:checked') || {}).value || "Not said";
    return {
      home: selectedHome,
      reporterName: $("r-name").value.trim(),
      reporterRole: $("r-role").value,
      spokeToHousehold: spoke,
      found,
      foundLabels: found.map((id) => (WHAT_FOUND.find((w) => w.id === id) || {}).label || id),
      otherDetail: found.includes("other") ? $("r-other").value.trim() : "",
      where: $("r-where").value,
      urgency,
      notes: $("r-notes").value.trim(),
      photo: photoData
    };
  }

  function summaryRow(label, value, editScreen) {
    return `<div class="summary-item"><div><div class="k">${esc(label)}</div><div class="v">${esc(value)}</div></div>
      <button type="button" class="link-button edit" data-edit="${esc(editScreen)}">Edit</button></div>`;
  }

  function renderReview() {
    const a = currentAnswers();
    $("review-summary").innerHTML =
      summaryRow("Home", describeHome(a.home), "home") +
      summaryRow("Reported by", (a.reporterName || "Not given") + " (" + a.reporterRole + ")", "about") +
      summaryRow("Spoke to household", a.spokeToHousehold, "about") +
      summaryRow("What was found", a.foundLabels.join(", ") + (a.otherDetail ? ": " + a.otherDetail : ""), "found") +
      summaryRow("Where", a.where, "urgency") +
      summaryRow("How urgent", URGENCY_LABEL[a.urgency] || a.urgency, "urgency") +
      summaryRow("Notes", a.notes || "None added", "detail") +
      summaryRow("Photo", a.photo ? "Added" : "None added", "detail");

    $("review-summary").querySelectorAll("button[data-edit]").forEach((b) =>
      b.addEventListener("click", () => goTo(b.dataset.edit))
    );
  }

  $("send-btn").addEventListener("click", () => {
    const a = currentAnswers();
    const report = {
      home: a.home.id, area: a.home.area, type: a.home.type, floor: a.home.floor, built: a.home.built,
      when: new Date().toISOString(),
      reporterName: a.reporterName, reporterRole: a.reporterRole, spokeToHousehold: a.spokeToHousehold,
      found: a.found, otherDetail: a.otherDetail, where: a.where, urgency: a.urgency,
      notes: a.notes, photo: a.photo, reviewed: false
    };
    const all = load();
    all.push(report);
    save(all);

    $("sent-message").textContent = `Added to ${describeHome(a.home)}. Housing officers will see this on the home's record.`;
    history = ["start", "sent"];
    goTo("sent", false);
    renderSent();
    renderStartCount();
  });

  $("report-another").addEventListener("click", () => {
    resetForm();
    history = ["start", "home"];
    goTo("home", false);
  });
  $("done-btn").addEventListener("click", () => {
    resetForm();
    history = ["start"];
    goTo("start", false);
    renderStartCount();
  });
  $("see-reports-link").addEventListener("click", () => {
    history = ["start", "sent"];
    goTo("sent", false);
    $("sent-message").textContent = "";
    renderSent();
  });

  function resetForm() {
    selectedHome = null;
    photoData = null;
    $("home-search").value = "";
    $("r-name").value = ""; $("r-role").selectedIndex = 0;
    $("screen-about").querySelectorAll('input[name="spoke"]').forEach((r) => (r.checked = false));
    $("what-found").querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = false));
    $("other-wrap").hidden = true; $("r-other").value = "";
    $("r-where").selectedIndex = 0;
    $("screen-urgency").querySelectorAll('input[name="urgency"]').forEach((r) => (r.checked = false));
    $("urgency-next").disabled = true;
    $("found-next").disabled = true;
    $("r-notes").value = "";
    $("r-photo").value = "";
    $("photo-preview").innerHTML = "";
  }

  // ---------- This device's reports today, so an engineer can see what they've logged
  function renderSent() {
    const all = load();
    $("sent-section").hidden = !all.length;
    $("sent-list").innerHTML = all.slice().reverse().map((r) => {
      const whatLabels = r.found.map((id) => (WHAT_FOUND.find((w) => w.id === id) || {}).label || id);
      return `<li><span class="tag ${r.urgency}">${esc(URGENCY_LABEL[r.urgency] || r.urgency)}</span>
        ${esc(describeHome(r))}: ${esc(whatLabels.join(", "))}</li>`;
    }).join("");
  }

  function renderStartCount() {
    const n = load().length;
    $("start-count").hidden = !n;
    $("start-count-text").textContent = n === 1 ? "1 report sent today" : n + " reports sent today";
  }

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; }
  }
  function save(all) {
    try { localStorage.setItem(KEY, JSON.stringify(all)); } catch (e) { /* fine: kept for this visit */ }
  }

  renderStartCount();
})();
