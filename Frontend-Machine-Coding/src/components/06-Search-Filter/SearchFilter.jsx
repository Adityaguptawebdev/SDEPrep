// Concepts:
// useState
// Controlled Input
// filter()
// toLowerCase() + includes() for case-insensitive search
// Derived state (the filtered list is NOT stored in state)
// Conditional Rendering (empty state)

import { useState } from "react";
import "./SearchFilter.css";

const fruits = [
  "Apple", "Apricot", "Avocado", "Banana", "Blueberry", "Cherry", "Coconut",
  "Grape", "Guava", "Kiwi", "Lemon", "Lychee", "Mango", "Orange",
  "Papaya", "Peach", "Pear", "Pineapple", "Pomegranate", "Strawberry", "Watermelon",
];

function SearchFilter() {
  // 1. State
  const [query, setQuery] = useState("");

  // 2. Event handlers
  function handleChange(e) {
    setQuery(e.target.value);
  }

  function clearSearch() {
    setQuery("");
  }

  // 3. Main logic
  // Recalculated on every render from `query`. An empty search text matches everything,
  // because every string includes "".
  const searchText = query.trim().toLowerCase();
  const filteredFruits = fruits.filter((fruit) => fruit.toLowerCase().includes(searchText));

  // 4. JSX
  return (
    <div className="search">
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search fruits…"
          aria-label="Search fruits"
        />
        {query !== "" && <button onClick={clearSearch}>Clear</button>}
      </div>

      <p className="search-count">
        Showing {filteredFruits.length} of {fruits.length}
      </p>

      {filteredFruits.length === 0 ? (
        <p className="search-empty">No fruits match "{query}".</p>
      ) : (
        <ul className="search-list">
          {filteredFruits.map((fruit) => (
            <li key={fruit}>{fruit}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchFilter;
