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
