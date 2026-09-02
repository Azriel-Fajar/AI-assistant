# Prompt: Slide Tes Soft Skill Asisten Dosen — Logika Matematika & Sistem Bilangan

Buatkan deck presentasi 10 slide untuk sesi mengajar singkat (teaching demo) mata kuliah Logika Matematika / Matematika Diskrit.

## Konteks
Presenter: mahasiswa Informatika yang sedang tes soft skill calon asisten dosen. Audiens: dosen penilai + simulasi mahasiswa semester 1. Durasi bicara sekitar 10-15 menit. Penilaian ada pada kejelasan menjelaskan, bukan kepadatan teks. Jadi slide harus jadi ALAT BANTU MENGAJAR, bukan rangkuman modul.

## Bahasa
Mayoritas Bahasa Indonesia. Istilah teknis boleh tetap Inggris/simbol baku (proposition, quantifier, union, domain-kodomain, binary, hex, ∀, ∃, ¬, ∧, ∨, →, ↔, ∈, ⊆, ∩, ∪).

## Gaya Visual
- Modern minimalis. Banyak white space, hierarki tipografi tegas, 1 warna aksen saja plus netral.
- Font sans-serif bersih. Judul besar, isi ringkas.
- Maksimal 5 baris teks per slide. Tanpa paragraf. Poin pendek.
- SETIAP slide materi wajib punya ilustrasi/diagram yang menjelaskan konsep, bukan dekorasi. Pakai SVG/diagram inline, bukan foto stok.
- Rumus dan simbol logika ditampilkan besar dan terbaca.
- Konsisten: posisi judul, grid, dan gaya diagram sama di semua slide.
- Tanpa emoji.

## Struktur 10 Slide

1. **Judul** — "Logika Matematika & Sistem Bilangan", subjudul: dari kalimat sehari-hari ke bahasa mesin. Nama presenter + NIM. Visual: garis alur 5 topik sebagai satu jalur.

2. **Peta Materi / Alur Berpikir** — tunjukkan 5 topik sebagai satu rantai yang saling menyambung: Proposisi → Kuantor → Himpunan → Relasi → Konversi Bilangan. Beri satu kalimat kenapa urutannya begitu.

3. **Logika Proposisional (1) — Apa itu Proposisi** — definisi: kalimat yang bernilai benar ATAU salah, tidak keduanya. Beri 3 contoh valid dan 2 non-contoh (kalimat tanya/perintah). Visual: kartu kalimat dengan cap TRUE / FALSE / BUKAN PROPOSISI.

4. **Logika Proposisional (2) — Operator & Tabel Kebenaran** — ¬, ∧, ∨, →, ↔ dengan analogi sehari-hari (misal implikasi = janji: "kalau hujan, aku bawa payung"; kapan janji itu ingkar?). Visual: tabel kebenaran rapi, baris yang bernilai salah pada implikasi disorot dengan warna aksen.

5. **Kuantor & Negasi** — ∀ (semua) vs ∃ (ada). Aturan negasi: ¬∀x P(x) ≡ ∃x ¬P(x) dan ¬∃x P(x) ≡ ∀x ¬P(x). Pakai contoh konkret: "Semua mahasiswa hadir" dinegasikan bukan jadi "semua tidak hadir", tapi "ada satu yang tidak hadir". Visual: barisan ikon orang, satu orang berbeda warna sebagai counterexample.

6. **Himpunan** — notasi keanggotaan, subset, dan operasi ∪, ∩, selisih, komplemen. Kaitkan balik ke slide 4 (∪ mirip ∨, ∩ mirip ∧). Visual: diagram Venn dua lingkaran, tiap operasi punya mini-Venn dengan area terarsir warna aksen.

7. **Relasi** — relasi sebagai himpunan pasangan terurut dari A × B. Sebut sifat: refleksif, simetris, transitif, masing-masing satu contoh sebaris. Visual: diagram panah domain → kodomain, plus matriks relasi kecil di sampingnya untuk menunjukkan dua representasi konsep yang sama.

8. **Sistem Bilangan** — basis 2, 8, 10, 16 dan kenapa komputer pakai basis 2. Visual: satu angka desimal yang sama ditampilkan berdampingan dalam empat basis, plus tabel nilai tempat (place value) 2^n.

9. **Konversi Bilangan — Cara Cepat** — desimal ke biner (bagi 2, baca sisa dari bawah) dan biner ke desimal (jumlah nilai tempat). Tambah trik biner ke heksadesimal: kelompokkan 4 bit. Visual: satu contoh dikerjakan bertahap sebagai alur langkah, tiap langkah satu kotak, bukan blok teks.

10. **Penutup & Latihan** — 3 soal singkat untuk audiens, satu dari kelompok topik yang berbeda (negasi kuantor, operasi himpunan, konversi biner). Tutup dengan satu kalimat benang merah: logika, himpunan, dan relasi adalah cara kita menyusun aturan; sistem bilangan adalah cara mesin menyimpannya.

## Aturan Konten
- Tiap slide materi ikut pola: konsep singkat → contoh konkret → ilustrasi.
- Contoh pakai konteks kampus atau keseharian Indonesia, bukan contoh abstrak.
- Jangan taruh langkah pengerjaan panjang di slide. Cukup kerangkanya, sisanya dijelaskan lisan.
- Tanpa animasi berlebihan. Transisi bersih.
- Slide harus tetap terbaca dari jarak jauh: ukuran teks isi minimal setara 20pt.

## Output
Deck 10 slide siap presentasi, rasio 16:9.
