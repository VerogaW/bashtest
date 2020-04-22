function stickyAlerts(header, sticky) {
  if (window.pageYOffset >= sticky) {
    header.addClass("sticky");
    var alert_height = jQuery('#kwall-alerts-wrapper').height() + 'px';
    jQuery('.region-navigation').css({ 'padding-bottom': alert_height });
  } else {
    header.removeClass("sticky");
    jQuery('.region-navigation').css({ 'padding-bottom': '0px' });
  }
}

(function ($, Drupal) {
  Drupal.behaviors.kwallSiteAlert = {
    attach: function (context, drupalSettings) {
			if (!$('body').hasClass('dismissed-processed')) {
				$('body').addClass('dismissed-processed')
				
				var header = $('#kwall-alerts-wrapper');
				var sticky = header.offset();
				
				$( window ).scroll(function() {
					if ($( window ).width() < 768) {
						stickyAlerts(header, sticky.top);
					} else {
						header.removeClass("sticky");
						jQuery('.region-navigation').css({ 'padding-bottom': '0px' });
					}
				});
				
	      // Since the key is updated every time the configuration form is saved,
	      // we can ensure users don't miss newly added or changed alerts.
			var total = 5;
			for (i = 1; i <= total; i++) {
		      var keynum = "key" + i;
		      var cookieName = 'Drupal.visitor.kwall_site_alert_dismissed' + i;
		      var key = drupalSettings.kwall_site_alert.dismissedCookie[keynum];
		      // Only show the alert if dismiss button has not been clicked. The
		      // element is hidden by default in order to prevent it from momentarily
		      // flickering onscreen. We are not working with Bootstrap's 'hide' class
		      // since we don't want a dependency on Bootstrap.
		      //actually we are removing altogether so it doesn't mess with slideshow
		      if ($.cookie(cookieName) == key) {
		        $('.kwall-site-alert' + i).remove();
		      }
		      
		      // Set the cookie value when dismiss button is clicked.
		      if (!$('.kwall-site-alert' + i).hasClass('dismissed-processed')) {
			      $('.kwall-site-alert' + i).addClass('dismissed-processed').attr('data-key',key).attr('data-cookie',cookieName);
			      $('.kwall-site-alert' + i).on('close.bs.alert', function () {
				      $.cookie($(this).attr('data-cookie'), $(this).attr('data-key'), { path: drupalSettings.path.baseUrl });
				      //var slickers = jQuery('#kwall-alerts').slick('getSlick');
				      // if (slickers.slideCount == 1) {
					  //     $('#kwall-alerts').slick('unslick').remove();
				      // } else {
					  //     $('#kwall-alerts').slick('slickRemove', $('.slick-slide').index(this) - 1);
				      // }
				    } );
		      }
		    }
		    $(document).ready(function(){
			  //   if(!$('#kwall-alerts').hasClass('slick-processed')) {
				//   	$('#kwall-alerts').addClass('slick-processed');
				//   	$('#kwall-alerts').slick({
				// 		  infinite: true,
				// 		  speed: 300,
				// 		  slidesToShow: 1,
				// 		  adaptiveHeight: true,
              // prevArrow: $('.alert-prev'),
              // nextArrow: $('.alert-next')
				// 		});
				//
				// 		$('#kwall-alerts').on('afterChange', function(event, slick, currentSlide, nextSlide){
				// 		  if (header.hasClass('sticky')) {
				// 			  var alert_height = $('#kwall-alerts-wrapper').height() + 'px';
				// 				$('.region-navigation').css({ 'padding-bottom': alert_height });
				// 			} else {
				// 				$('.region-navigation').css({ 'padding-bottom': '0px' });
				// 			}
				// 		});
				// 	}
				});
	    }
    }
  }
})(jQuery, Drupal);
