<?php

namespace Drupal\name\Feeds\Target;

use Drupal\Component\Utility\Unicode;
use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\feeds\FieldTargetDefinition;
use Drupal\feeds\Plugin\Type\Target\FieldTargetBase;
use Drupal\feeds\FeedTypeInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\feeds\Plugin\Type\Processor\EntityProcessorInterface;
use Drupal\feeds\Plugin\Type\Target\ConfigurableTargetInterface;

/**
 * Defines a name field mapper.
 *
 * @FeedsTarget(
 *   id = "name",
 *   field_types = {
 *     "name"
 *   }
 * )
 */
class NameTarget extends FieldTargetBase {

  /**
   * {@inheritdoc}
   */
  protected static function prepareTarget(FieldDefinitionInterface $field_definition) {
    $parts = _name_translations();
    $target_definition = FieldTargetDefinition::createFromFieldDefinition($field_definition);
    foreach (array_keys($parts) as $key) {
      $target_definition->addProperty($key);
    }
    return $target_definition;
  }
}
