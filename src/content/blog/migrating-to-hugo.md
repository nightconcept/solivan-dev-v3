---
title: 'Migrating to Hugo'
date: 2024-03-13T15:12:47-07:00
lastmod: 2024-03-13T15:12:47-07:00
author: ['Danny']
categories:
  - blog
tags:
  - opinion
description: ''
weight: # 1 means pin the article, sort articles according to this number
slug: ''
draft: false # draft or not
comments: true
showToc: true # show contents
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

This is my first post using [Hugo](https://gohugo.io/), a static site generator,
with the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme. I
migrated from a self-built [Svelte-Kit](https://kit.svelte.dev/) based
[JAMStack](https://jamstack.com/). This gave me an opportunity to use a simpler
to manage stack of getting content out there. I got to dip my toes into the
world of a front-end web developer.

## Why did I switch?

I quickly learned front-end is not for me. I don't have an eye for colors and
style. The result was a not-very beautiful layout compared to some of my
inpsirations. What I really cared more about was creating _content_. I think the
level of extra maintenance with a self-built platform (we can ignore how much
there actually was) was just enough friction to get me not writing. I also had
to hand create every Markdown file and I didn't have much energy/interest to get
that automated and running.

I could have persisted, but my energy and time has shifted for developing. I
have a 1-year old son who I have to chase around so time to just tinker with
something I've lost interest in is just not very compelling! I know I can learn
and make it easier, but then my challenge is I am just no longer interested.
_And that is ok with me._ I am stil on a journey to learn new things.

## Using Hugo

I converted a few weeks ago to Hugo and I got to use the CLI, but I forgot most
of them since them. Simply put here's a very crash course of how I do things.

### Creating a new post (example)

```
hugo new content/blog/migrating-to-hugo.md
```

### Generating the html files

```
hugo
```

### Creating a local server you can browse to

```
hugo server
```

## What else have I been doing?

I have been tinkering with homelabbing and diving into
[Nix and NixOS](https://nixos.org/). I plan to have another post that talks
about my entire journey through Linux and how I landed at Nix and NixOS. I am
still wading through (and will eternally be) my
[nightconcept/dotfiles](https://github.com/nightconcept/dotfiles) and have been
migrating to a Nix-based at
[nightconcept/dotfiles-nix](https://github.com/nightconcept/dotfiles-nix).

I have also officially started working as a software engineer at Garmin in
October 2023. I have not moved companies, but I move all the way to the other
side of campus. That said, I feel like I have even less desire to program
outside of work. I do however have a stronger attraction for
programming-adjacent activities such as learning all sorts of IT and DevOps
things.
