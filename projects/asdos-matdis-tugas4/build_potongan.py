import re,glob,os
out=["# Penjelasan Potongan Nilai Tugas 4 Matdis","",
"Hanya soal yang kena potongan yang ditampilkan (nilai < 25). Soal yang tidak disebut = nilai penuh 25/25.",
"Tiap materi = 4 soal x 25. A = Inferensi, B = Kuantor, C = Aljabar Boolean.","",
"Kebijakan Bd: 0 termasuk bilangan asli, jadi ∃ benar (x=0). Jawaban ∃ salah (asli mulai 1) untuk sekarang juga tetap penuh.",""]
bad=[]
for p in sorted(glob.glob('results/*.md')):
    s=open(p,encoding='utf-8').read()
    nim=os.path.basename(p)[:-3]
    title=s.splitlines()[0].lstrip('# ').strip()
    a,b,c=map(int,re.search(r'^\| (\d+) \| (\d+) \| (\d+) \|$',s,re.M).groups())
    items=re.findall(r'^- ([ABC][1-4a-d]) (\d+)/25:\s*(.*)$',s,re.M)
    sums={'A':0,'B':0,'C':0}
    for q,sc,_ in items: sums[q[0]]+=int(sc)
    if (sums['A'],sums['B'],sums['C'])!=(a,b,c) and len(items)==12:
        bad.append(f"{nim}: tabel {a}/{b}/{c} vs jumlah soal {sums['A']}/{sums['B']}/{sums['C']}")
    out.append(f"## {title}")
    out.append(f"**Inferensi {a} · Kuantor {b} · Aljabar Boolean {c}**")
    out.append("")
    ded=[(q,int(sc),t) for q,sc,t in items if int(sc)<25]
    if not ded: out.append("- Tidak ada potongan.")
    for q,sc,t in ded: out.append(f"- **{q}** ({sc}/25, -{25-sc}): {t}")
    if len(items)<12:
        have={q for q,_,_ in items}
        miss=[q for q in ['A1','A2','A3','A4','Ba','Bb','Bc','Bd','C1','C2','C3','C4'] if q not in have]
        out.append(f"- Soal tidak ada di rincian: {', '.join(miss)} (lihat file results).")
    rg=re.search(r'^## RAGU\n(.*?)(?=^## |\Z)',s,re.M|re.S)
    if rg:
        lines=[l for l in rg.group(1).strip().splitlines() if l.strip() not in ('-','- -') and not (l.startswith('- Bd') and '0' in l and ('asli' in l or 'ℕ' in l or 'N' in l))]
        if lines:
            out.append("")
            out.append("Perlu cek manual:")
            out+= ["  "+l for l in lines]
    out.append("")
open('penjelasan-potongan.md','w',encoding='utf-8').write("\n".join(out))
print("mismatch:",bad or "none")

# Rata-rata untuk Google Classroom, dari tabel nilai.md
rows=[]
for line in open('nilai.md',encoding='utf-8'):
    m=re.match(r'^\| (\d{9}) \| ([^|]+)\| (\d+) \| (\d+) \| (\d+) \|$',line.rstrip())
    if m:
        a,b,c=int(m[3]),int(m[4]),int(m[5])
        avg=(a+b+c)/3
        rows.append((m[1],m[2].strip(),a,b,c,avg))
o=["# Rata-rata Nilai Tugas 4 Matdis (untuk Google Classroom)","",
   "Rata-rata = (Inferensi + Kuantor + Aljabar Boolean) / 3. Kolom Classroom = dibulatkan ke bilangan bulat terdekat.","",
   "| NIM | Nama | Inferensi | Kuantor | Aljabar Boolean | Rata-rata | Classroom |","|---|---|---|---|---|---|---|"]
for nim,nama,a,b,c,avg in rows:
    o.append(f"| {nim} | {nama} | {a} | {b} | {c} | {avg:.2f} | {int(avg+0.5)} |")
open('rata-rata.md','w',encoding='utf-8').write("\n".join(o)+"\n")
print("rata-rata rows:",len(rows))
