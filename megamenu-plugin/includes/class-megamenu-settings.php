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
        
        // Enqueue admin CSS
        wp_enqueue_style(
            'megamenu-admin',
            MEGAMENU_PREACT_URL . 'admin/css/admin.css',
            array(),
            date('Ymd')
        );
        
        wp_enqueue_script(
            'megamenu-admin',
            MEGAMENU_PREACT_URL . 'admin/js/admin.js',
            array('jquery'),
            date('Ymd'),
            true
        );
        
        // Get current configuration
        $config = get_option('megamenu_config', array(
            'top_menu' => '',
            'submenu_columns' => array(),
            'submenu_images' => array()
        ));

        // Ensure config is complete for all menu items
        $config = $this->get_complete_megamenu_config($config);

        wp_localize_script('megamenu-admin', 'megamenuAdmin', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('megamenu-admin-nonce')
        ));

        // Pass the current configuration to JavaScript
        wp_localize_script('megamenu-admin', 'megamenuConfig', $config);
    }

    /**
     * Ensure megamenu config includes all menu items with default columns/images
     */
    private function get_complete_megamenu_config($config) {
        $top_menu_id = isset($config['top_menu']) ? absint($config['top_menu']) : 0;
        $menu_items = $top_menu_id ? wp_get_nav_menu_items($top_menu_id) : array();

        // Ensure keys exist
        $config['submenu_columns'] = isset($config['submenu_columns']) && is_array($config['submenu_columns']) ? $config['submenu_columns'] : array();
        $config['submenu_images'] = isset($config['submenu_images']) && is_array($config['submenu_images']) ? $config['submenu_images'] : array();

        // Build tree for all menu items (parent/child structure)
        $tree = $this->build_menu_tree($menu_items);

        // Recursively walk tree and ensure config for every item (all levels)
        $this->walk_menu_tree_and_fill_config($tree, $config);

        return $config;
    }

    /**
     * Build a tree structure from flat menu items array
     */
    private function build_menu_tree($menu_items) {
        $tree = array();
        $lookup = array();
        foreach ($menu_items as $item) {
            $item->children = array();
            $lookup[$item->ID] = $item;
        }
        foreach ($menu_items as $item) {
            if ($item->menu_item_parent && isset($lookup[$item->menu_item_parent])) {
                $lookup[$item->menu_item_parent]->children[] = $item;
            } else {
                $tree[] = $item;
            }
        }
        return $tree;
    }

    /**
     * Recursively walk tree and ensure config for every menu item
     */
    private function walk_menu_tree_and_fill_config($items, &$config) {
        foreach ($items as $item) {
            $item_id = $item->ID;
            if (
                !isset($config['submenu_columns'][$item_id]) ||
                !is_array($config['submenu_columns'][$item_id]) ||
                count($config['submenu_columns'][$item_id]) === 0
            ) {
                // Only fill default if nothing meaningful exists
                $config['submenu_columns'][$item_id] = array(
                    array(
                        'title' => '',
                        'style' => 'vertical',
                        'menus' => array()
                    )
                );
            }
            // Otherwise, leave the existing config as-is
            if (!isset($config['submenu_images'][$item_id])) {
                $config['submenu_images'][$item_id] = '';
            }
            // Recurse for children
            if (!empty($item->children)) {
                $this->walk_menu_tree_and_fill_config($item->children, $config);
            }
        }
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
        // Debug: Log the input data to see what's being received
        error_log('Megamenu sanitize_settings input: ' . print_r($input, true));
        
        // Debug specific item
        if (isset($input['submenu_columns']) && !empty($input['submenu_columns'])) {
            foreach ($input['submenu_columns'] as $item_id => $columns) {
                error_log("Checking submenu columns for item ID: $item_id");
                error_log("Column data: " . print_r($columns, true));
            }
        }
        
        $sanitized = array();
        
        // Sanitize top menu
        if (isset($input['top_menu'])) {
            $sanitized['top_menu'] = absint($input['top_menu']);
        } else {
            $sanitized['top_menu'] = '';
        }

        // Sanitize dashboard menu
        if (isset($input['dashboard_menu'])) {
            $sanitized['dashboard_menu'] = absint($input['dashboard_menu']);
        } else {
            $sanitized['dashboard_menu'] = '';
        }

        // Sanitize small menu
        if (isset($input['small_menu'])) {
            $sanitized['small_menu'] = absint($input['small_menu']);
        } else {
            $sanitized['small_menu'] = '';
        }
        
        // Get current menu items to validate against
        $current_menu_items = array();
        if (!empty($sanitized['top_menu'])) {
            $menu_items = wp_get_nav_menu_items($sanitized['top_menu']);
            if ($menu_items && !is_wp_error($menu_items)) {
                foreach ($menu_items as $item) {
                    $current_menu_items[] = $item->ID;
                }
            }
        }
        
        // Sanitize submenu images
        if (isset($input['submenu_images']) && is_array($input['submenu_images'])) {
            $sanitized['submenu_images'] = array();
            
            foreach ($input['submenu_images'] as $item_id => $image_id) {
                // Only keep images for menu items that still exist
                if (!empty($image_id) && (empty($current_menu_items) || in_array($item_id, $current_menu_items))) {
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
                // Skip if this menu item no longer exists in the top menu
                if (!empty($current_menu_items) && !in_array($top_item_id, $current_menu_items)) {
                    continue;
                }
                
                if (!is_array($columns)) {
                    continue;
                }
                
                $sanitized_columns = array();
                
                foreach ($columns as $column_index => $column) {
                    if (!isset($column['menus']) || !is_array($column['menus'])) {
                        continue;
                    }
                    
                    // Sanitize menus
                    $sanitized_menus = array();
                    
                    if (isset($column['menus']) && is_array($column['menus'])) {
                        foreach ($column['menus'] as $menu_data) {
                            // Handle the new format where each menu is an array with id and title keys
                            if (is_array($menu_data) && isset($menu_data['id'])) {
                                $menu_id = absint($menu_data['id']);
                                if (!empty($menu_id)) {
                                    $menu_item = array(
                                        'id' => $menu_id
                                    );
                                    
                                    // Add title if present
                                    if (isset($menu_data['title'])) {
                                        $menu_item['title'] = sanitize_text_field($menu_data['title']);
                                    }
                                    
                                    $sanitized_menus[] = $menu_item;
                                }
                            }
                            // Handle legacy numeric menu IDs (for backwards compatibility)
                            else if (is_numeric($menu_data)) {
                                $menu_id = absint($menu_data);
                                if (!empty($menu_id)) {
                                    $sanitized_menus[] = array(
                                        'id' => $menu_id,
                                        'title' => ''
                                    );
                                }
                            }
                        }
                    }
                    
                    if (!empty($sanitized_menus)) {
                        $column_data = array(
                            'menus' => $sanitized_menus
                        );
                        
                        // Sanitize column title if present
                        if (isset($column['title']) && !empty($column['title'])) {
                            $column_data['title'] = sanitize_text_field($column['title']);
                        }
                        
                        // Sanitize column style if present
                        if (isset($column['style']) && !empty($column['style'])) {
                            // Only allow valid style values
                            if (in_array($column['style'], array('vertical', 'horizontal'))) {
                                $column_data['style'] = sanitize_text_field($column['style']);
                            }
                        }
                        
                        $sanitized_columns[] = $column_data;
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
            'dashboard_menu' => '',
            'small_menu' => '',
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
                    <tr valign="top">
                        <th scope="row"><label for="dashboard_menu"><?php esc_html_e('Dashboard Menu', 'megamenu-preact'); ?></label></th>
                        <td>
                            <select id="dashboard_menu" name="megamenu_config[dashboard_menu]">
                                <option value=""><?php esc_html_e('Select a menu', 'megamenu-preact'); ?></option>
                                <?php foreach ($menus as $menu) : ?>
                                    <option value="<?php echo esc_attr($menu->term_id); ?>" <?php selected($config['dashboard_menu'], $menu->term_id); ?>><?php echo esc_html($menu->name); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row"><label for="small_menu"><?php esc_html_e('Small Menu', 'megamenu-preact'); ?></label></th>
                        <td>
                            <select id="small_menu" name="megamenu_config[small_menu]">
                                <option value=""><?php esc_html_e('Select a menu', 'megamenu-preact'); ?></option>
                                <?php foreach ($menus as $menu) : ?>
                                    <option value="<?php echo esc_attr($menu->term_id); ?>" <?php selected($config['small_menu'], $menu->term_id); ?>><?php echo esc_html($menu->name); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </td>
                    </tr>
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
                <?php
                    // Only render submenu config if a top menu is selected
                    if (!empty($config['top_menu'])) {
                        $menu_items = wp_get_nav_menu_items($config['top_menu']);
                        require_once __DIR__ . '/render-megamenu-admin-html.php';
                        render_megamenu_admin_html($menu_items, $config, $menus);
                    } else {
                        echo '<p class="description">' . esc_html__('Select a top menu to configure submenus', 'megamenu-preact') . '</p>';
                    }
                ?>
                </div>
                
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }
}
