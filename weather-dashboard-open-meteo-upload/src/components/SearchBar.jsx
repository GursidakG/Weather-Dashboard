import { LocateFixed, Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar({ defaultCity, history, loading, onGeolocate, onSearch }) {
  const [query, setQuery] = useState(defaultCity);

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(query);
  }

  return (
    <section className="search-shell" aria-label="Weather search">
      <form className="search-bar" onSubmit={handleSubmit}>
        <Search size={20} aria-hidden="true" />
        <input
          aria-label="Search city"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a city"
        />
        <button type="submit" disabled={loading}>
          Search
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={onGeolocate}
          title="Use current location"
          aria-label="Use current location"
        >
          <LocateFixed size={18} />
        </button>
      </form>

      {history.length > 0 && (
        <div className="history-list" aria-label="Recent searches">
          {history.map((item) => (
            <button key={item} type="button" onClick={() => onSearch(item)}>
              {item}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
