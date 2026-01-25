import { useEffect, useMemo, useState } from "react";
import { TransformWrapper, TransformComponent, useTransformContext } from "react-zoom-pan-pinch";
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
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [userPos, setUserPos] = useState(null);

  /* ================= GPS ================= */
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        console.log("GPS:", latitude, longitude);
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
  }, []);


  /*useEffect(() => {
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
  */

  /* ================= ROUTE ================= */
  const { path, startNode, endNode } = useMemo(() => {
    if (!routeRequest) return { path: [], startNode: null, endNode: null };

    // Handle Start Node
    let s;
    if (routeRequest.start === "Current Location") {
      if (userPos) {
        s = findNearestNode(userPos);
      } else {
        // Optionally trigger GPS enable or just return null
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

  /* ================= RENDER ================= */
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

            {/* GPS Button and Markers should be OUTSIDE transform if fixed, or INSIDE if they move? 
                GPS Button usually fixed on UI, but here it was inside. 
                GPS User Marker SHOULD move with map.
            */}

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

function findNearestNode(pos) {
  let min = Infinity;
  let nearest = null;

  Object.values(road).forEach(n => {
    // scale pos to match if needed, but road and pos are both in %, so direct compare is fine?
    // UserPos is {x: %, y: %}, Road nodes are {x: %, y: %}
    const d = Math.sqrt(Math.pow(n.x - pos.x, 2) + Math.pow(n.y - pos.y, 2));
    if (d < min) {
      min = d;
      nearest = n.id;
    }
  });
  return nearest;
}

