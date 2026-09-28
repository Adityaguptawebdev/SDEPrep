// Concepts:
// useState (boolean)
// Conditional Rendering (&&)
// Event Bubbling + stopPropagation()
// useEffect (Escape key listener + cleanup)

import { useEffect, useState } from "react";
import "./Modal.css";

function Modal() {
  // 1. State
  const [isOpen, setIsOpen] = useState(false);

  // 2. Event handlers
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  // 3. Main logic
  // Close with the Escape key. We only listen while the modal is open.
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    // Cleanup: remove the listener when the modal closes or the component unmounts
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // 4. JSX
  return (
    <div className="modal-demo">
      <p>
        Close the modal with ×, the Close button, a click on the dark overlay, or the Escape key.
      </p>
      <button className="primary-button" onClick={openModal}>
        Open Modal
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          {/* stopPropagation: a click inside the box must not bubble up to the overlay */}
          <div
            className="modal-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 id="modal-title">Hello 👋</h3>
              <button className="modal-close" onClick={closeModal} aria-label="Close">
                ×
              </button>
            </div>
            <p>
              This modal is only in the DOM while <code>isOpen</code> is true. Clicking inside this
              box does not close it.
            </p>
            <div className="modal-footer">
              <button className="primary-button" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Modal;
