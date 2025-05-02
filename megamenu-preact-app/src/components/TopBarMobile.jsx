import { h, Component } from 'preact';
import SearchArea from './SearchArea';

/**
 * TopBarMobile Component
 * Mobile-specific top bar similar to desktop, but without the small menu.
 */
class TopBarMobile extends Component {
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

  handleKeyDown = (e) => {
    if (e.key === 'Escape' && this.state.isDashboardOpen) {
      this.closeDashboard();
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = (e) => {
    if (this.dashboardRef && !this.dashboardRef.contains(e.target) && this.state.isDashboardOpen) {
      this.closeDashboard();
    }
  };

  render() {
    const { data } = this.props;
    const { isDashboardOpen } = this.state;

    if (!data || !data.dashboards) {
      return null;
    }

    return (
      <div className="top-bar-mobile">
        {/* LogoBar */}
        <div className="topbar-logobar">
          <div className="crest2025">
            <img src="https://life.edu/wp-content/themes/life/images/lifecrest-green.jpg" />
          </div>
          <h1 className="banner-logo2025">
            <a className="logo2025" href="/" title="Life University"><i className="icon-logo"></i></a>
          </h1>
        </div>

        {/* Search and Dashboard */}
        <div className="topbar-menus-container">
          <SearchArea />
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

export default TopBarMobile;
