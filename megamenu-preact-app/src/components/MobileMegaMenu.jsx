import { h, Component, Fragment } from 'preact';
import SubMenu from './SubMenu';
import MobileSubMenu from './MobileSubMenu';

/**
 * MobileMegaMenu Component
 * 
 * Mobile-specific version of the mega menu
 * Optimized for touch interactions and mobile layout
 */
class MobileMegaMenu extends Component {
  state = { 
    activeMenu: null
  };

  componentDidMount() {
    // Add escape key listener for accessibility
    document.addEventListener('keydown', this.handleKeyDown);
  }
  
  componentWillUnmount() {
    // Clean up event listeners
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyDown = (e) => {
    // Close submenu on escape key
    if (e.key === 'Escape' && this.state.activeMenu !== null) {
      this.setState({ activeMenu: null });
      e.preventDefault();
    }
  };
  
  /**
   * Handle click on top menu item for mobile view
   * @param {number} menuId - ID of the menu item being clicked
   * @param {Event} e - Click event
   */
  handleMenuClick = (menuId, e) => {
    const { data } = this.props;
    
    // If submenu exists, prevent default and toggle submenu
    if (data.subMenus[menuId]) {
      e.preventDefault();
      this.setState(prevState => ({
        activeMenu: prevState.activeMenu === menuId ? null : menuId
      }));
    }
  };

  render() {
    const { data, mobileMenuOpen, onMenuClose } = this.props;
    const { activeMenu } = this.state;
    
    // If no data is provided, don't render anything
    if (!data || !data.topMenu || !data.topMenu.items) {
      return null;
    }


    return (
      
      <div className="megamenu-container mobile">
        {mobileMenuOpen && (
          <>
            <div className="small-menu-mobile">
              <ul>
                {data.smallMenu.items.map(item => (
                  <li key={item.id}>
                    <a href={item.url}>{item.title}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="dashboard-mobile2025">
              <h4>Dashboards</h4>
              <ul>
                {data.dashboards.items.map(item => (
                  <li key={item.id}>
                    <a href={item.url}>{item.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        <nav className="megamenu" aria-label="Main Navigation">
          <ul className={`top-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            
            {data.topMenu.items.map((item) => (
              <li
                key={item.id}
                className={activeMenu === item.id ? 'active' : ''}
              >
                <a 
                  href={item.url}
                  onClick={(e) => this.handleMenuClick(item.id, e)}
                  aria-expanded={activeMenu === item.id}
                  aria-haspopup={data.subMenus[item.id] ? 'true' : 'false'}
                >
                  {item.title}
                  {data.subMenus[item.id] && (
                    <span className="dropdown-indicator-mobile" aria-hidden="true"></span>
                  )}
                </a>
                
                {/* Render submenu directly below the menu item for mobile */}
                {activeMenu === item.id && data.subMenus[item.id] && (
                  <div className="submenu-wrapper mobile">
                    <MobileSubMenu
                      columns={data.subMenus[item.id]}
                      isMobileView={true}
                      parentId={item.id}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  }
}

export default MobileMegaMenu;
