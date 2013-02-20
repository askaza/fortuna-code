var sCurrentSectionSide = "center";
var sCurrentPosition = 0;
var sSlideDirection = "";
var imgList = [];
var iWindowWidth = 0;
var iWindowHeight = 0;
var bAnimating = false;
var sCurrentPage = "";

$( document ).ready( function() {
    initializeMap();
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
            $( ".slides:eq(0)" ).css( "background-image", "url(images/bg/img0.jpg)" );
            $( "#preload_indicator" ).hide();
            }
        } );
    }

    $( ".nav" ).css( "left", ( ( iWindowWidth / 2 ) - ( $( "#controls" ).width() / 2 ) ) + "px" );

     $( ".accordion" ).accordion({
		header: '.content-head',
		heightStyle: 'content',
        activate: function( event, ui ) {
            enableScroll( $( ui.newPanel ) );
        }
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

    enableScroll();

    sliderSize();
    $('#news-slider, #facts-slider').slides({
        preload: true,
        generateNextPrev: false,
        generatePagination:false,
        effect:'fade',
        next: 'next-arrow',
        prev: 'prev-arrow'
    });

    $( window ).resize( function() {
        sliderSize();
        iWindowWidth = $( window ).width();
        iWindowHeight = $( window ).height();
        if( !$( "#wrap" ).hasClass( "mCustomScrollbar" ) ) {
            $( "#wrap" ).mCustomScrollbar({
                mouseWheel:true,
                scrollButtons:{
                    enable:true
                },
                advanced:{
                   updateOnBrowserResize:true,
                   updateOnContentResize:false,
                   autoExpandHorizontalScroll:false,
                   autoScrollOnFocus:true
                }
            } );
        }
    } );
} );

function initializeMap() {
    var styles = [
        {
            "featureType": "water",
            "stylers": [
                { "color": "#3c3c3c" }
            ]
        },
        {
            "featureType": "road.local",
            "stylers": [
                { "visibility": "on" },
                { "color": "#3c3c3c" }
            ]
        },
        { "featureType": "road.arterial", "stylers": [ { "visibility": "on" }, { "color": "#505050" } ] },
        { "featureType": "road.highway", "stylers": [ { "color": "#808080" }, { "visibility": "on" } ] },
        { "featureType": "administrative", "stylers": [ { "visibility": "off" } ] },
        { "featureType": "road", "elementType": "labels.text.fill", "stylers": [ { "visibility": "on" }, { "color": "#ffffff" } ] },
        { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [ { "visibility": "off" } ] },
        { "featureType": "transit", "stylers": [ { "visibility": "off" } ] },
        { "featureType": "poi", "stylers": [ { "visibility": "off" } ] },
        { "featureType": "landscape", "stylers": [ { "visibility": "on" }, { "color": "#282828" } ] },
        { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [ { "visibility": "on" }, { "color": "#606060" } ] }
    ];
    var styledMap = new google.maps.StyledMapType( styles, { name: "Styled Map" } );
    var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng( 55.75329,37.63813 ),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: false,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false
    };
    var map = new google.maps.Map( document.getElementById( 'map_canvas' ), mapOptions );
    map.mapTypes.set( 'map_style', styledMap );
    map.setMapTypeId( 'map_style' );
}


function enableScroll( oContent ) {
    if( oContent ) {
        if( !$( oContent ).find( '.gallery').hasClass( "mCustomScrollbar" ) ) {
            $( oContent ).find( '.gallery' ).find( '.img-list' ).each( function() {
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
        }
    }
}

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

function showGlagne() {
    if( bAnimating == false ) {
        bAnimating = true;
        $( "#" + sCurrentPage ).animate( { opacity: "0" }, 500 );
        setTimeout( function() {
            $( "#" + sCurrentPage ).css( "display", "none" );
        }, 500 );
        $( ".nav" ).removeClass( "nav_left" );
        $( ".nav" ).removeClass( "nav_right" );
        var sNewBackground = "images/bg/img0.jpg";
        var oAdd = $( "<div class='bg1'></div>" );
        sSlideDirection = sCurrentSectionSide == "right" ? "right" : "left";
        $( ".submenu"  ).animate( { height: "0px" }, 500 );
        $( ".nav" ).animate( { left: ( ( iWindowWidth / 2 ) - ( $( "#controls" ).width() / 2 ) ) + "px" }, 500 );
        sCurrentPosition = 0;
        var oCurrent = $( ".bg1:eq(0)" );
        $( "#bgslide" ).append( $( oAdd ) );
        $( oAdd ).css( "background-image", "url(" + sNewBackground + ")" );
        if( sSlideDirection == "left" ) {
            $( oAdd ).css( "left", iWindowWidth + "px" );
            $( oAdd ).animate( {
                left: "0px"
            }, 500 );
            $( oCurrent ).animate( {
                left: "-" + iWindowWidth + "px"
            }, 500 );
        } else {
            $( oAdd ).css( "left", "-" + iWindowWidth + "px" );
            $( oAdd ).animate( { left: "0px" }, 500 );
            $( oCurrent ).animate( { left: iWindowWidth + "px" }, 500 );
        }
        setTimeout( function() {
            $( ".menu_site" ).removeClass( "menu_site_active " );
            $( ".menu_catalog" ).removeClass( "menu_catalog_active " );
            $( ".menu__item" ).removeClass( "menu__item_active" );
            $( oCurrent ).replaceWith( "" );
            oAdd = "";
            bAnimating = false;
        }, 501 );
    }
}

function showPage( sSection ) {
    if( !bAnimating ) {
        $( ".page_content" ).animate( { opacity: "0" }, 500 );
        setTimeout( function() {
            $( ".page_content" ).css( "display", "none" );
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
            $( "#controls" ).addClass( "nav_left" );
            $( "#controls" ).removeClass( "nav_right" );
            $( ".menu_site" ).addClass( "menu_site_active" );
            $( ".menu_catalog" ).removeClass( "menu_catalog_active" );
            $( "#controls" ).animate( { left: ( iWindowWidth - $( "#controls" ).width() ) + "px" }, 500 );
        } else if( aSections.right[sSection] ) {
            $( ".menu_site" ).removeClass( "menu_site_active" );
            $( ".menu_catalog" ).addClass( "menu_catalog_active" );
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
            $( "#controls" ).addClass( "nav_right" );
            $( "#controls" ).removeClass( "nav_left" );
            $( "#controls" ).animate( { left: "0px" }, 500 );
        }
        sCurrentPosition = oSection.position;
        if( oSection ) {
            if( $( ".nav" ).hasClass( "nav_about" ) ) {
                $( ".nav" ).removeClass( "nav_about" );
            }
            if( $( ".nav" ).hasClass( "nav_contacts" ) ) {
                $( ".nav" ).removeClass( "nav_contacts" );
            }
            if( oSection.menu_additional_class ) {
                $( ".nav" ).addClass( oSection.menu_additional_class );
            }
            $( ".menu__item" ).removeClass( "menu__item_active" );
            $( ".submenu"  ).animate( { height: "0px" }, 500 );
            $( "#" + sSection + "_menu" ).addClass( "menu__item_active" );
            if( $( "#" + sSection ).size() ) {
                $( ".submenu__item" ).removeClass( "menu__item_active" );
                $( "#" + sSection  ).css( "height", "0px" );
                $( "#" + sSection  ).css( "display", "" );
                $( "#" + sSection  ).animate( { height: ( $( "#" + sSection + " li" ).size() * 35 ) + "px" }, 500 );
                $( "#" + sSection + " li:eq(0)" ).addClass( "menu__item_active" );
            }
            $( "#bgslide" ).append( $( oAdd ) );
            $( oAdd ).css( "background-image", "url(" + oSection.bg + ")" );
            $( oAdd ).css( "background-repeat", oSection.bg_repeat );
            $( oAdd ).css( "background-size", oSection.bg_size );
            bAnimating = true;
            var oCurrent = $( ".bg1:eq(0)" );
            if( sSlideDirection == "left" ) {
                $( oAdd ).css( "left", iWindowWidth + "px" );
                $( oAdd ).animate( {
                    left: "0px"
                }, 500 );
                $( oCurrent ).animate( {
                    left: "-" + iWindowWidth + "px"
                }, 500 );
            } else {
                $( oAdd ).css( "left", "-" + iWindowWidth + "px" );
                $( oAdd ).animate( { left: "0px" }, 500 );
                $( oCurrent ).animate( { left: iWindowWidth + "px" }, 500 );
            }
            setTimeout( function() {
                $( oCurrent ).replaceWith( "" );
                oAdd = "";
                showContent( oSection );
            }, 501 );
        }
    }
}

function showSubPage( sPage, oLink ) {
    if( !bAnimating ) {
        if( $( "#" + sPage ).size() ) {
            $( ".submenu__item" ).removeClass( "menu__item_active" );
            $( oLink).parent().addClass( "menu__item_active" );
            bAnimating = true;
            $( "#" + sCurrentPage ).animate( { opacity: "0" }, 500 );
            setTimeout( function() {
                $( "#" + sCurrentPage ).css( "display", "none" );
                $( "#" + sPage ).css( "opacity", "0" );
                $( "#" + sPage ).css( "display", "" );
                $( "#" + sPage ).animate( { opacity: "1" }, 500 );
                sCurrentPage = sPage;
            }, 500 );
        }
        setTimeout( function() {
            enableScroll();
            initializeMap();
            bAnimating = false;
        }, 1000 );
    }
}

function showContent( oSection ) {
    if( oSection.show ) {
        if( $( "#" + oSection.show ).size() ) {
            $( ".submenu__item" ).removeClass( "menu__item_active" );
            $( "#" + sCurrentPage ).animate( { opacity: "0" }, 500 );
            setTimeout( function() {
                $( "#" + sCurrentPage ).css( "display", "none" );
                $( "#" + oSection.show ).css( "opacity", "0" );
                $( "#" + oSection.show ).css( "display", "" );
                $( "#" + oSection.show ).animate( { opacity: "1" }, 500 );
                sCurrentPage = oSection.show;
            }, 500 );
        }
    }
    setTimeout( function() {
        enableScroll();
        initializeMap();
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
