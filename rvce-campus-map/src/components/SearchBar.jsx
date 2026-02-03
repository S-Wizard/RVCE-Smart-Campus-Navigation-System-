import { useState, useEffect, useRef } from "react";
import { buildings } from "../data/buildings";
import { Icon } from "./Icons";
import "./SearchBar.css";

export default function SearchBar({ onSelectPlace, user, onOpenAuth, onOpenProfile }) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const containerRef = useRef(null);
    const recognitionRef = useRef(null);

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

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = "en-US";

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setQuery(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech Recognition Error:", event.error);
                setErrorMsg(event.error === "not-allowed" ? "Mic permission denied" : "Couldn't recognize");
                setIsListening(false);
                setTimeout(() => setErrorMsg(""), 3000);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            setErrorMsg("Speech API not supported");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setErrorMsg("");
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

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
            <div className={`search-input-wrapper ${isListening ? "listening" : ""}`}>
                <Icon name="search" size={20} className="search-icon" aria-label="Search" />
                <input
                    type="text"
                    placeholder={isListening ? "Listening..." : "Search campus places..."}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query && setShowDropdown(true)}
                />

                <div className="search-actions">
                    {query && (
                        <button className="clear-btn" onClick={() => setQuery("")} aria-label="Clear search">
                            <Icon name="clear" size={18} />
                        </button>
                    )}
                    <button
                        className={`mic-btn ${isListening ? "active" : ""}`}
                        onClick={toggleListening}
                        title="Voice Search"
                        aria-label={isListening ? "Stop listening" : "Start voice search"}
                    >
                        {isListening ? <Icon name="stop" size={18} /> : <Icon name="mic" size={18} />}
                    </button>

                    <div className="auth-actions">
                        {user ? (
                            <button className="profile-btn" onClick={onOpenProfile} aria-label="Open profile">
                                <div className="profile-initial">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                            </button>
                        ) : (
                            <button className="login-btn" onClick={onOpenAuth}>
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {errorMsg && <div className="voice-error">{errorMsg}</div>}

            {showDropdown && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                    {suggestions.map((s) => (
                        <div key={s.name} className="suggestion-item">
                            <div className="suggestion-info">
                                <Icon name="location-filled" size={16} className="place-icon" />
                                <span className="place-name">{s.name}</span>
                            </div>
                            <div className="suggestion-actions">
                                <button onClick={() => handleSelect(s, "start")} aria-label={`Start from ${s.name}`}>Start</button>
                                <button onClick={() => handleSelect(s, "end")} aria-label={`Go to ${s.name}`}>Dest</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
