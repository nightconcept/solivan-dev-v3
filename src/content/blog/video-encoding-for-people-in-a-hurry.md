---
title: Video Encoding for People in a Hurry
date: 2023-04-25
updated:
ogpublished:
status: draft
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

This a quick _opinionated_ guide towards encoding your videos for your data
hoarding habits. [HandBrake](https://handbrake.fr/) is an open-source tool that
is widely used by many to convert videos. It is available on
Windows/macOS/Linux, so chances are you can use it. HandBrake itself is mostly
an easy to use GUI that call various audio and video codecs so you don't have to
learn how to use those individual (mostly command-line) tools. This is an
article for people in a hurry so let's get going!

_Disclaimer: This isn't an attempt at authoritative way to encoding videos and I
by no means know it all._

## One large, one medium, and one small pre-encoding decision

Think of a target file-size you want to go for. I can help you visualize this. I
would say I care at little bit about video quality and I like the video quality
of a 2 hour movie at 720p at 3GB. However for a show (25-50 minutes) which can
have many episodes, I am willing to sacrifice quality for a smaller file size. I
end up preferring TV shows be around 300MB to 600MB per episode for me. These
are about the file sizes I use on my personal Plex that I share with a few
friends. How big do you want your movie or your show to be? This is your **big**
decision.

What resolution do you want your video to be? I choose 720p as the lowest
default for shows and movies, 1080p for some movies, and 4k for those really
special ones I want to actually watch on a 4k TV and don't care as much about
file sizes. This choice can greatly affect the file size, but we'll ignore that
for a bit.

Your small decision is: how much do I care about "artifacts" appearing on
screen? And am I willing to give up more space to make these go away? These can
be little black squares that appear on the screen. In movies, this bothers me a
lot as I feel the director would not have intended me to see that. On TV shows,
I generally care less about this since it's about quantity, not quality. If you
answered "no I don't care about artifacts to save more space," just remember
your desired encoder will be x265. If you answered "I do care about artifacts
and space is not an issue," then your desired encoder will be x264.

## Let's get encoding

1. Install [HandBrake](https://handbrake.fr/).
2. Load up your source file. Most mainstream files are accepted so you won't
   have to really think if yours will work.
3. Start with a defined preset and we can go from there. When picking presets,
   the important thing to look at is the resolution (e.g. 4k aka 2160p, 1080p,
   720p, etc.). The speed at the front isn't important so I'd just recommend
   with "Fast" or "Very Fast" since most people do not have a super-powerful
   processor to get this done really quick. If your desired encoder was x265,
   look for the preset with "HEVC" in the title if possible.
4. In the "Summary" tab, I usually switch the format to MKV. This is just a
   preference. The format will have little impact on your usage. I see plenty of
   MP4 files. I rarely see WebM files.
5. In the "Video" tab, select your "Video Encoder." If you had x264, choose
   "H.264 (x264)." This is the non-10-bit version. If you had x265, choose
   "H.265 10-bit (x265).
6. Set "Framerate (FPS)" to "Same as source."
7. Set quality to "Avg Bitrate (kbps)" and enter in the appropriate value as
   listed below[^1]:

### Movies

| Codec | 720p | 1080p | 4k       |
| ----- | ---- | ----- | -------- |
| x264  | 2500 | 2000  | ----     |
| x265  | ---- | 2500  | 6500[^2] |

### TV Shows

| Codec | 720p | 1080p |
| ----- | ---- | ----- |
| x264  | 800  | ----  |
| x265  | ---- | 1500  |

8. If you want to cut half the time, uncheck "2-Pass Encoding" but you WILL
   suffer a noticeable quality drop. I recommend this be kept on.
9. In the "Audio" tab, pou will probably have to play around with which tracks
   you want to keep. For the most part, I recommend AAC codec with a bitrate of
   160 for 1.0, 2.0, or 3.0 sound and AAC codec with a bitrate of 384 for 5.1ch.
   Remember, the more languages and audio tracks you keep, the more space you
   will use, _but_ video is the most impactful for file size.
10. Finally, the "Subtitles" tab will have all your subtitles. By default, the
    "Foreign Audio Scan" is selected. You can safely remove this by clicking the
    x. In this section you will have to select the subtitles you want by
    clicking "Tracks" and selecting some of the "Add All..." options to see if
    any subtitles were added. Alternatively, if SRT files were provided or you
    can find them, you can add them too in the "Tracks" -> "Import Subtitle"
    section. You should give your added tracks a name after they've been added.
11. Click "Start Encode"! You'll need to wait a bit for this process to finish
    as it can take a long time. The speed is determined by the speed of your
    processor. For reference, my PC with a Ryzen 7 5800x3D (approximately equal
    to a Intel 12th Gen i7 12700k) spent 2 hours converting a 2 hour 4k video
    file to x265 at 6500 bitrate in ~4 hours.

This is a very rough guide in getting some compression done. You'll still have
to definitely explore different bitrates and qualities you like. This is just
here to get you started with some numbers for a frame of reference.

[^1] If you don't like my guide, try using Christian Wheel's
[Bitrate Calculator](https://www.christianwheel.com/post/2017/01/23/bitrate-calculator)
to help you find the right bitrate. His tool does not take into account codec,
but it will get you there. [^2] This gets you approximately a 7GB file.
