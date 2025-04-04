<?php
/**
 * Megamenu Settings Class
 * 
 * Handles the WordPress admin settings page for the megamenu
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class Megamenu_Settings {
    /**
     * Constructor
     */
    public function __construct() {
        // Add admin menu
        add_action('admin_menu', array($this, 'add_admin_menu'));
        
        // Register settings
        add_action('admin_init', array($this, 'register_settings'));
        
        // Add admin scripts
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
    }
    
    /**
     * Add admin menu under Appearance
     */
    public function add_admin_menu() {
        add_submenu_page(
            'themes.php',
            __('Megamenu Settings', 'megamenu-preact'),
            __('Megamenu Settings', 'megamenu-preact'),
            'manage_options',
            'megamenu-settings',
            array($this, 'settings_page')
        );
    }
    
    /**
     * Register settings
     */
    public function register_settings() {
        register_setting(
            'megamenu_settings',
            'megamenu_config',
            array($this, 'sanitize_settings')
        );
    }
    
    /**
     * Enqueue admin scripts
     */
    public function enqueue_admin_scripts($hook) {
        if ('appearance_page_megamenu-settings' !== $hook) {
            return;
        }
        
        wp_enqueue_script(
            'megamenu-admin',
            MEGAMENU_PREACT_URL . 'admin/js/admin.js',
            array('jquery'),
            MEGAMENU_PREACT_VERSION,
            true
        );
        
        wp_localize_script('megamenu-admin', 'megamenuAdmin', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('megamenu-admin-nonce')
        ));
    }
    
    /**
     * Sanitize settings
     */
    public function sanitize_settings($input) {
        // Sanitization logic here
        return $input;
    }
    
    /**
     * Render settings page
     */
    public function settings_page() {
        // Get available menus
        $menus = wp_get_nav_menus();
        
        // Get current configuration
        $config = get_option('megamenu_config', array(
            'top_menu' => '',
            'submenu_columns' => array()
        ));
        
        ?>
        <div class="wrap">
            <h1><?php echo esc_html__('Megamenu Settings', 'megamenu-preact'); ?></h1>
            
            <form method="post" action="options.php">
                <?php settings_fields('megamenu_settings'); ?>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="top_menu"><?php echo esc_html__('Select Top Menu', 'megamenu-preact'); ?></label>
                        </th>
                        <td>
                            <select name="megamenu_config[top_menu]" id="top_menu">
                                <option value=""><?php echo esc_html__('-- Select Menu --', 'megamenu-preact'); ?></option>
                                <?php foreach ($menus as $menu) : ?>
                                    <option value="<?php echo esc_attr($menu->term_id); ?>" <?php selected($config['top_menu'], $menu->term_id); ?>>
                                        <?php echo esc_html($menu->name); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </td>
                    </tr>
                </table>
                
                <div id="submenu-config">
                    <!-- JavaScript will populate this area with submenu configuration options -->
                    <p class="description"><?php echo esc_html__('Select a top menu to configure submenus', 'megamenu-preact'); ?></p>
                </div>
                
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }
}
