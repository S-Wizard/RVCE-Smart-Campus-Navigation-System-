import { buildings } from "../data/buildings";
import "./BuildingLabels.css";

export default function BuildingLabels() {
  return (
    <div className="label-layer">
      {buildings.map(b => (
        <div
          key={b.name}
          className="building-label"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`
          }}
        >
          {b.name}
        </div>
      ))}
    </div>
  );
}
