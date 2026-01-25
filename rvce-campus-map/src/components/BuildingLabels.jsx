import { useTransformContext } from "react-zoom-pan-pinch";
import { buildings } from "../data/buildings";
import "./BuildingLabels.css";

export default function BuildingLabels() {
  const { transformState } = useTransformContext();
  const scale = transformState.scale;

  return (
    <div className="label-layer">
      {buildings.map(b => (
        <div
          key={b.name}
          className="building-label"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            transform: `translate(-50%, -50%) scale(${1 / scale})`
          }}
        >
          {b.name}
        </div>
      ))}
    </div>
  );
}
