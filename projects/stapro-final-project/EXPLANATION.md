# Final Project Explanation — Frequency Distribution Analysis

For: Azriel (672025121), Cynthia (672025001), Archyeza (672025174)
Read this so anyone in the group can explain any part of the report if the lecturer asks.

---

## 1. What the project is about

We analyzed **how many universities (perguruan tinggi) exist in each regency/city (kabupaten/kota)** in Java + Banten, using official 2023 government data from data.go.id.

- One observation = one regency/city.
- The number we analyze = the "Total semua" column (all universities, Kemendikbudristek + non-Kemendikbudristek combined).
- We have **n = 117 observations** (the requirement was at least 100).

## 2. How the frequency table was built (Chapter 2 method)

Follow the exact 4 steps from the course module:

**Step 1 — Highest and lowest value**
- Highest = 85 (Kota Surabaya)
- Lowest = 1 (Kulon Progo, Pangandaran, Kab. Madiun, Kota Probolinggo)
- Range = 85 - 1 = 84

**Step 2 — Number of classes (Sturges' formula)**
```
k = 1 + 3.322 log n
  = 1 + 3.322 log 117
  = 1 + 3.322 (2.0682)
  = 7.8705  ->  rounded to 8 classes
```

**Step 3 — Class width**
```
c = range / k = 84 / 8 = 10.5  ->  rounded UP to 11
```
Why round up? The module shows that if you round down and data doesn't fit, you must add a class. Rounding up to 11 makes all 117 values fit in 8 classes. (If we used c = 10, the last class would be 71–80 and the value 85 would not fit.)

**Step 4 — Build classes**
- First class starts at the lowest value: 1 – 11.
- Class limits = interval edges minus/plus 0.5 (because data are whole numbers): 0.5 – 11.5.
- Middle value = (lower + upper) / 2, e.g. (1+11)/2 = 6.

Resulting table:

| Class | Limits | Mid | f | Cumulative f |
|-------|--------|-----|---|----|
| 1–11  | 0.5–11.5  | 6  | 69 | 69 |
| 12–22 | 11.5–22.5 | 17 | 30 | 99 |
| 23–33 | 22.5–33.5 | 28 | 8  | 107 |
| 34–44 | 33.5–44.5 | 39 | 2  | 109 |
| 45–55 | 44.5–55.5 | 50 | 4  | 113 |
| 56–66 | 55.5–66.5 | 61 | 0  | 113 |
| 67–77 | 66.5–77.5 | 72 | 0  | 113 |
| 78–88 | 77.5–88.5 | 83 | 4  | 117 |

- **Relative frequency** = f / n. Example: 69/117 = 0.5897 = 58.97%.
- **Cumulative frequency** = running total of f, read as "how many regions have ≤ upper limit".

## 3. The three charts

1. **Histogram** — bars, x-axis = middle value of each class, y-axis = frequency. Bars touch each other (continuous classes).
2. **Frequency polygon** — dots at (middle value, frequency) connected by lines, anchored to 0 at both ends. Same info as histogram, in line form.
3. **Ogive** — cumulative frequency plotted at each **upper class limit** (11.5, 22.5, ..., 88.5), starting from 0 at 0.5. Always rises or stays flat, never goes down.

## 4. Interpretation (Section 4 of report) — key talking points

- **Shape: strongly right-skewed (positively skewed).** Tallest bar on the far left, long tail to the right. 58.97% of regions are in the first class (1–11 universities).
- Two classes (56–66 and 67–77) are **empty**, then 4 outliers appear in 78–88: Surabaya (85), Bandung (78), Jakarta Selatan (78), Jakarta Timur (78). These are metropolitan outliers.
- Ogive rises steeply then flattens: 84.62% of regions have ≤ 22 universities.
- **Insight:** universities are concentrated in big cities (kota); most regencies (kabupaten) have very few. Because of the skew, the mean is pulled up by outliers, so the median/mode describes a "typical" region better.

## 5. Likely lecturer questions + answers

**Q: Why 8 classes?**
Sturges' formula gives 7.87; the module says round up or down, we rounded to 8 so classes stay reasonably narrow and all data fits.

**Q: Why is class width 11, not 10.5?**
Width must be a convenient whole number for integer data; rounding down (10) would leave 85 outside the table, so we round up.

**Q: Why do class limits use 0.5?**
So no data point can fall into two classes. The data are integers, so limits at x.5 are impossible values — clean boundaries.

**Q: Why does the histogram use middle values on the x-axis?**
Following the module's example: each bar is centered on the class middle value; the middle value represents the whole class.

**Q: Is the distribution symmetric?**
No — clearly right-skewed. Mode class (1–11) is at the far left, tail stretches right to 88.

**Q: What does the ogive tell you?**
Cumulative picture: e.g. at 22.5 the curve is at 99, meaning 99 out of 117 regions (84.6%) have 22 or fewer universities.

**Q: Where did the data come from?**
data.go.id — "Jumlah Perguruan Tinggi menurut Akreditasi dan Wilayah, Tahun 2023" (official open data portal). We used the total per regency/city.

## 6. Files in this folder

- `Frequency_Distribution_Final_Project.pdf` — the deliverable (6 pages).
- `data.csv` — cleaned dataset (region, total).
- `compute.py` — calculates the frequency distribution (verifies all 117 values fit).
- `build_report.py` — generates `report.html` (tables + SVG charts).
- `render_pdf.js` — renders the HTML to PDF with Playwright.

To regenerate: `python build_report.py` then `node render_pdf.js`.
