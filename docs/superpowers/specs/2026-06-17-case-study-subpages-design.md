# Case Study Subpages — Design

**Date:** 2026-06-17
**Status:** Approved

## Goal

Replace the downloadable-PDF case studies with full, on-site case-study subpages. Each of the three existing case studies (AV Media, Global Payments, Generali) gets its own page that reproduces the content of its PDF, styled to match the site, with numbers/stats animated.

## Decisions

- **Bilingual.** All PDF content is transcribed (Czech) and translated (English). Subpages are fully localized like the rest of the site (cs default, en).
- **Overview cards** drop the "View PDF" / "Download PDF" buttons and instead link to the new subpage via a single "Read case study" action. PDFs stay in `/public` but are no longer surfaced.
- **Architecture:** one dynamic `[slug]` route + a typed bilingual content module + one detail component with reusable animated sub-components. The three PDFs share an identical 6-section template, so content is modelled once.

## Routes & files

- `app/[locale]/case-studies/[slug]/page.tsx`
  - Server component, mirrors existing page pattern (`<Layout>` wrapper, `revalidate = 300`).
  - `generateStaticParams()` → `av-media`, `global-payments`, `generali` (× locales handled by parent `[locale]`).
  - `generateMetadata()` → per-study, per-locale title + description (read from the data module server-side).
  - Renders `<CaseStudyDetail slug={slug} />`. Unknown slug → `notFound()`.
- `components/pages/case-studies/case-study-data.ts`
  - Typed `CaseStudy` schema (see below) + `CASE_STUDIES: Record<Slug, LocalizedCaseStudy>` where each field carries `{ cs, en }` or the structure is duplicated per locale via a `Localized<T>` helper.
  - Exports `caseStudySlugs` and a `getCaseStudy(slug, locale)` helper.
- `components/pages/case-studies/CaseStudyDetail.tsx`
  - `'use client'`. Uses `useLocale()` to pick locale content and `useLayout()` for `calendlyUrl`. Renders all sections. Houses the reusable sub-components.

## Content schema (`CaseStudy`)

Captures the shared PDF template. Per-study flexibility where the PDFs differ.

```
interface CaseStudy {
  client: string;            // "AV MEDIA"
  logo: string; logoAlt: string;
  year: string;              // "2026" / "2025"
  hero: { headline; intro };
  scope: { label; value }[]; // 3 chips: Rozsah / Metodika / Výstup
  stats: { value; label }[]; // 3 hero numbers, value like "318 + 20", "100 %", "10", "8"
  context: {                 // 01 · Kontext & výzva
    headline; intro;
    clientLabel; client;     // "Kdo je klient"
    whyTitle; whyPoints: { title; body }[];  // "Proč to nebyl běžný projekt" (2–4 points)
    briefLabel; brief;       // "Naše zadání"
  };
  approach: {                // 02 · Náš přístup
    headline; intro;
    steps: { num; title; body }[];           // always 3
    assessedTitle; assessedIntro;
    assessed: { num?; title; body? }[];       // 4 themes / 10 phases / 4 lenses
    assessedNote?;                            // e.g. Generali's "Plus 6 cross-cutting areas…"
  };
  findings: {                // 03 · Klíčová zjištění / změny
    headline; intro;
    columns: [string, string, string];        // per-study column headers
    items: { category; title; cols: [string, string, string] }[]; // 4
  };
  outputs: {                 // 04 · Výstupy & dopad
    headline; intro;
    items: { num; title; body }[];            // 4–5
    quote; quoteAuthor;
  };
  whyUs: {                   // 05 · Proč GenZ Consulting
    headline; intro;
    pillars: { num; title; body }[];          // 3
  };
}
```

Content source = the three PDFs in `/data` (and `/public`), transcribed verbatim (cs) and translated (en).

## Page sections (render order)

1. **Hero** — `gtc-deep`/`gtc-primary` band: KLIENT badge + logo, "CASE STUDY · {year}", big headline, intro, 3 scope chips.
2. **Stat band** — the 3 hero numbers, count-up animated on scroll-in.
3. **01 · Context & challenge** — headline, intro, "Who is the client", "Why this wasn't routine" point grid, "Our brief".
4. **02 · Approach** — 3-step process (staggered reveal, numbered), "What we assessed" grid (flex item count).
5. **03 · Key findings** — 4 findings; each = category tag + title + 3-column comparison card; staggered reveal.
6. **04 · Outputs & impact** — numbered outputs list + pull quote.
7. **05 · Why GenZ Consulting** — 3 pillars + CTA ("Book a call", reusing `CalendlyButton`) → links back to overview CTA style.

## Reusable sub-components (in `CaseStudyDetail.tsx`)

- `AnimatedStat({ value, label })` — splits `value` into leading number(s)/prefix/suffix, count-up animates each numeric token when in view (`useInView` + animated motion value or rAF), respects `prefers-reduced-motion` (shows final value immediately).
- `ProcessSteps`, `FindingsBlock`, `OutputsList`, `WhyPillars` — presentational, `motion` fade-up + stagger.
- Reuse existing `fadeUp` variant pattern from the codebase.

## Styling

Match existing brutalist/sharp aesthetic: `rounded-none`, black + `gtc-primary` (#5ce1e6) teal, `gtc-deep` (#054247) dark band, bold/black headings, uppercase tracked eyebrows, `border-l-4 border-l-gtc-primary` accents. `max-w-6xl` container. Same `motion/react` `whileInView` patterns already used across pages.

## i18n / overview wiring

- Overview `CaseStudiesPage.tsx`: replace the two `<a>` PDF buttons with one `<Link href={/${locale}/case-studies/${slug}}>` "Read case study". Add a `slug` field to the `CASE_STUDIES` array and a `readMore` string to `messages/{cs,en}.json` under `caseStudies`. Remove unused `Download`/`ExternalLink` imports as appropriate.
- Rich subpage content lives in `case-study-data.ts` (not next-intl) — chosen over bloating message JSON with deeply nested arrays.

## Out of scope

- No CMS/Tina editing of subpage content (static data module).
- No new PDF generation; existing PDFs remain in `/public` but unlinked.
- No changes to other pages.

## Verification

`pnpm` build (`tinacms build && next build`) succeeds; biome lint clean; the three subpages render in both locales with animated stats and working CTA; overview cards link correctly.
