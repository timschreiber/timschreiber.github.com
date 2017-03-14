---
layout : blog2
title : "Blog"
canonical : "http://timschreiber.com/blog2"
description : "Timothy P. Schreiber's personal blog, dealing primarily with software development, but also dabbling in songwriting, food, and gardening from time to time."
---

<ol class="breadcrumb">
	<li><a href="/">Home</a></li>
	<li>Blog</li>
</ol>

<div class="row">
	<div class="col-xs-12 col-md-8">
		<div class="row">
			<div class="col-xs-12">
				{% assign post1 = site.posts.first %}
				{% if post1.image %}
					<img src="/img/{{ post1.image }}" class="img-rounded" style="max-width:100%" />
				{% endif %}
				<h1><a href="{{ post1.url }}">{{ post1.title }}</a></h1>
				{% if post1.description != "" %}
					<p>{{ post1.description }}</p>
				{% endif %}
			</div>
			{% for post2 in site.posts limit:3 offset:1 %}
				<div class="col-xs-6 col-md-4">
					{% if post2.image %}
						<img src="/img/{{ post2.image }}" class="img-rounded" style="max-width:100%" />
					{% endif %}
					<h3><a href="{{ post2.url }}">{{ post2.title }}</a></h3>
					{% if post2.description != "" %}
						<p>{{ post2.description }}</p>
					{% endif %}
				</div>
			{% end for %}
		</div>
	</div>
</div>
