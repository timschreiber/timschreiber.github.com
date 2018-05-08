--- 
title: "ASP.NET Core Identity with Patterns (Part 3 of 3)"
canonical: "http://timschreiber.com/2018/05/08/aspnet-core-identity-with-patterns-3/"
date: "2018-05-08 16:04 PM"
layout: post3
comments: true
description: "In this final step, we revisit the Web Layer so we can finish coding the `CustomUserStore` and `CustomRoleStore` classes and do the last couple of steps to wire everything together. For the end result, we should have a fully functional application again."
image: "asp-net-core-identity-with-patterns.jpg"
featured: 2
tags:
- dotnet-core
- asp-net-core
- asp-net-core-identity
- patterns
- architecture
---

 * [Part 1][1]
 * [Part 2][2]
 * **Part 3**
 
**The source code for this series of posts is available at on my GitHub: [https://github.com/timschreiber/ASP.NET-Core-Identity-Example][3]**

*NOTES:*
 * *This series of posts requires a functional understanding of ASP.NET Core Identity If you haven't had at least some kind of exposure, this you should probably start [here][4].*
 * *If you haven't read [my previous posts][5], I'd suggest you stop here and read at least the first one to understand the problems I had with ASP.NET Identity 2.0 and how I solved them.*

In Part 1, we started building our `AspNetCoreIdentityExample` solution, beginning with the `AspNetCoreIdentityExample.Web project`. First we got it running with the out-of-the-box Entity Framework implementation, then we broke it in preparation for our custom, persistence-ignorant version. In Part 2, we added the Domain and Data Layers, and now in this step, we're going back to the Web project to build out the `CustomUserStore` and `CustomRoleStore` classes and to wire everything up into a working application.

## Back to the Web Project

Now that we have our Domain and Data layers in place, we can build out the two stores required by ASP.NET Core Identity. Of these two, the `CustomUserStore` class can get really big, depending on the required features. Lucky for you, I already did all the hard work:

### The Stores

#### CustomRoleStore.cs

    using AspNetCoreIdentityExample.Domain;
    using AspNetCoreIdentityExample.Domain.Entities;
    using Microsoft.AspNetCore.Identity;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Security.Claims;
    using System.Threading;
    using System.Threading.Tasks;

    namespace AspNetCoreIdentityExample.Web.Identity
    {
        public class CustomRoleStore :
            IRoleStore<IdentityRole>,
            IRoleClaimStore<IdentityRole>
        {
            private readonly IUnitOfWork _unitOfWork;

            public CustomRoleStore(IUnitOfWork unitOfWork)
            {
                _unitOfWork = unitOfWork;
            }

            #region IRoleStore<IdentityRole> Members
            public Task<IdentityResult> CreateAsync(IdentityRole role, CancellationToken cancellationToken)
            {
                try
                {
                    if (cancellationToken != null)
                        cancellationToken.ThrowIfCancellationRequested();

                    if (role == null)
                        throw new ArgumentNullException(nameof(role));

                    var roleEntity = getRoleEntity(role);

                    _unitOfWork.RoleRepository.Add(roleEntity);
                    _unitOfWork.Commit();

                    return Task.FromResult(IdentityResult.Success);
                }
                catch(Exception ex)
                {
                    return Task.FromResult(IdentityResult.Failed(new IdentityError { Code = ex.Message, Description = ex.Message }));
                }
            }

            public Task<IdentityResult> DeleteAsync(IdentityRole role, CancellationToken cancellationToken)
            {
                try
                {
                    if (cancellationToken != null)
                        cancellationToken.ThrowIfCancellationRequested();

                    if (role == null)
                        throw new ArgumentNullException(nameof(role));

                    _unitOfWork.RoleRepository.Remove(role.Id);
                    _unitOfWork.Commit();

                    return Task.FromResult(IdentityResult.Success);
                }
                catch (Exception ex)
                {
                    return Task.FromResult(IdentityResult.Failed(new IdentityError { Code = ex.Message, Description = ex.Message }));
                }
            }

            public Task<IdentityRole> FindByIdAsync(string roleId, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (string.IsNullOrWhiteSpace(roleId))
                    throw new ArgumentNullException(nameof(roleId));

                if(!Guid.TryParse(roleId, out Guid id))
                    throw new ArgumentOutOfRangeException(nameof(roleId), $"{nameof(roleId)} is not a valid GUID");

                var roleEntity = _unitOfWork.RoleRepository.Find(id.ToString());
                return Task.FromResult(getIdentityRole(roleEntity));
            }

            public Task<IdentityRole> FindByNameAsync(string normalizedRoleName, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (string.IsNullOrWhiteSpace(normalizedRoleName))
                    throw new ArgumentNullException(nameof(normalizedRoleName));

                var roleEntity = _unitOfWork.RoleRepository.FindByName(normalizedRoleName);
                return Task.FromResult(getIdentityRole(roleEntity));
            }

            public Task<string> GetNormalizedRoleNameAsync(IdentityRole role, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (role == null)
                    throw new ArgumentNullException(nameof(role));

                return Task.FromResult(role.NormalizedName);
            }

            public Task<string> GetRoleIdAsync(IdentityRole role, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (role == null)
                    throw new ArgumentNullException(nameof(role));

                return Task.FromResult(role.Id);
            }

            public Task<string> GetRoleNameAsync(IdentityRole role, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (role == null)
                    throw new ArgumentNullException(nameof(role));

                return Task.FromResult(role.Name);
            }

            public Task SetNormalizedRoleNameAsync(IdentityRole role, string normalizedName, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (role == null)
                    throw new ArgumentNullException(nameof(role));

                role.NormalizedName = normalizedName;

                return Task.CompletedTask;
            }

            public Task SetRoleNameAsync(IdentityRole role, string roleName, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (role == null)
                    throw new ArgumentNullException(nameof(role));

                role.Name = roleName;

                return Task.CompletedTask;
            }

            public Task<IdentityResult> UpdateAsync(IdentityRole role, CancellationToken cancellationToken)
            {
                try
                {
                    if (cancellationToken != null)
                        cancellationToken.ThrowIfCancellationRequested();

                    if (role == null)
                        throw new ArgumentNullException(nameof(role));

                    var roleEntity = getRoleEntity(role);

                    _unitOfWork.RoleRepository.Update(roleEntity);
                    _unitOfWork.Commit();

                    return Task.FromResult(IdentityResult.Success);
                }
                catch (Exception ex)
                {
                    return Task.FromResult(IdentityResult.Failed(new IdentityError { Code = ex.Message, Description = ex.Message }));
                }
            }

            public void Dispose()
            {
                // Lifetimes of dependencies are managed by the IoC container, so disposal here is unnecessary.
            }
            #endregion

            #region IRoleClaimStore<IdentityRole> Members
            public Task<IList<Claim>> GetClaimsAsync(IdentityRole role, CancellationToken cancellationToken = default(CancellationToken))
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (role == null)
                    throw new ArgumentNullException(nameof(role));

                IList<Claim> result = _unitOfWork.RoleClaimRepository.FindByRoleId(role.Id).Select(x => new Claim(x.ClaimType, x.ClaimValue)).ToList();

                return Task.FromResult(result);
            }

            public Task AddClaimAsync(IdentityRole role, Claim claim, CancellationToken cancellationToken = default(CancellationToken))
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (role == null)
                    throw new ArgumentNullException(nameof(role));

                if (claim == null)
                    throw new ArgumentNullException(nameof(claim));

                var roleClaimEntity = new RoleClaim
                {
                    ClaimType = claim.Type,
                    ClaimValue = claim.Value,
                    RoleId = role.Id
                };

                _unitOfWork.RoleClaimRepository.Add(roleClaimEntity);
                _unitOfWork.Commit();

                return Task.CompletedTask;
            }

            public Task RemoveClaimAsync(IdentityRole role, Claim claim, CancellationToken cancellationToken = default(CancellationToken))
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (role == null)
                    throw new ArgumentNullException(nameof(role));

                if (claim == null)
                    throw new ArgumentNullException(nameof(claim));

                var roleClaimEntity = _unitOfWork.RoleClaimRepository.FindByRoleId(role.Id)
                    .SingleOrDefault(x => x.ClaimType == claim.Type && x.ClaimValue == claim.Value);

                if(roleClaimEntity != null)
                {
                    _unitOfWork.RoleClaimRepository.Remove(roleClaimEntity.Id);
                    _unitOfWork.Commit();
                }

                return Task.CompletedTask;
            }
            #endregion

            #region Private Methods
            private Role getRoleEntity(IdentityRole value)
            {
                return value == null
                    ? default(Role)
                    : new Role
                    {
                        ConcurrencyStamp = value.ConcurrencyStamp,
                        Id = value.Id,
                        Name = value.Name,
                        NormalizedName = value.NormalizedName
                    };
            }

            private IdentityRole getIdentityRole(Role value)
            {
                return value == null
                    ? default(IdentityRole)
                    : new IdentityRole
                    {
                        ConcurrencyStamp = value.ConcurrencyStamp,
                        Id = value.Id,
                        Name = value.Name,
                        NormalizedName = value.NormalizedName
                    };
            }
            #endregion
        }
    }
 
#### CustomUserStore.cs

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
            private readonly IUnitOfWork _unitOfWork;

            public CustomUserStore(IUnitOfWork unitOfWork)
            {
                _unitOfWork = unitOfWork;
            }

            #region IQueryableUserStore<ApplicationUser> Members
            public IQueryable<ApplicationUser> Users
            {
                get
                {
                    return _unitOfWork.UserRepository.All()
                        .Select(x => getApplicationUser(x))
                        .AsQueryable();
                }
            }
            #endregion

            #region IUserStore<ApplicationUser> Members
            public Task<IdentityResult> CreateAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                try
                {
                    if (cancellationToken != null)
                        cancellationToken.ThrowIfCancellationRequested();

                    if (user == null)
                        throw new ArgumentNullException(nameof(user));

                    var userEntity = getUserEntity(user);

                    _unitOfWork.UserRepository.Add(userEntity);
                    _unitOfWork.Commit();

                    return Task.FromResult(IdentityResult.Success);
                }
                catch (Exception ex)
                {
                    return Task.FromResult(IdentityResult.Failed(new IdentityError { Code = ex.Message, Description = ex.Message }));
                }
            }

            public Task<IdentityResult> DeleteAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                try
                {
                    if (cancellationToken != null)
                        cancellationToken.ThrowIfCancellationRequested();

                    if (user == null)
                        throw new ArgumentNullException(nameof(user));

                    _unitOfWork.UserRepository.Remove(user.Id);
                    _unitOfWork.Commit();

                    return Task.FromResult(IdentityResult.Success);
                }
                catch (Exception ex)
                {
                    return Task.FromResult(IdentityResult.Failed(new IdentityError { Code = ex.Message, Description = ex.Message }));
                }
            }

            public Task<ApplicationUser> FindByIdAsync(string userId, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (string.IsNullOrWhiteSpace(userId))
                    throw new ArgumentNullException(nameof(userId));

                if (!Guid.TryParse(userId, out Guid id))
                    throw new ArgumentOutOfRangeException(nameof(userId), $"{nameof(userId)} is not a valid GUID");

                var userEntity = _unitOfWork.UserRepository.Find(id.ToString());

                return Task.FromResult(getApplicationUser(userEntity));
            }

            public Task<ApplicationUser> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                var userEntity = _unitOfWork.UserRepository.FindByNormalizedUserName(normalizedUserName);

                return Task.FromResult(getApplicationUser(userEntity));
            }

            public Task<string> GetNormalizedUserNameAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                return Task.FromResult(user.NormalizedUserName);
            }

            public Task<string> GetUserIdAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                return Task.FromResult(user.Id);
            }

            public Task<string> GetUserNameAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                return Task.FromResult(user.UserName);
            }

            public Task SetNormalizedUserNameAsync(ApplicationUser user, string normalizedName, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                user.NormalizedUserName = normalizedName;

                return Task.CompletedTask;
            }

            public Task SetUserNameAsync(ApplicationUser user, string userName, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                user.UserName = userName;

                return Task.CompletedTask;
            }

            public Task<IdentityResult> UpdateAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                try
                {
                    if (cancellationToken != null)
                        cancellationToken.ThrowIfCancellationRequested();

                    if (user == null)
                        throw new ArgumentNullException(nameof(user));

                    var userEntity = getUserEntity(user);

                    _unitOfWork.UserRepository.Update(userEntity);
                    _unitOfWork.Commit();

                    return Task.FromResult(IdentityResult.Success);
                }
                catch (Exception ex)
                {
                    return Task.FromResult(IdentityResult.Failed(new IdentityError { Code = ex.Message, Description = ex.Message }));
                }
            }

            public void Dispose()
            {
                // Lifetimes of dependencies are managed by the IoC container, so disposal here is unnecessary.
            }
            #endregion

            #region IUserPasswordStore<ApplicationUser> Members
            public Task SetPasswordHashAsync(ApplicationUser user, string passwordHash, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                user.PasswordHash = passwordHash;

                return Task.CompletedTask;
            }

            public Task<string> GetPasswordHashAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                return Task.FromResult(user.PasswordHash);
            }

            public Task<bool> HasPasswordAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                return Task.FromResult(!string.IsNullOrWhiteSpace(user.PasswordHash));
            }
            #endregion

            #region IUserEmailStore<ApplicationUser> Members
            public Task SetEmailAsync(ApplicationUser user, string email, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                user.Email = email;

                return Task.CompletedTask;
            }

            public Task<string> GetEmailAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                return Task.FromResult(user.Email);
            }

            public Task<bool> GetEmailConfirmedAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                return Task.FromResult(user.EmailConfirmed);
            }

            public Task SetEmailConfirmedAsync(ApplicationUser user, bool confirmed, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                user.EmailConfirmed = confirmed;

                return Task.CompletedTask;
            }

            public Task<ApplicationUser> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
            {
                if (string.IsNullOrWhiteSpace(normalizedEmail))
                    throw new ArgumentNullException(nameof(normalizedEmail));

                var userEntity = _unitOfWork.UserRepository.FindByNormalizedEmail(normalizedEmail);

                return Task.FromResult(getApplicationUser(userEntity));
            }

            public Task<string> GetNormalizedEmailAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                return Task.FromResult(user.NormalizedEmail);
            }

            public Task SetNormalizedEmailAsync(ApplicationUser user, string normalizedEmail, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                user.NormalizedEmail = normalizedEmail;

                return Task.CompletedTask;
            }
            #endregion

            #region IUserLoginStore<ApplicationUser> Members
            public Task AddLoginAsync(ApplicationUser user, UserLoginInfo login, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                if (login == null)
                    throw new ArgumentNullException(nameof(login));

                if (string.IsNullOrWhiteSpace(login.LoginProvider))
                    throw new ArgumentNullException(nameof(login.LoginProvider));

                if (string.IsNullOrWhiteSpace(login.ProviderKey))
                    throw new ArgumentNullException(nameof(login.ProviderKey));

                var loginEntity = new UserLogin
                {
                    LoginProvider = login.LoginProvider,
                    ProviderDisplayName = login.ProviderDisplayName,
                    ProviderKey = login.ProviderKey,
                    UserId = user.Id
                };

                _unitOfWork.UserLoginRepository.Add(loginEntity);
                _unitOfWork.Commit();

                return Task.CompletedTask;
            }

            public Task RemoveLoginAsync(ApplicationUser user, string loginProvider, string providerKey, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                if (string.IsNullOrWhiteSpace(loginProvider))
                    throw new ArgumentNullException(nameof(loginProvider));

                if (string.IsNullOrWhiteSpace(providerKey))
                    throw new ArgumentNullException(nameof(providerKey));

                _unitOfWork.UserLoginRepository.Remove(new UserLoginKey { LoginProvider = loginProvider, ProviderKey = providerKey });
                _unitOfWork.Commit();
                
                return Task.CompletedTask;
            }

            public Task<IList<UserLoginInfo>> GetLoginsAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                IList<UserLoginInfo> result = _unitOfWork.UserLoginRepository.FindByUserId(user.Id)
                    .Select(x => new UserLoginInfo(x.LoginProvider, x.ProviderKey, x.ProviderDisplayName))
                    .ToList();

                return Task.FromResult(result);
            }

            public Task<ApplicationUser> FindByLoginAsync(string loginProvider, string providerKey, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (string.IsNullOrWhiteSpace(loginProvider))
                    throw new ArgumentNullException(nameof(loginProvider));

                if (string.IsNullOrWhiteSpace(providerKey))
                    throw new ArgumentNullException(nameof(providerKey));

                var loginEntity = _unitOfWork.UserLoginRepository.Find(new UserLoginKey { LoginProvider = loginProvider, ProviderKey = providerKey });
                if (loginEntity == null)
                    return Task.FromResult(default(ApplicationUser));

                var userEntity = _unitOfWork.UserRepository.Find(loginEntity.UserId);

                return Task.FromResult(getApplicationUser(userEntity));
            }
            #endregion

            #region IUserRoleStore<ApplicationUser> Members
            public Task AddToRoleAsync(ApplicationUser user, string roleName, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                if (string.IsNullOrWhiteSpace(roleName))
                    throw new ArgumentNullException(nameof(roleName));

                _unitOfWork.UserRoleRepository.Add(user.Id, roleName);
                _unitOfWork.Commit();

                return Task.CompletedTask;
            }

            public Task RemoveFromRoleAsync(ApplicationUser user, string roleName, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                if (string.IsNullOrWhiteSpace(roleName))
                    throw new ArgumentNullException(nameof(roleName));

                _unitOfWork.UserRoleRepository.Remove(user.Id, roleName);

                _unitOfWork.Commit();

                return Task.CompletedTask;
            }

            public Task<IList<string>> GetRolesAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                IList<string> result = _unitOfWork.UserRoleRepository.GetRoleNamesByUserId(user.Id)
                    .ToList();

                return Task.FromResult(result);
            }

            public Task<bool> IsInRoleAsync(ApplicationUser user, string roleName, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                if (string.IsNullOrWhiteSpace(roleName))
                    throw new ArgumentNullException(nameof(roleName));

                var result = _unitOfWork.UserRoleRepository.GetRoleNamesByUserId(user.Id).Any(x => x == roleName);

                return Task.FromResult(result);
            }

            public Task<IList<ApplicationUser>> GetUsersInRoleAsync(string roleName, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (string.IsNullOrWhiteSpace(roleName))
                    throw new ArgumentNullException(nameof(roleName));

                IList<ApplicationUser> result = _unitOfWork.UserRoleRepository.GetUsersByRoleName(roleName)
                    .Select(x => getApplicationUser(x))
                    .ToList();

                return Task.FromResult(result);
            }
            #endregion

            #region IUserSecurityStampStore<ApplicationUser> Members
            public Task SetSecurityStampAsync(ApplicationUser user, string stamp, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                user.SecurityStamp = stamp;

                return Task.CompletedTask;
            }

            public Task<string> GetSecurityStampAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                return Task.FromResult(user.SecurityStamp);
            }
            #endregion

            #region IUserClaimStore<ApplicationUser> Members
            public Task<IList<Claim>> GetClaimsAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                IList<Claim> result = _unitOfWork.UserClaimRepository.GetByUserId(user.Id)
                    .Select(x => new Claim(x.ClaimType, x.ClaimValue)).ToList();

                return Task.FromResult(result);
            }

            public Task AddClaimsAsync(ApplicationUser user, IEnumerable<Claim> claims, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                if (claims == null)
                    throw new ArgumentNullException(nameof(claims));

                var claimEntities = claims.Select(x => getUserClaimEntity(x, user.Id));
                if(claimEntities.Count() > 0)
                {
                    claimEntities.ToList().ForEach(claimEntity =>
                    {
                        _unitOfWork.UserClaimRepository.Add(claimEntity);
                    });

                    _unitOfWork.Commit();
                }

                return Task.CompletedTask;
            }

            public Task ReplaceClaimAsync(ApplicationUser user, Claim claim, Claim newClaim, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                if (claim == null)
                    throw new ArgumentNullException(nameof(claim));

                if (newClaim == null)
                    throw new ArgumentNullException(nameof(newClaim));

                var claimEntity = _unitOfWork.UserClaimRepository.GetByUserId(user.Id)
                    .SingleOrDefault(x => x.ClaimType == claim.Type && x.ClaimValue == claim.Value);

                if(claimEntity != null)
                {
                    claimEntity.ClaimType = newClaim.Type;
                    claimEntity.ClaimValue = newClaim.Value;

                    _unitOfWork.UserClaimRepository.Update(claimEntity);
                    _unitOfWork.Commit();
                }

                return Task.CompletedTask;
            }

            public Task RemoveClaimsAsync(ApplicationUser user, IEnumerable<Claim> claims, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                if (claims == null)
                    throw new ArgumentNullException(nameof(claims));

                var userClaimEntities = _unitOfWork.UserClaimRepository.GetByUserId(user.Id);
                if (claims.Count() > 0)
                {
                    claims.ToList().ForEach(claim =>
                    {
                        var userClaimEntity = userClaimEntities.SingleOrDefault(x => x.ClaimType == claim.Type && x.ClaimValue == claim.Value);
                        _unitOfWork.UserClaimRepository.Remove(userClaimEntity.Id);
                    });

                    _unitOfWork.Commit();
                }

                return Task.CompletedTask;
            }

            public Task<IList<ApplicationUser>> GetUsersForClaimAsync(Claim claim, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (claim == null)
                    throw new ArgumentNullException(nameof(claim));

                IList<ApplicationUser> result = _unitOfWork.UserClaimRepository.GetUsersForClaim(claim.Type, claim.Value).Select(x => getApplicationUser(x)).ToList();

                return Task.FromResult(result);
            }
            #endregion

            #region IUserAuthenticationTokenStore<ApplicationUser> Members
            public Task SetTokenAsync(ApplicationUser user, string loginProvider, string name, string value, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                if (string.IsNullOrWhiteSpace(loginProvider))
                    throw new ArgumentNullException(nameof(loginProvider));

                if(string.IsNullOrWhiteSpace(name))
                    throw new ArgumentNullException(nameof(name));

                var userTokenEntity = new UserToken
                {
                    LoginProvider = loginProvider,
                    Name = name,
                    Value = value,
                    UserId = user.Id
                };

                _unitOfWork.UserTokenRepository.Add(userTokenEntity);
                _unitOfWork.Commit();

                return Task.CompletedTask;
            }

            public Task RemoveTokenAsync(ApplicationUser user, string loginProvider, string name, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                if (string.IsNullOrWhiteSpace(loginProvider))
                    throw new ArgumentNullException(nameof(loginProvider));

                if (string.IsNullOrWhiteSpace(name))
                    throw new ArgumentNullException(nameof(name));

                var userTokenEntity = _unitOfWork.UserTokenRepository.Find(new UserTokenKey { UserId = user.Id, LoginProvider = loginProvider, Name = name });
                if(userTokenEntity != null)
                {
                    _unitOfWork.UserTokenRepository.Remove(userTokenEntity);
                    _unitOfWork.Commit();
                }

                return Task.CompletedTask;
            }

            public Task<string> GetTokenAsync(ApplicationUser user, string loginProvider, string name, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                if (string.IsNullOrWhiteSpace(loginProvider))
                    throw new ArgumentNullException(nameof(loginProvider));

                if (string.IsNullOrWhiteSpace(name))
                    throw new ArgumentNullException(nameof(name));

                var userTokenEntity = _unitOfWork.UserTokenRepository.Find(new UserTokenKey { UserId = user.Id, LoginProvider = loginProvider, Name = name });

                return Task.FromResult(userTokenEntity?.Name);
            }
            #endregion

            #region IUserTwoFactorStore<ApplicationUser> Members
            public Task SetTwoFactorEnabledAsync(ApplicationUser user, bool enabled, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                user.TwoFactorEnabled = enabled;

                return Task.CompletedTask;
            }

            public Task<bool> GetTwoFactorEnabledAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                return Task.FromResult(user.TwoFactorEnabled);
            }
            #endregion

            #region IUserPhoneNumberStore<ApplicationUser> Members
            public Task SetPhoneNumberAsync(ApplicationUser user, string phoneNumber, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                user.PhoneNumber = phoneNumber;

                return Task.CompletedTask;
            }

            public Task<string> GetPhoneNumberAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                return Task.FromResult(user.PhoneNumber);
            }

            public Task<bool> GetPhoneNumberConfirmedAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                return Task.FromResult(user.PhoneNumberConfirmed);
            }

            public Task SetPhoneNumberConfirmedAsync(ApplicationUser user, bool confirmed, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                user.PhoneNumberConfirmed = confirmed;

                return Task.CompletedTask;
            }
            #endregion

            #region IUserLockoutStore<ApplicationUser> Members
            public Task<DateTimeOffset?> GetLockoutEndDateAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                return Task.FromResult(user.LockoutEnd);
            }

            public Task SetLockoutEndDateAsync(ApplicationUser user, DateTimeOffset? lockoutEnd, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                user.LockoutEnd = lockoutEnd;

                return Task.CompletedTask;
            }

            public Task<int> IncrementAccessFailedCountAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                return Task.FromResult(++user.AccessFailedCount);
            }

            public Task ResetAccessFailedCountAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                user.AccessFailedCount = 0;

                return Task.CompletedTask;
            }

            public Task<int> GetAccessFailedCountAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                return Task.FromResult(user.AccessFailedCount);
            }

            public Task<bool> GetLockoutEnabledAsync(ApplicationUser user, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                return Task.FromResult(user.LockoutEnabled);
            }

            public Task SetLockoutEnabledAsync(ApplicationUser user, bool enabled, CancellationToken cancellationToken)
            {
                if (cancellationToken != null)
                    cancellationToken.ThrowIfCancellationRequested();

                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                user.LockoutEnabled = enabled;

                return Task.CompletedTask;
            }
            #endregion

            #region Private Methods
            private User getUserEntity(ApplicationUser ApplicationUser)
            {
                if (ApplicationUser == null)
                    return null;

                var result = new User();
                populateUserEntity(result, ApplicationUser);

                return result;
            }

            private void populateUserEntity(User entity, ApplicationUser ApplicationUser)
            {
                entity.AccessFailedCount = ApplicationUser.AccessFailedCount;
                entity.ConcurrencyStamp = ApplicationUser.ConcurrencyStamp;
                entity.Email = ApplicationUser.Email;
                entity.EmailConfirmed = ApplicationUser.EmailConfirmed;
                entity.Id = ApplicationUser.Id;
                entity.LockoutEnabled = ApplicationUser.LockoutEnabled;
                entity.LockoutEnd = ApplicationUser.LockoutEnd;
                entity.NormalizedEmail = ApplicationUser.NormalizedEmail;
                entity.NormalizedUserName = ApplicationUser.NormalizedUserName;
                entity.PasswordHash = ApplicationUser.PasswordHash;
                entity.PhoneNumber = ApplicationUser.PhoneNumber;
                entity.PhoneNumberConfirmed = ApplicationUser.PhoneNumberConfirmed;
                entity.SecurityStamp = ApplicationUser.SecurityStamp;
                entity.TwoFactorEnabled = ApplicationUser.TwoFactorEnabled;
                entity.UserName = ApplicationUser.UserName;
            }

            private ApplicationUser getApplicationUser(User entity)
            {
                if (entity == null)
                    return null;

                var result = new ApplicationUser();
                populateApplicationUser(result, entity);

                return result;
            }

            private void populateApplicationUser(ApplicationUser ApplicationUser, User entity)
            {
                ApplicationUser.AccessFailedCount = entity.AccessFailedCount;
                ApplicationUser.ConcurrencyStamp = entity.ConcurrencyStamp;
                ApplicationUser.Email = entity.Email;
                ApplicationUser.EmailConfirmed = entity.EmailConfirmed;
                ApplicationUser.Id = entity.Id;
                ApplicationUser.LockoutEnabled = entity.LockoutEnabled;
                ApplicationUser.LockoutEnd = entity.LockoutEnd;
                ApplicationUser.NormalizedEmail = entity.NormalizedEmail;
                ApplicationUser.NormalizedUserName = entity.NormalizedUserName;
                ApplicationUser.PasswordHash = entity.PasswordHash;
                ApplicationUser.PhoneNumber = entity.PhoneNumber;
                ApplicationUser.PhoneNumberConfirmed = entity.PhoneNumberConfirmed;
                ApplicationUser.SecurityStamp = entity.SecurityStamp;
                ApplicationUser.TwoFactorEnabled = entity.TwoFactorEnabled;
                ApplicationUser.UserName = entity.UserName;
            }

            private UserClaim getUserClaimEntity(Claim value, string userId)
            {
                return value == null
                    ? default(UserClaim)
                    : new UserClaim
                    {
                        ClaimType = value.Type,
                        ClaimValue = value.Value,
                        UserId = userId
                    };
            }
            #endregion
        }
    }
 
### Configuring the Dependencies

Out of the box, ASP.NET Core encourages dependency injection with a simple inversion of control container. So, instead of using `Unity` or some other container like I did in my previous example, we're going to use what's built in. Once we get the dependencies configured, we should have a working application!

#### The IdentityBuilder

The out-of-the-box Entity Framework implementation of ASP.NET Core Identity has an extension method on the `IdentityBuilder` class called `AddEntityFrameworkStores` which just added the `UserStore` and `RoleStore` implementations to the inversion of control container. So we're going to create our own extension method called `AddCustomStores` that will &mdash; you guessed it &mdash; add our custom stores:

##### IdentityBuilderExtensions.cs

    using AspNetCoreIdentityExample.Web.Models;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.DependencyInjection;

    namespace AspNetCoreIdentityExample.Web.Identity
    {
        public static class IdentityBuilderExtensions
        {
            public static IdentityBuilder AddCustomStores(this IdentityBuilder builder)
            {
                builder.Services.AddTransient<IUserStore<ApplicationUser>, CustomUserStore>();
                builder.Services.AddTransient<IRoleStore<IdentityRole>, CustomRoleStore>();
                return builder;
            }
        }
    }

#### Edit Startup.cs
 
Now all that's left to do is make a few changes to the `Startup.cs` class, and we'll be done. So, open it up, and do the following:

Add the following `using` statements:

    using WebApplication1.Identity;
    using WebApplication1.Domain;
    using WebApplication1.Data;
 
Then, in the `ConfigureServices` method, change this line:

    services.AddIdentity<ApplicationUser, IdentityRole>()
        .AddDefaultTokenProviders();

to this:

    services.AddIdentity<ApplicationUser, IdentityRole>()
        .AddCustomStores()
        .AddDefaultTokenProviders();

And add the following line right after `// Add application services.`:

    services.AddScoped<IUnitOfWork, DapperUnitOfWork>(provider => new DapperUnitOfWork(Configuration.GetConnectionString("DefaultConnection")));

*NOTE: Using `AddScoped` for the `IUnitOfWork` allows a single instance of the underlying `IDbCconnection` to be used per request, as opposed to `AddTransient` which would create a new instance each time it is resolved. This is what allows the UnitOfWork pattern to work with multiple repositories.*

## Conclusion

Now, go ahead and run it! You should have a working application that has all of the same functionality as you get out-of-the-box with the default template! If not, then you might need to go back and double-check your work along the way. Or (and I would probably just do this), you could fork my repository for this tutorial: [https://github.com/timschreiber/ASP.NET-Core-Identity-Example][3].

It's been a fun exercise to put this project together. Microsoft fixed a lot of things that were wrong with ASP.NET Identity, and doing a custom implementation is easier than ever. Now that you've got your feet wet, you can adapt this project to your specific use case. I have a "day job" project where I'm implementing the `CustomRoleStore` and `CustomUserStore` to use a REST service instead of a database connection. So, let me know what you think in the comments, and as always, happy coding!
 
[1]: /2018/05/07/aspnet-core-identity-with-patterns/
[2]: /2018/05/07/aspnet-core-identity-with-patterns-2/
[3]: https://github.com/timschreiber/ASP.NET-Core-Identity-Example
[4]: https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity?view=aspnetcore-2.1&tabs=visual-studio%2Caspnetcore2x
[5]: /2015/01/14/persistence-ignorant-asp-net-identity-with-patterns-part-1/
