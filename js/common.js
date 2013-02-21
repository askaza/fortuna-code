var sCurrentSectionSide = "center";
var sCurrentPosition = 0;
var sSlideDirection = "";
var imgList = [];
var iWindowWidth = 0;
var iWindowHeight = 0;
var bAnimating = false;
var sCurrentPage = "glagne";
var sCurrentSection = "";

$( document ).ready( function() {
    iWindowWidth = $( window ).width();
    iWindowHeight = $( window ).height();
    $( "#wrap" ).css( "height", iWindowHeight + "px" );
    $( "#controls" ).css( "height", iWindowHeight + "px" );
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

    $('#news-slider, #facts-slider').slides({
        preload: true,
        generateNextPrev: false,
        generatePagination:false,
        effect:'fade',
        next: 'next-arrow',
        prev: 'prev-arrow'
    });

    $( window ).resize( function() {
        iWindowWidth = $( window ).width();
        iWindowHeight = $( window ).height();
        sliderSize();
	enableScroll();
        initializeMap();
        if( $( ".nav" ).hasClass( "nav_left" ) ) {
            $( ".nav" ).css( "left", ( iWindowWidth - $( "#controls" ).width() ) + "px" );
        } else if( $( ".nav" ).hasClass( "nav_right" ) ) {
            $( ".nav" ).css( "left", "0px" );
        } else {
            $( ".nav" ).css( "left", ( ( iWindowWidth / 2 ) - ( $( "#controls" ).width() / 2 ) ) + "px" );
        }
        $( "#wrap" ).css( "height", iWindowHeight + "px" );
        $( "#controls" ).css( "height", iWindowHeight + "px" );
    } );

    $( "#wrap" ).mCustomScrollbar( {
        mouseWheel:true,
        scrollButtons:{
            enable:true
        },
        advanced:{
           updateOnBrowserResize:true,
           updateOnContentResize:true,
           autoExpandHorizontalScroll:false,
           autoScrollOnFocus:true
        }
    } );
} );

function initializeMap() {
    $( "#map_canvas" ).css( "width", ( iWindowWidth - $( "#controls" ).width() ) + "px" );
    $( "#map_canvas" ).css( "height", iWindowHeight + "px" );
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
    $( content ).html( "<div class='mark-content'>119017, г Москва, ул. БольшаяОрдынка, д. 40, стр. 1<br /><a href='#'>Яндекс-карты</a><a href='#'>Гугл-карты</a><a class='print-link' href='#'>распечатать</a></div>" );

    var infowindow = new google.maps.InfoWindow( { content: content } );

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
                var elHeight = $(this).height();
                if (elHeight > 111) {
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
                var elCount = $( '.img-list__item', this ).size();
                if ( elCount > 3 ) {
                    $( this ).parents( '.gallery' ).mCustomScrollbar( "update" );
                }
            } );
        }
    }
}

function sliderSize() {
    if( $('.slider_news').size() ) {
        var sliderWidth = $('.slider').width();
        var sliderHeight = sliderWidth*0.35;
        var FontSize = Math.ceil(sliderWidth*0.042);
	var DataHeight =  sliderWidth*0.065;
	//var DataFontSize =  sliderWidth*0.4*0.2*0.4;

            $('.slide-content').width(sliderWidth);
	    $('.slides_container, .slides_control').height(sliderHeight);
            $('.slider').css('font-size',FontSize + 'px');
	   // $('.date').css('font-size',DataFontSize + 'px');
	    $('.date').height(DataHeight);
	     $('.date').css('top',-DataHeight+'px');
	    $('.date').css('line-height',DataHeight-1+'px');
	    $('.slider_news .slides_container').css('padding-top',DataHeight+'px');

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
}

function showGlagne() {
    if( !bAnimating && sCurrentPage != 'glagne' ) {
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
        $( ".submenu"  ).animate( { height: "0px" }, 500 );
        $( ".nav" ).animate( { left: ( ( iWindowWidth / 2 ) - ( $( "#controls" ).width() / 2 ) ) + "px" }, 500 );
        sCurrentPosition = 0;
        var oCurrent = $( ".bg1:eq(0)" );
        $( "#bgslide" ).append( $( oAdd ) );
        $( oAdd ).css( "background-image", "url(" + sNewBackground + ")" );
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
        }, 501 );
    }
}

function showPage( sSection ) {
    if( !bAnimating && sSection != sCurrentSection ) {
        sCurrentSection = sSection;
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
    if( !bAnimating && sCurrentPage != sPage ) {
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
            enableScroll( $( "#" + sPage ) );
            initializeMap();
            bAnimating = false;
        }, 1000 );
    }
}

function showContent( oSection ) {
    if( oSection.show && sCurrentPage != oSection.show ) {
        if( $( "#" + oSection.show ).size() ) {
            $( "#" + sCurrentPage ).animate( { opacity: "0" }, 500 );
            setTimeout( function() {
                $( "#" + sCurrentPage ).css( "display", "none" );
                $( "#" + oSection.show ).css( "opacity", "0" );
                $( "#" + oSection.show ).css( "display", "" );
                $( "#" + oSection.show ).animate( { opacity: "1" }, 500 );
                sCurrentPage = oSection.show;
            }, 500 );
        }
        setTimeout( function() {
            enableScroll( $( "#" + oSection.show ) );
            initializeMap();
            bAnimating = false;
        }, 1000 );
    } else {
        bAnimating = false;
    }
}