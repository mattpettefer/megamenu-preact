import { h, Component } from 'preact';

/**
 * TopBarDesktop Component
 * 
 * Desktop-specific top bar that contains:
 * 1. A "Dashboards" dropdown menu on the left that opens on click
 * 2. A horizontal menu with items from smallMenu on the right
 */
class TopBarDesktop extends Component {
  state = {
    isDashboardOpen: false
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

  // Close dashboard menu on escape key
  handleKeyDown = (e) => {
    if (e.key === 'Escape' && this.state.isDashboardOpen) {
      this.closeDashboard();
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    // Close menu when clicking outside
    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = (e) => {
    // Close dashboard dropdown if click is outside
    if (this.dashboardRef && !this.dashboardRef.contains(e.target) && this.state.isDashboardOpen) {
      this.closeDashboard();
    }
  };

  render() {
    const { data } = this.props;
    const { isDashboardOpen } = this.state;

    // Early return if data isn't available
    if (!data || !data.smallMenu || !data.dashboards) {
      return null;
    }

    return (
      <div className="top-bar-desktop">
        {/* Left side - LogoBar HTML */}
        <div className="topbar-logobar">
          <div className="crest2025">
            <img src="https://life.edu/wp-content/themes/life/images/lifecrest-green.jpg" />
          </div>
          <h1 className="banner-logo2025">
            <a className="logo2025" href="/" title="Life University"><i className="icon-logo"></i></a>
          </h1>
        </div>

        {/* Center & Right - Menus container */}
        <div className="topbar-menus-container">
          <div className="search-area2025">
            <form id="searchForm2025">
              <input id="jsSearchValue" type="text" placeholder="SEARCH" />
            </form>
            <a id="jsSearchButton" href="#"><i className="icon-search2025"></i></a>
          </div>
          <div className="small-menu-container">
            <ul className="small-menu">
              {data.smallMenu.items.map(item => (
                <li key={item.id}>
                  <a href={item.url}>{item.title}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="dashboard-menu-container" ref={ref => this.dashboardRef = ref}>
            <a 
              href="#" 
              className={`dashboard-toggle2025 ${isDashboardOpen ? 'active' : ''}`}
              onClick={this.toggleDashboard}
              aria-expanded={isDashboardOpen}
              aria-haspopup="true"
            >
              <div className="eagle-icon2025">
                <img src="https://life.edu/wp-content/themes/life/images/life_u_eagle_transparent.gif" />
              </div>
              <span className="dropdown-indicator2025" aria-hidden="true"></span>
            </a>
            {isDashboardOpen && (
              <div className="dashboard-dropdown2025">
                <ul>
                  {data.dashboards.items.map(item => (
                    <li key={item.id}>
                      <a href={item.url}>{item.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default TopBarDesktop;
