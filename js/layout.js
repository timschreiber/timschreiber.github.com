$(function(){
	$("a[href^='http://'], a[href^='https://']").attr("target", "_blank");
	handleTag();
});

function handleTag() {
	var url = document.URL;
	console.log(url);
	var idx = url.indexOf("#");
	console.log(idx);
	if (idx > -1) {
		var tag = url.substring(idx + 1);
		console.log(tag);
		var el = $("div#" + tag + ".tag-list-item");
		console.log(el);
		var others = el.siblings("div.tag-list-item");
		console.log(others);
		el.show();
		others.hide();
	}
}
