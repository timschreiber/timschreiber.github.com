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

### Persistence Ignorance

Fundamentally, persistence ignorance means that your entities shouldn't care about how they're stored, created, retrieved, updated, or deleted. Instead you just focus on modeling the business domain. The purpose of this post is not to explain persistence ignorance or Domain-Driven Design or try to convince you why you should use them, but if you'd like to know more, this is a good article: [Domain Driven Design &mdash; Clear Your Concepts Before You Start][1].

### Design Patterns

This application will follow some important architectural patterns. Because ASP.NET Core already supports inversion of control out of the box, we're going touch on Dependency Injection but focus on the Repository and Unit of Work patterns.

## The Web Project

*NOTE: I used Visual Studio 2017 to create the Solution. You should be able accomplish everything I'm doing here with Visual Studio Code, but the steps will be different if you choose to go that route.*

The first thing to do is to make sure your Visual Studio is up to date. If you have a yellow flag in the upper-right corner, and it tells you there's an update available, then you need to update before continuing.

Once you're up to date, launch Visual Studio and create a new **.NET Core 2.0**, **ASP.NET Core Web Application (Model View Controller)** with the **Individual User Accounts** authentication option. I called mine `AspNetCoreIdentityExample.Web`, and I named the solution `AspNetCoreIdentityExample` (without the .Web part). Visual Studio will work on it for a few seconds, and then your new project will be ready. Don't run it quite yet, as there's still a little more to do.

### Optional: Switch from LocalDB to SQL Server Express and SSMS

I'm not particularly fond of LocalDB. I prefer using a SQL Server Express database and SQL Server Management Studio (SSMS) because and it is closer to how it would be in a real-life production environment and is what I'm used to. You can use whichever you prefer. You don't have to use SQL Server, a relational database, or even any kind of database at all (you could use a flat file if you wanted to). But this tutorial assumes some flavor of SQL Server. Anyway, to make the change to SQL Server Express (assuming it's installed), edit the connection string in yoru appsettings.json as follows:


    {
      "ConnectionStrings": {
        "DefaultConnection": "Server=Server=(local);Database=AspNetCoreIdentityExample;Trusted_Connection=True;MultipleActiveResultSets=true"
      },
      "Logging": {
        "IncludeScopes": false,
        "LogLevel": {
          "Default": "Warning"
        }
      }
    }

### Apply Migrations

Apply the migrations by running the following command in the Package Manager Console:

    PM> Update-Database

This step will create the database and tables and allows us to avoid scripting out the tables later (like I did in my previous ASP.NET Identity tutorial). Once the migrations have finished, you can verify the tables exist if you'd like:

![Using SQL Server Management Studio (SSMS) to verify that the ASP.NET Core Identity Tables have been created.][2]











[1]: http://www.codeproject.com/Articles/339725/Domain-Driven-Design-Clear-Your-Concepts-Before-Yo
[2]: /img/aspnet-core-identity-with-patterns/ssms-1.png
