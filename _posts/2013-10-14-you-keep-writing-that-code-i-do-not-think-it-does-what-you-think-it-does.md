--- 
layout: post
title: "You Keep Writing That Code. I Do Not Think It Does What You Think It Does."
canonical: "http://timschreiber.com/2013/10/14/you-keep-writing-that-code-i-do-not-think-it-does-what-you-think-it-does/"
author: "Tim"
comments: true
description: "Good for you that you used a StringBuilder. But you completely missed the point of using a StringBuilder. Even worse that you're concatenating SQL like this..."
tags:
- code
- c-sharp
- sql
---

Dear unknown previous programmer,

Good for you that you used a StringBuilder. But you completely missed the point of using a StringBuilder. Even worse that you're concatenating SQL like this:

    StringBuilder SomeRecord = new StringBuilder("Insert into [SomeData] (SomeNumber, SomeName, SomeAttribute1, SomeAttribute2, SomeAttribute3, SomeAttribute4, SomeAttribute5, SomeAttribute6, SomeAttribute7, SomeAttribute8, SomeAttribute9, SomeFlag) " +
        " values ( " 
        + "'" + lsSomeNumber + "' , " 
        + "'" + lsSomeName + "', "
        + "'" + lsSomeAttribute1 + "', " 
        + "'" + lsSomeAttribute2 + "', " 
        + "'" + lsSomeAttribute3 + "', "
        + "'" + lsSomeAttribute4 + "', "
        + "'" + lsSomeAttribute5 + "', "
        + "'" + lsSomeAttribute6 + "', " 
        + "'" + lsSomeAttribute7 + "', " 
        + "'" + lsSomeAttribute8 + "', "
        + "'" + lsSomeAttribute9 + "', " 
        + "'" + lsSomeFlag +"' )" );
