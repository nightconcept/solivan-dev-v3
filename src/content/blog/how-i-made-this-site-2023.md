---
title: How I Made This Site (2023 Edition)
date: 2023-04-24
readTime: 10
updated:
status: published
author: ['Danny']
categories:
  - blog
tags:
  - web-dev
description: ''
weight: # 1 means pin the article, sort articles according to this number
slug: ''
draft: false # draft or not
comments: true
showToc: false # show contents
TocOpen: false # open contents automantically
hidemeta: false # hide information (author, create date, etc.)
disableShare: true # do not show share button
showbreadcrumbs: true # show current path
cover:
  image: ''
  caption: ''
  alt: ''
  relative: false
---

Despite how long this site has been up, I actually started in March 2023. This
is not an explicit tutorial, but you could probably follow along and get through
building your own similar site if you wanted.

My goal of this guide is to give you the exact steps on how to build this site.
My goal is to explain a little bit about what I know of the web (which I am not
an expert by a longshot) and the design decisions I made to build this in 2023.
If you want step-by-step guides, here are some that I used or referred to:

- [Let's learn SvelteKit by building a static Markdown blog from scratch](https://joshcollinsworth.com/blog/build-static-sveltekit-markdown-blog)
- [Embed Media Components using MDX](https://cloudinary.com/blog/guest_post/Embed-media-components-using-MDX-and-SvelteKit)
  (Pre-SvelteKit 1.0)
- [Using mdsvex with SvelteKit (Markdown + Svelte!)](https://www.youtube.com/watch?v=LutB0Ih0nXQ)
  (Pre-SvelteKit 1.0)
- [sw-yx/swyxkit: An opinionated blog starter for SvelteKit + Tailwind + Netlify. Refreshed for SvelteKit 1.0!](https://github.com/sw-yx/swyxkit)

## Story Time

A short history about me, I had previously done "web development" in grade
school coding just HTML. I "discovered" CSS around middle school and did my
layouts via tables (this was in vogue at the time, I swear). I eventually took a
web development class in high school which then amounted to just re-learning
HTML and CSS.

Fast forward about a decade and I am discovering the entire node, JS, and React
ecosystem. I absolutely hate it and I can't make heads or tails of it. I
definitely went about it the wrong way going from the tooling of React and every
library I should be using towards learning JS. As in, I tried tolearn everything
in reverse. I did not make it very far.

Maybe 7 years later, I happened to find the State of JS survey for 2022. I saw
that Svelte was the newest hot framework over React. I went to YouTube to find
out how to use it. My mind was blown. Gone were the days of returning HTML code
and using a library for state management. The future was here where I could just
write HTML code with JS to augment it in a simple fashion.

## Pre-SvelteKit 1.0 Notes

Somewhere during the initial inception of this site (March 2022) and today
(April 2023), SvelteKit hit 1.0. This shift affected me greatly as I was not
keeping up with web development at all and I didn't expect such consequential
changes. The thing that hit me the most was the routing changes to no longer
lead to .svelte files, but to the +page.svelte file and now relies on folders to
determine the name of the route. My main complaint with this method is that I
now have many, many +page.svelte files open and I'm not always 100% sure which
route it pertains to. I do get the benefit of the other "+" named files which do
help clarify explicitly which each does, but I liked the simplicity of the file
name = route structure of the framework.

Anyways, that's my rant about the changes. I still like SvelteKit overall and
will continue to use it for this site until I find a reason to switch to the new
shiny toy _and_ I need to refresh my development skills. (Isn't it obvious I
take lots of breaks from web development?)

My final note is that the rest of the guide will retcon history that I started
coding on SvelteKit 1.0 in the first place unless specifically mentioned.

## Guide Time or "So you want to build a JAMstack?"

### Design

OK, what is a JAMstack? The JAM stands for JavaScript, API, and Markup. However,
JAMstack is defined as the following by [Jamstack](https://jamstack.com/):

> Jamstack is an architectural approach that decouples the web experience layer
> from data and business logic, improving flexibility, scalability, performance,
> and maintainability. Jamstack removes the need for business logic to dictate
> the web experience.
>
> It enables a composable architecture for the web where custom logic and 3rd
> party services are consumed through APIs.

Now what does this mean in more specific terms? Your website (consisting of
typically HTML/CSS/JS) is seperated from the data. This lets you change things
like your layout or tech (ex: I want to move from React to Svelte). This
decoupling (if implemented correctly) will make changes for (worst case someone
else who doesn't like your tech choices) you to change part of the tech stack
without having to start from the beginning.

This guide will use the following for each level:

- Javascript - _Language/File-type: Svelte & Typescript_ - This will handle all
  the user interaction and talk to the API.
- APIs - _Language/File-type: Typescript_ - The API that runs this site simply
  has to access the Markdown files. No databases were used in the creation of
  this site.
- Markup - _Language/File-type: Markdown_ - I used simple Markdown files with
  the [mdsvex](https://mdsvex.com/) library designed for Svelte.

### Setup

I'm not going to go deep dive into pre-requisites and setup instructions. You
can find the general "Getting Started" sections of the various tools I used.
Also, I am primarily a Windows user due to my work and I spend most of my time
on a Windows PC for gaming at home. I do however have a Mac I use to also
develop and a Linux partition for when I'm feeling bored.

#### The Tools

- `scoop` - Command-line installer for Windows which is used to install all of
  the following tools.
- `fnm` - Fast node manager for picking which version of node you'll run on your
  machine. Considered faster than `nvm` which does something similar.
- `pnpm` - Faster and more effective (spacewise) node package manager than
  `npm`. It runs almost exactly the same as when calling the `npm` command.
- `vscodium` - Open-source and telemetry free version of VSCode. Looks/feels
  almost exactly the same as VSCode.

_Disclaimer: I understand there may be better use-cases for the other tools like
nvm or npm or VSCode, but I found these to fit my personal needs without
compromising the usability of tutorials on the web by picking something a little
less mainstream/non-interopable._

### Markup - Markdown

We'll start at the "back" of the overall stack. Jamstacks inherently do not have
a database. In most cases you would use a Jamstack for a static website that
does not rely on data stored in a database. If you haven't learned how to use
Markdown in your coding career, you should do so. It is the defacto markup
language for every readme file. For this site, I simply stored it in a
`src/data/posts`. This does not conflict with the
[SvelteKit project structure](https://kit.svelte.dev/docs/project-structure). As
mentioned before, mdsvex is the library to use to be able to render Markdown
files.

### API

This is the layer I had the most trouble with. This is however mostly because I
do not have a lot of experience with JavaScript/TypeScript. I have gone through
the excellent [freeCodeCamp](https://www.freecodecamp.org/) tutorials in
JavaScript, but my poor practice and reptition made me forget.

There are two primary APIs that exist:

- `src/routes/api/posts.json` - This endpoint lists all of the markdown files
  contained in `src/data/posts` in sorted order by data in the frontmatter. My
  biggest challenge here was getting the glob to work correctly. It was really
  hard for me to determine the pathing to the file. I wanted to store the
  markdown files in the `/static` folder, but I get warnings for doing that.
  This endpoint is called on the "index" of the routes folder
  (`src/routes/+page.svelte`) and on the blog page.
- `src/lib/server/posts.ts` - This endpoint is actually called when
  `src/routes/blog/[slug]/+page.ts` is called. posts.ts searches for the
  appropriate .md file with [slug] in the name and returns it.

For something as simple as a blog, not much else is needed. Each API can vary a
bit depending on what you want to show. I've seen some Jamstacks return
previous/next posts relative to the current one. You can also do features like
"series" that return almost like a linked list of files.

### Frontend

This layer consists of Svelte, TypeScript, HTML, and CSS files. Svelte is a very
easy framework to work with as it writes just like HTML with some "Svelte-isms"
embedded within. TypeScript files are used to function as "on load" type events
(specifically +page.ts) whenever that page is loaded.

How to properly use CSS is a bit of a polarizing topic in the web development
community. On one end, CSS frameworks provide plenty of already written CSS code
so you don't have to. On the other end, CSS frameworks are viewed as bloated and
too opinionated. At the end of the day, both solutions have trade-offs and you
need to choose the one that's best for your usecase. I do not have an eye for
design, nor do I want to spend time writing CSS code, so I opted to use
[Tailwind CSS](https://tailwindcss.com/). My goal was to learn to build a site,
not write CSS all day.

## Let's DEPLOY

Local development is pretty easy. Just run `pnpm dev`! Now what? _Back in my
day,_ I used to have to manually drag and drop files through an FTP server!
Nowadays, the whole deployment pipeline is streamlined thanks to sites like
[Vercel](https://vercel.com/home) and [Netlify](https://www.netlify.com/). These
sites can link up a GitHub repo that is automatically deployed every time you
push (or as you define it) and also provide effectively give you free hosting
below a certain bandwidth and storage space. This is definitely amazing
developer experience. Here's the gist of the deployment chain I use:

1. Push to GitHub - Usually on main for better or worse. Sometimes on a branch
   if I am working on a new feature I don't want to deploy yet. Vercel also has
   automated preview branches that take in changes to a branch which is prety
   neat.
2. GitHub Actions happen - We'll go into detail what I currently run below!
3. Vercel deployment - This technically happens as a part of GitHub Actions, but
   I wanted to keep it as a distinct section of the deployment chain.

_Disclaimer: This site is hosted on Vercel. I am not sponsored by them and
everything positive I say is because of my own personal experience._

### GitHub Actions

- CodeQL - This is my very first GitHub action I implemented. The marketplace
  makes it really easy to stick in actions. This essentially performs security
  checks on your code. Low friction to set up makes it a no-brainer.
- Nightly pnpm-lock.json update
- Playwright automated testing - First time successfully getting testing
  working. Very easy to use the Playwright CLI to start building navigation.
- Dependabot - I learned what it actually does after seeing it in so many places
  in GitHub repos. It just helps you keep some critical dependencies up to date
  especially for security purposes. Using the yml file is better than just
  clicking the settings file because it clearly signals that you follow secure
  practices.
- Vercel

## That's all folks!

There you have it, a general and very abridged version of how this site was
built. Hopefully this may be useful for you, but if not I'll tell you this will
be useful for me in the future when I have forgotten how and why I did
everything the way I did it.
