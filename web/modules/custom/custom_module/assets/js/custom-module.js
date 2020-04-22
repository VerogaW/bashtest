(function ($, Drupal, drupalSettings) {

  'use strict';

  Drupal.behaviors.CustomModuleScript = {
    attach: function (context, settings) {

      console.log(drupalSettings);
      
    }
  };

})(jQuery, Drupal, drupalSettings);