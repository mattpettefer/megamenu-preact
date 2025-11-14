import { h } from 'preact';

/**
 * SubMenu Component
 * 
 * Renders the submenu columns and menus
 * @param {Object} props - Component props
 * @param {Array} props.columns - Array of column objects
 * @param {boolean} props.isMobileView - Whether the current view is mobile
 * @param {number} props.parentId - ID of the parent menu item
 * @param {string} props.featuredImage - URL of the featured image for this submenu
 */
const SubMenu = ({ columns, isMobileView, parentId, featuredImage }) => {
  if (!columns || !columns.length) {
    return null;
  }

  return (
    <div 
      className={`submenu ${isMobileView ? 'mobile' : ''}`}
      role="region"
      aria-label={`Submenu for item ${parentId}`}
    >
      {/* Featured image column */}
      {featuredImage && (
        <div className="column featured-image-column">
          <div className="featured-image">
            <img src={featuredImage} alt={`Featured image for submenu ${parentId}`} />
          </div>
        </div>
      )}
      
      {/* Menu columns */}
      {columns.map((column, columnIndex) => {
        // Now we can use the style property that's passed from the PHP backend
        const isHorizontal = column.style === 'horizontal';
        
        return (
          <div key={columnIndex} className="column">
            {/* Display column title if it exists */}
            {column.title && <h4 className="column-title">{column.title}</h4>}
            
            <div className={`menus-container ${isHorizontal ? 'horizontal-container' : 'vertical-container'}`}>
              {column.menus && column.menus.map((menu) => (
                <div key={menu.id} className="menu-container">
                  {menu.title && <h5 className="menu-title">{menu.title}</h5>}
                  <ul 
                    className="menu" 
                    role="menu"
                  >
                    {menu.items && menu.items.map((item) => (
                      <li key={item.id} role="menuitem" className="menu-item">
                        <a href={item.url}>{item.title}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubMenu;
