$(function(){
	var validator = $("#contactForm").validate({
		rules: {
			sender: {
				required: true,
				email: true
			},
			subject: {
				required: true
			},
			message: {
				required: true
			}
		},
		messages: {
			sender: {
				required: "Your email address is required.",
				email: "Your email address is invalid."
			},
			subject: "Subject is required.",
			message: "Message is required."
		},
		highlight: function(element) {
			$(element).closest(".form-group").addClass("has-error");
		},
		unhighlight: function(element) {
			$(element).closest(".form-group").removeClass("has-error");
		},
		errorClass: "text-danger pull-right",
		errorPlacement: function(error, element) {
			error.insertBefore(element);
		},
		submitHandler: function(form) {
			$("#btnSubmit span.fa.fa-paper-plane").removeClass("fa-paper-plane").addClass("fa-spinner").addClass("fa-pulse").prop("disabled", true);
			var data = {
				sender: $("#Sender").val(),
				subject: $("#Subject").val(),
				message: $("#Message").val(),
				copySender: $("#CopySender").is(":checked"),
				reCaptchaResponse: $("#g-recaptcha-response").val()
			};
			console.log(data);
			$.ajax({
				url: "http://timschreiber.azurewebsites.net/api/contact",
				type: "POST",
				dataType: "json",
				jsonp: false,
				data: data
			}).done(function(data){
				console.log(data);
				$("#contactModalLabel").html("Message Sent");
				$("#formFields").hide();
				$("#formConfirmation").show();
				$("#btnSubmit").hide();
			}).fail(function(data){
				console.log(data);
			});
		}
	});
	
	// $("#btnSubmit").click(function(){
		// var valid = true;
		// if(!$("#Sender").valid()) {
			// $("#errMsgs > ul").append("<li>Your email address is missing or invalid.</li>");
			// valid = false;
		// }
		// if(!$("#Subject").valid()) {
			// $("#errMsgs > ul").append("<li>Subject is required.</li>");
			// valid = false;
		// }
		// if(!$("#Message").valid()) {
			// $("#errMsgs > ul").append("<li>Message is required.</li>");
			// valid = false;
		// }

		// if(valid == true) {
		// }
	// });
	
	$("a[href^='http://'], a[href^='https://']").attr("target", "_blank");
	handleTag();
});

function showContactModal() {
	$("#contactModalLabel").html("Contact Form");
	$("#formFields").show();
	$("#formConfirmation").hide();
	$("#btnSubmit").removeClass("fa-spinner").removeClass("fa-pulse").addClass("fa-paper-plane").prop("disabled", false).show();
	$("#contactModal").modal("show");
}

function handleTag() {
	var url = document.URL;
	var idx = url.indexOf("#");
	if (idx > -1) {
		var tag = url.substring(idx + 1);
		var el = $("div#" + tag + ".tag-list-item").show();
		el.siblings("div.tag-list-item").hide();
	}
}
