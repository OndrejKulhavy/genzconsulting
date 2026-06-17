import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Layout from '@/components/layout/layout';
import CaseStudyDetail from '@/components/pages/case-studies/CaseStudyDetail';
import { caseStudySlugs, getCaseStudy } from '@/components/pages/case-studies/case-study-data';
import { routing } from '@/i18n/routing';

export const revalidate = 300;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    caseStudySlugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const cs = getCaseStudy(slug, locale);
  if (!cs) return {};
  const title = `${cs.client} — ${locale === 'en' ? 'Case study' : 'Case study'} | GenZ Consulting`;
  return {
    title,
    description: cs.hero.intro,
    openGraph: { title, description: cs.hero.intro },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!getCaseStudy(slug, locale)) notFound();

  return (
    <Layout>
      <CaseStudyDetail slug={slug} />
    </Layout>
  );
}
