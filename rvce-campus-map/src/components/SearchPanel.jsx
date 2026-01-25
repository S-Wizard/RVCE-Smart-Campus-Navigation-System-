import { useState } from "react";
import { buildings } from "../data/buildings";
import "./SearchPanel.css";

export default function SearchPanel({ onFindPath, isOpen, setIsOpen }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  if (!isOpen) {
    return (
      <button
        className="search-fab"
        onClick={() => setIsOpen(true)}
        aria-label="Open Search"
      >
        🔍
      </button>
    );
  }

  return (
    <div className="search-panel">
      <div className="panel-header">
        <span>Campus Navigation</span>
        <button
          className="close-btn"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>
      </div>

      <div className="search-group">
        <select value={start} onChange={e => setStart(e.target.value)}>
          <option value="">📍 Start location</option>
          {buildings.map(b => (
            <option key={b.name} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>

        <button
          className="loc-btn"
          onClick={() => setStart("Current Location")}
          title="Use My Location"
        >
          🎯
        </button>
      </div>

      {start === "Current Location" && (
        <div className="current-loc-badge">Using Current Location</div>
      )}

      <select value={end} onChange={e => setEnd(e.target.value)}>
        <option value="">🎯 Destination</option>
        {buildings.map(b => (
          <option key={b.name} value={b.name}>
            {b.name}
          </option>
        ))}
      </select>

      <button onClick={() => onFindPath(start, end)}>
        Find Route
      </button>
    </div>
  );
}


