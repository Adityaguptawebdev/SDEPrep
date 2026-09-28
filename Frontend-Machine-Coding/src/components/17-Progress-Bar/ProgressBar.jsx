// Concepts:
// useState
// Inline style for the bar width
// Math.min / Math.max to keep the value between 0 and 100
// useEffect + setTimeout + cleanup (auto fill)
// CSS animation (loading spinner)

import { useEffect, useState } from "react";
import "./ProgressBar.css";

const STEP = 10;

function ProgressBar() {
  // 1. State
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isRunning, setIsRunning] = useState(false); // is auto fill running?

  // 2. Event handlers
  function increase() {
    setProgress(Math.min(progress + STEP, 100)); // never above 100
  }

  function decrease() {
    setProgress(Math.max(progress - STEP, 0)); // never below 0
  }

  function toggleAutoFill() {
    setIsRunning(!isRunning);
  }

  function reset() {
    setProgress(0);
    setIsRunning(false);
  }

  // 3. Main logic
  // While running: every time `progress` changes, wait 200 ms and add 5%.
  // Stop at 100%. The cleanup cancels a waiting timer (pause, reset or leaving the page).
  useEffect(() => {
    if (!isRunning) return;

    const timer = setTimeout(() => {
      const next = Math.min(progress + 5, 100);
      setProgress(next);
      if (next === 100) setIsRunning(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [isRunning, progress]);

  let statusText = "Not started";
  if (progress === 100) {
    statusText = "Complete ✅";
  } else if (isRunning) {
    statusText = "Loading…";
  } else if (progress > 0) {
    statusText = "In progress";
  }

  // 4. JSX
  return (
    <div className="progress">
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* The width comes straight from state */}
        <div
          className={progress === 100 ? "progress-fill complete" : "progress-fill"}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="progress-status">
        {isRunning && <span className="progress-spinner" aria-hidden="true" />}
        <strong>{progress}%</strong>
        <span>{statusText}</span>
      </div>

      <div className="progress-buttons">
        <button onClick={decrease} disabled={progress === 0}>
          −10%
        </button>
        <button onClick={increase} disabled={progress === 100}>
          +10%
        </button>
        <button className="primary-button" onClick={toggleAutoFill} disabled={progress === 100}>
          {isRunning ? "Pause" : "Auto fill"}
        </button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

export default ProgressBar;
