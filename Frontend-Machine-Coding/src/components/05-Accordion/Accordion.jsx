// Concepts:
// useState
// map()
// Conditional Rendering
// Toggle logic (open ↔ close)

import { useState } from "react";
import "./Accordion.css";

const items = [
  {
    id: 1,
    question: "What is React?",
    answer: "A JavaScript library for building user interfaces out of small, reusable components.",
  },
  {
    id: 2,
    question: "What is state?",
    answer: "Data owned by a component that can change over time. When state changes, React re-renders the component.",
  },
  {
    id: 3,
    question: "What are props?",
    answer: "Inputs a parent passes to a child component. The child reads props but should not change them.",
  },
  {
    id: 4,
    question: "What does useEffect do?",
    answer: "It runs code after render, for example fetching data, adding event listeners or starting timers.",
  },
];

function Accordion() {
  // 1. State
  // Only the id of the open item (null = all closed), so only one can be open at a time.
  const [openId, setOpenId] = useState(null);

  // 2. Event handlers
  function toggleItem(id) {
    // Clicking the open item closes it; clicking another item opens that one instead
    setOpenId(openId === id ? null : id);
  }

  // 3. Main logic
  // An item is open when its id equals openId (checked inside map below).

  // 4. JSX
  return (
    <div className="accordion">
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <div key={item.id} className="accordion-item">
            <button
              className="accordion-question"
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <span className="accordion-icon">{isOpen ? "−" : "+"}</span>
            </button>

            {isOpen && <p className="accordion-answer">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
