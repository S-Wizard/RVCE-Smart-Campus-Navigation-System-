// RVCE map GPS bounds (replace later with accurate values)
export const MAP_BOUNDS = {
  topLeft: {
    lat: 13.788155863882825,
    lon: 77.79144716327114
  },
  bottomRight: {
    lat: 13.779674799291119,
    lon: 77.79992095773365
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


//temp
