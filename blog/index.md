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
				<article>
					{% if forloop.first and post.layout == "post" %}
						<h1><a href="{{ post.url }}">{{ post.title }}</a></h1>
						<h5><strong>{{ post.date | date : "%d-%b-%Y" }}</strong> &nbsp;|&nbsp;
							{% for tag in post.tags %}
								<a href="/blog/tags/#{{ tag }}" class="badge alert-info">{{ tag }}</a>
							{% endfor %}
						</h5>
						{{ post.content }}
						{% if post.comments == true %}
							<p><a href="{{ post.url }}">Comments &gt;</a></p>
						{% endif %}
					{% else %}
						<h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
						<h5><strong>{{ post.date | date : "%d-%b-%Y" }}</strong> &nbsp;|&nbsp;
							{% for tag in post.tags %}
								<a href="/blog/tags/#{{ tag }}" class="badge alert-info">{{ tag }}</a>
							{% endfor %}
						</h5>
						<p>{{ post.description }}</p>
						<p><a href="{{ post.url }}">Read more &gt;</a></p>
					{% endif %}
				</article>
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
			<h6 class="pull-right panel-title"><a href="/blog/archive/">See All</a></h6>
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
			<h3 class="panel-title">Tags</h3>
		</div>
		<div class="panel-body">
			{% capture tags %}
				{% for tag in site.tags %}
					{{ tag[0] }}
				{% endfor %}
			{% endcapture %}
			{% assign sortedtags = tags | split:' ' | sort %}
			{% for tag in sortedtags %}
				<a href="/blog/tags/#{{ tag }}" class="badge alert-info">{{ tag }}</a>
			{% endfor %}
		</div>
	</div>
	
	<div class="panel panel-default">
		<div class="panel-heading">
			<h3 class="panel-title">Meta</h3>
		</div>
		<div class="panel-body">
			<dl>
				<dt>Feed</dt>
				<dd><a href="/blog/rss.xml">RSS</a> | <a href="/blog/atom.xml">Atom</a></dd>
			</dl>
		</div>
	</div>
</div>

