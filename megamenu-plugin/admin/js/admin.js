/**
 * Megamenu Admin JavaScript
 * 
 * Handles the dynamic submenu configuration in the admin settings page
 */

(function($) {
    'use strict';
    
    // Initialize when document is ready
    $(document).ready(function() {
        console.log('Document ready');
        
        const $topMenu = $('#top_menu');
        const $submenuConfig = $('#submenu-config');
        
        // Store the configuration globally for access across functions
        const config = window.megamenuConfig || {};
        console.log('Current megamenuConfig:', config);
        
        // Handle top menu change
        $topMenu.on('change', function() {
            console.log('Top menu changed to:', $(this).val());
            fetchMenuItems($(this).val());
        });
        
        // Check if a top menu is already selected on page load
        // Use setTimeout to ensure the DOM is fully loaded and any other scripts have run
        setTimeout(function() {
            const selectedTopMenu = $topMenu.val();
            console.log('Checking selected top menu after timeout:', selectedTopMenu);
            
            if (selectedTopMenu) {
                console.log('Fetching menu items for:', selectedTopMenu);
                fetchMenuItems(selectedTopMenu);
            }
        }, 500); // Small delay to ensure everything is loaded
        
        // Function to fetch menu items for a given menu ID
        function fetchMenuItems(menuId) {
            console.log('fetchMenuItems called with menuId:', menuId);
            
            if (!menuId) {
                $submenuConfig.html('<p class="description">Select a top menu to configure submenus</p>');
                return;
            }
            
            // Show loading indicator
            $submenuConfig.html('<p class="description">Loading menu items...</p>');
            
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
                    console.log('AJAX success response:', response);
                    
                    if (response.success) {
                        renderSubmenuConfig(response.data.items, config);
                    } else {
                        $submenuConfig.html('<p class="error">Error: ' + response.data.message + '</p>');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX error:', status, error);
                    console.log('Response text:', xhr.responseText);
                    $submenuConfig.html('<p class="error">Error: Could not fetch menu items</p>');
                }
            });
        }
        
        // Render submenu configuration
        function renderSubmenuConfig(items, config) {
            console.log('Rendering submenu config with items:', items);
            
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
            
            // Now that the menu items are rendered, load the existing configuration
            if (config && config.submenu_columns) {
                console.log('Loading existing configuration after rendering menu items');
                loadExistingConfig(config);
            }
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
                    console.log('Available menus response:', response);
                    
                    if (response.success) {
                        renderMenuSelector($menus, response.data.menus, itemId, columnIndex);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error fetching available menus:', status, error);
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
        function loadExistingConfig(config) {
            console.log('loadExistingConfig called with config:', config);
            
            if (!config.submenu_columns) {
                console.log('No submenu columns found in config');
                return;
            }
            
            // For each top menu item that has submenu configuration
            Object.keys(config.submenu_columns).forEach(function(itemId) {
                console.log('Processing config for item ID:', itemId);
                
                const columns = config.submenu_columns[itemId];
                const $submenuItem = $(`.submenu-item[data-item-id="${itemId}"]`);
                
                console.log('Found submenu item element:', $submenuItem.length ? 'Yes' : 'No');
                
                if (!$submenuItem.length) {
                    console.log('Submenu item element not found for ID:', itemId);
                    return;
                }
                
                const $columnContainer = $submenuItem.find('.column-container');
                
                // Create columns
                columns.forEach(function(column, columnIndex) {
                    console.log('Creating column', columnIndex, 'for item', itemId);
                    
                    // Add a new column
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
                    
                    const $menus = $column.find('.menus');
                    
                    // Add menus to this column
                    if (column.menus && column.menus.length) {
                        console.log('Adding menus to column', columnIndex, 'for item', itemId, 'menus:', column.menus);
                        
                        // Get all available menus first
                        $.ajax({
                            url: megamenuAdmin.ajaxUrl,
                            type: 'POST',
                            data: {
                                action: 'get_available_menus',
                                nonce: megamenuAdmin.nonce
                            },
                            success: function(response) {
                                console.log('Available menus response for existing config:', response);
                                
                                if (response.success) {
                                    const availableMenus = response.data.menus;
                                    
                                    // Add each menu from the configuration
                                    column.menus.forEach(function(menuId) {
                                        let options = '<option value="">-- Select Menu --</option>';
                                        
                                        availableMenus.forEach(function(menu) {
                                            const selected = menu.term_id == menuId ? 'selected' : '';
                                            options += `<option value="${menu.term_id}" ${selected}>${menu.name}</option>`;
                                        });
                                        
                                        const $menu = $(`
                                            <div class="menu">
                                                <select name="megamenu_config[submenu_columns][${itemId}][${columnIndex}][menus][]">
                                                    ${options}
                                                </select>
                                                <button type="button" class="button remove-menu">Remove</button>
                                            </div>
                                        `);
                                        
                                        $menus.append($menu);
                                        
                                        // Attach event handler
                                        $menu.find('.remove-menu').on('click', function() {
                                            $(this).closest('.menu').remove();
                                        });
                                    });
                                }
                            },
                            error: function(xhr, status, error) {
                                console.error('Error fetching available menus for existing config:', status, error);
                            }
                        });
                    }
                });
            });
        }
    });
})(jQuery);
