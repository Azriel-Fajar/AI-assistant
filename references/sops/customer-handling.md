# SOP: Customer Handling

Single source of truth for handling any customer, from the first message to after the site is delivered. Covers both halves: the lead who is still asking questions and does not trust us yet, and the customer who has paid and needs hosting sorted.

Read this before answering a lead question or taking a next step. Claude reads it too and answers from it instead of improvising.

**DP is the hinge.** Part 1 is everything before the money lands. Part 2 is everything after.

---

## Part 0: Non-negotiables

These never bend. If a situation seems to require bending one, stop and ask Azriel.

| Rule | Detail |
|---|---|
| DP 30% upfront | 30% of the package price to start. Pro 2jt means 600rb DP. |
| 70% on live + happy | Due when the site is live AND the customer confirms they are happy. Not before. |
| Handoff after payment | Hosting account handover happens at or after the 70% payment. The handoff is the lever, not the live site. |
| DP non-refundable | Stated only when asked directly. See 1.2. |
| No purchase before DP | Never buy hosting or domain until DP is received. Costs 250-400rb and Rielcode eats it if they bail. Happened with Cust 2. |
| No materials request before DP | Never ask for product photos, price lists, logo files, or written content until DP is received. Ask for the decision, not the materials. See 1.4. |
| Never 50/50 | Not a payment option. |
| Never promise results | No "pasti dapat pelanggan/siswa". Website is a visibility tool. Say so honestly. |
| Read pricing before quoting | Open `references/rielcode-pricing.md` every time. Never list features from memory. |
| Timeline is an estimate | Never give an exact delivery date. Terms clause 5. |
| Domain + hosting = year one only | Included on Starter, Pro, Premium. Renewal from year two is the client's responsibility unless a maintenance add-on is agreed. Terms clause 7. |
| Logo + content not included | Website design and development only. Logo design and written copy are paid add-ons. Terms clause 6. |
| Portfolio rights retained | Rielcode may display delivered work in its portfolio. Terms clause 8. |

**These match the Terms & Conditions the client agreed to on rielcode.com.** Source: `lang/en/legal.php` and `lang/id/legal.php` in the Laravel app, both updated 2026-08-04. If a client disputes something, the terms page is the authority. Never state anything here that contradicts it.

**Clients already in progress on old 20/80 terms keep 20/80.** New quotes only get 30/70.

**Current promo:** MERDEKA10, 10% off, through 31 Aug 2026. LAUNCH10 is expired, do not offer it.

---

## Part 1: Pre-DP

From first contact to money received.

### 1.1 Stage gates

| # | Stage | Done when | If stuck 3+ days |
|---|---|---|---|
| 1 | Contact | They messaged. Auto-greeting sent. | Nothing. Wait. |
| 2 | Need known | They said their industry or what they want. | One nudge asking about their business. |
| 3 | Quoted | Price band + demo link sent in the SAME message. | Follow-up nudge, see wa-close-scripts #4. |
| 4 | Objection handled | Their question answered, next step offered. | Follow-up nudge. |
| 5 | Agreed | They said yes to a package. Send DP details. Do NOT ask for materials yet. | Send DP details again, once. |
| 6 | DP received | Money in. Move to Part 2. Materials request happens there, not here. | Ask once if there is a blocker. |

**The one rule that matters most:** once you know their industry, quote in the next message. Do not run a discovery loop. 0/39 close rate came from qualifying endlessly and quoting late or never.

**Never end on "mau dijelasin?"** Every quote message ends with a concrete next step: start date, short call, or the promo.

### 1.2 Answer bank

Keyed by what they actually type. Find the closest match. Exact wording lives in `references/wa-close-scripts.md`; this bank gives the reasoning and the guardrails.

---

#### "kok mahal ya kak?" / "bisa kurang?" / "ada yang 300rb"

**What they mean:** comparing against a template seller or a fiverr-tier gig.

**Answer with:** what the tier actually buys. Domain and hosting free for year one (worth 250-400rb alone), custom design not a template, admin panel so they can edit themselves. The price is a bundle, not a page.

**Never say:** the competitor is bad. Never drop the price on the spot unprompted.

**Lever:** MERDEKA10 belongs WITH the quote, not after they go quiet. It is a close lever, not a consolation prize.

---

#### "budget belum cukup" / "lumayan juga ya"

**What they mean:** interested, cannot afford this tier right now.

**Answer with:** scope fit. Offer the smaller tier and say fitur lain bisa ditambah bertahap.

**Never say:** anything about their money. Do not comment on their budget, do not sympathise about finances.

**Script:** wa-close-scripts #5.

---

#### "kalau saya nggak suka hasilnya gimana?"

**What they mean:** afraid of paying and getting something ugly.

**Answer with:** the revisions they get. Their tier includes major design revisions (Starter 1, Pro 2, Premium 5) plus minor tweaks until they are happy. Not liking it is not the real risk here.

**Only if they ask about refunds directly:** DP tidak bisa dikembalikan karena DP dipakai buat beli domain dan hosting atas nama kakak. Honest, has a reason, and it is true.

**Never say:** non-refundable as the opener. It reads as a wall and ends the conversation.

---

#### "ada garansi?" / "pasti jadi kan kak?"

**What they mean:** worried we take the money and disappear.

**Answer with:** the payment structure itself is the guarantee. They pay 30% to start and the remaining 70% only after the site is live and they are happy. We carry the risk on 70% of the project.

**Never say:** a results guarantee of any kind.

---

#### "pasti dapat pelanggan / siswa / order?"

**What they mean:** they want a business outcome promised.

**Answer with:** honest reframe. A website makes them findable and makes them look credible when someone checks. Whether that converts depends on their offer, pricing, and marketing. Say it plainly.

**This is a written term, not just a preference.** Terms clause 10: no guarantee of traffic, enquiries, customers, or sales. Search ranking is also not guaranteed, it depends on factors outside our control. If a lead pushes for an SEO ranking promise, the answer is no, and the terms say so.

**Never say:** yes. Never imply it. Do not staple a demo CTA onto the end of an honest answer, it undercuts the honesty.

---

#### "portofolio mana?" / "pernah bikin apa aja?"

**What they mean:** verifying we are real.

**Answer with:** `rielcode.com/en/work` and the relevant demo at `rielcode.com/demos/{niche}/`. Pick the demo closest to their industry.

**Note:** always say the demo design is a rough draft and fully customizable. Otherwise they judge the exact colors.

---

#### "kalian di mana?" / "ini perusahaan atau perorangan?"

**What they mean:** checking we are not a scam.

**Answer with:** straight answer. Rielcode, web development, works with clients across Indonesia and internationally. Work is remote, so location is not a limit. If they push for a city, Salatiga, Jawa Tengah.

**Proof to attach when they are verifying:** `rielcode.com/en/work`, and mention we have delivered for clients abroad. International clients can pay in USD.

**Never say:** a fake team, a fake office, or "kantor kami". Do not inflate.

---

#### "dapat apa aja?" / "termasuk apa?"

**What they mean:** wants the feature list.

**Answer with:** the tier features, read fresh from `references/rielcode-pricing.md`. For Pro and Starter you MUST name CMS / Admin Panel. It is included and forgetting it undersells the tier.

---

#### "CMS itu apa kak?" / "admin panel buat apa?"

**What they mean:** does not know the term, will not admit it.

**Answer with:** plain language. Halaman khusus buat kakak sendiri, bisa ganti foto, harga, atau tulisan tanpa perlu hubungi kami tiap kali.

---

#### "bisa tambah fitur X?"

**What they mean:** scoping.

**Answer with:** yes if it is on the add-on list in the pricing file, with the add-on price. If it is not on the list, say it needs a quote per scope, do not invent a number.

---

#### "termasuk logo?" / "termasuk isi konten?"

**What they mean:** assuming everything is bundled.

**Answer with:** honest no. Website design and development are included. Logo design and written content are not, unless quoted as a paid add-on. Terms clause 6.

They supply business info, text, photos, and brand assets, and are responsible for the accuracy and licensing of what they send. Late materials push the estimate out, say that now, see 2.4.

**State this as scope, not as a request.** Pre-DP this is information about what is included, so they can budget. Do not turn it into "kirim fotonya ya kak". The actual materials request happens at Part 2 stage 3, after DP. See 1.4.

---

#### Their content breaks a rule (medical claims, income claims, copied material)

**When this comes up:** the client sends creatives or copy that cannot legally go on the site. Most common with herbal and supplement resellers (BPOM TR products cannot claim to treat, cure, or prevent disease), MLM income claims, and copied photos or text.

**What they mean:** nothing. They are proud of their material and are showing you what to build. They almost never know there is a rule.

**Answer with:** the boundary, stated as how Rielcode builds rather than as a correction. Name the category of claim, never their specific wording. Give the compliant alternative in the same message so it reads as a solution, not a refusal.

Skeleton:

> Satu catatan kecil kak. Untuk [product category], di website kami pakai [safe approach] bukan [claim category]. Website lebih ketat daripada sosmed karena permanen dan terindeks Google.
>
> Hasilnya tetap kuat kok kak, cuma bahasanya lebih aman buat kakak.

**Never say:**
- Their own copy quoted back at them as the example of what is wrong. This is the main failure. It reads as scolding someone who just shared something proudly.
- Enforcement language. No "kena teguran", no sanctions, no penalties. Introduces a fear they did not arrive with.
- Anything implying their existing sosmed posts are wrong. Comment on the website only.

**Placement:** after the quote or alongside it, never before. The first substantial thing they read should not be a restriction.

**Length:** short. One paragraph plus one reassurance line. A long compliance message reads as a bigger problem than it is.

**The boundary does not bend, only the delivery.** If they insist on the prohibited content after a polite explanation, that is a decline. Rielcode's name is on the build and in the portfolio.

**Live example:** Cust 42, HWI reseller, 2026-08-07. First attempt quoted the lead's NesV creatives back and used "kena teguran". Correct substance, too heavy. See `leads/active-customers.md` po Cust 42.

---

#### "berapa lama jadinya?"

**Answer with:** the tier estimate (Part 3), said as an estimate. "Estimasi sekitar 7-10 hari kerja kak" not "jadi tanggal 15".

Add the condition in the same breath: estimasi mulai dihitung setelah materi dari kakak lengkap. Set it at quote time so it is never an excuse later.

**Never say:** a fixed delivery date. Terms clause 5 says estimates, not guaranteed dates. Promising a date contradicts what they agreed to.

---

#### "bisa lihat contoh dulu?" / "buatin demo dong"

**What they mean:** either genuine hesitation or a tire-kicker.

**Answer with:** existing demo at `rielcode.com/demos/{niche}/` first. That is the default response.

**Custom mockup:** only via the gate in 1.3.

---

#### Silence after the quote

**What it means:** most common failure mode. 21/39 leads ghosted right after greeting or quote.

**Do:** one nudge. Soft, gives them an out, keeps the door open. wa-close-scripts #4.

**Do not:** send a second nudge, then a third. One nudge, then let it rest and apply the dead-lead rule (1.5).

---

#### "nanti saya kabari" / "saya diskusi dulu"

**What they mean:** polite exit or genuine internal discussion, cannot tell which.

**Answer with:** acknowledge, then attach a soft time anchor. Offer to check back in a few days. Do not push for a decision on the spot.

---

### 1.3 Free demo gate

The Free Demo ad is paused. A custom mockup is no longer an advertised offer, it is a rare fallback for a hesitant lead who would otherwise walk.

**Default response is always the existing demo library** at `rielcode.com/demos/{niche}/`. Try that first.

**Gate for a custom mockup, all must be true:**

1. The lead has asked at least two substantive questions beyond price. Price-only askers do not qualify.
2. They named their business and industry.
3. They are hesitating on trust, not on budget. A budget objection gets the smaller tier (see 1.2), not free work.

**When sending any demo:**

- State the design is a rough draft and fully customizable. Every time, no exceptions.
- Use the phrasing skeleton: "Ini website demo X yang ada di website kami kak:" then the URL, then the list of pages, then "modelnya cocok sama yang kakak bayangin?"
- Demo URLs are `rielcode.com/demos/{niche}/` with the trailing slash. Without it the CSS 404s.

### 1.4 Materials come after DP, never before

**Do not ask a pre-DP lead for product photos, price lists, logo files, or written content.** Not as a next step, not as a soft close, not "biar kami mulai siapkan".

**Why:**

1. **It asks for work before they have committed.** Gathering photos and writing a price list is an afternoon of effort. A lead who has not paid will not do it, so the request becomes the thing that stalls the conversation. The ask feels like a task assigned by a stranger.
2. **It fakes a commitment that does not exist.** Sending photos is not agreement. It creates a middle state where the lead thinks the project started and Rielcode thinks it is close to closing, and neither is true. Cust 2 sat in that state.
3. **It buries the actual decision.** The only question pre-DP is "do you want to proceed at this price". A materials request replaces that question with a smaller, easier one, and the lead answers the easy one by going quiet on both.
4. **It leaks scope for free.** Full catalog, prices, and assets in hand means the lead can take the spec elsewhere at no cost.
5. **It contradicts rule zero.** Buy nothing before DP already applies to hosting. The same logic applies to our time. Materials handling is work.

**Instead, close on the decision.** The message after a quote ends with the DP, not a shopping list:

> Kalau kakak cocok, kami mulai dengan DP 30% kak, yaitu [amount]. Setelah DP masuk, kami kirim daftar materi yang kami butuhkan dan langsung mulai pengerjaan.

That line does two jobs. It names the one action that moves things forward, and it tells them materials are coming later so the request is not a surprise at stage 3 of Part 2.

**If the lead volunteers materials pre-DP:** accept them, thank them, do not start building. Steer back to the DP. Unsolicited photos are enthusiasm, not payment.

**The only pre-DP question about their content** is the scope question needed to quote correctly, such as roughly how many products. That is a number, not an asset. Asking "berapa produknya" is fine. Asking "kirim foto produknya" is not.

### 1.5 Dead-lead rule

**3 days after the last nudge with no reply, move the lead to `leads/archive.md`.**

Archiving is not deleting. If they come back later, pull them out. The point is to stop the mental cost of an open loop that is not open.

Sequence: quote sent, no reply, wait 1-2 days, send one nudge, no reply, wait 3 days, archive.

---

## Part 2: Post-DP

DP is in. This half is about delivering and getting paid the rest.

### 2.1 Stage gates

| # | Stage | Done when | If stuck 3+ days |
|---|---|---|---|
| 1 | DP received | Money confirmed. Log in `leads/active-customers.md`. | n/a |
| 2 | Hosting option picked | Client chose option 1, 2, or 3. | Send the option script again, once. |
| 3 | Brief + content in | Business info, photos, text, logo received. **This is the first time materials are requested.** Send the full list in one message right after DP. | Nudge for content. Estimate extends by the delay, tell them. |
| 4 | Build + review | Staging shown, revisions applied. | Ask what is blocking approval. |
| 5 | Live | Site on their domain, working. | n/a |
| 6 | Paid + handed off | 70% received, accounts transferred, completion doc sent. | Follow up on the balance. |

### 2.2 Hosting option

Ask early, right after DP. Three options exist because clients differ in how much they want to touch.

Full mechanics: `references/sops/client-hosting-provisioning.md`.
WA script for offering the choice: `templates/wa-hosting-email-options.md`.

Short version:

| Option | Who it fits | Ownership after handoff |
|---|---|---|
| 1. Client's own account | Tech-savvy, or will relay one OTP | Full, immediate |
| 2. Rielcode-managed transfer (default) | Most clients, wants zero effort | Full, at handoff |
| 3. On Rielcode's account | Wants zero effort forever | Rielcode owns, client renews via Rielcode |

**Buy nothing until DP is in.** Rule zero.

**Year one only.** Domain and hosting are included for the first year on Starter, Pro, and Premium. Renewal from year two is the client's responsibility unless they take the maintenance add-on (300rb/month). Terms clause 7. Say this at handoff so the year-two invoice is not a surprise.

### 2.3 Revisions

**Major design revision** = a new layout that totally changes the look. Capped per tier: Student 1 minor, Starter 1, Pro 2, Premium 5.

**Minor tweak** = everything else. Copy edits, colors, image swaps, spacing, moving a section. These continue until the customer is happy, uncapped.

State this distinction when the first revision request arrives, not when they hit the cap. A client who learns the cap exists at revision 3 feels cheated.

If they want a major redesign beyond the cap, it is a quote, not a favor.

### 2.4 Timeline and client delay

**These are estimates, not guaranteed dates.** Terms clause 5. Never give a client an exact delivery date.

Estimates per tier: Student 1-3 days, Starter 3-5, Pro 7-10, Premium 10-14.

**The estimate starts counting when their materials are complete, not when the DP lands.** Say this at quote time (see 1.2) and repeat it when you ask for content.

If materials arrive late, the estimate extends by that delay. Tell the client as soon as a slip is known, in a plain sentence, not as a complaint. Do not go quiet and explain afterwards.

Rush work faster than the estimate is the Priority Delivery add-on, 300rb.

### 2.5 Handoff and support

Handoff happens at or after the 70% payment. Not before.

Checklist:

1. 70% received.
2. Site live on their domain, client confirmed happy.
3. Hosting and domain account transferred per the option they chose. No dangling Rielcode recovery keys for options 1 and 2. For option 3, document the dependency in writing.
4. Admin panel credentials handed over.
5. Completion document sent. Use `/project-completion-doc`.
6. Renewal expectation stated: hosting and domain are covered for year one, renewal from year two is theirs unless they take maintenance.
7. Support window starts: Pro 1 month, Premium 2 months. Student and Starter have none. Support covers bug fixes only, meaning unintended breakage of agreed functionality. New features and design changes are billed separately. Terms clause 9.
8. Move the customer out of active and into the closed section.

**Referral ask goes here**, at handoff, while they are happy. Not weeks later. See `projects/rielcode-referral/`.

---

## Part 3: Tier facts

Quick reference. `references/rielcode-pricing.md` is the authority, read it before quoting.

| | Student | Starter | Pro | Premium |
|---|---|---|---|---|
| Price | 500rb / $29 | 1jt / $58 | 2jt / $116 | 5jt / $290 |
| DP 30% | 150rb | 300rb | 600rb | 1.5jt |
| Balance 70% | 350rb | 700rb | 1.4jt | 3.5jt |
| Delivery | 1-3 days | 3-5 days | 7-10 days | 10-14 days |
| Pages | 1 | 1-2 | up to 5 | up to 10 |
| Domain + hosting 1yr | NO | yes | yes | yes |
| CMS / Admin panel | no | Basic | Basic | Standard |
| SEO | Basic | Basic | Advanced | Advanced |
| Analytics + Console | no | no | yes | yes |
| AI Chatbot | no | no | no | yes |
| Major design revisions | 1 minor | 1 | 2 | 5 |
| Support | none | none | 1 month | 2 months |

**Starter and Pro always include Basic CMS.** Student does not. Never omit CMS from a Starter or Pro quote.

Add-ons: see the pricing file. Common ones are Extra Page 85rb, Advanced SEO 200rb, Analytics 300rb, CMS from 600rb, Chatbot 1jt, Catalog from 1jt, Maintenance 300rb/month.

---

## Part 4: Checkpoint card

The glance test. Where is each customer, and is it moving?

```
PRE-DP
  contact -> need known -> quoted -> objection handled -> agreed -> DP in
  stuck 3+ days at any stage? one nudge. no reply after 3 more days? archive.

POST-DP
  DP in -> hosting option -> content in -> build+review -> live -> paid+handoff
  stuck 3+ days? ask what is blocking. never go silent on a paying client.
```

**Warning signs:**

- Quoted more than 3 days ago, no nudge sent. Send it.
- Talking to a lead for a week with no number given. Quote now.
- Asked a pre-DP lead for photos or a price list. Stop, steer back to the DP. See 1.4.
- Paid client waiting on you with no update in 3 days. Update them even if there is no progress.
- Site live but 70% unpaid and accounts already handed over. Never do this again, the handoff is the lever.

---

## Tone rules for every client-facing message

- Warm "kak", soft 🙏🏻, short one-idea lines.
- Use "kami" not "saya".
- No em dashes. No hype openers ("wah cocok banget kak"). No fake urgency. No lo/gue.
- Banned phrases: "colek saya", "santai aja" (use "tidak masalah"), "mantap kak".
- Ask the need first. No price or demo dump in the first message.
- WA drafts are plain copy-paste blocks. No markdown, it breaks on paste.

Full voice reference: `references/voice.md`. Exact scripts: `references/wa-close-scripts.md`.
