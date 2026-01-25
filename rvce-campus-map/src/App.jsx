import { useState, useEffect, useMemo } from "react";
import SearchPanel from "./components/SearchPanel";
import SearchBar from "./components/SearchBar";
import MapView from "./components/MapView";
import DirectionsPanel from "./components/DirectionsPanel";
import "./App.css";

import { gpsToMap } from "./data/gps";
import {
  road,
  graph,
  dijkstra,
  buildingConnectors
} from "./data/graph";

export default function App() {
  const [routeRequest, setRouteRequest] = useState(null);
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [userPos, setUserPos] = useState(null);

  /* ================= GPS LOGIC ================= */
  useEffect(() => {
    if (!gpsEnabled) return;

    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        setUserPos(gpsToMap(latitude, longitude));
      },
      err => {
        console.error("GPS error:", err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [gpsEnabled]);

  /* ================= ROUTE CALCULATION ================= */
  const { path, startNode, endNode } = useMemo(() => {
    if (!routeRequest) return { path: [], startNode: null, endNode: null };

    // Helper to find nearest node
    const findNearestNode = (pos) => {
      let min = Infinity;
      let nearest = null;
      Object.values(road).forEach(n => {
        const d = Math.sqrt(Math.pow(n.x - pos.x, 2) + Math.pow(n.y - pos.y, 2));
        if (d < min) {
          min = d;
          nearest = n.id;
        }
      });
      return nearest;
    };

    const getRoadForBuilding = (name) => {
      const c = buildingConnectors.find(b => b.building === name);
      return c ? c.to.id : null;
    };

    // Handle Start Node
    let s;
    if (routeRequest.start === "Current Location") {
      if (userPos) {
        s = findNearestNode(userPos);
      } else {
        s = null;
      }
    } else {
      s = getRoadForBuilding(routeRequest.start);
    }

    const e = getRoadForBuilding(routeRequest.end);

    if (!s || !e) return { path: [], startNode: null, endNode: null };

    return {
      path: dijkstra(graph, s, e),
      startNode: s,
      endNode: e
    };
  }, [routeRequest, userPos]);

  // UI State
  const [isSearchOpen, setIsSearchOpen] = useState(true);

  function handleFindPath(start, end) {
    if (!start || !end) return;
    setRouteRequest({ start, end });
    if (window.innerWidth < 768) {
      setIsSearchOpen(false);
    }
  }

  function handleSelectPlace(name, type) {
    const current = routeRequest || { start: "", end: "" };
    const newReq = { ...current, [type]: name };
    setRouteRequest(newReq);

    // Auto-nav if both are present
    if (newReq.start && newReq.end) {
      handleFindPath(newReq.start, newReq.end);
    }
  }

  return (
    <div className="app-layout">
      <SearchBar onSelectPlace={handleSelectPlace} />

      <SearchPanel
        start={routeRequest?.start || ""}
        end={routeRequest?.end || ""}
        onUpdateRoute={(field, value) => handleSelectPlace(value, field)}
        onFindPath={handleFindPath}
        isOpen={isSearchOpen}
        setIsOpen={setIsSearchOpen}
      />

      {path.length > 0 && (
        <DirectionsPanel
          path={path}
          onClose={() => {
            setRouteRequest(null);
            setIsSearchOpen(true);
          }}
        />
      )}

      <MapView
        gpsEnabled={gpsEnabled}
        setGpsEnabled={setGpsEnabled}
        userPos={userPos}
        path={path}
        startNode={startNode}
        endNode={endNode}
      />
    </div>
  );
}

