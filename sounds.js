// LEVEL UP V3 — Sound Engine

const SoundFX = (() => {
  let audioCtx = null;
  let muted = localStorage.getItem("levelup_muted") === "true";

  function start() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function tone(frequency, duration, type = "sine", volume = 0.08) {
    if (muted) return;

    start();

    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      volume,
      audioCtx.currentTime + 0.01
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioCtx.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration + 0.02);
  }

  function click() {
    tone(650, 0.06, "square", 0.035);
  }

  function success() {
    tone(520, 0.08, "sine", 0.06);

    setTimeout(() => {
      tone(780, 0.12, "sine", 0.07);
    }, 80);
  }

  function xp() {
    tone(420, 0.07, "triangle", 0.05);

    setTimeout(() => {
      tone(620, 0.08, "triangle", 0.05);
    }, 70);

    setTimeout(() => {
      tone(900, 0.12, "triangle", 0.06);
    }, 140);
  }

  function levelUp() {
    [260, 330, 440, 660, 880].forEach((f, i) => {
      setTimeout(() => {
        tone(f, 0.18, "sawtooth", 0.045);
      }, i * 100);
    });
  }

  function achievement() {
    tone(392, 0.12, "triangle", 0.06);

    setTimeout(() => {
      tone(523, 0.12, "triangle", 0.06);
    }, 120);

    setTimeout(() => {
      tone(784, 0.25, "triangle", 0.07);
    }, 240);
  }

  function error() {
    tone(180, 0.15, "sawtooth", 0.045);

    setTimeout(() => {
      tone(130, 0.18, "sawtooth", 0.04);
    }, 120);
  }

  function countdown() {
    tone(700, 0.08, "square", 0.04);
  }

  function complete() {
    tone(500, 0.1, "triangle", 0.06);

    setTimeout(() => {
      tone(750, 0.1, "triangle", 0.06);
    }, 100);

    setTimeout(() => {
      tone(1000, 0.2, "triangle", 0.07);
    }, 200);
  }

  function toggle() {
    muted = !muted;
    localStorage.setItem("levelup_muted", muted);
    return muted;
  }

  function isMuted() {
    return muted;
  }

  return {
    start,
    click,
    success,
    xp,
    levelUp,
    achievement,
    error,
    countdown,
    complete,
    toggle,
    isMuted
  };
})();
