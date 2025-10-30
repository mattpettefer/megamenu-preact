import { h, Component } from 'preact';
import SubMenu from './SubMenu';

class DesktopMegaMenu extends Component {
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
   * Handle mouse enter on top menu item
   * @param {number} menuId - ID of the menu item being hovered
   */
  handleMouseEnter = (menuId) => {
    this.setState({ activeMenu: menuId });
  };
  
  /**
   * Handle mouse leave for the entire megamenu
   */
  handleMenuLeave = () => {
    this.setState({ activeMenu: null });
  };

  render() {
    const { data, onMenuClose } = this.props;
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
      <div className="megamenu-container desktop" onMouseLeave={this.handleMenuLeave}>
        <nav className="megamenu" aria-label="Main Navigation">
          <ul className="top-menu">
            {data.topMenu.items.map((item) => (
              <li
                key={item.id}
                onMouseEnter={() => this.handleMouseEnter(item.id)}
                className={activeMenu === item.id ? 'active' : ''}
              >
                <a 
                  href={item.url}
                  aria-expanded={activeMenu === item.id}
                  aria-haspopup={data.subMenus[item.id] ? 'true' : 'false'}
                >
                  {item.title}
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
              isMobileView={false}
              parentId={activeMenu}
              featuredImage={data.submenuImages && data.submenuImages[activeMenu]}
            />
          </div>
        )}
      </div>
    );
  }
}

export default DesktopMegaMenu;
