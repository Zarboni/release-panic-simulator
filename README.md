# Release Panic Simulator

> *You're the last QA Engineer before release. The clock is ticking. Can you make the right call?*

An interactive browser game for QA engineers — and anyone who's had to decide whether to ship at 5 PM on a Friday.

**[Play it here](https://zarboni.github.io/release-panic-simulator/)**

---

## What it is

You're given a realistic release dashboard — test results, bug tracker, CI pipeline, risk score — and you have to make a call before the clock runs out. Four scenarios, each built around situations that actually happen on engineering teams.

Your options at the end of each scenario:

| Decision | When to use |
|---|---|
| **Approve Release** | Everything is acceptable — ship it |
| **Block Release** | Too risky — hold it until fixed |
| **Request Hotfix** | Close to ready — one targeted fix first |
| **Escalate to Dev Lead** | The decision is above your authority |

There's always a correct answer. The outcome screen shows what would actually happen — and why.

---

## Scenarios

| # | Title | Summary | Difficulty |
|---|---|---|---|
| 1 | **The Friday Deploy** | v3.2.0 — New checkout flow. Marketing wants it live tonight. Payment gateway is timing out. | Medium |
| 2 | **The Minor CSS Fix** | v3.1.8 — "It's just one line change." But the diff tells a different story. | Hard |
| 3 | **The Q4 Big Release** | v4.0.0 — 3 months of work. CEO demo tomorrow. Load tests are failing. | Hard |
| 4 | **2 AM Hotfix Regression** | v3.1.7 — OAuth login is broken. The hotfix fixes it, but breaks something else. | Medium |

---

## Scoring

| Points | Criteria |
|---|---|
| +500 | Correct decision |
| +up to 360 | Time bonus — faster decisions score more |
| +40 per panel | Investigation bonus |
| +120 | Thoroughness bonus — only if you reviewed all 4 panels before deciding |
| **Max ~1,100/scenario** | Across 4 scenarios = ~4,400 possible |

### QA Ranks

| Score | Rank |
|---|---|
| 0–799 | Intern Tester |
| 800–1,599 | Junior QA Analyst |
| 1,600–2,399 | QA Analyst |
| 2,400–3,199 | Senior QA Engineer |
| 3,200–3,799 | QA Lead |
| 3,800+ | QA Principal |

---

## Why I built it

I built this to show how I approach release decisions, not just that I can write tests. The scenarios are designed around the decisions that matter in practice:

- Reading the full picture, not just whether CI is green
- Knowing when to block, when to escalate, and when a targeted fix is the right call
- Catching regressions introduced by the fix itself — Scenario 4 is specifically about this
- Recognising that a low risk score doesn't mean a safe release — Scenario 2 is the trap

---

## Tech Stack

- **React 18** — UI components and state
- **Tailwind CSS 3** — custom retro terminal theme
- **Vite** — build and dev server
- **localStorage** — high score persistence
- **Google Fonts** — Press Start 2P (headings) + VT323 (body)

No backend. No database. Entirely client-side.

---

## Getting Started

```bash
git clone https://github.com/Zarboni/release-panic-simulator.git
cd release-panic-simulator
npm install
npm run dev
```

Requires Node.js 18+.

---

## Design Notes

**Why retro terminal?**  
QA work lives in terminals, CI dashboards, and bug trackers. The aesthetic fits the domain and makes the fake data feel more real than a polished UI would.

**Why four decisions instead of just approve/block?**  
Because that's how it actually works. "Escalate" is a meaningful choice. "Request hotfix" is different from "block and come back later." The binary approve/reject framing misses the nuance.

**Why does Scenario 2 have a risk score of 28/100?**  
That's the point. The risk score is calculated from what the pipeline can see — it can't read the diff. Most players approve it, and most players are wrong.

**Why show consequences for every wrong answer?**  
Punishing wrong answers without explanation doesn't teach anything. The outcome screen exists to make the reasoning visible, not just the verdict.

---

## About

**Faiz Carstens** — QA Engineer with a focus on release management, risk assessment, and CI/CD quality gates.

- GitHub: [github.com/Zarboni](https://github.com/Zarboni)

---

## License

MIT — fork it, add scenarios, make it your own.
