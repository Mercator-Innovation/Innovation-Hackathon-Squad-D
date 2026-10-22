// Synthetic data for Challenge 1: Healthier homes.
// Not real tenants or real records. Built from open data patterns:
// - Area names and apartment-size mix: Cloch Housing Association's published
//   stock profile (housingregulator.gov.scot, clochhousing.org.uk/our-stock-area)
// - EPC band spread and property-type mix: Scottish House Condition Survey
//   2024 Key Findings (social-sector homes are mostly EPC C/D, ~4% in E/F/G),
//   and Inverclyde's general housing mix (a blend of flats, tenements and
//   terraced/semi-detached houses) — invented per-record, not sourced per-property.
// Vulnerability flags and contact history are entirely made up, for building
// and demoing with, not drawn from any real person.
//
// When the first version exists in src/, move this file to src/data/ as-is
// (it already uses window.DATA so it can be loaded with a plain <script> tag).

window.DATA = {
  tenants: [
    { id: "T001", area: "Wellpark", propertyType: "Tenement flat", apartmentSize: 2, epcBand: "D", dampMouldReported: true, lastReportedDaysAgo: 12, repairsLast12Months: 3, vulnerability: { olderPerson: false, childUnder5: true, respiratoryCondition: true, lowIncome: true }, lastContactDaysAgo: 12 },
    { id: "T002", area: "Greenock East", propertyType: "Terraced house", apartmentSize: 3, epcBand: "C", dampMouldReported: false, lastReportedDaysAgo: null, repairsLast12Months: 0, vulnerability: { olderPerson: true, childUnder5: false, respiratoryCondition: false, lowIncome: false }, lastContactDaysAgo: 40 },
    { id: "T003", area: "Maukinhill", propertyType: "Tenement flat", apartmentSize: 1, epcBand: "E", dampMouldReported: true, lastReportedDaysAgo: 3, repairsLast12Months: 5, vulnerability: { olderPerson: true, childUnder5: false, respiratoryCondition: true, lowIncome: true }, lastContactDaysAgo: 3 },
    { id: "T004", area: "Port Glasgow", propertyType: "Semi-detached house", apartmentSize: 3, epcBand: "C", dampMouldReported: false, lastReportedDaysAgo: null, repairsLast12Months: 1, vulnerability: { olderPerson: false, childUnder5: false, respiratoryCondition: false, lowIncome: true }, lastContactDaysAgo: 60 },
    { id: "T005", area: "Larkfield", propertyType: "Bungalow (amenity)", apartmentSize: 2, epcBand: "D", dampMouldReported: false, lastReportedDaysAgo: null, repairsLast12Months: 0, vulnerability: { olderPerson: true, childUnder5: false, respiratoryCondition: true, lowIncome: false }, lastContactDaysAgo: 200 },
    { id: "T006", area: "Inverkip", propertyType: "Terraced house", apartmentSize: 3, epcBand: "B", dampMouldReported: false, lastReportedDaysAgo: null, repairsLast12Months: 0, vulnerability: { olderPerson: false, childUnder5: true, respiratoryCondition: false, lowIncome: false }, lastContactDaysAgo: 30 },
    { id: "T007", area: "Central Greenock", propertyType: "Tenement flat", apartmentSize: 2, epcBand: "E", dampMouldReported: true, lastReportedDaysAgo: 25, repairsLast12Months: 4, vulnerability: { olderPerson: false, childUnder5: true, respiratoryCondition: true, lowIncome: true }, lastContactDaysAgo: 25 },
    { id: "T008", area: "Wellpark", propertyType: "Block of flats (maisonette)", apartmentSize: 3, epcBand: "D", dampMouldReported: false, lastReportedDaysAgo: null, repairsLast12Months: 2, vulnerability: { olderPerson: false, childUnder5: false, respiratoryCondition: false, lowIncome: true }, lastContactDaysAgo: 15 },
    { id: "T009", area: "Greenock East", propertyType: "Tenement flat", apartmentSize: 1, epcBand: "F", dampMouldReported: true, lastReportedDaysAgo: 2, repairsLast12Months: 6, vulnerability: { olderPerson: true, childUnder5: false, respiratoryCondition: true, lowIncome: true }, lastContactDaysAgo: 2 },
    { id: "T010", area: "Maukinhill", propertyType: "Semi-detached house", apartmentSize: 4, epcBand: "C", dampMouldReported: false, lastReportedDaysAgo: null, repairsLast12Months: 1, vulnerability: { olderPerson: false, childUnder5: true, respiratoryCondition: false, lowIncome: false }, lastContactDaysAgo: 50 },
    { id: "T011", area: "Port Glasgow", propertyType: "Tenement flat", apartmentSize: 2, epcBand: "D", dampMouldReported: true, lastReportedDaysAgo: 45, repairsLast12Months: 2, vulnerability: { olderPerson: false, childUnder5: false, respiratoryCondition: true, lowIncome: true }, lastContactDaysAgo: 45 },
    { id: "T012", area: "Larkfield", propertyType: "Terraced house", apartmentSize: 3, epcBand: "C", dampMouldReported: false, lastReportedDaysAgo: null, repairsLast12Months: 0, vulnerability: { olderPerson: false, childUnder5: false, respiratoryCondition: false, lowIncome: false }, lastContactDaysAgo: 90 },
    { id: "T013", area: "Inverkip", propertyType: "Bungalow (sheltered)", apartmentSize: 1, epcBand: "D", dampMouldReported: false, lastReportedDaysAgo: null, repairsLast12Months: 1, vulnerability: { olderPerson: true, childUnder5: false, respiratoryCondition: true, lowIncome: true }, lastContactDaysAgo: 7 },
    { id: "T014", area: "Central Greenock", propertyType: "Tenement flat", apartmentSize: 2, epcBand: "E", dampMouldReported: true, lastReportedDaysAgo: 18, repairsLast12Months: 4, vulnerability: { olderPerson: false, childUnder5: true, respiratoryCondition: true, lowIncome: true }, lastContactDaysAgo: 18 },
    { id: "T015", area: "Wellpark", propertyType: "Terraced house", apartmentSize: 3, epcBand: "C", dampMouldReported: false, lastReportedDaysAgo: null, repairsLast12Months: 0, vulnerability: { olderPerson: false, childUnder5: false, respiratoryCondition: false, lowIncome: false }, lastContactDaysAgo: 120 },
    { id: "T016", area: "Greenock East", propertyType: "Semi-detached house", apartmentSize: 3, epcBand: "D", dampMouldReported: false, lastReportedDaysAgo: null, repairsLast12Months: 1, vulnerability: { olderPerson: true, childUnder5: false, respiratoryCondition: false, lowIncome: true }, lastContactDaysAgo: 100 },
    { id: "T017", area: "Maukinhill", propertyType: "Tenement flat", apartmentSize: 1, epcBand: "G", dampMouldReported: true, lastReportedDaysAgo: 1, repairsLast12Months: 7, vulnerability: { olderPerson: true, childUnder5: false, respiratoryCondition: true, lowIncome: true }, lastContactDaysAgo: 1 },
    { id: "T018", area: "Port Glasgow", propertyType: "Terraced house", apartmentSize: 2, epcBand: "C", dampMouldReported: false, lastReportedDaysAgo: null, repairsLast12Months: 0, vulnerability: { olderPerson: false, childUnder5: true, respiratoryCondition: false, lowIncome: false }, lastContactDaysAgo: 70 },
    { id: "T019", area: "Larkfield", propertyType: "Block of flats (maisonette)", apartmentSize: 2, epcBand: "E", dampMouldReported: true, lastReportedDaysAgo: 33, repairsLast12Months: 3, vulnerability: { olderPerson: false, childUnder5: false, respiratoryCondition: true, lowIncome: true }, lastContactDaysAgo: 33 },
    { id: "T020", area: "Inverkip", propertyType: "Semi-detached house", apartmentSize: 4, epcBand: "D", dampMouldReported: false, lastReportedDaysAgo: null, repairsLast12Months: 0, vulnerability: { olderPerson: false, childUnder5: false, respiratoryCondition: false, lowIncome: false }, lastContactDaysAgo: 150 }
  ]
};
