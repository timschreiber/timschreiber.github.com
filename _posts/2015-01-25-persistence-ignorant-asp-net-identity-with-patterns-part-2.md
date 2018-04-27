--- 
title: "Persistence-Ignorant ASP.NET Identity with Patterns (Part 2)"
canonical: "http://timschreiber.com/2015/01/25/persistence-ignorant-asp-net-identity-with-patterns-part-2/"
date: 2015-01-25
layout: post3
comments: true
description: "Creating the Solution, breaking the EF dependencies, and coding the Domain Layer (Entities and Repository and Unit of Work interfaces)."
image: "persistence-ignorant-asp-net-identity-with-patterns.jpg"
color: "#063352"
featured: 3
tags:
- asp-net
- mvc-5
- patterns
- architecture
---

* [Part 1][2]
* **Part 2**
* [Part 3][3]
* [Part 4][4]

**The source code for this series of posts is available at on my GitHub: [https://github.com/timschreiber/Mvc5IdentityExample][gh]**

###### *This series of posts requires a functional understanding of ASP.NET Identity 2.x. If you haven't had at least some kind of exposure, this is a good place to start: [http://www.asp.net/identity][1].*

In [Part 1][2], I identified some of the shortcomings in the default template for ASP.NET MVC 5 web applications using ASP.NET Identity for &quot;Individual User Accounts&quot; authentication, and then laid out the requirements for a better implementation. In this part, we'll create the Visual Studio Solution, break the dependencies on Entity Framework, and start coding our Domain Layer.

### Setting Up the Visual Studio Solution

###### *Note: This tutorial assumes you have enough experience with Visual Studio to create projects, add projects to solutions, add project references, and manage NuGet packages.*

The first thing to do is to launch Visual Studio 2013 and create a new ASP.NET Web Application, using the MVC template with &quot;Individual User Accounts&quot; authentication. I called mine `Mvc5IdentityExample.Web`, and I named the solution `Mvc5IdentityExample` (without the `.Web` part). Visual Studio will work on it for a few seconds, and then your new project will be ready. If you were to run it as it is, you would have a functional skeleton website with basic ASP.NET Identity functionality that includes the ability to register, login, etc. But all that out-of-the box functionality comes at the price all that tight coupling and code smell I mentioned in [Part 1][1].

#### Break the Coupling

So instead of running it, let's go in and delete stuff. The first thing we need to get rid of is the reference to `Microsoft.AspNet.Identity.EntityFramework`. To do this, launch the Package Manager Console and run the following commands:

    Uninstall-Package Microsoft.AspNet.Identity.EntityFramework
    Uninstall-Package EntityFramework

You may have to restart Visual Studio to complete the uninstall of EntityFramework. Now, let's just make sure all our packages are up-to-date. Go back to the Package Manager Console and run the following command:

    Update-Package
    
Next, lets delete `IdentityModels.cs` from the `Models` folder. And since we don't want to couple the Presentation Layer to SQL Server, let's just go ahead and delete the `App_Data` folder, too. We'll worry about persistence in [Part 3][3]. Finally, open the `web.config` and remove the following:

    <configSections>
        <section name="entityFramework" type="System.Data.Entity.Internal.ConfigFile.EntityFrameworkSection, EntityFramework, Version=6.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" requirePermission="false" />
    </configSections>

and

    <entityFramework>
        <defaultConnectionFactory type="System.Data.Entity.Infrastructure.LocalDbConnectionFactory, EntityFramework">
            <parameters>
                <parameter value="v11.0" />
            </parameters>
        </defaultConnectionFactory>
        <providers>
            <provider invariantName="System.Data.SqlClient" type="System.Data.Entity.SqlServer.SqlProviderServices, EntityFramework.SqlServer" />
        </providers>
    </entityFramework>

#### The Domain Layer

The next thing we need to do is create a class library for our Domain Layer. Our application domain is made up of our entity classes, interfaces for our repositories, and our Unit of Work interface. Our Data Layer (which we'll code in [Part 3][3]) will implement these interfaces to allow our entities to be persisted to a data store. The Domain Layer forms the core of our entire, well-layered, loosely-coupled application architecture.

So let's add a Class Library project to the solution. I called mine `Mvc5IdentityExample.Domain`. Once the project has been created, let's add two folders: `Entities` and `Repositories`.

##### **Entities**
With the project and folders created, we're ready to start coding. We'll start with the entity classes. In keeping with our persistence-ignorant design, these are just Plain Old CLR Objects (POCOs). In order to get the same ASP.NET Identity functionality from our application as we would from the out-of-the-box Entity Framework implementation, we'll create these four classes in our `Entities` folder:

###### User.cs

    using System;
    using System.Collections.Generic;

    namespace Mvc5IdentityExample.Domain.Entities
    {
        public class User
        {
            #region Fields
            private ICollection<Claim> _claims;
            private ICollection<ExternalLogin> _externalLogins;
            private ICollection<Role> _roles;
            #endregion

            #region Scalar Properties
            public Guid UserId { get; set; }
            public string UserName { get; set; }
            public virtual string PasswordHash { get; set; }
            public virtual string SecurityStamp { get; set; }
            #endregion

            #region Navigation Properties
            public virtual ICollection<Claim> Claims
            {
                get { return _claims ?? (_claims = new List<Claim>()); }
                set { _claims = value; }
            }

            public virtual ICollection<ExternalLogin> Logins
            {
                get
                {
                    return _externalLogins ??
                        (_externalLogins = new List<ExternalLogin>());
                }
                set { _externalLogins = value; }
            }

            public virtual ICollection<Role> Roles
            {
                get { return _roles ?? (_roles = new List<Role>()); }
                set { _roles = value; }
            }
            #endregion
        }
    }

###### Role.cs

    using System;
    using System.Collections.Generic;

    namespace Mvc5IdentityExample.Domain.Entities
    {
        public class Role
        {
            #region Fields
            private ICollection<User> _users;
            #endregion

            #region Scalar Properties
            public Guid RoleId { get; set; }
            public string Name { get; set; }
            #endregion

            #region Navigation Properties
            public ICollection<User> Users
            {
                get { return _users ?? (_users = new List<User>()); }
                set { _users = value; }
            }
            #endregion
        }
    }

###### ExternalLogin.cs

    using System;

    namespace Mvc5IdentityExample.Domain.Entities
    {
        public class ExternalLogin
        {
            private User _user;

            #region Scalar Properties
            public virtual string LoginProvider { get; set; }
            public virtual string ProviderKey { get; set; }
            public virtual Guid UserId { get; set; }
            #endregion

            #region Navigation Properties
            public virtual User User
            {
                get { return _user; }
                set
                {
                    _user = value;
                    UserId = value.UserId;
                }
            }
            #endregion
        }
    }

###### Claim.cs

    using System;

    namespace Mvc5IdentityExample.Domain.Entities
    {
        public class Claim
        {
            private User _user;

            #region Scalar Properties
            public virtual int ClaimId { get; set; }
            public virtual Guid UserId { get; set; }
            public virtual string ClaimType { get; set; }
            public virtual string ClaimValue { get; set; }
            #endregion

            #region Navigation Properties
            public virtual User User
            {
                get { return _user; }
                set
                {
                    if (value == null)
                        throw new ArgumentNullException("value");
                    _user = value;
                    UserId = value.UserId;
                }
            }
            #endregion
        }
    }

##### **Repositories**

Next up are the repositories. We're not implementing anything here, just creating the interfaces that our future Data Layer will implement. One important pattern we'll follow is the generic repository pattern. Creating a repository for each entity type would mean we'd have to duplicate a lot of code later on. Using the generic repository pattern eliminates that wasted effort. Our generic repository interface includes all the usual CRUD operations. Create the following interface in the `Repositories` folder.
    
###### IRepository.cs

    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;

    namespace Mvc5IdentityExample.Domain.Repositories
    {
        public interface IRepository<TEntity> where TEntity : class
        {
            List<TEntity> GetAll();
            Task<List<TEntity>> GetAllAsync();
            Task<List<TEntity>> GetAllAsync(CancellationToken cancellationToken);

            List<TEntity> PageAll(int skip, int take);
            Task<List<TEntity>> PageAllAsync(int skip, int take);
            Task<List<TEntity>> PageAllAsync(CancellationToken cancellationToken, int skip, int take);

            TEntity FindById(object id);
            Task<TEntity> FindByIdAsync(object id);
            Task<TEntity> FindByIdAsync(CancellationToken cancellationToken, object id);

            void Add(TEntity entity);
            void Update(TEntity entity);
            void Remove(TEntity entity);
        }
    }

You may have seen some generic repository examples that expose IQueryables, IEnumerables, and DbSets. Such designs violate the single responsibility principle by leaking persistence logic (like querying) to other layers where is doesn't belong. Our design keeps those concerns where they belong by returning only generic lists and our entities, so we need to abstract any special-case querying functionality behind entity-specific interfaces that extend `IRepository`. Our application has three:
    
###### IUserRepository.cs

    using Mvc5IdentityExample.Domain.Entities;
    using System.Threading;
    using System.Threading.Tasks;

    namespace Mvc5IdentityExample.Domain.Repositories
    {
        public interface IUserRepository : IRepository<User>
        {
            User FindByUserName(string username);
            Task<User> FindByUserNameAsync(string username);
            Task<User> FindByUserNameAsync(CancellationToken cancellationToken, string username);

            User FindByEmail(string email);
            Task<User> FindByEmailAsync(string email);
            Task<User> FindByEmailAsync(CancellationToken cancellationToken, string email);
        }
    }

###### IRoleRepository.cs

    using Mvc5IdentityExample.Domain.Entities;
    using System.Threading;
    using System.Threading.Tasks;

    namespace Mvc5IdentityExample.Domain.Repositories
    {
        public interface IRoleRepository : IRepository<Role>
        {
            Role FindByName(string roleName);
            Task<Role> FindByNameAsync(string roleName);
            Task<Role> FindByNameAsync(CancellationToken cancellationToken, string roleName);
        }
    }

###### IExternalLoginRepository.cs

    using Mvc5IdentityExample.Domain.Entities;
    using System.Threading;
    using System.Threading.Tasks;

    namespace Mvc5IdentityExample.Domain.Repositories
    {
        public interface IExternalLoginRepository : IRepository<ExternalLogin>
        {
            ExternalLogin GetByProviderAndKey(string loginProvider, string providerKey);
            Task<ExternalLogin> GetByProviderAndKeyAsync(string loginProvider, string providerKey);
            Task<ExternalLogin> GetByProviderAndKeyAsync(CancellationToken cancellationToken, string loginProvider, string providerKey);
        }
    }
    
##### **Unit of Work**

Another important design pattern we're following is the Unit of Work pattern, which does two important things:

1. Maintains an in-memory collection of changes, and
2. Sends the changes as a single transaction to the data store.

Our `IUnitOfWork` interface defines the methods that we'll implement in the Data Layer in [Part 3][3]. Because we may need to use more than one repository to in a single Unit of Work transaction, it's important that we design our `IUnitOfWork` interface to ensure all our repositories are using the same transaction during any given transaction scope. So, we're putting the getters for our repositories in there as well.

Once again, we're not including anything that might couple this interface to any specific persistence mechanism. Those are implementation details that we'll tackle in [Part 3][3].

###### IUnitOfWork.cs

    using Mvc5IdentityExample.Domain.Repositories;
    using System;
    using System.Threading;
    using System.Threading.Tasks;

    namespace Mvc5IdentityExample.Domain
    {
        public interface IUnitOfWork : IDisposable
        {
            #region Properties
            IExternalLoginRepository ExternalLoginRepository { get; }
            IRoleRepository RoleRepository { get; }
            IUserRepository UserRepository { get; }
            #endregion

            #region Methods
            int SaveChanges();
            Task<int> SaveChangesAsync();
            Task<int> SaveChangesAsync(CancellationToken cancellationToken);
            #endregion
        }
    }

### Next Steps

In this part, we created the Visual Studio Solution for our ASP.NET Identity Example, broke the out-of-the-box dependencies on Entity Framework, and coded our Domain Layer. In [Part 3][3], we'll move on to the Data Layer, in which we'll code our implementation of the repository and Unit of Work interfaces.

Until next time, happy coding!


[1]: http://www.asp.net/identity
[2]: /2015/01/14/persistence-ignorant-asp-net-identity-with-patterns-part-1/
[3]: /2015/01/26/persistence-ignorant-asp-net-identity-with-patterns-part-3/
[4]: /2015/01/28/persistence-ignorant-asp-net-identity-with-patterns-part-4/
[gh]: https://github.com/timschreiber/Mvc5IdentityExample
