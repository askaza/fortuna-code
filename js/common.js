$(document).ready(function(){

     $( ".accordion" ).accordion({
		header: '.content-head',
		heightStyle: 'content'
	});

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
		}
	    });
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

    $('#news-slider, #facts-slider').slides({
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

var sCurrentSectionSide = "center";
var sCurrentPosition = 0;
var sSlideDirection = "";
var imgList = [];
var iWindowWidth = 0;
var iWindowHeight = 0;
var bAnimating = false;
$.extend( {
    preload: function( imgArr, option ) {
	var setting = $.extend( {
	    init: function( loaded, loaded_percent, total ) {},
	    loaded: function( img, loaded, loaded_percent, total ) {},
	    loaded_all: function( loaded, loaded_percent, total ) {}
	}, option );
	var total = imgArr.length;
	var one_percent = total / 100;
	var loaded_percent = 0;
	var loaded = 0;
	setting.init( 0, 0, total );
	for( var i in imgArr ) {
	    imgList.push( $( "<img />" ).attr( "src", imgArr[i] ).load( function() {
		loaded++;
		loaded_percent = Math.ceil( 4 * ( loaded / one_percent ) );
		setting.loaded( this, loaded, loaded_percent, total );
		if( loaded == total ) {
		    setting.loaded_all( loaded, loaded_percent, total );
		}
	    } ) );
	}
    }
} );

$( document ).ready( function() {
    iWindowWidth = $( window ).width();
    iWindowHeight = $( window ).height();
    if( $( "#preload_images" ).size() ) {
	$.preload( imageList , {
	    init: function( loaded, loaded_percent, total ) {
		$( "#preload_marker" ).css( "width", loaded_percent + "px" );
	    },
	    loaded: function(img, loaded, loaded_percent, total) {
		$( "#preload_marker" ).css( "width", loaded_percent + "px" );
	    },
	    loaded_all: function( loaded, loaded_percent, total ) {
		$( "#bgslide" ).css( "width", iWindowWidth + "px" );
		$( "#bgslide" ).css( "height", iWindowHeight + "px" );
		$( ".slides" ).css( "width", iWindowWidth + "px" );
		$( ".slides" ).css( "height", iWindowHeight + "px" );
		$( ".slides:eq(0)" ).css( "background-image", "url(" + imageList[1] + ")" );
		//$( ".slides:eq(0)" ).css( "left", "-" + iWindowWidth + "px" );
		//$( ".slides:eq(2)" ).css( "left", iWindowWidth + "px" );
		$( "#preload_indicator" ).hide();
	    }
	} );
    }
} );

function showPage( sSection ) {
    if( bAnimating == false ) {
	$( "#content" ).animate( {
	    opacity: "0"
	}, 500 );
	var sNewBackground = "";
	var oSection = false;
	var oAdd = $( "<div class='bg1'></div>" );
	if( aSections.left[sSection] ) {
	    oSection = aSections.left[sSection];
	    if( sCurrentSectionSide != "left" ) {
		sSlideDirection = "right";
	    } else {
		if( sCurrentPosition < oSection.position ) {
		    sSlideDirection = "right";
		} else {
		    sSlideDirection = "left";
		}
	    }
	    sCurrentSectionSide = "left";
	    $( "#controls" ).animate( {
		left: "100px"
	    }, 1000 );
	    $( "#controls" ).addClass( "nav_left" );
	    $( "#controls" ).removeClass( "nav_right" );
	} else if( aSections.right[sSection] ) {
	    oSection = aSections.right[sSection];
	    if( sCurrentSectionSide != "right" ) {
		sSlideDirection = "left";
	    } else {
		if( sCurrentPosition > oSection.position ) {
		    sSlideDirection = "right";
		} else {
		    sSlideDirection = "left";
		}
	    }
	    sCurrentSectionSide = "right";
	    //            $( "#controls" ).animate( { left: ( iWindowWidth - $( "#controls" ).width() - 100 ) + "px" }, 1000 );
	    $( "#controls" ).addClass( "nav_right" );
	    $( "#controls" ).removeClass( "nav_left" );
	}
	sCurrentPosition = oSection.position;
	if( oSection ) {
	    if( $( "#" + sSection ).size() ) {
		$( "#" + sSection  ).css( "height", "0px" );
		$( "#" + sSection  ).css( "display", "" );
		$( ".submenu"  ).animate( {
		    height: "0px"
		}, 1000 );
		$( "#" + sSection  ).animate( {
		    height: "255px"
		}, 1000 );
	    }
	    $( "#bgslide" ).append( $( oAdd ) );
	    $( oAdd ).css( "background-image", "url(" + oSection.bg + ")" );
	    bAnimating = true;
	    var oCurrent = $( ".bg1:eq(0)" );
	    if( sSlideDirection == "left" ) {
		$( oAdd ).css( "left", iWindowWidth + "px" );
		$( oAdd ).animate( {
		    left: "0px"
		}, 1000 );
		$( oCurrent ).animate( {
		    left: "-" + iWindowWidth + "px"
		}, 1000 );
	    } else {
		$( oAdd ).css( "left", "-" + iWindowWidth + "px" );
		$( oAdd ).animate( {
		    left: "0px"
		}, 1000 );
		$( oCurrent ).animate( {
		    left: iWindowWidth + "px"
		}, 1000 );
	    }
	    setTimeout( function() {
		$( oCurrent ).replaceWith( "" );
		oAdd = "";
		showContent( sCurrentSectionSide, oSection );
	    }, 1001 );
	}
    }
}

function showContent( sSide, oSection ) {
    $( "#content" ).css( "height", "20px" );
    $( "#content" ).html( "" );
    if( sSide == 'left' ) {
	$( "#content" ).css( "left", ( iWindowWidth - $( "#content" ).width() - 100 ) + "px" );
    } else {
	$( "#content" ).css( "left", "100px" );
    }
    $( "#content" ).animate( {
	opacity: "1"
    }, 500 );
    setTimeout( function() {
	$( "#content" ).animate( {
	    height: oSection.height + "px"
	}, 500 );
	$( "#content" ).html( "<h1>" + oSection.title + "</h1>" );
    }, 500 );
    setTimeout( function() {
	bAnimating = false;
    }, 1000 );
}

function scaleCrop(li) {
    var img = $($(li).find('img:first')),
    wW = $(window).width(),
    wH = $(window).height(),
    iH = img.height(),
    iW = img.width();
    if (!(((iH < wH || iW < wW) || (iH > wH && iW > wW)) && (iH > 0 && iW > 0)))
    {
    //return;
    }
    var highestScale,
    widthScale = wW / iW,
    heightScale = wH / iH;
    highestScale = Math.max(heightScale, widthScale);
    newWidth = iW * highestScale;
    newHeight = iH * highestScale;
    img.css({
	width:newWidth.toString()+"px",
	height:newHeight.toString()+"px"
    });
}

function centerX(li) {
    var img = $(li.find('img:first')),
    wW = $(window).width(),
    iW = img.width();
    li.css({
	left:((0 - (iW / 2)) + (wW / 2)).toString() + "px"
    });
}
function centerY(li) {
    var img = $(li.find('img:first')),
    wH = $(window).height(),
    iH = img.height();
    li.css({
	top:((0 - (iH / 2)) + (wH / 2)).toString() + "px"
    });
}
