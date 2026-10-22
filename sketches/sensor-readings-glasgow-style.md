# Pretend sensor readings, Glasgow pilot style (made up)

A week of **made-up** sensor readings for 8 **made-up** homes, in `sensor-readings-glasgow-style.csv`. This is not data from Glasgow City Council's pilot or any real home. It copies the pilot's format only: [temperature and humidity every 30 minutes](https://news.stv.tv/?p=275194). Made by Rebby Homer with Claude.

- **Period:** Monday 12 to Sunday 18 October 2026, every 30 minutes (336 readings a home)
- **Columns:** `home`, `time`, `temperature_c` (°C), `humidity_pct` (how damp the air is, %)
- **One sensor per home**, in the main living space

## The homes

Each one tells a different story, so the prototype has something to show.

| Home | Story | Temperature | Humidity |
|---|---|---|---|
| G01 | Heated morning and evening, fans work | 16–21°C | 47–60%, fine |
| G02 | Heating on for only 2 hours a day (maybe can't afford it) | 12–16°C | 72–94%, high all week |
| G03 | Warm, but no fans, so steam has nowhere to go | 17–21°C | Jumps to 81% at mealtimes and shower times |
| G04 | Cold walls, heated a little | 13–17°C | 74–95%, high all week |
| G05 | Newer home, steady heating | 19–21°C | 44–56%, fine |
| G06 | Heating off from 6pm (maybe rationing) | Drops to 14°C at night | Creeps up at night |
| G07 | Fine, except on two days washing is dried indoors | 16–21°C | Up to 83% on Wednesday and Saturday |
| G08 | Fine, but the sensor went offline on Thursday 09:00–16:00 | 15–19°C | Gaps in the data (blank cells) |

## Things to notice

- **Cold and damp go together.** Colder air can't hold as much moisture, so humidity rises when a home cools down. G02 and G04 show this.
- **A warm home can still be damp** if steam can't get out (G03).
- **Short spikes aren't the same as a damp home.** G07 has two bad days, G02 has a bad week. A good design shows the difference.
- **Real sensors drop out.** G08 has missing readings, so the prototype should cope with gaps.
- A common rule of thumb is that mould risk rises when humidity stays above about 70% for long periods. *That's from general knowledge, not checked against a source yet.*

## Notes

- No information about the people who live in these homes, on purpose.
- When the prototype is ready, this can become a data file in `src/data/`.
