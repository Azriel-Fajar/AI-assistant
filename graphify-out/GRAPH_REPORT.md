# Graph Report - .  (2026-04-29)

## Corpus Check
- Corpus is ~2,007 words - fits in a single context window. You may not need a graph.

## Summary
- 42 nodes · 65 edges · 8 communities detected
- Extraction: 68% EXTRACTED · 32% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Assistant Skills & Config|Assistant Skills & Config]]
- [[_COMMUNITY_Active Projects & Goals|Active Projects & Goals]]
- [[_COMMUNITY_Cafe Lead Pipeline|Cafe Lead Pipeline]]
- [[_COMMUNITY_Rielcode Core Business|Rielcode Core Business]]
- [[_COMMUNITY_Decisions & Learning|Decisions & Learning]]
- [[_COMMUNITY_Client Communication Tools|Client Communication Tools]]
- [[_COMMUNITY_Project Kickoff Tools|Project Kickoff Tools]]
- [[_COMMUNITY_Portfolio Focus|Portfolio Focus]]

## God Nodes (most connected - your core abstractions)
1. `CLAUDE.md -- Assistant Config` - 21 edges
2. `Rielcode` - 8 edges
3. `Salatiga Cafes Outreach Campaign` - 8 edges
4. `Skill: /lead-tracker` - 7 edges
5. `Parallaxnet Canada Website Project` - 6 edges
6. `Leads Archive` - 6 edges
7. `Business Priority -- Land Clients` - 5 edges
8. `WhatsApp (Communication Channel)` - 5 edges
9. `Q2 2026 Goals` - 4 edges
10. `Azriel` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Salatiga Cafes Outreach Campaign` --semantically_similar_to--> `Business Priority -- Land Clients`  [INFERRED] [semantically similar]
  projects/rielcode-outreach/salatiga-cafes.md → context/current-priorities.md
- `Skill: /demo-website` --conceptually_related_to--> `Salatiga Cafes Outreach Campaign`  [INFERRED]
  CLAUDE.md → projects/rielcode-outreach/salatiga-cafes.md
- `CLAUDE.md -- Assistant Config` --references--> `Decision Log`  [EXTRACTED]
  CLAUDE.md → decisions/log.md
- `CLAUDE.md -- Assistant Config` --references--> `Learning Log`  [EXTRACTED]
  CLAUDE.md → references/learning-log.md
- `CLAUDE.md -- Assistant Config` --references--> `Azriel`  [EXTRACTED]
  CLAUDE.md → context/me.md

## Hyperedges (group relationships)
- **Rielcode Client Acquisition Flow** — outreach_salatiga_cafes, skill_lead_tracker, skill_client_proposal, skill_demo_website, skill_follow_up [INFERRED 0.82]
- **JARVIS Context System** — claude_md, priorities_business, priorities_college, goals_q2_2026, learning_log, decision_log [EXTRACTED 0.95]
- **Parallaxnet Delivery Blockers** — project_parallaxnet, team_ali, tool_whatsapp, decision_parallaxnet_delivered [INFERRED 0.88]

## Communities

### Community 0 - "Assistant Skills & Config"
Cohesion: 0.2
Nodes (10): CLAUDE.md -- Assistant Config, Skill: /chatbot-integration, Skill: /daily-priorities, Skill: /demo-website, Skill: /frontend-design, Skill: /git-command, Skill: /instagram-content, Skill: /site-cloner (+2 more)

### Community 1 - "Active Projects & Goals"
Cohesion: 0.32
Nodes (8): Portfolio Site -- portfolio.rielcode.com, Q2 2026 Goals, Business Priority -- Land Clients, College Priority -- Coursework, Financial Independence Priority, Parallaxnet Canada Website Project, Ali (Parallaxnet Contact), Parallaxnet Canada

### Community 2 - "Cafe Lead Pipeline"
Cohesion: 0.57
Nodes (8): Bragga Coffee (Lead), Koffietori (Lead), Menepilah Cafe (Lead), Secerca Coffee (Lead), Waroeng Lada Hitam (Lead), Leads Archive, Salatiga Cafes Outreach Campaign, Skill: /lead-tracker

### Community 3 - "Rielcode Core Business"
Cohesion: 0.29
Nodes (7): Azriel, Service: Custom Websites, Service: Simple E-commerce, Service: Budget Landing Pages, Skill: /gcal-schedule, Google Calendar (MCP), Rielcode

### Community 4 - "Decisions & Learning"
Cohesion: 0.67
Nodes (3): Decision Log, Decision: Distinguish Build Complete vs Delivered, Learning Log

### Community 5 - "Client Communication Tools"
Cohesion: 0.67
Nodes (3): Skill: /client-proposal, Skill: /follow-up, WhatsApp (Communication Channel)

### Community 6 - "Project Kickoff Tools"
Cohesion: 1.0
Nodes (2): Skill: /new-project, Skill: /project-kickoff

### Community 7 - "Portfolio Focus"
Cohesion: 1.0
Nodes (1): Portfolio Priority

## Knowledge Gaps
- **15 isolated node(s):** `College Priority -- Coursework`, `Portfolio Priority`, `Financial Independence Priority`, `Portfolio Site -- portfolio.rielcode.com`, `VS Code` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Project Kickoff Tools`** (2 nodes): `Skill: /new-project`, `Skill: /project-kickoff`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Portfolio Focus`** (1 nodes): `Portfolio Priority`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CLAUDE.md -- Assistant Config` connect `Assistant Skills & Config` to `Cafe Lead Pipeline`, `Rielcode Core Business`, `Decisions & Learning`, `Client Communication Tools`, `Project Kickoff Tools`?**
  _High betweenness centrality (0.608) - this node is a cross-community bridge._
- **Why does `Rielcode` connect `Rielcode Core Business` to `Assistant Skills & Config`, `Active Projects & Goals`, `Client Communication Tools`?**
  _High betweenness centrality (0.212) - this node is a cross-community bridge._
- **Why does `Business Priority -- Land Clients` connect `Active Projects & Goals` to `Cafe Lead Pipeline`, `Rielcode Core Business`?**
  _High betweenness centrality (0.173) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Salatiga Cafes Outreach Campaign` (e.g. with `Business Priority -- Land Clients` and `Skill: /demo-website`) actually correct?**
  _`Salatiga Cafes Outreach Campaign` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `Skill: /lead-tracker` (e.g. with `Koffietori (Lead)` and `Bragga Coffee (Lead)`) actually correct?**
  _`Skill: /lead-tracker` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `College Priority -- Coursework`, `Portfolio Priority`, `Financial Independence Priority` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._