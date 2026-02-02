import React from 'react';
import './PlacePopup.css';
import { Icon } from './Icons';

/**
 * PlacePopup Component
 * Displays details about a selected building/place.
 * Behavior:
 * - Desktop: Anchored popup near the location.
 * - Mobile: Bottom sheet style for better reachability.
 */
export default function PlacePopup({ place, onClose, onSetStart, onSetEnd }) {
    if (!place) return null;

    return (
        <div className="place-popup-overlay" onClick={onClose}>
            <div
                className="place-popup-card"
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-labelledby="popup-title"
            >
                <div className="popup-header">
                    <div className="popup-title-group">
                        <span className="popup-type-tag">{place.type || 'Building'}</span>
                        <h3 id="popup-title">{place.name}</h3>
                    </div>
                    <button
                        className="popup-close-btn"
                        onClick={onClose}
                        aria-label="Close details"
                    >
                        <Icon name="close" size={20} />
                    </button>
                </div>

                <div className="popup-body">
                    <p className="popup-description">
                        {place.description || 'No description available for this location.'}
                    </p>
                </div>

                <div className="popup-actions">
                    <button
                        className="action-btn start-btn"
                        onClick={() => {
                            onSetStart(place.name);
                            onClose();
                        }}
                    >
                        <Icon name="location" size={18} />
                        <span>Set as Start</span>
                    </button>
                    <button
                        className="action-btn end-btn"
                        onClick={() => {
                            onSetEnd(place.name);
                            onClose();
                        }}
                    >
                        <Icon name="target" size={18} />
                        <span>Set as Destination</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
