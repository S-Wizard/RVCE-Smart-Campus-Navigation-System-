import { useEffect, useMemo, useRef, useState } from "react";
import "./MapView.css";

import { gpsToMap } from "../data/gps";
import {
  road,
  pathSegments,
  graph,
  dijkstra,
  buildingConnectors
} from "../data/graph";

import BuildingLabels from "./BuildingLabels";

const MAP_WIDTH = 1200;
const MAP_HEIGHT = 800;

export default function MapView({ routeRequest }) {
  const canvasRef = useRef(null);

  /* ================= GPS ================= */
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [userPos, setUserPos] = useState(null);

useEffect(() => {
  if (!navigator.geolocation) {
    console.warn("Geolocation not supported");
    return;
  }

  const watchId = navigator.geolocation.watchPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      const mapPos = gpsToMap(latitude, longitude);
      setUserPos(mapPos);
    },
    err => {
      console.error("GPS error:", err);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 10000
    }
  );

  return () => navigator.geolocation.clearWatch(watchId);
}, []);


  /* ================= PAN / ZOOM ================= */
  const [scale, setScale] = useState(1.4);
  const [offset, setOffset] = useState({ x: -300, y: -200 });

  const pointers = useRef(new Map());
  const lastDistance = useRef(null);

  function onPointerDown(e) {
    e.preventDefault();
    pointers.current.set(e.pointerId, e);
    canvasRef.current.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, e);

    const pts = Array.from(pointers.current.values());

    // 🟢 PAN
    if (pts.length === 1) {
      setOffset(o => ({
        x: o.x + e.movementX,
        y: o.y + e.movementY
      }));
    }

    // 🔵 PINCH ZOOM
    if (pts.length === 2) {
      const [p1, p2] = pts;
      const dist = Math.hypot(
        p1.clientX - p2.clientX,
        p1.clientY - p2.clientY
      );

      if (lastDistance.current) {
        const delta = dist - lastDistance.current;
        setScale(s =>
          Math.min(3, Math.max(0.6, s + delta * 0.002))
        );
      }

      lastDistance.current = dist;
    }
  }

  function onPointerUp(e) {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) lastDistance.current = null;
  }

  function onWheel(e) {
    e.preventDefault();
    setScale(s =>
      Math.min(3, Math.max(0.6, s - e.deltaY * 0.001))
    );
  }

  /* ================= ROUTE ================= */
  const { path, startNode, endNode } = useMemo(() => {
    if (!routeRequest) return { path: [], startNode: null, endNode: null };

    const s = getRoadForBuilding(routeRequest.start);
    const e = getRoadForBuilding(routeRequest.end);

    if (!s || !e) return { path: [], startNode: null, endNode: null };

    return {
      path: dijkstra(graph, s, e),
      startNode: s,
      endNode: e
    };
  }, [routeRequest]);

  /* ================= RENDER ================= */
  return (
    <div className="map-viewport">
      <div
        ref={canvasRef}
        className="map-canvas"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <img src="/rvce-map.png" className="map-image" draggable={false} />

        <svg width={MAP_WIDTH} height={MAP_HEIGHT} className="route-layer">
          {pathSegments.map(seg => (
            <path
              key={seg.id}
              d={buildPath(seg.points)}
              className="path-default"
            />
          ))}

          {path.length > 0 && (
            <path d={buildPath(path)} className="path-shortest" />
          )}

          {startNode && (
            <circle {...nodeXY(startNode)} r="7" className="start-marker" />
          )}

          {endNode && (
            <circle {...nodeXY(endNode)} r="7" className="end-marker" />
          )}
        </svg>

        {/* GPS Button */}
        {!gpsEnabled && (
          <button className="gps-btn" onClick={() => setGpsEnabled(true)}>
            📍 Enable Location
          </button>
        )}

        <BuildingLabels />

        {userPos && (
          <div
            className="user-marker"
            style={{
              left: `${userPos.x}%`,
              top: `${userPos.y}%`
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function getRoadForBuilding(name) {
  const c = buildingConnectors.find(b => b.building === name);
  return c ? c.to.id : null;
}

function buildPath(points) {
  let d = "";
  points.forEach((k, i) => {
    const n = road[k];
    if (!n) return;
    const x = (n.x / 100) * MAP_WIDTH;
    const y = (n.y / 100) * MAP_HEIGHT;
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  });
  return d;
}

function nodeXY(key) {
  const n = road[key];
  return {
    cx: (n.x / 100) * MAP_WIDTH,
    cy: (n.y / 100) * MAP_HEIGHT
  };
}

