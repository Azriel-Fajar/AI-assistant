# Ringkasan Wawancara Jaringan Sekolah (pmj.m4a)

Sumber: [pmj.md](pmj.md), durasi 18:51. Narasumber: staf IT sekolah. Tanda (?) = hasil transkrip kurang jelas, cek ulang di audio.

## 1. Sumber internet dan ruang pusat
- Ada ruang khusus jaringan pusat, letaknya di bagian belakang sekolah.
- Ada 2 modem ISP utama, masing-masing 300 Mbps.
- Dua modem di-bonding jadi 600 Mbps, lalu masuk ke router MikroTik.
- Ada 1 jalur ISP lain berbandwidth kecil, tidak di-bonding. Dipakai hanya untuk mendapat IP publik.

## 2. Perangkat dan topologi
- Router utama: MikroTik (lantai bawah).
- Modem: bawaan ISP.
- Access point: area utara dan selatan. Selatan memakai Ruijie, area lain memakai merek lain (?).
- Lantai atas: Ruijie lagi. Fiturnya mirip MikroTik tapi aturannya lebih mudah: load balancing, VLAN, bandwidth limiter. Dikelola lewat dashboard Ruijie.
- Alur: 2 modem, bonding, MikroTik, switch, lalu ke access point dan komputer langsung.
- Antar-lantai terhubung kabel.
- Lantai atas hanya dapat 50 Mbps dari tiap modem (total 100 Mbps) karena penggunanya sedikit. Pengguna terbanyak ada di lantai bawah.

## 3. Pembagian jaringan (VLAN)
- Jaringan dipisah supaya tidak rebutan bandwidth: nilai, guru, siswa, admin.
- Tamu memakai jaringan terpisah dengan sandi khusus.

## 4. Pembatasan akses
| Pengguna | Batas |
|---|---|
| Siswa (~600) | Bandwidth per IP (rata), dan waktu 90 menit lalu login ulang |
| Guru | Bandwidth saja, dibagi rata per pengguna yang sedang online |
| Tamu | Sandi khusus |

- Alasan batas waktu siswa: 600 siswa, 600 Mbps, supaya tidak ada yang memonopoli.
- Ada jadwal akses otomatis (aktif atau ditutup sesuai jam belajar dan jam pulang, kecuali hari libur) (?).

## 5. Lab dan hotspot umum
- 2 lab komputer di lantai atas, kapasitas 37 per lab.
- Lab memakai Ruijie. Ada hotspot umum berbasis voucher 1 jam, sekitar Rp10.000 (?).
- Pengguna hotspot umum sekitar 50. Total perangkat sekitar 700 (?).

## 6. Filter konten
- MikroTik bisa memblokir game, aplikasi, dan website tertentu.
- Tetap bisa ditembus, misalnya dengan ganti IP.
- Pesan narasumber: filter terbaik tetap kesadaran pengguna sendiri.

## 7. Masalah yang sering muncul
- Mayoritas masalah hardware: overload, perangkat tua, satu port mati bisa mematikan semuanya.
- Perangkat milik sekolah cepat diganti sendiri.
- Modem ISP lebih lama, maksimum sekitar 6 jam.
- Masalah jaringan biasanya muncul setelah topologi baru dibuat. Kalau sudah berjalan, jarang.

## 8. Arahan untuk tugas (Packet Tracer)
- Buat layout fisik sekolah dan jaringan ke tiap ruangan.
- Sumber: 2 jalur, bonding 600 Mbps ke MikroTik di lantai bawah.
- Dari situ split 50 + 50 Mbps ke Ruijie di lantai atas.
- Asumsi klien: lantai bawah 600, lantai atas 200.
- Bandwidth tetap kurang, maka dipakai limit per pengguna.

## Perlu dicek di audio
- Merek AP area utara.
- Harga dan kecepatan voucher.
- Nama dashboard Ruijie yang disebut ("Lanyard", kemungkinan salah dengar).
- Jadwal akses otomatis.
