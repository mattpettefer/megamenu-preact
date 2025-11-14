import { h } from 'preact';

const MobileSearchArea = ({ onClose, open }) => (
  <div className="search-area2025-mobile" style={{ display: open ? 'flex' : 'none' }}>
    <div class="gse-mobile">
        <div
          className="gcse-searchbox-only"
          data-gname="mobileSearch"
          data-resultsUrl="/"
          data-queryParameterName="s"
          data-enableAutoComplete="true"
          style={{ width: '100%' }}
        ></div>
      </div>
    <button type="button" className="close-mobile-search" onClick={onClose} aria-label="Close search">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3"/>
        <path d="M9 9L15 15M15 9L9 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </button>
  </div>
);

export default MobileSearchArea;
