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
            
            // Add import/export buttons
            html += `
                <div class="megamenu-import-export">
                    <button type="button" class="button export-config">Export Configuration</button>
                    <button type="button" class="button import-config">Import Configuration</button>
                    <input type="file" id="import-file" style="display: none;" accept="application/json">
                </div>
            `;
            
            if (!items.length) {
                html += '<p class="description">No items found in the selected menu</p>';
                $submenuConfig.html(html);
                
                // Attach event handlers for import/export buttons
                attachImportExportHandlers();
                return;
            }
            
            // Create tabs container
            html += '<div class="megamenu-tabs-container">';
            
            // Create tab navigation
            html += '<div class="megamenu-tab-nav">';
            items.forEach(function(item, index) {
                html += `<button class="megamenu-tab-button ${index === 0 ? 'active' : ''}" data-tab="${item.ID}">${item.title}</button>`;
            });
            html += '</div>'; // End tab navigation
            
            // Create tab content
            html += '<div class="megamenu-tab-content">';
            
            // Create tab panels
            items.forEach(function(item, index) {
                html += `<div class="megamenu-tab-panel ${index === 0 ? 'active' : ''}" data-panel="${item.ID}">`;
                
                // Submenu item content
                html += `
                    <div class="submenu-item" data-item-id="${item.ID}">
                        <div class="submenu-image-selector">
                            <h5>Featured Image</h5>
                            <div class="image-preview-container">
                                <div class="image-preview"></div>
                                <input type="hidden" name="megamenu_config[submenu_images][${item.ID}]" class="image-id" value="">
                                <button type="button" class="button select-image">Select Image</button>
                                <button type="button" class="button button-link remove-image" style="display: none;">Remove Image</button>
                            </div>
                        </div>
                        
                        <div class="submenu-columns-container">
                            <h5>Submenu Columns</h5>
                            <div class="submenu-columns"></div>
                            <button type="button" class="button add-column" data-item-id="${item.ID}">Add Column</button>
                        </div>
                    </div>
                `;
                
                html += '</div>'; // End tab panel
            });
            
            html += '</div>'; // End tab content
            html += '</div>'; // End tabs container
            
            $submenuConfig.html(html);
            
            // Attach tab click handlers
            $('.megamenu-tab-button').on('click', function() {
                const tabId = $(this).data('tab');
                
                // Update active tab button
                $('.megamenu-tab-button').removeClass('active');
                $(this).addClass('active');
                
                // Update active tab panel
                $('.megamenu-tab-panel').removeClass('active');
                $(`.megamenu-tab-panel[data-panel="${tabId}"]`).addClass('active');
            });
            
            // Attach event handlers for add column buttons
            $('.add-column').on('click', addColumn);
            
            // Attach event handlers for image selection
            $('.select-image').on('click', selectImage);
            $('.remove-image').on('click', removeImage);
            
            // Attach event handlers for import/export buttons
            attachImportExportHandlers();
            
            // Load existing configuration if available
            if (config && config.submenu_columns) {
                console.log('Loading existing configuration after rendering menu items');
                loadExistingConfig(config);
            }
        }
        
        // Attach event handlers for import/export buttons
        function attachImportExportHandlers() {
            $('.export-config').off('click').on('click', exportConfig);
            $('.import-config').off('click').on('click', function() {
                $('#import-file').click();
            });
            $('#import-file').off('change').on('change', importConfig);
        }
        
        // Export configuration as JSON file
        function exportConfig() {
            console.log('Exporting configuration');
            
            // Collect current configuration
            const currentConfig = {
                top_menu: $('#top_menu').val(),
                submenu_columns: {},
                submenu_images: {}
            };
            
            // Get submenu columns configuration
            $('.submenu-item').each(function() {
                const itemId = $(this).data('item-id');
                const columns = [];
                
                $(this).find('.submenu-column').each(function() {
                    const columnIndex = $(this).data('column-index');
                    const menus = [];
                    
                    $(this).find('select.menu-selector').each(function() {
                        const menuId = $(this).val();
                        if (menuId) {
                            menus.push(parseInt(menuId, 10));
                        }
                    });
                    
                    if (menus.length) {
                        columns.push({
                            menus: menus
                        });
                    }
                });
                
                if (columns.length) {
                    currentConfig.submenu_columns[itemId] = columns;
                }
            });
            
            // Get submenu images configuration
            $('.submenu-item').each(function() {
                const itemId = $(this).data('item-id');
                const imageId = $(this).find('.image-id').val();
                
                if (imageId) {
                    currentConfig.submenu_images[itemId] = parseInt(imageId, 10);
                }
            });
            
            // Create a downloadable JSON file
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentConfig, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "megamenu-config.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }
        
        // Import configuration from JSON file
        function importConfig(e) {
            console.log('Importing configuration');
            
            const file = e.target.files[0];
            if (!file) {
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedConfig = JSON.parse(e.target.result);
                    console.log('Imported config:', importedConfig);
                    
                    // Validate imported configuration
                    if (!importedConfig.top_menu) {
                        alert('Invalid configuration file: Missing top menu');
                        return;
                    }
                    
                    // Set top menu
                    $('#top_menu').val(importedConfig.top_menu).trigger('change');
                    
                    // Wait for menu items to load before applying the rest of the configuration
                    const checkInterval = setInterval(function() {
                        if ($('.submenu-item').length > 0) {
                            clearInterval(checkInterval);
                            
                            // Apply the imported configuration
                            loadExistingConfig(importedConfig);
                            
                            alert('Configuration imported successfully!');
                        }
                    }, 500);
                } catch (error) {
                    console.error('Error parsing imported file:', error);
                    alert('Error parsing the imported file. Please make sure it is a valid JSON file.');
                }
            };
            
            reader.readAsText(file);
            
            // Reset the file input so the same file can be selected again
            e.target.value = '';
        }
        
        // Media uploader for selecting images
        let mediaUploader;
        
        // Select image handler
        function selectImage() {
            const $button = $(this);
            const $container = $button.closest('.submenu-item');
            const $preview = $container.find('.image-preview');
            const $imageId = $container.find('.image-id');
            const $removeButton = $container.find('.remove-image');
            
            // If the media uploader already exists, open it
            if (mediaUploader) {
                mediaUploader.open();
                return;
            }
            
            // Create the media uploader
            mediaUploader = wp.media({
                title: 'Select Image for Submenu',
                button: {
                    text: 'Use this image'
                },
                multiple: false
            });
            
            // When an image is selected, run a callback
            mediaUploader.on('select', function() {
                const attachment = mediaUploader.state().get('selection').first().toJSON();
                console.log('Selected attachment:', attachment);
                
                // Set the image ID
                $imageId.val(attachment.id);
                
                // Update the preview
                $preview.html(`
                    <img src="${attachment.url}" alt="">
                    <span class="remove-image">×</span>
                `);
                
                // Show the remove button
                $removeButton.show();
                
                // Attach click handler to the remove icon in the preview
                $preview.find('.remove-image').on('click', function() {
                    $removeButton.trigger('click');
                });
            });
            
            // Open the uploader dialog
            mediaUploader.open();
        }
        
        // Remove image handler
        function removeImage() {
            const $button = $(this);
            const $container = $button.closest('.submenu-item');
            const $preview = $container.find('.image-preview');
            const $imageId = $container.find('.image-id');
            
            // Clear the image ID
            $imageId.val('');
            
            // Clear the preview
            $preview.empty();
            
            // Hide the remove button
            $button.hide();
        }
        
        // Add a new column
        function addColumn() {
            const $button = $(this);
            const itemId = $button.data('item-id');
            const $columnsContainer = $button.closest('.submenu-item').find('.submenu-columns');
            
            // Get the next column index
            const columnIndex = $columnsContainer.find('.submenu-column').length;
            
            // Create a new column
            const $column = $(`
                <div class="submenu-column" data-column-index="${columnIndex}">
                    <h5>Column ${columnIndex + 1}</h5>
                    <a href="#" class="remove-column">Remove</a>
                    <div class="column-menus"></div>
                    <button type="button" class="button button-small add-menu" data-item-id="${itemId}" data-column-index="${columnIndex}">Add Menu</button>
                </div>
            `);
            
            // Append the column to the container
            $columnsContainer.append($column);
            
            // Attach event handlers
            $column.find('.remove-column').on('click', removeColumn);
            $column.find('.add-menu').on('click', addMenu);
        }
        
        // Remove a column
        function removeColumn(e) {
            e.preventDefault();
            $(this).closest('.submenu-column').remove();
        }
        
        // Add a menu to a column
        function addMenu() {
            const $button = $(this);
            const itemId = $button.data('item-id');
            const columnIndex = $button.data('column-index');
            const $menusContainer = $button.closest('.submenu-column').find('.column-menus');
            
            // Show loading indicator
            $menusContainer.append('<p class="loading">Loading available menus...</p>');
            
            // Get available menus via AJAX
            $.ajax({
                url: megamenuAdmin.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'get_available_menus',
                    nonce: megamenuAdmin.nonce
                },
                success: function(response) {
                    console.log('AJAX success response for available menus:', response);
                    
                    // Remove loading indicator
                    $menusContainer.find('.loading').remove();
                    
                    if (response.success) {
                        // Render menu selector
                        renderMenuSelector($menusContainer, response.data.menus, itemId, columnIndex);
                    } else {
                        $menusContainer.append('<p class="error">Error: ' + response.data.message + '</p>');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX error:', status, error);
                    console.log('Response text:', xhr.responseText);
                    
                    // Remove loading indicator
                    $menusContainer.find('.loading').remove();
                    
                    $menusContainer.append('<p class="error">Error: Could not fetch available menus</p>');
                }
            });
        }
        
        // Render menu selector
        function renderMenuSelector($container, menus, itemId, columnIndex) {
            // Create a unique ID for the menu selector
            const menuSelectorId = `menu-selector-${itemId}-${columnIndex}-${$container.find('.column-menu').length}`;
            
            // Create the menu selector
            const $menuSelector = $(`
                <div class="column-menu">
                    <select id="${menuSelectorId}" name="megamenu_config[submenu_columns][${itemId}][${columnIndex}][menus][]" class="menu-selector">
                        <option value="">Select a menu</option>
                        ${menus.map(menu => `<option value="${menu.term_id}">${menu.name}</option>`).join('')}
                    </select>
                    <a href="#" class="remove-menu">Remove</a>
                </div>
            `);
            
            // Append the menu selector to the container
            $container.append($menuSelector);
            
            // Attach event handler for remove button
            $menuSelector.find('.remove-menu').on('click', function(e) {
                e.preventDefault();
                $(this).closest('.column-menu').remove();
            });
        }
        
        // Load existing configuration
        function loadExistingConfig(config) {
            console.log('Loading existing configuration:', config);
            
            // Load submenu images
            if (config.submenu_images) {
                for (const itemId in config.submenu_images) {
                    const imageId = config.submenu_images[itemId];
                    const $container = $(`.submenu-item[data-item-id="${itemId}"]`);
                    
                    if ($container.length && imageId) {
                        const $preview = $container.find('.image-preview');
                        const $imageId = $container.find('.image-id');
                        const $removeButton = $container.find('.remove-image');
                        
                        // Set the image ID
                        $imageId.val(imageId);
                        
                        // Get the image URL via AJAX
                        $.ajax({
                            url: megamenuAdmin.ajaxUrl,
                            type: 'POST',
                            data: {
                                action: 'get_image_url',
                                image_id: imageId,
                                nonce: megamenuAdmin.nonce
                            },
                            success: function(response) {
                                console.log('AJAX success response for image URL:', response);
                                
                                if (response.success) {
                                    // Update the preview
                                    $preview.html(`
                                        <img src="${response.data.url}" alt="">
                                        <span class="remove-image">×</span>
                                    `);
                                    
                                    // Show the remove button
                                    $removeButton.show();
                                    
                                    // Attach click handler to the remove icon in the preview
                                    $preview.find('.remove-image').on('click', function() {
                                        $removeButton.trigger('click');
                                    });
                                }
                            },
                            error: function(xhr, status, error) {
                                console.error('AJAX error:', status, error);
                                console.log('Response text:', xhr.responseText);
                            }
                        });
                    }
                }
            }
            
            // Load submenu columns
            if (config.submenu_columns) {
                for (const itemId in config.submenu_columns) {
                    const columns = config.submenu_columns[itemId];
                    const $container = $(`.submenu-item[data-item-id="${itemId}"]`);
                    
                    if ($container.length && columns.length) {
                        const $columnsContainer = $container.find('.submenu-columns');
                        
                        // Create columns
                        columns.forEach(function(column, columnIndex) {
                            // Create a new column
                            const $column = $(`
                                <div class="submenu-column" data-column-index="${columnIndex}">
                                    <h5>Column ${columnIndex + 1}</h5>
                                    <a href="#" class="remove-column">Remove</a>
                                    <div class="column-menus"></div>
                                    <button type="button" class="button button-small add-menu" data-item-id="${itemId}" data-column-index="${columnIndex}">Add Menu</button>
                                </div>
                            `);
                            
                            // Append the column to the container
                            $columnsContainer.append($column);
                            
                            // Attach event handlers
                            $column.find('.remove-column').on('click', removeColumn);
                            $column.find('.add-menu').on('click', addMenu);
                            
                            // Get available menus to populate the column
                            $.ajax({
                                url: megamenuAdmin.ajaxUrl,
                                type: 'POST',
                                data: {
                                    action: 'get_available_menus',
                                    nonce: megamenuAdmin.nonce
                                },
                                success: function(response) {
                                    console.log('AJAX success response for available menus:', response);
                                    
                                    if (response.success) {
                                        const menus = response.data.menus;
                                        const $menusContainer = $column.find('.column-menus');
                                        
                                        // Add menu selectors for each menu in the column
                                        if (column.menus && column.menus.length) {
                                            column.menus.forEach(function(menuId) {
                                                // Create a unique ID for the menu selector
                                                const menuSelectorId = `menu-selector-${itemId}-${columnIndex}-${$menusContainer.find('.column-menu').length}`;
                                                
                                                // Create the menu selector
                                                const $menuSelector = $(`
                                                    <div class="column-menu">
                                                        <select id="${menuSelectorId}" name="megamenu_config[submenu_columns][${itemId}][${columnIndex}][menus][]" class="menu-selector">
                                                            <option value="">Select a menu</option>
                                                            ${menus.map(menu => `<option value="${menu.term_id}" ${menu.term_id == menuId ? 'selected' : ''}>${menu.name}</option>`).join('')}
                                                        </select>
                                                        <a href="#" class="remove-menu">Remove</a>
                                                    </div>
                                                `);
                                                
                                                // Append the menu selector to the container
                                                $menusContainer.append($menuSelector);
                                                
                                                // Attach event handler for remove button
                                                $menuSelector.find('.remove-menu').on('click', function(e) {
                                                    e.preventDefault();
                                                    $(this).closest('.column-menu').remove();
                                                });
                                            });
                                        }
                                    }
                                },
                                error: function(xhr, status, error) {
                                    console.error('AJAX error:', status, error);
                                    console.log('Response text:', xhr.responseText);
                                }
                            });
                        });
                    }
                }
            }
        }
    });
})(jQuery);
