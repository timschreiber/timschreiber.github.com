---
layout : blog2
title : "Blog"
canonical : "http://timschreiber.com/blog2"
description : "Timothy P. Schreiber's personal blog, dealing primarily with software development, but also dabbling in songwriting, food, and gardening from time to time."
---

<div class="row">
	<div class="col-xs-12 col-md-8">
		<div class="row">
			<div class="col-xs-12">
				{% assign post1 = site.posts.first %}
				<div class="panel panel-default">
					{% if post1.image %}
						<a href="{{ post1.url }}"><img src="/img/{{ post1.image }}" class="img-rounded" style="max-width:100%" /></a>
					{% endif %}
					<div class="panel-body">
						<h2><a href="{{ post1.url }}">{{ post1.title }}</a></h2>
						{% if post1.description != "" %}
							<p>{{ post1.description }}</p>
						{% endif %}
					</div>
				</div>
			</div>
			{% for post2 in site.posts limit:3 offset:1 %}
				<div class="col-xs-12 col-md-4">
					{% if post2.image %}
						<a href="{{ post2.url }}"><img src="/img/{{ post2.image }}" class="img-rounded" style="max-width:100%" /></a>
					{% endif %}
						<h4><a href="{{ post2.url }}">{{ post2.title }}</a></h4>
						{% if post2.description != "" %}
						<p><small>{{ post2.description }}</small></p>
					{% endif %}
				</div>
			{% endfor %}
		</div>
	</div>
	<div class="col-xs-12 col-md-4">
		<ul>
			{% for post3 in site.posts offset:4 %}
				<li><a href="{{ post3.url }}">{{ post3.title }}</a></li>
			{% endfor %}
		</ul>
	</div>
</div>
