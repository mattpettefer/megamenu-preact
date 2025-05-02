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

  return (
    <div className="submenu mobile" role="menu" aria-labelledby={`menu-item-${parentId}`}> 
      <div className="submenu-columns-mobile">
        {columns.map((col, colIdx) => (
          <div className="submenu-column-mobile" key={colIdx}>
            {col.menus && col.menus.map((menu, menuIdx) => {
              const menuTitle = menu.title || `Menu ${menuIdx + 1}`;
              const isOpen = openMenus[colIdx] === menuIdx;
              return (
                <div key={menu.id || menuIdx} className="mobile-menu-accordion">
                  <button
                    className={`mobile-menu-title${isOpen ? ' open' : ''}`}
                    onClick={() => handleMenuToggle(colIdx, menuIdx)}
                    aria-expanded={isOpen}
                    aria-controls={`mobile-menu-list-${colIdx}-${menuIdx}`}
                  >
                    {menuTitle}
                  </button>
                  {isOpen && (
                    <ul id={`mobile-menu-list-${colIdx}-${menuIdx}`} className="mobile-menu-list">
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
        ))}
      </div>
    </div>
  );
}

