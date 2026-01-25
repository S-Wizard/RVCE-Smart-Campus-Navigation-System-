import { useState, useEffect, useRef } from "react";
import { buildings } from "../data/buildings";
import "./SearchBar.css";

export default function SearchBar({ onSelectPlace }) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        if (query.trim().length > 0) {
            const filtered = buildings
                .filter(b => b.name.toLowerCase().includes(query.toLowerCase()))
                .slice(0, 6);
            setSuggestions(filtered);
            setShowDropdown(true);
        } else {
            setSuggestions([]);
            setShowDropdown(false);
        }
    }, [query]);

    // Click away to close
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (place, type) => {
        onSelectPlace(place.name, type);
        setQuery("");
        setShowDropdown(false);
    };

    return (
        <div className="search-bar-container" ref={containerRef}>
            <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search campus places..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query && setShowDropdown(true)}
                />
                {query && (
                    <button className="clear-btn" onClick={() => setQuery("")}>✕</button>
                )}
            </div>

            {showDropdown && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                    {suggestions.map((s) => (
                        <div key={s.name} className="suggestion-item">
                            <div className="suggestion-info">
                                <span className="place-icon">📍</span>
                                <span className="place-name">{s.name}</span>
                            </div>
                            <div className="suggestion-actions">
                                <button onClick={() => handleSelect(s, "start")}>Start</button>
                                <button onClick={() => handleSelect(s, "end")}>Dest</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
