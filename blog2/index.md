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
		</div>
	</div>
</div>
