LEVEL UP Website
================
A free, phone-friendly web version recreated from the uploaded Android Level Up project.

Files:
- index.html
- style.css
- app.js

Features:
- System dashboard
- Daily quests + XP
- Weight/phase tracking
- Workout Forge
- Fitness Oracle (offline rule-based demo)
- Badges
- LocalStorage persistence
- Mobile-first neon dark UI

Run locally:
Open index.html in a browser.

Free publishing:
Upload these 3 files to any static hosting service such as GitHub Pages, Netlify, or Cloudflare Pages.

/* ===== LEVEL UP V2 EFFECTS ===== */

body {
    background:
        radial-gradient(circle at 20% 20%, rgba(191,0,255,.18), transparent 25%),
        radial-gradient(circle at 80% 30%, rgba(56,189,248,.10), transparent 25%),
        radial-gradient(circle at 50% 90%, rgba(124,58,237,.15), transparent 30%),
        #020617;
    background-attachment: fixed;
    overflow-x: hidden;
}

/* Animated glow */
body::before {
    content: "";
    position: fixed;
    inset: -50%;
    z-index: -1;
    background:
        radial-gradient(circle, rgba(191,0,255,.08) 1px, transparent 1px);
    background-size: 35px 35px;
    animation: moveGrid 20s linear infinite;
    pointer-events: none;
}

@keyframes moveGrid {
    from {
        transform: translate(0,0);
    }
    to {
        transform: translate(35px,35px);
    }
}

/* Card glow */
.card,
.hero {
    transition:
        transform .25s ease,
        box-shadow .25s ease,
        border-color .25s ease;
}

.card:hover,
.hero:hover {
    transform: translateY(-3px);
    border-color: rgba(217,70,239,.7);
    box-shadow:
        0 0 20px rgba(191,0,255,.15),
        inset 0 0 20px rgba(191,0,255,.03);
}

/* Buttons */
button {
    transition:
        transform .15s ease,
        box-shadow .2s ease;
}

button:active {
    transform: scale(.95);
}

.primary:hover {
    box-shadow:
        0 0 15px rgba(191,0,255,.5),
        0 0 35px rgba(191,0,255,.2);
}

/* Progress animation */
.progress i {
    animation: progressGlow 2s ease-in-out infinite alternate;
}

@keyframes progressGlow {
    from {
        filter: brightness(1);
    }
    to {
        filter: brightness(1.5);
    }
}

/* Neon text */
.hero h2 {
    text-shadow:
        0 0 8px rgba(217,70,239,.35),
        0 0 20px rgba(191,0,255,.15);
}

/* Bottom navigation */
.bottom-nav {
    box-shadow:
        0 -5px 30px rgba(191,0,255,.08);
}
