<?php

namespace Drupal\custom_module\Plugin\Tamper;

use Drupal\tamper\Exception\TamperException;
use Drupal\tamper\TamperableItemInterface;
use Drupal\tamper\TamperBase;
use Drupal\media\Entity\Media;

/**
 * Plugin implementation for newsimages.
 *
 * @Tamper(
 *   id = "newsimages",
 *   label = @Translation("News Images"),
 *   description = @Translation("This will take image URL & create Media"),
 *   category = "Media"
 * )
 */
class NewsImages extends TamperBase {

  /**
   * {@inheritdoc}
   */
  public function tamper($data, TamperableItemInterface $item = NULL) {

    if ($data) {
      $returnData = array();
      $images = explode(':::::', $data);
      foreach ($images as $image) {
        $imgData       = explode('----', $image);
        if (!empty($imgData)) {
          $url       = trim($imgData[0]);
          $alt       = isset($imgData[1]) ? trim($imgData[1]) : '';
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
                  'bundle'               => 'article_images',
                  'name'                 => $fileName,
                  'field_media_image_14' => [
                    'target_id' => $fileImage->id(),
                    'alt'       => $alt
                  ],
                ]);
                $media_image->save();
              }
            }
          }
          $returnData[] = $fileName;
        }
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
    $query->condition('m.bundle', 'article_images', '=');
    $query->range(0, 1);
    $result = $query->execute()->fetchCol();

    return $result;
  }
}




