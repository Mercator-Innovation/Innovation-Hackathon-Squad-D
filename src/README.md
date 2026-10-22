# The prototype

`/first-version` builds the squad's first version here, then everyone improves it.

- Plain HTML, CSS and JavaScript that opens straight from the file: `open src/index.html` on a Mac, or double-click it. No build step and no installs, unless the squad decides otherwise.
- Data goes in `data/` as `.js` files (`window.DATA = …`), because a page opened from a file can't load `.json`. **Synthetic or open data only.**
- The files are split so people can work at the same time: `index.html` (structure), `styles.css` (the look), `app.js` (behaviour), `content.js` (the words), `data/` (data), plus one file per extra screen.

## What's here (first version)

- `risk.js`: how the score works. Each rule adds points and shows as a reason. Change the points or bands here.
- `content.js`: all the words on the page.
- `data/`: made-up homes (1,446), households, and a week of sensor readings for 40 homes. Joe's twelve example homes are H01 to H12; the sensor patterns are Rebby's. `data/make-data.py` makes them again (`python3 src/data/make-data.py`) if you want to change the data.
