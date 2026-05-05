---
name: project-completion-doc
description: Use when Azriel needs a project completion or handoff document for a finished client website. Auto-scans the project directory, asks for missing details (admin password, hosting, support terms), and generates a branded Rielcode PDF saved to projects/[client]/completion-doc.pdf. Triggers include "make completion doc", "handoff document", "project completion PDF".
argument-hint: "[project-path]"
---

## What This Skill Does

Generates a polished, branded **Project Completion Document** (PDF) for a finished client website. The PDF gives the client everything they need post-launch in one professional artifact: pages, admin access, feature usage, hosting, support terms, and next steps.

Output: `projects/[client]/completion-doc.pdf`

PDF engine: existing `dompdf` install at `C:/xampp/htdocs/Rielcode/vendor/`. No new dependencies.

---

## Steps

### 1. Resolve project path

If `$ARGUMENTS` provides a path, use it. Otherwise ask: "Which project? (full path or name — I will look in `C:\xampp\htdocs\` and `projects/`)".

Confirm the path exists before proceeding.

### 2. Auto-scan the project

Run these in parallel where possible:

- **Pages** — Glob `*.html`, `*.php` (max depth 2, skip `vendor/`, `node_modules/`, `admin/`, `dashboard/`, `cms/`). Build the page list as `[filename, relative URL, inferred purpose from `<title>` tag or filename]`.
- **Admin panel** — Check for `admin/`, `dashboard/`, `cms/`, `panel/`, `wp-admin/` folders. If present, admin URL = `[live-url]/[folder]/`.
- **Admin user** — Read `config.php`, `.env`, `database.sql`, `install.sql` if present. Extract username only. **NEVER** echo passwords found in source files; flag presence and ask the user to confirm or supply the live password.
- **Brand color** — Read the project's primary stylesheet (`css/style.css`, `assets/css/main.css`, `<style>` blocks in `index.html`). Pull the most-used non-neutral hex color. Fall back to Rielcode default `#0d0d0d` if none clear.
- **Language detection** — Sample README.md + visible HTML body text. If clearly Indonesian (kata kunci: `tentang`, `hubungi`, `layanan`, `beranda`), set `LANG=id`. Else `LANG=en`. If mixed, ask.
- **Client info** — If `projects/[client-name]/README.md` exists in JARVIS, read it for client name, completion date, project summary.

Print a one-line scan summary so Azriel sees what was found before any questions.

### 3. Ask only for gaps

Use `AskUserQuestion`. Skip any item already filled by the scan. Possible questions (consolidate into ≤4 questions, multiSelect where it fits):

- Admin password (if admin panel detected)
- Hosting provider (e.g. Niagahoster, Hostinger, Vercel, Netlify)
- FTP host + username (password handled via WhatsApp, not in PDF)
- Domain registrar + renewal date
- Support window included free (e.g. "30 days post-launch")
- Support SLA (e.g. "WhatsApp reply within 24h on weekdays")
- Next steps / training items the client must do
- Live URL (if not in README)
- Project summary (1 sentence, only if README missing)

For sensitive data (admin password): tell Azriel to paste it; remind him it lives in the PDF only and is never re-echoed in chat.

### 4. Resolve sections to omit

If admin panel was not detected AND user did not supply admin URL: replace `{{ADMIN_SECTION}}` with empty string (skip that page).

If FTP host is "n/a" or empty: still render hosting block, mark FTP fields as "Not provided".

### 5. Build HTML

Read `template.html`. Substitute all `{{TOKEN}}` values. Token reference:

**Layout / brand:**
- `{{LANG}}` — `en` or `id`
- `{{ACCENT}}` — hex color from scan (or `#0d0d0d`)

**Cover (LANG-aware labels):**
| Token | English | Indonesian |
|---|---|---|
| `{{COVER_EYEBROW}}` | Project Completion Document | Dokumen Penyelesaian Proyek |
| `{{COVER_PREPARED_FOR}}` | Prepared for | Disiapkan untuk |
| `{{COVER_COMPLETED_ON}}` | Completed on | Selesai pada |
| `{{COVER_PREPARED_BY}}` | Prepared by | Disiapkan oleh |

**Section headings (LANG-aware):**
| Token | English | Indonesian |
|---|---|---|
| `{{H_OVERVIEW}}` | Project Overview | Ringkasan Proyek |
| `{{H_PAGES}}` | Pages | Halaman |
| `{{H_FEATURES}}` | Features and How to Use | Fitur dan Cara Pakai |
| `{{H_HOSTING}}` | Hosting and Domain | Hosting dan Domain |
| `{{H_MAINTENANCE}}` | Maintenance and Support | Pemeliharaan dan Dukungan |
| `{{H_NEXT_STEPS}}` | Next Steps | Langkah Berikutnya |

**Field labels (LANG-aware):**
| Token | English | Indonesian |
|---|---|---|
| `{{L_LIVE_URL}}` | Live URL | URL Live |
| `{{L_DELIVERED}}` | Delivered | Diserahkan |
| `{{L_HOST}}` | Hosting Provider | Penyedia Hosting |
| `{{L_REGISTRAR}}` | Domain Registrar | Pendaftar Domain |
| `{{L_FTP_HOST}}` | FTP Host | FTP Host |
| `{{L_FTP_USER}}` | FTP Username | Username FTP |
| `{{L_FTP_PASS}}` | FTP Password | Password FTP |
| `{{L_RENEWAL}}` | Domain Renewal | Perpanjangan Domain |
| `{{L_INCLUDED}}` | Included | Termasuk |
| `{{L_CONTACT}}` | Contact | Kontak |
| `{{L_RESPONSE}}` | Response Time | Waktu Respons |
| `{{TH_PAGE}}` | Page | Halaman |
| `{{TH_URL}}` | URL | URL |
| `{{TH_PURPOSE}}` | Purpose | Fungsi |

**Admin section** — render this block into `{{ADMIN_SECTION}}` if admin panel exists (LANG-aware `{{H_ADMIN}}` = "Admin Panel Access" / "Akses Panel Admin"; usage steps written fresh per project):

```html
<div class="section">
  <h2>{{H_ADMIN}}</h2>
  <table class="creds-grid">
    <tr><td><div class="label">URL</div><div class="value"><a href="{{ADMIN_URL}}">{{ADMIN_URL}}</a></div></td>
        <td><div class="label">Username</div><div class="value">{{ADMIN_USER}}</div></td></tr>
    <tr><td colspan="2"><div class="label">Password</div><div class="value">{{ADMIN_PASS}}</div></td></tr>
  </table>
  <h3>{{ADMIN_HOWTO_TITLE}}</h3>
  <ol>{{ADMIN_HOWTO_STEPS}}</ol>
</div>
```

**Pages rows** — `{{PAGES_ROWS}}` is `<tr>` blocks built from scan output.

**Features blocks** — `{{FEATURES_BLOCKS}}` is one `<div class="feature">` per feature with `<h3>` + description + `<div class="how">` how-to. Generate from scanned features (cart, contact form, blog, gallery, login etc.) — write 1–2 plain-language sentences per feature explaining what the client clicks to use it.

**Hosting note** — short reassurance line. EN: "FTP password and any account secrets were sent separately via WhatsApp for security." ID: "Password FTP dan kredensial akun lain dikirim terpisah lewat WhatsApp untuk keamanan."

**Maintenance note** — EN: "After the included support window, additional changes are quoted per request." ID: "Setelah masa dukungan berakhir, perubahan tambahan akan ditagih per permintaan."

**Closing note** — EN: "Thank you for trusting Rielcode. Reach out anytime via WhatsApp." ID: "Terima kasih telah mempercayakan proyek ini kepada Rielcode. Hubungi kapan saja lewat WhatsApp."

Save the substituted HTML to: `.claude/skills/project-completion-doc/.tmp/[client-slug].html`

### 6. Generate the PDF

```bash
php "c:/Users/afw14/OneDrive/Documents/JARVIS/.claude/skills/project-completion-doc/generate.php" \
    "c:/Users/afw14/OneDrive/Documents/JARVIS/.claude/skills/project-completion-doc/.tmp/[client-slug].html" \
    "c:/Users/afw14/OneDrive/Documents/JARVIS/projects/[client-name]/completion-doc.pdf"
```

If `projects/[client-name]/` does not exist, create it first.

### 7. Notify

```bash
curl -s -o /dev/null -H "Title: Completion Doc Ready" -d "Completion PDF for [client] saved to projects/[client]/completion-doc.pdf" ntfy.sh/JARVIS
```

### 8. Report

Show:
- PDF path (clickable)
- Sections included / omitted
- Detected language
- Open command suggestion: `start "" "projects/[client]/completion-doc.pdf"`

Then ask: "Want me to draft the WhatsApp handoff message (`/follow-up`) or close this lead in the tracker (`/lead-tracker`)?"

---

## Rules

- No emojis in the PDF or chat output (per `.claude/rules/communication-style.md`).
- No em dashes in body text. Use plain commas / periods / parentheses.
- **Never echo admin or FTP passwords back to chat** after the PDF is generated. Confirm only "password embedded in PDF".
- Never invent features, pages, or credentials. If something is unknown, ask or omit.
- Page list is built from real files in the project. No fictional pages.
- Brand accent color must come from the project itself; fall back to Rielcode `#0d0d0d` if undetectable.
- The temp HTML in `.tmp/` may contain credentials, so add `.tmp/` to `.gitignore` if not already excluded.
- Language must match what the client reads; do not mix English and Indonesian in the same PDF.
- If the live URL is unknown, use `http://localhost/[folder]/` as a placeholder and flag it in the report.
