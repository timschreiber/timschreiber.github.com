--- 
layout: post
title: "Local/Web Font Conflict in Chrome"
author: "Tim"
comments: true
description: "Well, you're reading this, which means you're looking at my newer, leaner, better personal site/blog. I spent a couple nights learning Pretzel/Jekyll, putting the layout together, and converting my old WordPress posts. So when..."
tags:
- Fonts
- UI
- Chrome
---

Well, you're reading this, which means you're looking at my newer, leaner, better personal site/blog. I spent a couple nights learning Pretzel/Jekyll, putting the layout together, and converting my old WordPress posts. So when everything came together last night, I was excited to push it to GitHub and point my timschreiber.com domain at it. Everything came together sometime around midnight last night.

When I got to work this morning, I was eager to show my hard work to a co-worker, so I fired up Chrome on my work laptop and saw this:

![Prodigious use of bold fonts][1]

Though he didn't come right out and say it, I knew what he was thinking, "Wow, prodigious use of bold fonts… everywhere!"

What the hell happened? It was working perfectly the night before! I immediately sprung into programmer mode: first, replicate the behavior in other browsers. I had a look in Firefox and Internet Explorer, and it was fine. "See! I know better than to use bold fonts like that!" I thought. The problem had to be something just with Chrome, and since I distinctly remembered seeing it work correctly on my personal laptop last night, it had to be something specifically affecting Chrome on my work laptop.

In my layout, I'm using the Roboto font from Google Fonts. Was that causing the problem? No, because the other browsers were working fine. I checked the Chrome version. It was up-to-date. I thought about resetting Chrome to default settings, and if that didn't work, uninstall and reinstall Chrome altogether. 

I took a step back, took a couple deep breaths, and thought: It's a font issue first, and a Chrome issue second. Could there be a font conflict that's making Chrome pitch a fit, but the other browsers don't care about? I looked at my fonts in Control Panel, and found this:

![The offending font][2]

I had a Roboto font already installed, and it was indeed the boldest one. If I uninstalled this font, would it fix my problem? So I tried it, and voila! The correct fonts were displaying on my site in Chrome! My suspicion was correct: it was a Chrome specific freak out over a similar &ndash; but not identical &ndash; font already installed on my machine. But why just Chrome? I'm thinking it's a bug, since the other browsers could determine the difference between "Roboto" and "Roboto Black." I looked through the font bugs for Chromium, but couldn't find one that exactly matched the problem I was having. I found a lot of similar issues, however, including several that seem to somehow slip by regression tests over and over again.

This shouldn't affect most users – only those who install extra fonts on their computers, and out of those, only those who install a specific font that's similar to the ones in use on my site. But if this is affecting you, now you know why and how to work around it until Google fixes the problem.

[1]: /img/bold-blog.png
[2]: /img/roboto-black.png
