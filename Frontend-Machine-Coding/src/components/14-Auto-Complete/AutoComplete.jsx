// Concepts:
// useState
// Controlled Input
// filter() + startsWith() + slice()
// Focus / blur / keydown events
// onMouseDown vs onClick (why blur matters)
// Conditional Rendering

import { useState } from "react";
import "./AutoComplete.css";

const countries = [
  "Argentina", "Australia", "Austria", "Bangladesh", "Belgium", "Brazil", "Canada", "Chile",
  "China", "Denmark", "Egypt", "Finland", "France", "Germany", "Greece", "India", "Indonesia",
  "Ireland", "Italy", "Japan", "Kenya", "Malaysia", "Mexico", "Nepal", "Netherlands",
  "New Zealand", "Nigeria", "Norway", "Pakistan", "Portugal", "Singapore", "South Africa",
  "Spain", "Sri Lanka", "Sweden", "Switzerland", "Thailand", "United Kingdom", "United States",
  "Vietnam",
];
const MAX_SUGGESTIONS = 5;

function AutoComplete() {
  // 1. State
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 2. Event handlers
  function handleChange(e) {
    setQuery(e.target.value);
    setShowSuggestions(true);
  }

  function selectSuggestion(country) {
    setQuery(country);
    setShowSuggestions(false);
  }

  function handleFocus() {
    setShowSuggestions(true);
  }

  function handleBlur() {
    setShowSuggestions(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") setShowSuggestions(false);
  }

  // 3. Main logic
  // Countries that START with the typed text (case-insensitive), at most 5
  const searchText = query.trim().toLowerCase();
  const suggestions =
    searchText === ""
      ? []
      : countries
          .filter((country) => country.toLowerCase().startsWith(searchText))
          .slice(0, MAX_SUGGESTIONS);

  // 4. JSX
  return (
    <div className="autocomplete">
      <label htmlFor="ac-input">Country</label>

      <div className="autocomplete-box">
        <input
          id="ac-input"
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Start typing, e.g. In"
          autoComplete="off"
        />

        {showSuggestions && searchText !== "" && (
          <ul className="autocomplete-list">
            {suggestions.length === 0 ? (
              <li className="autocomplete-empty">No matches</li>
            ) : (
              suggestions.map((country) => (
                // onMouseDown, not onClick: mousedown fires BEFORE the input's blur.
                // With onClick, blur would hide the list first and the click would be lost.
                <li
                  key={country}
                  className="autocomplete-item"
                  onMouseDown={() => selectSuggestion(country)}
                >
                  {country}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AutoComplete;
