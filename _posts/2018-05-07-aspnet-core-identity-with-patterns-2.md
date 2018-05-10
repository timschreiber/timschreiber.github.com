--- 
title: "ASP.NET Core Identity with Patterns (Part 2 of 3)"
canonical: "http://timschreiber.com/2018/05/07/aspnet-core-identity-with-patterns-2/"
date: "2018-05-07 12:56 PM"
layout: post3
comments: true
description: "In this step, we'll leave the Web Project on the back burner while we focus on the Domain and Data Layers."
image: "asp-net-core-identity-with-patterns.jpg"
imagewidth: 1024
imageheight: 576
featured: 3
tags:
- dotnet-core
- asp-net-core
- asp-net-core-identity
- patterns
- architecture
---

 * [Part 1][1]
 * **Part 2**
 * [Part 3][4]
 
**The source code for this series of posts is available at on my GitHub: [https://github.com/timschreiber/ASP.NET-Core-Identity-Example][2]**

*NOTES:*
 * *This series of posts requires a functional understanding of ASP.NET Core Identity If you haven't had at least some kind of exposure, this you should probably start [here][3].*
 * *If you haven't read my [my previous posts][5], I'd suggest you stop here and read at least the first one to understand the problems I had with ASP.NET Identity 2.0 and how I solved them.*

In Part 1, we started building our `AspNetCoreIdentityExample` solution, beginning with the `AspNetCoreIdentityExample.Web project`. First we got it running with the out-of-the-box Entity Framework implementation, then we broke it in preparation for our custom, persistence-ignorant version. In this step, we'll be adding the Domain and Data Layers.

## The Domain Layer

Now, let's create a class library for our Domain Layer. Our application domain is made up of our entity classes, interfaces for our repositories, and our Unit of Work interface. Our Data Layer (which we'll code later) will implement these interfaces to allow our entities to be persisted to the database. The Domain Layer forms the core of our entire, well-layered, loosely-coupled application architecture.

So let's add a class library project to the solution. I called mine `AspNetCoreIdentityExample.Domain`. Once the project has been created, let's add two folders: `Entities` and `Repositories`.

### Entities

In keeping with our persistence ignorant design, our entities are just Plain Old CLR Objects (POCOs), and in order to get the same ASP.NET Identity functionality from our application as we would from the out-of-the-box Entity Framework implementation, we'll create the following classes in the Entities folder:

Because `RoleClaim` and `UserClaim` are essentially the same class, differing only in the objects they're related to, I've chosen to define a `ClaimBase` class that the other two classes will inherit from:

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
    
#### RoleClaim.cs

    namespace AspNetCoreIdentityExample.Domain.Entities
    {
        public class RoleClaim : ClaimBase
        {
            public string RoleId { get; set; }
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

The `UserLogin` and `UserToken` entities use composite keys, and it's difficult to use a generic repsotitory interface without representing those keys as a class that can be used in a generic type parameter. So, another OO design decision I made was to make composite keys their own classes, from which the corresponding entities would inherit. This also simplifies things in the data layer (when we get there).

#### UserLogin.cs

    namespace AspNetCoreIdentityExample.Domain.Entities
    {
        public class UserLogin : UserLoginKey
        {
            public string ProviderDisplayName { get; set; }
            public string UserId { get; set; }
        }

        public class UserLoginKey
        {
            public string LoginProvider;
            public string ProviderKey;
        }
    }

#### UserToken.cs

    namespace AspNetCoreIdentityExample.Domain.Entities
    {
        public class UserToken : UserTokenKey
        {
            public string Value { get; set; }
        }

        public class UserTokenKey
        {
            public string UserId { get; set; }
            public string LoginProvider { get; set; }
            public string Name { get; set; }
        }
    }    

The remaining `Role` and `User` entities are just plain old classes:
    
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

You might notice we don't have an `IUserTokenRepository` interface. That's simply because we don't have a need beyond that which the generic repository interface already provides.

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

## The Data Layer

Whereas ASP.NET Core Identity uses Entity Framework out-of-the-box, for this tutorial, I've chosen to use Dapper, which is a fast, lightweight object mapper for SQL queries. Since we're using a persistence-ignorant approach, we could just as easily use another ORM or even plain SQL with little or no modification to our Domain layer.

The first thing we need to do is to add another class library to the solution. I called mine `AspNetCoreIdentityExample.Data`. Once, the project has been created, we'll need to add a folder called `Repositories` and add a project reference to the `AspNetCoreIdentityExample.Domain` project.

Next, we'll need to add a reference to Dapper. To do this, launch the Package Manager Console and run the following command:

    PM> Install-Package Dapper

### Repositories

With Dapper installed, now we can move on to implementing our repositories. As we dive into the code, I want you to notice a couple of things about the classes:

 1. There is no default constructor. That's because we're following the Dependency Injection pattern by providing the repository with the IDbTransaction it needs in the constructor. This ensures that all of our repositories will use the same transaction, which is a main objective of the Unit of Work pattern.

 2. The repository implementations are marked with the internal access modifier. That's because these repository classes are implementation details of the Data Layer that don't need to be exposed beyond the Unit of Work. Making them public could allow you to couple them to other layers, which is exactly what we're trying to avoid.

All of our repositories have some common boilerplate code that we can abstract into a base class. So let's start by creating the following class in the Repositories folder:

#### RepositoryBase.cs

    using System.Collections.Generic;
    using System.Data;
    using Dapper;

    namespace AspNetCoreIdentityExample.Data.Repositories
    {
        internal abstract class RepositoryBase
        {
            private IDbTransaction _transaction;
            private IDbConnection Connection { get { return _transaction.Connection; } }

            public RepositoryBase(IDbTransaction transaction)
            {
                _transaction = transaction;
            }

            protected T ExecuteScalar<T>(string sql, object param)
            {
                return Connection.ExecuteScalar<T>(sql, param, _transaction);
            }

            protected T QuerySingleOrDefault<T>(string sql, object param)
            {
                return Connection.QuerySingleOrDefault<T>(sql, param, _transaction);
            }

            protected IEnumerable<T> Query<T>(string sql, object param = null)
            {
                return Connection.Query<T>(sql, param, _transaction);
            }

            protected void Execute(string sql, object param)
            {
                Connection.Execute(sql, param, _transaction);
            }
        }
    }

The entity-specific repository classes extend the base repository class and implement the applicable interfaces from the Domain Layer. Let's add the following classes to the Repositories folder:

#### RoleClaimRepository.cs

    using AspNetCoreIdentityExample.Domain.Entities;
    using AspNetCoreIdentityExample.Domain.Repositories;
    using System.Collections.Generic;
    using System.Data;

    namespace AspNetCoreIdentityExample.Data.Repositories
    {
        internal class RoleClaimRepository : RepositoryBase, IRoleClaimRepository
        {
            public RoleClaimRepository(IDbTransaction transaction)
                : base(transaction)
            { }

            public void Add(RoleClaim entity)
            {
                entity.Id = ExecuteScalar<int>(
                    sql: @"
                        INSERT INTO AspNetRoleClaims(ClaimType, ClaimValue, RoldId)
                        VALUES(@ClaimType, @ClaimValue, @RoldId);
                        SELECT SCOPE_IDENTITY()",
                    param: entity
                );
            }

            public RoleClaim Find(int key)
            {
                return QuerySingleOrDefault<RoleClaim>(
                    sql: "SELECT * FROM AspNetRoleClaims WHERE Id = @key",
                    param: new { key }
                );
            }

            public IEnumerable<RoleClaim> FindByRoleId(string roleId)
            {
                return Query<RoleClaim>(
                    sql: "SELECT * FROM AspNetRoleClaims WHERE RoleId = @roleId",
                    param: new { roleId }
                );
            }

            public IEnumerable<RoleClaim> All()
            {
                return Query<RoleClaim>(
                    sql: "SELECT * FROM AspNetRoleClaims"
                );
            }

            public void Remove(int key)
            {
                Execute(
                    sql: "DELETE FROM AspNetRoleClaims WHERE Id = @key",
                    param: new { key } 
                );
            }

            public void Update(RoleClaim entity)
            {
                Execute(
                    sql: @"
                        UPDATE AspNetRoleClaims SET ClaimType = @ClaimType,
                            ClaimValue = @ClaimValue, RoleId = @RoleId
                        WHERE Id = @Id",
                    param: entity
                );
            }
        }
    }

#### RoleRepository.cs

    using AspNetCoreIdentityExample.Domain.Entities;
    using AspNetCoreIdentityExample.Domain.Repositories;
    using System;
    using System.Collections.Generic;
    using System.Data;

    namespace AspNetCoreIdentityExample.Data.Repositories
    {
        internal class RoleRepository : RepositoryBase, IRoleRepository
        {
            public RoleRepository(IDbTransaction transaction)
                : base(transaction)
            { }

            public void Add(Role entity)
            {
                Execute(
                    sql: @"
                        INSERT INTO AspNetRoles(Id, ConcurrencyStamp, [Name], NormalizedName)
                        VALUES(@Id, @ConcurrencyStamp, @Name, @NormalizedName)",
                    param: entity
                );
            }

            public IEnumerable<Role> All()
            {
                return Query<Role>(
                    sql: "SELECT * FROM AspNetRoles"
                );
            }

            public Role Find(string key)
            {
                return QuerySingleOrDefault<Role>(
                    sql: "SELECT * FROM AspNetRoles WHERE Id = @key",
                    param: new { key }
                );
            }

            public Role FindByName(string roleName)
            {
                return QuerySingleOrDefault<Role>(
                    sql: "SELECT * FROM AspNetRoles WHERE [Name] = @roleName",
                    param: new { roleName }
                );
            }


            public void Remove(string key)
            {
                Execute(
                    sql: "DELETE FROM AspNetRoles WHERE Id = @key",
                    param: new { key }
                );

                throw new NotImplementedException();
            }

            public void Update(Role entity)
            {
                Execute(
                    sql: @"
                        UPDATE AspNetRoles SET ConcurrencyStamp = @ConcurrencyStamp,
                            [Name] = @Name, NormalizedName = @NormalizedName
                        WHERE Id = @Id",
                    param: entity
                );
            }
        }
    }

#### UserClaimRepository.cs

    using AspNetCoreIdentityExample.Domain.Entities;
    using AspNetCoreIdentityExample.Domain.Repositories;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Text;

    namespace AspNetCoreIdentityExample.Data.Repositories
    {
        internal class UserClaimRepository : RepositoryBase, IUserClaimRepository
        {
            public UserClaimRepository(IDbTransaction transaction)
                : base(transaction)
            {
            }

            public void Add(UserClaim entity)
            {
                entity.Id = ExecuteScalar<int>(
                    sql: @"
                        INSERT INTO AspNetUserClaims(ClaimType, ClaimValue, UserId)
                        VALUES(@ClaimType, @ClaimValue, @UserId);
                        SELECT SCOPE_IDENTITY()",
                    param: entity
                );
            }

            public IEnumerable<UserClaim> All()
            {
                return Query<UserClaim>(
                    sql: @"
                        SELECT Id, ClaimType, ClaimValue, UserId
                        FROM AspNetUserClaims"
                );
            }

            public UserClaim Find(int key)
            {
                return QuerySingleOrDefault<UserClaim>(
                    sql: @"
                        SELECT Id, ClaimType, ClaimValue, UserId
                        FROM AspNetUserClaims WHERE Id = @key",
                    param: new { key }
                );
            }

            public IEnumerable<UserClaim> GetByUserId(string userId)
            {
                return Query<UserClaim>(
                    sql: @"
                        SELECT Id, ClaimType, ClaimValue, UserId
                        FROM AspNetUserClaims
                        WHERE UserId = @userId",
                    param: new { userId }
                );
            }

            public IEnumerable<User> GetUsersForClaim(string claimType, string claimValue)
            {
                return Query<User>(
                    sql: @"
                        SELECT
	                        u.Id, u.AccessFailedCount, u.ConcurrencyStamp, u.Email,
                            u.EmailConfirmed, u.LockoutEnabled, u.LockoutEnd,
                            u.NormalizedEmail, u.NormalizedUserName, u.PasswordHash,
                            u.PhoneNumber, u.PhoneNumberConfirmed, u.SecurityStamp,
	                        u.TwoFactorEnabled, u.UserName
                        FROM
	                        AspNetUserClaims c INNER JOIN
                            AspNetUsers u ON c.UserId = u.Id
                        WHERE
	                        c.ClaimType = @claimType AND
                            c.ClaimValue = @claimValue
                    ",
                    param: new { claimType, claimValue }
                );
            }

            public void Remove(int key)
            {
                Execute(
                    sql: @"
                        DELETE FROM AspNetUserClaims
                        WHERE Id = @key",
                    param: new { key }
                );
            }

            public void Update(UserClaim entity)
            {
                Execute(
                    sql: @"
                        UPDATE AspNetUserClaims SET ClaimType = @ClaimType,
                            ClaimValue = @ClaimValue, UserId = @UserId
                        WHERE Id = @Id",
                    param: entity
                );
            }
        }
    }

#### UserLoginRepository.cs

    using AspNetCoreIdentityExample.Domain.Entities;
    using AspNetCoreIdentityExample.Domain.Repositories;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Text;

    namespace AspNetCoreIdentityExample.Data.Repositories
    {
        internal class UserLoginRepository : RepositoryBase, IUserLoginRepository
        {
            public UserLoginRepository(IDbTransaction transaction)
                : base(transaction)
            { }

            public void Add(UserLogin entity)
            {
                Execute(
                    sql: @"
                        INSERT INTO AspNetUserLogins(LoginProvider, ProviderKey, ProviderDisplayName, UserId)
                        VALUES(@LoginProvider, @ProviderKey, @ProviderDisplayName, @UserId)",
                    param: entity
                );
            }

            public IEnumerable<UserLogin> All()
            {
                return Query<UserLogin>(
                    sql: "SELECT * FROM AspNetUserLogins"
                );
            }

            public UserLogin Find(UserLoginKey id)
            {
                return QuerySingleOrDefault<UserLogin>(
                    sql: @"
                        SELECT * FROM AspNetUserLogins
                        WHERE LoginProvider = @LoginProvider AND ProviderKey = @ProviderKey",
                    param: id
                );
            }

            public IEnumerable<UserLogin> FindByUserId(string userId)
            {
                return Query<UserLogin>(
                    sql: "SELECT * FROM AspNetUserLogins WHERE UserId = @userId",
                    param: new { userId }
                );
            }

            public void Remove(UserLoginKey key)
            {
                Execute(
                    sql: @"
                        DELETE FROM AspNetUserLogins
                        WHERE LoginProvider = @LoginProvider AND ProviderKey = @ProviderKey",
                    param: key
                );
            }

            public void Update(UserLogin entity)
            {
                Execute(
                    sql: @"
                        UPDATE AspNetUserLogins SET ProviderDisplayName = @ProviderDisplayName,
                            UserId = @UserId
                        WHERE LoginProvider = @LoginProvider AND ProviderKey = @ProviderKey",
                    param: entity
                );
            }
        }
    }

#### UserRepository.cs

    using AspNetCoreIdentityExample.Domain.Entities;
    using AspNetCoreIdentityExample.Domain.Repositories;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Text;

    namespace AspNetCoreIdentityExample.Data.Repositories
    {
        internal class UserRepository : RepositoryBase, IUserRepository
        {
            public UserRepository(IDbTransaction transaction)
                : base(transaction)
            { }

            public void Add(User entity)
            {
                Execute(
                    sql: @"
                        INSERT INTO AspNetUsers(Id, AccessFailedCount, ConcurrencyStamp, Email,
	                        EmailConfirmed, LockoutEnabled, LockoutEnd, NormalizedEmail,
	                        NormalizedUserName, PasswordHash, PhoneNumber, PhoneNumberConfirmed,
	                        SecurityStamp, TwoFactorEnabled, UserName)
                        VALUES(@Id, @AccessFailedCount, @ConcurrencyStamp, @Email, @EmailConfirmed,
	                        @LockoutEnabled, @LockoutEnd, @NormalizedEmail, @NormalizedUserName,
	                        @PasswordHash, @PhoneNumber, @PhoneNumberConfirmed, @SecurityStamp,
	                        @TwoFactorEnabled, @UserName)",
                    param: entity
                );
            }

            public IEnumerable<User> All()
            {
                return Query<User>(
                    sql: "SELECT * FROM AspNetUsers"
                );
            }

            public User Find(string key)
            {
                return QuerySingleOrDefault<User>(
                    sql: "SELECT * FROM AspNetUsers WHERE Id = @key",
                    param: new { key }
                );
            }

            public User FindByNormalizedEmail(string normalizedEmail)
            {
                return QuerySingleOrDefault<User>(
                    sql: "SELECT * FROM AspNetUsers WHERE NormalizedEmail = @normalizedEmail",
                    param: new { normalizedEmail }
                );
            }

            public User FindByNormalizedUserName(string normalizedUserName)
            {
                return QuerySingleOrDefault<User>(
                    sql: "SELECT * FROM AspNetUsers WHERE NormalizedUserName = @normalizedUserName",
                    param: new { normalizedUserName }
                );
            }

            public void Remove(string key)
            {
                Execute(
                    sql: "DELETE FROM AspNetUsers WHERE Id = @key",
                    param: new { key }
                );
            }

            public void Update(User entity)
            {
                Execute(
                    sql: @"
                        UPDATE AspNetUsers SET AccessFailedCount = @AccessFailedCount,
	                        ConcurrencyStamp = @ConcurrencyStamp, Email = @Email,
	                        EmailConfirmed = @EmailConfirmed, LockoutEnabled = @LockoutEnabled,
	                        LockoutEnd = @LockoutEnd, NormalizedEmail = @NormalizedEmail,
	                        NormalizedUserName = @NormalizedUserName, PasswordHash = @PasswordHash,
	                        PhoneNumber = @PhoneNumber, PhoneNumberConfirmed = @PhoneNumberConfirmed,
	                        SecurityStamp = @SecurityStamp, TwoFactorEnabled = @TwoFactorEnabled,
	                        UserName = @UserName
                        WHERE Id = @Id",
                    param: entity);
            }
        }
    }

#### UserRoleRepository.cs

    using AspNetCoreIdentityExample.Domain.Entities;
    using AspNetCoreIdentityExample.Domain.Repositories;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Text;

    namespace AspNetCoreIdentityExample.Data.Repositories
    {
        internal class UserRoleRepository : RepositoryBase, IUserRoleRepository
        {
            public UserRoleRepository(IDbTransaction transaction) : base(transaction)
            {
            }

            public void Add(string userId, string roleName)
            {
                Execute(
                    sql: @"
                        INSERT INTO AspNetUserRoles(UserId, RoleId)
                        SELECT TOP 1 @userId, Id FROM AspNetRoles
                        WHERE NormalizedName = @roleName",
                    param: new { userId, roleName }
                );
            }

            public IEnumerable<string> GetRoleNamesByUserId(string userId)
            {
                return Query<string>(
                    sql: @"
                        SELECT r.[Name]
                        FROM AspNetUserRoles ur INNER JOIN
                            AspNetRoles r ON ur.RoleId = r.Id
                        WHERE ur.UserId = @userId
                    ",
                    param: new { userId }
                );
            }

            public IEnumerable<User> GetUsersByRoleName(string roleName)
            {
                return Query<User>(
                    sql: @"
                        SELECT u.*
                        FROM AspNetUserRoles ur INNER JOIN
	                        AspNetRoles r ON ur.RoleId = r.Id INNER JOIN
	                        AspNetUsers u ON ur.UserId = u.Id
                        WHERE r.NormalizedName = @roleName
                    ",
                    param: new { roleName });
            }

            public void Remove(string userId, string roleName)
            {
                Execute(
                    sql: @"
                        DELETE ur
                        FROM AspNetUserRoles ur INNER JOIN
                            AspNetRoles r ON ur.RoleId = r.Id
                        WHERE r.NormalizedName = @roleName
                    ",
                    param: new { userId, roleName }
                );
            }
        }
    }

#### UserTokenRepository.cs

    using AspNetCoreIdentityExample.Domain.Entities;
    using AspNetCoreIdentityExample.Domain.Repositories;
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Text;

    namespace AspNetCoreIdentityExample.Data.Repositories
    {
        internal class UserTokenRepository : RepositoryBase, IRepository<UserToken, UserTokenKey>
        {
            public UserTokenRepository(IDbTransaction transaction)
                : base(transaction)
            { }

            public void Add(UserToken entity)
            {
                Execute(
                    sql: @"
                        INSERT INTO AspNetUserTokens(UserId, LoginProvider, [Name], Value)
                        VALUES(@UserId, @LoginProvider, @Name, @Value)",
                    param: entity
                );
            }

            public IEnumerable<UserToken> All()
            {
                return Query<UserToken>(
                    sql: "SELECT * FROM AspNetUserTokens"
                );
            }

            public UserToken Find(UserTokenKey key)
            {
                return QuerySingleOrDefault<UserToken>(
                    sql: @"
                        SELECT * FROM AspNetUserTokens
                        WHERE UserId = @UserId AND LoginProvider = @LoginProvider
                            AND [Name] = @Name",
                    param: key
                );
            }

            public void Remove(UserTokenKey key)
            {
                Execute(
                    sql: @"
                        DELETE FROM AspNetUserTokens
                        WHERE UserId = @UserId AND LoginProvider = @LoginProvider
                            AND [Name] = @Name",
                    param: key
                );
            }

            public void Update(UserToken entity)
            {
                Execute(
                    sql: @"
                        UPDATE AspNetUserTokens SET Value = @Value
                        WHERE UserId = @UserId
                            AND LoginProvider = @LoginProvider
                            AND [Name] = @Name",
                    param: entity
                );
            }
        }
    }

### Unit of Work

The last piece of the Data Layer is the Unit of Work implementation. As I pointed out before, the Unit of Work pattern ensures that all changes are sent as a single transaction to the data store where they will either all succeed or all fail and get rolled back.

The Unit of Work implementation I've chosen to use for this tutorial comes from my popular [Dapper Unit of Work](https://github.com/timschreiber/DapperUnitOfWork) repository on GitHub.

#### DapperUnitOfWork.cs

    using AspNetCoreIdentityExample.Data.Repositories;
    using AspNetCoreIdentityExample.Domain;
    using AspNetCoreIdentityExample.Domain.Entities;
    using AspNetCoreIdentityExample.Domain.Repositories;
    using System;
    using System.Data;
    using System.Data.SqlClient;

    namespace AspNetCoreIdentityExample.Data
    {
        public class DapperUnitOfWork : IUnitOfWork
        {
            #region Fields
            private IDbConnection _connection;
            private IDbTransaction _transaction;
            private IRoleRepository _roleRepository;
            private IRoleClaimRepository _roleClaimRepository;
            private IUserRepository _userRepository;
            private IUserClaimRepository _userClaimRepository;
            private IUserLoginRepository _userLoginRepository;
            private IRepository<UserToken, UserTokenKey> _userTokenRepository;
            private IUserRoleRepository _userRoleRepository;
            private bool _disposed;
            #endregion

            public DapperUnitOfWork(string connectionString)
            {
                _connection = new SqlConnection(connectionString);
                _connection.Open();
                _transaction = _connection.BeginTransaction();
            }

            #region IUnitOfWork Members
            public IRoleRepository RoleRepository
            {
                get
                {
                    return _roleRepository
                        ?? (_roleRepository = new RoleRepository(_transaction));
                }
            }

            public IRoleClaimRepository RoleClaimRepository
            {
                get
                {
                    return _roleClaimRepository
                        ?? (_roleClaimRepository = new RoleClaimRepository(_transaction));
                }
            }

            public IUserRepository UserRepository
            {
                get
                {
                    return _userRepository
                        ?? (_userRepository = new UserRepository(_transaction));
                }
            }

            public IUserClaimRepository UserClaimRepository
            {
                get
                {
                    return _userClaimRepository
                        ?? (_userClaimRepository = new UserClaimRepository(_transaction));
                }
            }
        
            public IUserLoginRepository UserLoginRepository
            {
                get
                {
                    return _userLoginRepository
                        ?? (_userLoginRepository = new UserLoginRepository(_transaction));
                }
            }

            public IRepository<UserToken, UserTokenKey> UserTokenRepository
            {
                get
                {
                    return _userTokenRepository
                        ?? (_userTokenRepository = new UserTokenRepository(_transaction));
                }
            }

            public IUserRoleRepository UserRoleRepository
            {
                get
                {
                    return _userRoleRepository
                        ?? (_userRoleRepository = new UserRoleRepository(_transaction));
                }
            }

            public void Commit()
            {
                try
                {
                    _transaction.Commit();
                }
                catch
                {
                    _transaction.Rollback();
                }
                finally
                {
                    _transaction.Dispose();
                    resetRepositories();
                    _transaction = _connection.BeginTransaction();
                }
            }

            public void Dispose()
            {
                dispose(true);
                GC.SuppressFinalize(this);
            }
            #endregion

            #region Private Methods
            private void resetRepositories()
            {
                _roleRepository = null;
                _roleClaimRepository = null;
                _userRepository = null;
                _userClaimRepository = null;
                _userLoginRepository = null;
                _userTokenRepository = null;
                _userRoleRepository = null;
            }

            private void dispose(bool disposing)
            {
                if(!_disposed)
                {
                    if(disposing)
                    {
                        if(_transaction != null)
                        {
                            _transaction.Dispose();
                            _transaction = null;
                        }
                        if(_connection != null)
                        {
                            _connection.Dispose();
                            _connection = null;
                        }
                    }
                    _disposed = true;
                }
            }

            ~DapperUnitOfWork()
            {
                dispose(false);
            }
            #endregion
        }
    }

## Next Steps
    
And that's the Data Layer. We are *SO* close to having a working application again! All we have left to do in Part 3 is to revisit the Web Layer so we can finish coding the `CustomUserStore` and `CustomRoleStore` classes and do the last couple of steps to wire everything together.

Until next time, happy coding!
   
[1]: /2018/05/07/aspnet-core-identity-with-patterns/
[2]: https://github.com/timschreiber/ASP.NET-Core-Identity-Example
[3]: https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity?view=aspnetcore-2.1&tabs=visual-studio%2Caspnetcore2x
[4]: /2018/05/08/aspnet-core-identity-with-patterns-3/
[5]: /2015/01/14/persistence-ignorant-asp-net-identity-with-patterns-part-1/
