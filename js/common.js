var isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function() {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};

$(document).ready(function(){
		$('.tarif-head').click( function() {
			$(this).parents('.tarifs-list__item').addClass('tarifs-list__item_active');
			$(this).next('.tarif-content').css('visibility', 'visible').animate({height: 264}, 800);
	
		});
		
		$('.close').click( function() {		
			$(this).parents('.tarifs-list__item').removeClass('tarifs-list__item_active');
			$(this).parents('.tarifs-list__item').find('.tarif-content').animate({
				height: 0},800,  
			function(){
					$(this).parents('.tarifs-list__item').find('.tarif-content').css('visibility', 'hidden');
			});
			
		});
		
		$('.question').click( function() {
			$(this).parents('.questions-list__item').addClass('questions-list__item_active');
			$(this).next('.answer').slideDown(600);
	
		});
		
		$('.close').click( function() {		
			$(this).parents('.questions-list__item').removeClass('questions-list__item_active');
			$(this).parents('.answer').slideUp(600);

		});

		$('.channels').each(function() {
			var elCount = $('.channels-list__item',this).size();
			if (elCount > 8) {
				$('.channels-content',this).jScrollPane(
					{
						showArrows:true,
						verticalDragMinHeight: 30,
						verticalDragMaxHeight: 30,
						horizontalDragMinWidth: 23,
						horizontalDragMaxWidth: 23
					}
				);
			}
		});
		
		$('.chbox-custom label').click(function() {
			$('.chbox-front',this).toggleClass('chbox-front_active');
		});
	if($('#fConnect').attr('checked'))
	{
		$('#form_object .chbox-front').addClass('chbox-front_active');
	}
	else
	{
		$('#form_object .chbox-front').removeClass('chbox-front_active')
	}

});

function sendForm()
{
	$('#contacts-form').fadeOut(5000);
	$.post('send.php', $('#mail_form').serialize(), function(){
		$('#contacts-form').stop().hide();
		$('#form-success').show();
		$('#tarif').val('');
	});
}

function checkUncheck(item)
{
	setTimeout(function(){
		if ($('#form_object .chbox-front').hasClass('chbox-front_active')) {
			item.attr('checked', 'checked');
		}
		else {
			item.removeAttr('checked');
		}
	}, 100);
}