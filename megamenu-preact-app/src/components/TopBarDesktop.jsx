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
        {/* Left side - Dashboards dropdown */}
        <div className="dashboard-menu-container" ref={ref => this.dashboardRef = ref}>
          <a 
            href="#" 
            className={`dashboard-toggle ${isDashboardOpen ? 'active' : ''}`}
            onClick={this.toggleDashboard}
            aria-expanded={isDashboardOpen}
            aria-haspopup="true"
          >
            Dashboards
            <span className="dropdown-indicator" aria-hidden="true"></span>
          </a>
          
          {/* Dashboard dropdown menu */}
          {isDashboardOpen && (
            <div className="dashboard-dropdown">
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
        
        {/* Right side - Small menu displayed horizontally */}
        <div className="small-menu-container">
          <ul className="small-menu">
            {data.smallMenu.items.map(item => (
              <li key={item.id}>
                <a href={item.url}>{item.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default TopBarDesktop;
