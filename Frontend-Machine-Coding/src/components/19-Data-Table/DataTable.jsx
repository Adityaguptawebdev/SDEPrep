// Concepts:
// useState (search text, sort column, sort direction)
// filter() then sort() on a COPY
// Compare functions: a - b for numbers, localeCompare for strings
// Derived data (never stored in state)
// Empty state with colSpan

import { useState } from "react";
import "./DataTable.css";

const columns = [
  { key: "name", label: "Name" },
  { key: "department", label: "Department" },
  { key: "age", label: "Age" },
  { key: "salary", label: "Salary (₹)" },
];

const employees = [
  { id: 1, name: "Asha Verma", department: "Engineering", age: 28, salary: 1200000 },
  { id: 2, name: "Rahul Mehta", department: "Design", age: 34, salary: 950000 },
  { id: 3, name: "Neha Iyer", department: "Engineering", age: 25, salary: 900000 },
  { id: 4, name: "Vikram Singh", department: "Sales", age: 41, salary: 1100000 },
  { id: 5, name: "Priya Nair", department: "Marketing", age: 30, salary: 780000 },
  { id: 6, name: "Arjun Rao", department: "Engineering", age: 36, salary: 1850000 },
  { id: 7, name: "Kavya Reddy", department: "HR", age: 29, salary: 650000 },
  { id: 8, name: "Rohan Das", department: "Sales", age: 23, salary: 520000 },
  { id: 9, name: "Meera Joshi", department: "Design", age: 27, salary: 870000 },
  { id: 10, name: "Sameer Khan", department: "Marketing", age: 38, salary: 1300000 },
];

function DataTable() {
  // 1. State
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState(null); // "name", "age"… (null = original order)
  const [sortDirection, setSortDirection] = useState("asc"); // "asc" or "desc"

  // 2. Event handlers
  function handleSearchChange(e) {
    setSearch(e.target.value);
  }

  function handleSort(columnKey) {
    if (sortColumn === columnKey) {
      // Same column clicked again → flip the direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New column → sort by it, starting ascending
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  }

  // 3. Main logic
  // Step 1: keep rows whose name or department contains the search text
  const searchText = search.trim().toLowerCase();
  const filteredRows = employees.filter(
    (row) =>
      row.name.toLowerCase().includes(searchText) ||
      row.department.toLowerCase().includes(searchText)
  );

  // Step 2: sort. sort() changes the array it is called on, so we sort a copy.
  // The compare function returns: negative → a goes first · positive → b goes first · 0 → keep order
  const sortedRows = [...filteredRows];
  if (sortColumn !== null) {
    sortedRows.sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];
      // numbers: 25 - 30 = -5 → 25 first · strings: "Asha".localeCompare("Neha") = -1 → Asha first
      const result = typeof valueA === "number" ? valueA - valueB : valueA.localeCompare(valueB);
      return sortDirection === "asc" ? result : -result; // flip the sign for descending
    });
  }

  function getSortArrow(columnKey) {
    if (sortColumn !== columnKey) return "↕";
    return sortDirection === "asc" ? "▲" : "▼";
  }

  // 4. JSX
  return (
    <div className="table">
      <input
        className="table-search"
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search by name or department"
        aria-label="Search employees"
      />

      {/* The wrapper scrolls sideways on small screens instead of the whole page */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>
                  <button className="table-sort-button" onClick={() => handleSort(column.key)}>
                    {column.label} <span className="table-arrow">{getSortArrow(column.key)}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sortedRows.length === 0 ? (
              <tr>
                <td className="table-empty" colSpan={columns.length}>
                  No employees match "{search}".
                </td>
              </tr>
            ) : (
              sortedRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.department}</td>
                  <td>{row.age}</td>
                  <td>{row.salary.toLocaleString("en-IN")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="table-info">
        {sortedRows.length} of {employees.length} rows
        {sortColumn !== null && ` · sorted by ${sortColumn} (${sortDirection})`}
      </p>
    </div>
  );
}

export default DataTable;
