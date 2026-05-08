# GenZ Consulting Website — Design Spec

Date: 2026-05-08  
Project: GenZ Consulting marketing website  
Stack: Next.js 15, TinaCMS, Tailwind CSS v4, next-intl, Resend

---

## 1. Goal

Replace the TinaCMS boilerplate with the GenZ Consulting brand website. The site must:

- Eliminate the "legit check" problem: HR directors who Google GTC after a meeting must hit a credible, professional site.
- Convert LinkedIn traffic into booked calls (primary CTA) or captured leads via PDF download (secondary CTA).
- Present GTC as an expert consultancy, not a student project.
- Be fully editable by the client via TinaCMS without breaking the layout.
- Be bilingual: Czech (/cs) and English (/en).

---

## 2. Architecture

### Routing & i18n

- `next-intl` middleware handles `/cs` and `/en` prefixed routes.
- `/` auto-redirects to `/cs` or `/en` based on `Accept-Language` header.
- Static UI strings (nav labels, button text, form labels, error messages) live in `messages/cs.json` and `messages/en.json`.
- TinaCMS page content split by language: `content/pages/cs/home.mdx` and `content/pages/en/home.mdx`.
- TinaCMS collections for `cs` and `en` pages are separate so both are independently editable in the CMS editor.

### Fonts

- Remove Inter, Nunito, Lato from `app/layout.tsx`.
- Add `Poppins` via `next/font/google` with weights 400, 500, 600, 700.
- Expose as CSS variable `--font-poppins` and set as default `font-sans` in Tailwind config.

### Brand Colors

Add to Tailwind CSS v4 theme (in `styles.css` `@theme` block):

```css
--color-primary: #5ce1e6;
--color-teal-dark: #007879;
--color-teal-mid: #00a8aa;
--color-teal-deep: #054247;
--color-teal-accent: #12b3c4;
```

White (`#ffffff`) and Black (`#000000`) remain as-is.

### TinaCMS Collections

**Existing collections to keep:**
- `global` — nav, footer content (extend with new fields)
- `pages` — split into cs/en subfolders

**New collections:**
- `partners` — `name: string`, `logo: image`, `url: string (optional)`
- `team` — `name: string`, `role: string`, `bio: string`, `photo: image`, `linkedin: string`, `isMentor: boolean`

**Removed collections (boilerplate-only):**
- `authors`, `posts`, `tags` — remove unless a blog is requested later

### Email Capture (Legit Check PDF)

- PDF stored at `/public/downloads/legit-check.pdf` (client uploads file).
- CTA triggers a modal with a single email input field.
- Submit → POST `/api/legit-check`:
  1. Validates email format.
  2. Sends notification email to `adam.dalecky@genzconsulting.cz` via Resend.
  3. Returns a JSON response with the PDF download URL.
- Frontend reveals download link on success.
- No external mailing list integration in v1; Resend handles delivery.

### Analytics

- Google Analytics 4 via `@next/third-parties` (built-in Next.js GA4 helper).
- GA4 Measurement ID stored in `.env` as `NEXT_PUBLIC_GA_ID`.
- No heatmaps in v1.

---

## 3. Page Structure

Single long-scroll homepage per language. Navigation and footer are global (not blocks).

### Navigation (global)

- Left: GTC logo (SVG from brand manual)
- Center: nav links — Services (`#services`), About (`#team`), Contact (`#contact`)
- Right: language switcher (CS / EN toggle) + "Booknout call" CTA button (teal, Poppins semibold)
- Mobile: hamburger via Headless UI (already a dependency), full-screen overlay menu

### Homepage Blocks (in order)

#### Block 1 — `hero` (extend existing)

Fields:
- `headline: string` — e.g. "Generace Z není komplikovaná."
- `subheadline: string` — bold second line, e.g. "Firmy jen pořád komunikují postaru."
- `tagline: string` — supporting paragraph
- `primaryCta: { label, calendlyUrl }` — opens Calendly popup
- `secondaryCta: { label }` — triggers PDF email capture modal
- `image: image` — optional hero photo (one of the 4 selected grey-toned photos)

Layout: centered text on dark teal background (`--color-teal-deep`), white text. Animated entrance via existing `TextEffect` and `AnimatedGroup` components.

#### Block 2 — `logo_slider` (new block)

Fields:
- `title: string` — e.g. "Spolupracovali jsme s"
- Logos pulled from `partners` collection (not inline — references the collection)

Layout: infinite horizontal scroll using existing `InfiniteSlider` / `infinite-slider` component. Logos in greyscale, color on hover.

#### Block 3 — `problem_statement` (new block)

Fields:
- `eyebrow: string` — small label above
- `problem: rich-text` — left column, describes what companies get wrong
- `solution: rich-text` — right column, how GTC is different
- `quote: string` — optional large pull quote

Layout: two-column on desktop, stacked on mobile. High contrast, bold typography. Accent color on key phrases via `<mark>` styling.

#### Block 4 — `services` (extend existing `features` block)

Fields:
- `title: string`
- `items: list` of `{ icon, title, description, ctaLabel, ctaLink }`
- Three fixed service cards: Workshopy, Training Programy, Onboardingová aplikace

Layout: 3-column grid, each card has icon + title + 2-line description + optional CTA link. Cards have a subtle teal border, white background.

#### Block 5 — `stats` (extend existing)

Fields:
- `title: string`
- `stats: list` of `{ value, label }` — e.g. "50+", "spokojených firem"

Layout: horizontal strip, large numerals in `--color-primary`, label in dark teal. Animated count-up on scroll entry.

#### Block 6 — `testimonial` (extend existing)

Fields:
- Testimonials pulled from inline list (not a separate collection in v1)
- `quote, author, role, avatar`

Layout: use existing testimonial block layout. Keep the scrolling carousel pattern.

#### Block 7 — `team` (new block)

Fields:
- `title: string`
- `description: string`
- Members pulled from `team` collection, filtered by `isMentor: false` for primary cards, `isMentor: true` for mentor grid

Layout: 2 large primary cards (Adam, Jony) with photo, name, role, bio excerpt, LinkedIn link. Below: smaller mentor/partner grid with name, role, photo only.

#### Block 8 — `cta` (extend existing)

Fields:
- `headline: string`
- `description: string`
- `primaryCta: { label, calendlyUrl }`
- `secondaryCta: { label }` — PDF modal trigger

Layout: full-width teal background section. Two buttons side by side. This is the conversion anchor at the bottom of the page.

### Footer (global)

- GTC logo + tagline
- Contact: phone (+420 606 028 051), email (adam.dalecky@genzconsulting.cz)
- LinkedIn: company + Adam personal
- Language switcher
- Copyright line
- Managed via TinaCMS `global` collection

---

## 4. New Components Needed

| Component | Purpose |
|-----------|---------|
| `components/blocks/logo-slider.tsx` | Partner logos infinite scroll block |
| `components/blocks/problem-statement.tsx` | Two-column problem/solution block |
| `components/blocks/team.tsx` | Team + mentor grid block |
| `components/ui/CalendlyButton.tsx` | Button that opens Calendly popup widget — Calendly script loaded lazily on first click, not on page load, to avoid performance penalty |
| `components/ui/LeadMagnetModal.tsx` | Email capture modal for PDF download |
| `app/api/legit-check/route.ts` | API route: validates email, sends Resend notification, returns PDF URL |
| `middleware.ts` | next-intl routing middleware |
| `messages/cs.json` | Czech static UI strings |
| `messages/en.json` | English static UI strings |

---

## 5. Content Files

```
content/
  pages/
    cs/
      home.mdx        ← Czech homepage blocks
    en/
      home.mdx        ← English homepage blocks
  partners/
    global-payments.md
    generali.md
    av-media.md
    raynet.md
    czu.md
    cita.md
    tap.md
    (+ others from logos provided)
  team/
    adam-dalecky.md
    jony.md           ← second team member
    (mentors added by client via CMS)
```

---

## 6. Environment Variables

```
NEXT_PUBLIC_GA_ID=          # Google Analytics 4 Measurement ID
RESEND_API_KEY=             # Resend API key for email notifications
TINA_CLIENT_ID=             # TinaCMS Cloud
TINA_TOKEN=                 # TinaCMS Cloud
```

---

## 7. Out of Scope (v1)

- Blog / posts section (boilerplate posts collection removed)
- A/B testing (flagged in brief, deferred)
- Heatmaps / session recordings (deferred)
- Mailchimp / Brevo integration (Resend email notification only)
- Separate `/o-nas` or `/about` subpage (single-page for now)
- Seznam SEO-specific sitemap (standard Next.js sitemap covers Google; Seznam uses the same)
