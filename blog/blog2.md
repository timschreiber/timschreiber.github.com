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



<div id="pinstrap-container" class="row">
	{% for post in site.posts %}
		<div class="pinstrap-item">
			<div class="panel panel-default">
				<div class="panel-body">
					{{% if post.image != "" %}}
						<img src="/img/{{post.image}}" class="img-rounded" style="max-width:100%" />
					{{% endif %}}
					<h3><a href="{{post.url}}">{{post.title}}</a></h3>
					{{% if post.description != "" %}}
						<p>{{post.description}}</p>
					{{% endif %}}
				</div>
			</div>
		</div>
	{% endfor %}
</div>

