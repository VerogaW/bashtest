(function ($, Drupal, drupalSettings) {

  'use strict';

  /**
   * Common tweaks for the theme.
   *
   * @type {{attach: Drupal.behaviors.pushMenu.attach}}
   */
  Drupal.behaviors.pushMenu = {
    attach: function (context, settings) {

      $(document).ready(function(){

        /*
         * Push Menu
        */
        var push_menu = $('.layout-push-navigation', context);

        $('.push-menu-toggle', context).once('pushMenu').on('click',function (e) {
          e.preventDefault();
          push_menu.toggleClass('active');
        }); // END .push-menu-toggle

      })

      var $body = $('body'),
          ESCAPE_CODE = 27;

/*
      // close menu if open and clicking on body
      $(document).on('click touchstart',function(e){
        if ( !$('.push-menu-toggle').is(e.target) && !$('.layout-push-navigation').is(e.target) && $('.layout-push-navigation').has(e.target).length === 0 && $('.layout-push-navigation').hasClass('open') ) {
          $('.layout-push-navigation').removeClass('active');
          $('body').removeClass('overflow-hide');
        }
      });
*/

      $.fn.mobileMenuToggle = function (theElement) {
        $(this).on('click touchstart', theElement, function (e) {

          var menuName = $(this).closest('.fa').attr('title'),
              menuName = menuName.toLowerCase().replace(' ', '-');

          if ($('.child-menu-container.' + menuName).length === 0) {
            var $subMenu = $(this).parent('.menu__item').clone(true, true),
              $parent_link = $subMenu.html().split('</a>')[0] + '</a>',
              $sub_heading = $($parent_link).text(),
              $sub_heading_attr = $($parent_link).attr('title'),
              $children_links = $subMenu.html().replace($parent_link, ''),
              $sub_head = '';

            // add description to slide in menu
            if ($sub_heading_attr === '' || $sub_heading_attr === undefined ) {
              $sub_head = '<h5 class="sub-head">' + $sub_heading + ' Overview</h5>';
            } else {
              $sub_head = '<h5 class="sub-head">' + $sub_heading_attr + '</h5>';
            }

            $(this).next('.dropdown-menu-list').remove();
            $('.layout-push-navigation').append('<div class="child-menu-container ' + menuName + '">' +
              '<h2>' + $parent_link + '</h2>' +
              '<span class="prev-menu"><i class="fa fa-angle-left"></i> Back</span>' +
              // add description to slide in menu
              $sub_head +
              '<ul class="parent-wrap">' + $children_links + '</ul>' +
              '</div>');
            setTimeout(function () {
              $('.child-menu-container.' + menuName).addClass('active');
            }, 500);
            $('.child-menu-container.' + menuName + ' .prev-menu').on('click touchstart', function (e) {
              e.preventDefault();
              if ($(this).parent('.child-menu-container').hasClass('active')) {
                $(this).parent('.child-menu-container').removeClass('active');
              }
            });
          } else {
            $('.child-menu-container.' + menuName).addClass('active');
          }
        });
      };

      // Handle closing the slide in with escape key.
      $body.attr('tabIndex', '-1').on('keydown', function (event) {
        if (event.which === ESCAPE_CODE) {
          $('.layout-push-navigation.active').removeClass('active');
        }
      });

      $(document).once('subMenuToggle').mobileMenuToggle('.layout-push-navigation .push-nav-menu .fa-angle-right');


    }
  };


})(jQuery, Drupal, drupalSettings);
