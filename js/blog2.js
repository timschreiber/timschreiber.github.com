$(function(){
	pinstrap.init('#pinstrap-container');
	$(window).resize(function(){
		pinstrap.handleResize();
	});
	
	$("#btnTags").click(function(){
		var tagsBtn = $("#btnTags");
		var tagsBody = $("#tags-panel-body");
		if(tagsBody).is(":visible") {
			tagsBody.slideUp();
			tagsBtn.find(".fa").removeClass("fa-chevron-up").addClass("fa-chevron.down");
		} else {
			tagsBody.slideDown();
			tagsBtn.find(".fa").removeClass("fa-chevron-down").addClass("fa-chevron.up");
		}
	});
	
	
});