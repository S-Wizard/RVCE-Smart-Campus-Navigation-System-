/**
 * HOW TO CALIBRATE MAP_BOUNDS:
 * 1. Open Google Maps and find your campus.
 * 2. Identify the exact spot that corresponds to the TOP-LEFT corner of your map image (rvce-map.png).
 *    - Right-click on that spot in Google Maps to copy the Latitude and Longitude.
 * 3. Do the same for the BOTTOM-RIGHT corner of your map image.
 * 4. Replace the values below with the ones you copied.
 * 
 * NOTE: For best accuracy, ensure your map image is oriented with True North at the top.
 */
export const MAP_BOUNDS = {
  topLeft: {
    lat: 12.924813080306123, // Replace with actual Top-Left Latitude
    lon: 77.49903051629468   // Replace with actual Top-Left Longitude
  },
  bottomRight: {
    lat: 12.922975268142578, // Replace with actual Bottom-Right Latitude
    lon: 77.50163323386622 // Replace with actual Bottom-Right Longitude
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


