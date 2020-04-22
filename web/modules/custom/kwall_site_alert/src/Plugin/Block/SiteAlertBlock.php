<?php
/**
 * @file
 * Contains \Drupal\kwall_site_alert\Plugin\Block\KwallSiteAlert.
 */
 
namespace Drupal\kwall_site_alert\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides an 'alerts' block.
 *
 * @Block(
 *   id = "kwall_site_alert_block",
 *   admin_label = @Translation("Site Alert"),
 *   category = @Translation("Kwall")
 * )
 */
class SiteAlertBlock extends BlockBase {
  /**
   * {@inheritdoc}
   */
  public function build() {
	  $total = 5;
		$dismissed = array();
		
		if (!\Drupal::service('router.admin_context')->isAdminRoute(\Drupal::routeMatch()->getRouteObject())) {
			$alert = '<div id="kwall-alerts-wrapper" class="the-alert"><div id="kwall-alerts" class="the-alert__outer">';
			for ($i = 1; $i <= $total; $i++) {
			  // If active this is set.
			  if (\Drupal::config('kwall_site_alert.settings')->get('kwall_site_alert_active' . $i) &&
			      \Drupal::currentUser()->hasPermission('view kwall site alerts')) {
			    // Get variables.
			    // $level = \Drupal::config('kwall_site_alert.settings')->get('kwall_site_alert_severity' . $i);
			
			    $message = \Drupal::config('kwall_site_alert.settings')->get('kwall_site_alert_message' . $i);
			    $link = \Drupal::config('kwall_site_alert.settings')->get('kwall_site_alert_link' . $i);

			    $alert .= '<div data-key="" data-cookie="" class="kwall-site-alert'.$i.' alert" role="alert"><div class="container the-alert__inner">';
			
			    // If dismissable, add 'close' button. Also add 'display:none' to the alert
			    // element to prevent it from momentarily flickering onscreen before we
			    // have a chance to hide it.
                $alert .= '<div class="the-alert__text-wrap"><span class="the-alert__text heading-style-7 text-white">'.$message['value'].'</span></div>';

			    if (\Drupal::config('kwall_site_alert.settings')->get('kwall_site_alert_dismiss' . $i)) {
                    $alert .= '<div class="the-alert__cta-wrap">
                      <div class="the-alert__link-wrap">
                        <a href="'.$link.'" class="the-alert__link heading-style-7">
                            Learn More
                        </a>
                      </div>
                      <a href="#" class="close the-alert__button" data-dismiss="alert" aria-label="Close the alert">&times;</a>
                    </div>';
//			      $alert .= '<i class="alert-prev fa fa-chevron-left"></i>';
//			      $alert .= '<i class="alert-next fa fa-chevron-right"></i>';
			    }
			    else {
                    $alert .= '<div class="the-alert__cta-wrap">
                      <div class="the-alert__link-wrap">
                        <a href="'.$link.'" class="the-alert__link heading-style-7 text-white">
                            Learn More
                        </a>
                      </div>
                    </div>';
//                    $alert .= '<i class="alert-prev fa fa-chevron-left"></i>';
//                    $alert .= '<i class="alert-next fa fa-chevron-right"></i>';
			    }
			    $alert .= '</div></div>';
			
			    // If dismissable, attach JavaScript file and configure drupalSettings.
			    if (\Drupal::config('kwall_site_alert.settings')->get('kwall_site_alert_dismiss' . $i)) {
			
			      // A random key is generated whenever an alert has changed. Pass this key
			      // to drupalSettings so that it is accessible via JavaScript.
			      $key = \Drupal::config('kwall_site_alert.settings')->get('kwall_site_alert_key' . $i);
			      
			      $dismissed['key' . $i] = $key;
			    }
			  }
		  }
		  $alert .= '</div>';
		  return array(
			  '#type' => 'markup',
	      '#markup' => $alert,
	      '#attached' => array(
		      'library' => array('kwall_site_alert/slick', 'kwall_site_alert/dismissed-cookie'),
		      'drupalSettings' => array(
	          'kwall_site_alert' => array(
	            'dismissedCookie' => $dismissed,
	          ),
	        ),
	      ),
	    );
	  }
  }
}
