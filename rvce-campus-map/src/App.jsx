import { useState } from "react";
import SearchPanel from "./components/SearchPanel";
import MapView from "./components/MapView";
import "./App.css";

export default function App() {
  const [routeRequest, setRouteRequest] = useState(null);

  function handleFindPath(start, end) {
    if (!start || !end) return;
    setRouteRequest({ start, end });
  }

  return (
    <div className="app-layout">
      <SearchPanel onFindPath={handleFindPath} />
      <MapView routeRequest={routeRequest} />
    </div>
  );
}
