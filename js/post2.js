$(function(){
	$(window).on('scroll', handleScroll);
	
	$('#btnContinueReading').on('click', function(){
		scrollTo('article');
	});
	
	handleScroll();
});

function handleScroll() {
	var top = $('nav.navbar').height() - $(window).scrollTop() / 2;
	$('div.post-heading').css('top', top + 'px');
}
