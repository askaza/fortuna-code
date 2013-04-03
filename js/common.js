var sCurrentSectionSide = "center";
var sCurrentPosition = 0;
var sSlideDirection = "";
var imgList = [];
var iWindowWidth = 0;
var iWindowHeight = 0;
var bAnimating = false;
var sCurrentPage = "glagne";
var sCurrentSection = "";
var iRightMenuHeight = 0;
var iLeftMenuHeight = 0;
var iCurrentScroll = 0;

$( document ).ready( function() {
    iWindowWidth = $( window ).width();
    iWindowHeight = $( window ).height();

    getMaxHeight();

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

    sliderSize();

    $('#news-slider').slides({
        preload: true,
        generateNextPrev: false,
        generatePagination:false,
        effect:'fade',
        next: 'next-arrow',
        prev: 'prev-arrow'
    });

    $('#facts-slider, #infogr-slider').cycle({
         prev:          '.prev-arrow',
         next:         ' .next-arrow'
    });
    
    
    $( window ).resize( function() {
        iWindowWidth = $( window ).width();
        iWindowHeight = $( window ).height();
        if( sCurrentPage != 'map' ) {
            if( sCurrentSectionSide == "right" ) {
                $( "#" + sCurrentPage ).css( "left", ( $( "#controls" ).width() + ( iWindowWidth - $( "#controls" ).width() ) / 2 - ( $( "#" + sCurrentPage ).width() / 2 ) ) + "px" );
            } else {
                $( "#" + sCurrentPage ).css( "left", ( ( iWindowWidth - $( "#controls" ).width() ) / 2 - ( $( "#" + sCurrentPage ).width() / 2 ) ) + "px" );
            }
        }
        sliderSize();
        initializeMap();
        if( $( ".nav" ).hasClass( "nav_left" ) ) {
            $( ".nav" ).css( "left", ( iWindowWidth - $( "#controls" ).width() ) + "px" );
        } else if( $( ".nav" ).hasClass( "nav_right" ) ) {
            $( ".nav" ).css( "left", "0px" );
        } else {
            $( ".nav" ).css( "left", ( ( iWindowWidth / 2 ) - ( $( "#controls" ).width() / 2 ) ) + "px" );
        }
        if( ( Math.max( iRightMenuHeight, iLeftMenuHeight ) > iWindowHeight ) ) {
//            $( "#controls" ).animate( { top: ( Math.max( iRightMenuHeight, iLeftMenuHeight ) - iWindowHeight + $( "#controls" ).css( "top" ) ) + "px" }, 800 );
        } else {
            $( "#controls" ).animate( { top: "0px" }, 800 );
        }
        getMaxHeight();
        enableScroll( $( "#" + sCurrentPage ) );
    } );

    $( "#wrap" ).mCustomScrollbar( {
        mouseWheel:true,
        scrollButtons:{
            enable:false
        },
        advanced:{
           updateOnBrowserResize:true,
           updateOnContentResize:true
//           autoScrollOnFocus:true
        },
        callbacks:{
            onScrollStart: function(){ onScrollStart(); },
            onTotalScrollOffset:40,
            onTotalScrollBackOffset:20,
            whileScrolling:function(){ WhileScrolling(); }
        }
    } );
} );

function onScrollStart() {
    if( bAnimating ) {
//        $( "#wrap" ).mCustomScrollbar( "disable", true );
    }
}

function WhileScrolling() {
    if( !bAnimating ) {
        if( ( Math.max( iRightMenuHeight, iLeftMenuHeight ) - iWindowHeight ) + mcs.top > 0 ) {
            $( "#controls" ).css( "top", mcs.top + "px" );
        }
        iCurrentScroll = mcs.top;
        if( $( "#" + sCurrentPage ).css( "top" ) ) {
            var aContentTop = $( "#" + sCurrentPage ).css( "top" ).toString().split( "px" );
            if( aContentTop[0] > ( -1 * parseInt( mcs.top ) ) ) {
                $( "#" + sCurrentPage ).css( "top", ( -1 * parseInt( mcs.top ) ) + "px" );
                getMaxHeight();
            }
        }
    }
}

function initializeMap() {
    $( "#map_canvas" ).css( "width", ( iWindowWidth - $( "#controls" ).width() ) + "px" );
    $( "#map_canvas" ).css( "height", iWindowHeight + "px" );
    $( "#map_canvas" ).css( "left", "0px" );
    $( "#map_canvas" ).css( "top", "0px" );
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
    var myLatlng = new google.maps.LatLng( 55.75329, 37.63813 );
    var content = document.createElement( 'div' );
    $( content ).html( "<div class='mark-popup'><div class='text'>119017, г Москва, ул. БольшаяОрдынка, д. 40, стр. 1 </div><a class='maps-link' href='#'>Яндекс.карты</a><a class='maps-link' href='#'>Гугл.карты</a><a class='print-link' href='#'>Распечатать</a></strong></div>" );
       var infowindow = new google.maps.InfoWindow( {
		   content: content,
		   maxWidth : 160
	   } );

    var mapOptions = {
        zoom: 14,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: false,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false,
        scrollwheel: false
    };
    var map = new google.maps.Map( document.getElementById( 'map_canvas' ), mapOptions );
    map.mapTypes.set( 'map_style', styledMap );
    map.setMapTypeId( 'map_style' );

    var markerImage = new google.maps.MarkerImage(
        'images/mark.png'
    );

    var marker = new google.maps.Marker({
        icon: markerImage,
        position: myLatlng,
        map: map,
        title: "мы тута!"
    } );

    google.maps.event.addListener( marker, 'click', function() {
        infowindow.open( map, marker );
    } );
}

function enableScroll( oContent ) {
    if( oContent ) {
        if( !$( oContent ).find( '.gallery').hasClass( "mCustomScrollbar" ) ) {
            $( oContent ).find( '.gallery' ).find( '.img-list' ).each( function() {
               var elHeight = $( this ).height();
                if ( elHeight > 111 ) {
                    $(this).parents('.gallery').mCustomScrollbar({
                        mouseWheel:true,
                        scrollButtons:{
                            enable:true
                        }
                    });
                }
            });
        } else {
            $( oContent ).find( '.gallery' ).find( '.img-list' ).each( function() {
                var elHeight = $( this ).height();
                if ( elHeight > 111 ) {
                    $( this ).parents( '.gallery' ).mCustomScrollbar( "update" );
                }
            } );
        }
    }
}


function sliderSize() {
    var oSlider = null;
    $( ".slider" ).each( function( key, val ) {
        if( $( val ).parent().css( "display" ) != "none" ) {
            oSlider = $( val );
        }
    } );
    if( oSlider ) {
        var sliderWidth     = $( oSlider ).width();
        var sliderHeight    = sliderWidth * ( $( oSlider ).hasClass( "slider_news" ) ? 0.31 : 0.25 );
        var FontSize        = Math.ceil( sliderWidth * 0.041 );
        var DataHeight      = sliderWidth * 0.065;
        //var DataFontSize  = sliderWidth*0.4*0.2*0.4;
        $( oSlider ).find( '.slide-content' ).width( sliderWidth );
        $( oSlider ).find( '.slides_container, .slides_control, .slide-content' ).height( sliderHeight + parseInt( $( oSlider ).find( '.slide-content' ).css( "line-height" ) ) );
        $( oSlider ).height( sliderHeight + parseInt( $( oSlider ).find( '.slide-content' ).css( "line-height" ) ) );
        $( oSlider ).css( 'font-size', FontSize + 'px' );
//        var TextCutterHeight = Math.floor( sliderHeight / parseInt( $( oSlider ).find( '.slide-content' ).css( "line-height" ) ) ) * parseInt( $( oSlider ).find( '.slide-content' ).css( "line-height" ) );
        var TextCutterHeight =  ( $( oSlider ).hasClass( "slider_news" ) ? 6 : 5 ) * parseInt( $( oSlider ).find( '.slide-content' ).css( "line-height" ) );
        // $('.date').css('font-size',DataFontSize + 'px');
        $( oSlider ).find( '.slide-text' ).height( TextCutterHeight );
        $( oSlider ).find( '.date' ).height( DataHeight );
        $( oSlider ).find( '.date' ).css( 'top', -DataHeight + 'px' );
        $( oSlider ).find( '.date' ).css( 'line-height', ( DataHeight - 1 ) + 'px' );
        $( oSlider ).find( '.slides_container' ).css( 'padding-top', DataHeight + 'px' );
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

function showHidePreloader() {
    if( $( "#preloader" ).size() ) {
        if( $( "#preloader" ).css( "display" ) == 'none' ) {
            $( "#preloader" ).css( "display", "" );
        } else {
            $( "#preloader" ).css( "display", "none" );
        }
    }
}

function showHideContactForm( sAction ) {
    if( sAction == 'show' ) {
        $( "#contact_form" ).css( "height", "0px" );
        $( "#contact_form" ).css( "display", "" );
        $( "#contact_form" ).animate( { height: "310px" }, 500 );
    } else {
        $( "#contact_form" ).animate( { height: "0px" }, 500 );
        setTimeout( function() {
            $( "#contact_form" ).css( "display", "none" );
        }, 500 );
    }
    setTimeout( function() {
        getMaxHeight();
    }, 500 );
}

function showGlagne() {
    if( !bAnimating && sCurrentPage != 'glagne' ) {
//        getMaxHeight();
        showHideContactForm();
        bAnimating = true;
        $( "#" + sCurrentPage ).animate( { opacity: "0" }, 500 );
        setTimeout( function() {
            $( "#" + sCurrentPage ).css( "display", "none" );
        }, 500 );
        $( ".nav" ).removeClass( "nav_left" );
        $( ".nav" ).removeClass( "nav_right" );
        $( ".nav" ).removeClass( "nav_about" );
        $( ".nav" ).removeClass( "nav_contacts" );
        var sNewBackground = "images/bg/img0.jpg";
        var oAdd = $( "<div class='bg1'></div>" );
        sSlideDirection = sCurrentSectionSide == "right" ? "right" : "left";
        sCurrentSection = "glagne";
        sCurrentSectionSide = "center";
        getMaxHeight();
        $( "#home"  ).css( "position", "" );
        $( ".submenu"  ).animate( { height: "0px" }, 500 );
        $( ".nav" ).animate( { left: ( ( iWindowWidth / 2 ) - ( $( "#controls" ).width() / 2 ) ) + "px" }, 500 );
        sCurrentPosition = 0;
        var oCurrent = $( ".bg1:eq(0)" );
        $( "#bgslide" ).append( $( oAdd ) );
        $( oAdd ).css( "background-image", "url(" + sNewBackground + ")" );
        $( oAdd ).css( "background-repeat", "no-repeat" );
        $( oAdd ).css( "background-size", "cover" );
        $( oAdd ).css( "-ms-filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + sNewBackground + "',sizingMethod='scale')" );
        $( oAdd ).css( "filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader( src='" + sNewBackground + "', sizingMethod='scale')" );
        sCurrentPage = "glagne";
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
            showSubPage( "home" );
            $( "#home"  ).css( "position", "" );
        }, 501 );
    }
}

function showPage( sSection ) {
    if( !bAnimating && sSection != sCurrentSection ) {
        bAnimating = true;
        getMaxHeight();
        sCurrentSection = sSection;
        $( ".page_content" ).animate( { opacity: "0" }, 500 );
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
            $( "#controls" ).removeClass( "nav_left" );
            $( "#controls" ).addClass( "nav_right" );
            $( "#controls" ).animate( { left: "0px" }, 500 );
        }
        sCurrentPosition = oSection.position;
        if( oSection ) {
	        $( "#preloader" ).find( "img :eq(0)" ).attr( "src", oSection.preloader );
            showHideContactForm( oSection.show_contact_form ? "show" : "" );
            if( $( ".nav" ).hasClass( "nav_about" ) ) {
                $( ".nav" ).removeClass( "nav_about" );
            }
            if( $( ".nav" ).hasClass( "nav_contacts" ) ) {
                $( ".nav" ).removeClass( "nav_contacts" );
            }
            if( oSection.menu_additional_class ) {
                $( ".nav" ).addClass( oSection.menu_additional_class );
            }
            if( sCurrentSectionSide == "right" ) {
                $( ".mCustomScrollBox .mCSB_scrollTools" ).css( "right", "0" );
                $( ".mCustomScrollBox .mCSB_scrollTools" ).css( "left", "" );
                $( "#preloader" ).css( "top", ( ( iWindowHeight / 2 ) - 32 ) + "px" );
                $( "#preloader" ).css( "left", ( $( "#controls" ).width() + ( iWindowWidth - $( "#controls" ).width() ) / 2 - 32 ) + "px" );
            } else {
                $( ".mCustomScrollBox .mCSB_scrollTools" ).css( "right", "" );
                $( ".mCustomScrollBox .mCSB_scrollTools" ).css( "left", "0" );
                $( "#preloader" ).css( "top", ( ( iWindowHeight / 2 ) - 32 ) + "px" );
                $( "#preloader" ).css( "left", ( ( iWindowWidth - $( "#controls" ).width() ) / 2 - 32 ) + "px" );
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
            if( oSection.bg_repeat == 'no-repeat' ) {
                $( oAdd ).css( "-ms-filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + oSection.bg + "',sizingMethod='scale')" );
                $( oAdd ).css( "filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader( src='" + oSection.bg + "', sizingMethod='scale')" );
            }
//            bAnimating = true;
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
                $( ".page_content" ).css( "display", "none" );
                showContent( oSection );
                oSection = false;
            }, 501 );
        }
    }
}

function showSubPage( sPage, oLink ) {
    if( !bAnimating && sCurrentPage != sPage ) {
        getMaxHeight();
        if( $( "#" + sPage ).size() ) {
	        showHidePreloader();
            $( ".submenu__item" ).removeClass( "menu__item_active" );
            if( oLink ) {
                $( oLink ).parent().addClass( "menu__item_active" );
            }
            bAnimating = true;
            $( "#" + sCurrentPage ).animate( { opacity: "0" }, 500 );
            setTimeout( function() {
                $( ".page_content" ).css( "display", "none" );
                $( ".page_content" ).css( "top", "0" );
                $( "#" + sPage ).css( "opacity", "0" );
                $( "#" + sPage ).css( "display", "" );
                if( sPage != 'map' ) {
                    if( sCurrentSectionSide == "right" ) {
                        $( "#" + sPage ).css( "left", ( $( "#controls" ).width() + ( iWindowWidth - $( "#controls" ).width() ) / 2 - ( $( "#" + sPage ).width() / 2 ) ) + "px" );
                    } else {
                        $( "#" + sPage ).css( "left", ( ( iWindowWidth - $( "#controls" ).width() ) / 2 - ( $( "#" + sPage ).width() / 2 ) ) + "px" );
                    }
                }
                $( "#" + sPage ).animate( { opacity: "1" }, 500 );
                sCurrentPage = sPage;
            }, 500 );
        }
        setTimeout( function() {
            enableScroll( $( "#" + sPage ) );
            initializeMap();
            sliderSize();
            bAnimating = false;
            getMaxHeight();
            setTimeout( function() {
                $( "#wrap" ).mCustomScrollbar( "scrollTo", "#" + sCurrentPage, { scrollInertia: 500 } );
                $( "#wrap" ).mCustomScrollbar( "scrollTo", "top", { moveDragger: 500 } );
            }, 500 );
//            if( $( "#" + sCurrentPage ).css( 'position' ) != 'fixed' ) {
//                $( "#wrap" ).mCustomScrollbar( "scrollTo", "#" + sCurrentPage, { scrollInertia: 500 } );
//                $( "#wrap" ).mCustomScrollbar( "scrollTo", "top", { moveDragger: 500 } );
//            }
	        showHidePreloader();
        }, 1000 );
    }
}

function showContent( oSection ) {
    if( oSection.show ) {
        if( $( "#" + oSection.show ).size() ) {
	    showHidePreloader();
            $( "#" + sCurrentPage ).animate( { opacity: "0" }, 500 );
            setTimeout( function() {
                $( ".page_content" ).css( "top", "0" );
                $( ".page_content" ).css( "display", "none" );
                $( "#" + oSection.show ).css( "opacity", "0" );
                $( "#" + oSection.show ).css( "display", "" );
                if( oSection.show != 'map' ) {
                    if( sCurrentSectionSide == "right" ) {
                        $( "#" + oSection.show ).css( "left", ( $( "#controls" ).width() + ( iWindowWidth - $( "#controls" ).width() ) / 2 - ( $( "#" + oSection.show ).width() / 2 ) ) + "px" );
                    } else {
                        $( "#" + oSection.show ).css( "left", ( ( iWindowWidth - $( "#controls" ).width() ) / 2 - ( $( "#" + oSection.show ).width() / 2 ) ) + "px" );
                    }
                }
                $( "#" + oSection.show ).animate( { opacity: "1" }, 500 );
                sCurrentPage = oSection.show;
            }, 500 );
        }
        setTimeout( function() {
            enableScroll( $( "#" + oSection.show ) );
            initializeMap();
            getMaxHeight();
            sliderSize();
            setTimeout( function() {
                $( "#wrap" ).mCustomScrollbar( "scrollTo", "#" + sCurrentPage, { scrollInertia: 500 } );
                $( "#wrap" ).mCustomScrollbar( "scrollTo", "top", { moveDragger: 500 } );
            }, 500 );
//            if( $( "#" + sCurrentPage ).css( 'position' ) != 'fixed' ) {

//                $( "#" + sCurrentPage ).animate( { top: ( -1 * ( parseInt( $( "#controls" ).css( "top" ) ) ) ) + "px" }, 500 );
//            }
            bAnimating = false;
            showHidePreloader();
        }, 1000 );
    } else {
        bAnimating = false;
    }
}

function getMaxHeight() {
    iRightMenuHeight = $( ".menu_catalog" ).height() + parseInt( $( ".menu_catalog" ).css( "margin-top" ) ) + parseInt( $( ".menu_catalog" ).css( "margin-bottom" ) ) + parseInt( $( ".menu_catalog" ).css( "padding-bottom" ) ) + parseInt( $( ".menu_catalog" ).css( "padding-top" ) );
    iLeftMenuHeight = $( "#left_controls" ).height() + parseInt( $( "#left_controls" ).css( "margin-top" ) ) + parseInt( $( "#left_controls" ).css( "margin-bottom" ) ) + parseInt( $( ".menu_catalog" ).css( "padding-bottom" ) ) + parseInt( $( "#left_controls" ).css( "padding-top" ) );
    var iContentHeight = 0;
    $( ".page_content" ).each( function( key, val ) {
        if( $( val ).css( "display" ) != "none" ) {
            iContentHeight += $( val ).height();
            iContentHeight += parseInt( $( val ).css( "margin-top" ) );
            iContentHeight += parseInt( $( val ).css( "margin-bottom" ) );
            iContentHeight += parseInt( $( val ).css( "padding-top" ) );
            iContentHeight += parseInt( $( val ).css( "padding-bottom" ) );
            iContentHeight += parseInt( $( val ).css( "top" ) );
            iContentHeight += ( -1 * parseInt( $( "#controls" ).css( "top" ) ) );
        }
    } );
    $( ".pages" ).css( "height", Math.max( iRightMenuHeight, iLeftMenuHeight, iWindowHeight, iContentHeight ) + "px" );
    $( "#controls" ).css( "height", Math.max( iRightMenuHeight, iLeftMenuHeight, iWindowHeight, iContentHeight ) + "px" );
    if( sCurrentPage != "home" ) {
        if( iContentHeight <= iWindowHeight ) {
            $( "#" + sCurrentPage ).css( "position", "fixed" );
        } else {
            $( "#" + sCurrentPage ).css( "position", "absolute" );
        }
    } else {
        $( "#" + sCurrentPage ).css( "position", "" );
    }
}