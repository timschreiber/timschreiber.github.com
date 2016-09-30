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

<div class="row" style="margin-bottom:20px;">
	<div class="col-lg-3 col-lg-push-9 col-md-4 col-md-push-8 col-sm-6 col-sm-push-6 col-xs-12">
		<div class="panel panel-default">
			<div class="panel-body">
				<h3 style="margin-top:0;">Tags</h3>
				<h4 style="line-height:175%;">
					{% capture tags %}
						{% for tag in site.tags %}
							{{ tag[0] }}
						{% endfor %}
					{% endcapture %}
					{% assign sortedtags = tags | split:' ' | sort %}
					{% for tag in sortedtags %}
						<a href="/blog/tags/#{{ tag }}" class="badge alert-info" style="font-size:18px;">{{ tag }}</a>
					{% endfor %}
				</h4>
			</div>
		</div>
	</div>
	<div class="col-lg-9 col-lg-pull-3 col-md-8 col-md-pull-4 col-sm-6 col-sm-pull-6 col-xs-12">
		{% for post in site.posts limit:1 %}
			{% if post.image %}
				<div style="height:300px;background-size:cover;background-repeat:no-repeat;background-position:50% 50%;background-image:url(/img/{{post.image}});"></div>
			{% endif %}
			<h2><a href="{{post.url}}">{{post.title}}</a></h2>
			<h5><strong>{{ post.date | date : "%d-%b-%Y" }}</strong> &nbsp;|&nbsp;
				{% for tag in post.tags %}
					<a href="/blog/tags/#{{ tag }}" class="badge alert-info">{{ tag }}</a>
				{% endfor %}						
			</h5>
			{% if post.description != "" %}
				<p>{{post.description}}</p>
			{% endif %}
		{% endfor %}
	</div>
</div>



<div id="pinstrap-container" class="row">
	{% for post in site.posts | sort: date | reverse %}
		{% if forloop.first == false %}
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
		{% endif %}
	{% endfor %}
</div>
