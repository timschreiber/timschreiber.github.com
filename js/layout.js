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
		$("#div.tag-list-item").hide();
	
		var tag = url.substring(idx + 1);
		console.log(tag);
		var sel = "div.tag-list-item[id='" + tag + "']";
		console.log(sel);
		var el = $(sel);
		console.log(el);
		el.show();
	}
}
