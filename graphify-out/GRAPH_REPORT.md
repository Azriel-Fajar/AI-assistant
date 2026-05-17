# Graph Report - .  (2026-05-17)

## Corpus Check
- Large corpus: 161 files · ~1,176,032 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 563 nodes · 592 edges · 59 communities (36 shown, 23 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 70 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_JARVIS Core Config|JARVIS Core Config]]
- [[_COMMUNITY_Rielcode Playwright Audit|Rielcode Playwright Audit]]
- [[_COMMUNITY_Obsidian Core Plugins|Obsidian Core Plugins]]
- [[_COMMUNITY_Business Context Hub|Business Context Hub]]
- [[_COMMUNITY_Obsidian Workspace State|Obsidian Workspace State]]
- [[_COMMUNITY_Growth Plan & Decisions|Growth Plan & Decisions]]
- [[_COMMUNITY_Browser Automation Tools|Browser Automation Tools]]
- [[_COMMUNITY_Referral Codes & Templates|Referral Codes & Templates]]
- [[_COMMUNITY_Obsidian Graph Settings|Obsidian Graph Settings]]
- [[_COMMUNITY_JARVIS Package Config|JARVIS Package Config]]
- [[_COMMUNITY_Homework Bot Calendar|Homework Bot Calendar]]
- [[_COMMUNITY_Rielcode Site Screenshots|Rielcode Site Screenshots]]
- [[_COMMUNITY_Homework Bot Parser|Homework Bot Parser]]
- [[_COMMUNITY_URL Screenshot Capture|URL Screenshot Capture]]
- [[_COMMUNITY_Playwright Screenshot Skill|Playwright Screenshot Skill]]
- [[_COMMUNITY_Cross-Browser Test Runner|Cross-Browser Test Runner]]
- [[_COMMUNITY_Graphify Detection Config|Graphify Detection Config]]
- [[_COMMUNITY_URL Screenshot Package|URL Screenshot Package]]
- [[_COMMUNITY_Rielcode UI Audit States|Rielcode UI Audit States]]
- [[_COMMUNITY_3Ms AI Framework|3Ms AI Framework]]
- [[_COMMUNITY_YouTube Rielcode Strategy|YouTube Rielcode Strategy]]
- [[_COMMUNITY_Homework Bot Modules|Homework Bot Modules]]
- [[_COMMUNITY_Parallaxnet Client Project|Parallaxnet Client Project]]
- [[_COMMUNITY_Rielcode Mobile UI|Rielcode Mobile UI]]
- [[_COMMUNITY_Rielcode Subdomain Plans|Rielcode Subdomain Plans]]
- [[_COMMUNITY_Obsidian App Settings|Obsidian App Settings]]
- [[_COMMUNITY_Rielcode Checkout Flow|Rielcode Checkout Flow]]
- [[_COMMUNITY_Claude Settings & Hooks|Claude Settings & Hooks]]
- [[_COMMUNITY_Playwright Scrape Runner|Playwright Scrape Runner]]
- [[_COMMUNITY_Animation Libraries|Animation Libraries]]
- [[_COMMUNITY_Custom Plan Fill Script|Custom Plan Fill Script]]
- [[_COMMUNITY_Azriel Identity|Azriel Identity]]
- [[_COMMUNITY_Testimonials Thank-You|Testimonials Thank-You]]
- [[_COMMUNITY_Homework Bot Test Fixtures|Homework Bot Test Fixtures]]
- [[_COMMUNITY_Portfolio Site|Portfolio Site]]
- [[_COMMUNITY_Claude Skill Sync Hook|Claude Skill Sync Hook]]
- [[_COMMUNITY_DC Maintenance Module|DC Maintenance Module]]
- [[_COMMUNITY_Goals & Portfolio|Goals & Portfolio]]
- [[_COMMUNITY_PHP PDF Generator|PHP PDF Generator]]
- [[_COMMUNITY_Obsidian Graph Workspace|Obsidian Graph Workspace]]
- [[_COMMUNITY_Playwright Config|Playwright Config]]
- [[_COMMUNITY_Bootstrap Site Cloner|Bootstrap Site Cloner]]
- [[_COMMUNITY_Smoke Test|Smoke Test]]
- [[_COMMUNITY_Testimonials UI|Testimonials UI]]
- [[_COMMUNITY_Obsidian App|Obsidian App]]
- [[_COMMUNITY_Obsidian Plugins|Obsidian Plugins]]
- [[_COMMUNITY_Skill Example|Skill Example]]
- [[_COMMUNITY_About Me Context|About Me Context]]
- [[_COMMUNITY_LinkedIn Caption Template|LinkedIn Caption Template]]
- [[_COMMUNITY_Session Summary Template|Session Summary Template]]
- [[_COMMUNITY_Checkout Package Section|Checkout Package Section]]
- [[_COMMUNITY_Checkout Packages Crop|Checkout Packages Crop]]
- [[_COMMUNITY_Checkout Purchase Info|Checkout Purchase Info]]
- [[_COMMUNITY_Example.com H1 Screenshot|Example.com H1 Screenshot]]
- [[_COMMUNITY_Rielcode Terms Page|Rielcode Terms Page]]
- [[_COMMUNITY_Mobile 390px Screenshot|Mobile 390px Screenshot]]

## God Nodes (most connected - your core abstractions)
1. `CLAUDE.md Root Operating Manual` - 16 edges
2. `create_homework_events()` - 15 edges
3. `Rielcode Playwright Audit Spec` - 12 edges
4. `parse_homework()` - 11 edges
5. `_make_mock_service()` - 9 edges
6. `Rielcode Pricing Reference` - 9 edges
7. `hiddenItems` - 8 edges
8. `Playwright Browser Automation Library` - 8 edges
9. `right` - 7 edges
10. `AIOS Intake Questionnaire` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Parallaxnet.id Website` --implements--> `Parallaxnet Canada Project`  [INFERRED]
  screenshots/localhost-parallaxnet-20id-public-20260515-204350.png → references/learning-log.md
- `Rielcode Order Form (Checkout Step 1)` --references--> `Custom Plan (from IDR 500k)`  [INFERRED]
  screenshots/checkout-full-1280.png → references/rielcode-pricing.md
- `Screenshot: Rielcode Site Local (2026-05-07)` --references--> `Rielcode Local Site (http://localhost/Rielcode/)`  [INFERRED]
  screenshots/localhost-rielcode-20260507-100715.png → tests/rielcode-audit.md
- `Strategic Paralysis Pain Point (Q7)` --rationale_for--> `Skill: daily-priorities`  [INFERRED]
  aios-intake.md → .claude/skills/daily-priorities/SKILL.md
- `Communication Style Rules` --conceptually_related_to--> `CLAUDE.md Root Operating Manual`  [INFERRED]
  .claude/rules/communication-style.md → CLAUDE.md

## Hyperedges (group relationships)
- **Homework Bot Subsystem** — homeworkbotmain_main, homeworkbotgcal_gcal, homeworkparser_parser, homeworkbotconfig_config, telegramapi_api, googlecalendarapi_api [EXTRACTED 1.00]
- **Playwright Screenshot Tools** — screenshot_screenshot, capturejs_capture, scraperunner_scraperunner, playwright_lib [EXTRACTED 0.95]
- **Homework Bot Test Suite** — testcalendar_testcalendar, testparser_testparser, testconftest_conftest [EXTRACTED 1.00]
- **Rielcode Playwright Test Suite** — rielcode_audit_spec, smoke_spec, fill_custom_plan_pro, cross_browser_template_runner [INFERRED 0.85]
- **Skills that Send ntfy Phone Notifications** — skill_client_proposal, skill_follow_up, skill_daily_priorities, skill_demo_website, skill_gcal_schedule, skill_git_command [EXTRACTED 1.00]
- **Skills Using Google Calendar MCP** — skill_gcal_schedule, skill_daily_priorities, connections_gcal [EXTRACTED 1.00]
- **Core AIOS File Structure** — claude_md, connections_md, expansions_md, aios_intake, comm_style_rules [EXTRACTED 1.00]
- **Rielcode Site Audit Test Suite** — rielcode_audit_spec_homepage, rielcode_audit_spec_mobile, rielcode_audit_spec_packages, rielcode_audit_spec_order_form, rielcode_audit_spec_custom_plan, rielcode_audit_spec_about, rielcode_audit_spec_projects, rielcode_audit_spec_testimonials, rielcode_audit_spec_broken_images [EXTRACTED 1.00]
- **Frontend and Design Skills** — skill_frontend_design, skill_emil_design_eng, skill_demo_website [INFERRED 0.80]
- **Client Communication Skills** — skill_client_proposal, skill_follow_up, skill_instagram_content, skill_audit_short [INFERRED 0.85]
- **YouTube Content Production Pipeline** — skill_yt_strategy, skill_yt_script, skill_yt_batch, entity_elevenlabs_mcp, entity_canva_mcp, entity_yt_strategy_doc [EXTRACTED 1.00]
- **Lead Pipeline Management Skills** — skill_lead_tracker, skill_project_kickoff, skill_project_completion_doc, skill_repurpose_project, entity_leads_file, entity_whatsapp [EXTRACTED 0.90]
- **Rielcode Business Context Files** — context_about_business, context_about_me, context_current_priorities, context_goals, entity_rielcode, entity_azriel [EXTRACTED 1.00]
- **Website Build and Clone Skills** — skill_site_cloner, skill_site_review, skill_video_to_website, entity_bootstrap5, entity_playwright_tool [INFERRED 0.80]
- **Automation and Onboarding Skills** — skill_onboard, skill_level_up, skill_skill_builder, entity_3ms_framework, entity_decisions_log [EXTRACTED 0.90]
- **Rielcode May 2026 Upgrade (Pay Subdomain + Main Site)** — spec_rielcode_upgrade, plan_pay_subdomain, plan_rielcode_main_site, concept_pay_rielcode, concept_testimonials [EXTRACTED 1.00]
- **Referral System (Spec + Plan + Program)** — spec_referral_system, plan_referral_system, project_referral, concept_referral_commissions [EXTRACTED 1.00]
- **Salatiga Cafe Cold Outreach Leads** — project_salatiga_outreach, lead_koffietori, lead_bragga_coffee, lead_menepilah, lead_secerca, lead_waroeng_lada [EXTRACTED 1.00]
- **Rielcode Growth Wild Ideas Bundle** — project_growth_plan, concept_growth_repurpose, concept_growth_salatiga_audit, concept_growth_audit_tool, concept_growth_lead_magnet, decision_yt_launch, decision_growth_skills [EXTRACTED 1.00]
- **All Rielcode Referral Codes** — referral_code_CYN10, referral_code_FRED14, referral_code_MISAEL67, referral_code_NAND24, referral_code_YEZ10 [EXTRACTED 1.00]
- **CYN10 Personalized Content Set** — personalized_CYN10_ig, personalized_CYN10_infocard, personalized_CYN10_wa, referral_code_CYN10 [EXTRACTED 1.00]
- **FRED14 Personalized Content Set** — personalized_FRED14_ig, personalized_FRED14_infocard, personalized_FRED14_wa, referral_code_FRED14 [EXTRACTED 1.00]
- **MISAEL67 Personalized Content Set** — personalized_MISAEL67_ig, personalized_MISAEL67_infocard, personalized_MISAEL67_wa, referral_code_MISAEL67 [EXTRACTED 1.00]
- **NAND24 Personalized Content Set** — personalized_NAND24_ig, personalized_NAND24_infocard, personalized_NAND24_wa, referral_code_NAND24 [EXTRACTED 1.00]
- **YEZ10 Personalized Content Set** — personalized_YEZ10_ig, personalized_YEZ10_infocard, personalized_YEZ10_wa, referral_code_YEZ10 [EXTRACTED 1.00]
- **YouTube Content Pillars (4 pillars)** — yt_content_pillar_builds, yt_content_pillar_tips, yt_content_pillar_process, yt_content_pillar_hottakes [EXTRACTED 1.00]
- **YouTube Rielcode Core Assets** — project_youtube_rielcode, youtube_channel_branding, youtube_strategy, yt_handle_rielcodeofficial [EXTRACTED 1.00]
- **Rielcode Checkout Flow (Order Form + Confirmation)** — rielcode_order_form, rielcode_checkout_confirmation, pricing_custom_plan, screenshot_checkout_full_1280, screenshot_checkout_confirmation_real, screenshot_checkout_fixed, screenshot_checkout_purchase_info [INFERRED 0.90]
- **Skills That Consume Rielcode Pricing Reference** — rielcode_pricing, skill_site_review, skill_client_proposal, skill_follow_up [EXTRACTED 1.00]
- **Three Ms Framework Layers** — 3ms_framework, 3ms_mindset_layer, 3ms_method_layer, 3ms_machine_layer [EXTRACTED 1.00]
- **Parallaxnet.id Site Screenshots Set** — parallaxnet_id_site, screenshot_parallaxnet_home_1, screenshot_parallaxnet_home_2, screenshot_parallaxnet_galeri_1, screenshot_parallaxnet_galeri_2, screenshot_parallaxnet_galeri_3 [EXTRACTED 1.00]
- **Rielcode Site Audit Screenshot Series** — screenshot_audit_homepage_hero, screenshot_audit_homepage_scrolled, screenshot_audit_mobile_initial, screenshot_audit_mobile_menu_open, screenshot_audit_mobile_scrolled, screenshot_audit_cta_clicked, screenshot_audit_packages_all, screenshot_audit_order_form_blank, screenshot_audit_order_form_filled [EXTRACTED 1.00]
- **Rielcode Mobile Layout Iteration Screenshots** — screenshot_rielcode_mobile_390, screenshot_rielcode_mobile_top, screenshot_rielcode_mobile_fixed, screenshot_rielcode_mobile_v2, screenshot_rielcode_mobile_v3, screenshot_rielcode_mobile_v4 [INFERRED 0.85]
- **Rielcode Localhost Development Screenshots** — screenshot_localhost_rielcode_homepage_full, screenshot_localhost_rielcode_custom_plan, screenshot_localhost_rielcode_order_form, screenshot_localhost_rielcode_terms, screenshot_localhost_rielcode_testimonials_index, screenshot_localhost_rielcode_testimonials_thankyou_1, screenshot_localhost_rielcode_testimonials_thankyou_2 [EXTRACTED 1.00]
- **Rielcode Order Flow UI Components** — ui_rielcode_packages_section, ui_rielcode_custom_plan_builder, ui_rielcode_order_form, feature_rielcode_addons [INFERRED 0.85]
- **Rielcode Audit Screenshot Series** — screenshot_04_submit_blocked, screenshot_05_custom_plan_initial, screenshot_05_custom_plan_toggled, screenshot_06_about, screenshot_07_projects, screenshot_08_testimonials, screenshot_09_broken_image_check [INFERRED 0.95]
- **Custom Plan UI State Comparison** — screenshot_05_custom_plan_initial, screenshot_05_custom_plan_toggled, concept_custom_plan_builder [EXTRACTED 1.00]

## Communities (59 total, 23 thin omitted)

### Community 0 - "JARVIS Core Config"
Cohesion: 0.05
Nodes (54): AIOS Intake Questionnaire, Communication Channels (Q5), Azriel Identity and Offer (Q1), Strategic Paralysis Pain Point (Q7), 90-Day Priorities Q2 2026 (Q3), Revenue Tracking Setup (Q4), CLAUDE.md Root Operating Manual, Context File References in CLAUDE.md (+46 more)

### Community 1 - "Rielcode Playwright Audit"
Cohesion: 0.05
Nodes (34): about, addonCheckbox, burger, cards, chatbotIcon, chatbotToggle, closeBtn, cta (+26 more)

### Community 2 - "Obsidian Core Plugins"
Cohesion: 0.06
Nodes (31): audio-recorder, backlink, bases, bookmarks, canvas, command-palette, daily-notes, editor-status (+23 more)

### Community 3 - "Business Context Hub"
Cohesion: 0.09
Nodes (31): Current Priorities Context, Three Ms of AI Framework (Nate Herk), AIOS Intake File (aios-intake.md), Canva MCP Integration, Decisions Log (decisions/log.md), dompdf PDF Engine, ElevenLabs MCP Integration, Leads CRM File (leads/leads.md) (+23 more)

### Community 4 - "Obsidian Workspace State"
Cohesion: 0.07
Nodes (29): active, bases:Create new base, canvas:Create new canvas, command-palette:Open command palette, daily-notes:Open today's daily note, graph:Open graph view, switcher:Open quick switcher, templates:Insert template (+21 more)

### Community 5 - "Growth Plan & Decisions"
Cohesion: 0.08
Nodes (29): Parallaxnet Canada (Client), Growth Idea 3: Free Website Audit Tool, Growth Idea 4: $0 to First Website Lead Magnet Course, Growth Idea 1: Repurpose-Per-Build Pipeline, Growth Idea 2: Salatiga Case Study Generator, Referral Commissions System, Decision: Build /repurpose-project + /audit-short Skills, Decision: Launch Rielcode YouTube Shorts Channel (+21 more)

### Community 6 - "Browser Automation Tools"
Cohesion: 0.09
Nodes (25): URL Screenshot Capture, Flow: no-console-errors, Flow: home-renders, Cross-Browser Smoke Matrix Template, Fill Custom Plan Pro Script, Rielcode Custom Plan Page (localhost), Graphify Detect Config, Jarvis Root Package (+17 more)

### Community 7 - "Referral Codes & Templates"
Cohesion: 0.08
Nodes (25): CYN10 Instagram Caption, CYN10 Info Card, CYN10 WhatsApp Message, FRED14 Instagram Caption, FRED14 Info Card, FRED14 WhatsApp Message, MISAEL67 Instagram Caption, MISAEL67 Info Card (+17 more)

### Community 8 - "Obsidian Graph Settings"
Cohesion: 0.1
Nodes (20): centerStrength, close, collapse-color-groups, collapse-display, collapse-filter, collapse-forces, colorGroups, hideUnresolved (+12 more)

### Community 9 - "JARVIS Package Config"
Cohesion: 0.1
Nodes (20): author, bugs, url, description, devDependencies, @playwright/test, directories, doc (+12 more)

### Community 10 - "Homework Bot Calendar"
Cohesion: 0.22
Nodes (16): get_service_account_info(), build_service(), CalendarResult, create_homework_events(), _deadline_body(), _insert_event(), _study_block_body(), _make_mock_service() (+8 more)

### Community 11 - "Rielcode Site Screenshots"
Cohesion: 0.12
Nodes (18): Rielcode Order Form Add-ons System, Rielcode Audit CTA Clicked Order Form Screenshot, Rielcode Audit Homepage Hero Screenshot, Rielcode Audit Homepage Scrolled Screenshot, Rielcode Audit Mobile Initial View Screenshot, Rielcode Audit Mobile Menu Open Screenshot, Rielcode Audit Mobile Scrolled Screenshot, Rielcode Audit Order Form Blank Screenshot (+10 more)

### Community 12 - "Homework Bot Parser"
Cohesion: 0.2
Nodes (11): _clean_subject(), parse_homework(), Parse a natural-language homework message.     Returns {"subject": str, "due_da, handle_message(), test_parse_all_noise_subject(), test_parse_bad_date_returns_none(), test_parse_day_name(), test_parse_explicit_date() (+3 more)

### Community 13 - "URL Screenshot Capture"
Cohesion: 0.16
Nodes (12): args, captureOne(), { chromium }, fails, fs, oks, OUTPUT_DIR, path (+4 more)

### Community 14 - "Playwright Screenshot Skill"
Cohesion: 0.15
Nodes (11): { chromium, devices }, contextOpts, filepath, fs, normalizeUrl(), opts, OUTPUT_DIR, parseArgs() (+3 more)

### Community 15 - "Cross-Browser Test Runner"
Cohesion: 0.14
Nodes (12): all, anyFail, BROWSERS, cell, flowNames, FLOWS, fs, path (+4 more)

### Community 16 - "Graphify Detection Config"
Cohesion: 0.15
Nodes (12): files, code, document, image, paper, video, graphifyignore_patterns, needs_graph (+4 more)

### Community 17 - "URL Screenshot Package"
Cohesion: 0.15
Nodes (12): author, dependencies, playwright, description, keywords, license, main, name (+4 more)

### Community 18 - "Rielcode UI Audit States"
Cohesion: 0.26
Nodes (12): Custom Plan Builder UI, Form Submission Validation, Parallaxnet Canada Project, Rielcode Site Audit, Rielcode Website, Submit Blocked Screenshot, Custom Plan Initial State Screenshot, Custom Plan Features Toggled Screenshot (+4 more)

### Community 19 - "3Ms AI Framework"
Cohesion: 0.18
Nodes (11): 60/30/10 Golden Rule for Automation, Autonomy Spectrum (L0-L4), Bike Method (Phased Rollout), EAD: Eliminate Automate Delegate, Three Ms of AI Framework, Intern Rule (AI Permissions), Kill Switch Principle, 3Ms Layer 3: Machine (+3 more)

### Community 20 - "YouTube Rielcode Strategy"
Cohesion: 0.22
Nodes (10): Rielcode MCP Brand Kit YAML, YouTube Rielcode Project, Rielcode YouTube Channel Branding, Rielcode YouTube Channel Strategy, YouTube Pillar: Build Showcases (30%), YouTube Pillar: Hot Takes/Controversy (20%), YouTube Pillar: Process/Behind-Scenes (20%), YouTube Pillar: SMB Website Tips (30%) (+2 more)

### Community 21 - "Homework Bot Modules"
Cohesion: 0.22
Nodes (10): Dateparser Library, Google Calendar API, Homework Bot Config, Homework Bot Google Calendar Module, Homework Bot Main (Telegram), Homework Parser, Telegram Bot API, Test Calendar (+2 more)

### Community 22 - "Parallaxnet Client Project"
Cohesion: 0.25
Nodes (8): Learning Log: Parallaxnet Delivered vs Complete Mistake, Parallaxnet.id Website, Parallaxnet Canada Project, Screenshot: Parallaxnet.id Galeri Page (2026-05-15 take 1), Screenshot: Parallaxnet.id Galeri Page (2026-05-15 take 2), Screenshot: Parallaxnet.id Galeri Page (2026-05-15 take 3), Screenshot: Parallaxnet.id Homepage (2026-05-15 take 1), Screenshot: Parallaxnet.id Homepage (2026-05-15 take 2)

### Community 23 - "Rielcode Mobile UI"
Cohesion: 0.43
Nodes (7): Rielcode AI Chatbot Widget Feature, Rielcode Free Hosting and .COM Banner Feature, Rielcode Mobile Fixed Layout Screenshot, Rielcode Mobile Top Layout Screenshot, Rielcode Mobile Layout v2 Screenshot, Rielcode Mobile Layout v3 Screenshot, Rielcode Mobile Layout v4 Screenshot

### Community 24 - "Rielcode Subdomain Plans"
Cohesion: 0.38
Nodes (7): pay.rielcode.com Invoice Control Panel, Testimonials Section (rielcode.com), MEMORY.md Index, Memory: Testimonial Collection Page Project, pay.rielcode.com Implementation Plan, Rielcode Main Site Upgrade Implementation Plan, Rielcode Upgrade Design Spec

### Community 25 - "Obsidian App Settings"
Cohesion: 0.33
Nodes (5): alwaysUpdateLinks, attachmentFolderPath, defaultViewMode, newFileLocation, showUnsupportedFiles

### Community 26 - "Rielcode Checkout Flow"
Cohesion: 0.33
Nodes (6): Custom Plan (from IDR 500k), Rielcode Checkout Confirmation (Step 2), Rielcode Order Form (Checkout Step 1), Screenshot: Rielcode Checkout Confirmation (Real Data), Screenshot: Rielcode Checkout Confirmation (Fixed Layout), Screenshot: Rielcode Order Form Full (1280px)

### Community 27 - "Claude Settings & Hooks"
Cohesion: 0.4
Nodes (4): hooks, PostToolUse, permissions, allow

### Community 28 - "Playwright Scrape Runner"
Cohesion: 0.5
Nodes (3): child, path, { spawn }

### Community 29 - "Animation Libraries"
Cohesion: 0.5
Nodes (4): FFmpeg Video Processing Tool, GSAP Animation Library, Lenis Smooth Scroll Library, Video to Website Skill

### Community 30 - "Custom Plan Fill Script"
Cohesion: 0.5
Nodes (3): cb, { chromium }, r

### Community 31 - "Azriel Identity"
Cohesion: 0.67
Nodes (3): About Business Context, Azriel (User), Rielcode Business

### Community 32 - "Testimonials Thank-You"
Cohesion: 0.67
Nodes (3): Rielcode Testimonials Thank You Flow, Rielcode Testimonials Thank You Page Screenshot v1, Rielcode Testimonials Thank You Page Screenshot v2

## Knowledge Gaps
- **329 isolated node(s):** `code`, `document`, `paper`, `image`, `video` (+324 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Rielcode Pricing Reference` connect `JARVIS Core Config` to `Rielcode Checkout Flow`, `Business Context Hub`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `Site Review Skill` connect `Business Context Hub` to `JARVIS Core Config`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `create_homework_events()` (e.g. with `handle_message()` and `test_creates_three_events()`) actually correct?**
  _`create_homework_events()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Are the 8 inferred relationships involving `parse_homework()` (e.g. with `handle_message()` and `test_parse_day_name()`) actually correct?**
  _`parse_homework()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `code`, `document`, `paper` to the rest of the system?**
  _331 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `JARVIS Core Config` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Rielcode Playwright Audit` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._