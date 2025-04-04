# Megamenu Preact App

A lightweight Preact-based frontend for the WordPress megamenu plugin.

## Features

- Responsive design that works on both desktop and mobile devices
- Keyboard navigation and accessibility features
- Smooth hover interactions for desktop
- Touch-friendly mobile menu with toggle button
- Lightweight bundle size for optimal performance

## Development

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The development server will run at http://localhost:9000 with hot module reloading.

### Build

```bash
# Build for production
npm run build
```

This will create a production-ready bundle in the `dist` directory.

## Integration with WordPress

The built JavaScript file (`megamenu.js`) should be copied to the WordPress plugin's assets directory and enqueued in the theme.

## Project Structure

- `src/components/` - Preact components
  - `MegaMenu.jsx` - Main component that renders the top menu and handles interactions
  - `SubMenu.jsx` - Component that renders the submenu columns and menus
- `src/styles/` - CSS styles
  - `megamenu.css` - Styles for the megamenu components
- `src/index.js` - Entry point that initializes the app
- `src/index.html` - HTML template for development

## Data Structure

The megamenu expects data in the following format:

```javascript
{
  topMenu: {
    id: 1,
    items: [
      {id: 100, title: "Menu Item 1", url: "#"},
      {id: 101, title: "Menu Item 2", url: "#"},
      // ...
    ]
  },
  subMenus: {
    "100": [
      {
        menus: [
          {
            id: 1001,
            items: [
              {id: 10011, title: "Submenu Item 1", url: "#"},
              {id: 10012, title: "Submenu Item 2", url: "#"},
              // ...
            ]
          },
          // More menus in this column...
        ]
      },
      // More columns...
    ],
    // More submenu configurations for other top menu items...
  }
}
```

This data should be available as `window.megamenuData` in the WordPress theme.
