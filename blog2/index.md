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
						<h2 style="margin-top:0;"><a href="{{ post1.url }}">{{ post1.title }}</a></h2>
						<p><strong>{{ post1.date | date : "%d-%b-%Y" }}</strong> &mdash; {{ post1.description }} <a href="{{ post1.url }}" style="white-space:nowrap;">Read more...</a></p>
						<div class="row hidden-xs hidden-sm" style="margin-top:30px;">
						{% for post2 in site.posts limit:3 offset:1 %}
							<div class="col-xs-12 col-md-4">
								{% if post2.image %}
									<a href="{{ post2.url }}"><img src="/img/{{ post2.image }}" class="img-rounded" style="max-width:100%" /></a>
								{% endif %}
								<h4><a href="{{ post2.url }}">{{ post2.title }}</a></h4>
								<p><small><strong>{{ post2.date | date : "%d-%b-%Y" }}</strong> &mdash; {{ post2.description }} <a href="{{ post2.url }}" style="white-space:nowrap;">Read more...</a></small></p>
							</div>
						{% endfor %}
						</div>

						<ul class="media-list hidden-md hidden-lg" style="margin-top:30px;">
							{% for post4 in site.posts limit:3 offset:1 %}
								<li class="media">
									<div class="media-left">
										{% if post4.image %}
											<div style="height:80px;width:80px;background-image:url(/img/{{ post4.image }});background-size:cover;background-position:50% 50%;"></div>
										{% else %}
											<div style="height:80px;width:80px;background-image:url(/img/post.jpg);background-size:cover;background-position:50% 50%;"></div>
										{% endif %}
									</div>
									<div class="media-body">
										<h4 class="media-heading"><a href="{{ post4.url }}">{{ post4.title }}</a></h4>
										<small><strong>{{ post4.date | date : "%d-%b-%Y" }}</strong> &mdash; {{ post4.description }} <a href="{{ post4.url }}" style="white-space:nowrap;">Read more...</a></small>
									</div>
								</li>
							{% endfor %}
						</ul>

					</div>
				</div>
			</div>
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
			{% for post3 in site.posts limit:5 offset:4 %}
				<li class="media">
					<div class="media-left">
						{% if post3.image %}
							<div style="height:80px;width:80px;background-image:url(/img/{{ post3.image }});background-size:cover;background-position:50% 50%;"></div>
						{% else %}
							<div style="height:80px;width:80px;background-image:url(/img/post.jpg);background-size:cover;background-position:50% 50%;"></div>
						{% endif %}
					</div>
					<div class="media-body">
						<h4 class="media-heading"><small><a href="{{ post3.url }}">{{ post3.title }}</a></small></h4>
						<small><strong>{{ post3.date | date : "%d-%b-%Y" }}</strong> &mdash; {{ post3.description }} <a href="{{ post3.url }}" style="white-space:nowrap;">Read more...</a></small>
					</div>
				</li>
			{% endfor %}
		</ul>
	</div>
</div>
