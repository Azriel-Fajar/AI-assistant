# Kunci + Rubrik Tugas 4 Matdis (Inferensi, Kuantor, Aljabar Boolean)

Soal: `C:\Users\afw14\Downloads\Chrome Downloads\Tugas 4 (Inferensi, Kuantor & Aljabar Boolean).pdf`

Tiap materi dinilai 1-100. Tiap materi 4 soal, bobot 25 per soal. Potongan by severity (lihat Aturan Menilai).

## A. Penarikan Kesimpulan (Inferensi)

**A1.** p = lapar, q = kenyang, r = minum air, s = kembung.
Premis: (1) ¬p ∨ q, (2) r → s, (3) p ∧ r, (4) ¬s. Buktikan ¬p ∧ s.
- Premis SALING KONTRADIKSI: (3) Simplifikasi → r; (2)+r Modus Ponens → s; padahal (4) ¬s.
- Bukti valid yang diharapkan (contoh):
  1. p ∧ r (3) → r (Simplifikasi)
  2. r → s, r → s (Modus Ponens)
  3. s → s ∨ ¬p (Addisi)
  4. s ∨ ¬p, ¬s (4) → ¬p (Silogisme Disjungtif)
  5. ¬p, s → ¬p ∧ s (Konjungsi)
- Terima bukti lain asal tiap langkah valid. Terima juga jawaban yang menyatakan premis kontradiktif lalu menurunkan kesimpulan dengan benar.
- SALAH berat: menurunkan ¬p dari langkah tidak valid (mis. MT dari (2),(4) → ¬r lalu klaim ¬p tanpa dasar; atau "p dan ¬p" diabaikan begitu saja dengan aturan karangan).
- Soal ini ambigu (premis kontradiksi). Kalau jawaban mahasiswa beda jauh tapi masuk akal → tandai RAGU.

**A2.** p = dosen hadir, q = proyektor berfungsi (= proyektor tidak rusak), r = kuliah lancar, s = paham materi, t = nilai TTS membaik.
(4) p, (5) q → p ∧ q (Konjungsi) → r (MP) → s (MP) → t (MP) [atau Silogisme Hipotetis].
**Kesimpulan: Nilai TTS membaik.** Kesimpulan antara (kuliah lancar / paham materi) saja = kurang lengkap, potong sedang.

**A3.** (1) (h ∧ ¬p) → b, (2) b → t, (3) beberapa mahasiswa ¬p, (4) h.
h ∧ ¬p (Konjungsi) → b (MP) → t (MP / SH).
**Kesimpulan: (Beberapa mahasiswa) diperbolehkan dosen masuk terlambat.** Terima tanpa kata "beberapa" (potong kecil saja kalau mengklaim SEMUA mahasiswa). Kesimpulan "mahasiswa basah" saja = kurang lengkap.

**A4.** (4) a ∨ b, (5) ¬b → a (Silogisme Disjungtif) → rapat cepat → selesai sebelum makan siang → anggota istirahat → rapat efisien → (7) proyek berjalan lancar (MP berantai / SH).
**Kesimpulan: Proyek berjalan lancar.**

Nama aturan: Modus Ponens, Modus Tollens, Silogisme Hipotetis, Silogisme Disjungtif, Simplifikasi, Konjungsi, Addisi (penjumlahan). Nama aturan salah/tidak ditulis = potong kecil.

## B. Kuantor

**Ba.** "Terdapat pejabat yang korupsi."
- Berkuantor: ∃x (P(x) ∧ K(x)), atau ∃x K(x) dengan semesta pejabat.
- Negasi: "Semua pejabat tidak korupsi" / "Tidak ada pejabat yang korupsi". Berkuantor: ∀x (P(x) → ¬K(x)) atau ∀x ¬K(x) (semesta pejabat). Bentuk ¬∃x(...) yang benar juga diterima.
- Salah umum: ∃x ¬K(x) ("ada pejabat tidak korupsi") = salah inti, potong besar. ∀x (P(x) ∧ ¬K(x)) = salah kecil-sedang.

**Bb.** p(x) = "x habis dibagi 5" (semesta tidak disebut; anggap bilangan bulat/asli).
- ∀x p(x) **SALAH**, contoh penyangkal x = 1, 3, 7, dst.
- ∃x p(x) **BENAR**, contoh x = 5, 10, dst.
- Wajib ada contoh. Tanpa contoh = potong sedang.

**Bc.** p(x): x² − 4 < 0, U = {1,2,3}. x=1: −3<0 B; x=2: 0<0 S; x=3: 5<0 S.
- ∀x p(x) **SALAH** (x=2 atau x=3). ∃x p(x) **BENAR** (x=1).

**Bd.** p(x): x + x = 0, x bilangan asli. **Keputusan Azriel 2026-11-19: 0 termasuk bilangan asli**, ℕ = {0,1,2,...}.
- ∀x p(x) **SALAH** (mis. 1+1=2≠0). ∃x p(x) **BENAR** (x = 0, 0+0=0).
- Jawaban ∃ salah karena asli mulai 1: untuk sekarang tetap nilai penuh (keputusan Azriel 2026-11-19).
- Tanpa alasan = potong sedang.

## C. Aljabar Boolean

**C1.** Y = (A + B) · (C + D̄). Rangkaian: OR(A,B), NOT(D), OR(C, D̄), AND kedua OR.
A=1,B=0,C=0,D=0 → A+B = 1, D̄ = 1, C+D̄ = 1, **Y = 1**.
Gambar salah (mis. lupa gerbang NOT) = potong sedang. Hasil salah karena mengabaikan bar D (Y = 0) = potong besar.

**C2.** F = (x + y')(y + z)(x' + z).
- (x + y') → x=0,y=1 → M2 (x+y'+z), M3 (x+y'+z')
- (y + z) → y=0,z=0 → M0 (x+y+z), M4 (x'+y+z)
- (x' + z) → x=1,z=0 → M4 (x'+y+z), M6 (x'+y'+z)
- **F = ΠM(0, 2, 3, 4, 6)** = (x+y+z)(x+y'+z)(x+y'+z')(x'+y+z)(x'+y'+z). (Setara Σm(1,5,7).)
- M4 dobel ditulis 2x = potong kecil. Maxterm kurang/lebih = potong per kesalahan.

**C3.** F = x'y + xz' + yz.
- x'y → 010, 011 → m2, m3; xz' → 100, 110 → m4, m6; yz → 011, 111 → m3, m7
- **F = Σm(2, 3, 4, 6, 7)** = x'yz' + x'yz + xy'z' + xyz' + xyz.

**C4.** F = 1 pada 001, 100, 111.
- **SOP: F = x'y'z + xy'z' + xyz = Σm(1, 4, 7)**
- **POS: F = (x+y+z)(x+y'+z)(x+y'+z')(x'+y+z')(x'+y'+z) = ΠM(0, 2, 3, 5, 6)**
- Konvensi maxterm: variabel 0 → tidak dikomplemen, 1 → dikomplemen. Salah konvensi (POS dikomplemen terbalik) = potong besar.

## Aturan Menilai

- **Cara beda tapi valid + hasil benar = nilai penuh, tanpa potongan, bukan RAGU** (aturan Azriel). Kunci di atas cuma satu contoh cara. RAGU hanya kalau validitas caranya memang tidak jelas.
- Nilai tiap materi 1-100, potong by severity dengan alasan per potongan, satu baris pendek ("-5 A2 kesimpulan berhenti di 'paham materi'"). Tidak pakai rumus kaku.
- Slip notasi kecil yang langkah berikutnya benar = potong kecil (1-3). Nama aturan salah/tidak ditulis = kecil. Langkah inti salah = besar. Hasil akhir salah = besar.
- Hukum ditulis sebagai rumus = dianggap sudah dinamai. Simplifikasi valid.
- Soal tidak dijawab = 0 untuk soal itu (25 poin hilang).
- Jawaban identik persis dengan mahasiswa lain (salah yang sama, kata yang sama) = catat di "Catatan", jangan potong.
- Tidak yakin (tulisan tangan tak terbaca, ambigu, jawaban beda pendekatan) → tandai RAGU + bagian mana.
