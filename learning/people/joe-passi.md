---
# Answers as codes, for counting across squads. The questions and codes are in learning/questions.md.
name: Joe Passi
profession: Content Designer
role: none
location: in person
# At setup
ai_use_before: 2
hopes: [other-jobs]
feeling: unsure
# At 19:00
worked_on: []
outside_usual_job:
got_in_way: []
ai_use_after:
# In the week after
specialist:
helped_squad: []
idea_where: []
ai_use_week_after:
---

# Joe Passi: learning log

## At setup
- How much I use AI tools in my work today: Now and then
- What I'm hoping to get from the hackathon: Try work outside my usual job
- How I feel about using AI in my work: Unsure

## During
<!-- Claude adds one line per moment: prompts that worked (word for word), dead ends, surprises, things done outside my usual job, what made working as a squad easier or harder -->
- Did research outside my usual job: found that about 1 in 7 social renters in Scotland have no home internet, and that other landlords reach offline tenants by spotting damp on visits that already happen, using data to choose who to visit first, and "Home MOTs" (all English examples; no Scottish one found). Prompt: "yes, look at how others reach offline tenants"
- More research: property features linked to damp and mould are age, solid walls, cold surfaces with poor ventilation, exposure to rain and wind, and a failed damp-proof course; condensation is the most common kind (about 8% of Scottish homes). No good evidence found on flats versus houses or EPC ratings. Prompt: "what characteristics of a property would affect their risk of damp and mould?"
- Made a dataset, outside my usual job: 12 made-up example homes based on the damp research, shared in sketches/example-homes.md for the squad to build with. Prompt: "make the list of made-up example homes"
- More research: Cloch partly has the data to assess damp risk (property details, repairs history, some tenant information, a small sensor pilot) but it isn't joined up, and there's little on health conditions; EPCs are public. Nothing published found on Cloch's own stock surveys. The gap is joining data up, not collecting it. Prompt: "Does Cloch keep relevant details of their properties to assess the risks?"
- Pulled all my research into a one-page summary doc for the squad, "Healthier homes: what Joe found" (https://claude.ai/artifact/KfKfeaPv2LNDcPDLHcMyfG). Prompts: "summarise my findings", then "yes, make the one-page summary"
- Designed and built a rough working screen, outside my usual job: a "damp data check" that pulls together made-up data about each home, shows what's missing and what to do next, and lists signs of damp risk with reasons rather than a score (sketches/damp-data-gaps-sketch.html). It fits the idea the squad agreed. Prompts: "Could we create a service that automatically pulls existing relevant, damp-related data and highlight what information is missing?", then "yes, sketch a rough screen"
- Changed the live prototype, outside my usual job: made the Review page one column and added a highlighted "What's missing" box with next steps, plus "Missing" and "Not shared" labels in the details, based on my sketch. Faye changed the same styles file at the same time, but it merged cleanly. Prompt: "ideally the Review page should only be in one column of text then you can add and highlight the missing data similar to my sketch"
- Added made-up example cases (engineers, notes, decisions) so Freya's "Visits booked" screen has something to show. Squad working: Claude spotted the engineer view was still on Freya's branch and would clash, so we waited for her to share first, then built on top. Prompt: "Can you add dummy data into the engineer view?"
- Spotted a privacy problem and fixed it: engineers were being asked to log health information on visits. Took it out of "Visits booked" (health stays with housing officers, who can ask with consent). Rob's dark mode arrived at the same time and already covered my colours. Prompt: "take health information out of the engineer section. They can't be asked to log health information"
- Redesigned the page layout, outside my usual job: split a long, busy page into three accessible tabs (Homes to look at first, Area overview, Engineer visits booked), keyboard-friendly and stacking on phones. Shared it straight away to avoid clashes, since it touched four files others were working on. Prompt: "The page seems too long and busy. Can we split the page into three tabs? First - and default view - uses the 'Homes to look at first' section. Second tab is the 'Area overview' section. Third tab is the Visits booked, renamed 'Engineer visits booked'"
- Designed the squad logo, outside my usual job: Claude drew three options, I picked the house in a hard hat, then had it made round with "Hacky" above the house and added top left of the prototype, small but legible. Asked to add Cloch's real logo too, but Claude flagged that a prototype mustn't pass itself off as a real organisation's brand, so I left it out. Prompts: "can you design an amusing logo for Hacky McHackface?", then "Logo A. Can you move 'Hacky' above the house and make it circular. Then add the logo to the top left of the prototype, quite small but still legible."
- My assigned job from the look together: the content for "Homes to look at first". Removed the Score column, wrote the new hint myself ("Homes at highest risk first."), and changed the intro and Review page to talk about "risk level", not "score", keeping the points in the Review section. Prompts: "I think the score column is unnecessary in this view. So if you remove that column, you'd need to reword the text under the heading", then "Can you change those other lines that refer to the score?"
- Surprise: after merging with Freya's changes, the list showed "undefined" and Claude thought it had broken something. It was only the test browser using an old saved copy of a file. A fresh reload (Cmd+Shift+R) fixed it. Lesson: when lots of people share at once, reload fresh before panicking.

## At 19:00
- What I worked on: <answers>
- How much of it was outside my usual job: <answer>
- What got in the way: <answers>
- How much I'd use AI tools in my work now: <answer>

## In the week after
- Did I still need a human specialist: <answer>, for <what>
- What helped most when building as a squad: <answers>
- The most useful thing I learned: <in my words>
- **One idea to carry forward:** <in my words>, and where it could fit: <answers>
- How much I expect to use AI tools from now on: <answer>

## Three-week check-in (around 12 Nov)
- Did I try, share or suggest my idea anywhere? What happened, or what got in the way?
