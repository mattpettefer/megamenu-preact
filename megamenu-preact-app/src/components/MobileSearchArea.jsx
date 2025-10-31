import { h } from 'preact';

const MobileSearchArea = ({ onClose }) => (
  <div className="search-area2025-mobile">
    <form
      id="searchForm2025"
      action=""
      method="GET"
      onSubmit={e => {
        e.preventDefault();
        const val = e.target.elements.s.value.trim();
        if (val) window.location.href = `?s=${encodeURIComponent(val)}`;
      }}
    >
      <input
        name="s"
        type="text"
        placeholder="SEARCH"
        autoFocus
      />
      <button type="submit">
        <i className="icon-search2025-mobile"></i>
      </button>
    </form>
    <button type="button" className="close-mobile-search" onClick={onClose} aria-label="Close search">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3"/>
        <path d="M9 9L15 15M15 9L9 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </button>
  </div>
);

export default MobileSearchArea;
