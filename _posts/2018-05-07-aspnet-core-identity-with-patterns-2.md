--- 
title: "ASP.NET Core Identity with Patterns (Part 2 of 3)"
canonical: "http://timschreiber.com/2018/05/07/aspnet-core-identity-with-patterns-2/"
date: 2018-05-07
layout: post3
comments: true
description: "In this step, we'll leave the Web Project on the back burner while we focus on the Domain and Data Layers."
image: "persistence-ignorant-asp-net-identity-with-patterns.jpg"
tags:
- dotnet-core
- asp-net-core
- asp-net-core-identity
- patterns
- architecture
---

 * [Part 1][1]
 * **Part 2**
 
**The source code for this series of posts is available at on my GitHub: [https://github.com/timschreiber/ASP.NET-Core-Identity-Example][2]**

*NOTES:*
 * *This series of posts requires a functional understanding of ASP.NET Core Identity If you haven't had at least some kind of exposure, this you should probably start [here][3].*
 * *If you haven't read my previous posts, I'd suggest you stop here and read at least the first one to understand the problems I had with ASP.NET Identity 2.0 and how I solved them.*

In Part 1, we started building our `AspNetCoreIdentityExample` solution, beginning with the `AspNetCoreIdentityExample.Web project`. First we got it running with the out-of-the-box Entity Framework implementation, then we broke it in preparation for our custom, persistence-ignorant version. In this step, we'll be adding the Domain and Data Layers.

## The Domain Layer

Now, let's create a class library for our Domain Layer. Our application domain is made up of our entity classes, interfaces for our repositories, and our Unit of Work interface. Our Data Layer (which we'll code later) will implement these interfaces to allow our entities to be persisted to the database. The Domain Layer forms the core of our entire, well-layered, loosely-coupled application architecture.

So let's add a class library project to the solution. I called mine `AspNetCoreIdentityExample.Domain`. Once the project has been created, let's add two folders: `Entities` and `Repositories`.

### Entities

In keeping with our persistence ignorant design, our entities are just Plain Old CLR Objects (POCOs), and in order to get the same ASP.NET Identity functionality from our application as we would from the out-of-the-box Entity Framework implementation, we'll create the following classes in the Entities folder:

#### User.cs

    using System;

    namespace AspNetCoreIdentityExample.Domain.Entities
    {
        public class User
        {
            public string Id { get; set; }
            public int AccessFailedCount { get; set; }
            public string ConcurrencyStamp { get; set; }
            public string Email { get; set; }
            public bool EmailConfirmed { get; set; }
            public bool LockoutEnabled { get; set; }
            public DateTimeOffset? LockoutEnd { get; set; }
            public string NormalizedEmail { get; set; }
            public string NormalizedUserName { get; set; }
            public string PasswordHash { get; set; }
            public string PhoneNumber { get; set; }
            public bool PhoneNumberConfirmed { get; set; }
            public string SecurityStamp { get; set; }
            public bool TwoFactorEnabled { get; set; }
            public string UserName { get; set; }
        }
    }

#### Role.cs

    namespace AspNetCoreIdentityExample.Domain.Entities
    {
        public class Role
        {
            public string Id { get; set; }
            public string ConcurrencyStamp { get; set; }
            public string Name { get; set; }
            public string NormalizedName { get; set; }
        }
    }

#### UserLogin.cs

    namespace AspNetCoreIdentityExample.Domain.Entities
    {
        public class UserLogin
        {
            public string LoginProvider { get; set; }
            public string ProviderKey { get; set; }
            public string ProviderDisplayName { get; set; }
            public string UserId { get; set; }
        }
    }

#### ClaimBase.cs

    namespace AspNetCoreIdentityExample.Domain.Entities
    {
        public abstract class ClaimBase
        {
            public int Id { get; set; }
            public string ClaimType { get; set; }
            public string ClaimValue { get; set; }
        }
    }

#### UserClaim.cs

    namespace AspNetCoreIdentityExample.Domain.Entities
    {
        public class UserClaim : ClaimBase
        {
            public string UserId { get; set; }
        }
    }

#### RoleClaim.cs

    namespace AspNetCoreIdentityExample.Domain.Entities
    {
        public class RoleClaim : ClaimBase
        {
            public string RoleId { get; set; }
        }
    }

#### UserToken.cs

    namespace AspNetCoreIdentityExample.Domain.Entities
    {
        public class UserToken
        {
            public string UserId { get; set; }
            public string LoginProvider { get; set; }
            public string Name { get; set; }
            public string Value { get; set; }
        }
    }

### Repositories

Next up are the repositories. We're not implementing anything here, just creating the interfaces that our future Data Layer will implement. Each repository can be expected to have basic CRUD methods, so we can use a generic repository interface like this:

#### IRepository.cs

    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;

    namespace AspNetCoreIdentityExample.Domain.Repositories
    {
        public interface IRepository<TEntity, TKey> where TEntity : class
        {
            IEnumerable<TEntity> All();

            TEntity Find(TKey key);

            void Add(TEntity entity);

            void Update(TEntity entity);

            void Remove(TKey key);
        }
    }

However, some repositories will need additional methods. So for them, we can create specialized interfaces that inherit from the generic repository:

#### IRoleClaimRepository.cs

    using AspNetCoreIdentityExample.Domain.Entities;
    using System.Collections.Generic;

    namespace AspNetCoreIdentityExample.Domain.Repositories
    {
        public interface IRoleClaimRepository : IRepository<RoleClaim, int>
        {
            IEnumerable<RoleClaim> FindByRoleId(string roleId);
        }
    }

#### IRoleRepository.cs

    using AspNetCoreIdentityExample.Domain.Entities;
    using System.Threading;
    using System.Threading.Tasks;

    namespace AspNetCoreIdentityExample.Domain.Repositories
    {
        public interface IRoleRepository : IRepository<Role, string>
        {
            Role FindByName(string roleName);
        }
    }

#### IUserClaimRepository.cs

    using AspNetCoreIdentityExample.Domain.Entities;
    using System;
    using System.Collections.Generic;
    using System.Text;

    namespace AspNetCoreIdentityExample.Domain.Repositories
    {
        public interface IUserClaimRepository : IRepository<UserClaim, int>
        {
            IEnumerable<UserClaim> GetByUserId(string userId);
            IEnumerable<User> GetUsersForClaim(string claimType, string claimValue);
        }
    }

#### IUserLoginRepository.cs

    using AspNetCoreIdentityExample.Domain.Entities;
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;

    namespace AspNetCoreIdentityExample.Domain.Repositories
    {
        public interface IUserLoginRepository : IRepository<UserLogin, UserLoginKey>
        {
            IEnumerable<UserLogin> FindByUserId(string userId);
        }
    }

#### IUserRepository.cs

    using AspNetCoreIdentityExample.Domain.Entities;
    using System.Threading;
    using System.Threading.Tasks;

    namespace AspNetCoreIdentityExample.Domain.Repositories
    {
        public interface IUserRepository : IRepository<User, string>
        {
            User FindByNormalizedUserName(string normalizedUserName);

            User FindByNormalizedEmail(string normalizedEmail);
        }
    }

#### IUserRoleRepository.cs

The one specialized repository interface that won't inherit from the base repository interface is the `IUserRoleRepository` interface which only deals with the many-to-many relationship between `User` and `Role`.

    using AspNetCoreIdentityExample.Domain.Entities;
    using System;
    using System.Collections.Generic;
    using System.Text;

    namespace AspNetCoreIdentityExample.Domain.Repositories
    {
        public interface IUserRoleRepository
        {
            void Add(string UserId, string roleName);
            void Remove(string userId, string roleName);
            IEnumerable<string> GetRoleNamesByUserId(string userId);
            IEnumerable<User> GetUsersByRoleName(string roleName);
        }
    }

### Unit of Work

Another important design pattern we're following is the Unit of Work pattern, which ensures that all changes are sent as a single transaction to the data store.

Our IUnitOfWork interface defines the methods that we'll implement later in the data layer. Because we may need to use more than one repository in a single Unit of Work transaction, it's important that we design our IUnitOfWork interface to ensure all of our repositories are using the same transaction during any given transaction scope. So we're putting the getters for our repositories in there as well.

Once again, we're not including anything that might couple this interface to any specific persistence mechanism. Those are implementation details that we'll tackle later in the Data Layer.

#### IUnitOfWork.cs

    using AspNetCoreIdentityExample.Domain.Entities;
    using AspNetCoreIdentityExample.Domain.Repositories;
    using System;

    namespace AspNetCoreIdentityExample.Domain
    {
        public interface IUnitOfWork : IDisposable
        {
            IRoleRepository RoleRepository { get; }
            IRoleClaimRepository RoleClaimRepository { get; }
            IUserRepository UserRepository { get; }
            IUserClaimRepository UserClaimRepository { get; }
            IUserLoginRepository UserLoginRepository { get; }
            IRepository<UserToken, UserTokenKey> UserTokenRepository { get; }
            IUserRoleRepository UserRoleRepository { get; }

            void Commit();
        }
    }


   
[1]: http://timschreiber.com/2018/05/07/aspnet-core-identity-with-patterns
[2]: https://github.com/timschreiber/ASP.NET-Core-Identity-Example
[3]: https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity?view=aspnetcore-2.1&tabs=visual-studio%2Caspnetcore2x

