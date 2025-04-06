/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

// Define Vitest specific config directly
// https://docs.astro.build/en/guides/testing/#vitest
export default getViteConfig ({
  test: {
      environment: 'jsdom', // Use jsdom for DOM simulation
      globals: true, // Make Vitest APIs global (describe, it, expect)
      setupFiles: ['./src/vitest.setup.ts'], // Run setup file before tests
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/tests/**', // Exclude playwright tests folder
        '**/test-results/**',
        'playwright.config.ts',
        'astro.config.mjs',
        'tailwind.config.ts',
        'biome.json',
        'scripts/**',
        'vitest.config.ts', // Exclude self
      ],
      // Include source files for coverage, adjust pattern as needed
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        include: ['src/components/FormattedDate.astro'], // Focus coverage on the target component
        exclude: [
          'src/env.d.ts',
          'src/pages/**',
          'src/layouts/**',
          'src/content/**',
          'src/lib/**', // Exclude lib unless testing utils specifically
          'src/styles/**',
          'src/consts.ts',
          'src/vitest.setup.ts',
          '**/node_modules/**',
          '**/dist/**',
          '**/tests/**', // Exclude playwright tests folder
          '**/test-results/**',
          'playwright.config.ts',
          'astro.config.mjs',
          'tailwind.config.ts',
          'biome.json',
          'scripts/**',
          'vitest.config.ts', // Exclude self
        ],
      },
    },
  },
);