---
layout : blog
title : "Blog"
---

<ol class="breadcrumb">
	<li><a href="/">Home</a></li>
	<li>Blog</li>
</ol>


<div class="col-xs-12 col-md-8 col-lg-9">
	<div class="post-list">
		{% for post in site.posts  limit:5 %}
			<div class="post-list-item">
				<h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
				<h6>{{ post.date | date : "%d-%b-%Y" }}</h6>
				
				{% if forloop.first and post.layout == "post" %}
					{{ post.content }}
				{% else %}
					<p>{{ post.description }}</p>
					<p><a href="{{ post.url }}">Read more &gt;</a></p>
				{% endif %}
			</div>
		{% endfor %}
	</div>
	<div id="all-posts" class="well text-center">
		<a href="archive.html">All Posts</a>
	</div>
</div>

<div class="col-xs-12 col-md-4 col-lg-3">
	<div id="older-posts" class="panel panel-default">
		<div class="panel-heading clearfix">
			<h3 class="pull-left panel-title">Older Posts</h3>
			<h6 class="pull-right panel-title"><a href="/archive.html">See All</a></h6>
		</div>
		<div class="panel-body">
			<dl>
			{% for post in site.posts offset:5 %}
				<dt>{{ post.date | date : "%d-%b-%Y"  }}</dt>
				<dd><a class="postlink" href="{{ post.url }}">{{ post.title }}</a></dd>
			{% endfor %}
			</dl>
		</div>
	</div>
	
	<div class="panel panel-default">
		<div class="panel-heading">
			<h3 class="panel-title">Meta</h3>
		</div>
		<div class="panel-body">
			<dl>
				<dt>Feed</dt>
				<dd><a href="rss.xml">RSS</a> | <a href="atom.xml">Atom</a></dd>
			</dl>
		</div>
	</div>
</div>
