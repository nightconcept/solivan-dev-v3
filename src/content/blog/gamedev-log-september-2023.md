---
title: Gamedev Log September 2023
date: 2023-09-26
readTime: 2
updated:
status: published
author: ['Danny']
categories:
  - blog
tags:
  - game-dev
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

I started doing game development again this month. I have chosen to use
[pygame-ce](https://pyga.me/) as my framework so that I can work in Python. When
I last started in 2020, I had chosen the [Love2D](https://love2d.org/) framework
which used Lua as the programming language. My original thoughts were that I
gave up on gamedev because I was working in a language that would never be used
outside of programming. There wasn't enough in Lua itself to keep me fully
interested in it, so I abandoned it.

I recently got a new job at my company as a software engineer. I knew I would be
working in C, C#, and Python. Python I think is one of the more fun languages,
so that's how I ended up at pygame.

I had watched a [video](https://www.youtube.com/watch?v=lzHLPaU7UUE) by Coding
with Russ on his journey of using pygame over 2 years. His journey started with
re-implementing classic games up to a fighting game and dungeon crawler. I
wanted to emulate that and started reimplementing pong.

I implemented pong twice in pygame. The first time was basically a riff on Tech
with Tim's [tutorial](https://www.youtube.com/watch?v=vVGTZlnnX3U) on it. I
wasn't fully satisfied with the way the tutorial implemented the game (and it
had some bugs) so I redid it with proper classes. He did use some classes, but I
think I ignored that refactor in favor of doing it on my own. I am now on my
third iteration, but I am implementing the
[Entity-Component-System](https://en.wikipedia.org/wiki/Entity_component_system).
The ECS system is definitely overkill for pong, but I really just wanted to
learn how the design pattern worked. I am debating on finishing this
implementation...

After the second pong implementation, I went into breakout which is very similar
to pong in a lot of physics and gameplay. I didn't actually complete the
implementation as I got bored. I may revisit this sometime when I feel like I
need it.

I think one of my challenges is fighting boredom and lack of focus. I want to
flex my programming skills, but I cannot drive myself to complete the actual
project. While I did finish 2 pong implementations and posted it to
[GitHub](https://github.com/nightconcept/pong-pygame), I haven't finished the
final one and gave up on breakout. Maybe I am just looking at this too
negatively. Right now as I write this, I am thinking about how I'm not going to
work on ECS pong today. I am thinking about starting an original game soon
rather than a re-implementation. I am thinking this game will bring back the
interest in making a game.

I will have to come up with a workflow on creating a new game. Starting with
requirements and art before diving into coding. I will want to run it in the ECS
system. I will want to create some tools to prototype more levels. It will be a
fun project I think over just re-implementing something that's been done.
