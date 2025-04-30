/*
 * Megamenu Admin JavaScript
 * Handles dynamic submenu configuration in the admin settings page
 *
 * See admin-js-overview.md for documentation.
 */

(function($) {
    'use strict';
    $(document).ready(function() {
        const $topMenu = $('#top_menu');
        const $submenuConfig = $('#submenu-config');
        const config = window.megamenuConfig || {};

        // 1. Auto-submit form on top menu change
        $topMenu.on('change', function() {
            $(this).closest('form').trigger('submit');
        });

        // 2. Enhance PHP-rendered submenu HTML if present
        const submenuHtml = $submenuConfig.find('.megamenu-tabs-container, .submenu-item');
        if (submenuHtml.length > 0) {
            attachDynamicHandlers();
        }

        // 3. Dynamic handler binding
        function attachDynamicHandlers() {
            // Add/remove columns
            $submenuConfig.on('click', '.add-column', addColumn);
            $submenuConfig.on('click', '.remove-column', removeColumn);
            // Add/remove menu links
            $submenuConfig.on('click', '.add-menu', addMenu);
            $submenuConfig.on('click', '.remove-menu', removeMenu);
            // Image selection
            $submenuConfig.on('click', '.select-image', selectImage);
            $submenuConfig.on('click', '.remove-image', removeImage);
            // Tab navigation
            $submenuConfig.on('click', '.megamenu-tab-button', function(e) {
                e.preventDefault();
                const tabId = $(this).data('tab');
                $('.megamenu-tab-button').removeClass('active');
                $(this).addClass('active');
                $('.megamenu-tab-panel').removeClass('active');
                $(`.megamenu-tab-panel[data-panel="${tabId}"]`).addClass('active');
            });
            // Import/export
            attachImportExportHandlers();
        }

        // --- Handler implementations ---

        // Add a new column to a submenu item
        function addColumn(e) {
            e.preventDefault();
            const $submenuItem = $(this).closest('.submenu-item');
            const $columnsContainer = $submenuItem.find('.submenu-columns');
            // Clone the last column or use a template
            let $newCol = $columnsContainer.children('.submenu-column').last().clone(true, true);
            if ($newCol.length === 0) {
                // If no columns exist yet, create a minimal template
                $newCol = $(
                    '<div class="submenu-column">' +
                        '<input type="text" name="" class="column-title" placeholder="Column Title">' +
                        '<select class="column-style"><option value="vertical">Vertical</option><option value="horizontal">Horizontal</option></select>' +
                        '<div class="column-menus"></div>' +
                        '<button type="button" class="button add-menu">Add Menu</button>' +
                        '<button type="button" class="button remove-column">Remove Column</button>' +
                    '</div>'
                );
            } else {
                // Clear input values
                $newCol.find('input, select').val('');
                $newCol.find('.column-menus').empty();
            }
            $columnsContainer.append($newCol);
        }

        // Remove a column
        function removeColumn(e) {
            e.preventDefault();
            const $col = $(this).closest('.submenu-column');
            $col.remove();
        }

        // Add a new menu link to a column
        function addMenu(e) {
            e.preventDefault();
            const $column = $(this).closest('.submenu-column');
            const $menusContainer = $column.find('.column-menus');
            const colIdx = $column.data('column-index') || 0;
            const $submenuItem = $column.closest('.submenu-item');
            const itemId = $submenuItem.data('item-id') || '';
            const menuIdx = $menusContainer.children('.column-menu').length;

            // AJAX fetch menus using plugin's existing endpoint and nonce
            $.ajax({
                url: megamenuAdmin.ajaxUrl,
                method: 'POST',
                data: {
                    action: 'get_available_menus',
                    nonce: megamenuAdmin.nonce
                },
                success: function(response) {
                    let menuOptions = '<option value="">-- Select Menu --</option>';
                    if (response.success && response.data && Array.isArray(response.data.menus)) {
                        response.data.menus.forEach(function(menu, idx) {
                            // Select the menu at index = menuIdx
                            const selected = (idx === menuIdx) ? ' selected' : '';
                            menuOptions += '<option value="' + menu.term_id + '"' + selected + '>' + menu.name + '</option>';
                        });
                    } else {
                        menuOptions += '<option disabled>No menus found</option>';
                    }
                    const $newMenu = $(
                        '<div class="column-menu" data-menu-index="' + menuIdx + '">' +
                            '<select class="menu-select-field" name="megamenu_config[submenu_columns]['+itemId+']['+colIdx+'][menus]['+menuIdx+'][id]">' +
                                menuOptions +
                            '</select>' +
                            '<input type="text" class="menu-title-field" name="megamenu_config[submenu_columns]['+itemId+']['+colIdx+'][menus]['+menuIdx+'][title]" placeholder="Menu Title">' +
                            '<button type="button" class="button remove-menu">Remove</button>' +
                        '</div>'
                    );
                    $menusContainer.append($newMenu);
                },
                error: function() {
                    alert('Could not fetch menus from server.');
                }
            });
        }

        // Remove a menu link
        function removeMenu(e) {
            e.preventDefault();
            $(this).closest('.column-menu').remove();
        }

        // Image selection via WP media library
        function selectImage(e) {
            e.preventDefault();
            const $container = $(this).closest('.submenu-image-selector');
            // Use WP media frame if available
            if (typeof wp !== 'undefined' && wp.media) {
                const frame = wp.media({ title: 'Select Image', multiple: false });
                frame.on('select', function() {
                    const attachment = frame.state().get('selection').first().toJSON();
                    $container.find('.image-preview').css('background-image', 'url(' + attachment.url + ')');
                    $container.find('.image-id').val(attachment.id);
                    $container.find('.remove-image').show();
                });
                frame.open();
            } else {
                alert('Media library not available.');
            }
        }

        // Remove selected image
        function removeImage(e) {
            e.preventDefault();
            const $container = $(this).closest('.submenu-image-selector');
            $container.find('.image-preview').css('background-image', 'none');
            $container.find('.image-id').val('');
            $(this).hide();
        }

        // Import/export configuration handlers
        function attachImportExportHandlers() {
            // Ensure file input exists for import
            if ($('#import-file').length === 0) {
                $('body').append('<input type="file" id="import-file" accept="application/json" style="display:none" />');
            }
            // Export current config as JSON
            $('.export-config').off('click').on('click', function(e) {
                e.preventDefault();
                // Use the JS config object for export
                const data = window.megamenuConfig || {};
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'megamenu-config.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
            // Import config from JSON file
            $('.import-config').off('click').on('click', function(e) {
                e.preventDefault();
                $('#import-file').trigger('click');
            });
            $('#import-file').off('change').on('change', function(e) {
                const file = this.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = function(evt) {
                    try {
                        const imported = JSON.parse(evt.target.result);
                        window.megamenuConfig = imported;
                        applyConfigToForm(imported);
                        alert('Import successful! The form has been updated. Review and save to persist changes.');
                    } catch (err) {
                        alert('Invalid JSON file.');
                    }
                };
                reader.readAsText(file);
            });

            // Helper to apply imported config to form fields
            function applyConfigToForm(config) {
                // Helper to build menus after we have menu list
                function buildMenusAndColumns(menusList) {
                    // Set top menu
                    if (config.top_menu) {
                        $('#top_menu').val(config.top_menu).trigger('change');
                    }
                    // For each submenu item (tab/panel)
                    if (config.submenu_columns) {
                        Object.keys(config.submenu_columns).forEach(function(itemId) {
                            const columns = config.submenu_columns[itemId];
                            const $submenuItem = $('.submenu-item[data-item-id="'+itemId+'"]');
                            const $columnsContainer = $submenuItem.find('.submenu-columns');
                            $columnsContainer.empty();
                            columns.forEach(function(col, colIdx) {
                                // Build column
                                let $col = $('<div class="submenu-column" data-column-index="'+colIdx+'"></div>');
                                $col.append('<input type="text" class="column-title-field" name="megamenu_config[submenu_columns]['+itemId+']['+colIdx+'][title]" placeholder="Column Title">');
                                $col.find('.column-title-field').val(col.title || '');
                                $col.append('<select class="column-style-field" name="megamenu_config[submenu_columns]['+itemId+']['+colIdx+'][style]">'+
                                    '<option value="vertical">Vertical</option><option value="horizontal">Horizontal</option></select>');
                                $col.find('.column-style-field').val(col.style || 'vertical');
                                // Menus
                                let $menus = $('<div class="column-menus"></div>');
                                (col.menus || []).forEach(function(menu, menuIdx) {
                                    let $menu = $('<div class="column-menu" data-menu-index="'+menuIdx+'"></div>');
                                    let menuSelect = '<select class="menu-select-field" name="megamenu_config[submenu_columns]['+itemId+']['+colIdx+'][menus]['+menuIdx+'][id]">';
                                    menuSelect += '<option value="">-- Select Menu --</option>';
                                    if (menusList && menusList.length) {
                                        menusList.forEach(function(availMenu) {
                                            menuSelect += '<option value="'+availMenu.term_id+'"'+(menu.id==availMenu.term_id?' selected':'')+'>'+availMenu.name+'</option>';
                                        });
                                    }
                                    menuSelect += '</select>';
                                    $menu.append(menuSelect);
                                    $menu.append('<input type="text" class="menu-title-field" name="megamenu_config[submenu_columns]['+itemId+']['+colIdx+'][menus]['+menuIdx+'][title]" placeholder="Menu Title">');
                                    $menu.find('.menu-title-field').val(menu.title || '');
                                    $menu.append('<button type="button" class="button remove-menu">Remove</button>');
                                    $menus.append($menu);
                                });
                                $col.append($menus);
                                $col.append('<button type="button" class="button add-menu" data-item-id="'+itemId+'" data-column-index="'+colIdx+'">Add Menu</button>');
                                $col.append('<button type="button" class="button remove-column">Remove Column</button>');
                                $columnsContainer.append($col);
                            });
                        });
                    }
                    // Images
                    if (config.submenu_images) {
                        Object.keys(config.submenu_images).forEach(function(itemId) {
                            const imgId = config.submenu_images[itemId];
                            const $submenuItem = $('.submenu-item[data-item-id="'+itemId+'"]');
                            $submenuItem.find('.image-id').val(imgId);
                            // Optionally update preview (requires AJAX or preloaded URLs)
                        });
                    }
                }
                // Only fetch menus list once, cache globally
                if (window._megamenuMenusCache && Array.isArray(window._megamenuMenusCache)) {
                    buildMenusAndColumns(window._megamenuMenusCache);
                } else {
                    $.ajax({
                        url: megamenuAdmin.ajaxUrl,
                        method: 'POST',
                        data: {
                            action: 'get_available_menus',
                            nonce: megamenuAdmin.nonce
                        },
                        success: function(response) {
                            if (response.success && response.data && Array.isArray(response.data.menus)) {
                                window._megamenuMenusCache = response.data.menus;
                                buildMenusAndColumns(window._megamenuMenusCache);
                            } else {
                                alert('Could not fetch available menus for import.');
                            }
                        },
                        error: function() {
                            alert('Could not fetch available menus for import.');
                        }
                    });
                }
            }
        }
    });
})(jQuery);
