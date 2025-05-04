import { h } from 'preact';
import { useState } from 'preact/hooks';

/**
 * MobileSubMenu - mobile version with accordion logic and required menu titles.
 * @param {Object[]} columns - Array of submenu columns (links grouped by column)
 * @param {boolean} isMobileView - If true, renders in mobile mode (for future extensibility)
 * @param {string|number} parentId - The parent menu item id
 */
export default function MobileSubMenu({ columns = [], isMobileView, parentId }) {
  // Track open menu index per column
  const [openMenus, setOpenMenus] = useState({});

  const handleMenuToggle = (colIdx, menuIdx) => {
    setOpenMenus(prev => ({
      ...prev,
      [colIdx]: prev[colIdx] === menuIdx ? null : menuIdx
    }));
  };

  // Flatten all menus from all columns
  const allMenus = columns.reduce((acc, col) => {
    if (Array.isArray(col.menus)) {
      return acc.concat(col.menus);
    }
    return acc;
  }, []);

  // Track open menu index globally (since all menus are now siblings)
  const [openMenuIdx, setOpenMenuIdx] = useState(null);

  return (
    <div className="submenu mobile" role="menu" aria-labelledby={`menu-item-${parentId}`}> 
      <div className="submenu-columns-mobile">
        {allMenus.map((menu, menuIdx) => {
          const menuTitle = menu.title || `Menu ${menuIdx + 1}`;
          const isOpen = openMenuIdx === menuIdx;
          return (
            <div key={menu.id || menuIdx} className="mobile-menu-accordion">
              <button
                className={`mobile-menu-title${isOpen ? ' open' : ''}`}
                onClick={() => setOpenMenuIdx(isOpen ? null : menuIdx)}
                aria-expanded={isOpen}
                aria-controls={`mobile-menu-list-${menuIdx}`}
              >
                {menuTitle}
              </button>
              {isOpen && (
                <ul id={`mobile-menu-list-${menuIdx}`} className="mobile-menu-list">
                  {menu.items && menu.items.map(link => (
                    <li key={link.id}>
                      <a href={link.url}>{link.title}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

