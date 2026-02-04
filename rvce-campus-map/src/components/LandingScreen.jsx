import React from 'react';
import './LandingScreen.css';

const LandingScreen = ({ onEnter }) => {
    return (
        <div className="landing-container">
            <div className="landing-content">
                <div className="logo-section">
                    <img src="/rvce-logo.png" alt="RVCE Logo" className="landing-logo" />
                    <h1 className="landing-title">RVCE Smart Campus Navigation</h1>
                    <p className="landing-subtitle">Discover your campus with ease and precision.</p>
                </div>

                <button className="enter-button" onClick={onEnter}>
                    <span>Enter Map</span>
                    <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>

                <div className="landing-footer">
                    <div className="feature-badges">
                        <span>Offline Maps</span>
                        <span>Indoor Nav</span>
                        <span>Personalized</span>
                    </div>
                    <p>© 2026 RVCE Smart Campus Project</p>
                </div>
            </div>

            <div className="landing-bg">
                <div className="gradient-blob one"></div>
                <div className="gradient-blob two"></div>
                <div className="gradient-blob three"></div>
            </div>
        </div>
    );
};

export default LandingScreen;
