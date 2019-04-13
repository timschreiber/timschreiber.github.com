---
layout : blog2
title : "Blog"
canonical : "{{ page.url }}"
description : "Timothy P. Schreiber's personal blog, dealing primarily with software development, but also dabbling in songwriting, food, and gardening from time to time."
active : work
---
<ol class="breadcrumb">
	<li><a href="/"><span class="fa fa-home"></span><span class="sr-only">Home</span></a></li>
	<li class="active">Blog</li>
</ol>

<div class="row">
	<div class="col-xs-12">
		<div class="page-header">
			<h1>Blog</h1>
		</div>
	</div>
	<div class="col-xs-12 col-md-8">
		<div id="posts-tag-heading" style="display:none;">
			<h3 class="pull-left">Tag: <span id="tag-name" style="font-weight:bold"></span></h3>
			<h3 class="pull-right"><small><a id="btn-show-all" href="#">Show All Posts</a></small></h3>
		</div>
		<div class="media-list">
			{% for post in site.posts | sort: date | reverse %}
				{% unless post.categories != empty %}
					<div class="media">
						<div class="media-left">
							<a href="{{ post.url }}"><img class="media-object post-thumbnail" src="/img/{{ post.thumbnail }}" alt="{{ post.title }}" /></a>
						</div>
						<div class="media-body">
							<h4 class="media-heading"><a href="{{ post.url }}">{{ post.title }}</a></h4>
							<h6><strong>{{ post.date | date : "%d-%b-%Y" }}</strong></h6>
							{% if post.description != "" %}
								<p>{{ post.description }}</p>
							{% else %}
								<p>{{ post.excerpt }}</p>
							{% endif %}
							<p><a href="{{ post.url }}" class="read-more-link">Read More +</a></p>
						</div>
					</div>
				{% endunless %}
			{% endfor %}
		</div>
	</div>
	<div class="col-xs-12 col-md-4">
		{% include google_ads.html %}
		{% include blog_archive.html %}
		{% include blog_subscribe.html %}
	</div>
</div>
