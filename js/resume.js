$(function () {
    $("#res-nav").affix({ offset: { top: 90, bottom: 0 } });

    var scroll_offset = 60;
    $("body").scrollspy({
        target: "#res-nav",
        offset: scroll_offset
    });

    $("#res-nav-list li a").click(function (e) {
        e.preventDefault();
        var scroll_pos = $($(this).attr("href")).offset().top - (scroll_offset - 1);
        $("body,html").animate({
            scrollTop: scroll_pos
        }, 500);
    });
});