# solivan-dev-v3

![License](https://img.shields.io/github/license/nightconcept/almandine)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/nightconcept/solivan-dev-v3/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/nightconcept/solivan-dev-v3/badge.svg)](https://coveralls.io/github/nightconcept/solivan-dev-v3)
![GitHub last commit](https://img.shields.io/github/last-commit/nightconcept/solivan-dev-v3)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/nightconcept/astro-solivan-dev-v3/badge)](https://scorecard.dev/viewer/?uri=github.com/nightconcept/astro-solivan-dev-v3)

Personal website and blog using:

- Astro
- Tailwind 4 + Typography
- Vercel

I may be switching/switched from Hugo in April 2025. I built this site primarily
using Vercel's v0 for the layout and previewing and Gemini 2.5 Pro. The styling
is heavily based off of
[PaperMod](https://adityatelange.github.io/hugo-PaperMod/).

## Usage

Run local server:

```
pnpm dev
```

Make a new post (creates a new Markdown file in content/blog/ folder using
app/templates/blog.md as a template):

```
pnpm blog "Cool new post"
```
