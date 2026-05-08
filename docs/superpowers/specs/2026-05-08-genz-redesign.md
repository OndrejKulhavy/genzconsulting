# GenZ Consulting — Vibrant Maximalist Redesign

**Date:** 2026-05-08  
**Aesthetic:** Vibrant / Maximalist — Loud Teal + Black Contrast  
**Scope:** Full page (all blocks + navbar + footer)

## Core Principle

Replace the generic frosted-glass-on-white template look with high-contrast, opinionated color blocking: **black → electric teal → white → black** alternating sections. Typography 20–30% larger throughout. Every section has a clear color identity. Add kinetic energy via a scrolling marquee.

## Color System (no new colors — existing palette, used boldly)

| Token | Value | Usage |
|---|---|---|
| `gtc-primary` | `#5ce1e6` | Hero bg, stats bg, accents |
| `gtc-deep` | `#054247` | Problem statement, CTA bg |
| `black` | `#000000` | Navbar, features, testimonials, footer |
| `white` | `#ffffff` | Logo slider, case studies, team |

Grain/noise texture (CSS `background-image: url("data:image/svg+xml...")` or pseudo-element) applied on teal sections to kill the flat-paint feel.

## Components

### Navbar
- **Background:** solid black (remove `bg-background/50 backdrop-blur-3xl`)
- **Logo:** white text
- **Nav links:** white, `hover:text-gtc-primary`
- **Book call button:** solid teal fill, black text, sharp rectangle (`rounded-none` or minimal radius)
- **Border-bottom:** remove

### Marquee Ticker (new component)
- New `components/ui/marquee.tsx` — CSS-only infinite scroll
- Black background, white text
- Content: `WORKSHOP · ONBOARDING · GEN Z FIRST · 50+ FIREM · REAL TALK · CONSULTING ·`
- Inserted between hero block and logo slider in `components/blocks/index.tsx` render order

### Hero Block
- Background stays `bg-gtc-primary`
- Headline: `text-8xl` → `text-9xl xl:text-[8rem]`, font-black, black text
- Grain texture overlay via `::before` pseudo or wrapper div with CSS noise
- Buttons: primary = solid black fill white text; secondary = outlined black border

### Logo Slider
- White background — no change structurally, ensure title is bold black

### Problem Statement (`gtc-deep` bg)
- Increase headline size: `text-4xl` → `text-5xl lg:text-6xl`
- Keep white text

### Features Block
- **Background:** black
- Add oversized teal section number (`01`, `02`, `03`) above each feature title
- Titles white, body text `text-zinc-400`

### Case Studies
- White background
- Cards: add `border-l-4 border-gtc-primary` accent
- Bold black section title, larger

### Stats Block
- Full-bleed `bg-gtc-primary`
- Stat numbers: `text-8xl font-black` black
- Diagonal top edge via `clip-path: polygon(0 8%, 100% 0, 100% 100%, 0 100%)`

### Testimonials
- **Background:** black
- Giant teal open-quote `"` glyph (`text-9xl text-gtc-primary opacity-30`) behind quote text
- White quote text

### Team
- Off-white background (`bg-zinc-50`) — no structural change, ensure title is bold

### CTA Block
- Background: `bg-gtc-deep`
- Headline: `text-5xl lg:text-6xl font-black` white
- Two buttons: solid teal + outlined white

### Footer
- Black background
- Teal accents on links and logo

## Typography Scale (global)
- Section eyebrows/labels: `text-xs font-bold uppercase tracking-widest text-gtc-primary`
- Section titles: push 1–2 size steps up from current
- Body: unchanged

## What We Are NOT Doing
- No new fonts (Poppins is already loaded and works)
- No new brand colors
- No restructuring of TinaCMS schema or content
- No changes to animations (existing TextEffect/AnimatedGroup stay)
