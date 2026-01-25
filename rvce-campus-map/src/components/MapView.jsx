import { useRef, useState, useEffect } from "react";
import { TransformWrapper, TransformComponent, useTransformContext } from "react-zoom-pan-pinch";
import "./MapView.css";

import {
  road,
  pathSegments
} from "../data/graph";

import BuildingLabels from "./BuildingLabels";

const MAP_WIDTH = 1200;
const MAP_HEIGHT = 800;

export default function MapView({
  gpsEnabled,
  setGpsEnabled,
  userPos,
  path,
  startNode,
  endNode
}) {
  const [bearing, setBearing] = useState(0);
  const touchRef = useRef({
    angle: 0,
    startAngle: 0,
    active: false
  });

  // Custom Touch Rotation Logic
  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      const p1 = e.touches[0];
      const p2 = e.touches[1];
      const angle = Math.atan2(p2.clientY - p1.clientY, p2.clientX - p1.clientX) * 180 / Math.PI;
      touchRef.current = {
        active: true,
        startAngle: angle,
        baseBearing: bearing // Store current bearing
      };
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 2 && touchRef.current.active) {
      const p1 = e.touches[0];
      const p2 = e.touches[1];
      const angle = Math.atan2(p2.clientY - p1.clientY, p2.clientX - p1.clientX) * 180 / Math.PI;

      const delta = angle - touchRef.current.startAngle;
      setBearing(touchRef.current.baseBearing + delta);
    }
  };

  const onTouchEnd = () => {
    touchRef.current.active = false;
  };

  /* ================= AUTO-NAV ================= */
  const { zoomToElement, resetTransform } = useTransformContext();

  useEffect(() => {
    if (path && path.length > 1 && startNode) {
      // 1. Auto-Zoom into start node
      // Wait a tick for DOM to update
      setTimeout(() => {
        zoomToElement("start-node-marker", 2.5, 500);
      }, 100);

      // 2. Auto-Rotate towards first segment
      // Calculate angle between path[0] (start) and path[1]
      // We need coordinates. Helper: road[path[0]] -> road[path[1]]

      const p1 = road[path[0]];
      const p2 = road[path[1]];

      if (p1 && p2) {
        // Calculate bearing between p1 and p2
        // atan2(dy, dx) gives angle from X axis.
        // We want map to rotate such that the path is UP (North).
        // Standard angle: 0 = Right, 90 = Down (screen coords).
        // If path is pointing Right (0 deg), we want map rotated -90? No.
        // Let's assume Map "Up" is -90 deg in screen math.

        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;

        // We want this angle to point UP (-90 deg visually).
        // So we rotate the map by:  -90 - angle?
        // Let's try: bearing = -(angle + 90)

        const targetBearing = -(angle + 90);
        setBearing(targetBearing);
      }
    }
  }, [path, startNode]); // Re-run when path changes

  return (
    <div
      className="map-viewport"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <TransformWrapper
        initialScale={1.4}
        minScale={0.5}
        maxScale={4}
        centerOnInit={true}
        limitToBounds={false}
        wheel={{ step: 0.1, smoothStep: 0.002 }}
        pinch={{ disabled: false }} // Keep default pinch for zoom, our handler adds rotation
        panning={{ disabled: false }}
      >
        <TransformComponent
          wrapperClass="map-transform-wrapper"
          contentClass="map-transform-content"
        >
          <div
            className="map-canvas"
            style={{ transform: `rotate(${bearing}deg)`, transition: touchRef.current.active ? "none" : "transform 0.3s ease" }}
          >
            <img src="/rvce-map.png" className="map-image" decoding="async" />

            <svg width={MAP_WIDTH} height={MAP_HEIGHT} className="route-layer">
              {pathSegments.map(seg => (
                <path
                  key={seg.id}
                  d={buildPath(seg.points)}
                  className="path-default"
                />
              ))}

              {path && path.length > 0 && (
                <path d={buildPath(path)} className="path-shortest" />
              )}

              {startNode && (
                <circle
                  id="start-node-marker"
                  {...nodeXY(startNode)}
                  r="7"
                  className="start-marker"
                />
              )}

              {endNode && (
                <circle {...nodeXY(endNode)} r="7" className="end-marker" />
              )}
            </svg>

            <BuildingLabels bearing={bearing} />

            {userPos && (
              <div
                id="user-marker"
                className="user-marker"
                style={{
                  left: `${userPos.x}%`,
                  top: `${userPos.y}%`
                }}
              />
            )}
          </div>
        </TransformComponent>

        <MapControls
          gpsEnabled={gpsEnabled}
          setGpsEnabled={setGpsEnabled}
          hasLocation={!!userPos}
          bearing={bearing}
          setBearing={setBearing}
        />
      </TransformWrapper>
    </div>
  );
}

function MapControls({ gpsEnabled, setGpsEnabled, hasLocation, bearing, setBearing }) {
  const { zoomToElement } = useTransformContext();

  return (
    <>
      {/* Compass - Top Right */}
      <div className="compass-container" onClick={() => setBearing(0)}>
        <div
          className="compass-arrow"
          style={{ transform: `rotate(${-bearing}deg)` }}
        >
          ➤
        </div>
      </div>

      <div className="gps-controls">
        {/* Rotation Controls */}
        <div className="rotation-controls">
          <button className="rot-btn" onClick={() => setBearing(b => b - 45)}>⟲</button>
          <button className="rot-btn" onClick={() => setBearing(b => b + 45)}>⟳</button>
        </div>

        {!gpsEnabled && (
          <button className="gps-btn" onClick={() => setGpsEnabled(true)}>
            📍 Enable Location
          </button>
        )}

        {gpsEnabled && hasLocation && (
          <button
            className="gps-btn"
            onClick={() => zoomToElement("user-marker", 2)} // scale 2
          >
            🎯 Re-center
          </button>
        )}
      </div>
    </>
  );
}

/* ================= HELPERS ================= */

function buildPath(points) {
  let d = "";
  if (!points) return d;
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
  if (!n) return { cx: 0, cy: 0 };
  return {
    cx: (n.x / 100) * MAP_WIDTH,
    cy: (n.y / 100) * MAP_HEIGHT
  };
}

