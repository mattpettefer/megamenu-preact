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
        ×
      </button>
  </div>
);

export default MobileSearchArea;
