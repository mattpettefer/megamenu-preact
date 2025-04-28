import { h, Component } from 'preact';
import MegaMenu from './MegaMenu';

/**
 * Header Component
 * 
 * Main header component that contains navigation elements including the MegaMenu
 */
class Header extends Component {
  state = { 
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
        mobileMenuOpen: false
      });
    }
  };

  /**
   * Handle keyboard navigation
   */
  handleKeyDown = (e) => {
    // Close menu on escape key - we'll let MegaMenu handle its own state
    if (e.key === 'Escape' && this.state.mobileMenuOpen) {
      this.setState({ mobileMenuOpen: false });
      e.preventDefault();
    }
  };
  
  /**
   * Toggle mobile menu open/closed
   */
  toggleMobileMenu = () => {
    this.setState(prevState => ({
      mobileMenuOpen: !prevState.mobileMenuOpen
    }));
  };

  render() {
    const { data } = this.props;
    const { isMobileView, mobileMenuOpen } = this.state;
    
    // If no data is provided, don't render anything
    if (!data) {
      return null;
    }

    return (
      <header className="site-header">
        <div className="header-container">
          {/* Logo area */}
          <div className="logo-container">
            <a href="/" className="site-logo">
              {/* If there's a logo in the data, use it, otherwise use a text fallback */}
              {data.logo ? (
                <img src={data.logo} alt={data.siteTitle || 'Site Logo'} />
              ) : (
                <span className="site-title">{data.siteTitle || 'Site Title'}</span>
              )}
            </a>
          </div>
          
          {/* Mobile menu toggle button */}
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
          
          {/* MegaMenu component */}
          <MegaMenu 
            data={data} 
            isMobileView={isMobileView} 
            mobileMenuOpen={mobileMenuOpen}
            onMenuClose={() => this.setState({ mobileMenuOpen: false })}
          />
        </div>
      </header>
    );
  }
}

export default Header;
