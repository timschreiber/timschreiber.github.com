--- 
layout: post
title: "My First Randori"
canonical: "http://timschreiber.com/2012/04/07/my-first-randori/"
author: "Tim"
comments: true
description: "In the second meeting of the Utah Software Craftsmanship group that I attended, Mike Clement presented on Randori: Group Practice. Randori is a term used in Japanese martial arts to describe free-style practice. The term literally means &quot;chaos taking&quot; or..."
tags:
- code-practice
- software-craftsmanship
---

In the second meeting of the Utah Software Craftsmanship group that I attended, [Mike Clement][1] presented on Randori: Group Practice. Randori is a term used in Japanese martial arts to describe free-style practice. The term literally means “chaos taking” or “grasping freedom,” implying a freedom from the structured practice of kata. Randori may be contrasted with kata, as two potentially complementary types of training.

Kata is a Japanese word describing detailed choreographed patterns of movements practiced either solo or in pairs. A code kata is an exercise in programming which helps a programmer hone their skills through practice and repetition. Dave Thomas has published many katas at [http://codekata.pragprog.com/codekata][2].

Where kata is primarily an individual exercise, Randori is a team exercise, and Mike does a great job at explaining it on his blog: [http://blog.softwareontheside.com/2012/03/utah-code-camp-spring-2012-slide-decks.html][3].

The 11 or 12 of us in attendance performed the Numbers to LCD kata from Mike’s [slide deck][4] and [starter project][5]. It was interesting to see the direction the pairs took as we rotated through the audience. First, there were tests for each digit and multi-digits, along with a bunch of if..else if..else statements to translate the integer into the string representation of the LCD. Then someone refactored the if..else if..else statements into a switch statement. Then someone streamlined testing with [Setup] and [TestCase]. Then my navigator and I refactored the switch to a Dictionary. Finally, after much trial and error, we arrived at the obvious answer staring us in the face the whole time: indexing through the string representation of the LCDs.

It was yet another example of how we as software developers tend to overcomplicate the problem upon first analysis, and even though I strive for simplicity in software, my Dictionary solution was unnecessarily complex in comparison to the final result. But the value we gained from the exercise had nothing to do with what ended up producing. Instead, it was the activity of producing it that proved to be of most value. And seeing how my peers approached the problem provided a ton of insight that I would otherwise have missed on my own. Last night’s exercise was not only my first introduction to Randori, but also to Code Kata in general. I intend to learn more and start applying the principles of code practice in my individual professional development. I’m also thinking about conducting a couple of STG brown bags on Code Kata and Randori.

[1]: http://blog.softwareontheside.com
[2]: http://codekata.pragprog.com/codekata
[3]: http://blog.softwareontheside.com/2012/03/utah-code-camp-spring-2012-slide-decks.html
[4]: http://www.slideshare.net/mdclement/randori
[5]: https://github.com/mdclement/NumbersToLcdRandoriBase