# SOP: Client Hosting Provisioning

Single source of truth for setting up a client's domain, hosting, and account so the client owns everything and Rielcode holds no recovery keys after handoff.

## The core problem this solves

- Google limits new Gmail creation (Azriel's numbers are maxed on phone verification). Cannot make fresh Gmails for clients.
- Every new Rumahweb account needs an email to register with.
- A client's own-domain email (`admin@theirdomain.com`) does not exist yet at registration time, because the domain + hosting are what create it.

**Fix:** use a temporary cPanel mailbox on rielcode.com as the registration vehicle, then transfer the Rumahweb account email to the client's own-domain email at handoff. After that, the temp mailbox is disposable and nothing depends on Rielcode's hosting.

## Prerequisites

- cPanel access on rielcode.com (unlimited mailboxes, no phone verification).
- Client has confirmed which email option they want (see WA script: `templates/wa-hosting-email-options.md`).
- Payment / DP settled per standard terms (DP 20% upfront).

## Standard flow (Rielcode registers domain + hosting, new account per client)

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

## Why this is safe

- After step 5, the Rumahweb account recovery email is on the client's own domain.
- Rielcode's hosting dying does not lock the client out.
- The client never had to hand over a password or copy an OTP.
- No new Gmail was needed, so the Google limit is never touched.

## Fallback: client wants day-1 independence, no temp mailbox

Use only if the client refuses any Rielcode-domain mailbox in the chain.

1. Register the Rumahweb account directly with the client's existing personal email.
2. Rumahweb sends a verification OTP / link to that inbox.
3. Client reads the code from their own inbox and passes just the code back (they never share a password).
4. Continue from step 3 of the standard flow.

Downside: client must copy-paste the OTP once during setup. That effort is the reason the standard flow (temp mailbox) is the default.

## One thing to verify on next live run

Docs confirm the primary account email is editable via My Profile > Edit account details, but the exact confirmation-click behavior is behind the login and could not be verified from public docs. Confirm on the next real client (or a throwaway account) that step 5's confirmation link goes to the NEW address and clicking it completes the change.

## References

- Rumahweb Unlimited plan = unlimited free mailboxes. See memory `reference_rumahweb_hosting`.
- Client email options WA script: `templates/wa-hosting-email-options.md`.
