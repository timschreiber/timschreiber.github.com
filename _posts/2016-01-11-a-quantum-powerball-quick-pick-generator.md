--- 
title: "A Quantum Powerball Quick Pick Generator"
canonical: "http://timschreiber.com/2016/01/11/a-quantum-powerball-quick-pick-generator.md/"
date: 2016-01-11
layout: post
comments: true
description: "Powerball quick picks: are they truly random? Mine and others' observations say no. But thanks to the science of Quantum mechanics, it's now possible to generate truly random picks."
tags:
- code
- fun
---

<div class="col-xs-12">
  <div class="form-group">
    <label>Number of plays</label>
    <select id="selPbPlays" class="form-control">
      <option value="1" selected>1</option>
      <option value="5">5</option>
      <option value="10">10</option>
    </select>
  </div>
  <div>
    <button id="btnPbGenerate">Generate</button>
  </div>
</div>

<div id="pbResults" class="col-xs-12"></div>

<div class="clearfix"></div>
