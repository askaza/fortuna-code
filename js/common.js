$(document).ready(function(){

   /* $( ".accordion" ).accordion({
		header: '.content-head',
		heightStyle: 'content'
	}); */

    $(".gallery .img-list a").fancybox({
	prevEffect	: 'none',
	nextEffect	: 'none',
	padding		: 0,
	arrows		:'true',
	

	helpers	: {
	    title	: {
		type: 'over'
	    },
	    thumbs	: {
		width	: 96,
		height	: 96
	    }
	}
    });
	
	$('.gallery .img-list').each(function() {
		var elCount = $('.img-list__item',this).size();
		if (elCount > 3) {			
			$(this).parents('.gallery').mCustomScrollbar({
				mouseWheel:true,
				scrollButtons:{
					enable:true
				}});
			}
	});

function sliderSize() {
	var windowSize = $(window).width();
	var slideWidth = windowSize*0.38;
	var slideHeight = windowSize*0.1;
	var slideTop = windowSize*0.42;
	var FontSize = Math.ceil(windowSize*0.018);

	if (windowSize <= 1024) {
		$('.slider_news, .slide-content').width(385);
		$('.slider_news, .slide-content').height(160);
		$('.slider_news').top(430);
		$('.slider_news .slides-list__item').width(385).height(160);
	} else {
		$('.slider_news, .slider_news .slides-list__item, .slide-content').width(slideWidth);
		$('.slider_news, .slider_news .slides-list__item, .slide-content').height(slideHeight);
		$('.slider_news').css('top',slideTop + 'px');
		$('.slider').css('font-size',FontSize + 'px');
	}
}

     sliderSize();

    $('#news-slider').slides({
	preload: true,
	generateNextPrev: false,
	generatePagination:false,
	effect:'fade',
	next: 'next-arrow',
	prev: 'prev-arrow'
    });

    $(window).resize(function() {
	sliderSize();

    });



});