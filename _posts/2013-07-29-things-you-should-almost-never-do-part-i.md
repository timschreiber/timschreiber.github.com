--- 
layout: post2
title: "Things You Should (Almost) Never Do, Part I"
canonical: "http://timschreiber.com/2013/07/29/things-you-should-almost-never-do-part-i/"
author: "Tim"
image: "http://timschreiber.com/img/cardboard-tank.jpg"
comments: true
description: "I've been thinking about whether there's at which a project has accrued enough technical debt that it just makes sense to cut your losses and start over."
image: "things-you-should-almost-never-do-part-i.jpg"
color: "#898883"
tags:
- practices
---

As I mentioned before, I've been thinking a lot about the point , if it even exists, at which a project has accrued enough technical debt that it just makes sense to cut your losses and start over. Of course, required reading for anyone considering refactor vs. rewrite is Joel Spolsky's &quot;[Things You Should Never Do, Part I][1]&quot; article, in which he posits the single worst strategic mistake you can make on a software project is to rewrite the code from scratch. If you haven't read the article, stop and read it now. You'll be glad you did.

I respect Mr. Spolsky a great deal, but one paragraph in his article is really causing me a little heartburn, because I think it oversimplifies a situation that my project at work is currently facing:

> The idea that new code is better than old is patently absurd. Old code has been used. It has been tested. Lots of bugs have been found, and they've been fixed. There's nothing wrong with it. It doesn't acquire bugs just by sitting around on your hard drive. Au contraire, baby! Is software supposed to be like an old Dodge Dart, that rusts just sitting in the garage? Is software like a teddy bear that's kind of gross if it's not made out of all new material?

If there's one thing I'd like to say to Mr. Spolsky right now it's, &quot;Thank you, thank you for using the Dodge Dart analogy.&quot; Not only am I a huge Mopar fan, but it just so happens that Dodge resurrected the Dart as an all-new, redesigned &quot;from scratch&quot; model in 2013 (actually, they just did a custom implementation of a vehicle platform from Fiat). See where I'm going with this? Old vs. new, rusted vs. shiny...

<div class="text-center">
  [Old and Busted / New Hotness][2]
</div>

I completely agree with Mr. Spolsky that software won't acquire bugs just sitting around on your hard drive, but then an old Dodge Dart won't &quot;rust just sitting in the garage&quot; if it's taken care of properly. Similarly, I've seen plenty of software fall apart because it was left out in the elements without proper maintenance.

And that's the first point I want to make: Businesses cut budgets for software systems that appear to be functioning at an arbitrary minimum level of reliability. Competent, expensive senior-level developers are replaced by cheaper junior programmers. Invariably, things go wrong, enhancements are required; and whether through inexperience or apathy, their once beautiful, shiny software gradually becomes &ndash; well, this:

<div class="text-center">
  [They're &quot;Features&quot;][3]
</div>

Is it possible to strip away the cardboard and duct tape and return the car to its pristine working condition? Of course! With enough time, money, and effort, I believe anything is possible; but therein lays my second point: it's impossible to remove the all the crap and rot, and refactor all the bad code without losing at least some of the features, fixes, and knowledge that have accumulated over time &ndash; at least on a budget and timeline the business is happy with.

A recent [episode][4] of the Discovery Channel's Fast 'n Loud comes to mind. Richard Rawlings and Aaron Kaufman from Gas Monkey Garage bought a 1964 Dodge Sweptline pickup truck in pretty rough shape for $750, and turned it into something better than the original, but all did not go smoothly. They ripped out the original front end and were forced to make some major, expensive frame modifications to get a front end from a Ford Crown Victoria to fit. Similarly, they used an engine and transmission from a modern Chevrolet Tahoe, which caused all kinds of mounting difficulties and required the steering to be custom built. And whether by choice or by budget, they just sanded and clear coated the rather rough looking exterior instead of giving it a shiny new paint job. The price for the final result? Just shy of $50,000.

<div class="text-center">
  [Dodge Hodge Podge][5]
</div>

The performance of the &quot;Dodge Hodge Podge,&quot; as they call it, is quite impressive; but in my opinion, it still looks like a rusted out piece of crap. Lacking many of the features, comforts, and conveniences that have become expected &ndash; if not required &ndash; in today's market, it is nothing more than a very exciting novelty. And that brings me to my third and final point: the passage of time in the real world will eventually render even the best designed and implemented software systems obsolete.

As software developers, we live in a world where the only constant is change. Technologies progress, frameworks evolve, patterns found, and best practices appear. And then there's Microsoft. In the early days of .NET, they developed what I can only describe as anti-patterns and anti-practices and published them on MSDN as their holy gospel. Bloggers and tutorial websites picked up on it; and before long, a whole generation of web developers was learning how to program by spreading application logic across all the Page_Load and Button_Click event handlers in their CodeBehind classes.

There are many other examples in many different languages and frameworks and projects, but my point is this: what seem like good decisions in an early in the game almost always come back to bite us later, and unless the business makes sure the project stakeholders and developers are well-funded, and unless everyone involved in the project stays 100% vigilant, eventually the fast paced technological world passes up the old software system. The problem is that once the business decides a product is stable or performant enough, the money dries up and it becomes impossible to keep it from becoming obsolete. The attitude that old code is good enough because it works, as Mr. Spolsky asserts, only exacerbates the problem.

So what to do? That's what I'm trying to figure out. I don't necessarily want to rewrite the project I inherited at work, but I'm thinking I might have to. Our data layer is buggy, generated by an in-house tool we no longer have the source code for, and based on antiquated ADO.NET DataSets. It needs to be completely redesigned and rewritten, with a requirement from above that we move to Entity Framework. Our business logic layer is tightly coupled to our data access layer, and huge swaths of code will have to be rewritten to accommodate the new data layer. The service layer was written by someone who obviously didn't understand SOAP. For some reason, someone thought passing objects as XML string parameters in WebMethods and serializing/deserializing them on both ends was a good idea &ndash; nope, but now the presentation layer needs a reference to the business layer to work. There are many other facets that need help as well.

With such a mess of tightly coupled, poorly executed code, does it still make sense to keep what we have just because it works? Do we do the &quot;Dodge Hodge Podge&quot; thing to our software and hope that our incremental changes and improvements don't take forever and leave us with sticker shock in the end? Like I mentioned before, are we at the tipping point at which we've accrued so much technical debt that it just makes more sense to cut our losses and start over with fresh, new code? Should the &quot;Things You Should Never Do&quot; be renamed &quot;Things You Should Almost Never Do?&quot;

UPDATE: I just had a thought that if the project had been initiated with incremental improvement in mind, then incrementally improving it would be easier to swallow. But every time I turn around, there's some new roadblock or missing source code or whatever standing in my way. A commenter advised to be prepared for the pain, but I'm in pain either direction I go. I just need to choose the option with the least amount of it.

[1]: http://www.joelonsoftware.com/articles/fog0000000069.html
[2]: /img/old-new-dart.jpg
[3]: /img/cardboard-tank.jpg
[4]: http://dsc.discovery.com/tv-shows/fast-n-loud/season-2-episodes4.htm
[5]: /img/dodge-hodge-podge.jpg
