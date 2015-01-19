--- 
title: "Persistence-Ignorant ASP.NET Identity with Patterns (Part 1)"
date: 2015-01-14
layout: post
comments: true
description: "This series of posts requires a functional understanding of ASP.NET Identity 2.x. If you haven't had at least some kind of exposure, this is a good place to start: http://www.asp.net/identity. ASP.NET Identity is the successor to ASP.NET Simple Membership, which..."
---

######*This series of posts requires a functional understanding of ASP.NET Identity 2.x. If you haven't had at least some kind of exposure, this is a good place to start: [http://www.asp.net/identity][1].*######

ASP.NET Identity is the successor to ASP.NET Simple Membership, which itself was a short-lived successor to the venerable ASP.NET Membership introduced with .NET 2.0. Microsoft's [Introduction to ASP.NET Identity][2] article says this new identity management framework is the result of developer feedback and solves a long list of problems including flexible schema, external logins, testability, and support for different persistence mechanisms &mdash; going as far to say they're &quot;easy to plug in.&quot;

###The Problem###

What they neglect to say is all that testability and persistence ignorance flies right out the window when you create a new ASP.NET Web Application using the MVC template and &quot;Individual User Accounts&quot; authentication. What you get is a single-layered application, tightly coupled to Entity Framework, that:

* Ignores the patterns that facilitate testing, including: the repository pattern, unit of work pattern, and dependency injection;

* Forces you to implement their `IUser` interface in your application's User entity, thereby coupling it to ASP.NET Identity;

* Eliminates any clear separation between your entities, persistence concerns, and business logic. Persistence ignorance? Forget about it.

Thankfully, due to the extensibility designed into ASP.NET Identity, it is possible to ditch the reference to the `Microsoft.AspNet.Identity.EntityFramework` assembly and write a custom implementation that can address these and other architectural issues. Just be forewarned: it is not a trivial undertaking, and you'll have to put up with some code smell that is baked into the `Microsoft.AspNet.Identity.Core` assembly.

The most off-putting smell is the core `UserManager<TUser>` class, which at first glance doesn't seem to be that big of a problem. Sure, it's a behemoth, 663 line [God class][3] that acts as the gateway for all identity management functionality in ASP.NET Identity, but since it's just an implementation detail baked into the core assembly, you don't really have to worry about it, right? Yeah, not so much.

`UserManager<TUser>` has a single dependency on `IUserStore<TUser>`, which doesn't look like a problem at first glance...

    public UserManager(IUserStore<TUser> store)
    {
        if (store == null)
        {
            throw new ArgumentNullException("store");
        }
        this.Store = store;
    }

...until you discover all the hidden dependencies. As it turns out, if you want password support, `UserManager<TUser>` also requires an `IUserPasswordStore<TUser>`. And where does it go looking? Here:

    private IUserPasswordStore<TUser> GetPasswordStore()
    {
        IUserPasswordStore<TUser> userPasswordStore = this.Store as IUserPasswordStore<TUser>;
        if (userPasswordStore == null)
        {
            throw new NotSupportedException(Resources.StoreNotIUserPasswordStore);
        }
        return userPasswordStore;
    }

So now your implementation of `IUserStore<TUser>` also has to implement `IUserPasswordStore<TUser>`. If you want to support external logins, claims, security stamps, and roles, the class definition for your implementation is going to look something like this:

    public class UserStore<TUser>
        : IUserLoginStore<TUser>
        , IUserClaimStore<TUser>
        , IUserRoleStore<TUser>
        , IUserPasswordStore<TUser>
        , IUserSecurityStampStore<TUser>
        , IUserStore<TUser>
        , IDisposable
        where TUser : IdentityUser

Yep, the `UserManager<TUser>` God class requires yet another God class to handle the data access for everything membership &mdash; and this one is all yours. Mine is a whopping 603 lines of awesomeness. And to make it extra-special, there is no way around it! So when I said you'd have to put up with some code smell, I wasn't kidding. Luckily, this is the worst of it.

###How We're Going to Fix It###

I didn't just write all that to convince you not to use ASP.NET Identity. On the contrary, you need to use it &ndash; just don't do it the way Microsoft apparently wants you to. Follow patterns instead! So let's start putting together some of the high-level requirements for a project where we're doing it right.

####Functional Requirements####

For the purposes of this tutorial, this application must possess all of the functionality you would get from an application created from the default ASP.NET MVC 5 web application template with &quot;Individual User Accounts&quot; authentication.

####Technical Requirements####

#####**Persistence Ignorance**#####

Fundamentally, persistence ignorance means that your entities shouldn't care about how they're stored, created, retrieved, updated, or deleted. Instead you just focus on modeling the business domain. The purpose of this post is not to explain persistence ignorance or Domain-Driven Design or try to convince you why you should use them, but if you'd like to know more, this is a good article: [Domain Driven Design &ndash; Clear Your Concepts Before You Start][4].

For the purposes of this application, I am going to use persistence ignorance with an assumption that we're using an ORM that supports lazy loading of related objects and collections through the use of dynamic proxies, which does make a couple of small difference in the code (but they're good differences):

* Our entity classes must not be sealed, must have a default constructor, and all public navigation properties must be virtual.

* We'll be able to take advantage of lazy loading of related objects and collections (in the UserStore methods for example).

#####**Proper Layering**#####

The concept of &quot;proper layering&quot; is highly subjective. At the very least, that means presentation is isolated from data access by an intermediate core logic layer. I'll cover the layering of this application in Part 2 when we set up the Visual Studio Solution.

#####**Patterns**#####

As I've mentioned before, this application will follow some important architectural patterns, including repository, unit of work, and dependency injection. The purpose of this post is not to explain what these patterns are or why you should use them, but I will provide links to more information about these patterns how to use them:

* [Repository][5] &ndash; specifically the use of generic repositories based on [this example][6].

* [Unit of Work][7] &ndash; this application uses a variant of [this example][6].

* [Dependency Injection][8] &ndash; this application will use [Microsoft Unity][9] as its dependency injection container and the [Unity.Mvc5][10] library.

#####**Persistence**#####

I will be writing two different data layers and expect that I should be able to switch between them without much effort, thanks to the persistence ignorance requirement:

###Next Steps###

In this part, I've identified the initial, high-level, function and technical requirements for persistence-ignorant, properly-layered ASP.NET MVC 5 web application with ASP.NET Identity. I spent time on some of the patterns I'll be using and provided plenty of links for those who want to learn more. In Part 2, I'll fire up Visual Studio and start putting the solution together.

Until next time, happy coding!


[1]: http://www.asp.net/identity
[2]: http://www.asp.net/identity/overview/getting-started/introduction-to-aspnet-identity
[3]: http://en.wikipedia.org/wiki/God_object
[4]: http://www.codeproject.com/Articles/339725/Domain-Driven-Design-Clear-Your-Concepts-Before-Yo
[5]: http://martinfowler.com/eaaCatalog/repository.html
[6]: http://www.asp.net/mvc/overview/older-versions/getting-started-with-ef-5-using-mvc-4/implementing-the-repository-and-unit-of-work-patterns-in-an-asp-net-mvc-application
[7]: http://martinfowler.com/eaaCatalog/unitOfWork.html
[8]: http://en.wikipedia.org/wiki/Dependency_injection
[9]: https://unity.codeplex.com/
[10]: https://www.nuget.org/packages/Unity.Mvc5/
