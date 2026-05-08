// app/[locale]/[...urlSegments]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import client from '@/tina/__generated__/client';
import Layout from '@/components/layout/layout';
import { Section } from '@/components/layout/section';
import ClientPage from './client-page';

export const revalidate = 300;

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; urlSegments: string[] }>;
}) {
  const { locale, urlSegments } = await params;
  const filepath = urlSegments.join('/');
  let data;
  try {
    data = await client.queries.page({ relativePath: `${locale}/${filepath}.mdx` });
  } catch {
    notFound();
  }
  return (
    <Layout rawPageData={data}>
      <Section>
        <ClientPage {...data} />
      </Section>
    </Layout>
  );
}

export async function generateStaticParams() {
  let pages = await client.queries.pageConnection();
  const allPages = pages;

  if (!allPages.data.pageConnection.edges) return [];

  while (pages.data.pageConnection.pageInfo.hasNextPage) {
    pages = await client.queries.pageConnection({
      after: pages.data.pageConnection.pageInfo.endCursor,
    });
    if (!pages.data.pageConnection.edges) break;
    allPages.data.pageConnection.edges.push(...pages.data.pageConnection.edges);
  }

  return (allPages.data?.pageConnection.edges ?? [])
    .map((edge) => {
      const [locale, ...rest] = edge?.node?._sys.breadcrumbs ?? [];
      return { locale, urlSegments: rest };
    })
    .filter(({ urlSegments }) => urlSegments.length >= 1)
    .filter(({ urlSegments }) => !urlSegments.every((s) => s === 'home'));
}
