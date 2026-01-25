import { useMemo } from "react";
import { generateInstructions } from "../utils/directionUtils";
import "./DirectionsPanel.css";

export default function DirectionsPanel({ path }) {
    const steps = useMemo(() => {
        return generateInstructions(path);
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
