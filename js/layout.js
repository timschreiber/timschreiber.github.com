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
		var el = $("div#" + tag + ".tag-list-item");
		var others = el.siblings("div.tag-list-item");
		el.show();
		others.hide();
	}
}
