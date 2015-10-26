$(function(){
	$("#btnSubmit").click(function(){
		$("#Sender").validate();
		$("#Subject").validate();
		$("#Message").validate();
		
		var valid = true;
		if(!$("#Sender").valid()) {
			$("#errMsgs > ul").append("<li>Your email address is missing or invalid.</li>");
			valid = false;
		}
		if(!$("#Subject").valid()) {
			$("#errMsgs > ul").append("<li>Subject is required.</li>");
			valid = false;
		}
		if(!$("#Message").valid()) {
			$("#errMsgs > ul").append("<li>Message is required.</li>");
			valid = false;
		}

		if(valid == true) {
			var data = {
				sender: $("#Sender").val(),
				subject: $("#Subject").val(),
				message: $("#Message").val(),
				copySender: $("#CopySender").is(":checked"),
				reCaptchaResponse: $("#g-recaptcha-response").val()
			};
			$.ajax({
				url: "http://timschreiber.azurewebsites.net/api/contact",
				type: "POST",
				dataType: "json",
				jsonp: false,
				data: data
			}).done(function(data){
				console.log(data);
			}).fail(function(data){
				console.log(data);
			});
		}
	});
	
	$("a[href^='http://'], a[href^='https://']").attr("target", "_blank");
	handleTag();
});

function handleTag() {
	var url = document.URL;
	var idx = url.indexOf("#");
	if (idx > -1) {
		var tag = url.substring(idx + 1);
		var el = $("div#" + tag + ".tag-list-item").show();
		el.siblings("div.tag-list-item").hide();
	}
}
