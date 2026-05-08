# Client Logos & Team Photos — Design Spec

**Date:** 2026-05-08

## Overview

Wire up newly added public images into two existing blocks: the logo slider (client logos) and the team block (workshop action photos).

## Scope

Three files change for content, one file for the team block component.

---

## 1. Logo Slider — Content Update

**Files:** `content/pages/cs/home.mdx`, `content/pages/en/home.mdx`

Add `image` paths to the existing `logoSlider` block logos. Global Payments has no image and stays name-only.

| Company | Image path |
|---|---|
| Global Payments | *(name only — no image provided)* |
| Generali | `/logo-orizzontale.2020-07-16-17-41-47.jpeg` |
| AV Media | `/AV-MEDIA-SYSTEMS_horizontalni_1200_1200-970x970.png` |
| Raynet | `/LOGO_Raynet_big.png` |
| ČZU | `/CZU_logotyp_V_zelena.png` |
| CITA | `/CITALogo.png` |
| TAP | `/tap_logo.png` |

No changes to the `LogoSlider` component — it already renders images when present.

---

## 2. Team Block — Component Update

**File:** `components/blocks/team.tsx`

Add a `photos` field (array of `image` type) to the team block schema. Render the photos below the team member cards as a responsive 2-column grid.

**Rendering:**
- Grid appears only when `data.photos` is non-empty
- Each photo: `rounded-2xl`, `object-cover`, `aspect-video` (wide format suits the workshop scenes), subtle grayscale-to-color hover matching the logo slider style

**Schema addition:**
```ts
{
  type: 'object',
  label: 'Action Photos',
  name: 'photos',
  list: true,
  fields: [
    { type: 'image', label: 'Photo', name: 'src' },
    { type: 'string', label: 'Alt text', name: 'alt' },
  ],
}
```

---

## 3. Team Block — Content Update

**Files:** `content/pages/cs/home.mdx`, `content/pages/en/home.mdx`

Add the two workshop photos to the `team` block:

```yaml
photos:
  - src: "/WhatsApp Image 2026-05-08 at 10.56.51.jpeg"
    alt: "Sprint planning session"
  - src: "/WhatsApp Image 2026-05-08 at 10.56.51 (1).jpeg"
    alt: "GenZ Playbook workshop"
```

---

## Out of Scope

- `logo.png` (GenZ Consulting own logo) — already in use elsewhere, no change needed
- Global Payments logo — not provided, keep name-only
- EN content mirrors CS exactly for both changes
