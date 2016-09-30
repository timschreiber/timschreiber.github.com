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
		$("#tag-name").html(tag);
		$("#posts-tag-heading").show();
		$(".pinstrap-item").hide().each(function(){
			var pinstrapItem = $(this);
			pinstrapItem.find(".post-tag").each(function(){
				if($(this).attr("data-tag") == tag) {
					pinstrapItem.show();
				}
			});
		});
		pinstrap.handleResize();
	});
	
	$("#btn-show-all").click(function(e){
		e.preventDefault();
		$(".pinstrap-item").show();
		pinstrap.handleResize();
	});
	
});