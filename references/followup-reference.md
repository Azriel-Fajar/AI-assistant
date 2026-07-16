# Follow-up Reference

Single source for drafting any WhatsApp follow-up. Read this, then write. No other files needed unless quoting a price.

---

## 1. Where the person lives (go direct, don't grep)

| User says | File |
|-----------|------|
| "lead" | `leads/leads.md` (cold to closed pipeline) |
| "customer" / "client" | `leads/active-customers.md` (`## Cust N` = full scope/quote/brief) |
| dead / closed | `leads/archive.md` |
| client DM history | `meta/clients/` (refresh: `node meta/dms-sync.mjs`) |

Use only details from these files or the user. Never invent project facts.

---

## 2. Hard bans (every message)

- Emojis only when necessary (1 max, functional not decorative); default to none
- No em dashes (use commas or periods)
- No pleasing openers: "wah cocok banget kak", hype, "Terima kasih sudah menghubungi kami"
- No "colek saya" / "santai aja" / "mampir nyapa"
- Never sound desperate or over-apologetic
- No unprompted service list or company pitch at early stage

Use instead: "silakan hubungi saya", "tidak perlu terburu buru".

---

## 3. Tone

Casual-professional. Real person texting, not a business reply.

**Bahasa Indonesia leads:**
- Lowercase throughout, even sentence starts
- "kak" = greeting ("halo kak"); "kakak" = referring to them in-sentence
- One short genuine reaction + one open question = ideal early opener
- Ask what they need before pitching

Approved opener:
> wah keren kak, kira kira website seperti apa yang bisa kamu bantu untuk bisnis kakak?

Feature list (when asked): "kami sarankan" not "kami buatkan", numbered list OK, end with a question.

---

## 4. Structure

3-5 sentences max. Greeting with name (or "Hi" if unknown). End with one clear, low-pressure action.

| Type | Situation | Beats |
|------|-----------|-------|
| 1. No response | quiet after quote/proposal | ack prev msg, restate 1 value, easy out ("happy to adjust"), simple question |
| 2. Project update | mid-project | what's done, what's next, ask for input |
| 3. After delivery | post-launch | confirm live, ask if all good, mention 2-week revision window, (warm only) ask testimonial/referral |
| 4. Upsell | existing client | praise current work, tie new service to their situation, suggest not pitch, question |
| 5. Cold re-engage | interested, never converted | reference prev lightly, share something new/relevant, low-friction question |

**Read-but-no-reply:** short low-pressure nudge ending in one easy reply. Not a re-pitch.

---

## 5. Pricing (only if quoting)

- Single source: `references/rielcode-pricing.md`. Re-read before any quote, never from memory.
- Pro plan always includes Basic CMS/Admin Panel.
- Every quote includes LAUNCH10 (10% off, show orig + discounted) until 30 June 2026.
- DP 30% upfront / 70% on finish for new quotes (since 2026-07-16). Clients already quoted 20/80 keep 20/80. Never 50/50.
- No installment/credit to low-budget first-timers. Scope down instead.

---

## 6. After drafting

ntfy: `curl -s -o /dev/null -H "Title: Follow-up Ready" -d "Follow-up for <name> drafted." ntfy.sh/JARVIS`

Offer: shorter / different tone / Bahasa Indonesia version.
