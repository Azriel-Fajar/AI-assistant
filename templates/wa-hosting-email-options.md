# WA Script: Client Hosting Email Options

Copy-paste block. Casual "kak", uses "kami", no em dash, no markdown. Send when a client needs to pick how their hosting account email is set up.

## Default message (recommend Option A)

```
Halo kak, untuk akun hosting dan domain nanti kami perlu satu email utama buat login dan pemulihan akun. Ada 2 pilihan kak:

Pilihan A (kami sarankan)
Kami buatkan email resmi pakai domain kakak sendiri, misal admin@namausaha.com. Ini email milik kakak sepenuhnya. Kami yang urus semua setupnya, kakak tidak perlu repot.

Pilihan B
Pakai email pribadi kakak yang sudah ada (Gmail dll). Untuk ini kakak cukup bantu kirim satu kode verifikasi sekali saat proses setup. Kakak tidak perlu kasih password apapun.

Kebanyakan klien pilih A karena tidak perlu ngapa-ngapain dan emailnya jadi atas domain usaha sendiri. Kakak mau yang mana?
```

## Notes for Azriel

- Option A = the standard SOP flow. `admin@namausaha.com` is created on the client's own domain during setup; you handle the whole email transfer, client does nothing.
- Option B = the fallback flow. Client only relays one OTP code, never a password.
- Do not promise `@theirdomain.com` exists before their domain is registered. It is created during setup, which is fine, just do not imply it is instant.
- Full setup steps: `references/sops/client-hosting-provisioning.md`.
```
