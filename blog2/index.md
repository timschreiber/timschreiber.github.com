---
layout : blog2
title : "Blog"
canonical : "http://timschreiber.com/blog2"
description : "Timothy P. Schreiber's personal blog, dealing primarily with software development, but also dabbling in songwriting, food, and gardening from time to time."
---

{% assign featuredPosts = site.posts | where_exp:"item", "item.featured > 0" %}
{% assign regularPosts = site.posts | where_exp:"item", "item.featured < 1" %}

<div class="row">
	<div class="col-xs-12 hidden-md hidden-lg">
		<div class="panel panel-default">
			<div class="panel-body" style="padding-bottom:5px;">
				<h3 class="text-center" style="margin-top:0;"><img src="/img/timothy-p-schreiber-2.jpg" class="img-circle" width="33.33333%"/><br/>Hi, I'm Tim.<br/><small>And I love to write code.</small></h3>
				<p><small>Seriously, I can't believe they pay me to do it. I started programming at age eight and sold my first program when I was 13. Nowadays, I work for <a href="http://www.egov.com/who-we-serve/partners/kentucky" target="_blank">NIC (Kentucky Interactive)</a> as a Senior Full-Stack Developer. <a href="/about">Read more...</a></small></p>
			</div>
		</div>
	</div>
	<div class="col-xs-12 col-md-8">
		<div class="row">
			<div class="col-xs-12">
				{% assign post1 = featuredPosts.first %}
				<div class="panel panel-default">
					{% if post1.image %}
						<a href="{{ post1.url }}"><img src="/img/{{ post1.image }}" class="img-rounded" style="max-width:100%;" /></a>
					{% endif %}
					<div class="panel-body">
						<h2 style="margin-top:0;"><a href="{{ post1.url }}">{{ post1.title }}</a></h2>
						<p style="margin-bottom:0;"><strong>{{ post1.date | date : "%d-%b-%Y" }}</strong> &mdash; {{ post1.description }} <a href="{{ post1.url }}" style="white-space:nowrap;">Read more...</a></p>
					</div>
					<div class="panel-heading" style="margin-top:0;border-top:1px solid rgb(224,224,224);">
					<h4 class="panel-title"><small><strong>Related</strong></small></h4>
					</div>
					<div class="panel-body">
						<div class="row hidden-xs hidden-sm">
						{% for post2 in featuredPosts limit:3 offset:1 %}
							<div class="col-xs-12 col-md-4">
								{% if post2.image %}
									<a href="{{ post2.url }}"><img src="/img/{{ post2.image }}" class="img-rounded" style="max-width:100%" /></a>
								{% endif %}
								<h4><a href="{{ post2.url }}">{{ post2.title }}</a></h4>
								<p><small><strong>{{ post2.date | date : "%d-%b-%Y" }}</strong> &mdash; {{ post2.description }} <a href="{{ post2.url }}" style="white-space:nowrap;">Read more...</a></small></p>
							</div>
						{% endfor %}
						</div>

						<ul class="media-list hidden-md hidden-lg" style="margin-bottom:0;">
							{% for post4 in featuredPosts limit:3 offset:1 %}
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
		<div class="panel panel-default hidden-xs hidden-sm">
			<div class="panel-body" style="padding-bottom:5px;">
				<h3 class="text-center" style="margin-top:0;"><img src="/img/timothy-p-schreiber-2.jpg" class="img-circle" width="33.33333%"/><br/>Hi, I'm Tim.<br/><small>And I love to write code.</small></h3>
				<p><small>Seriously, I can't believe they pay me to do it. I started programming at age eight and sold my first program when I was 13. Nowadays, I work for <a href="http://www.egov.com/who-we-serve/partners/kentucky" target="_blank">NIC (Kentucky Interactive)</a> as a Senior Full-Stack Developer. <a href="/about">Read more...</a></small></p>
			</div>
		</div>
		<div class="panel panel-default">
			<div class="panel-heading">
				<div class="clearfix">
					<div class="pull-left"><h4 class="panel-title" style="margin-top:2px">Recent Articles</h4></div>
					<div class="pull-right"><small><a href="/blog">View All</a></small></div>
				</div>
			</div>
			<div class="panel-body">
				<ul class="media-list" style="margin-bottom:0;">
					{% for post3 in regularPosts limit:4 %}
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
	</div>
</div>
