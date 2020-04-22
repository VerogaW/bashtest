<?php

namespace Drupal\custom_module\Plugin\Tamper;

use Drupal\tamper\Exception\TamperException;
use Drupal\tamper\TamperableItemInterface;
use Drupal\tamper\TamperBase;
use Drupal\media\Entity\Media;

/**
 * Plugin implementation for eventmedia.
 *
 * @Tamper(
 *   id = "eventmedia",
 *   label = @Translation("Create Media using Image URL"),
 *   description = @Translation("This will take image URL & create Media &
 *   return the media Id"), category = "Media"
 * )
 */
class EventMedia extends TamperBase {

  /**
   * {@inheritdoc}
   */
  public function tamper($data, TamperableItemInterface $item = NULL) {

    if ($data) {
      $returnData = array();
      $urls = explode(',', $data);
      foreach ($urls as $url) {
        $url = trim($url);
        $fileName  = '';
        $parsedUrl = parse_url($url);
        $path      = isset($parsedUrl['path']) ? $parsedUrl['path'] : '';

        // Get Filename
        if ($path) {
          $tmp      = explode('/', $path);
          $fileName = end($tmp);
        }

        // Check if we media already exist
        $mediaExist = $this->isMediaExist($fileName);
        if (empty($mediaExist)) {
          $file = file_get_contents($url);
          if ($file) {
            $fileImage = file_save_data($file, 'public://' . $fileName, FILE_EXISTS_REPLACE);
            if ($fileImage) {
              $media_image = Media::create([
                'bundle'              => 'event_featured_image',
                'name'                => $fileName,
                'field_media_image_8' => [
                  'target_id' => $fileImage->id(),
                ],
              ]);
              $media_image->save();
            }
          }
        }
        $returnData[] = $fileName;
       }
      $data = implode(',', $returnData);
    }
    return $data;
  }

  // Check if file already exist to avoid duplicate media

  public function isMediaExist($filename) {
    $connection = \Drupal::database();
    $query = $connection->select('media_field_data', 'm');
    $query->fields('m', ['mid']);
    $query->condition('m.name', $filename, '=');
    $query->condition('m.bundle', 'event_featured_image', '=');
    $query->range(0, 1);
    $result = $query->execute()->fetchCol();

    return $result;
  }
}




