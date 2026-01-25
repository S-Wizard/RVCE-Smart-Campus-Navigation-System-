// RVCE map GPS bounds (replace later with accurate values)
export const MAP_BOUNDS = {
  topLeft: {
    lat: 13.786305788127564,
    lon: 77.79085484240635
  },
  bottomRight: {
    lat: 13.785997548179619,
    lon: 77.79121758532348
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
