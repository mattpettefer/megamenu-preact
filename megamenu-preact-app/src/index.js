import { h, render } from 'preact';
import Header from './components/Header';
import './styles/megamenu.css';

// Entry point for the application
const init = () => {
  const container = document.getElementById('megamenu-container');
  
  if (container && window.megamenuData) {
    render(<Header data={window.megamenuData} />, container);
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export the components for usage
export { default as Header } from './components/Header';
export { default as MegaMenu } from './components/MegaMenu';
