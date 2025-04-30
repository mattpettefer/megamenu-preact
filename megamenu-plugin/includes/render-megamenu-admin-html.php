<?php
/**
 * Helper to render the full submenu configuration HTML for the Megamenu admin UI.
 * Builds all submenu columns, menus, and fields for all menu items using the config data.
 * Usage: include and call render_megamenu_admin_html($menu_items, $config, $menus);
 */
if (!function_exists('render_megamenu_admin_html')) {
function render_megamenu_admin_html($menu_items, $config, $menus) {
    if (!$menu_items || !is_array($menu_items)) {
        echo '<p class="description">No items found in the selected menu</p>';
        return;
    }
    // Export/Import buttons
    echo '<div style="margin-bottom:16px;">';
    echo '<button type="button" class="button export-config">Export JSON</button> ';
    echo '<button type="button" class="button import-config">Import JSON</button>';
    echo '</div>';
    // Tab navigation
    echo '<div class="megamenu-tabs-container">';
    echo '<div class="megamenu-tab-nav">';
    foreach ($menu_items as $idx => $item) {
        $active = $idx === 0 ? 'active' : '';
        echo '<button class="megamenu-tab-button ' . $active . '" data-tab="' . esc_attr($item->ID) . '">' . esc_html($item->title) . '</button>';
    }
    echo '</div>';
    // Tab content panels
    echo '<div class="megamenu-tab-content">';
    foreach ($menu_items as $idx => $item) {
        $active = $idx === 0 ? 'active' : '';
        $item_id = $item->ID;
        echo '<div class="megamenu-tab-panel ' . $active . '" data-panel="' . esc_attr($item_id) . '">';
        echo '<div class="submenu-item" data-item-id="' . esc_attr($item_id) . '">';
        // Image selector
        $image_id = isset($config['submenu_images'][$item_id]) ? $config['submenu_images'][$item_id] : '';
        $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'medium') : '';
        echo '<div class="submenu-image-selector">';
        echo '<h5>Featured Image</h5>';
        echo '<div class="image-preview-container">';
        echo '<div class="image-preview">';
        if ($image_url) {
            echo '<img src="' . esc_url($image_url) . '" style="max-width:80px;max-height:80px;" />';
        }
        echo '</div>';
        echo '<input type="hidden" name="megamenu_config[submenu_images][' . esc_attr($item_id) . ']" class="image-id" value="' . esc_attr($image_id) . '">';
        echo '<button type="button" class="button select-image">Select Image</button>';
        echo '<button type="button" class="button button-link remove-image" style="' . ($image_id ? '' : 'display:none;') . '">Remove Image</button>';
        echo '</div>';
        echo '</div>';
        // Columns
        echo '<div class="submenu-columns-container">';
        echo '<h5>Submenu Columns</h5>';
        echo '<div class="submenu-columns">';
        $columns = isset($config['submenu_columns'][$item_id]) ? $config['submenu_columns'][$item_id] : array();
        foreach ($columns as $col_idx => $column) {
            $col_title = isset($column['title']) ? $column['title'] : '';
            $col_style = isset($column['style']) ? $column['style'] : 'vertical';
            echo '<div class="submenu-column" data-column-index="' . esc_attr($col_idx) . '">';
            // Title
            echo '<input type="text" class="column-title-field" name="megamenu_config[submenu_columns][' . esc_attr($item_id) . '][' . esc_attr($col_idx) . '][title]" value="' . esc_attr($col_title) . '" placeholder="Column Title">';
            // Style
            echo '<select class="column-style-field" name="megamenu_config[submenu_columns][' . esc_attr($item_id) . '][' . esc_attr($col_idx) . '][style]">';
            foreach (["vertical" => "Vertical", "horizontal" => "Horizontal"] as $style_val => $style_label) {
                $selected = $col_style === $style_val ? 'selected' : '';
                echo '<option value="' . esc_attr($style_val) . '" ' . $selected . '>' . esc_html($style_label) . '</option>';
            }
            echo '</select>';
            // Menus in column
            $menus_in_col = isset($column['menus']) ? $column['menus'] : array();
            echo '<div class="column-menus">';
            foreach ($menus_in_col as $menu_idx => $menu) {
                $menu_id = isset($menu['id']) ? $menu['id'] : '';
                $menu_title = isset($menu['title']) ? $menu['title'] : '';
                echo '<div class="column-menu" data-menu-index="' . esc_attr($menu_idx) . '">';
                // Menu select
                echo '<select class="menu-select-field" name="megamenu_config[submenu_columns][' . esc_attr($item_id) . '][' . esc_attr($col_idx) . '][menus][' . esc_attr($menu_idx) . '][id]">';
                echo '<option value="">-- Select Menu --</option>';
                foreach ($menus as $avail_menu) {
                    $selected = ($menu_id && $menu_id == $avail_menu->term_id) ? 'selected' : '';
                    echo '<option value="' . esc_attr($avail_menu->term_id) . '" ' . $selected . '>' . esc_html($avail_menu->name) . '</option>';
                }
                echo '</select>';
                // Menu title
                echo '<input type="text" class="menu-title-field" name="megamenu_config[submenu_columns][' . esc_attr($item_id) . '][' . esc_attr($col_idx) . '][menus][' . esc_attr($menu_idx) . '][title]" value="' . esc_attr($menu_title) . '" placeholder="Menu Title">';
                // Remove menu button
                echo '<button type="button" class="button remove-menu">Remove</button>';
                echo '</div>';
            }
            echo '</div>';
            // Add menu button
            echo '<button type="button" class="button add-menu" data-item-id="' . esc_attr($item_id) . '" data-column-index="' . esc_attr($col_idx) . '">Add Menu</button>';
            // Remove column button
            echo '<button type="button" class="button remove-column">Remove Column</button>';
            echo '</div>';
        }
        echo '</div>';
        echo '<button type="button" class="button add-column" data-item-id="' . esc_attr($item_id) . '">Add Column</button>';
        echo '</div>';
        echo '</div>';
        echo '</div>';
    }
    echo '</div>';
    echo '</div>';
}
}
