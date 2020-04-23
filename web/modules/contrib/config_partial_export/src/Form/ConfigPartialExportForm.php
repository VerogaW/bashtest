<?php

namespace Drupal\config_partial_export\Form;

use Drupal\Core\Config\ConfigManagerInterface;
use Drupal\Core\File\FileSystemInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Config\StorageInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Config\StorageComparer;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Archiver\ArchiveTar;
use Drupal\Component\Serialization\Yaml;


/**
 * Construct the storage changes in a configuration synchronization form.
 */
class ConfigPartialExportForm extends FormBase {

  /**
   * The active configuration object.
   *
   * @var \Drupal\Core\Config\StorageInterface
   */
  protected $activeStorage;

  /**
   * The snapshot configuration object.
   *
   * @var \Drupal\Core\Config\StorageInterface
   */
  protected $snapshotStorage;

  /**
   * The configuration manager.
   *
   * @var \Drupal\Core\Config\ConfigManagerInterface
   */
  protected $configManager;

  /**
   * The file system service.
   *
   * @var \Drupal\Core\File\FileSystemInterface
   */
  protected $fileSystem;

  /**
   * Constructs the object.
   *
   * @param \Drupal\Core\Config\StorageInterface $active_storage
   *   The target storage.
   * @param \Drupal\Core\Config\StorageInterface $snapshot_storage
   *   The snapshot storage.
   * @param \Drupal\Core\Config\ConfigManagerInterface $config_manager
   *   Configuration manager.
   * @param \Drupal\Core\File\FileSystemInterface $file_system
   *   The file system service.
   */
  public function __construct(
      StorageInterface $active_storage,
      StorageInterface $snapshot_storage,
      ConfigManagerInterface $config_manager,
      FileSystemInterface $file_system) {
        $this->activeStorage = $active_storage;
        $this->snapshotStorage = $snapshot_storage;
        $this->configManager = $config_manager;
        $this->fileSystem = $file_system;
      }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.storage'),
      $container->get('config.storage.snapshot'),
      $container->get('config.manager'),
      $container->get('file_system')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'config_partial_export_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $snapshot_comparer = new StorageComparer($this->activeStorage, $this->snapshotStorage, $this->configManager);
    $change_list = [];
    if (!$form_state->getUserInput() && $snapshot_comparer->createChangelist()->hasChanges()) {
      $this->messenger()->addWarning($this->t('Your current configuration has changed.'));
      foreach ($snapshot_comparer->getAllCollectionNames() as $collection) {
        foreach ($snapshot_comparer->getChangelist(NULL, $collection) as $config_names) {
          if (empty($config_names)) {
            continue;
          }
          foreach ($config_names as $config_name) {
            $change_list[$config_name]['name'] = $config_name;
          }
        }
      }
    }

    if (empty($change_list)) {
      $user_input = $form_state->getUserInput();
      if (isset($user_input['change_list'])) {
        $change_list = $user_input['change_list'];
      }
    }
    ksort($change_list);

    $form['change_list'] = [
      '#type' => 'tableselect',
      '#header' => ['name' => $this->t('Name')],
      '#options' => $change_list,
    ];

    $form['description'] = [
      '#markup' => '<p><b>' . $this->t('Use the export button to download the selected files listed above.') . '</b></p>',
    ];

    $form['addSystemSiteInfo'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Add system.site info'),
      '#default_value' => FALSE,
    ];

    $form['actions'] = ['#type' => 'actions'];
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Export'),
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    $user_input = $form_state->getUserInput();
    return !empty($user_input['change_list']);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $user_input = $form_state->getUserInput();
    $change_list = $user_input['change_list'];
    $add_system_site_info = $user_input['addSystemSiteInfo'];
    $this->createArchive($change_list, $add_system_site_info);
    $form_state->setRedirect('config_partial.export_partial_download');
  }

  /**
   * Creates a tarball based on $change_list.
   *
   * Creates a tarball based on $change_list in the temporary directory
   * set on admin/config/media/file-system page.
   *
   * @param array $change_list
   *   Array of modified config files.
   * @param bool $add_system_site_info
   *   If TRUE the system.site.yml file will be added to change list.
   */
  public function createArchive(array $change_list, $add_system_site_info = FALSE) {
    $this->fileSystem->delete(file_directory_temp() . '/config_partial.tar.gz');
    $archiver = new ArchiveTar(file_directory_temp() . '/config_partial.tar.gz', 'gz');
    // Get raw configuration data without overrides.
    if ($add_system_site_info && !in_array('system.site', $change_list)) {
      $change_list[] = 'system.site';
    }

    foreach ($change_list as $name) {
      $yaml = Yaml::encode($this->configManager->getConfigFactory()->get($name)->getRawData());
      $archiver->addString("$name.yml", $yaml);
    }
  }
}
