// Concepts:
// useState (saved rating + hovered star)
// map() over [1, 2, 3, 4, 5]
// Conditional class names
// Mouse events (onClick, onMouseEnter, onMouseLeave)

import { useState } from "react";
import "./StarRating.css";

const STARS = [1, 2, 3, 4, 5];
const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"]; // index = rating

function StarRating() {
  // 1. State
  const [rating, setRating] = useState(0); // saved rating (0 = none yet)
  const [hover, setHover] = useState(0); // star under the mouse (0 = none)

  // 2. Event handlers
  function handleClick(star) {
    setRating(star);
  }

  function handleMouseEnter(star) {
    setHover(star);
  }

  function handleMouseLeave() {
    setHover(0);
  }

  // 3. Main logic
  // While hovering, preview the hovered star; otherwise show the saved rating.
  // `hover || rating` means: use hover unless it is 0 (0 is falsy).
  const activeValue = hover || rating;

  // 4. JSX
  return (
    <div className="rating">
      {/* onMouseLeave on the wrapper, so moving between stars does not flicker */}
      <div className="rating-stars" onMouseLeave={handleMouseLeave}>
        {STARS.map((star) => (
          <button
            key={star}
            type="button"
            className={star <= activeValue ? "rating-star filled" : "rating-star"}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            aria-label={`Rate ${star} out of 5`}
          >
            ★
          </button>
        ))}
      </div>

      <p className="rating-text">
        {rating === 0
          ? "No rating yet. Click a star."
          : `You rated ${rating} out of 5 · ${LABELS[rating]}`}
      </p>
    </div>
  );
}

export default StarRating;
