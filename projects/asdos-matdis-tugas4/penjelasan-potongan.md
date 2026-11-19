# Penjelasan Potongan Nilai Tugas 4 Matdis

Hanya soal yang kena potongan yang ditampilkan (nilai < 25). Soal yang tidak disebut = nilai penuh 25/25.
Tiap materi = 4 soal x 25. A = Inferensi, B = Kuantor, C = Aljabar Boolean.

Kebijakan Bd: 0 termasuk bilangan asli, jadi ∃ benar (x=0). Jawaban ∃ salah (asli mulai 1) untuk sekarang juga tetap penuh.

## 672025129 - ? (nama tidak ada di PDF)
**Inferensi 84 · Kuantor 89 · Aljabar Boolean 42**

- **A1** (23/25, -2): bukti valid sama dengan kunci (Simplifikasi, MP, Addisi S∨¬P, SD dengan ¬S, Konjungsi), kesimpulan ¬P∧S benar; -2 nama aturan tidak ditulis
- **A2** (21/25, -4): P∧Q → R → S, kesimpulan T (nilai TTS membaik) benar; -3 nama aturan tidak ditulis; -1 premis 3 salah salin ("Beberapa mahasiswa")
- **A3** (20/25, -5): kesimpulan S (dosen memperbolehkan masuk terlambat) benar; -2 premis 1 hanya ditulis (P∧¬Q) tanpa → R; -3 nama aturan tidak ditulis
- **A4** (20/25, -5): rantai P, Q, R, S, U, kesimpulan V (proyek berjalan lancar) benar; -2 langkah P dari P∨T dan ¬T (Silogisme Disjungtif) tidak ditulis; -3 nama aturan tidak ditulis
- **Ba** (24/25, -1): ∃x p(x) dan negasi ¬∃x p(x) "Semua pejabat tidak korupsi" benar; -1 p(x) tidak didefinisikan
- **Bd** (15/25, -10): ∃ salah dengan alasan, diterima (kebijakan asli mulai 1 tetap penuh); -10 ∀x p(x) ditulis tanpa nilai kebenaran dan alasan
- **C1** (17/25, -8): gambar rangkaian benar (OR, NOT pada D, OR, AND); -8 nilai Y untuk A=1, B=0, C=0, D=0 tidak dihitung
- **C2** (0/25, -25): tidak dijawab
- **C4** (0/25, -25): tidak dijawab (hanya "F=1" dicoret)

## 672025211 - ?
**Inferensi 81 · Kuantor 100 · Aljabar Boolean 79**

- **A1** (9/25, -16): -14 langkah inti salah, dari L ∧ M (Simplifikasi benar) dan MP benar dapat "kemb", lalu "ingkaran dari L adalah ¬L" tanpa dasar valid, kontradiksi dengan premis (4) ¬kemb tidak disadari; -2 nama aturan Simplifikasi tidak ditulis
- **A3** (24/25, -1): -1 aturan Konjungsi tidak disebut nama ("gabungkan"); MP x2 dan kesimpulan benar
- **A4** (23/25, -2): DS benar, SH berantai A → P benar; -2 langkah akhir MP (A, A → P) ke P tidak ditulis eksplisit
- **C1** (15/25, -10): -10 gambar rangkaian benar (OR, NOT, OR, AND) tetapi hasil Y untuk A=1,B=0,C=0,D=0 tidak dihitung (seharusnya Y=1)
- **C2** (23/25, -2): -2 slip "M0·M1" pada suku 2 (seharusnya M0·M4), hasil akhir ΠM(0,2,3,4,6) dan ekspansi benar
- **C3** (24/25, -1): -1 minterm ditulis "M" huruf besar (notasi), hasil Σm(2,3,4,6,7) benar
- **C4** (17/25, -8): SOP Σm(1,4,7) benar; POS indeks ΠM(0,2,3,5,6) benar tetapi ekspansi salah, ditulis (x+y+z)(x+y'+z)(x+y+z')(x'+y'+z): -8 faktor (x+y+z') salah (M1, seharusnya x+y'+z') dan faktor (x'+y+z') hilang

## 672026071 - Ernest Viktor Sy L
**Inferensi 83 · Kuantor 100 · Aljabar Boolean 98**

- **A1** (8/25, -17): -12 menurunkan ¬p langsung dari (¬p ∨ q) dengan alasan "tidak mempengaruhi kontradiksi", langkah tidak valid (seharusnya Silogisme Disjungtif dengan ¬s atau addisi dulu); -3 Simplifikasi p∧r → r tidak ditulis, dan ¬s tidak dipakai; kesimpulan ¬p ∧ s kebetulan benar, MP r→s, r ⊢ s dan Konjungsi benar
- **C2** (24/25, -1): -1 salah salin soal di baris judul "(x+y')(x+y')(x'+z)", pengerjaan dan hasil ΠM(0,2,3,4,6) benar
- **C4** (24/25, -1): -1 baris 011 ditulis M5 (seharusnya M3), SOP Σm(1,4,7) dan POS ΠM(0,2,3,5,6) benar

## 672026072 - ?
**Inferensi 88 · Kuantor 89 · Aljabar Boolean 94**

- **A1** (22/25, -3): -3 tidak ada nama aturan tiap langkah (r, s, s∨¬p, ¬p, ¬p∧s semua valid; tidak menyebut premis kontradiktif, tapi bukti sah)
- **A2** (22/25, -3): -3 nama aturan tidak ditulis; kesimpulan akhir "nilai TTS membaik" benar
- **A3** (22/25, -3): -3 nama aturan tidak ditulis; formalisasi berbeda (hujan/tidak bawa payung) tapi alurnya valid dan kesimpulan benar
- **A4** (22/25, -3): -3 nama aturan tidak ditulis; rantai p..u dan kesimpulan "proyek berjalan lancar" benar
- **Bb** (19/25, -6): -6 tidak ada contoh (hanya Salah/Benar tanpa x=1 atau x=5)
- **Bd** (20/25, -5): (revisi 0∈ℕ) ∃ benar sekarang sesuai kunci; -5 alasan bertentangan (bilang 0 bukan anggota ℕ) + ∀ tanpa contoh
- **C2** (21/25, -4): -4 penulisan F akhir salah: (x+y+z) hilang dan (x'+y+z) tertulis dobel; tabel maxterm dan ΠM(0,2,3,4,6) benar
- **C3** (23/25, -2): -2 slip penulisan di baris F ("x'+yz'" seharusnya x'yz'); hasil Σm(2,3,4,6,7) benar

## 672026073 - ?
**Inferensi 76 · Kuantor 99 · Aljabar Boolean 86**

- **A1** (8/25, -17): Simplifikasi p, r dan Modus Ponens s valid. -10 konklusi akhir "p ∧ s" bukan ¬p ∧ s (ditulis "tidak lapar tetapi kembung", tidak cocok dengan p ∧ s); -5 "kontradiksi" hanya disebut, tidak dijelaskan (s vs P4 ¬s); -2 nama aturan tidak ditulis.
- **A2** (23/25, -2): p∧q, r, s, t benar, kesimpulan "Nilai TTS membaik" benar. -2 nama aturan tidak ditulis.
- **A3** (22/25, -3): Instansiasi a, (p∧¬Q(a)) → r(a) → s(a) valid, kesimpulan "beberapa mahasiswa ... masuk terlambat" benar. -3 nama aturan (EI/UI, MP, Konjungsi) tidak ditulis, penomoran premis berantakan.
- **A4** (23/25, -2): DS (p), lalu rantai MP sampai v valid, kesimpulan benar. -2 nama aturan tidak ditulis.
- **Bb** (24/25, -1): ∀ salah (x=3), ∃ benar (x=10). -1 salah tulis "habis dibagi 3" padahal 5.
- **C1** (20/25, -5): Y = 1 benar. -5 gambar tidak memperlihatkan gerbang NOT untuk D (hanya titik di input OR, label C+D̄ ada).
- **C2** (21/25, -4): Maxterm M0, M2, M3, M4, M6 benar. -2 slip notasi "(x.x')" harusnya penjumlahan; -2 tidak menuliskan hasil akhir ΠM(0,2,3,4,6).
- **C3** (20/25, -5): Lima minterm benar (m2,m3,m4,m6,m7). -3 slip tanda "+" antara (x'y) dan (z.z'); -2 label minterm 110 ditulis tidak sesuai (m6); -2 tidak ada ringkasan Σm.

Perlu cek manual:
  - A1: konklusi p ∧ s dan label "kontradiksi" tidak jelas maksudnya (kemungkinan salah baca ¬p).
  - C1: tidak jelas apakah titik di input D adalah lingkaran inversi atau hanya titik.

## 672026074 - ?
**Inferensi 94 · Kuantor 90 · Aljabar Boolean 96**

- **A1** (19/25, -6): langkah valid (Simplifikasi, MP, Konjungsi) dan menyatakan premis kontradiktif, tapi berhenti di s ∧ ¬s, tidak menurunkan ¬p ∧ s (-6)
- **Ba** (22/25, -3): negasi benar (∀x ¬p(x), semua pejabat tidak korupsi); simbol "(x ∧ x)" salah tulis dan predikat digabung (-3)
- **Bc** (23/25, -2): ∀ salah, ∃ benar, contoh benar; slip tulis "x²=3" padahal x=3 (-2)
- **Bd** (20/25, -5): ∀ salah (x=3) benar; ∃ tidak dinyatakan salah secara eksplisit, hanya lewat ∀x ¬p(x) tanpa alasan (-5)
- **C1** (24/25, -1): hasil Y=1 benar, gambar benar; NOT D digambar sebagai titik di input gerbang OR, bukan gerbang NOT (-1)
- **C4** (22/25, -3): SOP Σm(1,4,7) dan ΠM(0,2,3,5,6) benar; faktor terakhir POS ditulis (y'+y'+z), seharusnya (x'+y'+z) (-3)

Perlu cek manual:
  - A1: tidak menurunkan ¬p ∧ s, hanya s ∧ ¬s dari premis kontradiktif; valid tapi kesimpulan beda dari kunci
  - Bd: verdict ∃ tidak eksplisit, alasan tipis
  - C1: NOT digambar sebagai bubble/titik di input OR

## 672026075 - Christian Roeroe
**Inferensi 72 · Kuantor 84 · Aljabar Boolean 100**

- **A1** (11/25, -14): -10 kesimpulan ¬P tidak diturunkan dari langkah valid (S ∧ ¬S ditemukan lalu ¬P ∧ S diklaim begitu saja); -3 pemisalan Q = "minum air" salah (seharusnya R, Q = kenyang), simplifikasi p∧r tidak menyebut R. Plus: S via MP benar, kontradiksi S ∧ ¬S terdeteksi.
- **A2** (24/25, -1): -1 langkah H ∧ F tidak diberi nama aturan (Konjungsi). Kesimpulan "Nilai TTS membaik" benar, MP berantai benar.
- **A3** (12/25, -13): -13 hanya menulis kesimpulan (dosen memperbolehkan masuk terlambat), tanpa premis dan tanpa langkah penurunan. Kesimpulan akhir benar.
- **Bb** (18/25, -7): -7 ∀ salah, ∃ benar sudah benar tapi tanpa contoh (penyangkal / pemenuhnya).
- **Bc** (22/25, -3): -3 ∀ salah, ∃ benar benar, tapi tanpa pengecekan nilai x = 1, 2, 3.
- **Bd** (19/25, -6): -6 ∀ salah, ∃ salah benar, tapi tanpa alasan (2x = 0 tidak ada solusi di bilangan asli).

Perlu cek manual:
  - A1: bukan bukti valid dan ¬P tidak ada dasarnya, tapi mahasiswa mendeteksi kontradiksi; bisa dinilai lebih tinggi kalau asdos menerima "kontradiksi menyiratkan apa saja".
  - A3: tidak ada langkah, hanya kesimpulan; apakah halaman premis hilang tidak diketahui.

## 672026076 - ?
**Inferensi 78 · Kuantor 94 · Aljabar Boolean 98**

- **A1** (15/25, -10): -7 ¬P ∧ S tidak diturunkan, berhenti di ¬P ∨ S (dari S, Addisi) dengan dalih kontradiksi; -3 nama aturan tidak ditulis. Pengamatan S vs ¬S (premis kontradiktif) benar, MP dari R→S dan R benar.
- **A2** (22/25, -3): -3 nama aturan tidak ditulis. Konjungsi, MP berantai sampai E (nilai TTS membaik) benar.
- **A3** (19/25, -6): -3 nama aturan tidak ditulis; -3 Q didefinisikan "membawa payung" tapi dipakai tanpa negasi (seharusnya ¬Q sesuai premis "tidak membawa payung"). Rantai Konjungsi, SH, MP konsisten dan kesimpulan "beberapa mahasiswa boleh masuk terlambat" benar.
- **A4** (22/25, -3): -3 nama aturan tidak ditulis. P ∨ V dan ¬V gives P, lalu MP berantai sampai U, benar.
- **Ba** (23/25, -2): -2 slip notasi, negasi ditulis ¬K(x) padahal predikatnya Q(x). Negasi ∀x[P(x) → ¬K(x)] dan kalimat "tidak ada pejabat yang korupsi" benar.
- **Bd** (21/25, -4): -4 alasan ∀ menyebut "bil. asli negatif" (bilangan asli tidak negatif) dan tanpa contoh penyangkal; hasil ∀ salah dan ∃ salah benar.
- **C3** (23/25, -2): -2 minterm dilabeli M / ΣM (seharusnya m / Σm). Σm(2,3,4,6,7) dan ekspansi benar.

Perlu cek manual:
  - A1: premis kontradiktif, mahasiswa menyatakan "kesimpulan apapun boleh diturunkan" lalu menulis ¬P ∨ S, bukan ¬P ∧ S. Nilai 15 bisa naik kalau penjelasan ini dianggap cukup.
  - A3: negasi pada Q hilang atau memang salah terjemah, tidak bisa dipastikan tanpa soal asli di depan mata.

## 672026077 - Azizta Olie Fredyatama (ejaan nama tulisan tangan, kurang jelas)
**Inferensi 78 · Kuantor 100 · Aljabar Boolean 77**

- **A1** (10/25, -15): -13 ¬p diturunkan dari (¬p ∨ q) dengan r tanpa dasar valid (DS butuh ¬q; bukan aturan sah), konjungsi ¬p ∧ s jadi tidak sah; -2 nama aturan tidak ditulis. Simplifikasi p∧r→r dan MP r→s benar.
- **A2** (23/25, -2): rantai Konjungsi, MP, MP, MP benar sampai "nilai TTS membaik"; -2 nama aturan tidak ditulis.
- **A3** (22/25, -3): pemodelan dan rantai (p∧q)→r, r→s benar, kesimpulan "dosen memperbolehkan masuk telat"; -2 nama aturan tidak ditulis; -1 kata "beberapa" tidak muncul.
- **A4** (23/25, -2): DS dari (p∨r, ¬r) → p, lalu MP berantai sampai proyek berjalan lancar, benar; -2 nama aturan tidak ditulis.
- **C1** (9/25, -16): -12 hasil akhir Y=0 (salah): (C + D̄) dikomplemenkan lagi jadi 0, harusnya Y=1; -4 gambar tidak menunjukkan gerbang NOT untuk D dan label (C+D) tanpa bar.
- **C2** (18/25, -7): -7 maxterm M1 (x+y+z') ikut tertulis padahal tidak dihasilkan faktor mana pun; ΠM(0,1,2,3,4,6) kelebihan M1. Ekspansi tiap faktor dan M4 duplikat sudah ditangani benar.

Perlu cek manual:
  - A1: ¬p diturunkan dari ¬p ∨ q tanpa langkah valid yang terlihat; tulisan langkah ini kecil dan agak kabur, kemungkinan dimaksud cara lain tapi tidak jelas.
  - C1: gambar rangkaian, tidak jelas ada gerbang NOT pada D atau tidak.

## 672026078 - ?
**Inferensi 62 · Kuantor 96 · Aljabar Boolean 90**

- **A1** (5/25, -20): hanya menulis premis dan kesimpulan (¬p ∧ s), tanpa langkah penurunan sama sekali (-20 tidak ada bukti, kesimpulan benar tapi tidak diturunkan)
- **A2** (22/25, -3): rantai (p∧q)→r→s→t benar, kesimpulan t benar (-3 nama aturan tidak ditulis, Konjungsi p∧q hanya tersirat)
- **A3** (20/25, -5): rantai SH (p∧¬q)→r→s dan kesimpulan s benar, "berlaku untuk beberapa mahasiswa" benar (-3 q didefinisikan "tidak membawa payung" tetapi premis ditulis ¬q, simbol terbalik; -2 nama aturan tidak ditulis)
- **A4** (15/25, -10): rantai p→q→r→s→t→u benar (-7 kesimpulan hanya "jika p maka u", padahal p∨w dan ¬w memberi p lalu u; -3 Silogisme Disjungtif tidak ditulis)
- **Bd** (21/25, -4): ∀ salah (1+1=2), ∃ salah benar (-4 alasan 2x=0 tidak dijelaskan kenapa tidak ada bilangan asli yang memenuhi)
- **C1** (23/25, -2): gambar rangkaian benar (termasuk NOT di D), Y = 1 benar (-2 baris awal "D̄ · D̄ : 1" salah tulis)
- **C3** (23/25, -2): Σm(2,3,4,6,7) benar (-2 minterm ditulis dengan huruf M)
- **C4** (19/25, -6): SOP Σ(1,4,7) benar, notasi ΠM(0,2,3,5,6) benar (-6 bentuk POS yang diuraikan salah: M3 (x+y'+z') hilang dan diganti (x'+y+z) yang M4, padahal F(100)=1)

Perlu cek manual:
  - A1: hanya kesimpulan tanpa langkah, premis kontradiktif; mungkin lembar lain/langkah tak dikirim
  - A3: simbol q terbalik (¬q vs q), tidak bisa cek teks soal asli versi mahasiswa ini

## 672026079 - ?
**Inferensi 64 · Kuantor 96 · Aljabar Boolean 89**

- **A1** (5/25, -20): hanya menulis ulang premis dan klaim ¬p ∧ s, tanpa satu pun langkah penurunan (-20 inti bukti tidak ada)
- **A2** (23/25, -2): rantai benar sampai t (Nilai TTS membaik), -2 nama aturan tidak ditulis
- **A3** (20/25, -5): p ∧ ¬q lalu SH ke s benar, -3 langkah konjungsi/MP ke s dilompati (s langsung ditulis dari (p∧¬q)→s), -2 nama aturan tidak ditulis
- **A4** (16/25, -9): rantai p→q→r→s→t→u benar, tapi kesimpulan berhenti di "jika Andi tepat waktu maka proyek lancar"; ¬w dan p ∨ w (Silogisme Disjungtif → p) tidak dipakai (-7), -2 nama aturan tidak ditulis
- **Bd** (21/25, -4): ∀ salah (1+1=2≠0) benar, ∃ salah benar, -4 alasan "tidak ada bilangan asli yang memenuhi 2x=0" tidak ditulis eksplisit
- **C1** (23/25, -2): gambar gerbang + hasil Y=1 benar, -2 label keluaran OR bawah ditulis "C+B" (seharusnya C+D̄)
- **C2** (23/25, -2): ΠM(0,2,3,4,6) benar, M4 tidak dobel, -2 tanda "=" antar bentuk dipakai tidak tepat saat faktorisasi
- **C3** (23/25, -2): Σm(2,3,4,6,7) benar, -2 salah tulis indeks (011 ditulis m2, harusnya m3)
- **C4** (20/25, -5): SOP Σ(1,4,7) benar; POS indeks ΠM(0,2,3,5,6) benar tapi ekspansi tertulis hanya 4 faktor, maxterm M3 (x+y'+z') hilang (-5)

Perlu cek manual:
  - A1: premis kontradiktif, mahasiswa tidak menurunkan apa pun, tidak ada pendekatan alternatif untuk dinilai
  - A4: premis di PDF berbeda dari kunci (p ∨ w, ¬w, bukan a ∨ b); dinilai dengan premis versi mahasiswa, cek kesesuaian dengan soal asli
  - Bb: contoh ∃ tertulis "5,5,1" agak sulit dibaca, diasumsikan x=5

## 672026080 - ?
**Inferensi 74 · Kuantor 100 · Aljabar Boolean 100**

- **A1** (8/25, -17): -15 langkah inti salah, ¬p ditarik dari premis (1) ¬p∨q saja (bukan bentuk valid); -2 kontradiksi dengan premis (4) ¬s tidak disadari. Konklusi ¬p∧s kebetulan sama dengan soal.
- **A2** (22/25, -3): -3 nama aturan tidak ditulis. Kesimpulan "nilai TTS membaik" benar, langkah Konjungsi, MP, MP benar.
- **A3** (22/25, -3): -3 nama aturan tidak ditulis. Konjungsi, MP, MP benar, kesimpulan dosen memperbolehkan masuk terlambat benar.
- **A4** (22/25, -3): -3 nama aturan tidak ditulis. Silogisme Disjungtif, rantai MP sampai V benar.

Perlu cek manual:
  - A1: ¬p diturunkan langsung dari (1) tanpa dasar valid; kalau dosen mau lebih longgar, nilai bisa naik.

## 672026081 - Linda Handa? (tulisan tangan di halaman 1 kurang jelas)
**Inferensi 77 · Kuantor 92 · Aljabar Boolean 87**

- **A1** (8/25, -17): -15 menurunkan ¬p dari premis (1) ¬p∨q saja tanpa dasar valid (tidak ada Silogisme Disjungtif/MT yang sah), lalu menyimpulkan ¬p∧s; -2 tidak ada nama aturan. Simplifikasi r dan Modus Ponens s benar, tanda "↯" pada s vs ¬s sempat ditulis tapi diabaikan.
- **A2** (23/25, -2): -2 nama aturan tidak ditulis. Kesimpulan "nilai TTS membaik" benar.
- **A3** (23/25, -2): -2 nama aturan tidak ditulis. Kesimpulan "(beberapa) dosen diperbolehkan masuk terlambat" benar.
- **A4** (23/25, -2): -2 nama aturan tidak ditulis. Rantai P (SD) lalu Q, R, S, U, V benar, kesimpulan V.
- **Ba** (24/25, -1): -1 P(x) menggabung "pejabat" dan "korupsi" dalam satu predikat; negasi "semua pejabat tidak korupsi" benar.
- **Bb** (21/25, -4): -4 ketidaksetaraan ngawur "5>0,4" dan "5>2" sebagai pembenaran (alasan lisan 2 tidak/10 habis dibagi 5 benar, nilai kebenaran benar).
- **Bc** (23/25, -2): -2 slip tulis "1²-4>0" di awal, lanjutan -3<0 benar. Hasil ∀ salah, ∃ benar benar.
- **Bd** (24/25, -1): -1 "4>0" janggal untuk 2+2=0. ∀ salah, ∃ salah dengan alasan tidak ada bilangan asli, benar.
- **C1** (17/25, -8): -8 gambar rangkaian tanpa gerbang NOT pada D (label C+b' tanpa gerbang), label keluaran AND tidak rapi. Hitungan Y=1 benar.
- **C4** (20/25, -5): -3 baris SOP tertulis hanya x'y'z + xy'z' (xyz hilang) walau Σm(1,4,7) benar; -2 maxterm m3 tertulis (x+y'+z) di daftar (harusnya z'), bentuk akhir benar. SOP dan ΠM(0,2,3,5,6) akhir benar.

Perlu cek manual:
  - A1: ¬p diturunkan tanpa dasar valid dan kesalahan bukan jawaban "premis kontradiksi", nilai 8 bisa dilonggarkan kalau dosen lebih lunak. Nama di halaman 1 juga sulit dibaca ("Linda Handa?").

## 672026083 - ? (header hanya "Ast. M")
**Inferensi 61 · Kuantor 98 · Aljabar Boolean 98**

- **A1** (5/25, -20): hanya menulis premis lalu kesimpulan ¬p ∧ s, tanpa langkah penurunan sama sekali (-20 inti bukti tidak ada)
- **A2** (23/25, -2): Konjungsi lalu rantai MP sampai t (nilai TTS membaik) benar; -2 nama aturan tidak ditulis
- **A3** (18/25, -7): kesimpulan s (berlaku untuk beberapa mahasiswa) benar; -3 langkah p ∧ ¬q (Konjungsi) dan MP ke r tidak ditulis, langsung (p∧¬q)→s; -2 q didefinisikan "tidak membawa payung" tapi ditulis ¬q; -2 nama aturan tidak ditulis
- **A4** (15/25, -10): rantai p→q→r→s→t→u benar; -7 kesimpulan berhenti di "jika Andi tepat waktu maka proyek lancar", p ∨ w dan ¬w tidak dipakai (Silogisme Disjungtif); -3 nama aturan tidak ditulis
- **Bd** (23/25, -2): ∀ salah (1+1=2≠0), ∃ salah diterima (kebijakan asli mulai 1 tetap penuh); -2 alasan ∃ hanya "2x=0"
- **C4** (23/25, -2): SOP Σ(1,4,7) benar dan tabel minterm/maxterm benar; -2 faktor ketiga POS ditulis (x+y'+z), seharusnya (x+y'+z') untuk M3

Perlu cek manual:
  - Kemiripan: lembar jawaban SAMA PERSIS dengan PDF 090 (kertas yang sama, 083 foto biasa, 090 hasil CamScanner). Nilai keduanya disamakan. Pola A1/A4 juga mirip 078 dan 079. Tentukan siapa pemilik asli.

## 672026084 - ?
**Inferensi 70 · Kuantor 96 · Aljabar Boolean 80**

- **A1** (5/25, -20): hanya menulis premis dan kesimpulan "¬p ∧ s", tanpa langkah penurunan sama sekali (-20, tidak ada bukti).
- **A2** (24/25, -1): rantai p∧q -> r -> s -> t benar, kesimpulan t; -1 Konjungsi p∧q tidak dinamai (MP ditulis "ponen").
- **A3** (21/25, -4): ¬p(c) -> B(c) -> T(c) benar, kesimpulan ∃x T(x) benar; -4 langkah h ∧ ¬p(c) (Konjungsi) dan nama aturan tidak ditulis.
- **A4** (20/25, -5): p -> ... -> v benar, kesimpulan v; -3 langkah "p ∨ t, ¬t => p" (Silogisme Disjungtif) dilompati; -2 nama aturan tidak ditulis.
- **Ba** (22/25, -3): ¬∃x K(x) ≡ ∀x ¬K(x) benar; -3 kalimat negasi dalam kata dan bentuk asli ∃x tidak ditulis.
- **Bb** (24/25, -1): ∀ salah (x=7), ∃ benar (x=10) dengan contoh; -1 penulisan "7 : 5 = ?" kurang jelas sebagai ketidakhabisdibagian.
- **C1** (15/25, -10): gambar rangkaian OR(A,B), NOT D, OR(C,D̄), AND sesuai ekspresi; -8 nilai Y untuk A=1,B=0,C=0,D=0 tidak dihitung (seharusnya 1); -2 sambungan kabel input kurang jelas.
- **C2** (15/25, -10): notasi ΠM(0,2,3,4,6) benar, tapi bentuk maxterm yang ditulis salah di dua suku: (x'+y+z') dan (x'+y'+z') = M5, M7, seharusnya (x'+y+z) dan (x'+y'+z) (-10, bentuk ekspansi tidak cocok dengan notasinya).

Perlu cek manual:
  - A1: tidak ada langkah, tidak jelas apakah mahasiswa paham premis kontradiktif atau hanya menyalin kesimpulan.
  - C1: gambar rangkaian tulisan tangan, sambungan kabel input ke gerbang kurang jelas; nilai Y tidak ditulis.
  - Nama: tulisan nama di header tidak terbaca (NIM dari nama file).

## 672026085 - Welprina Madole (tulisan tangan, ejaan nama tidak pasti)
**Inferensi 73 · Kuantor 99 · Aljabar Boolean 95**

- **A1** (7/25, -18): -15 ¬p diturunkan dari (¬p ∨ q) saja, langkah tidak valid; kontradiksi dengan ¬s tidak disadari. -3 nama aturan tidak ditulis.
- **A2** (22/25, -3): bukti benar (Konjungsi, MP berantai), kesimpulan nilai TTS membaik benar. -3 nama aturan tidak ditulis.
- **A3** (22/25, -3): bukti benar, kesimpulan dosen memperbolehkan masuk terlambat benar (pemetaan simbol beda dari kunci tapi konsisten). -3 nama aturan tidak ditulis.
- **A4** (22/25, -3): rantai DS lalu MP sampai v benar. -3 nama aturan tidak ditulis.
- **Ba** (24/25, -1): ∃x(P∧K) dan negasi ∀x(P→¬K) benar, ada kalimat negasi. -1 Q(x) didefinisikan tapi dipakai K(x).
- **C1** (22/25, -3): Y = 1 benar. -3 gerbang NOT untuk b tidak digambar (hanya diberi label b'), slip "A=i".
- **C4** (23/25, -2): SOP Σm(1,4,7) dan POS ΠM(0,2,3,5,6) benar dengan konvensi benar. -2 persamaan SOP ditulis tanpa suku xyz (hasil akhir Σm benar).

Perlu cek manual:
  - A1: bukti ¬p dari (¬p ∨ q) tidak valid, tidak ada yang menyatakan premis kontradiktif; saya potong besar sesuai kunci, tolong cek.

## 672026086 - ?
**Inferensi 60 · Kuantor 100 · Aljabar Boolean 89**

- **A1** (6/25, -19): tidak ada langkah penurunan sama sekali, hanya memberi label premis (3)(2)(1) lalu menulis kesimpulan "tidak lapar tetapi kembung" (-17); q didefinisikan "kembung" padahal premis 1 = kenyang, duplikat dengan s (-2)
- **A2** (18/25, -7): simbolisasi benar dan kesimpulan benar (TTS membaik); tidak ada nama aturan (-4), rantai MP tidak diturunkan langkah demi langkah, hanya daftar premis dan p, q di akhir (-3)
- **A3** (17/25, -8): simbolisasi benar, kesimpulan "dosen memperbolehkan masuk" benar tapi tanpa "terlambat" dan tanpa "beberapa" (-2); tidak ada nama aturan (-4), langkah tidak diturunkan eksplisit, hanya (p∧q)→r, r→s, lalu kesimpulan (-2)
- **A4** (19/25, -6): simbolisasi benar, A diturunkan dari premis 4 dan 5, kesimpulan "proyek berjalan lancar" benar; tidak ada nama aturan (-4), rantai A→C→...→G tidak ditulis sebagai langkah berurutan bernomor (-2)
- **C1** (14/25, -11): gambar rangkaian benar (OR, NOT pada D, OR, AND); substitusi benar (1+0)·(0+1) tapi 1·1 ditulis 0, hasil akhir Y=0 salah, seharusnya 1 (-11)

## 672026087 - M Axel Allan R
**Inferensi 77 · Kuantor 94 · Aljabar Boolean 77**

- **A1** (9/25, -16): -10 ¬p diturunkan dari ¬p∨q tanpa aturan valid (langkah inti salah, premis (4) ¬s tidak dipakai, kontradiksi premis tidak disadari); -3 nama aturan tidak ditulis (hanya nomor langkah); -3 tidak ada pembuktian tiap langkah ke premis. Kesimpulan akhir ¬p∧s cocok kunci tapi jalurnya tidak sah.
- **A2** (23/25, -2): rantai Konjungsi -> MP -> MP -> MP benar, kesimpulan "nilai TTS membaik" benar; -2 nama aturan tidak ditulis.
- **A3** (22/25, -3): P∧Q -> r -> s benar; -2 nama aturan tidak ditulis; -1 kesimpulan tanpa "beberapa mahasiswa".
- **A4** (23/25, -2): DS (P∨r, ¬r) -> P -> Q -> S -> T -> U -> V benar, kesimpulan benar; -2 nama aturan tidak ditulis.
- **Ba** (24/25, -1): ∃x P(x) dan negasi ∀x ¬P(x) benar; -1 P(x) tidak didefinisikan.
- **Bb** (20/25, -5): ∀ salah (contoh penyangkal 3, 7, 12) benar; ∃ benar tapi tidak menyebut contoh konkret (-5).
- **C1** (12/25, -13): gambar rangkaian benar (OR, NOT pada D, OR, AND); -13 hasil akhir Y = 0, salah karena seluruh (C+D̄) diberi bar tambahan; seharusnya Y = 1.
- **C2** (17/25, -8): ekspansi tiga faktor benar; -8 maxterm M1 (x+y+z') ikut tertulis padahal tidak muncul dari ekspansi, hasil ΠM(0,1,2,3,4,6) seharusnya ΠM(0,2,3,4,6).
- **C3** (23/25, -2): Σm(2,3,4,6,7) benar; -2 minterm xyz ditulis (0,0,0) padahal (1,1,1), dan pakai notasi M untuk minterm.

Perlu cek manual:
  - C3: indeks xyz tertulis seperti (0,0,0)=M7, kemungkinan salah tulis untuk (1,1,1); hasil akhir tetap benar jadi dinilai slip kecil.

## 672026089 - ?
**Inferensi 77 · Kuantor 99 · Aljabar Boolean 85**

- **A1** (8/25, -17): -14 langkah inti tidak valid, ¬p diturunkan dari (¬p ∨ q) tanpa ¬q (Silogisme Disjungtif tidak berlaku) dan kontradiksi premis tidak disadari; -3 nama aturan tidak ditulis. Simplifikasi dan MP benar, konjungsi akhir sesuai bentuk kunci.
- **A2** (23/25, -2): -2 nama aturan tidak ditulis. Rantai benar, kesimpulan "nilai TTS membaik" lengkap.
- **A3** (23/25, -2): -2 nama aturan tidak ditulis. Konjungsi, MP, MP benar; kesimpulan "dosen memperbolehkan masuk terlambat" benar.
- **A4** (23/25, -2): -2 nama aturan tidak ditulis. DS lalu rantai MP sampai v benar.
- **Bc** (24/25, -1): -1 soal disalin x²-9<0 padahal perhitungan memakai x²-4 (slip salin). Hasil ∀ salah, ∃ benar sudah tepat.
- **C1** (17/25, -8): -7 gambar rangkaian tanpa gerbang NOT untuk D; -1 label "C+B'" seharusnya C+D'. Hasil Y=1 benar.
- **C2** (19/25, -6): -6 daftar akhir ΠM(2,3,4,6) kehilangan M0 padahal ekspresi (x+y+z) ditulis; sebagian bagian tertutup tip-ex/coretan. Ekspansi tiap faktor dan ekspresi 5 maxterm benar.
- **C4** (24/25, -1): -1 SOP ditulis ΣM (seharusnya Σm). SOP dan POS benar.

Perlu cek manual:
  - C2: daftar biner/indeks akhir tertutup tip-ex dan tidak terbaca jelas, indeks 0 hilang di ΠM; nilai C2 bergantung pembacaan ini.
  - A1: premis kontradiktif, jawaban menurunkan ¬p lewat langkah tidak valid (konsisten dengan potongan berat, tapi tandai).

## 672026090 - ?
**Inferensi 61 · Kuantor 98 · Aljabar Boolean 98**

- **A1** (5/25, -20): hanya menulis premis lalu kesimpulan ¬p ∧ s, tanpa langkah penurunan sama sekali (-20 inti bukti tidak ada) (disamakan dengan 083)
- **A2** (23/25, -2): -2 nama aturan inferensi tidak ditulis; Konjungsi, MP berantai sampai t sudah benar
- **A3** (18/25, -7): kesimpulan "beberapa mahasiswa" benar; -3 langkah p ∧ ¬q (Konjungsi) dan MP ke r tidak ditulis, langsung (p∧¬q)→s; -2 q didefinisikan "tidak membawa payung" tapi ditulis ¬q; -2 nama aturan tidak ditulis
- **A4** (15/25, -10): -8 kesimpulan berhenti di "Jika Andi tepat waktu maka proyek lancar", premis ¬w dan p∨w tidak dipakai (Silogisme Disjungtif) untuk mendapat p lalu u; -2 nama aturan tidak ditulis
- **Bd** (23/25, -2): ∀ salah benar (1+1=2), ∃ salah diterima (kebijakan asli mulai 1 tetap penuh); -2 alasan ∃ hanya "2x=0"
- **C4** (23/25, -2): SOP Σ(1,4,7) dan tabel benar; -2 faktor ketiga POS ditulis (x+y'+z), seharusnya (x+y'+z') untuk M3

Perlu cek manual:
  - Kemiripan: lembar jawaban SAMA PERSIS dengan PDF 083 (kertas yang sama). Nilai keduanya disamakan. Tentukan siapa pemilik asli.
  - A1: premis kontradiktif; jawaban tanpa penurunan sama sekali dan menyebut ¬s sebagai bagian kesimpulan, nilai 3/25 bisa dibahas
  - Bd: alasan ∃ salah sangat singkat, tanpa menyebut definisi bilangan asli

## 672026091 - ?
**Inferensi 77 · Kuantor 98 · Aljabar Boolean 97**

- **A1** (8/25, -17): -15 menurunkan ¬p dari (¬p ∨ q) tanpa dasar valid (langkah inti salah, langkah dicoret-coret), -2 tidak menyadari premis kontradiktif / tidak ada nama aturan
- **A2** (23/25, -2): -2 nama aturan tidak ditulis; rantai benar sampai T (nilai TTS membaik)
- **A3** (23/25, -2): -2 nama aturan tidak ditulis; (p ∧ ¬q) → r → s benar, kesimpulan diperbolehkan masuk terlambat
- **A4** (23/25, -2): -2 nama aturan tidak ditulis; rantai benar sampai V
- **Bd** (23/25, -2): (revisi 0∈ℕ) ∃ benar x=0; -2 alasan ∀ pakai x≥1 tidak konsisten
- **C4** (22/25, -3): -3 bentuk SOP ditulis hanya x'y'z + xy'z' (suku xyz hilang), tapi Σm(1,4,7) dan POS ΠM(0,2,3,5,6) benar

## 672026092 - Satio Bismas (tulisan tangan, kemungkinan "Satio Bismas")
**Inferensi 78 · Kuantor 100 · Aljabar Boolean 94**

- **A1** (10/25, -15): -13 langkah 3 menurunkan p dari (p ∨ q) tanpa ¬q (Silogisme Disjungtif tidak valid), kesimpulan p ∧ s hanya cocok target lewat langkah ini; -2 kontradiksi premis tidak disadari / nama aturan tidak ditulis
- **A2** (23/25, -2): Konjungsi, MP, MP, MP benar, kesimpulan nilai TTS membaik; -2 nama aturan tidak ditulis
- **A3** (22/25, -3): benar sampai "dosen memperbolehkan masuk terlambat"; -2 nama aturan tidak ditulis; -1 premis ke-2 tertulis p ∧ q (kemungkinan ¬q kurang jelas)
- **A4** (23/25, -2): SD (p ∨ t, ¬t → p), SH berantai, MP benar, kesimpulan proyek berjalan lancar; -2 nama aturan tidak ditulis
- **C1** (22/25, -3): gerbang OR, OR + NOT (bubble di D), AND benar; -3 label output tertulis (A+B).(C.D̄) padahal C+D̄; tidak ada evaluasi Y untuk A=1,B=0,C=0,D=0 (lihat RAGU)
- **C2** (24/25, -1): ΠM(0,2,3,4,6) benar, M4 dobel dibuang; -1 "(y'+z)" tertulis, seharusnya (x'+z)
- **C4** (23/25, -2): Σ(1,4,7) dan Π(0,2,3,5,6) benar; -2 ekspresi SOP/POS tidak dituliskan, hanya notasi indeks

Perlu cek manual:
  - A1: bukti pakai langkah SD invalid tapi kesimpulan sama dengan target; premis soal kontradiktif, nilai 10 bisa dinaikkan kalau Azriel menilai lebih longgar
  - C1: tidak ada perhitungan Y untuk A=1,B=0,C=0,D=0; kalau soal meminta nilai Y, potong tambahan sekitar -5 sampai -10

## 672026093 - Indini Citra Kharisma Putri
**Inferensi 76 · Kuantor 100 · Aljabar Boolean 96**

- **A1** (8/25, -17): -13 turunan P/¬P dari "(¬)P ∨ Q" saja tidak valid (disjungsi tidak memberi P atau ¬P), -2 nama aturan tidak ditulis, -2 premis salin tidak konsisten (¬P∧R vs P∧R, tulisan berantakan). Langkah R lalu S (MP) benar.
- **A2** (23/25, -2): rantai benar sampai T (Nilai TTS membaik); -2 nama aturan tidak ditulis.
- **A3** (23/25, -2): (P∧¬Q)→R→S benar, kesimpulan benar; -2 nama aturan tidak ditulis.
- **A4** (22/25, -3): rantai P∨T,¬T→P→Q→R→S→U→V benar; -2 nama aturan tidak ditulis, -1 premis "V→V" salah tulis (maksud U→V).
- **C1** (23/25, -2): Y=1 benar; -2 gerbang NOT D digambar hanya bubble di input OR, bukan gerbang NOT.
- **C2** (23/25, -2): ΠM(0,2,3,4,6) benar; -2 slip tulis (x+z) untuk (y+z) di langkah antara.

Perlu cek manual:
  - A1: tulisan berantakan, premis dan kesimpulan (¬P∧S vs P∧S) tidak jelas terbaca, turunan P/¬P dari disjungsi tampak tidak valid; kalau Azriel menganggap premis kontradiktif membolehkan apa saja, nilai bisa naik.

## 672026094 - ? (hanya tertulis "KIKY" di pojok tiap halaman, kemungkinan panggilan)
**Inferensi 80 · Kuantor 100 · Aljabar Boolean 99**

- **A1** (15/25, -10): -10 mengenali premis kontradiktif (benar) tapi tidak menurunkan apa pun, ¬p ∧ s tidak dibuktikan, hanya menulis "invalid"
- **A2** (19/25, -6): -4 premis 5 ditulis ¬Q padahal "proyektor tidak rusak" = Q, lalu MP dengan P∧¬Q terhadap P∧Q → R (tidak cocok); -2 nama aturan tidak ditulis. Kesimpulan akhir T (nilai TTS membaik) benar dan R→S, S→T benar
- **A3** (23/25, -2): -2 nama aturan tidak ditulis. Kesimpulan "dosen memperbolehkan masuk terlambat" benar, tanpa kata "beberapa" (tidak mengklaim semua)
- **A4** (23/25, -2): -2 nama aturan tidak ditulis. Rantai P∨T,¬T → P → Q → R → S → U → V benar, kesimpulan benar
- **C2** (24/25, -1): -1 judul "POS kanonik (minterm)" salah sebut; ΠM(0,2,3,4,6) benar, tiap maxterm benar

Perlu cek manual:
  - A1: tidak menurunkan kesimpulan ¬p ∧ s, hanya menyatakan kontradiksi dan "tidak dapat dibuktikan konsisten"; kunci menerima kontradiksi + penurunan benar, di sini penurunan tidak ada (nilai 15 bisa naik/turun sesuai kebijakan)
  - A2: premis 5 ditulis ¬Q, namun catatan akhir menyatakan "proyektor tidak rusak berarti berfungsi"; langkah 6 inkonsisten tapi kesimpulan benar

## 672026095 - ?
**Inferensi 86 · Kuantor 98 · Aljabar Boolean 97**

- **A1** (13/25, -12): -12 menurunkan ¬p dari (1) ¬p∨q tanpa dasar (¬q tidak ada, langkah tidak valid); s dan konjungsi akhir ¬p∧s sama dengan kunci; premis kontradiktif tidak disadari
- **A2** (24/25, -1): -1 nama aturan hanya sebagian ditulis; jalur P∧Q → R → S → T benar, kesimpulan "Nilai TTS membaik" benar
- **A3** (24/25, -1): -1 nama aturan tidak ditulis; P∧¬Q → R → S benar, kesimpulan diizinkan masuk terlambat benar
- **Bd** (23/25, -2): (revisi 0∈ℕ) ∃ benar x=0; -2 alasan ∀ pakai x≥1 tidak konsisten
- **C4** (22/25, -3): -2 M5 (101) tertulis (x'+y'+z') padahal seharusnya (x'+y+z'), tapi bentuk akhir benar; -1 daftar baris POS "1,3,6,7" kurang baris 4; SOP Σm(1,4,7) dan POS ΠM(0,2,3,5,6) akhir benar

Perlu cek manual:
  - A1: ¬p diturunkan dari (1) tanpa dasar jelas, label aturan di tulisan tangan tidak terbaca (mungkin dia memakai (4) atau pembacaan lain); nilai 13 bisa naik kalau cara valid

## 672026096 - Septuaginta Clea Gavrila B.
**Inferensi 80 · Kuantor 100 · Aljabar Boolean 89**

- **A1** (10/25, -15): -13 langkah 7 menurunkan ¬p dari (¬p ∨ q) tanpa dasar (Silogisme Disjungtif butuh ¬q; kontradiksi premis p ∧ r vs ¬s tidak disadari); -2 nama aturan tidak ditulis. Kesimpulan akhir kebetulan sama dengan kunci tapi jalurnya tidak valid.
- **A2** (24/25, -1): P, Q -> P∧Q -> R -> S -> T benar, kesimpulan lengkap; -1 nama aturan tidak ditulis.
- **A3** (22/25, -3): rantai P∧¬Q -> R -> S benar; -2 kesimpulan tanpa kata "beberapa" (¬Q dipakai seolah untuk semua), -1 nama aturan tidak ditulis.
- **A4** (24/25, -1): P∨T, ¬T -> P, lalu rantai P->Q->R->S->U->V benar; -1 nama aturan tidak ditulis.
- **C1** (17/25, -8): -8 gerbang NOT untuk D tidak digambar (D masuk langsung ke OR, hanya diberi label C+D'); -0 hasil Y=1 benar.
- **C4** (22/25, -3): SOP Σm(1,4,7) dan POS ΠM(0,2,3,5,6) benar; -2 kalimat pengantar POS menulis "baris 1,3,4,6,7" (seharusnya 0,2,3,5,6), -1 pengantar SOP menulis "baris 2,5,8".

Perlu cek manual:
  - A1: premis kontradiktif; jalur mahasiswa memakai ¬p dari ¬p ∨ q (tidak valid), kesimpulan sama dengan kunci. Nilai 10 mengikuti kunci "SALAH berat".

## 672026098 - ?
**Inferensi 80 · Kuantor 95 · Aljabar Boolean 98**

- **A1** (12/25, -13): ¬p diturunkan dari (1) ¬p∨q tanpa dasar valid (-11, langkah inti tidak valid, kontradiksi dengan ¬s diabaikan); s dari Simplifikasi + MP benar; nama aturan tidak ditulis (-2)
- **A2** (23/25, -2): Konjungsi, MP, MP, MP benar sampai "Nilai TTS membaik"; nama aturan tidak ditulis (-2)
- **A3** (22/25, -3): h ∧ ¬p, MP, MP benar, kesimpulan "dosen memperbolehkan terlambat"; nama aturan tidak ditulis (-2), kata "beberapa" tidak disebut (-1)
- **A4** (23/25, -2): DS, lalu MP berantai sampai V (proyek lancar) benar; nama aturan tidak ditulis (-2)
- **Bc** (20/25, -5): ∀ salah dan nilai tiap x benar; pernyataan ∃x p(x) benar (x=1) tidak ditulis eksplisit (-5)
- **C4** (23/25, -2): SOP Σm(1,4,7) dan POS ΠM(0,2,3,5,6) benar; label minterm salah tulis (m' dan m2 untuk m1 dan m7) (-2)

Perlu cek manual:
  - A1: ¬p diturunkan dari ¬p∨q, tidak jelas alasan siswa (mungkin salah baca premis); kunci menyebut premis kontradiktif, siswa tidak menyinggung

## 672026099 - Yustian Ruben A.
**Inferensi 74 · Kuantor 99 · Aljabar Boolean 98**

- **A1** (10/25, -15): -15 menyimpulkan "tidak dapat disimpulkan" tanpa mengenali premis kontradiktif; hanya menurunkan S lewat MP lalu berhenti, tidak ada bukti ¬p ∧ s.
- **A2** (22/25, -3): -3 tidak ada nama aturan di tiap langkah. Konjungsi, MP, MP, MP benar, kesimpulan T lengkap.
- **A3** (20/25, -5): -3 tidak ada nama aturan; -2 kesimpulan "mahasiswa" tanpa "beberapa". Langkah (P∧¬Q)→S dan MP benar.
- **A4** (22/25, -3): -3 tidak ada nama aturan. Silogisme Disjungtif, MP berantai benar, kesimpulan V benar.
- **Bc** (24/25, -1): -1 slip hitung 3²-4 ditulis 9 (seharusnya 5), tetap dinilai salah, kesimpulan benar.
- **C4** (23/25, -2): -2 SOP kanonik suku pertama ditulis x'y'z' (seharusnya x'y'z), notasi Σm(1,4,7) dan ΠM(0,2,3,5,6) benar.

Perlu cek manual:
  - A1: jawaban "tidak dapat disimpulkan" dengan premis 2 dan 3 dicoret, beda pendekatan dari kunci; tidak menyebut kontradiksi.

## 672026101 - ?
**Inferensi 74 · Kuantor 98 · Aljabar Boolean 92**

- **A1** (8/25, -17): -15 menurunkan ¬p dari (¬p ∨ q) saja (tidak valid, Silogisme Disjungtif butuh ¬q); kontradiksi dengan ¬s tidak disadari. -2 nama aturan tidak ditulis. Simplifikasi dan Modus Ponens (r, s) benar.
- **A2** (22/25, -3): -3 nama aturan tidak ditulis. Rantai Konjungsi, MP, MP benar, kesimpulan "nilai TTS membaik" benar.
- **A3** (22/25, -3): -3 nama aturan tidak ditulis. Konjungsi, MP, MP benar, kesimpulan benar.
- **A4** (22/25, -3): -3 nama aturan tidak ditulis. DS lalu MP berantai sampai v benar.
- **Bd** (23/25, -2): (revisi 0∈ℕ) ∃ benar x=0; -2 semesta ∀ (x≥1) tidak konsisten
- **C2** (22/25, -3): -3 ekspansi suku ketiga (x' + z) tidak ditunjukkan, maxterm (x'+y'+z) muncul tanpa turunan. Hasil ΠM(0,2,3,4,6) benar.
- **C4** (20/25, -5): -3 persamaan SOP hanya menulis 2 suku (xyz hilang), tapi Σm(1,4,7) benar. -2 label maxterm m2 dan m3 di daftar sempat salah ketik, persamaan akhir dan ΠM(0,2,3,5,6) benar.

Perlu cek manual:
  - A1: premis kontradiktif, jawaban menurunkan ¬p dengan langkah tidak valid, kesimpulan akhir sama dengan kunci

## 672026102 - Zohra Huma Aulia
**Inferensi 78 · Kuantor 99 · Aljabar Boolean 88**

- **A1** (6/25, -19): -19 turunkan ¬P dari (1) ¬P∨Q tanpa dasar (langkah tidak valid; P sebenarnya benar dari (3)); premis (4) ¬S tidak dipakai dan kontradiksi premis tidak dikenali. Kesimpulan ¬P∧S kebetulan sama dengan yang diminta.
- **A2** (24/25, -1): -1 nama aturan tidak ditulis. Rantai (P∧Q)→R→S→T benar, kesimpulan lengkap "nilai TTS membaik".
- **A3** (24/25, -1): -1 nama aturan tidak ditulis. P∧¬Q, R, S benar, kesimpulan benar.
- **A4** (24/25, -1): -1 nama aturan tidak ditulis. DS lalu rantai P→Q→R→S→U→V benar, kesimpulan "proyek berjalan lancar".
- **Ba** (24/25, -1): -1 notasi Q(x) dan K(x) tercampur untuk predikat yang sama. Berkuantor dan negasi (∀x(P→¬K), "tidak ada pejabat yang korupsi") benar.
- **C1** (15/25, -10): -10 gambar rangkaian tanpa gerbang NOT pada D (D langsung masuk OR, hanya diberi label C+D'). Hasil Y=1 benar.
- **C4** (23/25, -2): -2 baris "f = (x'y'z)+(xy'z')" kehilangan suku xyz (Σm(1,4,7) sesudahnya benar). POS ΠM(0,2,3,5,6) benar.

Perlu cek manual:
  - A1: soal premis kontradiktif, jawaban mahasiswa memakai langkah ¬P dari (1) yang tidak valid walau hasil akhir sama dengan kunci. Nilai 6 bisa dinaikkan kalau Azriel menilai lebih longgar.

## 672026104 - Andrew Chrystian
**Inferensi 79 · Kuantor 77 · Aljabar Boolean 100**

- **A1** (10/25, -15): -12 langkah ¬P∨Q lalu ∴ ¬P tidak valid (butuh ¬Q, tidak ada); -3 premis (4) ¬S tidak dipakai, kontradiksi tidak disadari. Langkah lain (Simplifikasi, MP, Konjungsi) benar.
- **A2** (23/25, -2): -2 nama aturan tidak ditulis. Rantai Konjungsi, MP, MP, MP benar, kesimpulan "nilai TTS membaik" lengkap.
- **A3** (23/25, -2): -2 nama aturan tidak ditulis. Konjungsi, MP, MP benar, kesimpulan memuat "beberapa siswa".
- **A4** (23/25, -2): -2 nama aturan tidak ditulis. DS, lalu MP berantai sampai V benar.
- **Ba** (24/25, -1): -1 P(x) tidak didefinisikan eksplisit. ∃x P(x) dan negasi ∀x ¬P(x) (semesta pejabat) benar.
- **Bb** (4/25, -21): -21 semesta diganti jadi kelipatan 5 sehingga ∀ dijawab True (kunci False, contoh penyangkal 1,3,7) dan ∃ dijawab False dengan alasan "semua x benar" (kunci True; alasan juga kontradiktif, ∀ benar berarti ∃ benar).
- **Bc** (24/25, -1): -1 alasan kurang rapi ("x≥0", "jadi x<0"). ∀ False, ∃ True (x=1) benar.

## 672026105 - ?
**Inferensi 96 · Kuantor 88 · Aljabar Boolean 98**

- **A2** (23/25, -2): -2 Modus Ponens/Silogisme Hipotetis tidak dinamai; konjungsi (premis 4,5) dinamai. Kesimpulan T benar
- **A3** (23/25, -2): -2 Konjungsi (3+4) dan Modus Ponens tidak dinamai. Kesimpulan D benar
- **Bb** (17/25, -8): -8 ∀ salah dan ∃ benar sudah benar tapi dua-duanya tanpa contoh (wajib contoh)
- **Bc** (21/25, -4): -4 ∀ salah dan ∃ benar sudah benar, alasan umum tanpa menyebut nilai (x=1 memenuhi, x=2/3 tidak)
- **C1** (24/25, -1): -1 label "C+D" di gambar tanpa bar. Gerbang OR, NOT di D, AND benar, Y=1 benar
- **C2** (24/25, -1): -1 slip tulis "(x+y)" seharusnya "(x+y')" di baris awal; langkah berikutnya benar. ΠM(0,2,3,4,6) benar

Perlu cek manual:
  - A1: bukti pakai Ex Falso Quodlibet setelah menunjukkan M dan ¬M. Valid secara logika (premis kontradiktif), tapi bukan aturan di materi inferensi. Sudah dinaikkan ke penuh (cara beda valid).
