import { useState } from "react";
import { buildings } from "../data/buildings";
import "./SearchPanel.css";

export default function SearchPanel({ onFindPath }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  return (
    <div className="search-panel">
      <div className="panel-header">Campus Navigation</div>

      <select value={start} onChange={e => setStart(e.target.value)}>
        <option value="">📍 Start location</option>
        {buildings.map(b => (
          <option key={b.name} value={b.name}>
    {b.name}
  </option>
        ))}
      </select>

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


