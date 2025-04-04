<?php
/**
 * Plugin Name: Megamenu Preact
 * Description: A WordPress megamenu with Preact frontend
 * Version: 1.0.0
 * Author: Your Name
 * Text Domain: megamenu-preact
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('MEGAMENU_PREACT_VERSION', '1.0.0');
define('MEGAMENU_PREACT_PATH', plugin_dir_path(__FILE__));
define('MEGAMENU_PREACT_URL', plugin_dir_url(__FILE__));

// Include required files
require_once MEGAMENU_PREACT_PATH . 'includes/class-megamenu-settings.php';
require_once MEGAMENU_PREACT_PATH . 'includes/class-megamenu-frontend.php';

// Initialize the plugin
function megamenu_preact_init() {
    // Initialize settings
    new Megamenu_Settings();
    
    // Initialize frontend
    new Megamenu_Frontend();
}
add_action('plugins_loaded', 'megamenu_preact_init');
