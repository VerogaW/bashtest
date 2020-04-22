(function ($, Drupal) {

  Drupal.behaviors.kwall_map = {
    attach: function (context, drupalSettings) {

      $(window).bind("load", function () {
        if (Drupal.geolocation != undefined && !$('body').hasClass('kwall-map-processed')) {

          $.each(drupalSettings.kwall_map.locations, function (i, el) {

            var KwallMapSettings = drupalSettings.kwall_map.locations[i],
              imgOverlay = KwallMapSettings['overlay_' + i],
              neLat = KwallMapSettings['neLat_' + i],
              neLon = KwallMapSettings['neLon_' + i],
              swLat = KwallMapSettings['swLat_' + i],
              swLon = KwallMapSettings['swLon_' + i];

            if (imgOverlay != '') {
              var southWest = new google.maps.LatLng(swLat, swLon);
              var northEast = new google.maps.LatLng(neLat, neLon);
              var overlayBounds = new google.maps.LatLngBounds(southWest, northEast);

              kwallOverlay.prototype = new google.maps.OverlayView();

              function kwallOverlay(bounds, image, map) {
                // Initialize all properties.
                this.bounds_ = bounds;
                this.image_ = image;
                this.map_ = map;
                // Define a property to hold the image's div. We'll
                // actually create this div upon receipt of the onAdd()
                // method so we'll leave it null for now.
                this.div_ = null;
                // Explicitly call setMap on this overlay.
                this.setMap(map);
              }

              /**
               * onAdd is called when the map's panes are ready and the overlay has been
               * added to the map.
               */
              kwallOverlay.prototype.onAdd = function () {
                var div = document.createElement('div');
                div.style.borderStyle = 'none';
                div.style.borderWidth = '0px';
                div.style.position = 'absolute';
                // Create the img element and attach it to the div.
                var img = document.createElement('img');
                img.src = this.image_;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.position = 'absolute';
                div.appendChild(img);
                this.div_ = div;
                // Add the element to the "overlayLayer" pane.
                var panes = this.getPanes();
                panes.overlayLayer.appendChild(div).style['zIndex'] = 1001;
              };
              kwallOverlay.prototype.draw = function () {
                // We use the south-west and north-east
                // coordinates of the overlay to peg it to the correct position and size.
                // To do this, we need to retrieve the projection from the overlay.
                var overlayProjection = this.getProjection();

                // Retrieve the south-west and north-east coordinates of this overlay
                // in LatLngs and convert them to pixel coordinates.
                // We'll use these coordinates to resize the div.
                var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
                var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

                // Resize the image's div to fit the indicated dimensions.
                var div = this.div_;
                div.style.left = sw.x + 'px';
                div.style.top = ne.y + 'px';
                div.style.width = (ne.x - sw.x) + 'px';
                div.style.height = (sw.y - ne.y) + 'px';
              };

              setTimeout(function () {
                new kwallOverlay(overlayBounds, imgOverlay, Drupal.geolocation.maps[0].googleMap);

                $('.geolocation-common-map-container div[title*="href"]').each(function () {
                  var pin_title = $(this).attr('title');
                  var pin_title_cleaned = pin_title.replace(/(<([^>]+)>)/ig, "");
                  var pin_title_cleaned = pin_title_cleaned.replace(/&amp;/g, '&');
                  var pin_title_cleaned = pin_title_cleaned.trim();
                  $(this).attr('title', pin_title_cleaned);
                });
              }, 250);
            }
          });

          var styles = drupalSettings.kwall_map['style'];
          if (styles != '') {
            // add custom map styles
            setTimeout(function () {
              Drupal.geolocation.maps[0].googleMap.setOptions({
                styles: JSON.parse(styles)
              });
            }, 250);
          }

          $('body').addClass('kwall-map-processed');
        }

      });
    }
  }

 /**
   * Toogle map sidebar POI content
   *
   * @type {{attach: Drupal.behaviors.mapInfoToggle.attach}}
   */
  Drupal.behaviors.mapInfoToggle = {
    attach: function (context, settings) {
      $(document).ready(function(){
        var content_toggle = $('.geolocation-common-map-locations .location-title span', context),
          map_content = $('.geolocation-common-map-locations .location-content .more-info', context);

        $(".geolocation").unbind().click(function () {
          var toggle_me = '.geolocation-common-map-locations .map-content-' + $(this).children('.location-title').children('span').data('toggle');

          var current_target = $(this).children('.location-title').children('span');
          // add chevron toggle display
          if ($(current_target).hasClass('active')) {
            $(content_toggle).each(function () {
              $(content_toggle).removeClass('active');
            });
          } else {
            $(content_toggle).each(function () {
              $(content_toggle).removeClass('active');
            });
            $(this).children('.location-title').children('span').addClass('active');
          }

          // toggle map content accordion
          if ($(toggle_me).hasClass('active')) {
            $(map_content).each(function () {
              $(map_content).removeClass('active').slideUp();
            });
          } else {
            $(map_content).each(function () {
              $(map_content).removeClass('active').slideUp();
            });
            $(toggle_me).addClass('active').slideToggle();
          }

          for (var i = 0; i < Drupal.geolocation.maps[0].mapMarkers.length; i++) {
            var marker = Drupal.geolocation.maps[0].mapMarkers[i],
              html = $.parseHTML(marker.infoWindowContent),
              lat = $(this)[0].dataset.lat,
              long_1 = $(this)[0].dataset.lng;

            if ($(html).find("meta[property='latitude']").attr("content") === lat && $(html).find("meta[property='longitude']").attr("content") === long_1) {
              google.maps.event.trigger(marker, 'click');
              return;
            }
          }
        }); // end geolocation click event

      }); //end doc ready

    }
  };

})(jQuery, Drupal);


