// Concepts:
// useState
// Conditional Rendering
// map()
// filter()
// find()
// Rendering a component stored in a variable

import { useState } from "react";
import TodoApp from "./components/01-Todo-App/TodoApp.jsx";
import Calculator from "./components/02-Calculator/Calculator.jsx";
import Counter from "./components/03-Counter/Counter.jsx";
import Modal from "./components/04-Modal/Modal.jsx";
import Accordion from "./components/05-Accordion/Accordion.jsx";
import SearchFilter from "./components/06-Search-Filter/SearchFilter.jsx";
import Pagination from "./components/07-Pagination/Pagination.jsx";
import InfiniteScroll from "./components/08-Infinite-Scroll/InfiniteScroll.jsx";
import ImageCarousel from "./components/09-Image-Carousel/ImageCarousel.jsx";
import DragDrop from "./components/10-Drag-Drop/DragDrop.jsx";
import FormValidation from "./components/11-Form-Validation/FormValidation.jsx";
import MultiStepForm from "./components/12-Multi-Step-Form/MultiStepForm.jsx";
import FileUpload from "./components/13-File-Upload/FileUpload.jsx";
import AutoComplete from "./components/14-Auto-Complete/AutoComplete.jsx";
import DynamicForm from "./components/15-Dynamic-Form/DynamicForm.jsx";
import StarRating from "./components/16-Star-Rating/StarRating.jsx";
import ProgressBar from "./components/17-Progress-Bar/ProgressBar.jsx";
import Tabs from "./components/18-Tabs/Tabs.jsx";
import DataTable from "./components/19-Data-Table/DataTable.jsx";
import ShoppingCart from "./components/20-Shopping-Cart/ShoppingCart.jsx";
import "./App.css";

// All 20 problems: an id, a title, the dashboard section, and the component to show
const problems = [
  { id: 1, title: "Todo App", section: "Basic UI Components", component: TodoApp },
  { id: 2, title: "Calculator", section: "Basic UI Components", component: Calculator },
  { id: 3, title: "Counter", section: "Basic UI Components", component: Counter },
  { id: 4, title: "Modal / Popup", section: "Basic UI Components", component: Modal },
  { id: 5, title: "Accordion", section: "Basic UI Components", component: Accordion },

  { id: 6, title: "Search & Filter", section: "Interactive Features", component: SearchFilter },
  { id: 7, title: "Pagination", section: "Interactive Features", component: Pagination },
  { id: 8, title: "Infinite Scroll", section: "Interactive Features", component: InfiniteScroll },
  { id: 9, title: "Image Carousel", section: "Interactive Features", component: ImageCarousel },
  { id: 10, title: "Drag & Drop", section: "Interactive Features", component: DragDrop },

  { id: 11, title: "Form Validation", section: "Form Handling", component: FormValidation },
  { id: 12, title: "Multi-Step Form", section: "Form Handling", component: MultiStepForm },
  { id: 13, title: "File Upload", section: "Form Handling", component: FileUpload },
  { id: 14, title: "Auto-Complete", section: "Form Handling", component: AutoComplete },
  { id: 15, title: "Dynamic Form Fields", section: "Form Handling", component: DynamicForm },

  { id: 16, title: "Star Rating", section: "Advanced Components", component: StarRating },
  { id: 17, title: "Progress Bar", section: "Advanced Components", component: ProgressBar },
  { id: 18, title: "Tabs", section: "Advanced Components", component: Tabs },
  { id: 19, title: "Data Table", section: "Advanced Components", component: DataTable },
  { id: 20, title: "Shopping Cart", section: "Advanced Components", component: ShoppingCart },
];

const sections = [
  "Basic UI Components",
  "Interactive Features",
  "Form Handling",
  "Advanced Components",
];

function App() {
  // 1. State
  // We store only the id of the open problem (null = show the dashboard).
  const [selectedComponent, setSelectedComponent] = useState(null);

  // 2. Event handlers
  function openProblem(id) {
    setSelectedComponent(id);
    window.scrollTo(0, 0); // start the problem page at the top
  }

  function goBack() {
    setSelectedComponent(null);
  }

  // 3. Main logic
  // find() returns the matching problem, or undefined when nothing is selected.
  const selectedProblem = problems.find((problem) => problem.id === selectedComponent);

  // 4. JSX
  if (selectedProblem) {
    // A component in a variable must start with a capital letter to be used as <SelectedComponent />
    const SelectedComponent = selectedProblem.component;

    return (
      <div className="app">
        <button className="back-button" onClick={goBack}>
          ← Back to Problems
        </button>
        <h1 className="problem-title">
          {selectedProblem.id}. {selectedProblem.title}
        </h1>
        <div className="problem-box">
          <SelectedComponent />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Frontend Machine Coding</h1>
      <p className="subtitle">{problems.length} React problems for interview practice. Pick one.</p>

      {sections.map((section) => (
        <section key={section} className="dashboard-section">
          <h2>{section}</h2>
          <div className="problem-grid">
            {problems
              .filter((problem) => problem.section === section)
              .map((problem) => (
                <button
                  key={problem.id}
                  className="problem-card"
                  onClick={() => openProblem(problem.id)}
                >
                  <span className="problem-number">{String(problem.id).padStart(2, "0")}</span>
                  <span>{problem.title}</span>
                </button>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default App;
