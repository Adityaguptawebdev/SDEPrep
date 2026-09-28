// Concepts:
// Native HTML drag and drop (draggable, onDragStart, onDragOver, onDrop, onDragEnd)
// useState
// map() + filter()
// preventDefault()

import { useState } from "react";
import "./DragDrop.css";

const columns = ["To Do", "In Progress", "Done"];

const initialItems = [
  { id: 1, text: "Learn useState", column: "Done" },
  { id: 2, text: "Build a Todo app", column: "In Progress" },
  { id: 3, text: "Practice drag and drop", column: "To Do" },
  { id: 4, text: "Revise useEffect", column: "To Do" },
  { id: 5, text: "Mock interview", column: "To Do" },
];

function DragDrop() {
  // 1. State
  const [items, setItems] = useState(initialItems); // each card knows its column
  const [draggedId, setDraggedId] = useState(null); // id of the card being dragged

  // 2. Event handlers
  function handleDragStart(e, id) {
    setDraggedId(id);
    // Firefox only starts a drag when some data is set
    e.dataTransfer.setData("text/plain", String(id));
  }

  function handleDragOver(e) {
    // By default an element does NOT accept drops. preventDefault() says "you can drop here".
    // Without this line, onDrop never fires.
    e.preventDefault();
  }

  function handleDrop(e, column) {
    e.preventDefault(); // stop the browser from opening the dragged data (Firefox)

    // Moving a card = giving it a new `column`
    setItems(items.map((item) => (item.id === draggedId ? { ...item, column: column } : item)));
    setDraggedId(null);
  }

  function handleDragEnd() {
    // Runs when the drag finishes anywhere, even if the card was dropped outside a column
    setDraggedId(null);
  }

  // 3. Main logic
  // There is no separate list per column. Each column shows
  // items.filter((item) => item.column === column), inside the JSX below.

  // 4. JSX
  return (
    <div className="dnd">
      <p className="dnd-hint">Drag a card and drop it into another column.</p>

      <div className="dnd-board">
        {columns.map((column) => {
          const columnItems = items.filter((item) => item.column === column);

          return (
            <div
              key={column}
              className="dnd-column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column)}
            >
              <h3>
                {column} <span className="dnd-count">{columnItems.length}</span>
              </h3>

              {columnItems.length === 0 && <p className="dnd-empty">Drop here</p>}

              {columnItems.map((item) => (
                <div
                  key={item.id}
                  className={item.id === draggedId ? "dnd-card dragging" : "dnd-card"}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragEnd={handleDragEnd}
                >
                  {item.text}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DragDrop;
