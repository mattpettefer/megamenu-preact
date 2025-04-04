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
        
        // Enqueue admin scripts
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        
        // Register AJAX handlers
        add_action('wp_ajax_get_menu_items', array($this, 'ajax_get_menu_items'));
        add_action('wp_ajax_get_available_menus', array($this, 'ajax_get_available_menus'));
        add_action('wp_ajax_get_image_url', array($this, 'ajax_get_image_url'));
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
        
        // Enqueue WordPress media scripts
        wp_enqueue_media();
        
        wp_enqueue_script(
            'megamenu-admin',
            MEGAMENU_PREACT_URL . 'admin/js/admin.js',
            array('jquery'),
            MEGAMENU_PREACT_VERSION,
            true
        );
        
        // Get current configuration
        $config = get_option('megamenu_config', array(
            'top_menu' => '',
            'submenu_columns' => array(),
            'submenu_images' => array()
        ));
        
        wp_localize_script('megamenu-admin', 'megamenuAdmin', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('megamenu-admin-nonce')
        ));
        
        // Pass the current configuration to JavaScript
        wp_localize_script('megamenu-admin', 'megamenuConfig', $config);
    }
    
    /**
     * AJAX handler for getting menu items
     */
    public function ajax_get_menu_items() {
        // Check nonce for security
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'megamenu-admin-nonce')) {
            wp_send_json_error(array('message' => 'Security check failed.'));
        }
        
        // Check if menu_id is set
        if (!isset($_POST['menu_id']) || empty($_POST['menu_id'])) {
            wp_send_json_error(array('message' => 'Menu ID is required.'));
        }
        
        $menu_id = intval($_POST['menu_id']);
        $menu_items = wp_get_nav_menu_items($menu_id);
        
        if (!$menu_items) {
            wp_send_json_error(array('message' => 'No menu items found.'));
        }
        
        // Format menu items for the frontend
        $formatted_items = array();
        foreach ($menu_items as $item) {
            $formatted_items[] = array(
                'ID' => $item->ID,
                'title' => $item->title,
                'url' => $item->url,
                'parent' => $item->menu_item_parent
            );
        }
        
        wp_send_json_success(array('items' => $formatted_items));
    }
    
    /**
     * AJAX handler for getting available menus
     */
    public function ajax_get_available_menus() {
        // Check nonce for security
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'megamenu-admin-nonce')) {
            wp_send_json_error(array('message' => 'Security check failed.'));
        }
        
        $menus = wp_get_nav_menus();
        
        if (!$menus) {
            wp_send_json_error(array('message' => 'No menus found.'));
        }
        
        // Format menus for the frontend
        $formatted_menus = array();
        foreach ($menus as $menu) {
            $formatted_menus[] = array(
                'term_id' => $menu->term_id,
                'name' => $menu->name
            );
        }
        
        wp_send_json_success(array('menus' => $formatted_menus));
    }
    
    /**
     * AJAX handler for getting image URL
     */
    public function ajax_get_image_url() {
        // Check nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'megamenu-admin-nonce')) {
            wp_send_json_error(array('message' => 'Invalid security token'));
            return;
        }
        
        // Check image ID
        if (!isset($_POST['image_id']) || !absint($_POST['image_id'])) {
            wp_send_json_error(array('message' => 'Invalid image ID'));
            return;
        }
        
        $image_id = absint($_POST['image_id']);
        $image_url = wp_get_attachment_image_url($image_id, 'medium');
        
        if (!$image_url) {
            wp_send_json_error(array('message' => 'Image not found'));
            return;
        }
        
        wp_send_json_success(array('url' => $image_url));
    }
    
    /**
     * Sanitize settings
     */
    public function sanitize_settings($input) {
        $sanitized = array();
        
        // Sanitize top menu
        if (isset($input['top_menu'])) {
            $sanitized['top_menu'] = absint($input['top_menu']);
        } else {
            $sanitized['top_menu'] = '';
        }
        
        // Sanitize submenu images
        if (isset($input['submenu_images']) && is_array($input['submenu_images'])) {
            $sanitized['submenu_images'] = array();
            
            foreach ($input['submenu_images'] as $item_id => $image_id) {
                if (!empty($image_id)) {
                    $sanitized['submenu_images'][$item_id] = absint($image_id);
                }
            }
        } else {
            $sanitized['submenu_images'] = array();
        }
        
        // Sanitize submenu columns
        if (isset($input['submenu_columns']) && is_array($input['submenu_columns'])) {
            $sanitized['submenu_columns'] = array();
            
            foreach ($input['submenu_columns'] as $top_item_id => $columns) {
                if (!is_array($columns)) {
                    continue;
                }
                
                $sanitized_columns = array();
                
                foreach ($columns as $column_index => $column) {
                    if (!isset($column['menus']) || !is_array($column['menus'])) {
                        continue;
                    }
                    
                    $sanitized_menus = array();
                    
                    foreach ($column['menus'] as $menu_id) {
                        $sanitized_menus[] = absint($menu_id);
                    }
                    
                    if (!empty($sanitized_menus)) {
                        $sanitized_columns[] = array(
                            'menus' => $sanitized_menus
                        );
                    }
                }
                
                if (!empty($sanitized_columns)) {
                    $sanitized['submenu_columns'][$top_item_id] = $sanitized_columns;
                }
            }
        } else {
            $sanitized['submenu_columns'] = array();
        }
        
        return $sanitized;
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
            'submenu_columns' => array(),
            'submenu_images' => array()
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
