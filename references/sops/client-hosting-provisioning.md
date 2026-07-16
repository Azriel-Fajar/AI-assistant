# SOP: Client Hosting Provisioning

Single source of truth for setting up a client's domain, hosting, and account. Three options depending on client capability and preference. Goal in every case: no dangling recovery keys on Rielcode after handoff (Options 1-2) or a clearly documented dependency (Option 3).

## Rule zero: payment first

**Never buy hosting or domain before the DP is received.** DP is 30% upfront (see `memory/feedback_dp_terms_30_70.md`). Hosting + domain costs 250-400rb; buying before DP means Rielcode eats the loss if the client bails (happened with Cust 2).

## The core problem this solves

- Google limits new Gmail creation (Azriel's numbers are maxed on phone verification). Cannot make fresh Gmails for clients.
- Every new Rumahweb account needs an email to register with.
- A client's own-domain email (`admin@theirdomain.com`) does not exist yet at registration time, because the domain + hosting are what create it.
- Clients who pick "hosting on my account" usually cannot operate hosting themselves.

## Decision table

| Question | Option 1: Client's own account | Option 2: Rielcode-managed transfer (default) | Option 3: On Rielcode's account |
|---|---|---|---|
| Client tech-savvy? | Yes, or willing to relay OTP | No | No |
| Wants day-1 ownership? | Yes | Yes (ownership at handoff) | No |
| Wants zero effort? | No | Yes | Yes |
| Client effort | Operates hosting, or relays 1 OTP / shares password briefly | None | None |
| Ownership after handoff | Full, immediate | Full, at handoff | Rielcode owns; client pays yearly via Rielcode |
| Rielcode dependency after | None | None | Yes (documented; can migrate to Option 2 later) |

WA script for offering the options: `templates/wa-hosting-email-options.md`.

## Prerequisites (all options)

- DP 30% received. No purchases before this.
- Client has confirmed which option they want (WA script above).
- Options 2-3: cPanel access on rielcode.com (unlimited mailboxes, no phone verification).

## Option 1: Client's own account

Use when the client insists everything stays under their control from day 1.

**Path A — client operates hosting themselves.** Client knows hosting. Rielcode delivers site files + deployment guidance only. Client buys their own hosting/domain, uploads or grants temporary cPanel/FTP access for deploy. No account setup by Rielcode.

**Path B — client owns account, Rielcode does the buying.** Client cannot operate hosting but wants their own email on the account:

1. Register the Rumahweb account with the client's existing personal email. Either:
   - Client relays the verification OTP/link code back over WA (never shares a password), or
   - Client temporarily shares the account password so Rielcode logs in with an OTP they forward; client changes password after handoff.
2. Buy domain + hosting under that account (after DP, per rule zero).
3. Continue from step 4 of the Option 2 flow (create own-domain mailbox, upload, hand over).

Downside: needs client cooperation mid-setup. That friction is why Option 2 is the default.

## Option 2: Rielcode-managed setup with ownership transfer (default)

Temp mailbox on rielcode.com registers the account; ownership transfers to the client's own-domain email at handoff. Client does nothing and ends up owning everything.

1. **Temp mailbox.** cPanel on rielcode.com > Email Accounts > create `client@rielcode.com` (use client business name, e.g. `anugrah@rielcode.com`) + password. No Google limit.

2. **Register Rumahweb account.** Log into that webmail. Register a NEW Rumahweb Clientzone account using `client@rielcode.com`. One account per client.

3. **Buy domain + hosting.** Under the new account, register the client domain (`theirdomain.com`) and buy the hosting plan.

4. **Create own-domain mailbox.** Once hosting is active, cPanel > Email Accounts > create `admin@theirdomain.com` + password. This is the client's real, permanent email.

5. **Transfer account email (CRITICAL).** Rumahweb Clientzone > `Hi, [name]` > My Profile > Edit account details > change account email to `admin@theirdomain.com` > save.
   - Rumahweb sends a confirmation link to `admin@theirdomain.com`.
   - Open that mailbox's webmail (you have the password from step 4), click the confirm link.
   - No client involvement needed here.

6. **Verify independence.** Confirm the Clientzone account email now reads `admin@theirdomain.com`. Recovery now lives on the client's own domain, not on rielcode.com.

7. **Upload website.** Deploy the client site to the hosting.

8. **Hand over.** Give the client:
   - Rumahweb Clientzone login (email `admin@theirdomain.com` + password)
   - `admin@theirdomain.com` mailbox login + password
   - Hosting / cPanel details
   - Completion doc (`/project-completion-doc`)

9. **Cleanup.** The temp `client@rielcode.com` mailbox is now disposable. Nothing points at it. Delete it or leave it; if Rielcode hosting ever dies, the client is unaffected.

**Why this is safe:** after step 5, recovery lives on the client's own domain; Rielcode hosting dying doesn't lock them out; client never shares a password or OTP; no new Gmail needed.

**Verify on next live run:** docs confirm the primary account email is editable via My Profile > Edit account details, but the exact confirmation-click behavior is behind the login. Confirm on the next real client (or throwaway account) that step 5's confirmation link goes to the NEW address and clicking completes the change.

## Option 3: Hosting on Rielcode's account

Use when the client wants zero involvement and accepts the site living under Rielcode's Rumahweb account.

1. Buy domain + hosting under Rielcode's own Rumahweb account (after DP, per rule zero).
2. Deploy site. Client gets the site + any admin panel logins, not the hosting login.
3. Client pays yearly hosting + domain renewal via Rielcode (invoice before renewal date; set a reminder).
4. Document the dependency in the completion doc: Rielcode holds hosting; migration to their own account available anytime via Option 2 flow (register new account with temp mailbox, transfer domain + files, flip ownership).

Benefit: recurring yearly touchpoint + simplest for the client. Risk: Rielcode is a single point of failure; always state the migration path in the handoff doc.

## References

- Rumahweb Unlimited plan = unlimited free mailboxes. See memory `reference_rumahweb_hosting`.
- Client email options WA script: `templates/wa-hosting-email-options.md`.
- Payment terms: `memory/feedback_dp_terms_30_70.md` (DP 30% / 70% on finish).
