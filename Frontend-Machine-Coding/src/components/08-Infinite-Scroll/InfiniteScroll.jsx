// Concepts:
// useState
// useRef (a value that changes immediately, without a re-render)
// onScroll event (scrollTop, clientHeight, scrollHeight)
// async / await with a fake API (Promise + setTimeout)
// Loading state + guard against duplicate loads
// Functional State Update

import { useRef, useState } from "react";
import "./InfiniteScroll.css";

const TOTAL_ITEMS = 50;
const PAGE_SIZE = 10;

const firstItems = Array.from({ length: PAGE_SIZE }, (_, index) => `Item ${index + 1}`);

// Fake API: gives the next 10 items after 800 ms, like a slow network request
function fetchItems(start) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newItems = [];
      for (let i = start; i < start + PAGE_SIZE && i < TOTAL_ITEMS; i++) {
        newItems.push(`Item ${i + 1}`);
      }
      resolve(newItems);
    }, 800);
  });
}

function InfiniteScroll() {
  // 1. State
  const [items, setItems] = useState(firstItems);
  const [isLoading, setIsLoading] = useState(false); // drives the "Loading more…" text

  // The guard against duplicate requests. Why a ref and not `isLoading`?
  // setIsLoading(true) only takes effect on the next render. If several scroll events arrive
  // before that, they would all still see isLoading === false and all start a request.
  // A ref changes immediately.
  const isLoadingRef = useRef(false);

  // 2. Event handlers
  async function loadMore() {
    if (isLoadingRef.current || !hasMore) return;

    isLoadingRef.current = true;
    setIsLoading(true);

    const newItems = await fetchItems(items.length);

    // prev = the latest items, even though time has passed since this function started
    setItems((prev) => [...prev, ...newItems]);
    setIsLoading(false);
    isLoadingRef.current = false;
  }

  function handleScroll(e) {
    if (isNearBottom(e.currentTarget)) {
      loadMore();
    }
  }

  // 3. Main logic
  // Derived: with a real API you would read "is there more?" from the response instead.
  const hasMore = items.length < TOTAL_ITEMS;

  //   scrollTop    = how far the box has been scrolled down
  //   clientHeight = height of the visible part of the box
  //   scrollHeight = height of ALL the content inside the box
  // When scrollTop + clientHeight reaches scrollHeight, we are at the very bottom.
  // "- 50" starts loading a little before the real bottom.
  function isNearBottom(box) {
    return box.scrollTop + box.clientHeight >= box.scrollHeight - 50;
  }

  // 4. JSX
  return (
    <div className="scroll">
      <p className="scroll-info">
        Loaded {items.length} of {TOTAL_ITEMS} items. Scroll down inside the box.
      </p>

      <div className="scroll-box" onScroll={handleScroll}>
        <ul className="scroll-list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        {isLoading && <p className="scroll-status">Loading more…</p>}
        {!hasMore && <p className="scroll-status">🎉 You have seen all {TOTAL_ITEMS} items.</p>}
      </div>
    </div>
  );
}

export default InfiniteScroll;
