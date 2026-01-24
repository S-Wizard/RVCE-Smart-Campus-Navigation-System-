// ===============================
// BUILDING DATA (UNCHANGED)
// x, y are PERCENTAGES of map width/height
// ===============================
const buildings = [
  { name: "Civil Dept", x: 40, y: 30 },
  { name: "CS Computer Lab", x: 35, y: 26 },
  { name: "Main Gate", x: 28, y: 21 },
  { name: "Kotak Bank", x: 35, y: 20 },
  { name: "EEE Dept", x: 47, y: 39 },
  { name: "CSE Dept", x: 57, y: 30 },
  { name: "HealthCare Center", x: 66, y: 22 },
  { name: "Main Ground", x: 53, y: 17 },
  { name: "Parking Area", x: 45, y: 21 },
  { name: "ECE Dept", x: 55, y: 45 },
  { name: "ETE Dept", x: 55, y: 55 },
  { name: "Library", x: 55, y: 78 },
  { name: "ISE Dept", x: 70, y: 70 },
  { name: "Library / Computer Labs", x: 63, y: 65 },
  { name: "Chem Dept", x: 50, y: 70 },
  { name: "PG Labs", x: 43, y: 76 },
  { name: "MM Foods", x: 45, y: 60 },
  { name: "RVU", x: 37, y: 67 },
  { name: "Kriyakalpa", x: 40, y: 53 },
  { name: "Cauvery Hostel", x: 73, y: 40 },
  { name: "Krishna Hostel", x: 65, y: 38 },
  { name: "RV University", x: 85, y: 60 },
  { name: "RVU Blocks", x: 78, y: 87 },
  { name: "Mech Dept", x: 10, y: 70 },
  { name: "AIML Dept", x: 20, y: 80 },
  { name: "MCA", x: 23, y: 86 },
  { name: "Canteen Mingos", x: 44, y: 87 },
  { name: "DTH", x: 5, y: 60 },
  { name: "Admin Block", x: 20, y: 50 }
];

const startSelect = document.getElementById("startSelect");
const endSelect = document.getElementById("endSelect");

buildings.forEach(b => {
  const opt1 = document.createElement("option");
  opt1.value = b.name;
  opt1.textContent = b.name;
  startSelect.appendChild(opt1);

  const opt2 = document.createElement("option");
  opt2.value = b.name;
  opt2.textContent = b.name;
  endSelect.appendChild(opt2);
});

function placeMarkerOnBuilding(marker, buildingName) {
  const b = buildings.find(x => x.name === buildingName);
  if (!b) return;

  marker.style.left = b.x + "%";
  marker.style.top = b.y + "%";
  marker.style.display = "block";
}

const overlayLayer = document.getElementById("overlay-layer");

let startMarker = document.createElement("div");
startMarker.className = "map-marker start-marker";

let endMarker = document.createElement("div");
endMarker.className = "map-marker end-marker";

overlayLayer.appendChild(startMarker);
overlayLayer.appendChild(endMarker);


// ===============================
// ROAD NODES (FROM DRAWN MAP)
// ===============================
const road = {
  // main-gate-admin
  R1: { id: "R1", x: 28.00, y: 21.72 },
  R2: { id: "R2", x: 29.76, y: 29.22 },
  R3: { id: "R3", x: 21.24, y: 40.61 },
  R4: { id: "R4", x: 23.74, y: 44.08 },

  // main-gate-CSLab
  // duplicate: R5: { id: "R5", x: 29.76, y: 29.22 }, // Use R2
  R6: { id: "R6", x: 31.15, y: 27.69 },
  // duplicate: R7: { id: "R7", x: 32.81, y: 29.22 }, // Use R9
  R8: { id: "R8", x: 33.93, y: 27.97 },

  // CSlab-Civil
  R9: { id: "R9", x: 32.81, y: 29.22 },
  R10: { id: "R10", x: 36.22, y: 34.05 },
  R11: { id: "R11", x: 36.97, y: 32.80 },

  // Civil-CSfield
  // duplicated: R12: { id: "R12", x: 36.22, y: 34.05 }, // Use R10
  R13: { id: "R13", x: 40.87, y: 39.80 },
  R14: { id: "R14", x: 47.53, y: 30.92 },
  R15: { id: "R15", x: 49.78, y: 31.55 },
  R16: { id: "R16", x: 50.03, y: 28.80 },

  // Civil-ECE
  // duplicate: R35: { id: "R35", x: 40.87, y: 39.80 }, // Use R13
  R36: { id: "R36", x: 40.26, y: 40.98 },
  R37: { id: "R37", x: 46.20, y: 48.70 },
  R38: { id: "R38", x: 46.78, y: 49.00 },
  R39: { id: "R39", x: 48.40, y: 46.79 },

  // CSfield-CSE
  // duplicated: R17: { id: "R17", x: 49.78, y: 31.55 }, // Use R15
  R18: { id: "R18", x: 52.13, y: 34.51 },
  R19: { id: "R19", x: 54.73, y: 31.87 },

  // CSE-EEE
  R27: { id: "R27", x: 50.90, y: 33.01 },
  R28: { id: "R28", x: 50.16, y: 34.33 },

  // CSE-KrishnaHostel
  // duplicated: R20: { id: "R20", x: 52.13, y: 34.51 }, // Use R18
  R21: { id: "R21", x: 59.19, y: 43.50 },
  R22: { id: "R22", x: 60.28, y: 41.96 },

  // CSE-HealthCareCenter
  R32: { id: "R32", x: 56.69, y: 40.32 },
  R33: { id: "R33", x: 66.95, y: 27.25 },
  R34: { id: "R34", x: 64.51, y: 23.98 },

  // KrishnaHostel-CouveryHostel
  // duplicated: R23: { id: "R23", x: 59.19, y: 43.50 }, // Use R21
  R24: { id: "R24", x: 65.26, y: 51.41 },
  R25: { id: "R25", x: 68.60, y: 48.60 },
  R26: { id: "R26", x: 69.55, y: 45.39 },

  // KrishnaHostel-ETE
  // deleted: R29: { id: "R29", x: 59.19, y: 43.50 }, // Use R21
  R30: { id: "R30", x: 52.16, y: 53.15 },
  R31: { id: "R31", x: 52.36, y: 53.54 },

  // ETE-MMFoods
  // duplicate: R40: { id: "R40", x: 52.16, y: 53.15 }, // Use R30
  R41: { id: "R41", x: 48.17, y: 58.40 },
  R42: { id: "R42", x: 46.12, y: 55.81 },
  R43: { id: "R43", x: 45.22, y: 56.48 },

  // MMFoods-Chem
  // duplicated: R44: { id: "R44", x: 48.17, y: 58.40 }, // Use R41
  R45: { id: "R45", x: 48.81, y: 59.46 },
  R46: { id: "R46", x: 49.64, y: 59.65 },
  R47: { id: "R47", x: 49.71, y: 61.48 },

  // Chem-OldLibrary
  // duplicate: R48: { id: "R48", x: 49.64, y: 59.65 }, // Use R46
  R49: { id: "R49", x: 51.32, y: 60.58 },
  R50: { id: "R50", x: 53.46, y: 60.65 },
  R51: { id: "R51", x: 59.08, y: 59.87 },
  R52: { id: "R52", x: 61.64, y: 58.70 },
  R53: { id: "R53", x: 63.25, y: 58.47 },
  R54: { id: "R54", x: 63.04, y: 59.33 },

  // oldLibrary-ISE
  // duplicate: R55: { id: "R55", x: 63.25, y: 58.47 }, // Use R53
  R56: { id: "R56", x: 66.98, y: 59.51 },
  R57: { id: "R57", x: 68.01, y: 60.98 },
  R58: { id: "R58", x: 68.16, y: 62.23 },

  // ISE-RVUniversity
  // duplicate: R59: { id: "R59", x: 66.98, y: 59.51 }, // Use R56
  R60: { id: "R60", x: 69.78, y: 56.92 },
  R61: { id: "R61", x: 71.70, y: 57.92 },
  R62: { id: "R62", x: 73.87, y: 55.30 },
  R63: { id: "R63", x: 76.62, y: 57.30 },

  // Chem-Library
  R65: { id: "R65", x: 54.13, y: 63.79 },
  R66: { id: "R66", x: 56.37, y: 66.67 },
  R67: { id: "R67", x: 57.65, y: 70.13 },
  R68: { id: "R68", x: 58.74, y: 72.63 },
  R69: { id: "R69", x: 59.64, y: 75.81 },
  R70: { id: "R70", x: 60.28, y: 79.07 },
  R71: { id: "R71", x: 57.08, y: 80.23 },
  R72: { id: "R72", x: 56.32, y: 80.03 },

  // Library-CanteenMingos
  // duplicate: R73: { id: "R73", x: 57.08, y: 80.23 }, // Use R71
  R74: { id: "R74", x: 55.85, y: 83.92 },
  R75: { id: "R75", x: 54.38, y: 89.44 },
  R76: { id: "R76", x: 53.70, y: 90.32 },
  R77: { id: "R77", x: 51.29, y: 88.48 },
  R78: { id: "R78", x: 49.43, y: 86.72 },
  R79: { id: "R79", x: 47.81, y: 85.17 },
  R80: { id: "R80", x: 47.23, y: 84.37 },
  R81: { id: "R81", x: 45.80, y: 86.06 },

  // ISE-RVUBlocks
  // duplicate: R82: { id: "R82", x: 71.68, y: 57.98 }, // Use R61
  R83: { id: "R83", x: 72.02, y: 60.99 },
  R84: { id: "R84", x: 72.36, y: 62.81 },
  R85: { id: "R85", x: 73.95, y: 65.25 },
  R86: { id: "R86", x: 74.71, y: 67.98 },
  R87: { id: "R87", x: 75.02, y: 70.19 },
  R88: { id: "R88", x: 74.94, y: 72.05 },
  R89: { id: "R89", x: 74.86, y: 74.07 },
  R90: { id: "R90", x: 75.10, y: 75.62 },

  // CanteenMingos-MCA
  R91: { id: "R91", x: 39.06, y: 90.77 },
  R92: { id: "R92", x: 37.81, y: 92.85 },
  R93: { id: "R93", x: 24.89, y: 77.75 },
  R94: { id: "R94", x: 23.99, y: 78.89 },

  // MCA-Mech
  R96: { id: "R96", x: 14.09, y: 64.89 },
  R97: { id: "R97", x: 12.98, y: 66.28 },

  // Mech-DTH
  // duplicate: R98: { id: "R98", x: 14.09, y: 64.89 }, // Use R96
  R99: { id: "R99", x: 8.35, y: 57.29 },
  R100: { id: "R100", x: 5.54, y: 57.69 },

  // DTH-Admin
  // duplicated: R101: { id: "R101", x: 8.35, y: 57.29 }, // Use R99
  // duplicate: R102: { id: "R102", x: 21.23, y: 40.70 }, // Use R3

  // Chem-PGLabs
  // duplicate: R103: { id: "R103", x: 49.63, y: 59.83 }, // Use R46
  R104: { id: "R104", x: 41.20, y: 70.88 },
  R105: { id: "R105", x: 44.82, y: 75.11 },

  // main-gate-kriyakalpa
  // duplicate: R106: { id: "R106", x: 29.78, y: 29.15 }, // Use R2
  R107: { id: "R107", x: 39.44, y: 42.17 },
  R108: { id: "R108", x: 38.40, y: 44.22 },
  R109: { id: "R109", x: 38.89, y: 45.53 },

  // kriyakalpa-ECE
  // duplicate: R110: { id: "R110", x: 39.44, y: 42.17 }, // Use R107
  // Duplicated: R111: { id: "R111", x: 40.26, y: 40.98 }, // Use R36

  // PGLAbs-CanteenMingos
  // duplicate: R112: { id: "R112", x: 41.26, y: 70.83 }, // Use R104
  R113: { id: "R113", x: 38.89, y: 75.95 },
  R114: { id: "R114", x: 36.08, y: 80.21 },
  R115: { id: "R115", x: 31.97, y: 86.18 },

  // ECE-MMFoods
  // duplicate: R116: { id: "R116", x: 46.24, y: 48.80 }, // Use R37
  R117: { id: "R117", x: 43.88, y: 52.70 },
  // duplicated: R118: { id: "R118", x: 46.12, y: 55.81 } // Use R42

  // Main-gate-exit
  // duplicated: R119: { id: "R119", x: 31.15, y: 27.69 }, // Use R6
  R120: { id: "R120", x: 30.01, y: 21.43 },

  // Main-gate-Kotak
  // deleted: R121: { id: "R121", x: 31.15, y: 27.74 }, // Use R6
  R122: { id: "R122", x: 36.91, y: 21.40 }
};

// ===============================
// BUILDING → ROAD CONNECTORS
// ===============================
const buildingConnectors = [
  { building: "Main Gate", to: road.R1 },
  { building: "Admin Block", to: road.R4 },
  { building: "CS Computer Lab", to: road.R8 },
  { building: "Civil Dept", to: road.R11 },
  { building: "EEE Dept", to: road.R28 },
  { building: "CSE Dept", to: road.R19 },
  { building: "ECE Dept", to: road.R39 },
  { building: "ETE Dept", to: road.R31 },
  { building: "Library", to: road.R72 },
  { building: "Library / Computer Labs", to: road.R54 },
  { building: "ISE Dept", to: road.R58 },
  { building: "Chem Dept", to: road.R47 },
  { building: "PG Labs", to: road.R105 },
  { building: "MM Foods", to: road.R43 },
  { building: "Kriyakalpa", to: road.R109 },
  { building: "Krishna Hostel", to: road.R22 },
  { building: "Cauvery Hostel", to: road.R26 },
  { building: "RV University", to: road.R63 },
  { building: "RVU Blocks", to: road.R90 },
  { building: "Mech Dept", to: road.R97 },
  { building: "AIML Dept", to: road.R94 },
  { building: "MCA", to: road.R94 },
  { building: "Canteen Mingos", to: road.R81 },
  { building: "DTH", to: road.R100 }
];

const pathSegments = [
  { id: "main-gate-admin", points: [ "R1", "R2", "R3", "R4" ] },
  { id: "main-gate-CSLab", points: [ "R2", "R6", "R9", "R8" ] },
  { id: "CSlab-Civil", points: [ "R9", "R10", "R11" ] },
  { id: "Civil-CSfield", points: [ "R10", "R13", "R14", "R15", "R16" ] },
  { id: "CSfield-CSE", points: [ "R15", "R18", "R19" ] },
  { id: "CSE-EEE", points: [ "R27", "R28" ] },
  { id: "CSE-KrishnaHostel", points: [ "R18", "R21", "R22" ] },
  { id: "KrishnaHostel-CouveryHostel", points: [ "R21", "R24", "R25", "R26" ] },
  { id: "KrishnaHostel-ETE", points: [ "R21", "R30", "R31" ] },
  { id: "CSE-HealthCareCenter", points: [ "R32", "R33", "R34" ] },
  { id: "Civil-ECE", points: [ "R13", "R36", "R37", "R38", "R39" ] },
  { id: "ETE-MMFoods", points: [ "R30", "R41", "R42", "R43" ] },
  { id: "MMFoods-Chem", points: [ "R41", "R45", "R46", "R47" ] },
  { id: "Chem-Connector", points: ["R47", "R46"] },
  { id: "Chem-OldLibrary", points: [ "R46", "R49", "R50", "R51", "R52", "R53", "R54" ] },
  { id: "oldLibrary-ISE", points: [ "R53", "R56", "R57", "R58" ] },
  { id: "ISE-RVUniversity", points: [ "R56", "R60", "R61", "R62", "R63" ] },
  { id: "Chem-Library", points: [ "R46", "R65", "R66", "R67", "R68", "R69", "R70", "R71", "R72" ] },
  { id: "Library-CanteenMingos", points: [ "R71", "R74", "R75", "R76", "R77", "R78", "R79", "R80", "R81" ] },
  { id: "ISE-RVUBlocks", points: [ "R61", "R83", "R84", "R85", "R86", "R87", "R88", "R89", "R90" ] },
  { id: "CanteenMingos-MCA/AIML", points: [ "R91", "R92", "R93", "R94" ] },
  { id: "MCA-Mech", points: [ "R93", "R96", "R97" ] },
  { id: "Mech-DTH", points: [ "R96", "R99", "R100" ] },
  { id: "DTH-Admin", points: [ "R99", "R3" ] },
  { id: "Chem-PGLabs", points: [ "R46", "R104", "R105" ] },
  { id: "main-gate-kriyakalpa", points: [ "R2", "R107", "R108", "R109" ] },
  { id: "kriyakalpa-ECE", points: [ "R107", "R36" ] },
  { id: "PGLAbs-CanteenMingos", points: [ "R104", "R113", "R114", "R115" ] },
  { id: "ECE-MMFoods", points: [ "R37", "R117", "R42" ] },
  { id: "Main-gate-exit", points: [ "R6", "R120" ] },
  { id: "Main-gate-Kotak", points: [ "R6", "R122" ] }
];

// ===============================
// BUILD ROAD GRAPH
// ===============================
const graph = {};

// initialize empty adjacency list
Object.keys(road).forEach(key => {
  graph[key] = [];
});

pathSegments.forEach(segment => {
  const pts = segment.points;

  for (let i = 0; i < pts.length - 1; i++) {
    const aKey = pts[i];
    const bKey = pts[i + 1];

    const a = road[aKey];
    const b = road[bKey];

    const dist = distance(a, b);

    graph[aKey].push({ node: bKey, dist });
    graph[bKey].push({ node: aKey, dist });
  }
});

// ===============================
// DIJKSTRA SHORTEST PATH
// ===============================
function dijkstra(graph, start, end) {
  const distances = {};
  const previous = {};
  const visited = new Set();
  const queue = [];

  // Initialize
  Object.keys(graph).forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
  });

  distances[start] = 0;
  queue.push({ node: start, dist: 0 });

  while (queue.length > 0) {
    // Get node with smallest distance
    queue.sort((a, b) => a.dist - b.dist);
    const { node: current } = queue.shift();

    if (visited.has(current)) continue;
    visited.add(current);

    // Stop if reached destination
    if (current === end) break;

    // Explore neighbors
    graph[current].forEach(neighbor => {
      const next = neighbor.node;
      const newDist = distances[current] + neighbor.dist;

      if (newDist < distances[next]) {
        distances[next] = newDist;
        previous[next] = current;
        queue.push({ node: next, dist: newDist });
      }
    });
  }  

  // Reconstruct path
  const path = [];
  let curr = end;

  while (curr) {
    path.unshift(curr);
    curr = previous[curr];
  }

  // If start not reached, no path
  if (path[0] !== start) return [];

  return path;
}

function drawShortestPath(path) {
  if (!path || path.length === 0) return;

  let d = "";

  path.forEach((key, i) => {
    const node = road[key];
    if (!node) return;

    const x = (node.x / 100) * MAP_WIDTH;
    const y = (node.y / 100) * MAP_HEIGHT;

    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  });

  const pathEl = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  pathEl.setAttribute("d", d);
  pathEl.setAttribute("class", "path-shortest");

  routeLayer.appendChild(pathEl);
}

function clearShortestPath() {
  const old = document.querySelector(".path-shortest");
  if (old) old.remove();
}

const routeLayer = document.getElementById("route-layer");
const MAP_WIDTH = 1200;
const MAP_HEIGHT = 800;

// ===============================
// MAP GPS BOUNDARIES (RVCE)
// ===============================
const MAP_BOUNDS = {
  topLeft: {
    lat: 12.924623443287123,     // example – replace later
    lon: 77.49903652695254
  },
  bottomRight: {
    lat: 12.923340938625595,
    lon: 77.50170633049751
  },
  topRight: {
    lat: 12.924209246432738,
    lon: 77.50083875489031
  },
  bottomLeft: {
    lat: 12.922462189184172,
    lon: 77.49963092299815
  }
};


function drawPathNetwork() {
  routeLayer.innerHTML = "";

  pathSegments.forEach(seg => {
    let d = "";

    seg.points.forEach((key, i) => {
      const node = road[key];   // 🔑 lookup
      if (!node) return;

      const x = (node.x / 100) * MAP_WIDTH;
      const y = (node.y / 100) * MAP_HEIGHT;

      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    });

    const path = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );

    path.setAttribute("d", d);
    path.setAttribute("class", "path-default");
    path.setAttribute("data-id", seg.id);

    routeLayer.appendChild(path);
  });
}
// Draw network on load


function drawBuildingConnectors() {
  buildingConnectors.forEach(conn => {
    const b = buildings.find(x => x.name === conn.building);
    if (!b) return;

    const bx = (b.x / 100) * MAP_WIDTH;
    const by = (b.y / 100) * MAP_HEIGHT;

    const rx = (conn.to.x / 100) * MAP_WIDTH;
    const ry = (conn.to.y / 100) * MAP_HEIGHT;

    const path = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );

    path.setAttribute(
      "d",
      `M ${bx} ${by} L ${rx} ${ry}`
    );

    path.setAttribute("class", "path-connector");

    routeLayer.appendChild(path);
  });
}

drawPathNetwork();
drawBuildingConnectors();

// ===============================
// ADD BUILDING LABELS
// ===============================
const overlay = document.getElementById("overlay-layer");

buildings.forEach(b => {
  const label = document.createElement("div");
  label.className = "building-label";
  label.innerText = b.name;
  label.style.left = b.x + "%";
  label.style.top = b.y + "%";
  overlay.appendChild(label);
});

// ===============================
// ZOOM + PAN (WORKING)
// ===============================
const canvas = document.getElementById("map-canvas");

let scale = 1;
let offsetX = 0;
let offsetY = 0;

function applyTransform() {
  canvas.style.transform =
    `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}

function zoomIn() {
  scale += 0.1;
  applyTransform();
}

function zoomOut() {
  scale = Math.max(0.5, scale - 0.1);
  applyTransform();
}

function resetZoom() {
  scale = 1;
  offsetX = 0;
  offsetY = 0;
  applyTransform();
}

const viewport = document.getElementById("map-viewport");

viewport.addEventListener("wheel", function (e) {
  e.preventDefault(); // stop page scrolling

  const zoomIntensity = 0.1;

  if (e.deltaY < 0) {
    // Scroll UP → Zoom IN
    scale += zoomIntensity;
  } else {
    // Scroll DOWN → Zoom OUT
    scale = Math.max(0.5, scale - zoomIntensity);
  }

  applyTransform();
}, { passive: false });

canvas.style.transition = "transform 0.11s ease-out";

// ===============================
// DRAG TO PAN
// ===============================
let dragging = false;
let startX, startY;

canvas.addEventListener("mousedown", e => {
  dragging = true;
  startX = e.clientX - offsetX;
  startY = e.clientY - offsetY;
});

document.addEventListener("mousemove", e => {
  if (!dragging) return;
  offsetX = e.clientX - startX;
  offsetY = e.clientY - startY;
  applyTransform();
});

document.addEventListener("mouseup", () => dragging = false);

// INIT
applyTransform();

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

const shortest = dijkstra(graph, "R8", "R72");
console.log(shortest);

drawShortestPath(shortest);

function getRoadNodeForBuilding(buildingName) {
  const connector = buildingConnectors.find(
    c => c.building === buildingName
  );
  return connector ? connector.to.id : null;
}

// ===============================
// USER LOCATION (YOU ARE HERE)
// ===============================
let userMarker = document.createElement("div");
userMarker.className = "user-marker";
document.getElementById("overlay-layer").appendChild(userMarker);

navigator.geolocation.watchPosition(
  position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const mapPos = gpsToMap(lat, lon);

    // Move user marker
    userMarker.style.left = mapPos.x + "%";
    userMarker.style.top = mapPos.y + "%";

    // 🔥 SNAP TO NEAREST ROAD
    const nearestRoad = findNearestRoadNode(mapPos.x, mapPos.y);

    console.log(
      "Nearest road:",
      nearestRoad.id,
      nearestRoad.x,
      nearestRoad.y
    );

    // (OPTIONAL) store globally for routing
    window.currentUserRoad = nearestRoad.id;
  },

  error => {
    console.error("GPS error:", error);
  },
  {
    enableHighAccuracy: true
  }
);

// ===============================
// GPS → MAP COORDINATE CONVERSION
// ===============================
function gpsToMap(lat, lon) {
  const { topLeft, bottomRight } = MAP_BOUNDS;

  const x =
    ((lon - topLeft.lon) /
    (bottomRight.lon - topLeft.lon)) * 100;

  const y =
    ((topLeft.lat - lat) /
    (topLeft.lat - bottomRight.lat)) * 100;

  return { x, y };
}

// ===============================
// FIND NEAREST ROAD NODE
// ===============================
function findNearestRoadNode(mapX, mapY) {
  let nearest = null;
  let minDist = Infinity;

  Object.values(road).forEach(node => {
    const dx = node.x - mapX;
    const dy = node.y - mapY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < minDist) {
      minDist = dist;
      nearest = node;
    }
  });

  return nearest; // returns full node object
}

document.getElementById("findPathBtn").addEventListener("click", () => {
  const startBuilding = startSelect.value;
  const endBuilding = endSelect.value;

  if (!startBuilding || !endBuilding) {
    alert("Please select both start and destination");
    return;
  }

  clearShortestPath();

  // 👉 PLACE MARKERS
  placeMarkerOnBuilding(startMarker, startBuilding);
  placeMarkerOnBuilding(endMarker, endBuilding);

  const startRoad = getRoadNodeForBuilding(startBuilding);
  const endRoad = getRoadNodeForBuilding(endBuilding);

  if (!startRoad || !endRoad) {
    alert("Road connection missing!");
    return;
  }

  const path = dijkstra(graph, startRoad, endRoad);

  console.log("Shortest path:", path);

  if (path.length === 0) {
    alert("No path found");
    return;
  }

  drawShortestPath(path);
});




