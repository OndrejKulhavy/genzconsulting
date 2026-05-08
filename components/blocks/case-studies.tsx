'use client';
import React from 'react';
import Image from 'next/image';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';

export const CaseStudies = ({ data }: { data: any }) => {
  return (
    <Section background={data.background ?? ''}>
      <div className="mx-auto max-w-6xl">
        {data.title && (
          <h2
            className="mb-4 text-balance text-4xl font-black lg:text-5xl"
            data-tina-field={tinaField(data, 'title')}
          >
            {data.title}
          </h2>
        )}
        {data.description && (
          <p
            className="mb-12 max-w-2xl text-muted-foreground"
            data-tina-field={tinaField(data, 'description')}
          >
            {data.description}
          </p>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.items?.map((item: any, i: number) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-none border-l-4 border-l-gtc-primary border-t border-r border-b border-border bg-card p-6"
              data-tina-field={tinaField(item)}
            >
              <div className="flex items-center gap-3 min-h-[2rem]">
                {item?.logo ? (
                  <Image
                    src={item.logo}
                    alt={item.client ?? ''}
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain"
                    data-tina-field={tinaField(item, 'logo')}
                  />
                ) : (
                  <span className="text-base font-semibold" data-tina-field={tinaField(item, 'client')}>
                    {item?.client}
                  </span>
                )}
              </div>

              {item?.service && (
                <span className="inline-flex w-fit items-center rounded-full bg-gtc-primary/15 px-3 py-1 text-xs font-medium text-gtc-dark">
                  {item.service}
                </span>
              )}

              {item?.description && (
                <p className="text-sm text-muted-foreground" data-tina-field={tinaField(item, 'description')}>
                  {item.description}
                </p>
              )}

              {item?.result && (
                <p
                  className="mt-auto border-t border-border pt-4 text-sm font-medium"
                  data-tina-field={tinaField(item, 'result')}
                >
                  {item.result}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export const caseStudiesBlockSchema: Template = {
  name: 'caseStudies',
  label: 'Case Studies',
  ui: {
    defaultItem: {
      title: 'Naše práce',
      items: [{ client: 'Klient', service: 'Workshop' }],
    },
  },
  fields: [
    { type: 'string', label: 'Background', name: 'background' },
    { type: 'string', label: 'Title', name: 'title' },
    {
      type: 'string',
      label: 'Description',
      name: 'description',
      ui: { component: 'textarea' },
    },
    {
      type: 'object',
      label: 'Case Studies',
      name: 'items',
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.client || 'Case Study' }),
        defaultItem: { client: 'Klient', service: 'Workshop' },
      },
      fields: [
        { type: 'string', label: 'Client Name', name: 'client' },
        { type: 'image', label: 'Client Logo', name: 'logo' },
        { type: 'string', label: 'Service Type', name: 'service' },
        {
          type: 'string',
          label: 'Description',
          name: 'description',
          ui: { component: 'textarea' },
        },
        {
          type: 'string',
          label: 'Result / Impact',
          name: 'result',
          ui: { component: 'textarea' },
        },
      ],
    },
  ],
};
