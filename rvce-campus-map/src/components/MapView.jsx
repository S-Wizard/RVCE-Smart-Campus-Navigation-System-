import { useRef, useState } from "react";
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

  return (
    <div className="map-viewport">
      <TransformWrapper
        initialScale={1.4}
        minScale={0.5}
        maxScale={4}
        centerOnInit={true}
        limitToBounds={false} /* False to allow rotation without weird clipping logic for now */
        wheel={{ step: 0.1, smoothStep: 0.002 }}
        pinch={{ disabled: false }}
        panning={{ disabled: false }}
      >
        <TransformComponent
          wrapperClass="map-transform-wrapper"
          contentClass="map-transform-content"
        >
          <div
            className="map-canvas"
            style={{ transform: `rotate(${bearing}deg)`, transition: "transform 0.3s ease" }}
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
                <circle {...nodeXY(startNode)} r="7" className="start-marker" />
              )}

              {endNode && (
                <circle {...nodeXY(endNode)} r="7" className="end-marker" />
              )}
            </svg>

            {/* Labels inside canvas need inverse bearing to stay upright?
                Actually, simpler if they rotate with map so 'Up' on map is 'Up' for label.
                But user wants readability.
                Let's keep them rotating with map for MVP so they stick to buildings.
            */}
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

