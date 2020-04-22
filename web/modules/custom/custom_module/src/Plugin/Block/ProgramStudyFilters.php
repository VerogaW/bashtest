<?php

namespace Drupal\custom_module\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use function GuzzleHttp\Psr7\str;

/**
 * Provides a 'Custom' Block.
 *
 * @Block(
 *   id = "program_of_study_filters",
 *   admin_label = @Translation("Program of Study Filters"),
 * )
 */
class ProgramStudyFilters extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    // $filterHtml = '<div class="program-filter__input-wrap"><label><span class="program-filter__input-label">Search Programs Input</span> <input type="text" placeholder="Search Programs" class="program-filter__input"></label> <svg viewBox="0 0 16 16" class="program-filter__filter-btn"><use xlink:href="/svgs/icon-filter.svg#icon"></use></svg></div>';
    // Get List of Options from Program Type Field
    $progTypes = $this->getProgramTypes();
    $filterHtml = '';
    if ($progTypes) {
      $filterHtml .= $this->getProgramTypesHTML($progTypes, 'PROGRAM TYPE');
    }

    // Now Get Area of Study & College List
    $areaStudy = $this->getVocabularyTerms('area_of_interest');
    if ($areaStudy) {
      $filterHtml .= $this->getProgramTypesHTML($areaStudy, 'AREA OF INTEREST');
    }

    $college = $this->getVocabularyTerms('college');
    if ($college) {
      $filterHtml .= $this->getProgramTypesHTML($college, 'COLLEGE');
    }


    $filterHtml .= '<div class="program-filter__filter-group"><button class="program-filter__clear-btn">Clear All Filters</button></div>';

    return [
      '#type' => 'markup',
      '#markup' => $this->t($filterHtml),
    ];
  }


  // Get List of Program Types
  public function getProgramTypes() {
    $entityManager = \Drupal::service('entity_field.manager');
    $fields = $entityManager->getFieldStorageDefinitions('node', 'program_of_study');
    $options = options_allowed_values($fields['field_type_of_offering']);
    return $options;
  }


  // Get Terms from Vacabulary

  public function getVocabularyTerms($vid){
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid);
    $term_data = [];
    foreach ($terms as $term) {
      $term_data[] = $term->name;
    }
    return $term_data;
  }


  // Generate HTML
  public function getProgramTypesHTML($options, $title) {
    $titleGroup = strtolower(str_replace(' ', '-', $title));
    $html = '<div class="program-filter__filter-group"><h4 class="heading-style-6 text-black">'.$title.'</h4><ul data-filter-group=" '.$titleGroup.'"  class="program-filter-list filters-group">';
    foreach ($options as $option) {
      $optionClass = strtolower(str_replace(' ', '-', $option));
      $html .= '<li class="program-filter-list__item"><label><input type="checkbox" class="program-filter__checkbox"><span class="program-filter__checkbox-label" data-filter=".' .$optionClass.'">' . $option . '</span></label></li>';
    }
    $html .= '</ul></div>';

    return $html;
  }




}
