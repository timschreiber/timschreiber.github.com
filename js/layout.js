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
			$("#btnSubmit span.fa").removeClass("fa-paper-plane").addClass("fa-spinner").addClass("fa-pulse");
			$("#btnSubmit").prop("disabled", true);
			var data = {
				sender: $("#sender").val(),
				subject: $("#subject").val(),
				message: $("#message").val(),
				copySender: $("#copySender").is(":checked"),
				reCaptchaResponse: $("#g-recaptcha-response").val() + "foo"
			};
			console.log(data);
			$.ajax({
				url: "http://timschreiber.azurewebsites.net/api/contact",
				type: "POST",
				dataType: "json",
				jsonp: false,
				data: data
			}).done(function(data){
				console.log("WIN");
				console.log(data);
				$("#contactModalLabel").html("Message Sent");
				$("#formFields").hide();
				$("#formConfirmation").show();
				$("#btnSubmit").hide();
			}).fail(function(data){
				console.log("FAIL");
				console.log(data);
				if(data.status == 400) {
					var response = data.responseJSON;
					if(response.message) {
						alert(response.message);
					} else if(response.model && response.model.ReCaptchaResponse) {
						alert(response.model.ReCaptchaResponse.errors[0].errorMessage);
					} else {
						alert("The form could not be submitted. Please make sure all required form fields have valid data.");
					}
				} else {
					alert("The form could not be submitted. The server encountered an unexpected error.");
				}
				$("#btnSubmit span.fa").removeClass("fa-spinner").removeClass("fa-pulse").addClass("fa-paper-plane");
				$("#btnSubmit").prop("disabled", false);
			}).always(function(){
				grecaptcha.reset();
			});
		}
	});
	
	$("a[href^='http://'], a[href^='https://']").attr("target", "_blank");
	handleTag();
});

function showContactModal() {
	$("#contactModalLabel").html("Contact Form");
	$("#formFields").show();
	$("#formConfirmation").hide();
	$("#btnSubmit span.fa").removeClass("fa-spinner").removeClass("fa-pulse").addClass("fa-paper-plane");
	$("#btnSubmit").prop("disabled", false).show();
	$("#sender").val("");
	$("#subject").val("");
	$("#message").val("");
	$("#copySender").prop("checked", false);
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
