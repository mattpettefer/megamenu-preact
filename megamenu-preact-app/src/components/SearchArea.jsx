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
      {open ? (
        <>
          <form id="searchForm2025" action="" method="GET" onSubmit={e => {
            e.preventDefault();
            if (search.trim()) {
              window.location.href = `?s=${encodeURIComponent(search)}`;
            }
          }}>
            <input
              id="jsSearchValue"
              type="text"
              placeholder="SEARCH"
              autoFocus
              value={search}
              onInput={e => setSearch(e.target.value)}
            />
          </form>
          <a
            href={search.trim() ? `?s=${encodeURIComponent(search)}` : "#"}
            onClick={e => {
              if (!search.trim()) { e.preventDefault(); return; }
              // allow default if search is present
            }}
          >
            <i className="icon-search2025"></i>
          </a>
        </>
      ) : (
        <a
          href="#"
          className="search-area2025-icon-link"
          aria-label="Open search"
          onClick={e => { e.preventDefault(); setOpen(true); }}
        >
          <i className="icon-search2025"></i>
        </a>
      )}
    </div>
  );
};

export default SearchArea;
