// How the risk score works. Change the points here to change who comes to the top.
// Every rule that applies adds its points, and staff see each one as a reason.
// A person makes the final call: the score only helps decide who to look at first.

window.RISK = {
  bands: [
    { id: "higher", label: "Higher risk", min: 15 },
    { id: "medium", label: "Medium risk", min: 9 },
    { id: "lower", label: "Lower risk", min: 0 }
  ],

  rules: [
    // The home
    { group: "Home", points: 3, label: "Built before 1920", test: (h) => h.built < 1920 },
    { group: "Home", points: 2, label: "Built 1920 to 1964", test: (h) => h.built >= 1920 && h.built < 1965 },
    { group: "Home", points: 1, label: "Built 1965 to 1989", test: (h) => h.built >= 1965 && h.built < 1990 },
    { group: "Home", points: 2, label: "Solid walls with no insulation", test: (h) => h.walls === "Solid stone" || h.walls === "Solid brick" },
    { group: "Home", points: 1, label: "Concrete panel or uninsulated cavity walls", test: (h) => h.walls === "Concrete panel" || h.walls === "Cavity, not insulated" },
    { group: "Home", points: 2, label: "Energy rating E, F or G", test: (h) => "EFG".includes(h.epc) },
    { group: "Home", points: 1, label: "Energy rating D", test: (h) => h.epc === "D" },
    { group: "Home", points: 2, label: "No ventilation", test: (h) => h.ventilation === "None" },
    { group: "Home", points: 1, label: "Only partial ventilation", test: (h) => h.ventilation === "Bathroom fan only" || h.ventilation === "Trickle vents" },
    { group: "Home", points: 1, label: (h) => "Exposed: " + h.exposure.toLowerCase(), test: (h) => h.exposure !== "Sheltered" },
    { group: "Home", points: 2, label: "Damp-proof course failed or cracked", test: (h) => /failed|cracked/.test(h.dpc) },
    { group: "Home", points: 1, label: "Damp-proof course not known", test: (h) => h.dpc === "Unknown" },

    // What's been reported
    { group: "Reports", points: 4, label: "Damp or mould reported 2 or more times in the last 3 years", test: (h) => dampSince(h, "2023-10") >= 2 },
    { group: "Reports", points: 2, label: "Damp or mould reported in the last 3 years", test: (h) => dampSince(h, "2023-10") === 1 },
    { group: "Reports", points: 1, label: "Damp or mould reported 3 to 5 years ago", test: (h) => dampSince(h, "2023-10") === 0 && dampSince(h, "0000") > 0 },

    // The sensor pilot
    { group: "Sensor", points: 4, label: "Air damp (70% or more) over half the week", test: (h, t, s) => s && s.dampShare >= 0.5 },
    { group: "Sensor", points: 2, label: "Air damp (70% or more) a quarter of the week", test: (h, t, s) => s && s.dampShare >= 0.25 && s.dampShare < 0.5 },
    { group: "Sensor", points: 2, label: "Home averages under 16°C", test: (h, t, s) => s && s.avgTemp < 16 },

    // The household (only what the household has told us)
    { group: "Household", points: 2, label: "Child under 5", test: (h, t) => t && t.under5 },
    { group: "Household", points: 2, label: "Someone over 75", test: (h, t) => t && t.over75 },
    { group: "Household", points: 3, label: "Breathing condition (shared with consent)", test: (h, t) => t && t.breathing === true },
    { group: "Household", points: 1, label: "Other health condition or disability", test: (h, t) => t && (t.otherHealth === true || t.disability) },
    { group: "Household", points: 2, label: "May struggle to afford heating (prepayment meter or arrears)", test: (h, t) => t && (t.prepayment || t.arrears) },
    { group: "Household", points: 1, label: "Low income", test: (h, t) => t && t.lowIncome && !t.prepayment && !t.arrears },
    { group: "Household", points: 1, label: "No contact for over a year", test: (h, t) => t && t.monthsSinceContact >= 12 }
  ]
};

function dampSince(home, fromMonth) {
  return home.reports.filter((r) => r.damp && r.month >= fromMonth).length;
}

// Someone in the home may be more vulnerable to damp and cold. The map pulses these homes.
// Only uses what the household has told us: health only counts where they shared it.
window.RISK.isVulnerable = function (tenant) {
  return !!tenant && (tenant.under5 || tenant.over75 || tenant.breathing === true || tenant.otherHealth === true || tenant.disability);
};

// Returns { score, band, reasons: [{group, label, points}], unknowns: [text] }
window.RISK.assess = function (home, tenant, sensor) {
  const reasons = [];
  for (const rule of window.RISK.rules) {
    if (rule.test(home, tenant, sensor)) {
      reasons.push({
        group: rule.group,
        points: rule.points,
        label: typeof rule.label === "function" ? rule.label(home) : rule.label
      });
    }
  }
  const score = reasons.reduce((sum, r) => sum + r.points, 0);
  const band = window.RISK.bands.find((b) => score >= b.min);

  const unknowns = [];
  if (!tenant) unknowns.push("Nobody lives here at the moment");
  else if (tenant.consent !== "Yes") unknowns.push("Health not known: " + (tenant.consent === "No" ? "the tenant chose not to share it" : "we haven't asked"));
  if (home.dpc === "Unknown") unknowns.push("Damp-proof course not checked");
  if (!sensor) unknowns.push("No sensor in this home");
  else if (sensor.missing > 0) unknowns.push("Sensor missed " + sensor.missing + " readings");

  return { score, band, reasons, unknowns };
};

// Adds up the points from just some groups of reasons, for example to show the map
// coloured by property factors only, or household factors only.
window.RISK.groupScore = function (reasons, groups) {
  return reasons.filter((r) => groups.includes(r.group)).reduce((sum, r) => sum + r.points, 0);
};

// Sums up a week of sensor readings
window.RISK.summariseSensor = function (s) {
  const hum = s.humidity.filter((v) => v !== null);
  const temp = s.temperature.filter((v) => v !== null);
  return {
    dampShare: hum.filter((v) => v >= 70).length / hum.length,
    avgTemp: temp.reduce((a, b) => a + b, 0) / temp.length,
    missing: s.humidity.length - hum.length
  };
};
