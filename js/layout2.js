$(function(){
	$('[data-toggle="tooltip"]').tooltip();
});

function scrollTo(selector) {
	$('html, body').animate({
		scrollTop: $(selector).offset().top - $('nav.navbar').height()
	}, 500, 'swing');
}
