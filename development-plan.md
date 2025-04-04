# Project: WordPress Megamenu App

## Overview
This project creates a WordPress megamenu app with a PHP backend and a Preact frontend. The app allows admins to configure a top-level menu and submenus organized into columns, each containing multiple classic WordPress menus. The generated data must match the specified structure, where `subMenus[topMenuItemId]` is an array of columns, each with an array of menus.

- **Backend**: PHP-based, with a WordPress settings page for configuration.
- **Frontend**: Lightweight Preact component for rendering the megamenu.
- **Menu Structure**: One top menu with six items (e.g., "Admissions", "Academics"). Each item links to a submenu with columns of menus.
- **Data Structure**: Ensure `subMenus[topMenuItemId]` is an array of columns, each containing an array of menus, each with items.

## Backend

### Settings Page
**Description**: Create a WordPress settings page for admins to configure the megamenu.

- **Location**: Add a page under `Appearance > Megamenu Settings` using the WordPress Settings API.
- **Storage**: Save configuration in a WordPress option named `megamenu_config` using `update_option()`.

**Fields**:
- **Top Menu**:
  - Type: Dropdown
  - Source: List of existing WordPress menus using `wp_get_nav_menus()`.
  - Label: "Select Top Menu"
- **Submenu Columns**:
  - For each top menu item, allow configuration of columns.
  - Use repeatable fields to add columns.
  - Each column has a repeatable field to select multiple WordPress menus.
  - Labels: "Add Column", "Add Menu to Column"
  - Source for Menus: List of WordPress menus using `wp_get_nav_menus()`.

**Example Configuration**:
```php
$config = [
  'top_menu' => 'main-menu-id',
  'submenu_columns' => [
    '100' => [
      ['menus' => ['apply-menu-id', 'visit-menu-id']],
      ['menus' => ['tuition-aid-menu-id']],
    ],
    '101' => [
      ['menus' => ['undergraduate-menu-id']],
      ['menus' => ['graduate-menu-id', 'online-menu-id']],
    ],
  ],
];

Data Preparation
Description: Prepare and output menu data for the frontend in header.php.
Retrieve Configuration: Use get_option('megamenu_config') to fetch the saved configuration.

Fetch Menu Items:
Use wp_get_nav_menu_items($menu_id) to get items for the top menu and each submenu menu.

Build JSON:
Structure:
topMenu: Object with id (menu ID) and items (array of top menu items: id, title, url).

subMenus: Object where each key is a top menu item id (as a string), and the value is an array of columns. Each column is an object with a menus array, where each menu has id and items (array of submenu items: id, title, url).

Output in a <script> tag as window.megamenuData.

Code:
php

$top_menu_items = wp_get_nav_menu_items($config['top_menu']);
$submenu_data = [];
foreach ($config['submenu_columns'] as $top_item_id => $columns) {
  $column_data = [];
  foreach ($columns as $column) {
    $menus = [];
    foreach ($column['menus'] as $menu_id) {
      $menus[] = [
        'id' => $menu_id,
        'items' => wp_get_nav_menu_items($menu_id),
      ];
    }
    $column_data[] = ['menus' => $menus];
  }
  $submenu_data[$top_item_id] = $column_data;
}

$data = [
  'topMenu' => ['id' => $config['top_menu'], 'items' => $top_menu_items],
  'subMenus' => $submenu_data,
];
?>
<script type="text/javascript">
  window.megamenuData = <?php echo json_encode($data); ?>;
</script>

Output Example:
json

{
  "topMenu": {
    "id": 1,
    "items": [
      {"id": 100, "title": "Admissions", "url": "#"},
      {"id": 101, "title": "Academics", "url": "#"}
    ]
  },
  "subMenus": {
    "100": [
      {
        "menus": [
          {
            "id": 1001,
            "items": [
              {"id": 10011, "title": "Apply Now", "url": "#"},
              {"id": 10012, "title": "Application Guide", "url": "#"}
            ]
          },
          {
            "id": 1002,
            "items": [
              {"id": 10021, "title": "Campus Tours", "url": "#"},
              {"id": 10022, "title": "Virtual Tour", "url": "#"}
            ]
          }
        ]
      },
      {
        "menus": [
          {
            "id": 1003,
            "items": [
              {"id": 10031, "title": "Tuition Fees", "url": "#"},
              {"id": 10032, "title": "Financial Aid", "url": "#"}
            ]
          }
        ]
      }
    ]
  }
}

HTML Placeholder:
Add <div id="megamenu-container"></div> in header.php for Preact to render into.

Frontend
Setup
Description: Set up Preact and the megamenu script in WordPress.
Enqueue Scripts:
In functions.php, enqueue Preact and the custom megamenu script.

Preact via CDN: https://unpkg.com/preact@latest/dist/preact.umd.js.

Custom script: megamenu.js in the theme’s js directory.

Code:
php

wp_enqueue_script('preact', 'https://unpkg.com/preact@latest/dist/preact.umd.js', [], null, true);
wp_enqueue_script('megamenu', get_template_directory_uri() . '/js/megamenu.js', ['preact'], null, true);

Preact Component
Description: Create a MegaMenu component in megamenu.js to render the menu.
File: megamenu.js

Framework: Preact

Functionality:
Render the top menu as a horizontal list.

On hover, display the submenu for the active top menu item.

Submenu displays columns side by side, with each column containing menus stacked vertically.

Use state to manage the active submenu.

Code:
javascript

import { h, render, Component } from 'preact';

class MegaMenu extends Component {
  state = { activeMenu: null };

  handleMouseEnter = (menuId) => this.setState({ activeMenu: menuId });
  handleMouseLeave = () => this.setState({ activeMenu: null });

  render() {
    const { topMenu, subMenus } = window.megamenuData;
    return (
      <nav className="megamenu">
        <ul className="top-menu">
          {topMenu.items.map((item) => (
            <li
              key={item.id}
              onMouseEnter={() => this.handleMouseEnter(item.id)}
              onMouseLeave={this.handleMouseLeave}
            >
              <a href={item.url}>{item.title}</a>
              {this.state.activeMenu === item.id && subMenus[item.id] && (
                <div className="submenu">
                  {subMenus[item.id].map((column, index) => (
                    <div key={index} className="column">
                      {column.menus.map((menu) => (
                        <ul key={menu.id}>
                          {menu.items.map((subItem) => (
                            <li key={subItem.id}>
                              <a href={subItem.url}>{subItem.title}</a>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

render(<MegaMenu />, document.getElementById('megamenu-container'));

Styling
CSS
Description: Style the megamenu to display columns side by side.
File: style.css

Requirements:
Top menu: Horizontal list with a green background (#006633).

Submenu: Absolute positioned below the top menu, with columns in a flex layout.

Responsive: Stack columns vertically on mobile (below 768px).

Code:
css

.megamenu {
  position: relative;
}
.top-menu {
  list-style: none;
  display: flex;
  background: #006633;
  padding: 0;
  margin: 0;
}
.top-menu li {
  position: relative;
  padding: 15px 20px;
  color: white;
  cursor: pointer;
}
.submenu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.column {
  flex: 1;
  padding: 0 15px;
}
.column ul {
  list-style: none;
  padding: 0;
}
.column li {
  padding: 5px 0;
}
@media (max-width: 768px) {
  .submenu {
    flex-direction: column;
  }
}

Testing
Test Cases
Description: Ensure the app works as expected.
Admin Configuration:
Verify the settings page allows selecting a top menu and configuring columns with multiple menus.

Confirm the configuration saves correctly in megamenu_config.

Data Output:
Check that window.megamenuData matches the expected structure: subMenus[topMenuItemId] is an array of columns, each with an array of menus.

Frontend Rendering:
Ensure the top menu renders with six items.

Verify submenus display as columns side by side on desktop, stacking on mobile.

Confirm hover interactions work to show/hide submenus.

Accessibility:
Add ARIA attributes: aria-haspopup="true" on top menu items, aria-expanded based on activeMenu.

Test keyboard navigation with tabindex and focus management.

Notes
The data structure ensures subMenus[topMenuItemId] is an array of columns, each containing an array of menus, as specified.

Customize menu titles and URLs in the WordPress admin panel as needed.

Ensure Preact is loaded before megamenu.js to avoid runtime errors.

## Code Section: Preact Component

```javascript
import { h, render, Component } from 'preact';

class MegaMenu extends Component {
  state = { activeMenu: null };

  handleMouseEnter = (menuId) => this.setState({ activeMenu: menuId });
  handleMouseLeave = () => this.setState({ activeMenu: null });

  render() {
    const { topMenu, subMenus } = window.megamenuData;
    return (
      <nav className="megamenu">
        <ul className="top-menu">
          {topMenu.items.map((item) => (
            <li
              key={item.id}
              onMouseEnter={() => this.handleMouseEnter(item.id)}
              onMouseLeave={this.handleMouseLeave}
            >
              <a href={item.url}>{item.title}</a>
              {this.state.activeMenu === item.id && subMenus[item.id] && (
                <div className="submenu">
                  {subMenus[item.id].map((column, index) => (
                    <div key={index} className="column">
                      {column.menus.map((menu) => (
                        <ul key={menu.id}>
                          {menu.items.map((subItem) => (
                            <li key={subItem.id}>
                              <a href={subItem.url}>{subItem.title}</a>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

render(<MegaMenu />, document.getElementById('megamenu-container'));

