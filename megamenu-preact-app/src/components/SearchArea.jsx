import { h, Fragment } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';

/**
 * SearchArea Component
 * Standalone search area for TopBarDesktop
 * Now supports open/close state
 */
const SearchArea = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);


  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div
      ref={searchRef}
      className={open ? 'search-area2025' : 'search-area2025 search-area2025-closed'}
    >
      <div class="gse-desktop" style={{ display: open ? 'block' : 'none' }}>
        <div
          className="gcse-searchbox-only"
          data-gname="desktopSearch"
          data-resultsUrl="/"
          data-queryParameterName="s"
          data-enableAutoComplete="true"
          style={{ width: '100%' }}
        ></div>
      </div>
      <a
        href="#"
        className="search-area2025-icon-link"
        aria-label="Open search"
        onClick={e => { e.preventDefault(); setOpen(true); }}
        style={{ display: open ? 'none' : 'block' }}
      >
        <i className="icon-search2025"></i>
      </a>
    </div>
  );
};

export default SearchArea;
