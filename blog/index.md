---
layout : blog2
title : "Blog"
canonical : "http://timschreiber.com/blog/blog2"
description : "Timothy P. Schreiber's personal blog, dealing primarily with software development, but also dabbling in songwriting, food, and gardening from time to time."
---

<ol class="breadcrumb">
	<li><a href="/">Home</a></li>
	<li>Blog</li>
</ol>

<div class="row">
	<div class="col-xs-12">
		<div class="panel panel-default">
			<div class="panel-body">
				<h3 style="margin-top:0;">Tags</h3>
				<h4 style="line-height:150%;">
					{% capture tags %}
						{% for tag in site.tags %}
							{{ tag[0] }}
						{% endfor %}
					{% endcapture %}
					{% assign sortedtags = tags | split:' ' | sort %}
					{% for tag in sortedtags %}
						<a href="/blog/tags/#{{ tag }}" class="badge alert-info" style="font-size:16px;" data-tag="{{ tag }}">{{ tag }}</a>
					{% endfor %}
				</h4>
			</div>
		</div>
	</div>
	<div id="pinstrap-container">
		{% for post in site.posts | sort: date | reverse %}
			<div class="pinstrap-item">
				<div class="panel panel-default">
					<div class="panel-body">
						{% if post.image %}
							<img src="/img/{{post.image}}" class="img-rounded" style="max-width:100%" />
							<h3><a href="{{post.url}}">{{post.title}}</a></h3>
						{% else %}
							<h3 class="top0"><a href="{{post.url}}">{{post.title}}</a></h3>
						{% endif %}
						
						<h6><strong>{{ post.date | date : "%d-%b-%Y" }}</strong> &nbsp;|&nbsp;
							{% for tag in post.tags %}
								<a href="/blog/tags/#{{ tag }}" class="badge alert-info">{{ tag }}</a>
							{% endfor %}						
						</h6>
						
						{% if post.description != "" %}
							<p>{{post.description}}</p>
						{% endif %}
					</div>
				</div>
			</div>
		{% endfor %}
	</div>
</div>
