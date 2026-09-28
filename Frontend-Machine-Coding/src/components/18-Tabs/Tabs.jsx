// Concepts:
// useState (id of the active tab)
// map() to render tab buttons
// find() to get the active tab's content
// Active class

import { useState } from "react";
import "./Tabs.css";

const tabs = [
  {
    id: "profile",
    label: "Profile",
    content: "Asha Verma · Frontend Developer · Bengaluru. Loves React and clean CSS.",
  },
  {
    id: "posts",
    label: "Posts",
    content: "3 posts: “Learning React hooks”, “Flexbox vs Grid”, “My first machine-coding round”.",
  },
  {
    id: "settings",
    label: "Settings",
    content: "Email notifications: On · Theme: Light · Language: English.",
  },
];

function Tabs() {
  // 1. State
  const [activeTab, setActiveTab] = useState("profile");

  // 2. Event handlers
  function handleTabClick(id) {
    setActiveTab(id);
  }

  // 3. Main logic
  const activeContent = tabs.find((tab) => tab.id === activeTab).content;

  // 4. JSX
  return (
    <div className="tabs">
      <div className="tabs-list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={tab.id === activeTab}
            className={tab.id === activeTab ? "tabs-button active" : "tabs-button"}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tabs-panel" role="tabpanel">
        {activeContent}
      </div>
    </div>
  );
}

export default Tabs;
