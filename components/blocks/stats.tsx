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
