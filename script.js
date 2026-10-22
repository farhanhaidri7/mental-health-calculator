"use strict";

// ---- Scale definitions -------------------------------------------------
// PHQ-9 and GAD-7: each answer scores 0-3.
// PSS-4: each answer scores 0-4, questions 2 and 3 are reverse-scored.

const FREQ_0_3 = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

const FREQ_0_4 = [
  { label: "Never", value: 0 },
  { label: "Almost never", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Fairly often", value: 3 },
  { label: "Very often", value: 4 },
];

const SCALES = {
  phq9: {
    title: "Depression — PHQ-9",
    subtitle: "Over the last 2 weeks, how often have you been bothered by:",
    options: FREQ_0_3,
    max: 27,
    // Index 8 (the 9th question) is the self-harm item.
    supportItemIndex: 8,
    questions: [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
      "Trouble concentrating on things, such as reading or watching television",
      "Moving or speaking so slowly that other people could have noticed — or the opposite, being so fidgety or restless that you have been moving around a lot more than usual",
      "Thoughts that you would be better off dead, or of hurting yourself in some way",
    ],
    bands: [
      { upTo: 4,  name: "Minimal",            colour: "#2e9e5b", meaning: "Your answers suggest few or no symptoms of depression right now.", advice: "Keep up the habits that support your mood — sleep, activity, and time with people you trust — and check in again if things change." },
      { upTo: 9,  name: "Mild",               colour: "#8bc34a", meaning: "Your answers suggest mild symptoms of depression.", advice: "Watchful waiting can help: track your mood for a couple of weeks, keep a regular routine, and re-take this check. If symptoms persist, talk to a doctor." },
      { upTo: 14, name: "Moderate",           colour: "#f0b35e", meaning: "Your answers suggest moderate symptoms of depression.", advice: "Please consider booking an appointment with a doctor or mental health professional to talk through treatment options." },
      { upTo: 19, name: "Moderately severe",  colour: "#ef7d3c", meaning: "Your answers suggest moderately severe symptoms of depression.", advice: "It is important to speak to a doctor or mental health professional soon about support and treatment." },
      { upTo: 27, name: "Severe",             colour: "#d64545", meaning: "Your answers suggest severe symptoms of depression.", advice: "Please contact a doctor or mental health professional as soon as you can. You deserve support, and effective treatments are available." },
    ],
  },

  gad7: {
    title: "Anxiety — GAD-7",
    subtitle: "Over the last 2 weeks, how often have you been bothered by:",
    options: FREQ_0_3,
    max: 21,
    supportItemIndex: -1,
    questions: [
      "Feeling nervous, anxious, or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it is hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid, as if something awful might happen",
    ],
    bands: [
      { upTo: 4,  name: "Minimal", colour: "#2e9e5b", meaning: "Your answers suggest few or no symptoms of anxiety right now.", advice: "Keep doing what works for you, and check in again if things change." },
      { upTo: 9,  name: "Mild",    colour: "#8bc34a", meaning: "Your answers suggest mild symptoms of anxiety.", advice: "Stress-management habits — exercise, breathing exercises, limiting caffeine, a regular sleep routine — can help. Re-take this check in a few weeks." },
      { upTo: 14, name: "Moderate", colour: "#f0b35e", meaning: "Your answers suggest moderate symptoms of anxiety.", advice: "Please consider talking to a doctor or mental health professional about support and treatment options." },
      { upTo: 21, name: "Severe",  colour: "#d64545", meaning: "Your answers suggest severe symptoms of anxiety.", advice: "Please contact a doctor or mental health professional soon. Effective help for anxiety is available." },
    ],
  },

  pss4: {
    title: "Stress — PSS-4",
    subtitle: "In the last month, how often have you felt that:",
    options: FREQ_0_4,
    max: 16,
    supportItemIndex: -1,
    // Questions 2 and 3 (indexes 1 and 2) are positively worded, so they are reverse-scored.
    reverseIndexes: [1, 2],
    questions: [
      "You were unable to control the important things in your life",
      "You felt confident about your ability to handle your personal problems",
      "Things were going your way",
      "Difficulties were piling up so high that you could not overcome them",
    ],
    // PSS-4 has no official clinical cut-offs; these bands are indicative only.
    bands: [
      { upTo: 5,  name: "Low perceived stress",      colour: "#2e9e5b", meaning: "Your answers suggest you are generally coping with stress at the moment. (Indicative band — PSS-4 has no official cut-offs.)", advice: "Keep up the routines that help you cope, and check in again during busier periods." },
      { upTo: 10, name: "Moderate perceived stress", colour: "#f0b35e", meaning: "Your answers suggest a moderate level of stress in the last month. (Indicative band — PSS-4 has no official cut-offs.)", advice: "Look at what is driving the stress and what you can change, delegate, or pause. Rest, exercise, and talking it through can help." },
      { upTo: 16, name: "High perceived stress",     colour: "#d64545", meaning: "Your answers suggest a high level of stress in the last month. (Indicative band — PSS-4 has no official cut-offs.)", advice: "Prioritise rest and support. If stress is affecting your health, work, or relationships, please talk to a doctor or counsellor." },
    ],
  },
};

// ---- Pure scoring function (also testable in Node) ----------------------

function calculateScore(scaleKey, rawValues) {
  const scale = SCALES[scaleKey];
  if (!scale) throw new Error("Unknown scale: " + scaleKey);
  if (!Array.isArray(rawValues) || rawValues.length !== scale.questions.length) {
    throw new Error("Expected " + scale.questions.length + " answers");
  }
  const reverse = new Set(scale.reverseIndexes || []);
  let total = 0;
  rawValues.forEach((value, i) => {
    const v = Number(value);
    if (!Number.isFinite(v)) throw new Error("Answer " + (i + 1) + " is missing");
    total += reverse.has(i) ? scale.options.length - 1 - v : v;
  });
  const band = scale.bands.find((b) => total <= b.upTo);
  const supportFlag =
    scale.supportItemIndex >= 0 && Number(rawValues[scale.supportItemIndex]) > 0;
  return { total, max: scale.max, band, supportFlag };
}

// ---- Browser UI ----------------------------------------------------------

if (typeof document !== "undefined") {
  let currentScale = "phq9";

  const form = document.getElementById("questions");
  const titleEl = document.getElementById("scale-title");
  const subtitleEl = document.getElementById("scale-subtitle");
  const calcBtn = document.getElementById("calculate");
  const resetBtn = document.getElementById("reset");
  const resultEl = document.getElementById("result");

  function render() {
    const scale = SCALES[currentScale];
    titleEl.textContent = scale.title;
    subtitleEl.textContent = scale.subtitle;
    resultEl.classList.add("hidden");
    calcBtn.disabled = true;
    form.innerHTML = "";

    scale.questions.forEach((question, qi) => {
      const block = document.createElement("div");
      block.className = "question";
      const p = document.createElement("p");
      p.textContent = qi + 1 + ". " + question;
      block.appendChild(p);

      const options = document.createElement("div");
      options.className = "options";
      scale.options.forEach((opt) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "q" + qi;
        input.value = opt.value;
        input.addEventListener("change", updateButton);
        label.appendChild(input);
        label.appendChild(document.createTextNode(opt.label));
        options.appendChild(label);
      });
      block.appendChild(options);
      form.appendChild(block);
    });
  }

  function answeredValues() {
    const scale = SCALES[currentScale];
    const values = [];
    for (let i = 0; i < scale.questions.length; i++) {
      const checked = form.querySelector('input[name="q' + i + '"]:checked');
      values.push(checked ? Number(checked.value) : null);
    }
    return values;
  }

  function updateButton() {
    calcBtn.disabled = answeredValues().some((v) => v === null);
  }

  calcBtn.addEventListener("click", () => {
    const values = answeredValues();
    if (values.some((v) => v === null)) return;
    const { total, max, band, supportFlag } = calculateScore(currentScale, values);
    document.getElementById("score-value").textContent = total;
    document.getElementById("score-max").textContent = "out of " + max;
    const fill = document.getElementById("bar-fill");
    fill.style.width = Math.round((total / max) * 100) + "%";
    fill.style.background = band.colour;
    document.getElementById("score-band").textContent = band.name;
    document.getElementById("score-meaning").textContent = band.meaning;
    document.getElementById("score-advice").textContent = band.advice;
    document.getElementById("support-note").classList.toggle("hidden", !supportFlag);
    resultEl.classList.remove("hidden");
    resultEl.scrollIntoView({ behavior: "smooth" });
  });

  resetBtn.addEventListener("click", render);

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentScale = tab.dataset.scale;
      render();
    });
  });

  render();
}

// Export for Node tests (ignored by the browser).
if (typeof module !== "undefined" && module.exports) {
  module.exports = { SCALES, calculateScore };
}
