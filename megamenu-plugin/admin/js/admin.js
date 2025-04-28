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
            // Use a template for menu link
            const $newMenu = $(
                '<div class="column-menu">' +
                    '<input type="text" name="" class="menu-title" placeholder="Menu Title">' +
                    '<input type="url" name="" class="menu-url" placeholder="Menu URL">' +
                    '<button type="button" class="button remove-menu">Remove Menu</button>' +
                '</div>'
            );
            $menusContainer.append($newMenu);
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
            // Export
            $('.export-config').off('click').on('click', function(e) {
                e.preventDefault();
                const $form = $(this).closest('form');
                const data = $form.serializeArray();
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
            // Import
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
                        // TODO: Apply imported config to form (requires custom logic)
                        alert('Import successful (apply logic to update form)');
                    } catch (err) {
                        alert('Invalid JSON file.');
                    }
                };
                reader.readAsText(file);
            });
        }
    });
})(jQuery);
