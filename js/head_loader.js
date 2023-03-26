$(function(){
  $("#header").load("header.html", function(){
    $(this).css('opacity',0).stop().animate({"opacity": 1}); });
});