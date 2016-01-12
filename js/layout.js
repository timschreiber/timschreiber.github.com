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
				console.log("WIN");
				console.log(data);
				$("#contactErrMsgs ul").children("li").remove();
				$("#contactErrMsgs").hide();
				$("#contactModalLabel").html("Message Sent");
				$("#formFields").hide();
				$("#formConfirmation").show();
				$("#btnSubmit").hide();
			}).fail(function(data){
				console.log("FAIL");
				console.log(data);
				if(data.status == 400) {
					var response = data.responseJSON;
					console.log(response);
					$("#contactErrMsgs ul").children("li").remove();
					if(response.message) {
						$("#contactErrMsgs ul").append("<li>" + response.message + "</li>")
					} else if(response["model.ReCaptchaResponse"] && response["model.ReCaptchaResponse"].errors && response["model.ReCaptchaResponse"].errors.length > 0 && response["model.ReCaptchaResponse"].errors[0].errorMessage) {
						$("#contactErrMsgs ul").append("<li>" + response["model.ReCaptchaResponse"].errors[0].errorMessage + "</li>");
					} else {
						$("#contactErrMsgs ul").append("<li>The email could not be sent because the form fields are invalid.</li>");
					}
					$("#contactErrMsgs").show();
				} else {
					$("#contactErrMsgs ul").append("<li>Your message could not be sent because the server encountered an unexpected error.</li>");
					$("#contactErrMsgs").show();
				}
				$("#btnSubmit span.fa").removeClass("fa-spinner").removeClass("fa-pulse").addClass("fa-paper-plane");
				$("#btnSubmit").prop("disabled", false);
			}).always(function(){
				grecaptcha.reset();
			});
		}
	});
	
	handleContactUrl();
	$("a[href^='http://'], a[href^='https://']").attr("target", "_blank");
	handleTag();
	
    // Powerball
    $("#btnPbGenerate").click(function(){
        var url = "http://timschreiber.azurewebsites.net/api/powerball/" + $("#selPbPlays").val();
        $.get(url, function(data){
            $("#pbResults").empty();
            for(i = 0; i < data.plays; i++)
            {
                var r = $("<div class=\"row\" style=\"margin-top:5px;margin-bottom:5px;\"></div>");
                for(j = 0; j < data.data[i].white.length; j++) {
                    r.append("<div class=\"col-xs-2 text-center\"><div class=\"text-circle white\">" + data.data[i].white[j] + "</div></div>")
                }
                r.append("<div class=\"col-xs-2 text-danger text-center\"><div class=\"text-circle power\">" + data.data[i].power + "</div></div>");
                $("#pbResults").append(r);
            }
        });
    });
});

function showContactModal() {
	$("#contactErrMsgs ul").children("li").remove();
	$("#contactErrMsgs").hide();
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

function handleContactUrl() {
	var urlVars = getUrlVars();
	if(urlVars && urlVars.contact)
	{
		showContactModal();
	}
}

function getUrlVars() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split("=");
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
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
