# Graph Report - C:\Users\afw14\OneDrive\Documents\JARVIS  (2026-05-18)

## Corpus Check
- 21 files · ~1,200,238 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 211 nodes · 252 edges · 32 communities detected
- Extraction: 83% EXTRACTED · 16% INFERRED · 1% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]

## God Nodes (most connected - your core abstractions)
1. `create_homework_events()` - 15 edges
2. `YouTube Channel Strategy` - 12 edges
3. `parse_homework()` - 11 edges
4. `_make_mock_service()` - 9 edges
5. `CLAUDE.md Project Instructions` - 9 edges
6. `Rielcode Growth Plan Detail` - 9 edges
7. `Decisions Log` - 8 edges
8. `Skill: /repurpose-project` - 8 edges
9. `Skill: /audit-short` - 7 edges
10. `Design Skill` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Instagram Content Skill` --references--> `Rielcode Website (portfolio.rielcode.com)`  [EXTRACTED]
  .claude/skills/instagram-content/SKILL.md → screenshots/rielcode-mobile-top-20260511.png
- `create_homework_events()` --calls--> `handle_message()`  [INFERRED]
  homework-bot\gcal.py → homework-bot\main.py
- `parse_homework()` --calls--> `test_parse_day_name()`  [INFERRED]
  homework-bot\homework_parser.py → homework-bot\tests\test_parser.py
- `parse_homework()` --calls--> `test_parse_next_monday()`  [INFERRED]
  homework-bot\homework_parser.py → homework-bot\tests\test_parser.py
- `parse_homework()` --calls--> `test_parse_explicit_date()`  [INFERRED]
  homework-bot\homework_parser.py → homework-bot\tests\test_parser.py

## Hyperedges (group relationships)
- **Rielcode Growth Plan System** — entity_rielcode, entity_yt_rielcode, entity_salatiga_leads, concept_repurpose_pipeline, concept_audit_tool, concept_lead_magnet_course, concept_lead_gen [INFERRED 0.85]
- **Azriel Identity and Context Cluster** — entity_azriel, ctx_me, ctx_about_me, aios_intake, ctx_work, ctx_about_business [EXTRACTED 1.00]
- **YouTube Skills Cluster** — skill_yt_strategy, skill_yt_script, skill_yt_batch, entity_yt_rielcode [INFERRED 0.90]
- **YouTube Production Stack** — tool_obs, tool_capcut, tool_elevenlabs, tool_canva, tool_tubebuddy [EXTRACTED 1.00]
- **Rielcode Growth Plan Wild Ideas** — concept_repurpose_pipeline, concept_salatiga_audit_generator, concept_free_audit_tool, concept_lead_magnet_course, concept_build_live_streams [EXTRACTED 1.00]
- **YouTube Content Pillars** — concept_yt_pillar_builds, concept_yt_pillar_tips, concept_yt_pillar_process, concept_yt_pillar_hottakes [EXTRACTED 1.00]
- **MISAEL67 Referral Asset Set** — referral_misael67_ig, referral_misael67_wa, referral_misael67_infocard, referral_misael67 [EXTRACTED 1.00]
- **Rielcode Referral Template System** — rielcode_ig_base_caption, rielcode_wa_base_template, referral_program [EXTRACTED 1.00]
- **Design Skill Ecosystem** — skill_design, skill_brand, skill_design_system, skill_ui_styling, skill_ui_ux_pro_max, skill_frontend_design [EXTRACTED 0.95]
- **Daily Operations Skills** — skill_daily_priorities, skill_follow_up, skill_demo_website, gcal_integration, ntfy_notification [INFERRED 0.80]
- **Rielcode Website Mobile Design Iterations** — screenshot_rielcode_mobile_top, screenshot_rielcode_mobile_v2, screenshot_rielcode_mobile_v3, screenshot_rielcode_mobile_v4 [INFERRED 0.90]
- **Rielcode Client Project Workflow Skills** — skill_project_kickoff, skill_project_completion_doc, skill_repurpose_project, skill_lead_tracker, skill_site_review [INFERRED 0.85]
- **Rielcode Content and Marketing Skills** — skill_instagram_content, skill_repurpose_project, skill_site_review [INFERRED 0.80]
- **Skills Using Ntfy.sh Push Notifications** — skill_gcal_schedule, skill_git_command, skill_lead_tracker, skill_project_completion_doc [EXTRACTED 1.00]
- **Skills That Write to Decisions Log** — skill_new_project, skill_project_kickoff, skill_level_up [EXTRACTED 1.00]

## Communities

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (22): Free Website Audit Tool, Canva MCP Integration, DomPDF PDF Generation Engine, ElevenLabs MCP Voiceover Generation, GitHub Repository Integration, Google Calendar MCP Integration, Ntfy.sh Push Notifications, Rielcode Pricing Reference (+14 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (20): Build-with-me Live Streams, Free Website Audit Tool, Lead-Gen Funnel (YT to rielcode.com), $0 to First Website Mini-Course, Salatiga Case Study Generator, YT Pillar: Build Showcases, YT Pillar: Hot Takes / Controversy, YT Pillar: Process / Behind-Scenes (+12 more)

### Community 2 - "Community 2"
Cohesion: 0.22
Nodes (16): get_service_account_info(), build_service(), CalendarResult, create_homework_events(), _deadline_body(), _insert_event(), _study_block_body(), _make_mock_service() (+8 more)

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (18): AIOS Intake, CLAUDE.md Project Instructions, Lead Generation System, Learning: Build Complete vs Delivered Distinction, Repurpose Per Build Pipeline, About Rielcode Business, About Azriel, Goals and Milestones Q2 2026 (+10 more)

### Community 4 - "Community 4"
Cohesion: 0.17
Nodes (8): confirm(), getCalendar(), getDrive(), getGmail(), createOAuthClient(), getAuthenticatedClient(), loadConfig(), runAuthFlow()

### Community 5 - "Community 5"
Cohesion: 0.2
Nodes (11): _clean_subject(), parse_homework(), Parse a natural-language homework message.     Returns {"subject": str, "due_da, handle_message(), test_parse_all_noise_subject(), test_parse_bad_date_returns_none(), test_parse_day_name(), test_parse_explicit_date() (+3 more)

### Community 6 - "Community 6"
Cohesion: 0.18
Nodes (12): Banner Art Direction Styles, Brand Guidelines Source of Truth, Banner Design Capability (22 Styles), Corporate Identity Program Capability, Logo Design Capability (55 Styles), Gemini AI Image Generation, Skill: banner-design, Skill: brand (+4 more)

### Community 7 - "Community 7"
Cohesion: 0.2
Nodes (12): Floating Chatbot Widget, Dark UI Design Theme, Free Hosting and .COM Promotional Banner, Rielcode Website (portfolio.rielcode.com), Rielcode Mobile Hero Screenshot (v1), Rielcode Mobile Hero Screenshot (v2 with chatbot), Rielcode Mobile Hero Screenshot (v3 with chatbot), Rielcode Mobile Hero Screenshot (v4 with chatbot) (+4 more)

### Community 8 - "Community 8"
Cohesion: 0.2
Nodes (11): portfolio.rielcode.com, MISAEL67 Referral Code, MISAEL67 Instagram Caption, MISAEL67 Info Card, MISAEL67 WhatsApp Message, Rielcode Referral Program, rielcode.com Website, Rielcode Base Instagram Caption Template (+3 more)

### Community 9 - "Community 9"
Cohesion: 0.36
Nodes (9): build_panel(), find_latest_session(), git_info(), main(), pct_bar(), pct_color(), Return branch, repo name, dirty flag for given path., Scan $TEMP for claude-ctx-*.json files and return the most recently     modified (+1 more)

### Community 10 - "Community 10"
Cohesion: 0.22
Nodes (9): Decisions Log (decisions/log.md), Lead Sales Pipeline (cold to closed), Leads CRM File (leads/leads.md), Three Ms of AI Framework (Mindset Method Machine), WhatsApp Deep Links for Lead Communication, Lead Tracker Skill, Level Up Automation Skill, New Project Skill (+1 more)

### Community 11 - "Community 11"
Cohesion: 0.4
Nodes (0): 

### Community 12 - "Community 12"
Cohesion: 0.4
Nodes (5): Google Calendar MCP Integration, ntfy Phone Notification System, Daily Priorities Skill, Follow-up Skill, WhatsApp Communication Channel

### Community 13 - "Community 13"
Cohesion: 0.67
Nodes (4): Demo Website Skill, Emil Design Engineer Skill, Frontend Design Skill, Tailwind CSS

### Community 14 - "Community 14"
Cohesion: 0.5
Nodes (4): Parallaxnet Client Site, Rielcode Hero Iterations (v1-v8), Rielcode Mobile Views, Rielcode Site Evolution (May 2026)

### Community 15 - "Community 15"
Cohesion: 0.67
Nodes (2): Set up dummy environment variables for testing., setup_env_vars()

### Community 16 - "Community 16"
Cohesion: 0.67
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 0.67
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 0.67
Nodes (3): Communication Style Rules, Client Proposal Format (WhatsApp + Full Doc), Skill: client-proposal

### Community 19 - "Community 19"
Cohesion: 0.67
Nodes (3): Checkout Confirmation Page (Step 2), Order Form Full Page (1280px), Order Form Package Section Crop

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (2): Four Cs AIOS Audit Framework, Skill: audit (Four Cs AIOS Audit)

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (1): CLAUDE.local.md Local Overrides

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (1): Session Summary Template

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (1): Rielcode Portfolio Page Screenshot v2

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (1): Rielcode Portfolio Page Screenshot v3

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (1): Rielcode Services Page Screenshot v2

## Ambiguous Edges - Review These
- `Rielcode Portfolio Page Screenshot` → `Rielcode Website (portfolio.rielcode.com)`  [AMBIGUOUS]
  screenshots/rielcode-portfolio-20260511.png · relation: references
- `Rielcode Services Page Screenshot` → `Rielcode Website (portfolio.rielcode.com)`  [AMBIGUOUS]
  screenshots/rielcode-services-20260511.png · relation: references
- `Rielcode Testimonials Page Screenshot` → `Rielcode Website (portfolio.rielcode.com)`  [AMBIGUOUS]
  screenshots/rielcode-testimonials-20260511.png · relation: references

## Knowledge Gaps
- **67 isolated node(s):** `Parse a natural-language homework message.     Returns {"subject": str, "due_da`, `Set up dummy environment variables for testing.`, `Return branch, repo name, dirty flag for given path.`, `Scan $TEMP for claude-ctx-*.json files and return the most recently     modified`, `CLAUDE.local.md Local Overrides` (+62 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 20`** (2 nodes): `runBrowser()`, `cross-browser-template.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (2 nodes): `Four Cs AIOS Audit Framework`, `Skill: audit (Four Cs AIOS Audit)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `playwright.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `fill-custom-plan-pro.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `smoke.spec.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `launch-widget.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (1 nodes): `CLAUDE.local.md Local Overrides`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (1 nodes): `Session Summary Template`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (1 nodes): `Rielcode Portfolio Page Screenshot v2`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (1 nodes): `Rielcode Portfolio Page Screenshot v3`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (1 nodes): `Rielcode Services Page Screenshot v2`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Rielcode Portfolio Page Screenshot` and `Rielcode Website (portfolio.rielcode.com)`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Rielcode Services Page Screenshot` and `Rielcode Website (portfolio.rielcode.com)`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Rielcode Testimonials Page Screenshot` and `Rielcode Website (portfolio.rielcode.com)`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Why does `Skill: /repurpose-project` connect `Community 0` to `Community 3`, `Community 7`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `Skill: /audit-short` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `Decisions Log` connect `Community 0` to `Community 1`, `Community 3`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `create_homework_events()` (e.g. with `handle_message()` and `test_creates_three_events()`) actually correct?**
  _`create_homework_events()` has 9 INFERRED edges - model-reasoned connections that need verification._