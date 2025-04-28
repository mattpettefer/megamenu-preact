import { h } from 'preact';
import DesktopMegaMenu from './DesktopMegaMenu';
import MobileMegaMenu from './MobileMegaMenu';

/**
 * MegaMenu Component
 * 
 * Parent component that decides whether to render the mobile or desktop version
 * of the mega menu based on the current viewport size.
 */
function MegaMenu(props) {
  const { isMobileView } = props;
  
  // Render the appropriate version based on viewport size
  return isMobileView ? (
    <MobileMegaMenu {...props} />
  ) : (
    <DesktopMegaMenu {...props} />
  );
}

export default MegaMenu;
