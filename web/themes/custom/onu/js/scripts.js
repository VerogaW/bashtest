(function ($) {

  var newsViewVar = 0;
  var photoCarouselVar = 0;
  var $videoSrc = 0;
  Drupal.behaviors.onuSlickSliderInit = {
    attach: function (context, settings) {
      // Events Carousel
      // Home Page News Feeds Carousel
      var newsView = $('.carousel-news-feed__items-wrap .apply-slick-news.view-carousels > .view-content');
      if (newsView.length && !newsViewVar) {
        newsViewVar = 1;
        var newsCarousel = newsView.slick({
          dots: false,
          infinite: true,
          speed: 300,
          slidesToShow: 3,
          slidesToScroll: 1,
          prevArrow: $('.carousel-news-feed__items-wrap .slider__navigation-btn.left'),
          nextArrow: $('.carousel-news-feed__items-wrap .slider__navigation-btn.right'),
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 639,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              }
            }
          ]
        });
      }

      var photoCarousel = $('.carousel-gallery__window');
      if (photoCarousel.length && !photoCarouselVar) {
        photoCarouselVar = 1;
        photoCarousel.each(function () {
          $(this).find('.carousel-gallery__items-wrap--v1').slick({
            dots: false,
            // infinite: true,
            speed: 300,
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1,
            centerMode: true,
            // slidesToShow: 3,
            prevArrow: $(this).find('.slider__navigation-btn.left'),
            nextArrow: $(this).find('.slider__navigation-btn.right'),
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
                }
              },
              {
                breakpoint: 639,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                }
              }
            ]
          });
        });
      }

      // Home tabbed Section
      $('.context-tabs__tablist-item button').click(function () {
        var aria = jQuery(this).attr('aria-controls');
        if (aria) {
          var activeTab = $('#' + aria);
          if (!activeTab.hasClass('expanded')) {
            $('.context-tabs__tablist-item button').removeClass('active');
            $(this).addClass('active');
            $('.context-tabs__panel-content').removeClass('show').removeClass('expanded').addClass('hide');
            activeTab.addClass('expanded show').removeClass('hide');
          }
        }
      });

      // Split Tone Color
      var tone_style = '';
      $('.split-color-tone-source').each(function () {
        var target = $(this).data('elementdiv');
        var attr_styleProp = $(this).attr('data-styleproperty');

        var attr_tone1 = $(this).attr('data-tone1');
        // For some browsers, `attr` is undefined; for others, `attr` is false. Check for both.
        if (typeof attr_tone1 !== typeof undefined && attr_tone1 !== false) {
          attr_tone1 = checkcolformat(attr_tone1);
          attr_tone1 = attr_tone1.split(' ');
          if (typeof attr_styleProp !== typeof undefined && attr_styleProp !== false) {
            tone_style += '.' + target + '{' + attr_styleProp + ':rgba(' + hexToRgb(attr_tone1[0], attr_tone1[1]) + ')}';
          } else {
            tone_style += '.' + target + ':before{background-color:rgba(' + hexToRgb(attr_tone1[0], attr_tone1[1]) + ')}';
          }
        }

        var attr_tone2 = $(this).attr('data-tone2');
        // For some browsers, `attr` is undefined; for others, `attr` is false. Check for both.
        if (typeof attr_tone2 !== typeof undefined && attr_tone2 !== false) {
          attr_tone2 = checkcolformat(attr_tone2);
          attr_tone2 = attr_tone2.split(' ');
          if (typeof attr_styleProp !== typeof undefined && attr_styleProp !== false) {
            tone_style += '.' + target + '{' + attr_styleProp + ':rgba(' + hexToRgb(attr_tone2[0], attr_tone2[1]) + ')}';
          } else {
            tone_style += '.' + target + ':after{background-color:rgba(' + hexToRgb(attr_tone2[0], attr_tone2[1]) + ')}';
          }
        }
      });
      if (tone_style) {
        $('<style>' + tone_style + '</style>').appendTo('head');
      }

      function checkcolformat(colorval) {
        colorval = $.trim(colorval);
        if (colorval.length >= 8) {
          return colorval;
        } else {
          return colorval + ' 1';
        }
      }

      function hexToRgb(h, o) {
        var r = parseInt((cutHex(h)).substring(0, 2), 16), g = parseInt((cutHex(h)).substring(2, 4), 16),
          b = parseInt((cutHex(h)).substring(4, 6), 16)
        return r + ',' + g + ',' + b + ',' + o;
      }

      function cutHex(h) {
        return (h.charAt(0) == "#") ? h.substring(1, 7) : h
      }

      // Gets the video src from the data-src on each button
      if (!$videoSrc) {
        $('.feature-video__content-wrap').on('click touchend', '.video-modal__button.video-btn', function () {
          $videoSrc = $('.video-modal__button.video-btn').data("src");
          console.log($videoSrc);
          // when the modal is opened autoplay it
          $('#myModal').on('shown.bs.modal', function (e) {
            // set the video src to autoplay and not to show related video. Youtube related video is like a box of chocolates... you never know what you're gonna get
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
          });


          // stop playing the youtube video when I close the modal
          $('#myModal').on('hide.bs.modal', function (e) {
            // a poor man's stop video
            $("#video").attr('src', $videoSrc);
          });
        });
      }
    }
  }

  Drupal.behaviors.phoneNumbers = {
    attach: function (context, settings) {

      var regex = /^(\d{3})(\d{3})(\d{4})$/;
      var $field_number = $('.page-node-type-person .field--name-field-banner-bu-phone .field__item');
      var field_number = $field_number.text();
      var formatted_number = field_number.replace(regex,'$1-$2-$3');
      $field_number.html(formatted_number);

      $('.views-field.views-field-field-banner-bu-phone').each(function() {
        var directory_number = $.trim($(this).text());
        var updated_number = directory_number.replace(regex,'$1-$2-$3');
        $(this).html(updated_number);
      });

    }
  };

  Drupal.behaviors.theme_onu = {
    attach: function (context, settings) {
      // $('.the-nav__button').click(function () {
      //   $('#site-branding .menu--push-navigation-toggle ul .push-menu-toggle').trigger('click');
      // });


      // ****************************************
      // Header Alert & Navigation Link UP
      // -- OnLoad Updated Nav Margin + Alert height +  Content Margin.
      // ****************************************
      var lay_desk = 65;
      if ($(window).width() > 1024) {
        lay_desk = 90;
      }
      setTimeout(function () {
        var alert_h = 0;
        if ($('.the-alert .alert').length) { // if Alert Exists, get the height &  show them
          alert_h = $('.the-alert .the-alert__outer').outerHeight();
        }

        $('.the-alert').animate({height: alert_h}, 200);
        $('.the-nav').animate({top: alert_h}, 200);
        $('.layout-hero-content').animate({marginTop: parseInt(lay_desk) + parseInt(alert_h)}, 200);
        $('.the-menu').css('margin-top', parseInt(lay_desk) + parseInt(alert_h));
        $('.program-filter__filter-groups-wrap').animate({top: parseInt(lay_desk) + parseInt(alert_h)}, 200);

        if($('body').hasClass('user-logged-in')) {
          $('.the-nav').animate({marginTop: '79px'}, 200);
        }

      }, 2000);

      $('.the-alert a.close.the-alert__button').click(function () {
        var m_h = $('.the-alert .the-alert__outer').outerHeight();
        var alert_h = $('.the-alert .the-alert__outer').outerHeight() - m_h;
        // Animate Blocks
        if ($('.the-alert .alert').length - 1) {
          m_h = $(this).parents('.alert').height();
          alert_h = $('.the-alert .the-alert__outer').outerHeight() - m_h;
        }
        $('.the-alert').animate({height: alert_h}, 200);
        $('.the-nav').animate({top: alert_h}, 200);
        $('.layout-hero-content').animate({marginTop: parseInt(lay_desk) + parseInt(alert_h)}, 200);
        $('.the-menu').css('margin-top', parseInt(lay_desk) + parseInt(alert_h));
        $('.program-filter__filter-groups-wrap').animate({top: parseInt(lay_desk) + parseInt(alert_h)}, 200);
      });
      // var alert_h = $('.the-alert').outerHeight();
      // $('.the-nav').css('margin-top', alert_h);
      //
      // $('.the-alert .close.the-alert__button').click(function () {
      //   console.log('Alert Closed');
      //   // Animate height
      //
      // });


      // ****************************************
      // Main Menu: Slide from Left
      // -- On Click Slide menu from left & Accordian code for child items
      // ****************************************
      var theMenu = $('.the-menu');
      var theNavBut = $('.the-nav__button:not(.the-nav__button_search)');
      theNavBut.once().click(function () {
        if($(this).next().hasClass('expanded')) {
          $(this).next().trigger('click');
        }
        $(this).toggleClass('expanded');//.toggleAttribute('aria-expanded');
        if (theMenu.hasClass('the-menu-active')) { // Runs from "Slide In -> Slide  Out
          theMenu.addClass('slide-x-leave-active slide-x-leave-to');
          setTimeout(function () {
            theMenu.removeClass('the-menu-active slide-x-leave-active slide-x-leave-to').css('display', 'none');
          }, 400);
        } else { // Runs from "Slide Out -> Slide  In
          theMenu.addClass('the-menu-active slide-x-enter-active slide-x-enter').css('display', '');
          setTimeout(function () {
            theMenu.removeClass('slide-x-enter').addClass('slide-x-enter-to')
          }, 50);
          setTimeout(function () {
            theMenu.removeClass('slide-x-enter-active slide-x-enter-to');
          }, 450);
        }
      });

      // Add necessary Number at the End of Items to make accessability compatible & accordion
      $i = 1;
      $('.the-menu__list .menu-item--expanded').each(function () {
        $btn_id = $(this).find('.the-menu__list-item-button').attr('id') + $i;
        $(this).find('.the-menu__list-item-button').attr('id', $btn_id).attr('aria-controls', $(this).find('.the-menu__list-item-button').attr('aria-controls') + $i);

        $accor_id = $(this).find('.the-menu__list-item-content').attr('id') + $i;
        $(this).find('.the-menu__list-item-content').attr('id', $accor_id).attr('aria-labelledby', $(this).find('.the-menu__list-item-content').attr('aria-labelledby') + $i);
        $i++;
      });

      // Expand or collapse on click on toggle icon
      $('.the-menu__list-item-button').once().click(function () {
        // Open the menu for the clicked one
        // Update aria & class first
        if ($(this).hasClass('expanded')) {  // Runs from "Expanded -> Collapse"
          $(this).attr('aria-expanded', false).removeClass('expanded');
          $('#' + $(this).attr('aria-controls')).css('max-height', '');
        } else { // Runs from "Collapse -> Expanded"
          $(this).attr('aria-expanded', true).addClass('expanded');
          $('#' + $(this).attr('aria-controls')).css('max-height', $('#' + $(this).attr('aria-controls')).find('.the-menu__content-list').css('height'));
        }
      });


      // theSearchBut.once().click(function() {
      //   // Button  JS to Show Cross
      //
      //   // Search  box JS
      //   // Clone Existing Dom element
      //   $('.block-google-cse').clone().appendTo('.the-nav__toggle');
      //   // Apply Css Animation
      //   setTimeout(function() {
      //     $('.the-nav__toggle .block-google-cse').addClass('slide-y-enter-active slide-y-enter-to');
      //   },400)
      // });

      var theSearchBut = $('.the-nav__button.the-nav__button_search');
      // var searchBox = $('.the-nav__toggle .block-google-cse');
      $('.google-cse.block-search form .form-actions').append('<span class="base-search__submit-button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" class="base-search__submit-button-svg"><use xlink:href="/themes/custom/onu/assets/svgs/icon-search.svg#search"></use></svg></span>');

      theSearchBut.once().click(function() {
        if($(this).prev().hasClass('expanded')) {
          $(this).prev().trigger('click');
        }
        $(this).toggleClass('expanded');//.toggleAttribute('aria-expanded');
        // Button  JS to Show Cross

        // Search  box JS
        // Clone Existing Dom element
        if($(this).hasClass('expanded')) {
          $('.google-cse.search-block-form').clone().addClass('slide-y-leave-active slide-y-leave-to').appendTo('.the-nav__toggle');
          setTimeout(function() {
            $('.the-nav__toggle .google-cse.search-block-form').addClass('slide-y-enter-active slide-y-enter-to').removeClass('slide-y-leave-active slide-y-leave-to');
          },50);
        }
        else {
          $('.the-nav__toggle .google-cse.search-block-form').removeClass('slide-y-enter-active slide-y-enter-to').addClass('slide-y-leave-active slide-y-leave-to');
          setTimeout(function() {
            $('.the-nav__toggle .google-cse.search-block-form').remove();
          },400);
        }
        // Apply Css Animation
      });

      // ****************************************
      // For: Profile Page All (Listing all profiels)
      // -- Onload, simply update the src so that we can show cosmetic image around the images
      // ****************************************
      $('.profile-collection-all .profile-thumbnail__svg').each(function () {
        img_src = $(this).attr('src');
        counter = $(this).attr('data-counter');
        counter_mod = $(this).attr('data-counter') % 3;
        if (!counter_mod) {
          counter_mod = 3;
        }
        $(this).attr('src', img_src.replace(counter, counter_mod));
      });

      // Text & Image Paragraph left/right
      $('.paragraph--type--text-and-image-block').each(function(i){
        if(i % 2 !== 0) {
          $(this).addClass('image-right');
        }
        $(this).addClass('processed');
      });

      // Fill directory hidden filter by last name.
      $('.filter-first-word li').once().on('click', function () {
        $('input[name="field_banner_last_name_value"]').val($(this).text());
        $('#edit-submit-directory').click();
      });

      // Back button.
      $('a.back').once().click(function(){
        if(document.referrer.indexOf(window.location.hostname) != -1){
          parent.history.back();
          return false;
        }
      });

    }
  };

  var filterValue = '*';
  Drupal.behaviors.onu_isotope = {
    attach: function (context, settings) {
      // init Isotope
      var $container = $('.program-filter__main-inner .program-filter__items-wrap');
      // var $output = $('#output');

      // quick search regex
      var qsRegex = '';
      // Reset Button
      var $resetBtn = $('.program-filter__clear-btn');
      // filter with selects and checkboxes
      var $checkboxes = $('.program-filter__checkbox');

      // Update Counters: Filters & Result on different Events
      var updateCounters = function() {
        // Updated Filter Counter
        var $filter_cou = 0;
        // $filter_cou = $('.program-filter__checkbox.active').length;
        // $('.pro-type-filter-counter').html('Filter ('+ $filter_cou +')');

        // Update Result Counter
        // var $result_cou = $('.program-filter__items-wrap .program-filter__item').length;
        // setTimeout(function() {
        //   $('.program-filter__items-wrap .program-filter__item').each(function() {
        //     if($(this).css('display') == 'none') {
        //       $result_cou--;
        //     }
        //   });
        //   $('.pro-type-result-counter').html('Result ('+ $result_cou +')');
        // },500);

        // Reset Button Class
        if($filter_cou)
          $resetBtn.addClass('active');
        else
          $resetBtn.removeClass('active');
      };

      $container.isotope({
        itemSelector: '.program-filter__item',
        filter: function() {
          var $this = $(this);
          var searchResult = qsRegex ? $this.text().match( qsRegex ) : true;
          var buttonResult = filterValue ? $this.is( filterValue ) : true;
          updateCounters();
          console.log(searchResult +'--'+filterValue+'--'+ buttonResult);
          return searchResult && buttonResult;
        },
      });

      // On Click: Checkboxes
      $checkboxes.once().change( function() {
        $(this).toggleClass('active');
        // map input values to an array
        var inclusives = [];
        // inclusive filters from checkboxes
        $checkboxes.each( function( i, elem ) {
          // if checkbox, use value if checked
          if ( elem.checked ) {
            inclusives.push( $(this).next().attr('data-filter'));
          }
        });

        // combine inclusive filters
        // filterValue = inclusives.length ? inclusives.join(', ') : '*';
        filterValue = inclusives.length ? inclusives.join('') : '*';
        filterValue = filterValue.replace('&','ampamp');

        if(filterValue != "*" && !$('.program-filter__clear-btn').hasClass('active'))  {
          $('.program-filter__clear-btn').addClass('active');
        }
        $container.isotope();
      });

      // use value of search field to filter
      var $quicksearch = $('.program-filter__input').keyup( debounce( function() {
        qsRegex = new RegExp( $quicksearch.val(), 'gi' );
        $container.isotope();
      }) );

      // debounce so filtering doesn't happen every millisecond
      function debounce( fn, threshold ) {
        var timeout;
        threshold = threshold || 100;
        return function debounced() {
          clearTimeout( timeout );
          var args = arguments;
          var _this = this;
          function delayed() {
            fn.apply( _this, args );
          }
          timeout = setTimeout( delayed, threshold );
        };
      }

      // Reset all fitlers
      $('.program-filter__clear-btn').once().click(function() {
        filterValue = '';
        qsRegex = '';
        $('.program-filter__input').val('');
        $container.isotope();
        // Reset buttons
        $checkboxes.removeClass('active').prop('checked', false);
        updateCounters();
      });

      // For Mobile
      $('.program-filter__button-grid  button').once().click(function() {
        $('.program-filter__filter-groups-wrap').toggleClass('active');
      });

      $('.program-filter__close-btn').once().click(function() {
        $('.program-filter__filter-groups-wrap').toggleClass('active');
      });
    }
  };
})(jQuery);

//
// jQuery(document).ready(function() {
//   // ****************************************
//   // Locahost:
//   // -- Image Replace Code
//   // ****************************************
//   var imgsrc = '';
//   jQuery('img').each(function () {
//     if(jQuery(this).attr('src').indexOf("onu:8888") == -1) {
//       imgsrc = 'https://onu-main.dev-2.staging-preview.com'+jQuery(this).attr('src');
//     }
//     else {
//       imgsrc = jQuery(this).attr('src').replace("onu:8888", "onu-main.dev-2.staging-preview.com");
//     }
//     jQuery(this).attr('src', imgsrc);
//   });
// });
