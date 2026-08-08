const KEY = "levelup-web-state";

const DEFAULT_STATE = {
  name: "",
  weight: 105,
  startWeight: 105,
  target: 80,
  phase: 1,
  xp: 0,
  quests: [false, false, false, false],
  weights: [],
  workouts: [],
  messages: [],
  tab: 0,
  streak: 0,
  lastActive: null,
  started: Date.now()
};

let state = loadState();
let sessionStart = Date.now();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));

    if (saved) {
      return {
        ...DEFAULT_STATE,
        ...saved,
        quests: Array.isArray(saved.quests)
          ? saved.quests.slice(0, 4)
          : [false, false, false, false],
        weights: Array.isArray(saved.weights) ? saved.weights : [],
        workouts: Array.isArray(saved.workouts) ? saved.workouts : [],
        messages: Array.isArray(saved.messages) ? saved.messages : []
      };
    }
  } catch (e) {
    console.log("Storage error:", e);
  }

  return { ...DEFAULT_STATE };
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function login() {
  const input = document.getElementById("nameInput");

  const name = input
    ? input.value.trim()
    : "";

  state.name = name || "Hunter";

  if (!state.startWeight) {
    state.startWeight = state.weight;
  }

  save();

  const loginScreen = document.getElementById("login");
  const app = document.getElementById("app");

  if (loginScreen) loginScreen.classList.add("hidden");
  if (app) app.classList.remove("hidden");

  render();
}

function logout() {
  const app = document.getElementById("app");
  const loginScreen = document.getElementById("login");

  if (app) app.classList.add("hidden");
  if (loginScreen) loginScreen.classList.remove("hidden");
}

/* -----------------------------
   NAVIGATION
----------------------------- */

function showTab(tab) {
  state.tab = Number(tab);
  save();
  render();
}

/* -----------------------------
   XP / LEVEL
----------------------------- */

function getLevel() {
  return Math.floor(state.xp / 1000) + 1;
}

function getXPProgress() {
  return state.xp % 1000;
}

function pct() {
  return Math.max(
    0,
    Math.min(
      100,
      Math.round((getXPProgress() / 1000) * 100)
    )
  );
}

function addXP(amount) {
  state.xp = Math.max(0, state.xp + amount);
}

/* -----------------------------
   GENERIC CARD
----------------------------- */

function card(title, body, cls = "") {
  return `
    <div class="card ${cls}">
      ${title ? `<div class="label">${title}</div>` : ""}
      ${body}
    </div>
  `;
}

/* -----------------------------
   DAILY ACTIVITY / STREAK
----------------------------- */

function updateStreak() {
  const today = new Date().toLocaleDateString();

  if (!state.lastActive) {
    state.streak = 1;
    state.lastActive = today;
    return;
  }

  if (state.lastActive === today) return;

  const last = new Date(state.lastActive);
  const now = new Date();

  last.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const difference =
    Math.round((now - last) / 86400000);

  if (difference === 1) {
    state.streak++;
  } else if (difference > 1) {
    state.streak = 1;
  }

  state.lastActive = today;
}

/* -----------------------------
   DASHBOARD
----------------------------- */

function dashboard() {
  const done = state.quests.filter(Boolean).length;
  const level = getLevel();

  return `
    <div class="hero glow">
      <div class="eyebrow">
        SYSTEM ONLINE • WELCOME,
        ${(state.name || "HUNTER").toUpperCase()}
      </div>

      <h2>LEVEL UP YOUR LIFE</h2>

      <div class="rank">
        RANK ${state.phase >= 5 ? "S" : "E"} HUNTER
      </div>

      <p class="muted">
        Build strength. Complete quests.
        Unlock your next phase.
      </p>

      <div class="progress">
        <i style="width:${pct()}%"></i>
      </div>

      <p class="note">
        LEVEL ${level} •
        ${getXPProgress()} / 1000 XP
      </p>
    </div>

    <div class="grid">
      ${card(
        "CURRENT WEIGHT",
        `<div class="stat">
          ${state.weight}
          <small>kg</small>
        </div>`
      )}

      ${card(
        "TARGET",
        `<div class="stat">
          ${state.target}
          <small>kg</small>
        </div>`
      )}

      ${card(
        "PHASE",
        `<div class="stat purple">
          ${state.phase}
        </div>`
      )}

      ${card(
        "QUESTS",
        `<div class="stat green-t">
          ${done}/4
        </div>`
      )}

      ${card(
        "STREAK",
        `<div class="stat">
          🔥 ${state.streak}
          <small>days</small>
        </div>`
      )}
    </div>

    <h3 class="section-title">
      ⚡ TODAY'S SYSTEM
    </h3>

    <div class="grid">

      <div class="card">
        <b>Daily Momentum</b>

        <p class="muted">
          Finish your quests and log a workout
          to earn XP.
        </p>

        <button
          class="small-btn"
          onclick="showTab(1)"
        >
          VIEW QUESTS
        </button>
      </div>

      <div class="card">
        <b>Quick Workout</b>

        <p class="muted">
          Forge your body with today's training.
        </p>

        <button
          class="small-btn"
          onclick="showTab(3)"
        >
          OPEN FORGE
        </button>
      </div>

    </div>
  `;
}

/* -----------------------------
   QUESTS
----------------------------- */

function quests() {

  const qs = [
    "Walk / cardio session",
    "Drink enough water",
    "Complete strength workout",
    "Log today's progress"
  ];

  return `
    <div class="hero">
      <div class="eyebrow">
        DAILY QUEST BOARD
      </div>

      <h2>QUESTS</h2>

      <p class="muted">
        Complete missions to earn XP and
        maintain momentum.
      </p>
    </div>

    <h3 class="section-title">
      Today's Quests
    </h3>

    ${qs.map((q, i) => `
      <div
        class="card quest ${state.quests[i] ? "done" : ""}"
        style="margin:8px 0"
      >

        <input
          type="checkbox"
          ${state.quests[i] ? "checked" : ""}
          onchange="toggleQuest(${i})"
        >

        <div>
          <b>${q}</b>

          <div class="note">
            +${i === 3 ? 150 : 100} XP
          </div>
        </div>

      </div>
    `).join("")}
  `;
}

function toggleQuest(i) {

  if (i < 0 || i >= state.quests.length) {
    return;
  }

  const wasDone = state.quests[i];

  state.quests[i] = !wasDone;

  const xp = i === 3 ? 150 : 100;

  if (state.quests[i]) {
    addXP(xp);
    updateStreak();
  } else {
    addXP(-xp);
  }

  save();
  render();
}

/* -----------------------------
   WEIGHT / PHASE
----------------------------- */

function phase() {

  const start =
    Number(state.startWeight) || 105;

  const current =
    Number(state.weight) || start;

  const target =
    Number(state.target) || 80;

  const total =
    Math.max(0.1, start - target);

  const lost =
    Math.max(0, start - current);

  const remaining =
    Math.max(0, current - target);

  const progress =
    Math.max(
      0,
      Math.min(100, (lost / total) * 100)
    );

  return `
    <div class="hero">
      <div class="eyebrow">
        TRANSFORMATION PROTOCOL
      </div>

      <h2>PHASE ${state.phase}</h2>

      <p class="muted">
        Track your weight and move toward
        your target.
      </p>
    </div>

    <div class="grid">

      ${card(
        "STARTING",
        `<div class="stat">
          ${start} kg
        </div>`
      )}

      ${card(
        "CURRENT",
        `<div class="stat">
          ${current} kg
        </div>`
      )}

      ${card(
        "TARGET",
        `<div class="stat gold">
          ${target} kg
        </div>`
      )}

    </div>

    <div class="card" style="margin-top:12px">

      <div class="row">
        <b>Progress to target</b>

        <span class="pill">
          ${Math.round(progress)}%
        </span>
      </div>

      <div class="progress">
        <i style="width:${progress}%"></i>
      </div>

      <p class="muted">
        ${remaining.toFixed(1)} kg remaining
      </p>

      <div class="form">

        <input
          id="weight"
          type="number"
          step="0.1"
          min="20"
          max="300"
          placeholder="Weight (kg)"
        >

        <input
          id="weightNote"
          placeholder="Note"
        >

        <button
          class="primary"
          onclick="logWeight()"
        >
          LOG WEIGHT
        </button>

      </div>

    </div>

    <h3 class="section-title">
      Recent Logs
    </h3>

    ${
      state.weights.length
      ? state.weights
          .slice(-5)
          .reverse()
          .map(x => `
            <div
              class="card row"
              style="margin:7px 0"
            >
              <b>${x.w} kg</b>

              <span class="note">
                ${x.d}
                ${x.n ? " • " + x.n : ""}
              </span>
            </div>
          `)
          .join("")
      : `<div class="card muted">
          No weight logs yet.
        </div>`
    }
  `;
}

function logWeight() {

  const input =
    document.getElementById("weight");

  const note =
    document.getElementById("weightNote");

  if (!input) return;

  const w = parseFloat(input.value);

  if (!w || w < 20 || w > 300) {
    alert("Enter a valid weight.");
    return;
  }

  const oldWeight = state.weight;

  state.weight = w;

  state.weights.push({
    w: w,
    d: new Date().toLocaleDateString(),
    n: note ? note.value.trim() : ""
  });

  /*
   * Give XP only when the weight actually changes.
   */
  if (w !== oldWeight) {
    addXP(50);
    updateStreak();
  }

  /*
   * Automatically advance phase
   * every 5 kg of progress.
   */
  const start =
    Number(state.startWeight) || 105;

  const lost =
    Math.max(0, start - state.weight);

  state.phase =
    Math.max(1, Math.floor(lost / 5) + 1);

  save();
  render();
}

/* -----------------------------
   WORKOUT FORGE
----------------------------- */

function forge() {

  const exercises = [
    ["Squats", "STRENGTH", "3 × 10"],
    ["Push-ups", "STRENGTH", "3 × 8"],
    ["Lunges", "STRENGTH", "3 × 10"],
    ["Plank", "CORE", "3 × 30s"],
    ["Dumbbell Row", "STRENGTH", "3 × 10"],
    ["Marching", "CARDIO", "5 min"],
    ["Jumping Jacks", "CARDIO", "3 × 20"]
  ];

  return `
    <div class="hero">
      <div class="eyebrow">
        TRAINING FACILITY
      </div>

      <h2>FORGE</h2>

      <p class="muted">
        Choose an exercise and record
        your training.
      </p>
    </div>

    <div class="grid">

      ${exercises.map((e, i) => card(
        e[0],
        `
        <div class="row">

          <span class="pill">
            ${e[1]}
          </span>

          <b>${e[2]}</b>

        </div>

        <button
          class="small-btn"
          style="margin-top:12px"
          onclick="logWorkout('${e[0]}')"
        >
          COMPLETE
        </button>
        `
      )).join("")}

    </div>

    <h3 class="section-title">
      Workout History
    </h3>

    ${
      state.workouts.length
      ? state.workouts
          .slice(-8)
          .reverse()
          .map(w => `
            <div
              class="card row"
              style="margin:7px 0"
            >
              <b>${w}</b>

              <span class="green-t">
                +100 XP
              </span>
            </div>
          `)
          .join("")
      : `<div class="card muted">
          No workouts logged yet.
        </div>`
    }
  `;
}

function logWorkout(exercise) {

  if (!exercise) return;

  const today =
    new Date().toLocaleDateString();

  /*
   * Prevent accidentally logging the same
   * exercise multiple times on the same day.
   */
  const alreadyDone =
    state.workouts.some(
      w => w === `${exercise} • ${today}`
    );

  if (alreadyDone) {
    alert("You already logged this exercise today.");
    return;
  }

  state.workouts.push(
    `${exercise} • ${today}`
  );

  addXP(100);
  updateStreak();

  save();
  render();
}

/* -----------------------------
   FITNESS ORACLE
----------------------------- */

function oracle() {

  let msgs =
    state.messages.length
      ? state.messages
      : [
          [
            "AI",
            `Greetings ${state.name || "Hunter"}.
I am your Fitness Oracle.
Ask about workouts, nutrition,
fat loss or exercise form.`
          ]
        ];

  const suggestions = [
    "High protein meal ideas",
    "Best fat-loss cardio",
    "Fix squat knee cave",
    "Beginner workout"
  ];

  return `
    <div class="hero">

      <div class="eyebrow">
        SYSTEM INTELLIGENCE
      </div>

      <h2>✦ FITNESS ORACLE</h2>

      <p class="muted">
        Instant guidance for workouts,
        nutrition and progression.
      </p>

    </div>

    <div
      class="bar"
      style="margin:12px 0"
    >

      ${suggestions.map(x => `
        <button
          class="small-btn"
          onclick="ask('${x}')"
        >
          ${x}
        </button>
      `).join("")}

    </div>

    <div class="card">

      ${msgs.map(m => `
        <div
          class="message ${m[0] === "AI" ? "ai" : "user"}"
        >
          <b>${m[0]}</b>
          <br>
          ${escapeHTML(m[1])}
        </div>
      `).join("")}

      <div
        class="row"
        style="margin-top:12px"
      >

        <input
          id="prompt"
          class="chat-input"
          placeholder="Ask the Oracle..."
          onkeydown="
            if(event.key === 'Enter') sendAsk()
          "
        >

        <button
          class="primary"
          style="width:auto"
          onclick="sendAsk()"
        >
          SEND
        </button>

      </div>

    </div>
  `;
}

function ask(x) {

  const prompt =
    document.getElementById("prompt");

  if (prompt) {
    prompt.value = x;
    sendAsk();
  }
}

function sendAsk() {

  const input =
    document.getElementById("prompt");

  if (!input) return;

  const p =
    input.value.trim();

  if (!p) return;

  state.messages.push(["USER", p]);

  const text = p.toLowerCase();

  let answer =
    `Stay consistent. Focus on a sustainable
calorie deficit, adequate nutrition,
progressive training and recovery.
For exercise form, use controlled
repetitions and stop if you feel sharp
pain.`;

  if (/protein|meal|food|eat/i.test(text)) {
    answer =
      `Budget-friendly protein options include
eggs, dal, chickpeas, milk, curd and
fish or chicken when available.
Build meals around a protein source,
vegetables and a sensible portion of
carbohydrates.`;
  }

  else if (/cardio|fat loss|burn|running|jog/i.test(text)) {
    answer =
      `For fat loss, brisk walking, jogging and
cycling can all work. Start at a pace you
can sustain and gradually increase duration.
Your calorie deficit and overall activity
matter more than one specific cardio exercise.`;
  }

  else if (/squat|knee|leg/i.test(text)) {
    answer =
      `For squats, keep your feet stable,
control the descent and track your knees
roughly in line with your toes.
If you feel sharp or persistent pain,
stop and have your technique assessed.`;
  }

  else if (/workout|exercise|training/i.test(text)) {
    answer =
      `Begin with 20–30 minutes of manageable
training. Combine squats, rows, push-up
variations, lunges, planks and walking.
Progress gradually instead of trying to
max out every session.`;
  }

  else if (/water|hydration/i.test(text)) {
    answer =
      `Drink regularly throughout the day.
Your needs increase with heat and exercise.
A simple check is to avoid consistently
dark urine, while also avoiding excessive
water intake.`;
  }

  else if (/sleep|rest|recovery/i.test(text)) {
    answer =
      `Recovery is part of training. Aim for
consistent, adequate sleep and give heavily
trained muscles time to recover.`;
  }

  state.messages.push(["AI", answer]);

  input.value = "";

  save();
  render();
}

/* -----------------------------
   BADGES
----------------------------- */

function badges() {

  const list = [

    [
      "⚡",
      "First Steps",
      "Complete your first quest",
      state.xp > 0
    ],

    [
      "🏋️",
      "Iron Will",
      "Complete 5 workouts",
      state.workouts.length >= 5
    ],

    [
      "◉",
      "Phase Hunter",
      "Log your first weight",
      state.weights.length > 0
    ],

    [
      "✦",
      "Momentum",
      "Complete all daily quests",
      state.quests.every(Boolean)
    ],

    [
      "♛",
      "Level Master",
      "Reach 1000 XP",
      state.xp >= 1000
    ],

    [
      "🏆",
      "Target Crusher",
      "Reach target weight",
      state.weight <= state.target
    ],

    [
      "🔥",
      "7 Day Warrior",
      "Maintain a 7-day streak",
      state.streak >= 7
    ],

    [
      "💎",
      "Consistency",
      "Complete 10 workouts",
      state.workouts.length >= 10
    ]

  ];

  return `
    <div class="hero">

      <div class="eyebrow">
        ACHIEVEMENT VAULT
      </div>

      <h2>BADGES</h2>

      <p class="muted">
        Earn achievements by proving
        your consistency.
      </p>

    </div>

    <div
      class="badges"
      style="margin-top:12px"
    >

      ${list.map(b => `
        <div
          class="card badge ${b[3] ? "" : "locked"}"
        >

          <div class="symbol">
            ${b[0]}
          </div>

          <h3>${b[1]}</h3>

          <div class="note">
            ${b[2]}
          </div>

        </div>
      `).join("")}

    </div>
  `;
}

/* -----------------------------
   HTML SAFETY
----------------------------- */

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* -----------------------------
   RENDER
----------------------------- */

function render() {

  const buttons =
    document.querySelectorAll("[data-tab]");

  buttons.forEach(button => {

    button.classList.toggle(
      "active",
      Number(button.dataset.tab) === state.tab
    );

  });

  const views = [
    dashboard,
    quests,
    phase,
    forge,
    oracle,
    badges
  ];

  const content =
    document.getElementById("content");

  if (content) {

    const view =
      views[state.tab] || dashboard;

    content.innerHTML = view();
  }

  save();
}

/* -----------------------------
   SESSION TIMER
----------------------------- */

setInterval(() => {

  const app =
    document.getElementById("app");

  const timer =
    document.getElementById("timer");

  if (
    !app ||
    !timer ||
    app.classList.contains("hidden")
  ) {
    return;
  }

  const seconds =
    Math.floor(
      (Date.now() - sessionStart) / 1000
    );

  const minutes =
    String(Math.floor(seconds / 60))
      .padStart(2, "0");

  const secs =
    String(seconds % 60)
      .padStart(2, "0");

  timer.textContent =
    `${minutes}:${secs}`;

}, 1000);

/* -----------------------------
   STARTUP
----------------------------- */

if (
  state.name &&
  state.name.trim() !== ""
) {

  const loginScreen =
    document.getElementById("login");

  const app =
    document.getElementById("app");

  if (loginScreen)
    loginScreen.classList.add("hidden");

  if (app)
    app.classList.remove("hidden");

  updateStreak();
  render();

} else {

  const app =
    document.getElementById("app");

  if (app)
    app.classList.add("hidden");
}