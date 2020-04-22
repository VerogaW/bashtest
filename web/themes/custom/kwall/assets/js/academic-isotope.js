(function ($, Drupal, drupalSettings) {

  'use strict';

  /**
   * Common tweaks for the theme.
   *
   * @type {{attach: Drupal.behaviors.slickSliderInit.attach}}
   */
  Drupal.behaviors.academicIsotopeInit = {
    attach: function (context, settings) {

      $(document).ready(function(){

        /*
         * Academic Isotope Filter
        */
        // init Isotope
        $('.view-academics',context).once('academicIsotopeInit').each(function(){

          var $grid = $(this).children('.view-content'),
              $checkboxes = $(this).find('.filter-toggle'),
              $reset = $(this).find('.isotope-reset');

          $grid.isotope({
            itemSelector: '.grid-item',
            layoutMode: 'fitRows'
          });

          // bind filter button click
          $checkboxes.on('click',function(){
            var filters = [];
            $(this).toggleClass('active');
            // get checked checkboxes values
            $checkboxes.filter('.active').each(function(){
              filters.push( $(this).data('tid') );
            });
            filters = filters.join(', ');
            $grid.isotope({ filter: filters });
          });

          // bind filter rest
          $reset.click(function(){
            $checkboxes.each(function(){
              $(this).removeClass('active');
            });
            $grid.isotope({ filter: '*' });
          });

        });
    

      }); // END $(document).ready

    }
  };


})(jQuery, Drupal, drupalSettings);
