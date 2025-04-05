---
title: 'Sweat the Small Things'
date: 2025-03-19T11:00:52-07:00
lastmod: 2025-03-19T11:00:52-07:00
author: ['Danny']
categories:
  - blog
tags:
  - lessons learned
description: ''
weight: # 1 means pin the article, sort articles according to this number
slug: ''
draft: false # draft or not
comments: true
showToc: false # show contents
TocOpen: true # open contents automantically
hidemeta: false # hide information (author, create date, etc.)
disableShare: true # do not show share button
showbreadcrumbs: true # show current path
cover:
  image: ''
  caption: ''
  alt: ''
  relative: false
---

Today, I had an issue with my [Hugo](https://gohugo.io/) and
[PaperMod](https://github.com/adityatelange/hugo-PaperMod) powered blog. Hugo
and PaperMod are the only 2 dependencies in my blog and I figured I'd pull them
up. I started with pulling up PaperMod, but had issues with minimum version. I
thought I was on a new enough version of Hugo (0.138 from my recollection) on
Windows, but the pushed site still did not render properly on Vercel.

I switched over to my Mac, ran `nix flake update` and my site built and rendered
properly on Vercel again. OK! Now I'm up and running again!

I noticed that my blogs's favicon was not showing up on Vercel and at the
webpage. What gives? I had to do a bit of searching thinking Hugo was the
problem, but it turns out PaperMod's pathing relies on it being in a static/
path to be defined in the config.yml.
[This discussion](https://github.com/adityatelange/hugo-PaperMod/discussions/953)
is eventually what led me to the right answer to fix my file paths and there's
also a good FAQ answer.

That said, this also led me to
[Jesse Wei's blog](https://jessewei.dev/blog/2023/papermod/) about how he
switched from Hugo/PaperMod to
[Jekyll](https://jekyllrb.com/)/[al-folio](https://github.com/alshedivat/al-folio).
Jesse also pointed out the problems of PaperMod and how many missing features
there are. [PaperModX](https://github.com/reorx/hugo-PaperModX) attempts to
address these lack of features, but it does not get much maintenance due to the
author of PaperModX's commitments to other projects. This leaves PaperMod(X)
users fragmented. Unfortunately, I am stuck between which to use and I want my
core job here to be blogging, not how to maintain my blog's codebase. I switched
from a self-built platform so that I could be free of that and rely on libraries
maintained by others.

I think through all my [previous](https://www.solivan.dev/blog/what-is-this/)
[thoughts](https://www.solivan.dev/blog/goals/) about
[blogs](https://www.solivan.dev/blog/migrating-to-hugo/) and how I interact with
them, I want to try playing around with more static site generators. I should
diversify what off-the-shelf SSG I use. The next question though is how
interoperable are my markdown files between the different SSGs? How much will I
have to modify the frontmatter of each Markdown file to make it work? I guess
that's the next thing to sweat over.

So what is the moral of the story? Well, it was that at each step of the way I
learned a little. Sure, I was stressed trying to find the answer to each
question that came up, but at the end of it, I grew just a little bit. I also
used this blog post to reflect on it.
