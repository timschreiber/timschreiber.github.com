$(function(){
	$("#btnSubmit").click(function(){
		$.ajax({
			url: "http://timschreiber.azurewebsites.net/api/contact",
			type: "POST",
			dataType: "json",
			jsonp: false,
			data: {
				sender: $("#Sender").val(),
				subject: $("#Subject").val(),
				message: $("#Message").val(),
				copySender: $("#CopySender").is(":checked"),
				reCaptchaResponse: $("#g-recaptcha-response")
			}
		}).done(function(data){
			console.log(data);
		}).fail(function(data){
			console.log(data);
		});
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
