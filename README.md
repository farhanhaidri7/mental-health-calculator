# Mental Health Calculator

A working self-check calculator built with plain HTML, CSS and JavaScript.
No build step, no dependencies, nothing to install.

It contains three standard screening scales:

| Tab | Scale | Questions | Score range |
| --- | --- | --- | --- |
| Depression | PHQ-9 | 9 | 0–27 |
| Anxiety | GAD-7 | 7 | 0–21 |
| Stress | PSS-4 (questions 2 and 3 are reverse-scored) | 4 | 0–16 |

Answer every question, press **Calculate my score**, and you get your total,
a severity band, what it means, and a suggested next step.

> This is a screening tool, **not a medical diagnosis**. Only a qualified
> health professional can diagnose. If one of the PHQ-9 answers suggests
> thoughts of self-harm, the app shows support information
> (India: Tele-MANAS **14416**, emergency **112**).

## How to run it in VS Code

1. Download / unzip this folder and open it in VS Code:
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

- `index.html` — page structure
- `style.css` — styling
- `script.js` — questions, scoring bands and the calculator logic.
  The scoring function `calculateScore(scale, answers)` is pure and can be
  tested in Node: `module.exports` is set at the bottom of the file.

## Quick logic check (optional)

With Node installed, from this folder:

```bash
node -e "const {calculateScore}=require('./script.js'); console.log(calculateScore('phq9',[0,0,0,0,0,0,0,0,0]))"
# -> { total: 0, max: 27, band: { ... 'Minimal' ... }, supportFlag: false }
```
