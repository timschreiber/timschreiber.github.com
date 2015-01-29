--- 
title: "Persistence-Ignorant ASP.NET Identity with Patterns (Part 3)"
canonical: "http://timschreiber.com/2015/01/26/persistence-ignorant-asp-net-identity-with-patterns-part-3/"
date: 2015-01-26
layout: post
comments: true
description: "In this part, we'll move on to the Data Layer, in which we'll code our implementation of the repository and Unit of Work interfaces. Let's jump right in. The Data Layer For now, we'll be using Entity Framework as the persistence mechanism in our Data Layer. Since..."
tags:
- asp-net
- mvc-5
- patterns
- architecture
---

* [Part 1][2]
* [Part 2][3]
* **Part 3**
* [Part 4][4]

**The source code for this series of posts is available at on my GitHub: [https://github.com/timschreiber/Mvc5IdentityExample][gh]**

######*This series of posts requires a functional understanding of ASP.NET Identity 2.x. If you haven't had at least some kind of exposure, this is a good place to start: [http://www.asp.net/identity][1].*######

In [Part 1][2], I identified some of the shortcomings in the default template for ASP.NET MVC 5 web applications using ASP.NET Identity for &quot;Individual User Accounts&quot; authentication, and then laid out the requirements for a better implementation. In [Part 2][3], we created the Visual Studio Solution for our ASP.NET Identity Example, broke the out-of-the-box dependencies on Entity Framework, and coded our Domain Layer. In this part, we'll move on to the Data Layer, in which we'll code our implementation of the repository and Unit of Work interfaces.

Let's jump right in.

###The Data Layer###

For now, we'll be using Entity Framework as the persistence mechanism in our Data Layer. Since we're designing this with persistence-ignorant in mind, however, we could just as easily use NHibernate or plain SQL with little or no modification to our Domain and other layers. The first thing we need to do is add another class library to the solution. I called mine `Mvc5IdentityExample.Data.EntityFramework`. One the project has been created, let's add two folders: `Configuration` and `Repositories`.

Next we'll need to add a reference to the latest EntityFramework package. To do this, launch the Package Manager Console and run the following command:

    Install-Package EntityFramework

####Entity Framework####

#####**Entity Configuration**#####

The first pieces of code this we're going to write in this layer are the mapping classes that tell Entity Framework which entities map to which database tables, which properties map to which columns, and how all the relationships work. A lot of people like to rely on configuration by convention, which is fine, but I prefer to see more of the mappings in my code &ndash; call it a sort of self-documentation, if you will. Since these configurations don't need to be visible outside the Data Layer, we can make them `internal`.

We have four entities, so we'll need four configuration classes:

######ClaimConfiguration.cs######

    using Mvc5IdentityExample.Domain.Entities;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.ModelConfiguration;

    namespace Mvc5IdentityExample.Data.EntityFramework.Configuration
    {
        internal class ClaimConfiguration : EntityTypeConfiguration<Claim>
        {
            internal ClaimConfiguration()
            {
                ToTable("Claim");

                HasKey(x => x.ClaimId)
                    .Property(x => x.ClaimId)
                    .HasColumnName("ClaimId")
                    .HasColumnType("int")
                    .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity)
                    .IsRequired();

                Property(x => x.UserId)
                    .HasColumnName("UserId")
                    .HasColumnType("uniqueidentifier")
                    .IsRequired();

                Property(x => x.ClaimType)
                    .HasColumnName("ClaimType")
                    .HasColumnType("nvarchar")
                    .IsMaxLength()
                    .IsOptional();

                Property(x => x.ClaimValue)
                    .HasColumnName("ClaimValue")
                    .HasColumnType("nvarchar")
                    .IsMaxLength()
                    .IsOptional();

                HasRequired(x => x.User)
                    .WithMany(x => x.Claims)
                    .HasForeignKey(x => x.UserId);
            }
        }
    }
    
######ExternalLoginConfiguration.cs######

    using Mvc5IdentityExample.Domain.Entities;
    using System.Data.Entity.ModelConfiguration;

    namespace Mvc5IdentityExample.Data.EntityFramework.Configuration
    {
        internal class ExternalLoginConfiguration : EntityTypeConfiguration<ExternalLogin>
        {
            internal ExternalLoginConfiguration()
            {
                ToTable("ExternalLogin");

                HasKey(x => new { x.LoginProvider, x.ProviderKey, x.UserId });

                Property(x => x.LoginProvider)
                    .HasColumnName("LoginProvider")
                    .HasColumnType("nvarchar")
                    .HasMaxLength(128)
                    .IsRequired();

                Property(x => x.ProviderKey)
                    .HasColumnName("ProviderKey")
                    .HasColumnType("nvarchar")
                    .HasMaxLength(128)
                    .IsRequired();

                Property(x => x.UserId)
                    .HasColumnName("UserId")
                    .HasColumnType("uniqueidentifier")
                    .IsRequired();

                HasRequired(x => x.User)
                    .WithMany(x => x.Logins)
                    .HasForeignKey(x => x.UserId);
            }
        }
    }

######RoleConfiguration.cs######

    using Mvc5IdentityExample.Domain.Entities;
    using System.Data.Entity.ModelConfiguration;

    namespace Mvc5IdentityExample.Data.EntityFramework.Configuration
    {
        internal class RoleConfiguration : EntityTypeConfiguration<Role>
        {
            internal RoleConfiguration()
            {
                ToTable("Role");

                HasKey(x => x.RoleId)
                    .Property(x => x.RoleId)
                    .HasColumnName("RoleId")
                    .HasColumnType("uniqueidentifier")
                    .IsRequired();

                Property(x => x.Name)
                    .HasColumnName("Name")
                    .HasColumnType("nvarchar")
                    .HasMaxLength(256)
                    .IsRequired();

                HasMany(x => x.Users)
                    .WithMany(x => x.Roles)
                    .Map(x =>
                    {
                        x.ToTable("UserRole");
                        x.MapLeftKey("RoleId");
                        x.MapRightKey("UserId");
                    });
            }
        }
    }
    
######UserConfiguration.cs######

    using Mvc5IdentityExample.Domain.Entities;
    using System.Data.Entity.ModelConfiguration;

    namespace Mvc5IdentityExample.Data.EntityFramework.Configuration
    {
        internal class UserConfiguration : EntityTypeConfiguration<User>
        {
            internal UserConfiguration()
            {
                ToTable("User");

                HasKey(x => x.UserId)
                    .Property(x => x.UserId)
                    .HasColumnName("UserId")
                    .HasColumnType("uniqueidentifier")
                    .IsRequired();

                Property(x => x.PasswordHash)
                    .HasColumnName("PasswordHash")
                    .HasColumnType("nvarchar")
                    .IsMaxLength()
                    .IsOptional();

                Property(x => x.SecurityStamp)
                    .HasColumnName("SecurityStamp")
                    .HasColumnType("nvarchar")
                    .IsMaxLength()
                    .IsOptional();

                Property(x => x.UserName)
                    .HasColumnName("UserName")
                    .HasColumnType("nvarchar")
                    .HasMaxLength(256)
                    .IsRequired();

                HasMany(x => x.Roles)
                    .WithMany(x => x.Users)
                    .Map(x =>
                    {
                        x.ToTable("UserRole");
                        x.MapLeftKey("UserId");
                        x.MapRightKey("RoleId");
                    });

                HasMany(x => x.Claims)
                    .WithRequired(x => x.User)
                    .HasForeignKey(x => x.UserId);

                HasMany(x => x.Logins)
                    .WithRequired(x => x.User)
                    .HasForeignKey(x => x.UserId);
            }
        }
    }

#####**DbContext**#####

The next piece in our Entity Framework Data Layer is the DbContext. Nothing out of the ordinary here:

######ApplicationDbContext.cs######

    using Mvc5IdentityExample.Data.EntityFramework.Configuration;
    using Mvc5IdentityExample.Domain.Entities;
    using System.Data.Entity;

    namespace Mvc5IdentityExample.Data.EntityFramework
    {
        internal class ApplicationDbContext : DbContext
        {
            internal ApplicationDbContext(string nameOrConnectionString)
                : base(nameOrConnectionString)
            {
            }

            internal IDbSet<User> Users { get; set; }
            internal IDbSet<Role> Roles { get; set; }
            internal IDbSet<ExternalLogin> Logins { get; set; }

            protected override void OnModelCreating(DbModelBuilder modelBuilder)
            {
                modelBuilder.Configurations.Add(new UserConfiguration());
                modelBuilder.Configurations.Add(new RoleConfiguration());
                modelBuilder.Configurations.Add(new ExternalLoginConfiguration());
                modelBuilder.Configurations.Add(new ClaimConfiguration());
            }
        }
    }
    
####Repositories####

With our Entity Framework entity configurations and DbContext out of the way, we move on to implementing the repository interfaces we defined in the Data Layer. As we dive into the code, I want you to notice a couple things about the classes:
 
1. You'll notice there's no default constructor. That's because we're following the Dependency Injection pattern by providing the repository with the `ApplicationDbContext` it needs in the constructor. This ensures that all our repositories will use the same DbContext per transaction scope.

2. You'll notice the constructor is marked with the `internal` access modifier. That's because the only class that should ever instantiate a repository will be our Unit of Work class. No need to potentially couple Entity Framework to other layers by putting our `ApplicationDbContext` dependency in a public constructor. 
    
You'll recall from [Part 2][3] that we're following the generic repository pattern. So, we'll code the generic repository implementation first, and then move on to the entity-specific repositories. So let's start by creating the following class in the `Repositories` folder:

######Repository.cs######

    using Mvc5IdentityExample.Domain.Repositories;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;

    namespace Mvc5IdentityExample.Data.EntityFramework.Repositories
    {
        internal class Repository<TEntity> : IRepository<TEntity> where TEntity : class
        {
            private ApplicationDbContext _context;
            private DbSet<TEntity> _set;

            internal Repository(ApplicationDbContext context)
            {
                _context = context;
            }

            protected DbSet<TEntity> Set
            {
                get { return _set ?? (_set = _context.Set<TEntity>()); }
            }

            public List<TEntity> GetAll()
            {
                return Set.ToList();
            }

            public Task<List<TEntity>> GetAllAsync()
            {
                return Set.ToListAsync();
            }

            public Task<List<TEntity>> GetAllAsync(CancellationToken cancellationToken)
            {
                return Set.ToListAsync(cancellationToken);
            }

            public List<TEntity> PageAll(int skip, int take)
            {
                return Set.Skip(skip).Take(take).ToList();
            }

            public Task<List<TEntity>> PageAllAsync(int skip, int take)
            {
                return Set.Skip(skip).Take(take).ToListAsync();
            }

            public Task<List<TEntity>> PageAllAsync(CancellationToken cancellationToken, int skip, int take)
            {
                return Set.Skip(skip).Take(take).ToListAsync(cancellationToken);
            }

            public TEntity FindById(object id)
            {
                return Set.Find(id);
            }

            public Task<TEntity> FindByIdAsync(object id)
            {
                return Set.FindAsync(id);
            }

            public Task<TEntity> FindByIdAsync(CancellationToken cancellationToken, object id)
            {
                return Set.FindAsync(cancellationToken, id);
            }

            public void Add(TEntity entity)
            {
                Set.Add(entity);
            }

            public void Update(TEntity entity)
            {
                var entry = _context.Entry(entity);
                if (entry.State == EntityState.Detached)
                {
                    Set.Attach(entity);
                    entry = _context.Entry(entity);
                }
                entry.State = EntityState.Modified;
            }

            public void Remove(TEntity entity)
            {
                Set.Remove(entity);
            }
        }
    }

The entity-specific repository classes extend the generic repository class and implement the entity-specific repository interfaces from the Domain Layer. Let's add the following three classes to the `Repositories` folder:

######ExternalLoginRepository.cs######

    using Mvc5IdentityExample.Domain.Entities;
    using Mvc5IdentityExample.Domain.Repositories;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;

    namespace Mvc5IdentityExample.Data.EntityFramework.Repositories
    {
        internal class ExternalLoginRepository : Repository<ExternalLogin>, IExternalLoginRepository
        {
            internal ExternalLoginRepository(ApplicationDbContext context)
                : base(context)
            {
            }

            public ExternalLogin GetByProviderAndKey(string loginProvider, string providerKey)
            {
                return Set.FirstOrDefault(x => x.LoginProvider == loginProvider && x.ProviderKey == providerKey);
            }

            public Task<ExternalLogin> GetByProviderAndKeyAsync(string loginProvider, string providerKey)
            {
                return Set.FirstOrDefaultAsync(x => x.LoginProvider == loginProvider && x.ProviderKey == providerKey);
            }

            public Task<ExternalLogin> GetByProviderAndKeyAsync(CancellationToken cancellationToken, string loginProvider, string providerKey)
            {
                return Set.FirstOrDefaultAsync(x => x.LoginProvider == loginProvider && x.ProviderKey == providerKey, cancellationToken);
            }
        }
    }

######RoleRepository.cs######

    using Mvc5IdentityExample.Domain.Entities;
    using Mvc5IdentityExample.Domain.Repositories;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;

    namespace Mvc5IdentityExample.Data.EntityFramework.Repositories
    {
        internal class RoleRepository : Repository<Role>, IRoleRepository
        {
            internal RoleRepository(ApplicationDbContext context)
                : base(context)
            {
            }

            public Role FindByName(string roleName)
            {
                return Set.FirstOrDefault(x => x.Name == roleName);
            }

            public Task<Role> FindByNameAsync(string roleName)
            {
                return Set.FirstOrDefaultAsync(x => x.Name == roleName);
            }

            public Task<Role> FindByNameAsync(System.Threading.CancellationToken cancellationToken, string roleName)
            {
                return Set.FirstOrDefaultAsync(x => x.Name == roleName, cancellationToken);
            }
        }
    }

######UserRepository.cs######

    using Mvc5IdentityExample.Domain.Entities;
    using Mvc5IdentityExample.Domain.Repositories;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;

    namespace Mvc5IdentityExample.Data.EntityFramework.Repositories
    {
        internal class UserRepository : Repository<User>, IUserRepository
        {
            internal UserRepository(ApplicationDbContext context)
                : base(context)
            {
            }

            public User FindByUserName(string username)
            {
                return Set.FirstOrDefault(x => x.UserName == username);
            }

            public Task<User> FindByUserNameAsync(string username)
            {
                return Set.FirstOrDefaultAsync(x => x.UserName == username);
            }

            public Task<User> FindByUserNameAsync(System.Threading.CancellationToken cancellationToken, string username)
            {
                return Set.FirstOrDefaultAsync(x => x.UserName == username, cancellationToken);
            }
        }
    }    

####Unit of Work####

The last piece of our Data Layer is the Unit of Work implementation. As I pointed out in [Part 2][3], the Unit of Work pattern does two important things:

1. Maintains an in-memory collection of changes, and
2. Sends the changes as a single transaction to the data store.

Because we're using Entity Framework, we can leverage the DbContext to manage the in-memory collection of changes. But since all of our changes are made through the repositories, we need to make sure all the repositories are using the same DbContext. That's why the Unit of Work interface in the the Domain Layer defines getters for the repositories, as well as methods to commit any changes as a single transaction.

The Unit of Work class is really the only publicly available class in the Data Layer, because it's where all the Data Layer rubber meets the road:

######UnitOfWork.cs######

    using Mvc5IdentityExample.Data.EntityFramework.Repositories;
    using Mvc5IdentityExample.Domain;
    using Mvc5IdentityExample.Domain.Repositories;
    using System.Threading.Tasks;

    namespace Mvc5IdentityExample.Data.EntityFramework
    {
        public class UnitOfWork : IUnitOfWork
        {
            #region Fields
            private readonly ApplicationDbContext _context;
            private IExternalLoginRepository _externalLoginRepository;
            private IRoleRepository _roleRepository;
            private IUserRepository _userRepository;
            #endregion

            #region Constructors
            public UnitOfWork(string nameOrConnectionString)
            {
                _context = new ApplicationDbContext(nameOrConnectionString);
            }
            #endregion

            #region IUnitOfWork Members
            public IExternalLoginRepository ExternalLoginRepository
            {
                get { return _externalLoginRepository ?? (_externalLoginRepository = new ExternalLoginRepository(_context)); }
            }

            public IRoleRepository RoleRepository
            {
                get { return _roleRepository ?? (_roleRepository = new RoleRepository(_context)); }
            }

            public IUserRepository UserRepository
            {
                get { return _userRepository ?? (_userRepository = new UserRepository(_context)); }
            }

            public int SaveChanges()
            {
                return _context.SaveChanges();
            }

            public Task<int> SaveChangesAsync()
            {
                return _context.SaveChangesAsync();
            }

            public Task<int> SaveChangesAsync(System.Threading.CancellationToken cancellationToken)
            {
                return _context.SaveChangesAsync(cancellationToken);
            }
            #endregion

            #region IDisposable Members
            public void Dispose()
            {
                _externalLoginRepository = null;
                _roleRepository = null;
                _userRepository = null;
                _context.Dispose();
            }
            #endregion
        }
    }

####The Database####

I guess I could spend the time to write the code to generate the database from Entity Framework, but that is not the focus of this tutorial. So in order to help things along, I've included a SQL script that will create the database, complete with all the tables, the login, the user, and permissions necessary to run the application.

######CreateDatabase.sql######

    USE [master]
    GO

    SET NOCOUNT ON
    GO

    IF EXISTS (SELECT 1 FROM sys.databases WHERE [Name] = 'Mvc5IdentityExample')
    BEGIN
        ALTER DATABASE Mvc5IdentityExample SET SINGLE_USER
        DROP DATABASE Mvc5IdentityExample
    END

    CREATE DATABASE Mvc5IdentityExample
    GO

    IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE [name] = 'Mvc5IdentityExampleUser')
    BEGIN
        CREATE LOGIN [Mvc5IdentityExampleUser] WITH PASSWORD = N'Password123', DEFAULT_DATABASE = [Mvc5IdentityExample],
            DEFAULT_LANGUAGE=[us_english], CHECK_EXPIRATION = OFF, CHECK_POLICY = OFF
        
        ALTER LOGIN [Mvc5IdentityExampleUser] ENABLE
    END
    GO

    USE [Mvc5IdentityExample]
    GO

    CREATE USER [Mvc5IdentityExampleUser] FOR LOGIN [Mvc5IdentityExampleUser]
    GO

    EXEC sp_addrolemember N'db_datareader', N'Mvc5IdentityExampleUser'
    EXEC sp_addrolemember N'db_datawriter', N'Mvc5IdentityExampleUser'
    GO

    /****** Object:  Table [dbo].[Claim]    Script Date: 1/12/2015 11:14:30 PM ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
    CREATE TABLE [dbo].[Claim](
        [ClaimId] [int] IDENTITY(1,1) NOT NULL,
        [UserId] [uniqueidentifier] NOT NULL,
        [ClaimType] [nvarchar](max) NULL,
        [ClaimValue] [nvarchar](max) NULL,
     CONSTRAINT [PK_dbo.AspNetUserClaims] PRIMARY KEY CLUSTERED 
    (
        [ClaimId] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

    GO
    /****** Object:  Table [dbo].[ExternalLogin]    Script Date: 1/12/2015 11:14:30 PM ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
    CREATE TABLE [dbo].[ExternalLogin](
        [LoginProvider] [nvarchar](128) NOT NULL,
        [ProviderKey] [nvarchar](128) NOT NULL,
        [UserId] [uniqueidentifier] NOT NULL,
     CONSTRAINT [PK_dbo.AspNetUserLogins] PRIMARY KEY CLUSTERED 
    (
        [LoginProvider] ASC,
        [ProviderKey] ASC,
        [UserId] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]

    GO
    /****** Object:  Table [dbo].[Role]    Script Date: 1/12/2015 11:14:30 PM ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
    CREATE TABLE [dbo].[Role](
        [RoleId] [nvarchar](128) NOT NULL,
        [Name] [nvarchar](256) NOT NULL,
     CONSTRAINT [PK_dbo.AspNetRoles] PRIMARY KEY CLUSTERED 
    (
        [RoleId] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]

    GO
    /****** Object:  Table [dbo].[User]    Script Date: 1/12/2015 11:14:30 PM ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
    CREATE TABLE [dbo].[User](
        [UserId] [uniqueidentifier] NOT NULL,
        [Email] [nvarchar](256) NULL,
        [EmailConfirmed] [bit] NOT NULL,
        [PasswordHash] [nvarchar](max) NULL,
        [SecurityStamp] [nvarchar](max) NULL,
        [PhoneNumber] [nvarchar](max) NULL,
        [PhoneNumberConfirmed] [bit] NOT NULL,
        [TwoFactorEnabled] [bit] NOT NULL,
        [LockoutEndDateUtc] [datetime] NULL,
        [LockoutEnabled] [bit] NOT NULL,
        [AccessFailedCount] [int] NOT NULL,
        [UserName] [nvarchar](256) NOT NULL,
     CONSTRAINT [PK_dbo.AspNetUsers] PRIMARY KEY CLUSTERED 
    (
        [UserId] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

    GO
    /****** Object:  Table [dbo].[UserRole]    Script Date: 1/12/2015 11:14:30 PM ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
    CREATE TABLE [dbo].[UserRole](
        [UserId] [uniqueidentifier] NOT NULL,
        [RoleId] [nvarchar](128) NOT NULL,
     CONSTRAINT [PK_dbo.AspNetUserRoles] PRIMARY KEY CLUSTERED 
    (
        [UserId] ASC,
        [RoleId] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]

    GO
    ALTER TABLE [dbo].[Claim]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
    REFERENCES [dbo].[User] ([UserId])
    ON DELETE CASCADE
    GO
    ALTER TABLE [dbo].[Claim] CHECK CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId]
    GO
    ALTER TABLE [dbo].[ExternalLogin]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
    REFERENCES [dbo].[User] ([UserId])
    ON DELETE CASCADE
    GO
    ALTER TABLE [dbo].[ExternalLogin] CHECK CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId]
    GO
    ALTER TABLE [dbo].[UserRole]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId] FOREIGN KEY([RoleId])
    REFERENCES [dbo].[Role] ([RoleId])
    ON DELETE CASCADE
    GO
    ALTER TABLE [dbo].[UserRole] CHECK CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId]
    GO
    ALTER TABLE [dbo].[UserRole]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
    REFERENCES [dbo].[User] ([UserId])
    ON DELETE CASCADE
    GO
    ALTER TABLE [dbo].[UserRole] CHECK CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId]
    GO

###Next Steps###

We are so close to having a working application that uses design patterns and better practices for ASP.NET Identity! In this part, we created our Data Layer using Entity Framework. We defined our entity mappings, coded the DbContext, and implemented the interfaces for the repositories and Unit of Work that we defined in the Domain Layer. In Part 4, we'll move on to the Presentation Layer, where we'll focus on getting our Domain and Data Layers to work with ASP.NET Identity with custom IdentityUser, IdentityRole, UserStore, and RoleStore classes.

Until then, happy coding!
    

[1]: http://www.asp.net/identity
[2]: /2015/01/14/persistence-ignorant-asp-net-identity-with-patterns-part-1/
[3]: /2015/01/25/persistence-ignorant-asp-net-identity-with-patterns-part-2/
[4]: /2015/01/28/persistence-ignorant-asp-net-identity-with-patterns-part-4/
[gh]: https://github.com/timschreiber/Mvc5IdentityExample