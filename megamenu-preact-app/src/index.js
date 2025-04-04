import { h, render } from 'preact';
import MegaMenu from './components/MegaMenu';
import './styles/megamenu.css';

// Entry point for the application
const init = () => {
  const container = document.getElementById('megamenu-container');
  
  if (container && window.megamenuData) {
    render(<MegaMenu data={window.megamenuData} />, container);
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export the component for usage
export default MegaMenu;
