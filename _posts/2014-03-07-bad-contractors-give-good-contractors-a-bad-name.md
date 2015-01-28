--- 
title: "Bad Contractors Give Good Contractors A Bad Name"
canonical: "http://timschreiber.com/2014/03/07/bad-contractors-give-good-contractors-a-bad-name/"
date: 2014-03-07
image : "http://timschreiber.com/img/consulting-demotivator.jpg"
layout: post
comments: true
description: "Having spent the better part of a decade in software consulting, it's fair to say that although many of us are quite talented and actually give a shit about what we do, there are also those who have tarnished our..."
tags:
- work
- consulting
- rants
---

Having spent the better part of a decade in software consulting, it's fair to say that although many of us are quite talented and actually give a shit about what we do, there are also those who have tarnished our reputation a bit. Demotivators like this exist for a reason:

![Consulting: If you're not part of the solution, There's good money to be made in prolonging the problem.][1]

My company hired a Microsoft Gold Certified Partner to do some integration work between our Dynamics CRM 2011 system and some internal systems. I won't name names, but this particular company's consultants are generally recognized as experts in Dynamics development, and they have built quite a large practice around that particular technology offering. They even hold regular webinars about it.

Then there's me, their client. My experience with Dynamics CRM started my first day on the job.

So, as I was perusing the source code for a couple of custom plug-ins they wrote for us, I saw a few hard-coded web service URLs in there. When I asked their CRM &quot;expert&quot; about it, he said it had to be that way because there were no .config files in Dynamics CRM like you would have in a typical .NET application. I thought it sounded fishy, but because I had a ton of stuff on my plate at the time, I just kinda let it be for the moment. Well, a few weeks went by, and I was again in the code trying to get a version ready for our new DEV environment. I remembered the conversation I had with the &quot;expert&quot; and thought there had to be a way.

There was. Seriously, a half minute of Google search turned up [this article][2], which is exactly how you're supposed to pass configuration to your Dynamics CRM plug-ins. And it's functionality that's been available since at least version 4.0 (which came out well before the 2011 version we're using). Another half hour, and I had fixed, checked-in, and deployed. Now I'm looking at the project and wondering how much of the rest of the code is hacked together like that.

So, now that I've ranted about this company of &quot;experts,&quot; I want to close by offering a public apology to any client that feels I haven't tried to be part of the solution. True, I don't know everything, but I don't pretend to be an &quot;expert&quot; either. I just do my work the best I know how, and I'm constantly striving to improve my skills and expand my knowledge.

And this feels like an awkward way to end.

Potato.

[1]: /img/consulting-demotivator.jpg
[2]: http://blogs.msdn.com/b/crm/archive/2008/10/24/storing-configuration-data-for-microsoft-dynamics-crm-plug-ins.aspx