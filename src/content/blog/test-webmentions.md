---
title: 'Testing Webmentions Integration'
date: 2025-09-30T00:00:00-08:00
lastmod: 2025-09-30T00:00:00-08:00
author: ['Danny']
categories:
  - blog
tags:
  - test
  - webmentions
  - indieweb
description: 'A test post to verify webmentions and social syndication are working correctly'
slug: 'test-webmentions'
draft: false
comments: true
showToc: false
---

This is a test post to verify that our webmentions integration is working correctly.

## Features to Test

1. **Webmention Discovery**: The webmention endpoints should be discoverable in the HTML head
2. **Syndication**: This post can be syndicated to Bluesky and Mastodon
3. **Comment Display**: Comments from social media should appear below via Bridgy
4. **Caching**: The multi-layer caching system should prevent API hammering

## How It Works

When this post is syndicated to social media:
- People can reply on Bluesky or Mastodon
- Bridgy polls these platforms (~30 minute intervals)
- Bridgy sends webmentions to webmention.io
- Our client-side JavaScript fetches and displays the comments

## Next Steps

After setting up your accounts:
1. Run `npm run syndicate -- --post="blog/test-webmentions"`
2. Wait for Bridgy to poll
3. Check back to see comments appearing

The caching system ensures we won't exceed API limits even with many visitors.