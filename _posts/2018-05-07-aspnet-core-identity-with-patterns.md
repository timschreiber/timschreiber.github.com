--- 
title: "ASP.NET Core Identity with Patterns (Part 1 of 3)"
canonical: "http://timschreiber.com/2018/05/07/aspnet-core-identity-with-patterns/"
date: 2018-05-07
layout: post3
comments: true
description: "A few years ago, I wrote a series of posts about how to implement of ASP.NET Identity 2.0 with a focus on persistence ignorance and design patterns. I have since received received a lot of requests to do update it for .NET Core."
image: "persistence-ignorant-asp-net-identity-with-patterns.jpg"
tags:
- dotnet-core
- asp-net-core
- asp-net-core-identity
- patterns
- architecture
---

*NOTE: If you haven't read my previous posts, I'd suggest you stop here and read at least the first one to understand the problems I had with ASP.NET Identity 2.0 and how I solved them.*

## Still Has Problems, but not as Many

As I started putting an example project together, I realized that there are still some problems with the out-of-the-box `Individual User Accounts` template, but there aren't as many, and the ones remain are easier to solve.

### What's Fixed

 * Your application's `User` class is no longer required to implement an `IUser` interface to work with the Identity framework and is therefore no longer tightly coupled to it.
 
 * Built-in dependency injection allows you to write cleaner, loosely-coupled, more testable code.

### What's Still a Problem

 * The default template with the Individual User Accounts authentication option still generates a single-layered application that is more or less tightly coupled to Entity Framework.
 
 * The `UserManager` class still has a bunch of hidden, feature-specific dependencies that you may not discover until runtime.
 
 * The `UserStore` class can still grow into a huge god class that violates the Single Responsibility Principle.

## How We're Going to Fix It

For this tutorial, we're going to be building a **.NET Core 2.0**, **ASP.NET Core Web Application (Model View Controller)** with the **Individual User Accounts** authentication option. Like before, we will focus on **persistence ignorance** and design patterns.
