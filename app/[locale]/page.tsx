// app/[locale]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import client from '@/tina/__generated__/client';
import Layout from '@/components/layout/layout';
import ClientPage from '@/app/[locale]/[...urlSegments]/client-page';

export const revalidate = 300;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let data;
  try {
    data = await client.queries.page({ relativePath: `${locale}/home.mdx` });
  } catch {
    notFound();
  }
  return (
    <Layout rawPageData={data}>
      <ClientPage {...data} />
    </Layout>
  );
}
