--- 
title: "Persistence-Ignorant ASP.NET Identity with Patterns (Part 4)"
canonical: "http://timschreiber.com/2015/01/28/persistence-ignorant-asp-net-identity-with-patterns-part-4/"
date: 2015-01-28
layout: post3
comments: true
description: "Diving straight into the guts of ASP.NET Identity, hooking everything up in Unity, and finishing with a fully functional site."
image: "persistence-ignorant-asp-net-identity-with-patterns.jpg"
color: "#063352"
featured: 0
tags:
- asp-net
- mvc-5
- patterns
- architecture
---

<h4 style="color:#e53935;font-style:italic;">See my updated tutorial for ASP.NET Core Identity [here](/2018/05/07/aspnet-core-identity-with-patterns/)</h4>

* [Part 1][2]
* [Part 2][3]
* [Part 3][4]
* __Part 4__

__The source code for this series of posts is available at on my GitHub: [https://github.com/timschreiber/Mvc5IdentityExample][6]__

###### _This series of posts requires a functional understanding of ASP.NET Identity 2.x. If you haven't had at least some kind of exposure, this is a good place to start: [http://www.asp.net/identity][1]._

In Part 1, I identified some of the shortcomings in the default template for ASP.NET MVC 5 web applications using ASP.NET Identity for “Individual User Accounts” authentication, and then laid out the requirements for a better implementation. In Part 2, we created the Visual Studio Solution for our ASP.NET Identity Example, broke the out-of-the-box dependencies on Entity Framework, and coded our Domain Layer. In Part 3, we defined our entity mappings, coded the DbContext, and implemented the interfaces for the Repositories and Unit of Work that we defined in the Domain Layer. In this part, we’re going to switch our focus to the `Mvc5IdentityExample.Web` project and dive straight into the guts of ASP.NET Identity. Then, we’re going to hook everything up with Unity and finish with a fully functional MVC5 web application with ASP.NET Identity done the “right way.”

<!--more-->

### ASP.NET Identity Classes

When we broke the coupling between our Presentation Layer and Entity Framework, we lost the references to the implementations of four classes that make ASP.NET Identity work (that’s a good thing). So now we have to replace them with classes that work with our Entities, Repositories, and Unit of Work. There are two model classes: `IdentityUser` and `IdentityRole`, and two data store classes: `UserStore` and `RoleStore`. You might remember `UserStore` from my rants in [Part 1][2].

To get started, let’s add project references to our `Mvc5IdentityExample.Domain` and `Mvc5IdentityExample.Data.EntityFramework` projects. Then, create a folder In the `MvcIdentityExample.Web` project and call it `Identity`. This is where we’re going to put our classes.

#### Model Classes

First, we’re going to get started on our model classes:

###### IdentityUser.cs

    using Microsoft.AspNet.Identity;
    using System;

    namespace Mvc5IdentityExample.Web.Identity
    {
        public class IdentityUser : IUser<Guid>
        {
            public IdentityUser()
            {
                this.Id = Guid.NewGuid();
            }

            public IdentityUser(string userName)
                : this()
            {
                this.UserName = userName;
            }

            public Guid Id { get; set; }
            public string UserName { get; set; }
            public virtual string PasswordHash { get; set; }
            public virtual string SecurityStamp { get; set; }
        }
    }

###### IdentityRole.cs

    using Microsoft.AspNet.Identity;
    using System;

    namespace Mvc5IdentityExample.Web.Identity
    {
        public class IdentityRole : IRole<Guid>
        {
            public IdentityRole()
            {
                this.Id = Guid.NewGuid();
            }

            public IdentityRole(string name)
                : this()
            {
                this.Name = name;
            }

            public IdentityRole(string name, Guid id)
            {
                this.Name = name;
                this.Id = id;
            }

            public Guid Id { get; set; }
            public string Name { get; set; }
        }
    }

#### Data Store Classes

In the ASP.NET Identity [documentation][5], Microsoft author Tom FitzMacken acknowledges their data store classes are “closely coupled with the persistence mechanism,” which they then closely couple to their Presentation Layer in the default Entity Framework implementation. Done correctly in a persistence-ignorant kind of way, these classes take the `IdentityUser` and `IdentityRole` models that ASP.NET Identity likes, turn them into the Entities that our Repositories and Unit of Work like, and make sure everything gets written out to some persistence mechanism, whatever that may be.

You might notice we have an empty `Dispose` method in our data store classes. That’s because ASP.NET Identity requires us to implement `IDisposable`, but we’re letting Unity manage the lifetime of our `IUnitOfWork`, which is the only injected dependency these classes have.

###### UserStore.cs

    ﻿using Microsoft.AspNet.Identity;
    using Mvc5IdentityExample.Domain;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using Entities = Mvc5IdentityExample.Domain.Entities;

    namespace Mvc5IdentityExample.Web.Identity
    {
        public class UserStore : IUserLoginStore<IdentityUser, Guid>, IUserClaimStore<IdentityUser, Guid>, IUserRoleStore<IdentityUser, Guid>, IUserPasswordStore<IdentityUser, Guid>, IUserSecurityStampStore<IdentityUser, Guid>, IUserStore<IdentityUser, Guid>, IDisposable
        {
            private readonly IUnitOfWork _unitOfWork;

            public UserStore(IUnitOfWork unitOfWork)
            {
                _unitOfWork = unitOfWork;
            }

            #region IUserStore<IdentityUser, Guid> Members
            public Task CreateAsync(IdentityUser user)
            {
                if (user == null)
                    throw new ArgumentNullException("user");

                var u = getUser(user);

                _unitOfWork.UserRepository.Add(u);
                return _unitOfWork.SaveChangesAsync();
            }

            public Task DeleteAsync(IdentityUser user)
            {
                if (user == null)
                    throw new ArgumentNullException("user");

                var u = getUser(user);

                _unitOfWork.UserRepository.Remove(u);
                return _unitOfWork.SaveChangesAsync();
            }

            public Task<IdentityUser> FindByIdAsync(Guid userId)
            {
                var user = _unitOfWork.UserRepository.FindById(userId);
                return Task.FromResult<IdentityUser>(getIdentityUser(user));
            }

            public Task<IdentityUser> FindByNameAsync(string userName)
            {
                var user = _unitOfWork.UserRepository.FindByUserName(userName);
                return Task.FromResult<IdentityUser>(getIdentityUser(user));
            }

            public Task UpdateAsync(IdentityUser user)
            {
                if (user == null)
                    throw new ArgumentException("user");

                var u = _unitOfWork.UserRepository.FindById(user.Id);
                if (u == null)
                    throw new ArgumentException("IdentityUser does not correspond to a User entity.", "user");

                populateUser(u, user);

                _unitOfWork.UserRepository.Update(u);
                return _unitOfWork.SaveChangesAsync();
            }
            #endregion

            #region IDisposable Members
            public void Dispose()
            {
                // Dispose does nothing since we want Unity to manage the lifecycle of our Unit of Work
            }
            #endregion

            #region IUserClaimStore<IdentityUser, Guid> Members
            public Task AddClaimAsync(IdentityUser user, Claim claim)
            {
                if (user == null)
                    throw new ArgumentNullException("user");
                if (claim == null)
                    throw new ArgumentNullException("claim");

                var u = _unitOfWork.UserRepository.FindById(user.Id);
                if (u == null)
                    throw new ArgumentException("IdentityUser does not correspond to a User entity.", "user");

                var c = new Entities.Claim
                {
                    ClaimType = claim.Type,
                    ClaimValue = claim.Value,
                    User = u
                };
                u.Claims.Add(c);

                _unitOfWork.UserRepository.Update(u);
                return _unitOfWork.SaveChangesAsync();
            }

            public Task<IList<Claim>> GetClaimsAsync(IdentityUser user)
            {
                if (user == null)
                    throw new ArgumentNullException("user");

                var u = _unitOfWork.UserRepository.FindById(user.Id);
                if (u == null)
                    throw new ArgumentException("IdentityUser does not correspond to a User entity.", "user");

                return Task.FromResult<IList<Claim>>(u.Claims.Select(x => new Claim(x.ClaimType, x.ClaimValue)).ToList());
            }

            public Task RemoveClaimAsync(IdentityUser user, Claim claim)
            {
                if (user == null)
                    throw new ArgumentNullException("user");
                if (claim == null)
                    throw new ArgumentNullException("claim");

                var u = _unitOfWork.UserRepository.FindById(user.Id);
                if (u == null)
                    throw new ArgumentException("IdentityUser does not correspond to a User entity.", "user");

                var c = u.Claims.FirstOrDefault(x => x.ClaimType == claim.Type && x.ClaimValue == claim.Value);
                u.Claims.Remove(c);

                _unitOfWork.UserRepository.Update(u);
                return _unitOfWork.SaveChangesAsync();
            }
            #endregion

            #region IUserLoginStore<IdentityUser, Guid> Members
            public Task AddLoginAsync(IdentityUser user, UserLoginInfo login)
            {
                if (user == null)
                    throw new ArgumentNullException("user");
                if (login == null)
                    throw new ArgumentNullException("login");

                var u = _unitOfWork.UserRepository.FindById(user.Id);
                if (u == null)
                    throw new ArgumentException("IdentityUser does not correspond to a User entity.", "user");

                var l = new Entities.ExternalLogin
                {
                    LoginProvider = login.LoginProvider,
                    ProviderKey = login.ProviderKey,
                    User = u
                };
                u.Logins.Add(l);

                _unitOfWork.UserRepository.Update(u);
                return _unitOfWork.SaveChangesAsync();
            }

            public Task<IdentityUser> FindAsync(UserLoginInfo login)
            {
                if (login == null)
                    throw new ArgumentNullException("login");

                var identityUser = default(IdentityUser);

                var l = _unitOfWork.ExternalLoginRepository.GetByProviderAndKey(login.LoginProvider, login.ProviderKey);
                if (l != null)
                    identityUser = getIdentityUser(l.User);

                return Task.FromResult<IdentityUser>(identityUser);
            }

            public Task<IList<UserLoginInfo>> GetLoginsAsync(IdentityUser user)
            {
                if (user == null)
                    throw new ArgumentNullException("user");

                var u = _unitOfWork.UserRepository.FindById(user.Id);
                if (u == null)
                    throw new ArgumentException("IdentityUser does not correspond to a User entity.", "user");

                return Task.FromResult<IList<UserLoginInfo>>(u.Logins.Select(x => new UserLoginInfo(x.LoginProvider, x.ProviderKey)).ToList());
            }

            public Task RemoveLoginAsync(IdentityUser user, UserLoginInfo login)
            {
                if (user == null)
                    throw new ArgumentNullException("user");
                if (login == null)
                    throw new ArgumentNullException("login");

                var u = _unitOfWork.UserRepository.FindById(user.Id);
                if (u == null)
                    throw new ArgumentException("IdentityUser does not correspond to a User entity.", "user");

                var l = u.Logins.FirstOrDefault(x => x.LoginProvider == login.LoginProvider && x.ProviderKey == login.ProviderKey);
                u.Logins.Remove(l);

                _unitOfWork.UserRepository.Update(u);
                return _unitOfWork.SaveChangesAsync();
            }
            #endregion

            #region IUserRoleStore<IdentityUser, Guid> Members
            public Task AddToRoleAsync(IdentityUser user, string roleName)
            {
                if (user == null)
                    throw new ArgumentNullException("user");
                if (string.IsNullOrWhiteSpace(roleName))
                    throw new ArgumentException("Argument cannot be null, empty, or whitespace: roleName.");

                var u = _unitOfWork.UserRepository.FindById(user.Id);
                if (u == null)
                    throw new ArgumentException("IdentityUser does not correspond to a User entity.", "user");
                var r = _unitOfWork.RoleRepository.FindByName(roleName);
                if (r == null)
                    throw new ArgumentException("roleName does not correspond to a Role entity.", "roleName");

                u.Roles.Add(r);
                _unitOfWork.UserRepository.Update(u);

                return _unitOfWork.SaveChangesAsync();
            }

            public Task<IList<string>> GetRolesAsync(IdentityUser user)
            {
                if (user == null)
                    throw new ArgumentNullException("user");

                var u = _unitOfWork.UserRepository.FindById(user.Id);
                if (u == null)
                    throw new ArgumentException("IdentityUser does not correspond to a User entity.", "user");

                return Task.FromResult<IList<string>>(u.Roles.Select(x => x.Name).ToList());
            }

            public Task<bool> IsInRoleAsync(IdentityUser user, string roleName)
            {
                if (user == null)
                    throw new ArgumentNullException("user");
                if (string.IsNullOrWhiteSpace(roleName))
                    throw new ArgumentException("Argument cannot be null, empty, or whitespace: role.");

                var u = _unitOfWork.UserRepository.FindById(user.Id);
                if (u == null)
                    throw new ArgumentException("IdentityUser does not correspond to a User entity.", "user");

                return Task.FromResult<bool>(u.Roles.Any(x => x.Name == roleName));
            }

            public Task RemoveFromRoleAsync(IdentityUser user, string roleName)
            {
                if (user == null)
                    throw new ArgumentNullException("user");
                if (string.IsNullOrWhiteSpace(roleName))
                    throw new ArgumentException("Argument cannot be null, empty, or whitespace: role.");

                var u = _unitOfWork.UserRepository.FindById(user.Id);
                if (u == null)
                    throw new ArgumentException("IdentityUser does not correspond to a User entity.", "user");

                var r = u.Roles.FirstOrDefault(x => x.Name == roleName);
                u.Roles.Remove(r);

                _unitOfWork.UserRepository.Update(u);
                return _unitOfWork.SaveChangesAsync();
            }
            #endregion

            #region IUserPasswordStore<IdentityUser, Guid> Members
            public Task<string> GetPasswordHashAsync(IdentityUser user)
            {
                if (user == null)
                    throw new ArgumentNullException("user");
                return Task.FromResult<string>(user.PasswordHash);
            }

            public Task<bool> HasPasswordAsync(IdentityUser user)
            {
                if (user == null)
                    throw new ArgumentNullException("user");
                return Task.FromResult<bool>(!string.IsNullOrWhiteSpace(user.PasswordHash));
            }

            public Task SetPasswordHashAsync(IdentityUser user, string passwordHash)
            {
                user.PasswordHash = passwordHash;
                return Task.FromResult(0);
            }
            #endregion

            #region IUserSecurityStampStore<IdentityUser, Guid> Members
            public Task<string> GetSecurityStampAsync(IdentityUser user)
            {
                if (user == null)
                    throw new ArgumentNullException("user");
                return Task.FromResult<string>(user.SecurityStamp);
            }

            public Task SetSecurityStampAsync(IdentityUser user, string stamp)
            {
                user.SecurityStamp = stamp;
                return Task.FromResult(0);
            }
            #endregion

            #region Private Methods
            private Entities.User getUser(IdentityUser identityUser)
            {
                if (identityUser == null)
                    return null;

                var user = new Entities.User();
                populateUser(user, identityUser);

                return user;
            }

            private void populateUser(Entities.User user, IdentityUser identityUser)
            {
                user.UserId = identityUser.Id;
                user.UserName = identityUser.UserName;
                user.PasswordHash = identityUser.PasswordHash;
                user.SecurityStamp = identityUser.SecurityStamp;
            }

            private IdentityUser getIdentityUser(Entities.User user)
            {
                if (user == null)
                    return null;

                var identityUser = new IdentityUser();
                populateIdentityUser(identityUser, user);

                return identityUser;
            }

            private void populateIdentityUser(IdentityUser identityUser, Entities.User user)
            {
                identityUser.Id = user.UserId;
                identityUser.UserName = user.UserName;
                identityUser.PasswordHash = user.PasswordHash;
                identityUser.SecurityStamp = user.SecurityStamp;
            }
            #endregion
        }
    }

###### RoleStore.cs

    using Microsoft.AspNet.Identity;
    using Mvc5IdentityExample.Domain;
    using Mvc5IdentityExample.Domain.Entities;
    using System;
    using System.Linq;
    using System.Threading.Tasks;

    namespace Mvc5IdentityExample.Web.Identity
    {
        public class RoleStore : IRoleStore<IdentityRole, Guid>, IQueryableRoleStore<IdentityRole, Guid>, IDisposable
        {
            private readonly IUnitOfWork _unitOfWork;

            public RoleStore(IUnitOfWork unitOfWork)
            {
                _unitOfWork = unitOfWork;
            }

            #region IRoleStore<IdentityRole, Guid> Members
            public System.Threading.Tasks.Task CreateAsync(IdentityRole role)
            {
                if (role == null)
                    throw new ArgumentNullException("role");

                var r = getRole(role);

                _unitOfWork.RoleRepository.Add(r);
                return _unitOfWork.SaveChangesAsync();
            }

            public System.Threading.Tasks.Task DeleteAsync(IdentityRole role)
            {
                if (role == null)
                    throw new ArgumentNullException("role");

                var r = getRole(role);

                _unitOfWork.RoleRepository.Remove(r);
                return _unitOfWork.SaveChangesAsync();
            }

            public System.Threading.Tasks.Task<IdentityRole> FindByIdAsync(Guid roleId)
            {
                var role = _unitOfWork.RoleRepository.FindById(roleId);
                return Task.FromResult<IdentityRole>(getIdentityRole(role));
            }

            public System.Threading.Tasks.Task<IdentityRole> FindByNameAsync(string roleName)
            {
                var role = _unitOfWork.RoleRepository.FindByName(roleName);
                return Task.FromResult<IdentityRole>(getIdentityRole(role));
            }

            public System.Threading.Tasks.Task UpdateAsync(IdentityRole role)
            {
                if (role == null)
                    throw new ArgumentNullException("role");
                var r = getRole(role);
                _unitOfWork.RoleRepository.Update(r);
                return _unitOfWork.SaveChangesAsync();
            }
            #endregion

            #region IDisposable Members
            public void Dispose()
            {
                // Dispose does nothing since we want Unity to manage the lifecycle of our Unit of Work
            }
            #endregion

            #region IQueryableRoleStore<IdentityRole, Guid> Members
            public IQueryable<IdentityRole> Roles
            {
                get
                {
                    return _unitOfWork.RoleRepository
                        .GetAll()
                        .Select(x => getIdentityRole(x))
                        .AsQueryable();
                }
            }
            #endregion

            #region Private Methods
            private Role getRole(IdentityRole identityRole)
            {
                if (identityRole == null)
                    return null;
                return new Role
                {
                    RoleId = identityRole.Id,
                    Name = identityRole.Name
                };
            }

            private IdentityRole getIdentityRole(Role role)
            {
                if (role == null)
                    return null;
                return new IdentityRole
                {
                    Id = role.RoleId,
                    Name = role.Name
                };
            }
            #endregion
        }
    }

### Account Controller

Next, we’re going to move on to the `AccountController` that got generated when we created the `MvcIdentityExample.Web` project. There are several changes that we’re going to have to make to get it to work with our new ASP.NET Identity classes. First of all, we need to change the way it gets its `UserManager` dependency. Since we’ll be letting Unity take care of all of that for us, we’ll just use some simple constructor injection:

    private readonly UserManager<IdentityUser, Guid> _userManager;

    public AccountController(UserManager<IdentityUser, Guid> userManager)
    {
        _userManager = userManager;
    }

Next, since 1) I’ve chosen to use `Guid`s for my `User` and `Role` Ids, and 2) the `AccountController` class generated expecting a `string`, we need to write a new private method to get a `Guid` from the `string`s in a safe way:

    private Guid getGuid(string value)
    {
        var result = default(Guid);
        Guid.TryParse(value, out result);
        return result;
    }

Finally, we need to replace some not-working code with our new working code. Let’s go through the methods and do the following:

1. Replace all occurrences of `User.Identity.GetUserId()` with `getGuid(User.Identity.GetUserId())`.
2. Replace all occurrences of `ApplicationUser` with `IdentityUser`
3. Replace all occurrences of `UserManager` with `_userManager`

In the end, your `AccountController` class should look like this:

###### AccountController.cs

    using Microsoft.AspNet.Identity;
    using Microsoft.Owin.Security;
    using Mvc5IdentityExample.Web.Identity;
    using Mvc5IdentityExample.Web.Models;
    using System;
    using System.Threading.Tasks;
    using System.Web;
    using System.Web.Mvc;

    namespace Mvc5IdentityExample.Web.Controllers
    {
        [Authorize]
        public class AccountController : Controller
        {
            private readonly UserManager<IdentityUser, Guid> _userManager;
            
            public AccountController(UserManager<IdentityUser, Guid> userManager)
            {
                _userManager = userManager;
            }

            //
            // GET: /Account/Login
            [AllowAnonymous]
            public ActionResult Login(string returnUrl)
            {
                ViewBag.ReturnUrl = returnUrl;
                return View();
            }

            //
            // POST: /Account/Login
            [HttpPost]
            [AllowAnonymous]
            [ValidateAntiForgeryToken]
            public async Task<ActionResult> Login(LoginViewModel model, string returnUrl)
            {
                if (ModelState.IsValid)
                {
                    var user = await _userManager.FindAsync(model.UserName, model.Password);
                    if (user != null)
                    {
                        await SignInAsync(user, model.RememberMe);
                        return RedirectToLocal(returnUrl);
                    }
                    else
                    {
                        ModelState.AddModelError("", "Invalid username or password.");
                    }
                }

                // If we got this far, something failed, redisplay form
                return View(model);
            }

            //
            // GET: /Account/Register
            [AllowAnonymous]
            public ActionResult Register()
            {
                return View();
            }

            //
            // POST: /Account/Register
            [HttpPost]
            [AllowAnonymous]
            [ValidateAntiForgeryToken]
            public async Task<ActionResult> Register(RegisterViewModel model)
            {
                if (ModelState.IsValid)
                {
                    var user = new IdentityUser() { UserName = model.UserName };
                    var result = await _userManager.CreateAsync(user, model.Password);
                    if (result.Succeeded)
                    {
                        await SignInAsync(user, isPersistent: false);
                        return RedirectToAction("Index", "Home");
                    }
                    else
                    {
                        AddErrors(result);
                    }
                }

                // If we got this far, something failed, redisplay form
                return View(model);
            }

            //
            // POST: /Account/Disassociate
            [HttpPost]
            [ValidateAntiForgeryToken]
            public async Task<ActionResult> Disassociate(string loginProvider, string providerKey)
            {
                ManageMessageId? message = null;
                IdentityResult result = await _userManager.RemoveLoginAsync(getGuid(User.Identity.GetUserId()), new UserLoginInfo(loginProvider, providerKey));
                if (result.Succeeded)
                {
                    message = ManageMessageId.RemoveLoginSuccess;
                }
                else
                {
                    message = ManageMessageId.Error;
                }
                return RedirectToAction("Manage", new { Message = message });
            }

            //
            // GET: /Account/Manage
            public ActionResult Manage(ManageMessageId? message)
            {
                ViewBag.StatusMessage =
                    message == ManageMessageId.ChangePasswordSuccess ? "Your password has been changed."
                    : message == ManageMessageId.SetPasswordSuccess ? "Your password has been set."
                    : message == ManageMessageId.RemoveLoginSuccess ? "The external login was removed."
                    : message == ManageMessageId.Error ? "An error has occurred."
                    : "";
                ViewBag.HasLocalPassword = HasPassword();
                ViewBag.ReturnUrl = Url.Action("Manage");
                return View();
            }

            //
            // POST: /Account/Manage
            [HttpPost]
            [ValidateAntiForgeryToken]
            public async Task<ActionResult> Manage(ManageUserViewModel model)
            {
                bool hasPassword = HasPassword();
                ViewBag.HasLocalPassword = hasPassword;
                ViewBag.ReturnUrl = Url.Action("Manage");
                if (hasPassword)
                {
                    if (ModelState.IsValid)
                    {
                        IdentityResult result = await _userManager.ChangePasswordAsync(getGuid(User.Identity.GetUserId()), model.OldPassword, model.NewPassword);
                        if (result.Succeeded)
                        {
                            return RedirectToAction("Manage", new { Message = ManageMessageId.ChangePasswordSuccess });
                        }
                        else
                        {
                            AddErrors(result);
                        }
                    }
                }
                else
                {
                    // User does not have a password so remove any validation errors caused by a missing OldPassword field
                    ModelState state = ModelState["OldPassword"];
                    if (state != null)
                    {
                        state.Errors.Clear();
                    }

                    if (ModelState.IsValid)
                    {
                        IdentityResult result = await _userManager.AddPasswordAsync(getGuid(User.Identity.GetUserId()), model.NewPassword);
                        if (result.Succeeded)
                        {
                            return RedirectToAction("Manage", new { Message = ManageMessageId.SetPasswordSuccess });
                        }
                        else
                        {
                            AddErrors(result);
                        }
                    }
                }

                // If we got this far, something failed, redisplay form
                return View(model);
            }

            //
            // POST: /Account/ExternalLogin
            [HttpPost]
            [AllowAnonymous]
            [ValidateAntiForgeryToken]
            public ActionResult ExternalLogin(string provider, string returnUrl)
            {
                // Request a redirect to the external login provider
                return new ChallengeResult(provider, Url.Action("ExternalLoginCallback", "Account", new { ReturnUrl = returnUrl }));
            }

            //
            // GET: /Account/ExternalLoginCallback
            [AllowAnonymous]
            public async Task<ActionResult> ExternalLoginCallback(string returnUrl)
            {
                var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();
                if (loginInfo == null)
                {
                    return RedirectToAction("Login");
                }

                // Sign in the user with this external login provider if the user already has a login
                var user = await _userManager.FindAsync(loginInfo.Login);
                if (user != null)
                {
                    await SignInAsync(user, isPersistent: false);
                    return RedirectToLocal(returnUrl);
                }
                else
                {
                    // If the user does not have an account, then prompt the user to create an account
                    ViewBag.ReturnUrl = returnUrl;
                    ViewBag.LoginProvider = loginInfo.Login.LoginProvider;
                    return View("ExternalLoginConfirmation", new ExternalLoginConfirmationViewModel { UserName = loginInfo.DefaultUserName });
                }
            }

            //
            // POST: /Account/LinkLogin
            [HttpPost]
            [ValidateAntiForgeryToken]
            public ActionResult LinkLogin(string provider)
            {
                // Request a redirect to the external login provider to link a login for the current user
                return new ChallengeResult(provider, Url.Action("LinkLoginCallback", "Account"), User.Identity.GetUserId());
            }

            //
            // GET: /Account/LinkLoginCallback
            public async Task<ActionResult> LinkLoginCallback()
            {
                var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync(XsrfKey, User.Identity.GetUserId());
                if (loginInfo == null)
                {
                    return RedirectToAction("Manage", new { Message = ManageMessageId.Error });
                }
                var result = await _userManager.AddLoginAsync(getGuid(User.Identity.GetUserId()), loginInfo.Login);
                if (result.Succeeded)
                {
                    return RedirectToAction("Manage");
                }
                return RedirectToAction("Manage", new { Message = ManageMessageId.Error });
            }

            //
            // POST: /Account/ExternalLoginConfirmation
            [HttpPost]
            [AllowAnonymous]
            [ValidateAntiForgeryToken]
            public async Task<ActionResult> ExternalLoginConfirmation(ExternalLoginConfirmationViewModel model, string returnUrl)
            {
                if (User.Identity.IsAuthenticated)
                {
                    return RedirectToAction("Manage");
                }

                if (ModelState.IsValid)
                {
                    // Get the information about the user from the external login provider
                    var info = await AuthenticationManager.GetExternalLoginInfoAsync();
                    if (info == null)
                    {
                        return View("ExternalLoginFailure");
                    }
                    var user = new IdentityUser() { UserName = model.UserName };
                    var result = await _userManager.CreateAsync(user);
                    if (result.Succeeded)
                    {
                        result = await _userManager.AddLoginAsync(user.Id, info.Login);
                        if (result.Succeeded)
                        {
                            await SignInAsync(user, isPersistent: false);
                            return RedirectToLocal(returnUrl);
                        }
                    }
                    AddErrors(result);
                }

                ViewBag.ReturnUrl = returnUrl;
                return View(model);
            }

            //
            // POST: /Account/LogOff
            [HttpPost]
            [ValidateAntiForgeryToken]
            public ActionResult LogOff()
            {
                AuthenticationManager.SignOut();
                return RedirectToAction("Index", "Home");
            }

            //
            // GET: /Account/ExternalLoginFailure
            [AllowAnonymous]
            public ActionResult ExternalLoginFailure()
            {
                return View();
            }

            [ChildActionOnly]
            public ActionResult RemoveAccountList()
            {
                var linkedAccounts = _userManager.GetLogins(getGuid(User.Identity.GetUserId()));
                ViewBag.ShowRemoveButton = HasPassword() || linkedAccounts.Count > 1;
                return (ActionResult)PartialView("_RemoveAccountPartial", linkedAccounts);
            }

            protected override void Dispose(bool disposing)
            {
                if (disposing && _userManager != null)
                {
                    _userManager.Dispose();
                }
                base.Dispose(disposing);
            }

            #region Helpers
            // Used for XSRF protection when adding external logins
            private const string XsrfKey = "XsrfId";

            private IAuthenticationManager AuthenticationManager
            {
                get
                {
                    return HttpContext.GetOwinContext().Authentication;
                }
            }

            private async Task SignInAsync(IdentityUser user, bool isPersistent)
            {
                AuthenticationManager.SignOut(DefaultAuthenticationTypes.ExternalCookie);
                var identity = await _userManager.CreateIdentityAsync(user, DefaultAuthenticationTypes.ApplicationCookie);
                AuthenticationManager.SignIn(new AuthenticationProperties() { IsPersistent = isPersistent }, identity);
            }

            private void AddErrors(IdentityResult result)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error);
                }
            }

            private bool HasPassword()
            {
                var user = _userManager.FindById(getGuid(User.Identity.GetUserId()));
                if (user != null)
                {
                    return user.PasswordHash != null;
                }
                return false;
            }

            public enum ManageMessageId
            {
                ChangePasswordSuccess,
                SetPasswordSuccess,
                RemoveLoginSuccess,
                Error
            }

            private ActionResult RedirectToLocal(string returnUrl)
            {
                if (Url.IsLocalUrl(returnUrl))
                {
                    return Redirect(returnUrl);
                }
                else
                {
                    return RedirectToAction("Index", "Home");
                }
            }

            private class ChallengeResult : HttpUnauthorizedResult
            {
                public ChallengeResult(string provider, string redirectUri) : this(provider, redirectUri, null)
                {
                }

                public ChallengeResult(string provider, string redirectUri, string userId)
                {
                    LoginProvider = provider;
                    RedirectUri = redirectUri;
                    UserId = userId;
                }

                public string LoginProvider { get; set; }
                public string RedirectUri { get; set; }
                public string UserId { get; set; }

                public override void ExecuteResult(ControllerContext context)
                {
                    var properties = new AuthenticationProperties() { RedirectUri = RedirectUri };
                    if (UserId != null)
                    {
                        properties.Dictionary[XsrfKey] = UserId;
                    }
                    context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
                }
            }

            private Guid getGuid(string value)
            {
                var result = default(Guid);
                Guid.TryParse(value, out result);
                return result;
            }
            #endregion
        }
    }

### Unity

I mentioned that we’ll be letting Unity handle the lifetimes for our dependencies. So we need to add Unity to the `MvcIdentityExample.Web` project. The easiest way to do this is to install the `Unity.MVC5` package by DevTrends. It adds all the code necessary to integrate Unity with MVC5. So, open up the Package Manager Console and run the following command:

    Install-Package Unity.Mvc5

After it’s done installing, you’ll notice it added a `UnityConfig.cs` file in your `App_Start` folder. This is where we are going to register the dependencies we want Unity to inject (and manage the lifetimes of). Open it up, and make sure it looks like this:

###### UnityConfig.cs

    using Microsoft.AspNet.Identity;
    using Microsoft.Practices.Unity;
    using Mvc5IdentityExample.Data.EntityFramework;
    using Mvc5IdentityExample.Domain;
    using Mvc5IdentityExample.Web.Identity;
    using System;
    using System.Web.Mvc;
    using Unity.Mvc5;

    namespace Mvc5IdentityExample.Web
    {
        public static class UnityConfig
        {
            public static void RegisterComponents()
            {
                var container = new UnityContainer();

                container.RegisterType<IUnitOfWork, UnitOfWork>(new HierarchicalLifetimeManager(), new InjectionConstructor("Mvc5IdentityExample"));
                container.RegisterType<IUserStore<IdentityUser, Guid>, UserStore>(new TransientLifetimeManager());
                container.RegisterType<RoleStore>(new TransientLifetimeManager());
                
                DependencyResolver.SetResolver(new UnityDependencyResolver(container));
            }
        }
    }

Then, just add the following line to the `Application_Start` method in `Global.asax.cs` (right after the `BundleConfig` is fine):
    
    UnityConfig.RegisterComponents();

### Web.Config

The last thing we need to do is change our `web.config` so that it uses the connection string for the `Mvc5IdentityExample` database. Replace this line:

    <add name="DefaultConnection" connectionString="Data Source=(LocalDb)\v11.0;AttachDbFilename=|DataDirectory|\aspnet-Mvc5IdentityExample.Web-20150128011936.mdf;Initial Catalog=aspnet-Mvc5IdentityExample.Web-20150128011936;Integrated Security=True" providerName="System.Data.SqlClient" />

with this line:

    <add name="Mvc5IdentityExample" connectionString="Server=(local);Database=Mvc5IdentityExample;User Id=Mvc5IdentityExampleUser;Password=Password123" providerName="System.Data.SqlClient" />    

### And Awaaaaaay We Go!

And now, if we’ve done everything right, we should be able to run it, and it should let you do everything that the out-of-the-box Entity Framework ASP.NET Identity would. Go ahead, register. Log in, change your password, etc. I’ll wait.

If it worked right away, good for you. If not, well I understand that following along with tutorials has its difficulties. That’s why all my source code for this series of posts is available at on my GitHub: [https://github.com/timschreiber/Mvc5IdentityExample][6]

### Putting It All Together

So here’s what we’ve accomplished throughout this series of posts:

1. I’ve shown you how the out-of-the-box Entity Framework implementation of ASP.NET Identity forces you into some bad practices and anti-patterns and presented a plan to do it the “right” way with good design principles, true persistence-ignorance, and some important design patterns including: the Repository pattern (with generic Repositories), the Unit of Work pattern, Dependency Injection.
2. Together, we set up the Visual Studio solution and coded the Domain Layer, including: the Entities, the Repository interfaces, and the Unit of Work interface.
3. We coded an Entity Framework/SQL Server Data Layer that implements the Repository and Unit of Work interfaces we defined in the Domain Layer.
4. We added the required ASP.NET Identity classes to our MVC5 project, hooked them in to the `AccountController`, wired them together with Unity, and did some configuration until we had a working MVC5 web application with all the functionality it would have had if we’d used the default Entity Framework crap.

I hope that, as you’ve taken this journey with me, you8’ve gained a deeper understanding of how ASP.NET Identity works and an appreciation for some of the principles and design patterns we’ve used.

### What's Next?

Technically, we’re not *quite* done yet. I still have to prove this design is truly persistence-ignorant. In a future bonus part, I’ll show you how to write a new Data Layer using NHibernate instead of Entity Framework, and how easy it will be to plug in.

Until then, happy coding!


[1]: http://www.asp.net/identity
[2]: /2015/01/14/persistence-ignorant-asp-net-identity-with-patterns-part-1/
[3]: /2015/01/25/persistence-ignorant-asp-net-identity-with-patterns-part-2/
[4]: /2015/01/26/persistence-ignorant-asp-net-identity-with-patterns-part-3/
[5]: http://www.asp.net/identity/overview/extensibility/overview-of-custom-storage-providers-for-aspnet-identity#architecture
[6]: https://github.com/timschreiber/Mvc5IdentityExample
