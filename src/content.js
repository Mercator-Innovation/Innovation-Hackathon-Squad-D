// The words people see. Change them here without touching the code.
window.CONTENT = {
  banner: "Prototype with made-up homes and people. Not a real service.",
  title: "Homes at risk of damp and cold",
  lead: "Find the homes and households most at risk, before anyone gets ill or reports a problem. The score helps you choose who to look at first. You make the call.",

  summary: {
    higher: "homes at higher risk",
    medium: "homes at medium risk",
    lower: "homes at lower risk",
    sensors: "homes in the sensor pilot"
  },

  filters: {
    heading: "Show",
    area: "Area",
    allAreas: "All areas",
    setting: "Setting",
    allSettings: "Urban and rural",
    coast: "Coastal or inland",
    allCoast: "Coastal and inland",
    band: "Risk",
    allBands: "All risk levels",
    sensorOnly: "Only homes with a sensor",
    unreviewed: "Only homes nobody has reviewed",
    search: "Home reference",
    searchHint: "For example, H01",
    reset: "Show everything"
  },

  map: {
    heading: "Where the risk is",
    hint: "Darker squares mean a higher average score for the layer you've picked. Select a dot to look at that home.",
    water: "The firth",
    showDots: "Show each home",
    legendLow: "Lower",
    legendHigh: "Higher",
    legendUnknown: "Most households here haven't told Cloch about their health",
    madeUp: "Made-up map",
    layer: "Map layer",
    layerOptions: [
      { id: "combined", label: "All factors combined" },
      { id: "property", label: "The property: age, walls, energy, damp-proof course" },
      { id: "household", label: "The household: health, age, income" }
    ],
    householdNote: "Striped squares mean fewer than half the households there have agreed to share whether anyone has a health condition, so the colour there is based on less information."
  },

  areas: {
    heading: "Risk by area",
    cols: ["Area", "Setting", "Homes", "Higher risk", "Share at higher risk", "Average score", "Sensors"]
  },

  list: {
    heading: "Homes to look at first",
    hint: "Sorted by score, highest first. Showing the top {n} of {total}.",
    cols: ["Home", "Area", "Type", "Score", "Risk", "Top reasons", "Decision", ""],
    review: "Review",
    more: "Show 25 more",
    none: "No homes match. Try showing everything."
  },

  detail: {
    close: "Back to the list",
    home: "The home",
    why: "Why it's flagged",
    points: "points",
    unknown: "What we don't know",
    household: "The household",
    householdNote: "Only what the household has told us. Health is shown only where they agreed to share it.",
    empty: "Nobody lives here at the moment.",
    reports: "What's been reported",
    noReports: "Nothing reported in the last five years. That doesn't mean there's no problem: some people never report.",
    sensor: "Sensor readings, 12 to 18 October",
    sensorHint: "How damp the air is (%). Above the dashed line (70%), mould is more likely.",
    decide: "Your decision",
    decideHint: "The score is a guide. What should happen next?",
    options: [
      "Visit and check the home",
      "Phone the household",
      "Refer to the energy advice hub",
      "Refer to the community support team",
      "Book a repair",
      "No action for now"
    ],
    note: "Note (optional)",
    save: "Save decision",
    saved: "Decision saved"
  }
};
