--- 
title: "ASP.NET Core Identity with Patterns (Part 1 of 3)"
canonical: "http://timschreiber.com/2018/05/07/aspnet-core-identity-with-patterns/"
date: "2018-05-07 12:01 PM"
layout: post3
comments: true
description: "A few years ago, I wrote a series of posts about how to implement of ASP.NET Identity 2.0 with a focus on persistence ignorance and design patterns. I have since received received a lot of requests to do update it for .NET Core."
image: "asp-net-core-identity-with-patterns.jpg"
featured: 0
tags:
- dotnet-core
- asp-net-core
- asp-net-core-identity
- patterns
- architecture
---

 * **Part 1**
 * [Part 2][5]
 * [Part 3][7]
 
**The source code for this series of posts is available at on my GitHub: [https://github.com/timschreiber/ASP.NET-Core-Identity-Example][6]**

*NOTES:*
 * *This series of posts requires a functional understanding of ASP.NET Core Identity If you haven't had at least some kind of exposure, this you should probably start [here][3].*
 * *If you haven't read my [my previous posts][8], I'd suggest you stop here and read at least the first one to understand the problems I had with ASP.NET Identity 2.0 and how I solved them.*

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

### Run the Project

At this point, you should have a bare bones ASP.NET Core Identity website. You should be able to register, login, etc. at this point. Go ahead, give it a shot: register a user, logout, login, change the password, etc.
    
### Now Let's Break It

Now that we have a working application, let's break it. Let's do the following:

 * Delete the `Data` folder and everything in it.
 
 * Remove the dependency on Entity Framework from the NuGet packages and the project file.

Congratulations! Your application is now broken. Now, because I hate lieaving an application in an uncompilable state, let's at least get it compiling (although not actually working at runtime).

#### Stub out the UserStore and RoleStore classes

Like ASP.NET Identity 2.0, ASP.NET Core Identity uses two Store classes to persist Identity data: the UserStore and the Role Store. Because we're doing a custom implementation of ASP.NET Core Identity, we need to roll our own. So create a new folder called `Identity` and add two classes:

##### CustomRoleStore.cs

We'll start with the easy one. Edit the class so it implements two interfaces: `IRoleStore<IdentityRole>` and `IRoleClaimStore<IdentityRole>`.

    using System.Security.Claims;
    using System.Threading;
    using System.Threading.Tasks;

    namespace AspNetCoreIdentityExample.Web.Identity
    {
        public class CustomRoleStore :
            IRoleStore<IdentityRole>,
            IRoleClaimStore<IdentityRole>
        {
            // Implementations will go here
        }
    }

Notice the red squiggly lines under the interfaces. Visual Studio can stub out the implementation for you. All you have to do is put your cursor over the interface with the squiggly red underline, press [CTRL]-[.] (period), and select **Implement Interface** from the context menu.    

![Let Visual Studio stub out your interface implementation for you][3]
    
Visual Studio will automatically generate your methods. They'll all throw a NotImplementedException, but they'll be there, and your code will compile. Repeat for each interface that needs to be implemented.

*NOTE: I honestly don't know if Visual Studio Code will do this for you. If not, then I'm sorry, but you will have to stub out the methods yourself. It's really going to suck for the CustomUserStore.cs class. Sorry.*

##### CustomUserStore.cs

The CustomUserStore is a little more complicated. To get the same functionality as we would with the out-of-the-box EntityFramework implementation, we need to implement a lot of interfaces. More information on these interfaces can be found [here][4].

    using AspNetCoreIdentityExample.Domain;
    using AspNetCoreIdentityExample.Domain.Entities;
    using AspNetCoreIdentityExample.Web.Models;
    using Microsoft.AspNetCore.Identity;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Security.Claims;
    using System.Threading;
    using System.Threading.Tasks;

    namespace AspNetCoreIdentityExample.Web.Identity
    {
        public class CustomUserStore :
            IUserStore<ApplicationUser>,
            IUserPasswordStore<ApplicationUser>,
            IUserEmailStore<ApplicationUser>,
            IUserLoginStore<ApplicationUser>,
            IUserRoleStore<ApplicationUser>,
            IUserSecurityStampStore<ApplicationUser>,
            IUserClaimStore<ApplicationUser>,
            IUserAuthenticationTokenStore<ApplicationUser>,
            IUserTwoFactorStore<ApplicationUser>,
            IUserPhoneNumberStore<ApplicationUser>,
            IUserLockoutStore<ApplicationUser>,
            IQueryableUserStore<ApplicationUser>
        {
            // Implementations will go here
        }
    }
    
Again, you will need to have Visual Studio generate the implementations of each of those interfaces. Tedious, I know.   

#### Edit Startup.cs

The last thing we need to do to get the project to compile is to remove all references to Entity Framework and `ApplicationDbContext `from the `ConfigureServices` method of the `Startup.cs` class.

Delete the following line from `Startup.cs`:

    using Microsoft.EntityFrameworkCore;

Delete the following line from the `ConfigureServices` method in `Startup.cs`:

    services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

Then, change the following line in the `ConfigureServices` method in `Startup.cs`:    

    services.AddIdentity<ApplicationUser, IdentityRole>()
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

to this:

    services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddDefaultTokenProviders();

Your application should now compile. If you tried to run it, it will throw exceptions everywhere, but if it doesn't at least compile, then go back over the steps and make sure you did everything correctly.

## Next Steps

This is where we will leave it for now. So far, so good. In Part 2, we'll put the Web Project on the back burner and focus on the Domain and Data layers; and then in Part 3, we'll come back to the Web Project to flesh out the `CustomRoleStore` and `CustomUserStore` classes, and tie everything together into a working application.

Until next time, happy coding!

[1]: http://www.codeproject.com/Articles/339725/Domain-Driven-Design-Clear-Your-Concepts-Before-Yo
[2]: /img/aspnet-core-identity-with-patterns/ssms-1.png
[3]: /img/aspnet-core-identity-with-patterns/visual-studio-implement-interface.png
[4]: https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity-custom-storage-providers?view=aspnetcore-2.1
[5]: /2018/05/07/aspnet-core-identity-with-patterns-2/
[6]: https://github.com/timschreiber/ASP.NET-Core-Identity-Example
[7]: /2018/05/07/aspnet-core-identity-with-patterns-3/
[8]: /2015/01/14/persistence-ignorant-asp-net-identity-with-patterns-part-1/
