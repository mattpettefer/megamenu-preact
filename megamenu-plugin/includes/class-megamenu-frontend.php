<?php
/**
 * Megamenu Frontend Class
 * 
 * Handles the frontend integration of the megamenu
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class Megamenu_Frontend {
    /**
     * Constructor
     */
    public function __construct() {
        // Enqueue scripts
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        
        // Add megamenu data to header
        add_action('wp_head', array($this, 'add_megamenu_data'));
        
        // Add megamenu container to header
        add_action('wp_body_open', array($this, 'add_megamenu_container'));
    }
    
    /**
     * Enqueue scripts
     */
    public function enqueue_scripts() {
        // Enqueue Preact from CDN
        wp_enqueue_script(
            'preact',
            'https://unpkg.com/preact@latest/dist/preact.umd.js',
            array(),
            MEGAMENU_PREACT_VERSION,
            true
        );
        
        // Enqueue megamenu script
        wp_enqueue_script(
            'megamenu-preact',
            MEGAMENU_PREACT_URL . 'assets/js/megamenu.js',
            array('preact'),
            MEGAMENU_PREACT_VERSION,
            true
        );
        
        // Enqueue megamenu styles
        wp_enqueue_style(
            'megamenu-preact',
            MEGAMENU_PREACT_URL . 'assets/css/megamenu.css',
            array(),
            MEGAMENU_PREACT_VERSION
        );
    }
    
    /**
     * Add megamenu data to header
     */
    public function add_megamenu_data() {
        // Get configuration
        $config = get_option('megamenu_config', array(
            'top_menu' => '',
            'submenu_columns' => array()
        ));
        
        // If no top menu is selected, return
        if (empty($config['top_menu'])) {
            return;
        }
        
        // Prepare data
        $data = $this->prepare_megamenu_data($config);
        
        // Output data as JavaScript variable
        ?>
        <script type="text/javascript">
            window.megamenuData = <?php echo wp_json_encode($data); ?>;
        </script>
        <?php
    }
    
    /**
     * Add megamenu container to header
     */
    public function add_megamenu_container() {
        echo '<div id="megamenu-container"></div>';
    }
    
    /**
     * Prepare megamenu data
     */
    private function prepare_megamenu_data($config) {
        // Get top menu items
        $top_menu_items = wp_get_nav_menu_items($config['top_menu']);
        
        if (!$top_menu_items) {
            return array();
        }
        
        // Prepare top menu data
        $top_menu_data = array();
        foreach ($top_menu_items as $item) {
            $top_menu_data[] = array(
                'id' => $item->ID,
                'title' => $item->title,
                'url' => $item->url
            );
        }
        
        // Prepare submenu data
        $submenu_data = array();
        foreach ($config['submenu_columns'] as $top_item_id => $columns) {
            $column_data = array();
            
            foreach ($columns as $column) {
                $menus = array();
                
                foreach ($column['menus'] as $menu_id) {
                    $menu_items = wp_get_nav_menu_items($menu_id);
                    
                    if ($menu_items) {
                        $menu_item_data = array();
                        
                        foreach ($menu_items as $item) {
                            $menu_item_data[] = array(
                                'id' => $item->ID,
                                'title' => $item->title,
                                'url' => $item->url
                            );
                        }
                        
                        $menus[] = array(
                            'id' => $menu_id,
                            'items' => $menu_item_data
                        );
                    }
                }
                
                $column_data[] = array('menus' => $menus);
            }
            
            $submenu_data[$top_item_id] = $column_data;
        }
        
        return array(
            'topMenu' => array(
                'id' => $config['top_menu'],
                'items' => $top_menu_data
            ),
            'subMenus' => $submenu_data
        );
    }
}
