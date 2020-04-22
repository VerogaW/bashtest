<?php
namespace Drupal\custom_module\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\link\Plugin\Field\FieldFormatter\LinkFormatter;

/**
 * Plugin implementation of the 'link' formatter.
 *
 * @FieldFormatter(
 *   id = "link_advance",
 *   label = @Translation("Advance Link"),
 *   field_types = {
 *     "link"
 *   }
 * )
 */
class AdvanceLinkFormatter extends LinkFormatter {

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $element = parent::viewElements($items, $langcode);
    if (is_array($element)) {
      foreach ($element as $delta => $ele) {

        $random = new \Drupal\Component\Utility\Random();
        $string = $random->name(5,true);

        // adding class
        if(!empty($ele['#options']['data_video_link'])) {
          
          // set data attribute
          $element[$delta]['#attributes']['data-src'] = ( strpos($ele['#options']['data_video_link'],'youtube') ? $ele['#options']['data_video_link'].'/?enablejsapi=1': $ele['#options']['data_video_link']);
          $element[$delta]['#attributes']['data-toggle'] = ['al_'.$string];

          // add play button
          if(!empty($ele['#options']['class'])){
            $element[$delta]['#attributes']['class'] = ['advanced-link play '.$ele['#options']['class']];
          } else {
            $element[$delta]['#attributes']['class'] = ['advanced-link play'];
          }
        } else {
          $element[$delta]['#attributes']['class'] = ['advanced-link '.$ele['#options']['class']];
        }

        // adding aria label
        if(!empty($ele['#options']['aria_label'])){
          $element[$delta]['#attributes']['aria-label'] = $ele['#options']['aria_label'];
        }
      }
    }
    return $element;
  }
}
