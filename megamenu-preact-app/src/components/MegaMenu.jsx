import { h, Component } from 'preact';
import SubMenu from './SubMenu';

/**
 * MegaMenu Component
 * 
 * Main component for the megamenu that renders the top menu
 * and handles the display of submenus on hover and keyboard navigation
 */
class MegaMenu extends Component {
  state = { 
    activeMenu: null,
    isMobileView: false,
    mobileMenuOpen: false
  };

  componentDidMount() {
    // Check if mobile view on mount
    this.checkMobileView();
    
    // Add resize listener for responsive behavior
    window.addEventListener('resize', this.checkMobileView);
    
    // Add escape key listener for accessibility
    document.addEventListener('keydown', this.handleKeyDown);
  }
  
  componentWillUnmount() {
    // Clean up event listeners
    window.removeEventListener('resize', this.checkMobileView);
    document.removeEventListener('keydown', this.handleKeyDown);
  }
  
  /**
   * Check if the current view is mobile
   */
  checkMobileView = () => {
    const isMobileView = window.innerWidth <= 768;
    if (isMobileView !== this.state.isMobileView) {
      this.setState({ 
        isMobileView,
        // Close mobile menu when switching views
        mobileMenuOpen: false,
        activeMenu: null
      });
    }
  };

  /**
   * Handle keyboard navigation
   */
  handleKeyDown = (e) => {
    // Close menu on escape key
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
    if (!this.state.isMobileView) {
      this.setState({ activeMenu: menuId });
    }
  };

  /**
   * Handle mouse leave on top menu item
   */
  handleMouseLeave = () => {
    if (!this.state.isMobileView) {
      this.setState({ activeMenu: null });
    }
  };
  
  /**
   * Handle mouse leave for the entire megamenu
   */
  handleMenuLeave = () => {
    if (!this.state.isMobileView) {
      this.setState({ activeMenu: null });
    }
  };
  
  /**
   * Handle click on top menu item for mobile view
   * @param {number} menuId - ID of the menu item being clicked
   * @param {Event} e - Click event
   */
  handleMenuClick = (menuId, e) => {
    if (this.state.isMobileView) {
      // If submenu exists, prevent default and toggle submenu
      if (this.props.data.subMenus[menuId]) {
        e.preventDefault();
        this.setState(prevState => ({
          activeMenu: prevState.activeMenu === menuId ? null : menuId
        }));
      }
    }
  };
  
  /**
   * Toggle mobile menu open/closed
   */
  toggleMobileMenu = () => {
    this.setState(prevState => ({
      mobileMenuOpen: !prevState.mobileMenuOpen,
      activeMenu: null
    }));
  };

  render() {
    const { data } = this.props;
    const { activeMenu, isMobileView, mobileMenuOpen } = this.state;
    
    // If no data is provided, don't render anything
    if (!data || !data.topMenu || !data.topMenu.items) {
      return null;
    }

    return (
      <div className="megamenu-container" onMouseLeave={this.handleMenuLeave}>
        <nav className="megamenu" aria-label="Main Navigation">
          {isMobileView && (
            <button 
              className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
              onClick={this.toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              <span className="menu-icon"></span>
              <span className="sr-only">Menu</span>
            </button>
          )}
          
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
            />
          </div>
        )}
      </div>
    );
  }
}

export default MegaMenu;
