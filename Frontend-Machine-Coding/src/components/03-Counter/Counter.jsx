// Concepts:
// useState
// Functional State Update
// Event Handling

import { useState } from "react";
import "./Counter.css";

function Counter() {
  // 1. State
  const [count, setCount] = useState(0);

  // 2. Event handlers
  // prev => prev + 1 always starts from the latest value, even if updates are batched
  function increment() {
    setCount((prev) => prev + 1);
  }

  function decrement() {
    setCount((prev) => prev - 1);
  }

  function reset() {
    setCount(0);
  }

  // 3. Main logic
  const countClass = count < 0 ? "counter-value negative" : "counter-value";

  // 4. JSX
  return (
    <div className="counter">
      <p className={countClass}>{count}</p>

      <div className="counter-buttons">
        <button onClick={decrement} aria-label="Decrement">
          −
        </button>
        <button onClick={reset} disabled={count === 0}>
          Reset
        </button>
        <button className="primary-button" onClick={increment} aria-label="Increment">
          +
        </button>
      </div>
    </div>
  );
}

export default Counter;
