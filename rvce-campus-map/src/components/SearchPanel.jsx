import { buildings } from "../data/buildings";
import { Icon } from "./Icons";
import "./SearchPanel.css";

export default function SearchPanel({ start, end, onUpdateRoute, onFindPath, isOpen, setIsOpen }) {
  if (!isOpen) {
    return (
      <button
        className="search-fab"
        onClick={() => setIsOpen(true)}
        aria-label="Open Navigation"
      >
        <Icon name="search" size={24} />
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
          aria-label="Close"
        >
          <Icon name="close" size={20} />
        </button>
      </div>

      <button
        className="floating-loc-btn"
        onClick={() => onUpdateRoute("start", "Current Location")}
        title="Use My Location"
        aria-label="Use My Location"
      >
        <Icon name="target" size={20} />
      </button>

      <div className="search-inputs">
        <select value={start} onChange={e => onUpdateRoute("start", e.target.value)} aria-label="Start location selection">
          <option value="">Start location</option>
          <option value="Current Location">Current Location</option>
          {buildings.map(b => (
            <option key={b.name} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>

        {start === "Current Location" && (
          <div className="current-loc-badge">Using GPS Location</div>
        )}

        <select value={end} onChange={e => onUpdateRoute("end", e.target.value)} aria-label="Destination selection">
          <option value="">Destination</option>
          {buildings.map(b => (
            <option key={b.name} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={() => onFindPath(start, end)}>
        Find Route
      </button>
    </div>
  );
}


