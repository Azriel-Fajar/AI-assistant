const fs = require('fs');

// Count pages in a PDF by parsing the page tree /Count from the trailer-side objects.
const buf = fs.readFileSync(process.argv[2]);
const s = buf.toString('latin1');

// Chromium writes an uncompressed catalog/pages object; find /Type /Pages ... /Count N
const m = [...s.matchAll(/\/Type\s*\/Pages[\s\S]{0,400}?\/Count\s+(\d+)/g)];
if (m.length) {
  console.log('pages:', Math.max(...m.map(x => parseInt(x[1], 10))));
} else {
  const alt = [...s.matchAll(/\/Count\s+(\d+)/g)].map(x => parseInt(x[1], 10));
  console.log(alt.length ? 'pages (fallback): ' + Math.max(...alt) : 'could not determine');
}
