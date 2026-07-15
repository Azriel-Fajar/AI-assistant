import csv, math, json

with open('data.csv', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))
vals = [int(r['Total_semua']) for r in rows]
n = len(vals)
lo, hi = min(vals), max(vals)
rng = hi - lo
k_raw = 1 + 3.322 * math.log10(n)
k = round(k_raw)  # module: round up or down; pick nearest
c_raw = rng / k
c = math.ceil(c_raw)  # round up so all data fits

# class intervals starting at lo, integer data
classes = []
start = lo
for i in range(k):
    a, b = start, start + c - 1
    f_ = sum(1 for v in vals if a <= v <= b)
    classes.append({'a': a, 'b': b, 'lim_lo': a - 0.5, 'lim_hi': b + 0.5,
                    'mid': (a + b) / 2, 'f': f_})
    start += c
assert sum(cl['f'] for cl in classes) == n, "data not all covered"

cum = 0
for cl in classes:
    cum += cl['f']
    cl['cum'] = cum
    cl['rel'] = cl['f'] / n

out = {'n': n, 'min': lo, 'max': hi, 'range': rng,
       'k_raw': round(k_raw, 4), 'k': k, 'c_raw': round(c_raw, 4), 'c': c,
       'classes': classes}
print(json.dumps(out, indent=1))
