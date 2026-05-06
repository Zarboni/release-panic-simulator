# Release Panic Simulator

> *You're the last QA Engineer before release. The clock is ticking. Can you make the right call?*

An interactive browser game built for QA engineers — and anyone who's ever had to decide whether to ship at 5 PM on a Friday.

---

## About

Release Panic Simulator puts you in the seat of a QA engineer facing four real-world release scenarios. Each scenario presents a fake-but-realistic release dashboard with:

- **Test results** — suites, failures, coverage, and flaky tests
- **Bug tracker** — open bugs with severity, reproduction steps, and component info  
- **CI/CD pipeline** — build, lint, unit, integration, E2E, security, and deploy stages
- **Risk assessment** — automated risk score with breakdown by factor

You investigate the evidence, then make one of four decisions:

| Decision | When to use |
|---|---|
|  **Approve Release** | Everything is acceptable — ship it |
|  **Block Release** | Too risky — hold it until fixed |
|  **Request Hotfix** | Close to ready — targeted fix first |
|  **Escalate to Dev Lead** | Decision is above your authority or requires more context |

There is always a correct answer. The outcome reveals what *actually* happens — and why.

---

## Scenarios

| # | Title | Summary | Difficulty |
|---|---|---|---|
| 1 | **The Friday Deploy** | v3.2.0 — New checkout flow. Marketing wants it live tonight. Payment gateway is timing out. | Medium |
| 2 | **The Minor CSS Fix** | v3.1.8 — "It's just one line change." But the diff tells a different story. | Hard |
| 3 | **The Q4 Big Release** | v4.0.0 — 3 months of work. CEO demo tomorrow. Load tests are failing. | Hard |
| 4 | **2 AM Hotfix Regression** | v3.1.7 — OAuth login is broken. The hotfix fixes it, but breaks something else. | Medium |

Each scenario is crafted from patterns that occur on real engineering teams — not invented chaos.

---

## Scoring

| Points | Criteria |
|---|---|
| +500 | Correct decision |
| +up to 360 | Time bonus (faster = more) |
| +40 per panel | Investigation bonus — for opening each evidence panel |
| +120 | Thoroughness bonus — for reviewing all 4 panels before deciding |
| **Max ~1,100/scenario** | Across 4 scenarios = ~4,400 possible |

### QA Ranks

| Score | Rank |
|---|---|
| 0–799 |  Intern Tester |
| 800–1,599 |  Junior QA Analyst |
| 1,600–2,399 |  QA Analyst |
| 2,400–3,199 |  Senior QA Engineer |
| 3,200–3,799 |  QA Lead |
| 3,800+ |  QA Principal |

---

## QA Concepts Demonstrated

This project was built to show how a QA engineer thinks — not just how they write tests.

**Risk assessment**
- Calculating release risk from multiple evidence sources (not just "does CI pass?")
- Understanding that a green pipeline can still hide critical issues

**Decision-making under pressure**
- When to block vs. escalate vs. request a targeted fix
- Knowing that "approve" and "block" are not always the right binary

**Attention to detail**
- Scenario 2 is specifically designed to reward reading past the obvious — a "CSS fix" with hidden security implications
- The diff matters as much as the ticket

**Communication of risk**
- Escalation isn't weakness — it's knowing which decisions need stakeholder awareness
- Blocking alone is not enough if you can't articulate *why*

**Regression awareness**
- Scenario 4 tests whether you notice that a hotfix introduced a *new* critical regression
- Fixing one thing is not the same as not breaking another

---

## Tech Stack

- **React 18** — UI components and state
- **Tailwind CSS 3** — styling with custom retro terminal theme
- **Vite** — build tool and dev server
- **Vanilla JS** — no external game framework; game logic in a single `useGameState` hook
- **localStorage** — high score persistence
- **Google Fonts** — Press Start 2P (headings) + VT323 (body)

No backend. No database. No authentication. Entirely client-side.

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/FaizCarstens/release-panic-simulator.git
cd release-panic-simulator

# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build
```

Requires Node.js 18+.

---

## Project Structure

```
src/
├── components/
│   ├── panels/
│   │   ├── TestResultsPanel.jsx   # Test suites with expandable failures
│   │   ├── BugTrackerPanel.jsx    # Bug list with severity filters
│   │   ├── PipelinePanel.jsx      # CI stages as visual pipeline
│   │   └── RiskMeter.jsx          # Animated risk score with breakdown
│   ├── Dashboard.jsx              # Main game screen
│   ├── DecisionPanel.jsx          # Decision buttons with confirmation
│   ├── IntroScreen.jsx            # Boot sequence + scenario selection
│   ├── OutcomeScreen.jsx          # Consequence reveal + score
│   └── TerminalLog.jsx            # Live scrolling event log
├── data/
│   └── scenarios.js               # All 4 scenarios + scoring config
├── hooks/
│   └── useGameState.js            # Game state, timer, scoring logic
├── App.jsx
├── main.jsx
└── index.css                      # CRT styling + Tailwind layers
```

---

## Design Decisions

**Why retro terminal aesthetic?**  
QA work lives in terminals, CI dashboards, and bug trackers. The aesthetic matches the domain and makes the fake data feel authentic rather than gamey.

**Why four specific decisions (not just approve/reject)?**  
Real QA sign-off decisions aren't binary. "Escalate" is a meaningful call. "Request hotfix" is different from "block." The four options reflect how senior QA engineers actually think.

**Why scenario 2 (the CSS fix) is the hardest?**  
The risk score shows 28/100. Most players approve it. The lesson: risk scores are computed from what's in front of you — they don't know what's *hidden* in the diff. Always read the full change.

**Why include consequences for every decision?**  
Every wrong call has a realistic outcome. The goal isn't to punish — it's to show *why* the decision matters. The "lesson" at the end of each consequence is the real deliverable.

---

## About the Developer

**Faiz Carstens** is a QA Engineer with experience in manual and automated testing, release management, risk assessment, and CI/CD quality gates.

This project was built as a portfolio piece to demonstrate not just technical skills, but QA *thinking* — the judgment calls, the pattern recognition, and the communication that separate good testers from great ones.

- LinkedIn: [linkedin.com/in/faizcarstens](https://linkedin.com/in/faizcarstens)
- GitHub: [github.com/FaizCarstens](https://github.com/FaizCarstens)

---

## License

MIT — feel free to fork, extend, and add your own scenarios.
