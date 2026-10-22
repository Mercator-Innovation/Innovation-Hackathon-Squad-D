// Month-by-month history for the Progress tab, so it can show a trend.
// MADE-UP numbers: the prototype has no real history. This month's figures are worked out live from the data,
// and earlier months are this month's figure plus the number here, so the trend still makes sense if the data changes.
window.DATA = window.DATA || {};
window.DATA.progress = [
  { month: "2026-05", higherMore: 31, dpcUnknownMore: 79, visits: 2 },
  { month: "2026-06", higherMore: 25, dpcUnknownMore: 60, visits: 4 },
  { month: "2026-07", higherMore: 19, dpcUnknownMore: 47, visits: 3 },
  { month: "2026-08", higherMore: 12, dpcUnknownMore: 29, visits: 5 },
  { month: "2026-09", higherMore: 6, dpcUnknownMore: 12, visits: 6 }
];

// Planned vs actual for each KPI, May to October 2026. MADE UP, like the history above.
// plan: what Cloch planned to reach each month, including this month.
// actualMore: earlier months' actual figure = this month's live figure plus this number (May to September).
window.DATA.kpiPlan = {
  months: ["2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10"],
  reviewed:   { plan: [10, 25, 40, 55, 70, 85], actualMore: [-4, -3, -3, -2, -1] },
  acted:      { plan: [10, 25, 40, 55, 70, 85], actualMore: [-4, -3, -3, -2, -1] },
  vulnerable: { plan: [60, 50, 40, 30, 20, 10], actualMore: [12, 9, 7, 4, 2] },
  unassigned: { plan: [3, 2, 2, 1, 1, 0], actualMore: [2, 3, 1, 2, 0] },
  dpc:        { plan: [76, 80, 84, 88, 91, 95], actualMore: [-6, -5, -4, -2, -1] },
  asked:      { plan: [50, 56, 62, 68, 74, 80], actualMore: [-9, -7, -5, -3, -1] },
  sensor:     { plan: [98, 98, 98, 98, 98, 98], actualMore: [-1.2, -0.5, -0.9, -0.3, -0.1] }
};
