// The words people see. Change them here without touching the code.
window.CONTENT = {
  banner: "Prototype with made-up homes and people. Not a real service.",
  title: "Homes at risk of damp and cold",
  lead: "Find the homes and households most at risk, before anyone gets ill or reports a problem. The risk level helps you choose who to look at first. You make the call.",

  summary: {
    reviewedThisWeek: "homes reviewed this week",
    newReports: "new damp or mould reports this month",
    noContact: "tenants not contacted in 12+ months",
    sensors: "homes in the sensor pilot"
  },

  today: {
    heading: "Today",
    allClear: "Nothing urgent today — you're all caught up.",
    toReview: "higher-risk home{s} not yet reviewed", toReviewButton: "Review now",
    toReviewNone: "No higher-risk homes waiting to be reviewed",
    needsEngineer: "visit{s} booked with no engineer named yet", needsEngineerButton: "Add an engineer",
    needsEngineerNone: "Every booked visit has an engineer named",
    bookedToday: "visit{s} booked today", bookedTodayButton: "View visits",
    bookedTodayNone: "No visits booked today yet"
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
    pulse: "Pulse higher-risk homes where someone may be more vulnerable",
    legendPulse: "Higher risk, and someone may be more vulnerable: a child under 5, someone over 75, or a health condition or disability they've told us about",
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

  tabs: {
    homes: "Homes to look at first",
    areas: "Area overview",
    visits: "Engineer visits booked"
  },

  list: {
    heading: "Homes to look at first",
    hint: "Homes at highest risk first.",
    cols: ["Home", "Area", "Type", "Age", "Risk", "Top reasons", ""],
    review: "Review",
    more: "Show 25 more",
    none: "No homes match. Try showing everything."
  },

  cases: {
    heading: "Engineer visits booked",
    hint: "{n} homes booked for a visit.",
    none: "No visits booked yet. Choose “Visit and check the home” on a home to add one here.",
    cols: ["Home", "Area", "Engineer", "Visit type", "What to log on this visit", "Evidence", ""],
    engineer: "Engineer",
    engineerHint: "e.g. Pat Nguyen",
    visitType: "Visit type",
    nothingMissing: "Nothing missing — just confirm what's already known",
    evidenceCount: "{n} photo{s} on file",
    noEvidence: "No evidence uploaded",
    review: "Open"
  },

  detail: {
    close: "Back to the list",
    home: "The home",
    why: "Why it's flagged",
    whyMore: "View {n} more",
    whyFewer: "Show fewer",
    points: "points",
    missing: "Information missing",
    missingTag: "Missing",
    notSharedTag: "Not shared",
    gaps: {
      vacant: { what: "Who lives here", next: "Nobody lives here at the moment. Check the home before someone moves in." },
      dpc: { what: "Damp-proof course", next: "Add a damp-proof course check to the next visit." },
      healthNotAsked: { what: "Health", next: "We haven't asked. Next time you're in touch, ask if they'd like to share it." },
      healthNotShared: { what: "Health", next: "The household chose not to share this. Respect their choice." },
      sensor: { what: "Sensor readings", next: "Only a few homes have sensors. Consider one here if other signs point to damp." },
      sensorGaps: { what: "Some sensor readings", next: "The sensor missed {n} readings. Check it's working." }
    },
    household: "The household",
    householdNote: "Only what the household has told us. Health is shown only where they agreed to share it.",
    empty: "Nobody lives here at the moment.",
    reports: "What's been reported",
    noReports: "Nothing reported in the last five years. That doesn't mean there's no problem: some people never report.",
    sensor: "Sensor readings, 12 to 18 October",
    sensorHint: "How damp the air is (%). Above the dashed line (70%), mould is more likely.",
    decide: "Engineer booked",
    options: [
      "Visit and check the home",
      "Phone the household",
      "Refer to the energy advice hub",
      "Refer to the community support team",
      "Book a repair",
      "No action for now"
    ],
    engineer: "Engineer name",
    engineerMissing: "Enter the engineer's name",
    engineerHint: "e.g. Pat Nguyen",
    visitType: "Visit type",
    visitTypeOptions: [
      "Check only",
      "Combined with a repair visit",
      "Installing a sensor",
      "Urgent visit"
    ],
    evidence: "Evidence",
    noEvidence: "No photos yet",
    addPhoto: "Add photo",
    viewPhoto: "Photo {n} from this visit. Opens full size in a new tab.",
    note: "Note (optional)",
    save: "Confirm",
    saved: "Engineer booked"
  }
};
