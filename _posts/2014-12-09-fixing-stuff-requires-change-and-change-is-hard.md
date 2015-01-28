--- 
title: "Fixing Stuff Requires Change, and Change Is Hard"
permalink: "http://timschreiber.com/2014/12/09/fixing-stuff-requires-change-and-change-is-hard"
date: 2014-12-09
layout: post
comments: true
description: "Once upon a time, there was a software developer. Let's call him &ndash; oh, I don't know &ndash; &quot;Jim.&quot; Jim was brought on as a consultant at a large organization &ndash; let's call it &quot;Gub Mints&quot; &ndash; to lead other..."
tags:
- work
- management
- rants
---

Once upon a time, there was a software developer. Let's call him &ndash; oh, I don't know &ndash; &quot;Jim.&quot; Jim was brought on as a consultant at a large organization &ndash; let's call it &quot;Gub Mints&quot; &ndash; to lead other developers and improve a flailing enterprise application called &ndash; hmmm &ndash; &quot;Crapster.&quot; Don't ask me why Gub Mints needs has an application called Crapster, but they do.

Now, Crapster was originally developed in 2004 using .NET 1.1. Its original functionality was essentially just a Mechanical Turk. A user would login to the website and request some crap (like a report or whatever). That request would go into a queue which was monitored by real live people who would perform whatever work was necessary, and then fax the result back to the user. Everything was working as designed &ndash; except it wasn't designed with scalability in mind.

Over time, more and more automation was added. The manual queue became an MSMQ queue that was monitored by a Windows Service. Users could get completed crap in seconds, and if they were too busy to do it themselves, they could appoint agents or delegates to do crap on their behalf. Crapster data was shared with other mint companies, and vice versa. And because extensibility wasn't a design concern, all of this new functionality was just kinda tacked on without any big-picture concern.

For much of its life, Crapster was developed, enhanced, and maintained by a single low-cost developer &ndash; or rather a series of single, low-cost developers. Because of organizational issues at Gub Mints, only contractors were used on Crapster, so turnover was atrocious and any knowledge that was passed down between developers was incomplete at best. And because developers 1) cheap and 2) working alone, liberties were taken with the code that a team and code reviews would have otherwise prevented. Despite its challenges, Crapster still worked, albeit in a more and more fragile state with every little change or enhancement. Eventually, the overall scheme of things became so clouded by the problems and lack of knowledge, that no one actually understood Crapster anymore.

Crapster slowly decayed until 2012. That's when Gub Mints made some changes that would increase the user base and overall load on Crapster by an order of magnitude. Sure enough, stuff broke under the increased load. Some stuff was deemed unnecessary or able to be worked around by real live people and was deactivated. Other stuff received just enough maintenance to keep it limping on. And more stuff was still being added at the request of Gub Mints management. But as a whole, the application was failing.

Gub Mints looked for another contractor to take the reins and turn the Crapster train wreck around. After searching high and low, they found Jim. Throughout his career as a software consultant, Jim kinda specialized in helping turn around failing projects. &quot;Fix it,&quot; they said.

Faced with the daunting task of fixing Crapster, Jim spent weeks discovering and carefully evaluating the technological, process, and organizational aspects of the project. He carefully documented what was working, what needed help, and presented a plan to modernize the application and improve its extensibility and scalability.

The Gub Mints management's reaction caught Jim off guard: &quot;We didn't tell you to analyze it. We told you to fix it.&quot;

&quot;I have to know what to fix before I can fix it,&quot; replied Jim.

&quot;We'll tell you what to fix. You can start with the timeout issues.&quot;

&quot;I addressed the timeout issues on page xx, and you can see they're the result of the application not being designed for scalability. Fixing it would require&mdash;&quot;

&quot;Just get it working.&quot;

At this point, it became painfully clear to Jim what Gub Mints really wanted. They wanted the status-quo; they didn't want anything to actually change; they didn't really want Crapster fixed. They wanted a Band-Aid. They wanted him to &quot;just get it working.&quot; They wanted him to &quot;Git-R-Done!&quot;

Fast forward &ndash; say &ndash; ten or eleven months. Jim has accomplished only a few things he was hired to do. He hasn't been sitting around doing nothing. On the contrary, he's got the application running more stable under the higher load. There were still problems that popped up from time to time, but the Help Desk and Operations teams handled those like they always had. The bulk of his time was taken up propping up the failing application to make it seem stable because he wasn't allowed to actually make it more stable. And when he wasn't putting out fires or chasing ghosts, he was handling major enhancements that were being rammed through. In fact, at the end of it all, he was only able to fit in a few actual minor improvements.

The Gub Mints management went to Jim and said, &quot;You had a year to fix Crapster. What have you been doing?&quot;

&quot;I've been propping it up because you wouldn't let me actually fix it,&quot; replied Jim.

&quot;We hired you to fix it.&quot;

&quot;You threw every conceivable obstacle in my way and told me to just get it working, and that's what I did.&quot;

&quot;But you didn't fix it.&quot;

&quot;No, I spent all my time putting out fires, chasing ghosts, and implementing your enhancements because you wouldn't let me actually fix anything.&quot;

&quot;But we wanted&mdash;&quot;

It could have gone on and on, but it didn't. Gub Mints and Jim eventually parted ways, not under the best circumstances. If the conversation had been allowed to continue, however, Jim would have responded like this:

&quot;You think you wanted Crapster fixed, but what you really wanted was more status quo.&quot;

The moral of the story is that fixing stuff requires change, and change is hard. Failing to understand that makes life difficult for everyone. Jim has moved on to another project and is happy and productive. Gub Mints and Crapster are just a bad memory. But Gub Mints is stuck with the same problems, the same attitudes; and are no doubt dragging yet another hapless contractor through the same broken machine &ndash; all because they think they want something they don't actually want: &quot;change.&quot;

The end.

*DISCLAIMER: All persons, organizations, products, and/or events in this work are fictitious. Any resemblance to real persons (living or dead), organizations, products and/or events is purely coincidental.*