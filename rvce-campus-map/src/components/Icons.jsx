import React from "react";

export const Icon = ({ name, size = 20, className = "", ...props }) => {
    const icons = {
        search: (
            <path d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" />
        ),
        mic: (
            <g>
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                <path d="M19 10v1a7 7 0 01-14 0v-1M12 18v4M8 22h8" />
            </g>
        ),
        stop: (
            <rect x="4" y="4" width="16" height="16" rx="2" />
        ),
        clear: (
            <path d="M18 6L6 18M6 6l12 12" />
        ),
        close: (
            <path d="M18 6L6 18M6 6l12 12" />
        ),
        location: (
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        ),
        "location-filled": (
            <g>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" fill="currentColor" opacity="0.2" />
                <circle cx="12" cy="10" r="3" />
            </g>
        ),
        target: (
            <g fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" />
            </g>
        ),
        recenter: (
            <path d="M3 12h7M14 12h7M12 3v7M12 14v7M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        ),
        reset: (
            <path d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15" />
        ),
        "rotate-left": (
            <path d="M2.5 2v6h6M2.5 8a10 10 0 11.5 4" />
        ),
        "rotate-right": (
            <path d="M21.5 2v6h-6M21.5 8a10 10 0 10-.5 4" />
        ),
        "compass-arrow": (
            <path d="M12 2L19 21L12 17L5 21L12 2Z" fill="currentColor" />
        ),
        "arrow-up": (
            <path d="M12 19V5M5 12l7-7 7 7" />
        ),
        "arrow-left": (
            <path d="M19 12H5M12 19l-7-7 7-7" />
        ),
        "arrow-right": (
            <path d="M5 12h14M12 5l7 7-7 7" />
        ),
        "chevron-up": (
            <path d="M18 15L12 9l-6 6" />
        ),
        "chevron-down": (
            <path d="M6 9l6 6 6-6" />
        ),
        start: (
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" />
        ),
        destination: (
            <path d="M12 2L19 21L12 17L5 21L12 2Z" />
        )
    };

    const path = icons[name] || null;

    if (!path) return null;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`ui-icon ${className}`}
            role="img"
            aria-hidden="true"
            {...props}
        >
            {path}
        </svg>
    );
};
