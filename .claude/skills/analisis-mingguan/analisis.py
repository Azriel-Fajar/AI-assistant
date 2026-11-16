"""Weekly numbers for @intipbaliknya, from stats.js output. Run in shorts/:

  python3.13 ../.claude/skills/analisis-mingguan/analisis.py log/yt-<yyyy-mm-dd>.json

Prints markdown: week totals vs the stats file from ~7 days earlier, dead videos, a per-video table, and median
engaged views / % watched per title pattern, core-title length and upload hour. Groups use only videos at least
3 days old with analytics, since YouTube Analytics lags 2-3 days.
"""
import glob, json, os, re, statistics as st, sys
from datetime import datetime, timedelta, timezone

sys.stdout.reconfigure(encoding='utf-8')
path = sys.argv[1]
now_d = json.load(open(path, encoding='utf-8'))
now = datetime.fromisoformat(now_d['checked'].replace('Z', '+00:00'))
WIB = timezone(timedelta(hours=7))


def core(t):
    return re.sub(r'#\w+', '', t).strip()


def pattern(t):
    c = core(t).lower()
    if c.startswith(('ini yang', 'ini arti', 'ini yang dilakukan')): return 'ini yang terjadi'
    if c.startswith(('rahasia', 'ternyata')): return 'rahasia/ternyata'
    if ' atau ' in c and c.endswith('?'): return 'pilihan'
    if c.endswith('?') or c.startswith(('kenapa', 'benarkah', 'apakah', 'mengapa')): return 'pertanyaan'
    if c.startswith('bukan '): return 'bukan ... (flip)'
    return 'pernyataan'


# Slug of each video, matched by YouTube title in out/**/upload.md (spacing may differ).
slugs = {}
for u in glob.glob('out/*/upload.md') + glob.glob('out/*/*/upload.md'):
    m = re.search(r'## YouTube\s*```[a-z]*\s*\n(.+)', open(u, encoding='utf-8').read())
    if m:
        slugs[re.sub(r'\s+', ' ', m.group(1).strip())] = os.path.dirname(u).replace('\\', '/')

vids = []
for v in now_d['videos']:
    if v['status'] != 'public':
        continue
    pub = datetime.fromisoformat(v['published'].replace('Z', '+00:00'))
    a = v.get('analytics') or {}
    vids.append(dict(
        id=v['id'], title=v['title'], age=(now - pub).total_seconds() / 86400, wib=pub.astimezone(WIB),
        views=v['views'], likes=v['likes'], comments=v['comments'], eng=a.get('engagedViews'),
        pct=a.get('avgViewPercent'), ret=(a.get('retention') or {}), subs=a.get('subscribersGained'),
        pat=pattern(v['title']), clen=len(core(v['title'])),
        slug=slugs.get(re.sub(r'\s+', ' ', v['title'].strip()), '?')))

# Week totals against the stats file closest to 7 days before this one.
prev = None
for p in sorted(glob.glob(os.path.join(os.path.dirname(path) or '.', 'yt-*.json'))):
    d = re.search(r'yt-(\d{4}-\d{2}-\d{2})', p)
    if d and datetime.fromisoformat(d.group(1)).date() <= (now - timedelta(days=6)).date():
        prev = p
print(f"# Angka {now.astimezone(WIB):%Y-%m-%d}\n")
total = sum(v['views'] for v in vids)
print(f"- Subscriber: {now_d['subscribers']}, video publik: {len(vids)}, total views: {total}")
if prev:
    pd = json.load(open(prev, encoding='utf-8'))
    ptotal = sum(v['views'] for v in pd['videos'])
    new = [v for v in vids if v['age'] <= 7]
    print(f"- Dibanding {os.path.basename(prev)}: views +{total - ptotal}, subscriber +{now_d['subscribers'] - pd['subscribers']}, video baru {len(new)}")
else:
    print('- Belum ada file stats ~7 hari lalu untuk dibandingkan')

dead = [v for v in vids if v['age'] >= 2 and v['views'] < 50]
print(f"\n## Video mati (umur >=2 hari, <50 views): {len(dead)}")
for v in dead:
    print(f"- {v['id']} {v['views']} views, {v['age']:.0f} hari: {v['title']}")

print('\n## Per video (terbaru dulu)\n')
print('| umur | id | views | engaged | %tonton | ret 25/50/end | like | kom | pola | len | jam | slug | judul |')
print('|---|---|---|---|---|---|---|---|---|---|---|---|---|')
for v in sorted(vids, key=lambda v: v['age']):
    r = v['ret']
    rs = f"{r.get('25%')}/{r.get('50%')}/{r.get('end')}" if r else '-'
    print(f"| {v['age']:.1f} | {v['id']} | {v['views']} | {v['eng'] if v['eng'] is not None else '-'} | {v['pct'] if v['pct'] is not None else '-'} | {rs} | {v['likes']} | {v['comments']} | {v['pat']} | {v['clen']} | {v['wib']:%a %H:%M} | {v['slug']} | {core(v['title'])} |")

ok = [v for v in vids if v['age'] >= 3 and v['eng'] is not None and v not in dead]


def groups(name, key):
    g = {}
    for v in ok:
        g.setdefault(key(v), []).append(v)
    print(f'\n## Per {name} (umur >=3 hari, tanpa video mati, n={len(ok)})\n')
    print('| grup | n | median engaged | median views | median %tonton | like rate |')
    print('|---|---|---|---|---|---|')
    for k, l in sorted(g.items(), key=lambda kv: -st.median(x['eng'] for x in kv[1])):
        print(f"| {k} | {len(l)} | {st.median(x['eng'] for x in l):.0f} | {st.median(x['views'] for x in l):.0f} | "
              f"{st.median(x['pct'] for x in l):.1f} | {st.mean(x['likes'] / x['views'] for x in l if x['views']):.3f} |")


groups('pola judul', lambda v: v['pat'])
groups('panjang judul inti', lambda v: '<=50' if v['clen'] <= 50 else '51-62' if v['clen'] <= 62 else '>62')
groups('jam upload WIB', lambda v: f"{v['wib']:%H}:00")
