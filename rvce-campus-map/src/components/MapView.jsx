import { useRef } from "react";
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

  return (
    <div className="map-viewport">
      <TransformWrapper
        initialScale={1.4}
        minScale={0.5}
        maxScale={4}
        centerOnInit={true}
        limitToBounds={true}
        wheel={{ step: 0.1, smoothStep: 0.002 }}
        pinch={{ disabled: false }}
        panning={{ disabled: false }}
      >
        <TransformComponent
          wrapperClass="map-transform-wrapper"
          contentClass="map-transform-content"
        >
          <div className="map-canvas">
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

            <BuildingLabels />

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
        />
      </TransformWrapper>
    </div>
  );
}

function MapControls({ gpsEnabled, setGpsEnabled, hasLocation }) {
  const { zoomToElement } = useTransformContext();

  return (
    <div className="gps-controls">
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

