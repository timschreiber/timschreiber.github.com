---
layout: null
---
{% capture newline %}
{% endcapture %}
const searchData = [
{% for post in site.posts %}
    {% assign newArray = '' | split: '' %}
    {% assign words = post.content | strip_html | replace: newline, " " | replace: '"', " " | replace: "\", " " | replace: "…", " " | replace: ":", " " | replace: ";", " " | replace: ",", " " | replace: ".", " " | replace: "-", " " | replace: "“": " " | replace: "”", " " | replace: "?", " " | replace: "!", " " | replace: "’", "'" | replace: "_", " " | replace: "–", " " | replace: "/", " " | split: " " %}
    {% for word in words %}
        {% assign newItem = word | strip %}
        {% if newItem != '' and newItem != '-' %}
            {% assign newArray = newArray | push: newItem %}
        {% endif %}
    {% endfor %}
    {
        "title": "{{ post.title | escape }}",
        "url": "{{ site.baseurl }}{{ post.url }}",
        "content": "{{ newArray | join: " " }}",
        "date": "{{ post.date | date: "%a, %d %b %Y %H:%M:%S %z" }}"
    } {% unless forloop.last %},{% endunless %}
{% endfor %}
];
