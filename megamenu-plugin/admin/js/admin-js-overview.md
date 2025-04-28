# `admin.js` Overview

## Purpose

The `admin.js` file is responsible for handling all dynamic, client-side interactions in the Megamenu admin settings page of the WordPress plugin. Its main job is to enhance the PHP-rendered admin UI with interactive features, making it easier for users to configure complex megamenu structures without page reloads or manual HTML editing.

## What `admin.js` Is Supposed to Do

- **Auto-submit Top Menu Selection:**
  - When an admin selects a different "top menu" from a dropdown, the form is automatically submitted so that PHP can re-render the submenu configuration for the selected menu.

- **Enhance PHP-Rendered Submenu HTML:**
  - On page load, if the submenu configuration HTML is already present (output by PHP), the script attaches JavaScript event handlers to enable dynamic editing. No AJAX is used for initial rendering.

- **Dynamic Submenu Editing:**
  - **Add/Remove Columns:** Users can add or remove columns to submenu items dynamically.
  - **Add/Remove Menus:** Users can add or remove menu links within each column.
  - **Image Selection:** Users can select or remove featured images for submenu items via the WordPress media library.
  - **Tab Navigation:** For menus with multiple submenu items, tabbed navigation allows switching between different submenu configurations.
  - **Import/Export:** Users can export the current megamenu configuration as JSON or import a previously saved configuration.

- **No Destructive Overwrites:**
  - The script never overwrites the PHP-rendered HTML structure on page load. It only manipulates the DOM in response to user actions (add/remove/edit), ensuring that all existing data is preserved.

## Design Principles

- **PHP-First Rendering:** The full submenu configuration is rendered server-side by PHP, ensuring all data is present and correct on page load.
- **JS-Only Enhancement:** JavaScript is used solely to enhance interactivity and user experience, not to fetch or build the initial structure.
- **Progressive Enhancement:** If JavaScript is disabled, the form remains usable, but without dynamic features.

## Key Functions (Expected)
- `attachDynamicHandlers()`: Binds all event handlers for dynamic actions (add/remove column/menu, image selection, tab navigation, import/export).
- Handler stubs like `addColumn()`, `removeColumn()`, `addMenu()`, `removeMenu()`, `selectImage()`, `removeImage()`, and `attachImportExportHandlers()` are to be implemented for the specific dynamic behaviors.

## Typical Workflow
1. Admin loads the Megamenu settings page.
2. PHP renders the full submenu configuration for the selected top menu.
3. `admin.js` attaches all dynamic handlers to the existing HTML.
4. Admin can add/remove columns, menus, images, and switch tabs—all changes happen instantly in the UI.
5. When ready, the admin saves the form; all data is submitted to PHP for processing.

---

If you need to implement or debug a specific dynamic feature, start by editing or extending the appropriate handler function in `admin.js`.
