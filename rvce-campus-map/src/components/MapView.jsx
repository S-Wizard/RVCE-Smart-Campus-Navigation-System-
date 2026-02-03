import { useRef, useState, useEffect } from "react";
import { TransformWrapper, TransformComponent, useTransformContext } from "react-zoom-pan-pinch";
import { Icon } from "./Icons";
import PlacePopup from "./PlacePopup";
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
  endNode,
  onResetAll,
  onSelectPlace,
  user,
  favorites,
  onToggleFavorite
}) {
  const [bearing, setBearing] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState(null);
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



  /* ================= AUTO-NAV MOVED TO CONTROLS ================= */
  // Removed useTransformContext from here to fix Context Error

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

            <BuildingLabels bearing={bearing} onPlaceClick={setSelectedPlace} />

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
          path={path}
          startNode={startNode}
          onResetAll={onResetAll}
        />
      </TransformWrapper>
      {/* Place Details Popup */}
      {selectedPlace && (
        <PlacePopup
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onSetStart={(name) => onSelectPlace(name, 'start')}
          onSetEnd={(name) => onSelectPlace(name, 'end')}
          user={user}
          isFavorite={favorites.some(f => f.locationName === selectedPlace.name)}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </div>
  );
}

function MapControls({
  gpsEnabled,
  setGpsEnabled,
  hasLocation,
  bearing,
  setBearing,
  path,
  startNode,
  onResetAll,
  user,
  favorites,
  onToggleFavorite,
  onSelectPlace
}) {
  const { zoomToElement, resetTransform, centerView } = useTransformContext();

  /* ================= AUTO-NAV LOGIC ================= */
  useEffect(() => {
    if (path && path.length > 1 && startNode) {
      // 1. Auto-Zoom
      setTimeout(() => {
        zoomToElement("start-node-marker", 2.5, 500);
      }, 100);

      // 2. Auto-Rotate
      const p1 = road[path[0]];
      const p2 = road[path[1]];

      if (p1 && p2) {
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
        const targetBearing = -(angle + 90);
        setBearing(targetBearing);
      }
    }
  }, [path, startNode]);

  return (
    <>
      {/* Compass - Top Right */}
      <div className="compass-container" onClick={() => setBearing(0)} aria-label="Reset North">
        <div
          className="compass-arrow"
          style={{ transform: `rotate(${-bearing}deg)` }}
        >
          <Icon name="compass-arrow" size={28} />
        </div>
      </div>

      <div className="gps-controls">
        {/* Rotation Controls */}
        <div className="rotation-controls">
          <button className="rot-btn" onClick={() => setBearing(b => b - 45)} aria-label="Rotate left">
            <Icon name="rotate-left" size={20} />
          </button>
          <button className="rot-btn" onClick={() => setBearing(b => b + 45)} aria-label="Rotate right">
            <Icon name="rotate-right" size={20} />
          </button>
        </div>

        {!gpsEnabled && (
          <button className="gps-btn" onClick={() => setGpsEnabled(true)}>
            <Icon name="location-filled" size={18} /> Enable Location
          </button>
        )}

        {gpsEnabled && hasLocation && (
          <button
            className="gps-btn"
            onClick={() => zoomToElement("user-marker", 2)} // scale 2
            aria-label="Recent to user location"
          >
            <Icon name="recenter" size={18} /> Re-center
          </button>
        )}

        {/* Reset Map Button */}
        <button
          className="gps-btn reset-btn"
          onClick={() => {
            console.log("Resetting map view and route data...");
            resetTransform(); // First clear pan
            setTimeout(() => centerView(1.4, 300), 50); // Then force center
            setBearing(0);
            onResetAll?.(); // Clear route data
          }}
          title="Reset View"
          aria-label="Reset Map"
        >
          <Icon name="reset" size={18} />
        </button>
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

