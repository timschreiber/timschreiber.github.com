$(function(){
	$("#contactForm").submit(function(event){
		alert($("#contactForm").attr["action"] + "\n" + $("#contactForm").attr["method"]);
		event.preventDefault();
	});
	
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
		var el = $("div#" + tag + ".tag-list-item").show();
		el.siblings("div.tag-list-item").hide();
	}
}
