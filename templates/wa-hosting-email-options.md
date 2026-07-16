# WA Script: Client Hosting Email Options

Copy-paste block. Casual "kak", uses "kami", no em dash, no markdown. Send when a client needs to pick how their hosting account is set up. Maps to SOP options in `references/sops/client-hosting-provisioning.md`.

## Default message (recommend Option A)

```
Halo kak, untuk hosting dan domain website nanti ada 3 pilihan cara setupnya kak:

Pilihan A (kami sarankan)
Kami yang urus semua setupnya dari awal. Nanti kami buatkan email resmi pakai domain kakak sendiri, misal admin@namausaha.com, dan semua akun hosting jadi milik kakak sepenuhnya saat selesai. Kakak tidak perlu ngapa-ngapain.

Pilihan B
Akun hosting pakai email pribadi kakak yang sudah ada (Gmail dll). Untuk ini kakak cukup bantu kirim satu kode verifikasi sekali saat proses setup. Kakak tidak perlu kasih password apapun. Cocok kalau kakak sudah terbiasa urus akun online.

Pilihan C
Hosting ikut di akun kami. Kakak tidak pegang akun hosting sama sekali, cukup bayar perpanjangan per tahun lewat kami. Paling simpel, dan kalau nanti mau pindah ke akun sendiri tetap bisa kapan saja.

Kebanyakan klien pilih A karena tidak perlu repot dan semuanya jadi atas nama usaha kakak sendiri. Kakak mau yang mana?
```

## Notes for Azriel

- Option A = SOP Option 2 (default flow). Temp mailbox, Rielcode buys, ownership transfers to `admin@theirdomain.com` at handoff.
- Option B = SOP Option 1 Path B. Client relays one OTP, never a password. If client is fully tech-savvy and wants to self-host, that is Option 1 Path A (rare, handle case by case, no script needed).
- Option C = SOP Option 3. Rielcode's account, yearly renewal invoiced via Rielcode. State the migration path in the completion doc.
- Do not promise `@theirdomain.com` exists before their domain is registered. It is created during setup, do not imply it is instant.
- Rule zero applies to all: never buy hosting/domain before DP 30% received.
- Full setup steps: `references/sops/client-hosting-provisioning.md`.
