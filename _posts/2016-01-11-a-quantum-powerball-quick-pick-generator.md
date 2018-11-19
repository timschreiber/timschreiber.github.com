--- 
title: "A Quantum Powerball Quick Pick Generator"
canonical: "http://timschreiber.com/2016/01/11/a-quantum-powerball-quick-pick-generator.md/"
date: 2016-01-11
layout: post3
comments: true
description: "Powerball quick picks: are they truly random? Mine and others' observations say no. But thanks to the science of Quantum mechanics, it's now possible to generate truly random picks."
thumbnail: "post.png"
featured: 0
published: false
tags:
- code
- fun
---

- <a href="#pbForm">Skip to the Quick Pick Generator</a>

I’ll admit it. When the Powerball jackpot got upwards of $900 million, I played. And now that it’s approaching (and may exceed) $1.5 billion, I’m going to play again. I’m not particularly attached to any “lucky” numbers, so I usually just play quick picks. They’re random, right? No so much.

I purchased ten plays and very quickly noticed a lot of repetition in the numbers. If it were truly random, I should see a fairly even distribution of numbers. But one number appeared in nine plays, another appeared in seven, and yet another appeared in six. Then there’s <a href="http://www.lottoreport.com/PBDuplicateQPs.htm" target="_blank">this guy</a>. Now I question 1) whether the random number generators in the lottery terminals are able to produce high-quality random numbers, and 2) even if they do, whether the terminals can be trusted.

In search of better randomness, I found <a href="https://www.random.org/" target="_blank">Random.org</a>, which generates random numbers based on atmospheric noise. They even have a <a href="https://www.random.org/quick-pick/" target="_blank">lottery quick pick generator</a>. According to the information on their site, they use atmospheric radio frequency noise to generate high-quality random numbers. I read up on their technique, and although it sounds very good, I thought that perhaps I could do better -- or at least nerdier.

Having read about quantum random number generation in the past, I went looking for a quantum random number generator and found the <a href="https://qrng.anu.edu.au/" target="_blank">Quantum Random Numbers Server</a> (QRNG) at <a href="http://www.anu.edu.au/" target="_blank">Australian National University</a>. They produce random numbers in real-time in their lab by measuring the quantum fluctuations of the vacuum.

So with the next Powerball drawing just around the corner, I quickly created my own Quantum Powerball Quick Pick Generator based on random numbers from the QRNG <a href="https://qrng.anu.edu.au/API/api-demo.php" target="_blank">RESTful API</a>. I implemented it in Web API on my Azure site, with CORS enabled and configured to allow my blog to access it. The result is below. Play responsibly!

<a name="pbForm"></a>

### Quick Pick Generator ###

<div class="col-xs-12" style="margin-top:20px;">
  <div class="form-group">
    <label>Number of plays</label>
    <select id="selPbPlays" class="form-control">
      <option value="1" selected>1</option>
      <option value="5">5</option>
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </select>
  </div>
  <div>
    <button id="btnPbGenerate" class="btn btn-primary">Generate</button>
  </div>
</div>

<div id="pbResults" class="col-xs-12"></div>

<div class="clearfix"></div>
