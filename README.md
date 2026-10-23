# Mental Health Calculator

A working mental-health self-check calculator built with plain **HTML, CSS and
JavaScript**. No build step, no dependencies, nothing to install — open it in a
browser and it works.

## Summary

The app lets a user check three areas of mental health using short, standard
screening questionnaires. The user answers every question, presses
**Calculate my score**, and instantly gets:

- a total score with a visual progress bar,
- a severity band (for example Minimal, Mild, Moderate, Severe),
- a plain-English explanation of what the score means,
- a suggested next step,
- and, if a PHQ-9 answer suggests thoughts of self-harm, a support banner with
  helpline information (India: Tele-MANAS **14416**, emergency **112**).

## The three calculators

| Tab | Scale | What it screens | Questions | Score range | Scoring notes |
| --- | --- | --- | --- | --- | --- |
| Depression | PHQ-9 | Depression symptoms over the last 2 weeks | 9 | 0–27 | Each answer 0–3; bands at 5 / 10 / 15 / 20 |
| Anxiety | GAD-7 | Anxiety symptoms over the last 2 weeks | 7 | 0–21 | Each answer 0–3; bands at 5 / 10 / 15 |
| Stress | PSS-4 | Perceived stress over the last month | 4 | 0–16 | Each answer 0–4; questions 2 and 3 are reverse-scored. PSS-4 has no official clinical cut-offs, so its bands are labelled indicative only |

The Calculate button stays disabled until every question is answered, so a
score is never produced from incomplete answers.

## How to run it in VS Code

1. Download / clone this repository and open the folder in VS Code:
   **File → Open Folder… → mental-health-calculator**
2. Pick either way to run it:
   - **Easiest:** right-click `index.html` and choose **Open with Live Server**
     (requires the free *Live Server* extension by Ritwick Dey — install it
     from the Extensions panel, Ctrl+Shift+X).
   - **No extension:** just double-click `index.html` in your file explorer —
     it opens and works in any browser.
3. Edit `index.html`, `style.css` or `script.js`, save, and the page updates
   (Live Server refreshes automatically).

## Files

- `index.html` — page structure (tabs, questionnaire form, result panel)
- `style.css` — all styling
- `script.js` — questions, scoring bands and the calculator logic.
  The scoring function `calculateScore(scale, answers)` is a pure function and
  can be tested in Node: `module.exports` is set at the bottom of the file.
- `README.md` — this summary

## Testing

The scoring logic was verified with automated checks covering all-zero,
all-maximum and band-boundary answers for every scale, the PSS-4 reverse
scoring, and the PHQ-9 self-harm support flag — 8/8 checks passed.
The local-database functions (`loadResults`, `saveResult`, `clearResults`,
`buildCSV`) are also unit-tested in Node with a stub storage object —
saving, reading back, CSV output and clearing all pass.
The project was also run locally in VS Code / Live Server and confirmed working.

Quick manual check with Node, from this folder:

```bash
node -e "const {calculateScore}=require('./script.js'); console.log(calculateScore('phq9',[0,0,0,0,0,0,0,0,0]))"
# -> { total: 0, max: 27, band: { ... 'Minimal' ... }, supportFlag: false }
```

## Database — saved results (localStorage)

Every completed check is saved automatically to a small **local database**
in the user's browser (`localStorage`, key `mhc_results_v1`). Each record
stores: date & time, scale, score, max score, and severity band.

- A **"Your saved results"** history table on the page lists all past
  results, newest first.
- **Download CSV** exports the whole history as
  `mental-health-results.csv` — ready to open in Excel or load into
  Power BI for analysis.
- **Clear all saved results** deletes the history (with a confirmation).
- Data never leaves the device — there is no server and no account, which
  keeps sensitive mental-health answers private. History is per browser:
  clearing browser data or switching devices/browsers starts a fresh history.

## Tech stack

- HTML5, CSS3, vanilla JavaScript — no frameworks, no libraries, no backend
- Storage: browser `localStorage` (on-device database)
- Works offline once downloaded; no data leaves the user's browser

## Disclaimer

This is a **screening tool, not a medical diagnosis**. PHQ-9 and GAD-7 are
standard clinical screening questionnaires and PSS-4 is a short perceived-stress
scale. Only a qualified health professional who knows your full situation can
make a diagnosis. If a score is moderate or above, or symptoms are affecting
daily life, please talk to a doctor or mental health professional.

## Possible future improvements

- A trend chart of past scores over time
- Optional cloud sync (e.g. Firebase) so history follows the user across devices
- Add the full PSS-10 stress scale and the WHO-5 wellbeing scale
- Printable / downloadable result summary
