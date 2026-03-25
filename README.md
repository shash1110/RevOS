# RevOS — AI for Intelligent Sales & Revenue Operations

> **Hackathon Submission | Problem #4 | Anthropic Hackathon 2026**

A multi-agent AI platform that plugs into CRM and communication systems to accelerate the full revenue lifecycle — from cold prospecting to churn prevention — powered by Claude.

---

## What It Does

RevOS orchestrates **four specialized Claude AI agents**, each responsible for a distinct phase of the sales pipeline:

| Agent | What It Does |
|-------|-------------|
| **Prospecting Agent** | Researches prospects, scores ICP fit, writes personalized outreach + follow-up sequences |
| **Deal Intelligence Agent** | Monitors pipeline health, detects risk signals, generates recovery plays with talking points |
| **Revenue Retention Agent** | Predicts churn from usage signals, builds 3-step intervention workflows, drafts CSM outreach |
| **Competitive Intel Agent** | Generates battlecards with objection handlers, trap questions, and win strategies on demand |

---

## Live Demo

Open `sales-agent-demo.html` in any browser. The demo app connects directly to Claude's API and lets you run all four agents interactively.

**No build step required** — it's a single HTML file.

---

## Setup Instructions

### Running the Demo App

1. Clone this repository
2. Open `sales-agent-demo.html` in your browser
3. The app uses Claude API via claude.ai's built-in API access (no key needed when running inside claude.ai)

> **Note:** To run outside claude.ai, add your Anthropic API key to the fetch headers in the `<script>` section: `"x-api-key": "YOUR_KEY_HERE"`

### Production Deployment (Full Architecture)

For production deployment with real CRM integration, you'll need:

**Prerequisites:**
- Node.js 18+
- Salesforce / HubSpot account (OAuth 2.0 credentials)
- Gmail API credentials (for email draft creation)
- Anthropic API key
- Redis (Upstash recommended for serverless)

**Environment Variables:**
```bash
ANTHROPIC_API_KEY=your_key_here
SALESFORCE_CLIENT_ID=...
SALESFORCE_CLIENT_SECRET=...
HUBSPOT_API_KEY=...
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
REDIS_URL=redis://...
```

**Install & Run:**
```bash
npm install
npm run dev        # Development (localhost:3000)
npm run deploy     # Deploy to Vercel
```

---

## Repository Structure

```
revos/
├── sales-agent-demo.html     # Live demo — single-file app, runs in browser
├── README.md                 # This file
├── architecture-document.docx  # System design: agent roles, data flow, tech stack
├── impact-model.docx           # ROI analysis: $1.9M ARR impact model
├── src/
│   ├── orchestrator/
│   │   ├── router.js          # Signal classification + agent dispatch
│   │   └── context-store.js   # Redis-backed shared context bus
│   ├── agents/
│   │   ├── prospecting.js     # Prospecting agent (web search + outreach)
│   │   ├── deal-intelligence.js  # Risk scoring + recovery plays
│   │   ├── retention.js       # Churn prediction + intervention
│   │   └── competitive.js     # Battlecard generation
│   ├── integrations/
│   │   ├── salesforce.js      # CRM read/write
│   │   ├── hubspot.js         # CRM alternative
│   │   └── gmail.js           # Email draft creation
│   └── api/
│       └── claude.js          # Anthropic API wrapper with retry logic
└── docs/
    ├── architecture-diagram.png  # Visual architecture diagram
    └── agent-prompts/            # System prompt files for each agent
```

---

## Architecture Overview

```
External Signals (CRM webhooks, email opens, usage drops)
        ↓
  ORCHESTRATOR (signal classifier + context loader)
        ↓
  ┌─────────────────────────────────────────────────┐
  │  Prospecting  │  Deal Intel  │  Retention  │ Competitive │
  │    Agent      │    Agent     │    Agent    │   Agent     │
  └─────────────────────────────────────────────────┘
        ↓                  ↓              ↓              ↓
  [Claude API — claude-sonnet — with tool use]
        ↓
  Human Review (Slack / CRM Task / RevOS Dashboard)
        ↓
  CRM Write-back (approved outputs → Salesforce / HubSpot)
```

Each agent uses Claude with a specialized system prompt and has access to domain-specific tools (web search, CRM read, analytics APIs).

---

## Business Impact (Back-of-Envelope)

For a $15M ARR B2B SaaS company (20 AEs, 8 SDRs, 6 CSMs):

| Value Driver | Annual Impact |
|---|---|
| Prospecting Agent (2.75× more prospects) | +$800K ARR |
| Deal Intelligence (recover at-risk deals) | +$302K ARR |
| Revenue Retention (churn 12% → 7.5%) | +$675K ARR |
| Competitive Intel (win rate +9pp) | +$126K ARR |
| **Total Revenue Impact** | **+$1.90M ARR** |
| Time savings (3,264 hours/year) | +$195K |
| Platform cost | −$120K |
| **Net Annual Benefit** | **+$1.975M** |
| **ROI** | **13.5×** |

See `impact-model.docx` for full model with all assumptions.

---

## Evaluation Criteria Addressed

| Criterion | How We Address It |
|---|---|
| **CRM Integration Depth** | Bidirectional Salesforce/HubSpot sync — reads context, writes back outputs |
| **Pipeline Impact Metrics** | Tracked: conversion uplift, cycle time reduction, churn rate delta |
| **Quality of Actions** | Structured outputs with specific talking points, not generic advice |
| **Adapts to Engagement Signals** | Real-time signal queue triggers appropriate agent automatically |

---

## Built With

- **Claude (claude-sonnet)** — all agent reasoning and generation
- **Anthropic API** — direct integration, no middleware
- **Salesforce / HubSpot APIs** — CRM read/write
- **Gmail API** — email draft creation
- **Mixpanel / Amplitude** — usage signal ingestion for retention agent
- **Redis (Upstash)** — shared context store between agents
- **Vercel Edge Functions** — orchestrator deployment

---

*Built for Anthropic Hackathon 2026 · Problem Statement #4: AI for Intelligent Sales & Revenue Operations*
