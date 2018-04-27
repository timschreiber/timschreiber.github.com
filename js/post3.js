$(function(){
  $('article img').each(function(){
    if(!$(this).hasClass('img')) {
      $(this).addClass('img');
    }
    if(!$(this).hasClass('img-responsive')) {
      $(this).addClass('img-responsive');
    }
  });
});
