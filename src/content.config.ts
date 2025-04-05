import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string().optional(), // Made optional as it can be empty
    // Use 'date' and 'lastmod' to match the markdown frontmatter
    date: z.coerce.date(), // Primary publication date
    lastmod: z.coerce.date().optional(), // Last modification date
    author: z.array(z.string()).optional(), // Array of authors
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    weight: z.number().nullable().optional(), // Allow number, null, or undefined
    slug: z.string().optional(), // Optional slug override
    draft: z.boolean().default(false), // Default to not draft
    comments: z.boolean().optional().default(true),
    showToc: z.boolean().optional().default(true),
    TocOpen: z.boolean().optional().default(false), // Default to closed TOC
    hidemeta: z.boolean().optional().default(false),
    disableShare: z.boolean().optional().default(true),
    showbreadcrumbs: z.boolean().optional().default(true),
    cover: z.object({
        image: z.string().optional(),
        caption: z.string().optional(),
        alt: z.string().optional(),
        relative: z.boolean().optional(),
      }).optional(),
    // Keep heroImage if it's used elsewhere, or remove if cover.image replaces it
    heroImage: z.string().optional(), // Assuming this might still be used or was legacy
  }),
});

export const collections = { blog };
