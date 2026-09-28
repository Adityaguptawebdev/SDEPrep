// Concepts:
// useState with an array of objects
// map() to render inputs · filter() to remove · map() to update one item
// Stable id as key (not the index)
// Form submit

import { useState } from "react";
import "./DynamicForm.css";

function DynamicForm() {
  // 1. State
  const [fields, setFields] = useState([{ id: 1, value: "" }]); // start with one input
  const [submittedValues, setSubmittedValues] = useState(null); // null = not submitted yet

  // 2. Event handlers
  function addField() {
    setFields([...fields, { id: Date.now(), value: "" }]);
  }

  function removeField(id) {
    setFields(fields.filter((field) => field.id !== id));
  }

  function handleChange(id, value) {
    // Update only the field with this id; copy the others as they are
    setFields(fields.map((field) => (field.id === id ? { ...field, value: value } : field)));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmittedValues(fields.map((field) => field.value));
  }

  // 3. Main logic
  // Keep at least one input, so the Remove button is disabled when only one is left
  const canRemove = fields.length > 1;

  // 4. JSX
  return (
    <form className="dynamic" onSubmit={handleSubmit}>
      <p className="dynamic-hint">Add your skills. Each input keeps its own value.</p>

      {fields.map((field, index) => (
        <div key={field.id} className="dynamic-row">
          <label htmlFor={`skill-${field.id}`}>Skill {index + 1}</label>
          <input
            id={`skill-${field.id}`}
            type="text"
            value={field.value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder="e.g. React"
          />
          <button
            type="button"
            onClick={() => removeField(field.id)}
            disabled={!canRemove}
            aria-label={`Remove skill ${index + 1}`}
          >
            Remove
          </button>
        </div>
      ))}

      <div className="dynamic-buttons">
        <button type="button" onClick={addField}>
          + Add field
        </button>
        <button type="submit" className="primary-button">
          Submit
        </button>
      </div>

      {submittedValues && (
        <div className="dynamic-result">
          <strong>Submitted values:</strong>
          <pre>{JSON.stringify(submittedValues, null, 2)}</pre>
        </div>
      )}
    </form>
  );
}

export default DynamicForm;
