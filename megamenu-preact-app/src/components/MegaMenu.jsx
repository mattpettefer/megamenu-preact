import { h, Component } from 'preact';
import SubMenu from './SubMenu';

/**
 * MegaMenu Component
 * 
 * Component for the navigation menu that handles the display of submenus
 * on hover and keyboard navigation. Now works as a subcomponent of Header.
 */
class MegaMenu extends Component {
  state = { 
    activeMenu: null
  };

  componentDidMount() {
    // Add escape key listener for accessibility specifically for submenu navigation
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
   * Handle mouse enter on top menu item
   * @param {number} menuId - ID of the menu item being hovered
   */
  handleMouseEnter = (menuId) => {
    const { isMobileView } = this.props;
    if (!isMobileView) {
      this.setState({ activeMenu: menuId });
    }
  };
  
  /**
   * Handle mouse leave for the entire megamenu
   */
  handleMenuLeave = () => {
    const { isMobileView } = this.props;
    if (!isMobileView) {
      this.setState({ activeMenu: null });
    }
  };
  
  /**
   * Handle click on top menu item for mobile view
   * @param {number} menuId - ID of the menu item being clicked
   * @param {Event} e - Click event
   */
  handleMenuClick = (menuId, e) => {
    const { isMobileView, data } = this.props;
    
    if (isMobileView) {
      // If submenu exists, prevent default and toggle submenu
      if (data.subMenus[menuId]) {
        e.preventDefault();
        this.setState(prevState => ({
          activeMenu: prevState.activeMenu === menuId ? null : menuId
        }));
      }
    }
  };

  render() {
    const { data, isMobileView, mobileMenuOpen, onMenuClose } = this.props;
    const { activeMenu } = this.state;
    
    // If no data is provided, don't render anything
    if (!data || !data.topMenu || !data.topMenu.items) {
      return null;
    }

    // If a submenu is opened and then closed, notify parent
    if (activeMenu === null && this.prevActiveMenu !== null) {
      onMenuClose && onMenuClose();
    }
    this.prevActiveMenu = activeMenu;

    return (
      <div className="megamenu-container" onMouseLeave={this.handleMenuLeave}>
        <nav className="megamenu" aria-label="Main Navigation">
          <ul className={`top-menu ${isMobileView && mobileMenuOpen ? 'mobile-open' : ''}`}>
            {data.topMenu.items.map((item) => (
              <li
                key={item.id}
                onMouseEnter={() => this.handleMouseEnter(item.id)}
                className={activeMenu === item.id ? 'active' : ''}
              >
                <a 
                  href={item.url}
                  onClick={(e) => this.handleMenuClick(item.id, e)}
                  aria-expanded={activeMenu === item.id}
                  aria-haspopup={data.subMenus[item.id] ? 'true' : 'false'}
                >
                  {item.title}
                  {data.subMenus[item.id] && isMobileView && (
                    <span className="dropdown-indicator" aria-hidden="true"></span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Render submenu outside the top menu as a sibling element */}
        {activeMenu !== null && data.subMenus[activeMenu] && (
          <div className="submenu-wrapper">
            <SubMenu 
              columns={data.subMenus[activeMenu]} 
              isMobileView={isMobileView}
              parentId={activeMenu}
              featuredImage={data.submenuImages && data.submenuImages[activeMenu]}
            />
          </div>
        )}
      </div>
    );
  }
}

export default MegaMenu;
