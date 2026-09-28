// Concepts:
// useState
// Event Handling
// switch statement
// String → Number conversion
// Conditional Rendering

import { useState } from "react";
import "./Calculator.css";

const OPERATORS = ["+", "−", "×", "÷"];

// Buttons row by row, 4 per row
const BUTTONS = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ".", "=", "+"];

function Calculator() {
  // 1. State
  const [previousValue, setPreviousValue] = useState(""); // first number, e.g. "12"
  const [operator, setOperator] = useState(""); // "+", "−", "×" or "÷"
  const [currentValue, setCurrentValue] = useState(""); // number being typed, e.g. "3"
  const [result, setResult] = useState(""); // answer after "=" ("" = not calculated yet)

  // 2. Event handlers
  function handleDigit(digit) {
    let value = currentValue;

    // After "=", typing a number starts a new calculation
    if (result !== "") {
      setPreviousValue("");
      setOperator("");
      setResult("");
      value = "";
    }

    if (digit === "." && value.includes(".")) return; // only one decimal point
    if (value === "0" && digit !== ".") value = ""; // "05" → "5"
    if (value === "" && digit === ".") value = "0"; // "." → "0."

    setCurrentValue(value + digit);
  }

  function handleOperator(nextOperator) {
    // Continue from the last answer: "15" then "+" → "15 +"
    if (result !== "") {
      if (result === "Error") return;
      setPreviousValue(result);
      setOperator(nextOperator);
      setCurrentValue("");
      setResult("");
      return;
    }

    // No second number yet: only switch the operator ("12 +" → "12 −")
    if (currentValue === "") {
      if (previousValue !== "") setOperator(nextOperator);
      return;
    }

    if (previousValue === "") {
      setPreviousValue(currentValue);
    } else {
      // Chaining "2 + 3 ×": first work out "2 + 3", then continue with "5 ×"
      const answer = calculate(previousValue, operator, currentValue);
      if (answer === "Error") {
        setResult("Error");
        return;
      }
      setPreviousValue(answer);
    }

    setOperator(nextOperator);
    setCurrentValue("");
  }

  function handleEquals() {
    // Need a full "a op b", and only calculate once
    if (previousValue === "" || currentValue === "" || result !== "") return;
    setResult(calculate(previousValue, operator, currentValue));
  }

  function handleClear() {
    setPreviousValue("");
    setOperator("");
    setCurrentValue("");
    setResult("");
  }

  function handleButtonClick(value) {
    if (value === "=") {
      handleEquals();
    } else if (OPERATORS.includes(value)) {
      handleOperator(value);
    } else {
      handleDigit(value);
    }
  }

  // 3. Main logic
  function calculate(a, op, b) {
    const x = Number(a);
    const y = Number(b);
    let answer;

    switch (op) {
      case "+":
        answer = x + y;
        break;
      case "−":
        answer = x - y;
        break;
      case "×":
        answer = x * y;
        break;
      case "÷":
        if (y === 0) return "Error";
        answer = x / y;
        break;
      default:
        return b;
    }

    // Remove floating-point noise: 0.1 + 0.2 = 0.30000000000000004 → "0.3"
    return String(parseFloat(answer.toFixed(10)));
  }

  // What the two display lines show.
  // Top line (only once an operator is chosen): "12 + 3 ="   ·   Big line: the answer or the number being typed
  const expression =
    operator === "" ? "" : `${previousValue} ${operator} ${currentValue} ${result !== "" ? "=" : ""}`.trim();
  const display = result !== "" ? result : currentValue || previousValue || "0";

  // 4. JSX
  return (
    <div className="calc">
      <div className="calc-display">
        <div className="calc-expression">{expression}</div>
        <div className="calc-value">{display}</div>
      </div>

      <button className="calc-clear" onClick={handleClear}>
        C
      </button>

      <div className="calc-grid">
        {BUTTONS.map((value) => (
          <button
            key={value}
            className={OPERATORS.includes(value) || value === "=" ? "calc-button calc-operator" : "calc-button"}
            onClick={() => handleButtonClick(value)}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Calculator;
