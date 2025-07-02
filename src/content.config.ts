import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    lastmod: z.coerce.date().optional(),
    author: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    weight: z.number().nullable().optional(),
    slug: z.string().optional(),
    draft: z.boolean().default(false),
    comments: z.boolean().optional().default(true),
    showToc: z.boolean().optional().default(true),
    TocOpen: z.boolean().optional().default(false),
    hidemeta: z.boolean().optional().default(false),
    disableShare: z.boolean().optional().default(true),
    showbreadcrumbs: z.boolean().optional().default(true),
    cover: z
      .object({
        image: z.string().optional(),
        caption: z.string().optional(),
        alt: z.string().optional(),
        relative: z.boolean().optional(),
      })
      .optional(),
    heroImage: z.string().optional(),
  }),
});

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    lastmod: z.coerce.date().optional(),
    author: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
    showToc: z.boolean().optional(),
    summary: z.string().optional(),
    weight: z.number().nullable().optional(),
    slug: z.string().optional(),
    comments: z.boolean().optional(),
    TocOpen: z.boolean().optional(),
    hidemeta: z.boolean().optional(),
    disableShare: z.boolean().optional(),
    showbreadcrumbs: z.boolean().optional(),
    cover: z
      .object({
        image: z.string().optional(),
        caption: z.string().optional(),
        alt: z.string().optional(),
        relative: z.boolean().optional(),
      })
      .optional(),
  }),
});

export const collections = { blog, pages };
