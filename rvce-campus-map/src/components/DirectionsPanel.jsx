import { useMemo, useState } from "react";
import { generateInstructions } from "../utils/directionUtils";
import { Icon } from "./Icons";
import "./DirectionsPanel.css";

export default function DirectionsPanel({ path, onClose }) {
    const [isMinimized, setIsMinimized] = useState(false);

    const steps = useMemo(() => {
        return generateInstructions(path);
    }, [path]);

    if (!path || path.length === 0) return null;

    return (
        <div className={`directions-panel ${isMinimized ? "minimized" : ""}`}>
            <div className="directions-header" onClick={() => setIsMinimized(!isMinimized)} aria-label={isMinimized ? "Expand instructions" : "Minimize instructions"}>
                <div className="header-title">
                    <span>Route Guide</span>
                    <Icon name={isMinimized ? "chevron-up" : "chevron-down"} size={16} className="toggle-icon" />
                </div>
                <button className="close-directions" onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }} aria-label="Close directions">
                    <Icon name="close" size={18} />
                </button>
            </div>

            {!isMinimized && (
                <div className="steps-list">
                    {steps.map(step => (
                        <div key={step.id} className={`step-item ${step.id}`}>
                            <Icon name={step.icon} size={20} className="step-icon" />
                            <span className="step-text">{step.text}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Minimized View: Show just next step or destination */}
            {isMinimized && steps.length > 1 && (
                <div className="mini-step">
                    <Icon name={steps[1].icon} size={20} className="step-icon" />
                    <span className="step-text">{steps[1].text}</span>
                </div>
            )}
        </div>
    );
}
