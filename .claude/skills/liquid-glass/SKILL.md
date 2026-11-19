---
name: liquid-glass
description: Use when someone asks for Apple "liquid glass" UI, iOS 26 glass effect, glassmorphism with real refraction/lens bending, frosted glass cards, glass navbar/sidebar/player bar/modal/button, or "buat tampilan liquid glass". Works on any stack (React, Next, Vue, Laravel Blade, PHP, plain HTML/CSS, Tailwind). Adapts the effect to the project's framework, theme, and existing styles.
argument-hint: [element to glassify, e.g. "navbar" or "player bar"]
---

## What This Skill Does

Adds Apple-style Liquid Glass to any web UI: real refraction at the rim (SVG displacement map via `backdrop-filter`), tint, specular edge highlights, dark/light theming, and graceful fallback. The engine is framework-agnostic vanilla JS; only the glue (how you load it and write the markup) changes per stack.

Bundled files (copy into the target project, do not rewrite them):
- `assets/liquid-glass.js` : engine. Builds displacement filters, auto-observes `.liquid-glass-bend`, exposes `window.LiquidGlass`.
- `assets/liquid-glass.css` : layers + theme variables + fallback + reduced-transparency.

## How The Effect Works (know this before adapting)

1. A glass element is a stack of **sibling layers**, never nested around content:
   `.liquid-glass` (wrapper, sets radius) > `.liquid-glass-bend` + `.liquid-glass-tint` + `.liquid-glass-shine` + `.liquid-glass-content`.
2. Only `.liquid-glass-bend` carries the `backdrop-filter`. If content sits inside it, the text gets distorted too. Always keep content in `.liquid-glass-content`.
3. JS reads each bend layer's size and `border-radius`, draws a displacement map, injects an SVG `<filter>`, and sets `backdrop-filter: url(#id) blur() saturate() brightness()`.
4. Brightness/blur/saturate/tint come from CSS variables, so theme switches need no JS.
5. Real refraction works in **Chromium only** (Chrome, Edge, Brave, Opera, Electron, Android WebView). Safari/Firefox automatically get `.lg-fallback` (plain frosted blur). Say this to the user; do not promise identical rendering everywhere.
6. It only looks like glass when something colorful or detailed is **behind** it. On a flat solid background it looks like plain frosted glass. If the page background is flat, suggest/add a gradient, image, or blurred blobs behind.

## Steps

1. **Detect the stack.** Read `package.json`, `composer.json`, layout/entry files. Identify: framework (React/Next/Vue/Svelte/Blade/plain PHP/HTML), CSS approach (Tailwind, CSS modules, plain CSS, Bootstrap), theme mechanism (`.dark` class, `data-theme`, `prefers-color-scheme`, none), and where global CSS/JS is loaded.
2. **Identify targets.** If `$ARGUMENTS` names elements, use those. Otherwise ask which elements (navbar, sidebar, cards, player bar, modal, buttons) in one short question, or glassify the single most obvious surface and say so.
3. **Install assets.** Copy `assets/liquid-glass.js` and `assets/liquid-glass.css` into the project where static assets/imports live (see Stack Recipes). Do not edit the originals in the skill folder.
4. **Wire theme.** The CSS already supports `.dark`, `[data-theme='dark']`, and `prefers-color-scheme`. If the project uses a different dark-mode hook, add one selector override for `--lg-brightness`, `--lg-tint`, `--lg-edge`, `--lg-edge-dim`, `--lg-shadow`. Match the project's accent/palette by tweaking `--lg-tint`.
5. **Write the markup** for each target using the layer structure. Set radius with `--lg-radius` (or the project's own radius token). Reuse existing classes/components; wrap instead of rewriting.
6. **Handle layout/positioning.** `.liquid-glass` is `position: relative`. If the original element was `position: fixed/sticky` (navbar, player), put those positioning styles on `.liquid-glass` (or add the class to the same element). Remove the element's old `background`/`backdrop-filter`/`border` so they do not stack with the glass layers.
7. **Verify.** Run the dev server, open in a Chromium browser (use the built-in browser tools or `playwright`/`build-verify` skill if available), check: rim bends the background, content is sharp (not distorted), no console errors, resize still works, dark mode readable. Screenshot against a detailed background. Check contrast of text on glass (add `text-shadow` or a stronger `--lg-tint` if low).
8. **Report** what was added, the files touched, and the Chromium-only caveat if relevant.

## Stack Recipes

### Plain HTML / PHP / Laravel Blade
Put files in `public/assets/` (or `public/css`, `public/js`). In the layout `<head>`/before `</body>`:
```html
<link rel="stylesheet" href="/assets/liquid-glass.css">
<script src="/assets/liquid-glass.js" defer></script>
```
Laravel with Vite: place in `resources/js/liquid-glass.js` + `resources/css/liquid-glass.css`, `import './liquid-glass.js'` in `app.js`, import the CSS in `app.css`. Optional Blade component `resources/views/components/liquid-glass.blade.php`:
```blade
@props(['radius' => '28px'])
<div {{ $attributes->merge(['class' => 'liquid-glass']) }} style="--lg-radius: {{ $radius }}">
  <div class="liquid-glass-bend"></div><div class="liquid-glass-tint"></div><div class="liquid-glass-shine"></div>
  <div class="liquid-glass-content">{{ $slot }}</div>
</div>
```
Livewire/htmx/Turbo: nothing extra, the MutationObserver picks up new elements.

### React / Vite
Copy to `src/lib/liquid-glass.js` (+ css). Import once in the entry (`main.tsx`): `import './lib/liquid-glass.js'; import './lib/liquid-glass.css';`. Component:
```tsx
import type { ReactNode, CSSProperties } from 'react';

export function LiquidGlass({ children, radius = 28, className = '', style }:
  { children: ReactNode; radius?: number; className?: string; style?: CSSProperties }) {
  return (
    <div className={`liquid-glass ${className}`} style={{ '--lg-radius': `${radius}px`, ...style } as CSSProperties}>
      <div className="liquid-glass-bend" />
      <div className="liquid-glass-tint" />
      <div className="liquid-glass-shine" />
      <div className="liquid-glass-content">{children}</div>
    </div>
  );
}
```
No hook needed. The engine observes DOM changes. For TypeScript, a `.js` import may need `// @ts-expect-error` or a `declare module`, or rename to `.ts` and add `export {}`.

### Next.js / Remix / SSR
The engine is SSR-safe (no-ops without `window`). Import it from a **client** component (`'use client'`) or load via `<Script src="/liquid-glass.js" strategy="afterInteractive" />` with the file in `public/`. Never import it in a server component.

### Vue / Nuxt / Svelte
Same pattern: import once at the app entry (Nuxt: client-only plugin `plugins/liquid-glass.client.ts`), make a tiny wrapper component with the four layers and a slot.

### Tailwind
Keep the bundled CSS as-is (it is layer logic, not utilities). Use Tailwind for everything else: `<div class="liquid-glass fixed bottom-4 inset-x-4 [--lg-radius:24px]">`. Tailwind `dark:` works since the CSS reacts to `.dark`.

### Bootstrap / plain CSS projects
Same as plain HTML. Set `--lg-radius` to the component's existing radius so the rim matches.

## Tuning

| Want | Change |
|---|---|
| Stronger refraction at the rim | `data-lg-strength="120"` on `.liquid-glass-bend` (default 80) |
| Wider bevel | `data-lg-depth="16"` (default 10) |
| Less "melting" of top/bottom text | `data-lg-yscale="0.5"` (default 0.75, lower = less vertical pull) |
| Frostier (more blur) | `--lg-blur: 4px` |
| More vivid backdrop | `--lg-saturate: 180%` |
| Lighter/darker glass | `--lg-brightness`, `--lg-tint` |
| Subtler rim | lower alpha of `--lg-edge` |

Keep `depth` smaller than half the shorter side of the element. Very small elements (< 40px) need smaller depth (4 to 6).

## Output Notes

- Pill/capsule shapes: set radius to half the height (or `9999px`, the engine clamps to half the shorter side).
- Many glass elements on one page are fine (filters are cached per unique size/params), but avoid hundreds of unique sizes, such as glass on every list row. Use glass for chrome (navbars, bars, modals, hero cards), plain `--lg-tint` + blur for list items.
- Do not stack glass inside glass; the inner layer blurs the outer filter result.
- Never put the glass on an element that has `overflow: hidden` ancestors with `transform` if you see no effect: `backdrop-filter` can be clipped/disabled by ancestors with `filter`, `opacity < 1`, or `will-change: transform`. Move the glass out of that ancestor.
- `prefers-reduced-transparency` is respected: the bend layer turns off and the tint becomes opaque.
- Keep text legible: check contrast on the busiest background region.

## Troubleshooting

| Symptom | Cause / Fix |
|---|---|
| Looks like plain frosted blur | Not Chromium (expected), or the engine did not load (check `window.LiquidGlass` in console) |
| No glass at all | Ancestor has `opacity`, `filter`, or `mix-blend-mode`, or element has 0 size when first measured (engine retries on resize) |
| Text is warped | Content is inside `.liquid-glass-bend`. Move it to `.liquid-glass-content` |
| Rim bevel looks square | Bend layer has no `border-radius`. It inherits from `.liquid-glass`; set `--lg-radius` |
| Looks flat on a solid page | Nothing behind to refract. Add a gradient/image/blobs behind |
| Flicker on first paint | Add `.liquid-glass-bend { transition: opacity .2s }` or accept; filter is built after layout |
| Filter ids collide / stale after code edit | Hard reload. Ids are derived from size + params |

## Notes

- Do not rewrite the engine. If a behavior change is needed, change parameters via data attributes/CSS variables first.
- Do not claim Safari/Firefox render refraction. They get the fallback.
- Credit: displacement-map technique follows the widely shared SVG `feDisplacementMap` liquid-glass approach, adapted here with yScale melting fix.
