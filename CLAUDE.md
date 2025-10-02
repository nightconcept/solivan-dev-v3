# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
```bash
pnpm dev         # Start development server at http://localhost:4321
pnpm build       # Build for production
pnpm preview     # Preview production build locally
```

### Code Quality
```bash
pnpm format      # Format code using Biome
pnpm lint        # Lint and fix code using Biome
```

### Testing
```bash
pnpm test:unit       # Run unit tests with Vitest
pnpm test:coverage   # Run tests with coverage report
pnpm test:e2e        # Run Playwright end-to-end tests
pnpm test            # Run all tests (unit and e2e)
```

### Content Creation
```bash
pnpm blog "Your Post Title"  # Create new blog post from template
```

## Project Architecture

### Tech Stack
- **Framework**: Astro 5 with MDX support
- **Styling**: Tailwind CSS 4 with Typography plugin
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Code Quality**: Biome for formatting and linting, Husky for git hooks
- **Deployment**: Vercel

### Directory Structure
```
src/
├── components/      # Reusable Astro components
├── content/        # Blog posts and pages content (Markdown/MDX)
│   ├── blog/      # Blog posts
│   └── pages/     # Static pages
├── layouts/        # Page layouts (BaseLayout.astro)
├── pages/          # Route pages (file-based routing)
│   ├── blog/      # Blog routes
│   └── tags/      # Tag pages
├── lib/           # Utility functions and helpers
├── styles/        # Global styles
└── templates/     # Content templates for blog posts
```

### Content Collections

The site uses Astro Content Collections defined in `src/content.config.ts`:

- **blog**: Blog posts with comprehensive frontmatter (title, date, tags, categories, etc.)
- **pages**: Static pages with similar frontmatter structure

### Key Components

- **BaseLayout.astro**: Main layout wrapper for all pages
- **Header.astro**: Site navigation and theme toggle
- **BlogPostList.astro**: Displays paginated blog posts
- **TableOfContents.astro**: Auto-generated TOC for articles
- **FormattedDate.astro**: Consistent date formatting

### Routing

- `/` - Homepage with latest posts
- `/blog` - Blog listing page
- `/blog/[slug]` - Individual blog posts
- `/tags/[tag]` - Posts filtered by tag
- `/[...slug]` - Dynamic pages from content collection
- `/rss.xml` - RSS feed

### Testing Strategy

- **Unit Tests**: Located alongside components (e.g., `FormattedDate.test.ts`)
- **E2E Tests**: In `tests/` directory, testing critical user flows
- **Coverage**: Focus on component logic, excluding pages and static files

### Code Style

- Biome configuration enforces consistent formatting (120 char lines, double quotes, semicolons)
- TypeScript for type safety
- Astro files linted with specific rules to handle component structure