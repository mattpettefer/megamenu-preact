/**
 * Megamenu Admin JavaScript
 * 
 * Handles the dynamic submenu configuration in the admin settings page
 */

(function($) {
    'use strict';
    
    // Initialize when document is ready
    $(document).ready(function() {
        const $topMenu = $('#top_menu');
        const $submenuConfig = $('#submenu-config');
        
        // Handle top menu change
        $topMenu.on('change', function() {
            const menuId = $(this).val();
            
            if (!menuId) {
                $submenuConfig.html('<p class="description">Select a top menu to configure submenus</p>');
                return;
            }
            
            // Get menu items via AJAX
            $.ajax({
                url: megamenuAdmin.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'get_menu_items',
                    menu_id: menuId,
                    nonce: megamenuAdmin.nonce
                },
                success: function(response) {
                    if (response.success) {
                        renderSubmenuConfig(response.data.items);
                    } else {
                        $submenuConfig.html('<p class="error">Error: ' + response.data.message + '</p>');
                    }
                },
                error: function() {
                    $submenuConfig.html('<p class="error">Error: Could not fetch menu items</p>');
                }
            });
        });
        
        // Render submenu configuration
        function renderSubmenuConfig(items) {
            let html = '<h3>Submenu Configuration</h3>';
            
            if (!items.length) {
                html += '<p class="description">No items found in the selected menu</p>';
                $submenuConfig.html(html);
                return;
            }
            
            html += '<div class="submenu-items">';
            
            items.forEach(function(item) {
                html += `
                    <div class="submenu-item" data-item-id="${item.ID}">
                        <h4>${item.title}</h4>
                        <div class="columns">
                            <div class="column-container"></div>
                            <button type="button" class="button add-column" data-item-id="${item.ID}">Add Column</button>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            
            $submenuConfig.html(html);
            
            // Attach event handlers
            $('.add-column').on('click', addColumn);
            
            // Load existing configuration
            loadExistingConfig();
        }
        
        // Add a new column
        function addColumn() {
            const itemId = $(this).data('item-id');
            const $columnContainer = $(this).closest('.columns').find('.column-container');
            
            const columnIndex = $columnContainer.find('.column').length;
            
            const $column = $(`
                <div class="column">
                    <h5>Column ${columnIndex + 1}</h5>
                    <div class="menus"></div>
                    <button type="button" class="button add-menu" data-item-id="${itemId}" data-column="${columnIndex}">Add Menu</button>
                    <button type="button" class="button remove-column">Remove Column</button>
                </div>
            `);
            
            $columnContainer.append($column);
            
            // Attach event handlers
            $column.find('.add-menu').on('click', addMenu);
            $column.find('.remove-column').on('click', removeColumn);
        }
        
        // Remove a column
        function removeColumn() {
            $(this).closest('.column').remove();
        }
        
        // Add a menu to a column
        function addMenu() {
            const itemId = $(this).data('item-id');
            const columnIndex = $(this).data('column');
            const $menus = $(this).closest('.column').find('.menus');
            
            // Get available menus via AJAX
            $.ajax({
                url: megamenuAdmin.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'get_available_menus',
                    nonce: megamenuAdmin.nonce
                },
                success: function(response) {
                    if (response.success) {
                        renderMenuSelector($menus, response.data.menus, itemId, columnIndex);
                    }
                }
            });
        }
        
        // Render menu selector
        function renderMenuSelector($container, menus, itemId, columnIndex) {
            const menuIndex = $container.find('.menu').length;
            
            let options = '<option value="">-- Select Menu --</option>';
            
            menus.forEach(function(menu) {
                options += `<option value="${menu.term_id}">${menu.name}</option>`;
            });
            
            const $menu = $(`
                <div class="menu">
                    <select name="megamenu_config[submenu_columns][${itemId}][${columnIndex}][menus][]">
                        ${options}
                    </select>
                    <button type="button" class="button remove-menu">Remove</button>
                </div>
            `);
            
            $container.append($menu);
            
            // Attach event handler
            $menu.find('.remove-menu').on('click', function() {
                $(this).closest('.menu').remove();
            });
        }
        
        // Load existing configuration
        function loadExistingConfig() {
            // Implementation will depend on how the configuration is stored
            // This is a placeholder for the actual implementation
        }
    });
})(jQuery);
