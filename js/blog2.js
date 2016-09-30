$(function(){
	pinstrap.init('#pinstrap-container');
	$(window).resize(function(){
		pinstrap.handleResize();
	});
	
	var tagsBtn = $("#btn-tags");
	var tagsBody = $("#tags-panel-body");
	tagsBtn.click(function(){
		if(tagsBody.is(":visible")) {
			tagsBody.slideUp();
			tagsBtn.find(".fa").removeClass("fa-chevron-up").addClass("fa-chevron-down");
		} else {
			tagsBody.slideDown();
			tagsBtn.find(".fa").removeClass("fa-chevron-down").addClass("fa-chevron-up");
		}
	});
	
	$(".blog-tag").click(function(e){
		e.preventDefault();
		var tag = $(this).attr("data-tag");
		$(".pinstrap-item").each(function(){
			var pinstrapItem = $(this);
			pinstrapItem.find(".post-tag").each(function(){
				if($(this).attr("data-tag") == tag) {
					pinstrapItem.show();
				} else {
					pinstrapItem.hide();
				}
			});
		});
		pinstrap.handleResize();
	});
	
	
});