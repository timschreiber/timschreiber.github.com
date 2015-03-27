---
layout : layout
title : "Senior .NET Developer/Architect - Lexington, KY - C#, ASP.NET MVC, WCF, Entity Framework, SQL Server, Agile, Object-Oriented Design, SOLID, Design Patterns"
canonical : "http://timschreiber.com/"
description : "Timothy P. Schreiber (call me Tim) is a Senior .NET Developer/Architect in the Lexington, KY area. Enterprise applications, websites, open source - you name it. C#, ASP.NET MVC, WCF, Entity Framework, SQL Server, Agile, Object-Oriented Design, SOLID, Design Patterns."
---

<div id="home-jumbotron" class="jumbotron">
	<div class="container">
		<div class="col-xs-12 col-md-6 col-md-push-6 jumbotron-column text-center">
			<img id="profile-picture" src="/img/timothy-p-schreiber-2.jpg" alt="Timothy P. Schreiber" class="img-circle"/>
		</div>
		<div class="col-xs-12 col-md-6 col-md-pull-6 jumbotron-column text-center">
			<h1>Hi, I'm Tim.</h1>
			<h2>And I write code.</h2>
			<h4>Enterprise applications, websites, open source &ndash; you name it. I like to help others write code, and sometimes I write about writing code. I'm a husband, father, backyard pitmaster, amateur songwriter, and novice gardener. Oh, and I have a cat.</h4>
			<a href="/contact/" class="btn btn-lg btn-info">Hey, what's this button do?</a>
		</div>
	</div>
</div>

<div id="home-features-wrapper">
	<div class="container">
		<div class="col-xs-12 col-md-4">
			<div class="panel panel-default home-feature-panel">
				<div class="panel-body">
					<h3>My Work</h3>
					<h4>Day Job</h4>
					<p>I work for a talent/staffing organization in a team lead capacity specializing in process improvement and technical direction.</p>
					
					<h4>Side Projects</h4>
					<p>TinnitusWave &ndash; Audio-based therapy for tinnitus sufferers.</p>
					<h4>Open Source</h4>
					<p><a href="http://timschreiber.github.io/Mau/">Mau</a> &ndash; A micro-ORM for .NET designed with patterns in mind.</p>
				</div>
			</div>
		</div>
		
		<div class="col-xs-12 col-md-4">
			<div class="panel panel-default home-feature-panel">
				<div class="panel-body">
					<h3>Recent Posts</h3>
					<dl>
						{% for post in site.posts limit:5 %}
							<dt>{{ post.date | date : "%d-%b-%Y"  }}</dt>
							<dd><a class="postlink" href="{{ post.url }}">{{ post.title }}</a></dd>
						{% endfor %}
					</dl>
				</div>
			</div>
		</div>
		<div class="col-xs-12 col-md-4">
			<div class="panel panel-default home-feature-panel">
				<div class="panel-body">
					<h3>Connect with Me</h3>
					<h4 class="connect"><a href="/contact/"><span class="fa fa-paper-plane-o fa-2x"></span> Contact Form</a>
					<h4 class="connect"><a href="https://twitter.com/tim_schreiber"><span class="fa fa-twitter fa-2x"></span> @tim_schreiber</a></h4>
					<h4 class="connect"><a href="https://www.linkedin.com/profile/view?id=12496208"><span class="fa fa-linkedin fa-2x"></span> Linked In</a></h4>
					<h4 class="connect"><a href="http://stackoverflow.com/users/913261/tim-s"><span class="fa fa-stack-overflow fa-2x"></span> StackOverflow</a> <small>(<a href="2013/10/30/beware-the-stackoverlords/">not used much</a>)</small></h4>
					<h4 class="connect"><a href="https://github.com/timschreiber"><span class="fa fa-github fa-2x"></span> GitHub</a></h4>
				</div>
			</div>
		</div>
	</div>
</div>
