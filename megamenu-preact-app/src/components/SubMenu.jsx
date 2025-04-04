import { h } from 'preact';

/**
 * SubMenu Component
 * 
 * Renders the submenu columns and menus
 * @param {Object} props - Component props
 * @param {Array} props.columns - Array of column objects
 * @param {boolean} props.isMobileView - Whether the current view is mobile
 * @param {number} props.parentId - ID of the parent menu item
 */
const SubMenu = ({ columns, isMobileView, parentId }) => {
  if (!columns || !columns.length) {
    return null;
  }

  return (
    <div 
      className={`submenu ${isMobileView ? 'mobile' : ''}`}
      role="region"
      aria-label={`Submenu for item ${parentId}`}
    >
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="column">
          {column.menus && column.menus.map((menu) => (
            <ul key={menu.id} className="menu" role="menu">
              {menu.items && menu.items.map((item) => (
                <li key={item.id} role="menuitem">
                  <a href={item.url}>{item.title}</a>
                </li>
              ))}
            </ul>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SubMenu;
