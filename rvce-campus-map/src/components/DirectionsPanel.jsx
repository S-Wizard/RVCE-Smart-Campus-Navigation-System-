import { useMemo, useState } from "react";
import { generateInstructions } from "../utils/directionUtils";
import "./DirectionsPanel.css";

export default function DirectionsPanel({ path, onClose }) {
    const [isMinimized, setIsMinimized] = useState(false);

    const steps = useMemo(() => {
        return generateInstructions(path);
    }, [path]);

    if (!path || path.length === 0) return null;

    return (
        <div className={`directions-panel ${isMinimized ? "minimized" : ""}`}>
            <div className="directions-header" onClick={() => setIsMinimized(!isMinimized)}>
                <div className="header-title">
                    <span>Route Guide</span>
                    <span className="toggle-icon">{isMinimized ? "🔼" : "🔽"}</span>
                </div>
                <button className="close-directions" onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}>✕</button>
            </div>

            {!isMinimized && (
                <div className="steps-list">
                    {steps.map(step => (
                        <div key={step.id} className={`step-item ${step.id}`}>
                            <span className="step-icon">{step.icon}</span>
                            <span className="step-text">{step.text}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Minimized View: Show just next step or destination */}
            {isMinimized && steps.length > 1 && (
                <div className="mini-step">
                    <span className="step-icon">{steps[1].icon}</span>
                    <span className="step-text">{steps[1].text}</span>
                </div>
            )}
        </div>
    );
}
