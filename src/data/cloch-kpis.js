// Cloch's published figures that link to damp and cold, for the Progress tab.
// REAL, published figures (not about any person), from sketches/cloch-kpis.md (Faye):
// Scottish Housing Regulator, Cloch Housing Association Ltd landlord page.
// higherIsBetter tells the page which way round "better than average" is.
window.DATA = window.DATA || {};
window.DATA.clochKpis = {
  source: "Scottish Housing Regulator",
  url: "https://www.housingregulator.gov.scot/landlord-performance/landlords/cloch-housing-association-ltd/",
  measures: [
    { name: "Homes meeting the Scottish Housing Quality Standard", cloch: 94.0, scotland: 89.5, unit: "%", higherIsBetter: true,
      link: "Free from damp is part of the standard. Checking damp-proof courses and fixing damp keeps homes meeting it." },
    { name: "Satisfied with repairs or maintenance", cloch: 86.8, scotland: 88.1, unit: "%", higherIsBetter: true,
      link: "Fixing damp before it gets bad, and doing it right first time, could lift this." },
    { name: "Reactive repairs completed right first time", cloch: 96.2, scotland: 95.3, unit: "%", higherIsBetter: true,
      link: "Engineers who know what's missing before a visit can fix it in one go." },
    { name: "Average time for non-emergency repairs", cloch: 5.5, scotland: 8.8, unit: " days", higherIsBetter: false,
      link: "Spotting damp early means fewer urgent repairs later." },
    { name: "Average time for emergency repairs", cloch: 2.4, scotland: 3.5, unit: " hours", higherIsBetter: false,
      link: "Damp that's left alone can turn into an urgent repair." },
    { name: "Kept informed about services and outcomes", cloch: 99.7, scotland: 91.4, unit: "%", higherIsBetter: true,
      link: "Tell households what we found and what happens next after every visit." }
  ]
};
