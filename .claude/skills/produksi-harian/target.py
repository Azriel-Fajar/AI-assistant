"""Prints only what a produksi-harian session needs from the plan, so it never reads the whole plan table.

Run from shorts/:
  python3.13 ../.claude/skills/produksi-harian/target.py film      -> today's target row + its idea block, missed rows,
                                                                       unmade count, last 5 hooks, last 5 YouTube titles
  python3.13 ../.claude/skills/produksi-harian/target.py riset 10  -> the next 10 plan rows without an idea block
  python3.13 ../.claude/skills/produksi-harian/target.py gaps 5    -> how many of the next 5 films have no idea block
"""
import glob, json, os, re, sys
from datetime import date, datetime, timedelta

sys.stdout.reconfigure(encoding='utf-8')
today = datetime.now().date()
# Films are made in the afternoon (15:30 since 10 Nov 2026, Azriel) for tomorrow's uploads, so from 12:00 on
# the target starts at tomorrow's rows; today's slots are already past.
start = today + timedelta(days=1) if datetime.now().hour >= 12 else today


def plan_rows():
    rows = []
    for f in sorted(glob.glob('ide/jadwal-*.md')):
        y, m = map(int, re.search(r'jadwal-(\d{4})-(\d{2})', f).group(1, 2))
        for line in open(f, encoding='utf-8'):
            if line.startswith('## Pendataan'):
                break
            c = [x.strip() for x in line.strip().strip('|').split('|')]
            d = re.match(r'^\w{3} (\d{1,2})$', c[0]) if len(c) >= 8 else None
            if d and re.match(r'^[a-z0-9-]+$', c[2]):
                rows.append(dict(date=date(y, m, int(d.group(1))), jam=c[1], slug=c[2], status=c[7], line=line.strip()))
    return sorted(rows, key=lambda r: (r['date'], r['jam']))


def log_status():
    st = {}
    for line in open('ide/log.md', encoding='utf-8'):
        c = [x.strip() for x in line.strip().strip('|').split('|')]
        if len(c) >= 6 and re.match(r'^\d{4}-\d{2}-\d{2}$', c[0]):
            st[c[2]] = c[5]
    return st


def blocks():
    """slug -> (file, block text) for saran blocks from the last 30 days."""
    out = {}
    for f in sorted(glob.glob('ide/saran-*.md')):
        d = date.fromisoformat(re.search(r'saran-(\d{4}-\d{2}-\d{2})', f).group(1))
        if (today - d).days > 30:
            continue
        for part in re.split(r'\n(?=### )', open(f, encoding='utf-8').read()):
            s = re.search(r'Slug: ([a-z0-9-]+)\.', part)
            if s and part.startswith('### '):
                out[s.group(1)] = (f, part.split('\n## ')[0].strip())
    return out


rows, st, bl = plan_rows(), log_status(), blocks()
mode = sys.argv[1] if len(sys.argv) > 1 else 'film'

if mode == 'gaps':
    # run.ps1 asks this before the films: how many of the next N films have no idea block yet.
    n = int(sys.argv[2]) if len(sys.argv) > 2 else 5
    todo = [r for r in rows if r['date'] >= start and st.get(r['slug']) != 'dibuat'][:n]
    print(sum(1 for r in todo if r['slug'] not in bl))
    sys.exit()

if mode == 'riset':
    n = int(sys.argv[2]) if len(sys.argv) > 2 else 10
    todo = [r for r in rows if r['date'] >= start and r['slug'] not in bl and st.get(r['slug']) != 'dibuat']
    print(f'TODAY {today}  plan rows without a block from {start}: {len(todo)}  showing {min(n, len(todo))}')
    for r in todo[:n]:
        print(r['line'])
    sys.exit()

unmade = [r for r in rows if r['date'] >= start and st.get(r['slug']) != 'dibuat']
missed = [r for r in rows if r['date'] < today and st.get(r['slug']) not in ('dibuat', 'ditunda', 'ditolak')]
print(f'TODAY {today}  unmade plan rows from {start}: {len(unmade)}')
for r in missed:
    print(f'MISSED (mark ditunda): {r["date"]} {r["jam"]} {r["slug"]}')
if not unmade:
    print('TARGET none')
else:
    t = unmade[0]
    print(f'TARGET {t["slug"]}  upload {t["date"]} {t["jam"]}  log status: {st.get(t["slug"], "-")}')
    print(t['line'])
    if t['slug'] in bl:
        print(f'BLOCK from {bl[t["slug"]][0]}:')
        print(bl[t['slug']][1])
    else:
        print('BLOCK none: research this slug first (step 2)')

print('\nLAST 5 HOOKS (newest first):')
pieces = sorted(glob.glob('src/pieces/*/script.json'), key=os.path.getmtime, reverse=True)
target = unmade[0]['slug'] if unmade else None
for p in [p for p in pieces if os.path.basename(os.path.dirname(p)) != target][:5]:
    try:
        lines = json.load(open(p, encoding='utf-8'))['lines']
        hook = ' '.join(l['say'] for l in lines if str(l.get('id', '')).startswith('hook')) or lines[0]['say']
    except Exception as e:
        hook = f'(unreadable: {e})'
    print(f'- {os.path.basename(os.path.dirname(p))}: {hook}')

print('\nLAST 5 YOUTUBE TITLES (newest first):')
ups = sorted(glob.glob('out/*/upload.md') + glob.glob('out/*/*/upload.md'), key=os.path.getmtime, reverse=True)
for u in ups[:5]:
    m = re.search(r'## YouTube\s*```[a-z]*\s*\n(.+)', open(u, encoding='utf-8').read())
    print(f'- {m.group(1).strip() if m else "(no title found)"}  [{u}]')
