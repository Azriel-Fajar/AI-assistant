import csv, math

with open('data.csv', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))
vals = [int(r['Total_semua']) for r in rows]
n = len(vals); lo, hi = min(vals), max(vals); rng = hi - lo
k = 8; c = 11
classes = []
start = lo
for i in range(k):
    a, b = start, start + c - 1
    f_ = sum(1 for v in vals if a <= v <= b)
    classes.append(dict(a=a, b=b, llo=a-0.5, lhi=b+0.5, mid=(a+b)/2, f=f_))
    start += c
cum = 0
for cl in classes:
    cum += cl['f']; cl['cum'] = cum; cl['rel'] = cl['f']/n

# ---------- SVG helpers ----------
W, H = 700, 380
ML, MR, MT, MB = 60, 20, 20, 55
PW, PH = W-ML-MR, H-MT-MB

def yax(maxv, step):
    ticks = list(range(0, maxv+1, step))
    s = ''
    for t in ticks:
        y = MT + PH - PH*t/maxv
        s += f'<line x1="{ML}" y1="{y:.1f}" x2="{W-MR}" y2="{y:.1f}" stroke="#e2e8f0"/>'
        s += f'<text x="{ML-8}" y="{y+4:.1f}" text-anchor="end" font-size="12" fill="#475569">{t}</text>'
    return s

def frame(title_y, title_x):
    return (f'<line x1="{ML}" y1="{MT}" x2="{ML}" y2="{MT+PH}" stroke="#334155"/>'
            f'<line x1="{ML}" y1="{MT+PH}" x2="{W-MR}" y2="{MT+PH}" stroke="#334155"/>'
            f'<text x="{ML+PW/2}" y="{H-8}" text-anchor="middle" font-size="13" fill="#334155">{title_x}</text>'
            f'<text x="16" y="{MT+PH/2}" text-anchor="middle" font-size="13" fill="#334155" transform="rotate(-90 16 {MT+PH/2})">{title_y}</text>')

fmax = 70  # y max histogram/polygon
# Histogram: x by class index, bars touch
def histogram():
    s = yax(fmax, 10)
    bw = PW/k
    for i, cl in enumerate(classes):
        h = PH*cl['f']/fmax
        x = ML + i*bw
        s += f'<rect x="{x:.1f}" y="{MT+PH-h:.1f}" width="{bw:.1f}" height="{h:.1f}" fill="#3b82f6" stroke="#1e40af"/>'
        if cl['f']:
            s += f'<text x="{x+bw/2:.1f}" y="{MT+PH-h-5:.1f}" text-anchor="middle" font-size="11" fill="#1e293b">{cl["f"]}</text>'
        s += f'<text x="{x+bw/2:.1f}" y="{MT+PH+18}" text-anchor="middle" font-size="12" fill="#475569">{cl["mid"]:g}</text>'
    s += frame('Frequency', 'Middle Value (number of universities)')
    return f'<svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg">{s}</svg>'

def polygon():
    s = yax(fmax, 10)
    bw = PW/k
    pts = [(ML - bw/2 + bw*0, 0)]  # virtual class before: mid - c at f=0 -> x at -0.5 bw... build below
    coords = []
    # virtual leading point
    coords.append((ML - bw/2 + bw*0.0, MT+PH))  # x = ML - bw/2 clipped; use ML
    coords = [(ML, MT+PH)]
    for i, cl in enumerate(classes):
        x = ML + i*bw + bw/2
        y = MT + PH - PH*cl['f']/fmax
        coords.append((x, y))
    coords.append((W-MR, MT+PH))
    path = ' '.join(f'{x:.1f},{y:.1f}' for x, y in coords)
    s += f'<polyline points="{path}" fill="none" stroke="#dc2626" stroke-width="2"/>'
    for i, cl in enumerate(classes):
        x = ML + i*bw + bw/2
        y = MT + PH - PH*cl['f']/fmax
        s += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4" fill="#dc2626"/>'
        s += f'<text x="{x:.1f}" y="{MT+PH+18}" text-anchor="middle" font-size="12" fill="#475569">{cl["mid"]:g}</text>'
        if cl['f']:
            s += f'<text x="{x:.1f}" y="{y-8:.1f}" text-anchor="middle" font-size="11" fill="#1e293b">{cl["f"]}</text>'
    s += frame('Frequency', 'Middle Value (number of universities)')
    return f'<svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg">{s}</svg>'

def ogive():
    s = yax(120, 20)
    xs = [classes[0]['llo']] + [cl['lhi'] for cl in classes]
    ys = [0] + [cl['cum'] for cl in classes]
    def X(v): return ML + PW*(v - xs[0])/(xs[-1]-xs[0])
    def Y(v): return MT + PH - PH*v/120
    path = ' '.join(f'{X(x):.1f},{Y(y):.1f}' for x, y in zip(xs, ys))
    s += f'<polyline points="{path}" fill="none" stroke="#059669" stroke-width="2"/>'
    for x, y in zip(xs, ys):
        s += f'<circle cx="{X(x):.1f}" cy="{Y(y):.1f}" r="4" fill="#059669"/>'
        s += f'<text x="{X(x):.1f}" y="{Y(y)-8:.1f}" text-anchor="middle" font-size="11" fill="#1e293b">{y}</text>'
        s += f'<text x="{X(x):.1f}" y="{MT+PH+18}" text-anchor="middle" font-size="11" fill="#475569">{x:g}</text>'
    s += frame('Cumulative Frequency', 'Upper Class Limit')
    return f'<svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg">{s}</svg>'

# ---------- tables ----------
def freq_rows():
    out = ''
    for cl in classes:
        out += (f"<tr><td>{cl['a']} &ndash; {cl['b']}</td><td>{cl['llo']:g} &ndash; {cl['lhi']:g}</td>"
                f"<td>{cl['mid']:g}</td><td>{cl['f']}</td></tr>")
    out += f"<tr class='tot'><td colspan='3'>Total</td><td>{n}</td></tr>"
    return out

def rel_rows():
    out = ''
    for cl in classes:
        out += (f"<tr><td>{cl['a']} &ndash; {cl['b']}</td><td>{cl['f']}</td>"
                f"<td>{cl['f']}/{n}</td><td>{cl['rel']*100:.2f}%</td></tr>")
    out += f"<tr class='tot'><td>Total</td><td>{n}</td><td>&nbsp;</td><td>100.00%</td></tr>"
    return out

def cum_rows():
    out = ''
    for cl in classes:
        out += (f"<tr><td>{cl['a']} &ndash; {cl['b']}</td><td>{cl['f']}</td>"
                f"<td>&le; {cl['lhi']:g}</td><td>{cl['cum']}</td><td>{cl['cum']/n*100:.2f}%</td></tr>")
    return out

PROV_ABBR = {'Prov. Banten':'Banten', 'Prov. D.I. Yogyakarta':'DIY', 'Prov. D.K.I. Jakarta':'DKI',
             'Prov. Jawa Barat':'Jabar', 'Prov. Jawa Tengah':'Jateng', 'Prov. Jawa Timur':'Jatim'}
def raw_table():
    cells = [f"<tr><td>{i+1}</td><td>{r['Kabupaten_kota']}, {PROV_ABBR[r['Provinsi']]}</td><td>{r['Total_semua']}</td></tr>" for i, r in enumerate(rows)]
    third = math.ceil(len(cells)/4)
    cols = [cells[i*third:(i+1)*third] for i in range(4)]
    inner = ''.join(f"<table class='raw'><tr><th>No</th><th>Region</th><th>Total</th></tr>{''.join(cc)}</table>" for cc in cols)
    return f"<div class='rawwrap'>{inner}</div>"

html = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Frequency Distribution Analysis</title>
<style>
@page {{ size: A4; margin: 0; }}
* {{ margin:0; padding:0; box-sizing:border-box; }}
body {{ font-family: Georgia, 'Times New Roman', serif; color:#1e293b; }}
.page {{ width:210mm; min-height:297mm; padding:22mm 20mm; page-break-after: always; }}
.page:last-child {{ page-break-after: auto; }}
h1 {{ font-size:26px; margin-bottom:6px; }}
h2 {{ font-size:19px; margin:0 0 12px; padding-bottom:6px; border-bottom:2px solid #3b82f6; }}
h3 {{ font-size:15px; margin:16px 0 8px; }}
p, li {{ font-size:13.5px; line-height:1.65; margin-bottom:9px; text-align:justify; }}
ul, ol {{ margin:0 0 10px 22px; }}
table {{ border-collapse:collapse; width:100%; margin:8px 0 12px; font-size:12.5px; }}
th, td {{ border:1px solid #94a3b8; padding:5px 8px; text-align:center; }}
th {{ background:#dbeafe; }}
tr.tot td {{ font-weight:bold; background:#f1f5f9; }}
.formula {{ background:#f8fafc; border-left:3px solid #3b82f6; padding:7px 14px; margin:7px 0 10px; font-size:13px; font-family:'Cambria Math', Georgia, serif; }}
svg {{ width:100%; height:auto; margin:4px 0 14px; }}
.cover {{ display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; }}
.cover h1 {{ font-size:30px; margin:18px 0 8px; }}
.cover p {{ text-align:center; }}
.members {{ margin:34px 0; font-size:16px; line-height:2.1; }}
.rawwrap {{ display:flex; gap:6px; justify-content:space-between; }}
.raw {{ font-size:8px; margin:4px 0; width:auto; flex:0 1 auto; }}
.raw td, .raw th {{ padding:1.5px 2.5px; white-space:nowrap; }}
.raw td:nth-child(2) {{ text-align:left; }}
figcaption {{ text-align:center; font-size:12px; color:#475569; margin-bottom:14px; }}
.small {{ font-size:12px; color:#475569; }}
</style></head><body>

<div class="page cover">
  <p style="font-size:15px; letter-spacing:2px;">FINAL PROJECT</p>
  <h1>Frequency Distribution Analysis</h1>
  <p style="font-size:16px; margin-top:4px;">Number of Higher Education Institutions by Regency/City in Java, Indonesia (2024)</p>
  <div class="members">
    <b>Group Members</b><br>
    Azriel Fajar Wicaksono &ndash; 672025121<br>
    Cynthia Elena Gunadi &ndash; 672025001<br>
    Archyeza Gaciyama Feodora &ndash; 672025174
  </div>
  <p>Probability and Statistics<br>Faculty of Information Technology<br>Universitas Kristen Satya Wacana<br>2026</p>
</div>

<div class="page">
  <h2>1. Data Collection</h2>
  <h3>1.1 Data Source</h3>
  <p>The data used in this project is the <b>number of higher education institutions (universities) per regency/city (kabupaten/kota)</b> in Indonesia in 2024, published by the Indonesian government open data portal:</p>
  <p class="small">Source: data.go.id &ndash; &ldquo;Jumlah Perguruan Tinggi menurut Akreditasi dan Wilayah, Tahun 2024&rdquo;<br>
  https://data.go.id/dataset/dataset/jumlah-perguruan-tinggi-menurut-akreditasi-2024</p>
  <p>The quantitative variable analyzed is the total number of higher education institutions (both under Kemendikbudristek and non-Kemendikbudristek) in each regency/city. The observation unit is one regency/city. The dataset covers the provinces of Banten, D.I. Yogyakarta, D.K.I. Jakarta, Jawa Barat, Jawa Tengah, and Jawa Timur, giving <b>n = {n} observations</b>, which satisfies the minimum requirement of 100 observations.</p>
  <h3>1.2 Raw Data ({n} observations)</h3>
  {raw_table()}
</div>

<div class="page">
  <h2>2. Frequency Distribution Table</h2>
  <h3>2.1 Constructing the Table (Sturges&rsquo; Method)</h3>
  <p><b>Step 1.</b> Highest value = <b>{hi}</b> (Kota Surabaya), lowest value = <b>{lo}</b>. Range = {hi} &minus; {lo} = <b>{rng}</b>.</p>
  <p><b>Step 2.</b> Number of class intervals using Sturges&rsquo; formula:</p>
  <div class="formula">k = 1 + 3.322 log n = 1 + 3.322 log {n} = 1 + 3.322 (2.0682) = 7.8705 &asymp; <b>8 classes</b> (rounded up)</div>
  <p><b>Step 3.</b> Width of class interval:</p>
  <div class="formula">c = (highest &minus; lowest) / k = ({hi} &minus; {lo}) / 8 = 10.5 &asymp; <b>11</b> (rounded up so all data fits)</div>
  <p><b>Step 4.</b> The lowest class limit is the lowest value, 1, so the first class is 1 &ndash; 11 with class limits 0.5 &ndash; 11.5. With 8 classes of width 11, the last class is 78 &ndash; 88 (77.5 &ndash; 88.5), which covers the maximum value 85. All {n} observations are accommodated.</p>
  <h3>2.2 Frequency Distribution Table</h3>
  <table>
    <tr><th>Class Interval</th><th>Class Limits</th><th>Middle Value</th><th>Frequency</th></tr>
    {freq_rows()}
  </table>
  <h3>2.3 Relative Frequency Table</h3>
  <table>
    <tr><th>Class Interval</th><th>Frequency</th><th>Relative Frequency</th><th>Percentage</th></tr>
    {rel_rows()}
  </table>
</div>

<div class="page">
  <h3>2.4 Cumulative Frequency Table</h3>
  <table>
    <tr><th>Class Interval</th><th>Frequency</th><th>Less Than</th><th>Cumulative Frequency</th><th>Cumulative %</th></tr>
    {cum_rows()}
  </table>
  <h2>3. Data Visualization</h2>
  <h3>3.1 Histogram</h3>
  {histogram()}
  <figcaption>Figure 1. Histogram of the number of universities per regency/city</figcaption>
</div>

<div class="page">
  <h3>3.2 Frequency Polygon</h3>
  {polygon()}
  <figcaption>Figure 2. Frequency polygon (line through class middle values)</figcaption>
  <h3>3.3 Ogive (Cumulative Frequency Curve)</h3>
  {ogive()}
  <figcaption>Figure 3. Less-than ogive plotted at upper class limits</figcaption>
</div>

<div class="page">
  <h2>4. Descriptive Analysis</h2>
  <h3>4.1 Minimum, Maximum, and Range</h3>
  <ul>
    <li><b>Minimum = {lo}</b> university (Kab. Kulon Progo, Kab. Pangandaran, Kab. Madiun, Kota Probolinggo).</li>
    <li><b>Maximum = {hi}</b> universities (Kota Surabaya), followed by Kota Bandung, Kota Jakarta Selatan, and Kota Jakarta Timur with 78 each.</li>
    <li><b>Range = {hi} &minus; {lo} = {rng}</b>, a very wide spread relative to typical values.</li>
  </ul>
  <h3>4.2 Distribution Shape</h3>
  <p>The distribution is <b>strongly right-skewed (positively skewed)</b>. The histogram shows the tallest bar at the first class (1 &ndash; 11) with 69 regencies/cities (58.97% of all observations), frequencies falling off rapidly, and a long thin tail stretching to the right. Two classes in the tail (56 &ndash; 66 and 67 &ndash; 77) are even empty before a small cluster of 4 extreme values appears in the last class (78 &ndash; 88).</p>
  <p>The ogive confirms this: it rises very steeply at the beginning and flattens quickly &mdash; 99 of {n} regions (84.62%) already have 22 or fewer universities, and 107 regions (91.45%) have 33 or fewer.</p>
  <h3>4.3 Key Insights</h3>
  <ol>
    <li><b>Higher education is highly concentrated.</b> The majority of regencies/cities (58.97%) host at most 11 institutions, while a handful of large cities host dozens.</li>
    <li><b>The extreme values are all major metropolitan cities</b>: Surabaya (85), Bandung (78), Jakarta Selatan (78), and Jakarta Timur (78). These are outliers far from the rest of the data, creating the isolated last class in the histogram.</li>
    <li><b>Kabupaten vs Kota gap.</b> Nearly all high-frequency regions in the upper classes are cities (kota), while regencies (kabupaten) dominate the lowest class, showing that university access is centered in urban areas.</li>
    <li><b>Consequence of skewness.</b> Because of the strong right skew, the mean would be pulled well above the median; the median or mode is a more representative measure of a &ldquo;typical&rdquo; regency/city than the mean for this data.</li>
  </ol>
  <h3>4.4 Conclusion</h3>
  <p>Using Sturges&rsquo; formula, the {n} observations were grouped into 8 classes of width 11. The frequency distribution, histogram, frequency polygon, and ogive all show a strongly right-skewed distribution: most regencies/cities in Java have very few higher education institutions, while a small number of metropolitan cities concentrate most of them. This reflects the real-world centralization of higher education in Indonesia&rsquo;s big cities.</p>
</div>

</body></html>"""

with open('report.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('report.html written, n =', n)
