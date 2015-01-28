--- 
title: "Farewell WordPress, Hello Pretzel!"
permalink: "http://timschreiber.com/2015/01/19/farewell-wordpress-hello-pretzel"
date: 2015-01-19
layout: post
comments: true
description: "For the past couple years, I've been running this website using WordPress on GoDaddy hosting. But since it's such a simplistic site, I've begun questioning why. Is dealing with the plug-ins and updates really worth the few pages and handful of posts I have up..."
tags:
- this-site
- pretzel
- jekyll
- github
---

For the past couple years, I've been running this website using WordPress on GoDaddy hosting. But since it's such a simplistic site, I've begun questioning why. Is dealing with the plug-ins and updates really worth the few pages and handful of posts I have up there? Why does theming have to be such a royal pain in the ass?

That all changed today.

A while back, I read about Jeckyll &ndash; a blog-aware, static site generation tool that works on GitHub Pages. Jeckyll is a Ruby app that requires a bunch of setup to get running. And if you're on a Windows computer? It's even more difficult. The problem is that I'm 99% Windows, so I thought, &quot;Hmm, that would be nice to use WordPress is less of a pain.&quot; Well a couple nights ago, I discovered Pretzel &ndash; essentially the functional equivalent of Jeckyll built with .NET. It creates, builds, and helps you test Jeckyll-style sites, which can then be used on GitHub Pages. So I decided to give it a try.

The first thing I did was to convert the posts I wanted to keep from my WordPress site to MarkDown and added them to my repository. A little bit of Pretzel magic, and a few seconds later, I was viewing my new blog on Pretzel's built-in web server. A Git commit and push to GitHub, and it was live. The process was simple, yet geeky enough for me to really enjoy as a software developer.

And the best part is the dead simplicity of the theming. I have to admit, the default design that Pretzel spits out is pretty stupid. So I built my own layouts based on Bootstrap, and everything looks even better than anything I ever had on WordPress.

You can find Pretzel here: [https://github.com/Code52/pretzel][1]

And the guide I followed to get started is here: [http://lukencode.com/2012/02/13/using-pretzel-jekyll-to-your-blog-on-github/][2]

Happy coding!

[1]: https://github.com/Code52/pretzel
[2]: http://lukencode.com/2012/02/13/using-pretzel-jekyll-to-your-blog-on-github/