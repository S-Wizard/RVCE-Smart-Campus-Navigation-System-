import { useMemo } from "react";
import { buildingConnectors } from "../data/graph";
import "./DirectionsPanel.css";

export default function DirectionsPanel({ path }) {
    const steps = useMemo(() => {
        if (!path || path.length === 0) return [];

        const landmarks = [];
        const seen = new Set();

        // Map road nodes back to buildings
        // Create a lookup: roadId -> buildingName
        const roadToBuilding = {};
        buildingConnectors.forEach(c => {
            // connecting "to" a road node.
            roadToBuilding[c.to.id] = c.building;
        });

        path.forEach((nodeId, index) => {
            // Is this node a connector to a building?
            if (roadToBuilding[nodeId]) {
                const buildingName = roadToBuilding[nodeId];

                // Don't repeat the same building immediately
                // Don't show start/end here? (Maybe just show navigation)
                if (!seen.has(buildingName)) {
                    landmarks.push({
                        id: nodeId,
                        text: `Pass by ${buildingName}`,
                        icon: "🏢"
                    });
                    seen.add(buildingName);
                }
            }
        });

        if (landmarks.length === 0) {
            return [{ id: "straight", text: "Follow the path", icon: "🚶" }];
        }

        return landmarks;
    }, [path]);

    if (!path || path.length === 0) return null;

    return (
        <div className="directions-panel">
            <div className="directions-header">Route Guide</div>
            <div className="steps-list">
                <div className="step-item start">
                    <span className="step-icon">📍</span>
                    <span className="step-text">Start</span>
                </div>

                {steps.map(step => (
                    <div key={step.id} className="step-item">
                        <span className="step-icon">{step.icon}</span>
                        <span className="step-text">{step.text}</span>
                    </div>
                ))}

                <div className="step-item end">
                    <span className="step-icon">🎯</span>
                    <span className="step-text">Arrive at Destination</span>
                </div>
            </div>
        </div>
    );
}
