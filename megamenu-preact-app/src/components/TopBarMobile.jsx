import { h, Component } from 'preact';
import SearchArea from './SearchArea';
import MobileSearchArea from './MobileSearchArea';

/**
 * TopBarMobile Component
 * Mobile-specific top bar similar to desktop, but without the small menu.
 */
class TopBarMobile extends Component {
  state = {
    isDashboardOpen: false,
    searchMode: false
  };

  toggleDashboard = (e) => {
    e.preventDefault();
    this.setState(prevState => ({
      isDashboardOpen: !prevState.isDashboardOpen
    }));
  };

  closeDashboard = () => {
    this.setState({ isDashboardOpen: false });
  };

  handleKeyDown = (e) => {
    if (e.key === 'Escape' && this.state.isDashboardOpen) {
      this.closeDashboard();
    }
  };

  handleOpenSearch = () => this.setState({ searchMode: true });
  handleCloseSearch = () => this.setState({ searchMode: false });

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleKeyDown = (e) => {
    if (e.key === 'Escape' && this.state.searchMode) {
      this.handleCloseSearch();
    }
    if (e.key === 'Escape' && this.state.isDashboardOpen) {
      this.closeDashboard();
    }
  };

  handleClickOutside = (e) => {
    if (this.dashboardRef && !this.dashboardRef.contains(e.target) && this.state.isDashboardOpen) {
      this.closeDashboard();
    }
  };

  render() {
    const { data } = this.props;
    const { isDashboardOpen, searchMode } = this.state;

    if (!data || !data.dashboards) {
      return null;
    }

    if (searchMode) {
      return <MobileSearchArea onClose={this.handleCloseSearch} />;
    }

    return (
      <div className="top-bar-mobile">
        {/* LogoBar */}
        <div className="topbar-logobar">
          <div className="crest2025">
            <img src="https://life.edu/wp-content/themes/life/images/lifecrest.jpg" />
          </div>
          <h1 className="banner-logo2025">
            <a className="logo2025" href="/" title="Life University"><i className="icon-logo"></i></a>
          </h1>
        </div>

        {/* Search icon and Hamburger menu */}
        <div className="topbar-menus-container" style={{ display: 'flex', alignItems: 'center' }}>
          <button
            type="button"
            className="mobile-search-trigger"
            aria-label="Open search"
            onClick={this.handleOpenSearch}
            style={{ background: 'none', border: 'none', padding: 0, marginRight: '1em', cursor: 'pointer' }}
          >
            <i className="icon-search2025-opener"></i>
          </button>
          <button
            type="button"
            className={`mobile-menu-toggle hamburger2025${this.props.mobileMenuOpen ? ' close-menu-x' : ''}`}

            aria-label="Open menu"
            onClick={this.props.onMenuToggle}
          >
          </button>
        </div>
      </div>
    );
  }
}

export default TopBarMobile;
