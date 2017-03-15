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
						<p>{{ post1.description }} <a href="{{ post1.url }}" style="white-space:no-wrap;">Read more...</a></p>
					</div>
				</div>
			</div>
			{% for post2 in site.posts limit:3 offset:1 %}
				<div class="col-xs-12 col-md-4">
					{% if post2.image %}
						<a href="{{ post2.url }}"><img src="/img/{{ post2.image }}" class="img-rounded" style="max-width:100%" /></a>
					{% endif %}
					<h4><a href="{{ post2.url }}">{{ post2.title }}</a></h4>
					<p><small>{{ post2.description }} <a href="{{ post2.url }}" style="white-space:no-wrap;">Read more...</a></small></p>
				</div>
			{% endfor %}
		</div>
	</div>
	<div class="col-xs-12 col-md-4">
		<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
		<!-- tsc-blog -->
		<ins class="adsbygoogle"
		     style="display:block"
		     data-ad-client="ca-pub-5400005152506663"
		     data-ad-slot="3867421392"
		     data-ad-format="auto"></ins>
		<script>
			(adsbygoogle = window.adsbygoogle || []).push({});
		</script>
		<ul class="media-list">
			{% for post3 in site.posts offset:4 %}
				<li class="media">
					<div class="media-left">
						<div style="height:64px;width:64px;background-image:url(/img/{{ post3.image }});background-size:cover;background-position:50% 50%;"</div>
					</div>
					<div class="media-body">
						<h4 class="media-heading"><a href="{{ post3.url }}">{{ post3.title }}</a></h4>
						{{ post3.description }}
					</div>
				</li>
			{% endfor %}
		</ul>
	</div>
</div>
