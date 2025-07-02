// @ts-check
import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';
import vercel from '@astrojs/vercel';

const bobaGrammar = JSON.parse(
  readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src/grammars/boba.tmLanguage.json'), 'utf-8'),
);

// https://astro.build/config
export default defineConfig({
  site: 'https://solivan.dev',
  integrations: [
    expressiveCode({
      shiki: {
        langs: [
          {
            id: 'boba',
            scopeName: 'source.boba',
            aliases: ['boba'],
            ...bobaGrammar,
          },
        ],
      },
    }),
    mdx(),
    sitemap(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});