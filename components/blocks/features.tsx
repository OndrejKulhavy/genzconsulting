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
