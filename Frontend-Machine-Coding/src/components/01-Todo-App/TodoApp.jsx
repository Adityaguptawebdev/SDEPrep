// Concepts:
// useState
// Controlled Input
// map()
// filter()
// Event Handling (form submit, click, change)
// Conditional Rendering

import { useState } from "react";
import "./TodoApp.css";

function TodoApp() {
  // 1. State
  const [todos, setTodos] = useState([]); // [{ id, text, completed }]
  const [input, setInput] = useState(""); // text in the "add" box
  const [editingId, setEditingId] = useState(null); // id of the todo being edited (null = none)
  const [editText, setEditText] = useState(""); // text in the "edit" box

  // 2. Event handlers
  function addTodo(e) {
    e.preventDefault(); // stop the form from reloading the page

    const text = input.trim();
    if (text === "") return; // ignore empty todos

    const newTodo = { id: Date.now(), text: text, completed: false };
    setTodos([...todos, newTodo]); // new array, never todos.push()
    setInput("");
  }

  function deleteTodo(id) {
    // keep every todo except the one with this id
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function toggleTodo(id) {
    // copy the matching todo with `completed` flipped; leave the others as they are
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function startEditing(todo) {
    setEditingId(todo.id);
    setEditText(todo.text);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditText("");
  }

  function editTodo(e) {
    e.preventDefault();

    const text = editText.trim();
    if (text === "") return;

    setTodos(
      todos.map((todo) => (todo.id === editingId ? { ...todo, text: text } : todo))
    );
    setEditingId(null);
    setEditText("");
  }

  // 3. Main logic
  // Derived value: calculated from `todos` on every render, so it is not stored in state.
  const completedCount = todos.filter((todo) => todo.completed).length;

  // 4. JSX
  return (
    <div className="todo-app">
      <form className="todo-form" onSubmit={addTodo}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit" className="primary-button">
          Add
        </button>
      </form>

      {todos.length === 0 ? (
        <p className="todo-empty">No todos yet. Add one above.</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              {editingId === todo.id ? (
                <form className="todo-edit-form" onSubmit={editTodo}>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                  />
                  <button type="submit">Save</button>
                  {/* type="button" so this does not submit the form */}
                  <button type="button" onClick={cancelEditing}>
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span className={todo.completed ? "todo-text completed" : "todo-text"}>
                    {todo.text}
                  </span>
                  <button onClick={() => startEditing(todo)}>Edit</button>
                  <button className="todo-delete-button" onClick={() => deleteTodo(todo.id)}>
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {todos.length > 0 && (
        <p className="todo-count">
          {completedCount} of {todos.length} completed
        </p>
      )}
    </div>
  );
}

export default TodoApp;
