(function ($, Drupal, drupalSettings) {

  'use strict';

  /**
   * Common tweaks for the theme.
   *
   * @type {{attach: Drupal.behaviors.flexSliderInit.attach}}
   */
  Drupal.behaviors.commnTweaks = {
    attach: function (context, settings) {


      /**
       * background image paralax effect
      **/
      $(window).on('load', function(){
        $('.full-width-img-section',context).once('commnTweaks').each(function(){
          var $img_section = $(this);
          if ( !$img_section.hasClass('init') ) {
            $img_section.css({
              'background-position':'center center'
            })
          } else {
            var controller = new ScrollMagic.Controller(),
                $scroll_duration = $(window).height() + $img_section.outerHeight(),
                paragraph_id = '#'+$img_section.attr('id'),
                scroll_speed = ( $img_section.data('parallax-speed') == '' ) ? '5' : $img_section.data('parallax-speed');

          	// build scene
          	var scene = new ScrollMagic.Scene({
            	    triggerElement: paragraph_id,
            	    duration: $scroll_duration,
            	    triggerHook: 'onEnter'
            })
  					.addTo(controller)
  					// .addIndicators() // remove for production
  					.on("progress", function (e) {
  						$img_section.css('background-position', 'center ' + (e.progress.toFixed(2) * (100 / scroll_speed)) + '%');
  					});
          }
        });
      });


      $(document).ready(function(){

        /*
         * Hero Banner
         */
        $('.hero-banner-img-section', context).once('setHeroBannerImg').each(function(){
          var bg_img_url = $(this).data('bg-img');
          $(this).css({
            'background-image':'url('+bg_img_url+')',
            'background-size':'cover',
            'background-position':'center top'
          })
        });

        /*
         * Featured Article Background Image
         */
        $('.view-id-article_view.view-display-id-attachment_1 .featured-post-wrap', context).once('setFeaturedArticleImage').each(function(){
          var bg_img = $(this).data('featured-article');
        	$(this).parents('.featured-news-grid.view-display-id-block_1 .attachment').css({
          	'background-image':'url('+bg_img+')',
          	'background-size':'cover',
          	'background-position':'center center'
          });
        });

        /*
         * Featured Article Background Image
         */
        $('.view-id-event_view.view-display-id-attachment_1 .featured-event-wrap', context).once('setFeaturedArticleImage').each(function(){
          var bg_img = $(this).data('featured-event');
        	$(this).parents('.featured-events-grid.view-display-id-block_3 .attachment').css({
          	'background-image':'url('+bg_img+')',
          	'background-size':'cover',
          	'background-position':'center center'
          });
        });

      });

      $('.paragraph--type--accordion', context).once('commnTweaks').each(function(){
        var $toggle_all = $(this).find('.toggle-all');
        
        if ( $toggle_all.length ) {
          var $accordion_parent = $(this),
              $accordion_parent_id = $(this).attr('id'),
              $accordion_item = $(this).find('.collapse');

          $toggle_all.on('click',function(){

            if ( !$accordion_parent.hasClass('show-all') ) {

              $accordion_item.each(function(){
                $(this).collapse('show');
              });
              $accordion_parent.addClass('show-all');

            } else {

              $accordion_item.each(function(){
                $(this).collapse('hide');
              });
              $accordion_parent.removeClass('show-all');

            }

          });
        }
      });



    }
  };


  /**
   * Common tweaks for the theme.
   *
   * @type {{attach: Drupal.behaviors.sidebarAccordionInit.attach}}
   */
  Drupal.behaviors.sidebarAccordionInit = {
    attach: function (context, settings) {

      /*
       * Sidebar Accordion Toggle
       */
      var $sidebar_menu = $('.sidebar-menu-block', context);
      // Sidebar navigation toggle.
      $(document).ready(function(){
        $sidebar_menu.once('sidebarAccordionInit').each(function () {
          // Open active submenu.
          $(this).find('.expanded.dropdown.active').addClass('open');
          var $toggler = $(this).find('.expanded.dropdown-item .fa');

          $toggler.on('click', function () {
            $(this).toggleClass('fa-angle-down fa-angle-up');
            $(this).parent('li').toggleClass('toggled');
            $(this).siblings($(this).attr('data-toggle')).slideToggle();
          });
          //  Toggle on 'Enter' keypress
          $toggler.keypress(function(e){
            if ( e.keyCode == 13 ) {
              $(this).toggleClass('fa-angle-down fa-angle-up');
              $(this).parent('li').toggleClass('toggled');
              $(this).siblings($(this).attr('data-toggle')).slideToggle();
            }
          });        
        });

        $sidebar_menu.find('.is-active').once('sidebarAccordionInit').each(function(){
        	var $parents = $(this).parents('.dropdown-menu-list'),
            	$is_active = $(this).parent('.dropdown-item');
        	$parents.siblings('.fa-angle-down').toggleClass('fa-angle-down fa-angle-up');
        	$parents.slideDown();
          $is_active.children('.fa-angle-down').toggleClass('fa-angle-down fa-angle-up');
          $is_active.addClass('toggled').children('.dropdown-menu-list').slideDown();
        });


      });// END $(document)ready

    }
  };


  /**
   * Common tweaks for the theme.
   *
   * @type {{attach: Drupal.behaviors.sidebarAccordionInit.attach}}
   */
  Drupal.behaviors.calenderRestAPI = {
    attach: function (context, settings) {

      /*
       * Sidebar Accordion Toggle
       */
      $(document).ready(function(){

        $('.calendar-month',context).once('calenderRestAPI').each(function(){
          $(this).find('.event-content').on('click',function(){
            var date = $(this).data('date-trigger'),
                parent = $(this).parent('.contents');

            if ( !parent.hasClass('import') ) {
              $.getJSON( "/rest/events/day/"+date, function( data ) {
                var items = [],
                    count = data.length - 1;

                $.each( data, function( key, val ) {
                  if ( key == 0 ) {
                    items.push( "<li><span class='fa fa-close'></span></li>" );
                  }
                  items.push( "<li id='event-"+ date + '-' + key + "'>" + val.nothing + "</li>" );
                  if ( key >= 2 && key == count ) {
                    items.push( "<li><a href='/events/day/"+date+"'>View All <i class='fa fa-chevron-right'></i></a></li>" );
                  }
                });

                $( "<ul/>", {
                  "class": "popup list-unstyled",
                  html: items.join( "" )
                }).appendTo( parent );

              });
              parent.addClass('import open');
            } 
            else {
              parent.toggleClass('open close');
            }

          });
        });

      });

    }
  };


})(jQuery, Drupal, drupalSettings);
