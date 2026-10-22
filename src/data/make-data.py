"""Makes the prototype's synthetic data: homes.js, tenants.js and sensors.js.

Everything here is MADE UP. The areas, homes and households are invented. The
mix of homes loosely follows sketches/example-homes.md (Joe), the sensor
readings reuse sketches/sensor-readings-glasgow-style.csv (Rebby), and the
building criteria come from the squad's paper notes.

The page doesn't need this script: the .js files it writes are committed. Run it
again only to change the data:  python3 src/data/make-data.py
"""
import csv
import json
import os
import random

random.seed(22102026)  # same data every time
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
TOTAL_HOMES = 1446  # from the paper notes: Cloch's stock is about 1,446 homes
TODAY = (2026, 10, 22)

# ---------------------------------------------------------------- areas
# Invented neighbourhoods. x, y place them on the made-up map (0-1000 by 0-600,
# water along the top). share = rough share of the homes.
AREAS = [
    dict(name="Braeview", setting="Urban", coast="Inland", x=330, y=250, spread=55, share=0.17,
         exposure=["Faces prevailing wind", "Sheltered"],
         types=[("Tenement flat", 1)], built=(1895, 1915),
         walls=[("Solid stone", 1)], heating=[("Gas central heating", 6), ("Electric storage heaters", 3)]),
    dict(name="Shorefield", setting="Urban", coast="Coastal", x=200, y=110, spread=60, share=0.14,
         exposure=["Coastal, open to rain"],
         types=[("Terraced house", 3), ("Four-in-a-block flat", 1)], built=(1930, 1945),
         walls=[("Solid brick", 3), ("Solid brick, insulated outside", 2)],
         heating=[("Gas central heating", 1)]),
    dict(name="Rowan Rise", setting="Urban", coast="Inland", x=520, y=300, spread=60, share=0.16,
         exposure=["Sheltered"],
         types=[("Four-in-a-block flat", 3), ("Semi-detached house", 1)], built=(1948, 1960),
         walls=[("Cavity, not insulated", 3), ("Cavity, insulated", 2)],
         heating=[("Gas central heating", 1)]),
    dict(name="Glenmore Court", setting="Urban", coast="Inland", x=680, y=420, spread=45, share=0.13,
         exposure=["Exposed hillside"],
         types=[("Flat in low-rise block", 1)], built=(1970, 1978),
         walls=[("Concrete panel", 1)], heating=[("Electric panel heaters", 3), ("Gas central heating", 1)]),
    dict(name="Larchfield Gardens", setting="Urban", coast="Inland", x=470, y=470, spread=50, share=0.12,
         exposure=["Sheltered"],
         types=[("Semi-detached house", 2), ("Sheltered flat", 1)], built=(1986, 1996),
         walls=[("Cavity, insulated", 1)], heating=[("Gas central heating", 1)]),
    dict(name="Riverside Way", setting="Urban", coast="Coastal", x=440, y=120, spread=45, share=0.12,
         exposure=["Faces the river"],
         types=[("New-build flat", 4), ("Wheelchair-accessible flat", 1)], built=(2015, 2022),
         walls=[("Timber frame, insulated", 1)], heating=[("Air source heat pump", 2), ("Gas central heating", 1)]),
    dict(name="Port Ardmore", setting="Rural", coast="Coastal", x=850, y=110, spread=50, share=0.08,
         exposure=["Coastal, open to rain"],
         types=[("Terraced cottage", 2), ("Semi-detached house", 1)], built=(1880, 1965),
         walls=[("Solid stone", 2), ("Cavity, not insulated", 1)],
         heating=[("Oil boiler", 2), ("Electric storage heaters", 2), ("Air source heat pump", 1)]),
    dict(name="Kilbrae", setting="Rural", coast="Inland", x=880, y=380, spread=55, share=0.08,
         exposure=["Exposed hillside", "Sheltered"],
         types=[("Detached cottage", 1), ("Semi-detached house", 1)], built=(1890, 1975),
         walls=[("Solid stone", 2), ("Cavity, not insulated", 1)],
         heating=[("Oil boiler", 2), ("Electric storage heaters", 2), ("Solid fuel stove", 1)]),
]

# Joe's twelve example homes, kept exactly as he described them.
JOE_HOMES = [
    ("H01", "Braeview", "Tenement flat", "3 apt", 1905, "Solid stone", "Ground", "E", "Electric storage heaters", "None", "Faces prevailing wind", "Slate, cracked", ["2024-02"]),
    ("H02", "Braeview", "Tenement flat", "2 apt", 1905, "Solid stone", "Top (3rd)", "D", "Gas central heating", "Bathroom fan only", "Faces prevailing wind", "Not applicable", []),
    ("H03", "Rowan Rise", "Four-in-a-block flat", "3 apt", 1952, "Cavity, not insulated", "Ground", "D", "Gas central heating", "Trickle vents", "Sheltered", "Bitumen, works", []),
    ("H04", "Rowan Rise", "Four-in-a-block flat", "3 apt", 1952, "Cavity, not insulated", "Upper", "D", "Gas central heating", "Trickle vents", "Sheltered", "Not applicable", ["2023-11"]),
    ("H05", "Shorefield", "Terraced house", "4 apt", 1938, "Solid brick", "Two storeys", "E", "Gas central heating", "None", "Coastal, open to rain", "Unknown", ["2022-01", "2025-12"]),
    ("H06", "Shorefield", "Terraced house", "3 apt", 1938, "Solid brick, insulated outside", "Two storeys", "C", "Gas central heating", "Kitchen and bathroom fans", "Coastal, open to rain", "Bitumen, works", []),
    ("H07", "Glenmore Court", "Flat in low-rise block", "2 apt", 1974, "Concrete panel", "1st floor", "D", "Electric panel heaters", "Bathroom fan only", "Exposed hillside", "Not applicable", ["2025-03"]),
    ("H08", "Glenmore Court", "Flat in low-rise block", "1 apt", 1974, "Concrete panel", "Ground", "D", "Electric panel heaters", "None", "Exposed hillside", "Plastic, works", []),
    ("H09", "Larchfield Gardens", "Semi-detached house", "3 apt", 1991, "Cavity, insulated", "Two storeys", "C", "Gas central heating", "Kitchen and bathroom fans", "Sheltered", "Plastic, works", []),
    ("H10", "Larchfield Gardens", "Sheltered flat", "2 apt", 1991, "Cavity, insulated", "Ground", "C", "Gas central heating", "Kitchen and bathroom fans", "Sheltered", "Plastic, works", []),
    ("H11", "Riverside Way", "New-build flat", "2 apt", 2018, "Timber frame, insulated", "2nd floor", "B", "Air source heat pump", "Whole-home mechanical", "Faces the river", "Not applicable", ["2025-01"]),
    ("H12", "Riverside Way", "Wheelchair-accessible flat", "3 apt", 2018, "Timber frame, insulated", "Ground", "B", "Air source heat pump", "Whole-home mechanical", "Faces the river", "Membrane, works", []),
]

REPORT_KINDS = ["Mould in bathroom", "Mould in bedroom", "Condensation on windows",
                "Damp patch on wall", "Musty smell", "Peeling paint", "Heating not working",
                "Extractor fan broken", "Leak from roof or gutter"]
DAMP_KINDS = REPORT_KINDS[:6]  # the rest are related repairs, not damp itself


def pick(options):
    """Pick from [(value, weight), ...]."""
    total = sum(w for _, w in options)
    r = random.uniform(0, total)
    for value, w in options:
        r -= w
        if r <= 0:
            return value
    return options[-1][0]


def epc_for(built, walls, heating):
    score = 3  # D
    if built >= 2010: score = 1
    elif built >= 1985: score = 2
    elif built < 1920: score = 4
    if "insulated" in walls and "not" not in walls: score -= 1
    if heating in ("Electric storage heaters", "Electric panel heaters", "Solid fuel stove", "Oil boiler"): score += 1
    score += pick([(-1, 1), (0, 4), (1, 1)])
    return "ABCDEFG"[max(1, min(6, score))]


def floor_for(home_type):
    if "house" in home_type or "cottage" in home_type:
        return "Two storeys" if "Detached" not in home_type else pick([("Two storeys", 1), ("One storey", 1)])
    if home_type == "Tenement flat":
        return pick([("Ground", 1), ("1st floor", 1), ("2nd floor", 1), ("Top (3rd)", 1)])
    if home_type == "Four-in-a-block flat":
        return pick([("Ground", 1), ("Upper", 1)])
    if home_type in ("Sheltered flat", "Wheelchair-accessible flat"):
        return "Ground"
    return pick([("Ground", 1), ("1st floor", 1), ("2nd floor", 1)])


def ventilation_for(built):
    if built >= 2010:
        return pick([("Whole-home mechanical", 4), ("Kitchen and bathroom fans", 1)])
    if built >= 1985:
        return pick([("Kitchen and bathroom fans", 4), ("Bathroom fan only", 1)])
    return pick([("None", 3), ("Bathroom fan only", 3), ("Trickle vents", 2), ("Kitchen and bathroom fans", 2)])


def dpc_for(floor, built):
    if floor not in ("Ground", "Two storeys", "One storey"):
        return "Not applicable"
    if built < 1925:
        return pick([("Slate, cracked", 3), ("Unknown", 3), ("Slate, works", 1), ("Injected, works", 2)])
    if built < 1980:
        return pick([("Bitumen, works", 4), ("Bitumen, failed", 1), ("Unknown", 2)])
    return pick([("Plastic, works", 5), ("Membrane, works", 2), ("Unknown", 1)])


def building_risk(h):
    """A hidden 'true' risk used only to make the made-up history hang together."""
    r = 0
    r += 3 if h["built"] < 1920 else 2 if h["built"] < 1965 else 1 if h["built"] < 1990 else 0
    r += 2 if h["walls"] in ("Solid stone", "Solid brick") else 1 if h["walls"] in ("Concrete panel", "Cavity, not insulated") else 0
    r += {"A": 0, "B": 0, "C": 0, "D": 1, "E": 2, "F": 3, "G": 3}[h["epc"]]
    r += 2 if h["ventilation"] == "None" else 1 if h["ventilation"] in ("Bathroom fan only", "Trickle vents") else 0
    r += 1 if h["exposure"] != "Sheltered" else 0
    r += 2 if "failed" in h["dpc"] or "cracked" in h["dpc"] else 1 if h["dpc"] == "Unknown" else 0
    return r


def month(y, m):
    return "%04d-%02d" % (y, m)


def random_month(years_back=5):
    y, m = TODAY[0], TODAY[1]
    back = random.randint(0, years_back * 12 - 1)
    m -= back
    while m <= 0:
        m += 12
        y -= 1
    return month(y, m)


# ---------------------------------------------------------------- homes
homes = []
counts = {a["name"]: round(a["share"] * TOTAL_HOMES) for a in AREAS}
counts["Braeview"] += TOTAL_HOMES - sum(counts.values())
area_by_name = {a["name"]: a for a in AREAS}

for (hid, area, htype, size, built, walls, floor, epc, heating, vent, exposure, dpc, damp_months) in JOE_HOMES:
    a = area_by_name[area]
    homes.append(dict(id=hid, area=area, setting=a["setting"], coast=a["coast"], type=htype, size=size,
                      built=built, walls=walls, floor=floor, epc=epc, heating=heating, ventilation=vent,
                      exposure=exposure, dpc=dpc, joe=True,
                      reports=[dict(month=m, what=random.choice(DAMP_KINDS[:5]), damp=True) for m in damp_months]))
    counts[area] -= 1

n = len(homes)
for a in AREAS:
    for _ in range(counts[a["name"]]):
        n += 1
        htype = pick(a["types"])
        built = random.randint(*a["built"])
        walls = pick(a["walls"])
        heating = pick(a["heating"])
        floor = floor_for(htype)
        size = pick([("1 apt", 1), ("2 apt", 4), ("3 apt", 4), ("4 apt", 2), ("5 apt", 1)])
        homes.append(dict(id="H%04d" % n, area=a["name"], setting=a["setting"], coast=a["coast"], type=htype,
                          size=size, built=built, walls=walls, floor=floor, epc=epc_for(built, walls, heating),
                          heating=heating, ventilation=ventilation_for(built), exposure=random.choice(a["exposure"]),
                          dpc=dpc_for(floor, built), joe=False, reports=[]))

# Positions on the made-up map
for h in homes:
    a = area_by_name[h["area"]]
    h["x"] = round(a["x"] + random.gauss(0, a["spread"] * 0.55))
    h["y"] = round(a["y"] + random.gauss(0, a["spread"] * 0.45))

# ---------------------------------------------------------------- tenants
# One household per home, a few empty (void) homes. Only what a landlord might
# hold. Health is only recorded where the tenant agreed to share it.
tenants = []
for i, h in enumerate(homes):
    if not h["joe"] and random.random() < 0.025:
        h["void"] = True
        continue
    sheltered = h["type"] == "Sheltered flat"
    over75 = sheltered or random.random() < 0.16
    under5 = (not sheltered) and random.random() < (0.18 if h["size"] in ("3 apt", "4 apt", "5 apt") else 0.06)
    people = 1 if sheltered else pick([(1, 4), (2, 3), (3, 2), (4, 2), (5, 1)])
    if under5: people = max(people, 2)
    breathing = random.random() < (0.22 if over75 else 0.12)
    other_health = random.random() < (0.35 if over75 else 0.18)
    disability = h["type"] == "Wheelchair-accessible flat" or random.random() < 0.12
    low_income = random.random() < 0.55
    prepayment = random.random() < (0.45 if low_income else 0.15)
    arrears = random.random() < (0.22 if low_income else 0.05)
    consent = pick([("Yes", 5), ("No", 1), ("Not asked", 4)])
    months_since_contact = int(random.expovariate(1 / 10))
    reporter = random.random() < 0.65  # hidden: some people never report problems
    t = dict(
        id="T%04d" % (i + 1), home=h["id"], people=people,
        under5=under5, over75=over75,
        consent=consent,
        breathing=breathing if consent == "Yes" else None,
        otherHealth=other_health if consent == "Yes" else None,
        disability=disability,
        lowIncome=low_income, prepayment=prepayment, arrears=arrears,
        language=pick([("English", 12), ("Prefers another language", 1)]),
        easyRead=random.random() < 0.08,
        appUser=random.random() < 0.4,
        monthsSinceContact=min(months_since_contact, 48),
    )
    tenants.append(t)
    h["_reporter"] = reporter
    h["_struggles"] = (prepayment or arrears) and low_income

# Report history: driven by the building and whether people can heat the home,
# and only appears if the household tends to report things.
for h in homes:
    if h["joe"] or h.get("void"):
        continue
    risk = building_risk(h) + (3 if h.get("_struggles") else 0)
    chance = 0.03 * risk
    if not h.get("_reporter", True):
        chance *= 0.15
    for _ in range(5):  # one chance a year, last five years
        if random.random() < chance:
            what = random.choice(REPORT_KINDS)
            h["reports"].append(dict(month=random_month(5), what=what, damp=what in DAMP_KINDS))
    h["reports"].sort(key=lambda r: r["month"])

# ---------------------------------------------------------------- sensors
# A small pilot: 40 homes (under 3%). Rebby's eight made-up homes go in first,
# then 32 more reuse one of her eight patterns with a little noise.
readings = {}
with open(os.path.join(ROOT, "sketches", "sensor-readings-glasgow-style.csv")) as f:
    for row in csv.DictReader(f):
        g = readings.setdefault(row["home"], dict(t=[], h=[]))
        g["t"].append(float(row["temperature_c"]) if row["temperature_c"] else None)
        g["h"].append(int(row["humidity_pct"]) if row["humidity_pct"] else None)

STORIES = {
    "G01": "Heated morning and evening, fans work",
    "G02": "Heating on for only 2 hours a day",
    "G03": "Warm, but steam has nowhere to go",
    "G04": "Cold walls, heated a little",
    "G05": "Steady heating",
    "G06": "Heating off from 6pm",
    "G07": "Washing dried indoors on two days",
    "G08": "Sensor offline on Thursday",
}
lived_in = [h for h in homes if not h.get("void")]
pilot = random.sample([h for h in lived_in if not h["joe"]], 40)
sensors = {}
for i, h in enumerate(pilot):
    if i < 8:
        pattern = "G0%d" % (i + 1)
    else:
        risk = building_risk(h) + (3 if h.get("_struggles") else 0)
        pattern = random.choice(["G02", "G04", "G06"] if risk >= 9 else ["G03", "G07", "G06"] if risk >= 6 else ["G01", "G05", "G07", "G08"])
    src = readings[pattern]
    dt, dh = random.uniform(-0.8, 0.8), random.randint(-3, 3)
    temp = [None if v is None else round(v + dt + random.uniform(-0.2, 0.2), 1) for v in src["t"]]
    hum = [None if v is None else max(30, min(99, v + dh + random.randint(-1, 1))) for v in src["h"]]
    if i < 8:
        temp, hum = src["t"], src["h"]
    sensors[h["id"]] = dict(pattern=pattern, story=STORIES[pattern], start="2026-10-12 00:00", everyMinutes=30,
                            temperature=temp, humidity=hum)

# ---------------------------------------------------------------- write
for h in homes:
    for k in [k for k in h if k.startswith("_")]:
        del h[k]


def write(name, key, value, note):
    path = os.path.join(HERE, name)
    with open(path, "w") as f:
        f.write("// %s\n// MADE-UP data from src/data/make-data.py. Not real homes or people.\n" % note)
        f.write("window.DATA = window.DATA || {};\n")
        f.write("window.DATA.%s = " % key)
        if isinstance(value, list):
            f.write("[\n" + ",\n".join(json.dumps(v, separators=(",", ":")) for v in value) + "\n];\n")
        else:
            f.write(json.dumps(value, separators=(",", ":")) + ";\n")
    print("wrote", path)


areas_out = [dict(name=a["name"], setting=a["setting"], coast=a["coast"], x=a["x"], y=a["y"]) for a in AREAS]
write("areas.js", "areas", areas_out, "Invented neighbourhoods and where they sit on the made-up map.")
write("homes.js", "homes", homes, "%d invented homes. H01-H12 are Joe's example homes." % len(homes))
write("tenants.js", "tenants", tenants, "One invented household per lived-in home. Health only where consent = Yes.")
write("sensors.js", "sensors", sensors, "Sensor pilot: 40 homes, a week of readings every 30 minutes. Patterns from Rebby's sketch.")
