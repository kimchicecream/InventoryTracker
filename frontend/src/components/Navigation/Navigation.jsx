import { useState, useEffect, useRef } from "react";
import "./Navigation.css";

function Navigation() {
    const [isExpanded, setIsExpanded] = useState(true);
    const timeoutRef = useRef(null);

    const startMinimizeTimer = () => {
        timeoutRef.current = setTimeout(() => {
            setIsExpanded(false);
        }, 3000);
    };

    const cancelMinimize = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsExpanded(true);
    };

    return (
        <div
            className={`navigation ${isExpanded ? "" : "minimized"}`}
            onMouseEnter={cancelMinimize}
            onMouseLeave={startMinimizeTimer}
        >
            <button className="dashboard">
                <i className="fa-solid fa-gauge"></i>
            </button>
            <button className="inventory">
                <i className="fa-solid fa-warehouse"></i>
            </button>
            <button className="settings">
                <i className="fa-solid fa-gear"></i>
            </button>
        </div>
    );
}

export default Navigation;
