// RVCE map GPS bounds (replace later with accurate values)
export const MAP_BOUNDS = {
  topLeft: {
    lat: 12.924623443287123,
    lon: 77.49903652695254
  },
  bottomRight: {
    lat: 12.923340938625595,
    lon: 77.50170633049751
  }
};

// Convert GPS → map percentage
export function gpsToMap(lat, lon) {
  const { topLeft, bottomRight } = MAP_BOUNDS;

  const x =
    ((lon - topLeft.lon) /
      (bottomRight.lon - topLeft.lon)) * 100;

  const y =
    ((topLeft.lat - lat) /
      (topLeft.lat - bottomRight.lat)) * 100;

  return { x, y };
}


