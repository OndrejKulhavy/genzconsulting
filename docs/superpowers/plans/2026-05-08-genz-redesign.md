# GenZ Consulting Vibrant Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the site from a generic frosted-glass template into a bold vibrant-maximalist consulting brand with black/teal/white color blocking, giant typography, and a scrolling marquee ticker.

**Architecture:** Modify existing block components in-place. No schema changes. No new routes. One new UI component (Marquee) reusing the existing InfiniteSlider primitive. All visual changes are CSS/className-only — no logic changes.

**Tech Stack:** Next.js, Tailwind CSS v4, TinaCMS, `components/motion-primitives/infinite-slider.tsx` (already exists)

---

### Task 1: Create the Marquee ticker component

**Files:**
- Create: `components/ui/marquee.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/ui/marquee.tsx
import { InfiniteSlider } from '../motion-primitives/infinite-slider';

const TICKER_ITEMS = ['WORKSHOP', 'ONBOARDING', 'GEN Z FIRST', '50+ FIREM', 'REAL TALK', 'CONSULTING'];

export const Marquee = () => (
  <div className="overflow-hidden bg-black py-4">
    <InfiniteSlider gap={40} speed={50} className="flex items-center">
      {TICKER_ITEMS.map((item) => (
        <span key={item} className="text-xs font-bold uppercase tracking-[0.2em] text-white">
          {item}&nbsp;&nbsp;·
        </span>
      ))}
    </InfiniteSlider>
  </div>
);
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/marquee.tsx
git commit -m "feat: add Marquee ticker component"
```

---

### Task 2: Insert Marquee after Hero in the blocks renderer

**Files:**
- Modify: `components/blocks/index.tsx`

Current content of the file (full replacement):

- [ ] **Step 1: Add Marquee import and insert it after every Hero block**

Replace `components/blocks/index.tsx` with:

```tsx
import { tinaField } from "tinacms/dist/react";
import { Page, PageBlocks } from "../../tina/__generated__/types";
import { Hero } from "./hero";
import { Content } from "./content";
import { Features } from "./features";
import { Testimonial } from "./testimonial";
import { Video } from "./video";
import { Callout } from "./callout";
import { Stats } from "./stats";
import { CallToAction } from "./call-to-action";
import { LogoSlider } from "./logo-slider";
import { ProblemStatement } from "./problem-statement";
import { Team } from "./team";
import { CaseStudies } from "./case-studies";
import { Marquee } from "../ui/marquee";

export const Blocks = (props: Omit<Page, "id" | "_sys" | "_values">) => {
  if (!props.blocks) return null;
  return (
    <>
      {props.blocks.map(function (block, i) {
        return (
          <div key={i} data-tina-field={tinaField(block)}>
            <Block {...block} />
            {block.__typename === "PageBlocksHero" && <Marquee />}
          </div>
        );
      })}
    </>
  );
};

const Block = (block: PageBlocks) => {
  switch (block.__typename) {
    case "PageBlocksVideo":
      return <Video data={block} />;
    case "PageBlocksHero":
      return <Hero data={block} />;
    case "PageBlocksCallout":
      return <Callout data={block} />;
    case "PageBlocksStats":
      return <Stats data={block} />;
    case "PageBlocksContent":
      return <Content data={block} />;
    case "PageBlocksFeatures":
      return <Features data={block} />;
    case "PageBlocksTestimonial":
      return <Testimonial data={block} />;
    case "PageBlocksCta":
      return <CallToAction data={block} />;
    case "PageBlocksLogoSlider":
      return <LogoSlider data={block} />;
    case "PageBlocksProblemStatement":
      return <ProblemStatement data={block} />;
    case "PageBlocksTeam":
      return <Team data={block} />;
    case "PageBlocksCaseStudies":
      return <CaseStudies data={block} />;
    default:
      return null;
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add components/blocks/index.tsx
git commit -m "feat: insert Marquee ticker after Hero block"
```

---

### Task 3: Redesign the Header (navbar)

**Files:**
- Modify: `components/layout/nav/header.tsx`

- [ ] **Step 1: Replace nav className to solid black, update text and button styles**

In `components/layout/nav/header.tsx`, replace the `<nav>` opening tag and its className, the logo span, all nav link classNames, the language switcher className, and the CalendlyButton. Replace the entire file content:

```tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { useLayout } from '../layout-context';
import { CalendlyButton } from '../../ui/CalendlyButton';

export const Header = () => {
  const { globalSettings } = useLayout();
  const header = globalSettings!.header!;
  const [menuState, setMenuState] = React.useState(false);
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(cs|en)/, '') || '/';
    return `/${newLocale}${pathWithoutLocale}`;
  };

  const otherLocale = locale === 'cs' ? 'en' : 'cs';
  const calendlyUrl = (header as any).calendlyUrl ?? '';

  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className="fixed z-20 w-full bg-black"
      >
        <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-4 lg:gap-0">
            <div className="flex w-full items-center justify-between gap-6">
              {/* Logo */}
              <Link href={`/${locale}`} aria-label="home" className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white">{header.name}</span>
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden text-white"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>

              {/* Desktop nav */}
              <div className="hidden items-center gap-8 lg:flex">
                <ul className="flex gap-8 text-sm">
                  {header.nav?.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item!.href!.startsWith('#') ? item!.href! : `/${locale}${item!.href}`}
                        className="font-medium text-white/70 hover:text-gtc-primary block duration-150"
                      >
                        {item!.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Language switcher */}
                <Link
                  href={switchLocale(otherLocale)}
                  className="text-sm font-bold uppercase text-white/50 hover:text-white"
                >
                  {otherLocale}
                </Link>

                {/* Book call CTA */}
                {calendlyUrl && (
                  <CalendlyButton
                    url={calendlyUrl}
                    label={t('bookCall')}
                    size="default"
                    className="rounded-none bg-gtc-primary text-black font-bold hover:bg-gtc-primary/90 px-6"
                  />
                )}
              </div>
            </div>

            {/* Mobile menu */}
            <div className="bg-black in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 border border-white/10 p-6 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:p-0">
              <div className="lg:hidden w-full">
                <ul className="space-y-6 text-base">
                  {header.nav?.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item!.href!.startsWith('#') ? item!.href! : `/${locale}${item!.href}`}
                        className="font-medium text-white/70 hover:text-gtc-primary block duration-150"
                        onClick={() => setMenuState(false)}
                      >
                        {item!.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center gap-4">
                  <Link href={switchLocale(otherLocale)} className="text-sm font-bold uppercase text-white/50">
                    {otherLocale}
                  </Link>
                  {calendlyUrl && (
                    <CalendlyButton
                      url={calendlyUrl}
                      label={t('bookCall')}
                      size="default"
                      className="rounded-none bg-gtc-primary text-black font-bold hover:bg-gtc-primary/90"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/nav/header.tsx
git commit -m "design: black navbar with teal CTA button"
```

---

### Task 4: Redesign the Hero block

**Files:**
- Modify: `components/blocks/hero.tsx`

Changes: increase headline size to `text-7xl md:text-8xl xl:text-[7.5rem]` font-black, make primary CTA button solid black with white text, secondary ghost button with black border.

- [ ] **Step 1: Update Hero classNames**

In `components/blocks/hero.tsx`, make these targeted edits:

**4a.** Replace the `<TextEffect>` for the headline (line ~46):
```tsx
// OLD:
<TextEffect preset="fade-in-blur" speedSegment={0.3} as="h1" className="mt-8 text-balance text-6xl font-bold md:text-7xl xl:text-[5.25rem]">

// NEW:
<TextEffect preset="fade-in-blur" speedSegment={0.3} as="h1" className="mt-8 text-balance text-6xl font-black leading-none md:text-8xl xl:text-[7.5rem]">
```

**4b.** Replace the calendly action wrapper div (the `bg-foreground/10 rounded-full border p-0.5` div around CalendlyButton):
```tsx
// OLD (calendly wrapper):
<div key={action!.label} data-tina-field={tinaField(action)} className="bg-foreground/10 rounded-full border p-0.5">
  <CalendlyButton url={calendlyUrl} label={action!.label!} />
</div>

// NEW:
<div key={action!.label} data-tina-field={tinaField(action)}>
  <CalendlyButton
    url={calendlyUrl}
    label={action!.label!}
    size="lg"
    className="rounded-none bg-black text-white font-bold hover:bg-black/80 px-8 h-12"
  />
</div>
```

**4c.** Replace the leadMagnet action wrapper div:
```tsx
// OLD:
<div key={action!.label} data-tina-field={tinaField(action)} className="bg-foreground/10 rounded-full border p-0.5">
  <Button size="lg" variant="ghost" className="rounded-full px-6 text-base" onClick={() => setModalOpen(true)}>

// NEW:
<div key={action!.label} data-tina-field={tinaField(action)}>
  <Button size="lg" variant="outline" className="rounded-none border-2 border-black bg-transparent text-black font-bold hover:bg-black hover:text-white px-8 h-12" onClick={() => setModalOpen(true)}>
```

**4d.** Replace the generic link action wrapper div:
```tsx
// OLD:
<div key={action!.label} data-tina-field={tinaField(action)} className="bg-foreground/10 rounded-full border p-0.5">
  <Button asChild size="lg" variant={action!.type === 'link' ? 'ghost' : 'default'} className="rounded-full px-6 text-base">

// NEW:
<div key={action!.label} data-tina-field={tinaField(action)}>
  <Button asChild size="lg" variant="default" className="rounded-none bg-black text-white font-bold hover:bg-black/80 px-8 h-12">
```

- [ ] **Step 2: Commit**

```bash
git add components/blocks/hero.tsx
git commit -m "design: giant hero headline, sharp black CTA buttons"
```

---

### Task 5: Redesign Features block

**Files:**
- Modify: `components/blocks/features.tsx`

Changes: black default background, remove CardDecorator, add oversized numbered prefix, white title text, zinc-400 body.

- [ ] **Step 1: Replace features.tsx with redesigned version**

```tsx
"use client";
import {
  PageBlocksFeatures,
  PageBlocksFeaturesItems,
} from "../../tina/__generated__/types";
import type { Template } from 'tinacms';
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { components } from "../mdx-components";
import { Icon } from "../icon";
import { iconSchema } from "../../tina/fields/icon";
import { Section } from "../layout/section";
import { sectionBlockSchemaField } from '../layout/section';

export const Features = ({ data }: { data: PageBlocksFeatures }) => {
  return (
    <Section background={data.background || "bg-black"}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-16">
          <h2
            data-tina-field={tinaField(data, 'title')}
            className="text-balance text-4xl font-black text-white lg:text-5xl"
          >
            {data.title}
          </h2>
          {data.description && (
            <p data-tina-field={tinaField(data, 'description')} className="mt-4 text-zinc-400">
              {data.description}
            </p>
          )}
        </div>
        <div className="grid gap-12 md:grid-cols-3">
          {data.items?.map((block, i) => (
            <Feature key={i} index={i} {...block!} />
          ))}
        </div>
      </div>
    </Section>
  );
};

const Feature: React.FC<PageBlocksFeaturesItems & { index: number }> = ({ index, ...data }) => {
  const num = String(index + 1).padStart(2, '0');
  return (
    <div>
      <span className="block text-5xl font-black text-gtc-primary opacity-40 leading-none mb-6">{num}</span>
      {data.icon && (
        <div className="mb-4">
          <Icon
            tinaField={tinaField(data, "icon")}
            data={{ size: "large", color: "teal", ...data.icon }}
          />
        </div>
      )}
      <h3
        data-tina-field={tinaField(data, "title")}
        className="text-lg font-bold text-white mb-3"
      >
        {data.title}
      </h3>
      <div className="text-sm text-zinc-400" data-tina-field={tinaField(data, "text")}>
        <TinaMarkdown content={data.text} components={components} />
      </div>
    </div>
  );
};

const defaultFeature = {
  title: "Here's Another Feature",
  text: "This is where you might talk about the feature.",
  icon: { name: "Tina", color: "white", style: "float" }
};

export const featureBlockSchema: Template = {
  name: "features",
  label: "Features",
  ui: {
    previewSrc: "/blocks/features.png",
    defaultItem: {
      title: 'Built to cover your needs',
      description: 'We have a lot of features to cover your needs',
      items: [defaultFeature, defaultFeature, defaultFeature],
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    { type: "string", label: "Title", name: "title" },
    { type: "string", label: "Description", name: "description" },
    {
      type: "object",
      label: "Feature Items",
      name: "items",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.title }),
        defaultItem: { ...defaultFeature },
      },
      fields: [
        iconSchema as any,
        { type: "string", label: "Title", name: "title" },
        { type: "rich-text", label: "Text", name: "text" },
      ],
    },
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add components/blocks/features.tsx
git commit -m "design: black features section with teal numbered items"
```

---

### Task 6: Redesign Stats block

**Files:**
- Modify: `components/blocks/stats.tsx`

Changes: giant stat numbers (`text-7xl font-black`), diagonal top edge via `clip-path`, negative top margin to overlap previous section.

- [ ] **Step 1: Replace stats.tsx with redesigned version**

```tsx
import type { Template } from "tinacms";
import { tinaField } from "tinacms/dist/react";
import { PageBlocksStats } from "@/tina/__generated__/types";
import { Section } from "../layout/section";
import { sectionBlockSchemaField } from '../layout/section';

export const Stats = ({ data }: { data: PageBlocksStats }) => {
  return (
    <div
      className="-mt-8 relative z-10"
      style={{ clipPath: 'polygon(0 32px, 100% 0, 100% 100%, 0 100%)' }}
    >
      <Section background={data.background || "bg-gtc-primary"}>
        <div className="mx-auto max-w-5xl px-6 pt-8">
          {(data.title || data.description) && (
            <div className="mb-12 text-center">
              {data.title && (
                <h2
                  className="text-4xl font-black text-black lg:text-5xl"
                  data-tina-field={tinaField(data, 'title')}
                >
                  {data.title}
                </h2>
              )}
              {data.description && (
                <p className="mt-3 text-black/70" data-tina-field={tinaField(data, 'description')}>
                  {data.description}
                </p>
              )}
            </div>
          )}
          <div className="grid divide-y divide-black/20 md:grid-cols-3 md:divide-x md:divide-y-0">
            {data.stats?.map((stat) => (
              <div key={stat?.type} className="py-8 text-center">
                <div
                  className="text-7xl font-black leading-none text-black lg:text-8xl"
                  data-tina-field={tinaField(stat, 'stat')}
                >
                  {stat!.stat}
                </div>
                <p
                  className="mt-3 text-sm font-bold uppercase tracking-widest text-black/60"
                  data-tina-field={tinaField(stat, 'type')}
                >
                  {stat!.type}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
};

export const statsBlockSchema: Template = {
  name: "stats",
  label: "Stats",
  ui: {
    previewSrc: "/blocks/stats.png",
    defaultItem: {
      title: "GTC v číslech",
      stats: [
        { stat: "50+", type: "spokojených firem" },
        { stat: "3", type: "oblasti expertízy" },
        { stat: "100%", type: "Gen Z tým" },
      ],
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    { type: "string", label: "Title", name: "title" },
    { type: "string", label: "Description", name: "description" },
    {
      type: "object",
      label: "Stats",
      name: "stats",
      list: true,
      ui: {
        defaultItem: { stat: "50+", type: "spokojených firem" },
        itemProps: (item) => ({ label: `${item.stat} ${item.type}` }),
      },
      fields: [
        { type: "string", label: "Stat", name: "stat" },
        { type: "string", label: "Type", name: "type" },
      ],
    },
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add components/blocks/stats.tsx
git commit -m "design: giant stat numbers with diagonal top edge"
```

---

### Task 7: Redesign Testimonials block

**Files:**
- Modify: `components/blocks/testimonial.tsx`

Changes: black default background, giant teal quote mark behind card, white text.

- [ ] **Step 1: Replace testimonial.tsx with redesigned version**

```tsx
import React from "react";
import type { Template } from "tinacms";
import { PageBlocksTestimonial, PageBlocksTestimonialTestimonials } from "../../tina/__generated__/types";
import { Section } from "../layout/section";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { tinaField } from "tinacms/dist/react";
import { sectionBlockSchemaField } from '../layout/section';

export const Testimonial = ({ data }: { data: PageBlocksTestimonial }) => {
  return (
    <Section background={data.background || "bg-black"}>
      <div className="text-center mb-12">
        {data.title && (
          <h2 className="text-3xl font-black text-white" data-tina-field={tinaField(data, 'title')}>
            {data.title}
          </h2>
        )}
        {data.description && (
          <p className="mt-4 text-zinc-400" data-tina-field={tinaField(data, 'description')}>
            {data.description}
          </p>
        )}
      </div>
      <div className="[column-width:320px] [column-gap:1.5rem]">
        {data.testimonials?.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial!} />
        ))}
      </div>
    </Section>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: PageBlocksTestimonialTestimonials }) => {
  return (
    <div className="relative mb-6 break-inside-avoid overflow-hidden rounded-none border border-white/10 bg-white/5 p-8">
      <span
        className="pointer-events-none absolute -top-4 left-4 select-none text-9xl font-black leading-none text-gtc-primary opacity-20"
        aria-hidden
      >
        "
      </span>
      <div className="relative z-10">
        <blockquote className="mb-6" data-tina-field={tinaField(testimonial, 'quote')}>
          <p className="text-base font-medium text-white leading-relaxed">{testimonial.quote}</p>
        </blockquote>
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            {testimonial.avatar && (
              <AvatarImage alt={testimonial.author!} src={testimonial.avatar} loading="lazy" width="120" height="120" />
            )}
            <AvatarFallback className="bg-gtc-primary text-black text-xs font-bold">
              {testimonial.author!.split(" ").map((word) => word[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-bold text-white" data-tina-field={tinaField(testimonial, 'author')}>
              {testimonial.author}
            </p>
            <p className="text-xs text-zinc-400" data-tina-field={tinaField(testimonial, 'role')}>
              {testimonial.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const testimonialBlockSchema: Template = {
  name: "testimonial",
  label: "Testimonial",
  ui: {
    previewSrc: "/blocks/testimonial.png",
    defaultItem: {
      testimonials: [
        {
          quote: "There are only two hard things in Computer Science: cache invalidation and naming things.",
          author: "Phil Karlton",
        },
      ],
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    { type: "string", label: "Title", name: "title" },
    {
      type: "string",
      label: "Description",
      name: "description",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      list: true,
      label: "Testimonials",
      name: "testimonials",
      ui: {
        defaultItem: {
          quote: "There are only two hard things in Computer Science: cache invalidation and naming things.",
          author: "Phil Karlton",
        },
        itemProps: (item) => ({ label: `${item.quote} - ${item.author}` }),
      },
      fields: [
        { type: "string", ui: { component: "textarea" }, label: "Quote", name: "quote" },
        { type: "string", label: "Author", name: "author" },
        { type: "string", label: "Role", name: "role" },
        { type: "image", label: "Avatar", name: "avatar" },
      ],
    },
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add components/blocks/testimonial.tsx
git commit -m "design: black testimonials section with teal quote glyph"
```

---

### Task 8: Redesign Case Studies block

**Files:**
- Modify: `components/blocks/case-studies.tsx`

Changes: teal left-border accent on cards, bolder section title, sharper card corners.

- [ ] **Step 1: Update card and title classNames in case-studies.tsx**

**8a.** Replace the section title className:
```tsx
// OLD:
className="mb-4 text-balance text-4xl font-bold lg:text-5xl"

// NEW:
className="mb-4 text-balance text-4xl font-black lg:text-5xl"
```

**8b.** Replace the card div className:
```tsx
// OLD:
className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"

// NEW:
className="flex flex-col gap-4 rounded-none border-l-4 border-l-gtc-primary border-t border-r border-b border-border bg-card p-6"
```

- [ ] **Step 2: Commit**

```bash
git add components/blocks/case-studies.tsx
git commit -m "design: teal left-border accent on case study cards"
```

---

### Task 9: Redesign CTA block

**Files:**
- Modify: `components/blocks/call-to-action.tsx`

Changes: larger, bolder headline; sharp buttons.

- [ ] **Step 1: Update title and button classNames in call-to-action.tsx**

**9a.** Replace the title `<h2>` className:
```tsx
// OLD:
className="text-balance text-4xl font-bold text-white lg:text-5xl"

// NEW:
className="text-balance text-5xl font-black text-white lg:text-6xl"
```

**9b.** Replace the CalendlyButton in the CTA (the one with `rounded-full bg-white text-gtc-deep`):
```tsx
// OLD:
<CalendlyButton url={calendlyUrl} label={action!.label!} className="rounded-full bg-white text-gtc-deep hover:bg-white/90 px-8" />

// NEW:
<CalendlyButton url={calendlyUrl} label={action!.label!} className="rounded-none bg-gtc-primary text-black font-bold hover:bg-gtc-primary/90 px-8 h-12" />
```

**9c.** Replace the leadMagnet Button className:
```tsx
// OLD:
className="rounded-full border border-white/40 px-8 text-base text-white hover:bg-white/10 hover:text-white"

// NEW:
className="rounded-none border-2 border-white px-8 text-base font-bold text-white hover:bg-white hover:text-gtc-deep h-12"
```

- [ ] **Step 2: Commit**

```bash
git add components/blocks/call-to-action.tsx
git commit -m "design: bigger CTA headline, sharp teal and outlined buttons"
```

---

### Task 10: Redesign Footer

**Files:**
- Modify: `components/layout/nav/footer.tsx`

Changes: change `bg-gtc-deep` to `bg-black`, bump logo to font-black.

- [ ] **Step 1: Update footer classNames**

**10a.** Replace the `<footer>` className:
```tsx
// OLD:
className="bg-gtc-deep text-white"

// NEW:
className="bg-black text-white"
```

**10b.** Replace the brand link className:
```tsx
// OLD:
className="text-xl font-bold tracking-tight"

// NEW:
className="text-xl font-black tracking-tight text-white"
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/nav/footer.tsx
git commit -m "design: black footer"
```

---

### Task 11: Verify visually in the browser

**Files:** none

- [ ] **Step 1: Start dev server**

```bash
pnpm dev
```

Open `http://localhost:3000/cs` and check each section top-to-bottom:
- Navbar: solid black, white text, teal sharp CTA button
- Hero: giant bold headline, black sharp CTA buttons
- Marquee ticker: scrolling text on black bar below hero
- Logo slider: clean white section
- Problem statement: dark teal, bigger prose (already good)
- Features: black background, numbered `01`/`02`/`03`, white titles
- Case studies: teal left-border cards
- Stats: giant numbers, diagonal top edge, teal background
- Testimonials: black background, teal quote glyph behind cards
- Team: off-white (unchanged)
- CTA: bigger headline, teal + outlined buttons
- Footer: solid black

- [ ] **Step 2: Fix any visual issues found during review**

- [ ] **Step 3: Final commit if any fixes made**

```bash
git add -p
git commit -m "design: visual polish fixes"
```
