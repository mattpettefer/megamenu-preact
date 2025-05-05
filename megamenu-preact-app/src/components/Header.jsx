import { h, Component } from 'preact';
import MegaMenu from './MegaMenu';
import TopBarDesktop from './TopBarDesktop';
import TopBarMobile from './TopBarMobile';
import MobileMegaMenu from './MobileMegaMenu';

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
    const isMobileView = window.innerWidth <= 845;
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

  renderMobileHeader() {
    const { data } = this.props;
    return (
      <header>
        <div className="header-container">
          <TopBarMobile data={data} onMenuToggle={this.toggleMobileMenu} mobileMenuOpen={this.state.mobileMenuOpen} />
          <MobileMegaMenu
            data={data}
            isMobileView={true}
            mobileMenuOpen={this.state.mobileMenuOpen}
            onMenuClose={() => this.setState({ mobileMenuOpen: false })}
          />
        </div>
      </header>
    );
  }
  
  renderDesktopHeader() {
    const { data } = this.props;
    
    return (
      <header>
        <div className="header-container">
          <TopBarDesktop data={data} />
          <MegaMenu 
            data={data} 
            isMobileView={false}
            mobileMenuOpen={false}
            onMenuClose={() => {}}
          />
        </div>
      </header>
    );
  }
  
  render() {
    const { data } = this.props;
    const { isMobileView } = this.state;
    
    // If no data is provided, don't render anything
    if (!data) {
      return null;
    }

    // Render different layouts based on viewport size
    return isMobileView 
      ? this.renderMobileHeader()
      : this.renderDesktopHeader();
  }
}

export default Header;
