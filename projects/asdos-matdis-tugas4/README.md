# Asdos Matdis - Penilaian Tugas 4 (Inferensi, Kuantor, Aljabar Boolean)

Trigger: Azriel bilang "tugas 4 matdis", "lanjut nilai tugas 4", "ada yang baru ngumpulin tugas 4".

## Lokasi

- Kumpulan tugas mahasiswa: `C:\Users\afw14\OneDrive\Documents\Kuliah S1 TI\ASDOS\MATDIS\Tugas 4\` (file `TUGAS 4_<NIM>.pdf`, nama file tidak seragam)
- Soal: `C:\Users\afw14\Downloads\Chrome Downloads\Tugas 4 (Inferensi, Kuantor & Aljabar Boolean).pdf`
- Materi: `INFERENSI.pdf`, `KUANTOR.pdf`, `MATERI 7 Aljabar Boolean (1).pdf`, RPS `RPS OBE 2026 FTI S1 TI - TC511-Matematika Diskrit.pdf` (semua di `Downloads\Chrome Downloads\`)
- Kunci + rubrik: [kunci.md](kunci.md)
- Hasil per mahasiswa: `results/<NIM>.md` (satu file = satu mahasiswa sudah dinilai)
- Rekap nilai: [nilai.md](nilai.md)

## Cara lanjut (mahasiswa yang baru mengumpulkan)

1. List PDF di folder Tugas 4, bandingkan dengan `results/`. NIM yang belum punya file results = belum dinilai.
2. Tiap mahasiswa baru: 1 subagent Sonnet, effort medium, prompt sama seperti di bawah (ganti path + NIM).
3. Setelah selesai, update tabel di `nilai.md` (urut NIM) + daftar RAGU.
4. Jalankan `python build_potongan.py` dari folder ini untuk membuat ulang `penjelasan-potongan.md` (semua potongan per mahasiswa dalam satu file). Script juga cek jumlah per soal = nilai tabel.

## Prompt subagent (template)

> Kamu menilai tugas Matematika Diskrit satu mahasiswa. Baca rubrik `projects/asdos-matdis-tugas4/kunci.md` dulu (wajib ikuti). Lalu baca PDF tugas `<PATH>` (semua halaman, pakai Read dengan parameter pages; tulisan tangan dibaca teliti). Nilai materi A (Inferensi), B (Kuantor), C (Aljabar Boolean) masing-masing 1-100 (4 soal x 25). Tulis hasil ke `projects/asdos-matdis-tugas4/results/<NIM>.md` dengan format di README. Balas satu baris: `NIM | Nama | A | B | C | RAGU: ...`.

## Format results/<NIM>.md

```
# <NIM> - <Nama dari PDF, atau "?" kalau tidak ada>
File: <nama file>

| Inferensi | Kuantor | Aljabar Boolean |
|---|---|---|
| n | n | n |

## Rincian
- A1 x/25: alasan potongan singkat
- ... (A1-A4, Ba-Bd, C1-C4)

## RAGU
- <soal>: <kenapa ragu> (atau "-" kalau tidak ada)

## Catatan
- (opsional: halaman tak terbaca, jawaban mirip, dll)
```

## Status

Lihat `nilai.md`. Kunci A1 premisnya kontradiktif (r → s, r, ¬s), jadi jawaban A1 paling sering beda pendekatan.
