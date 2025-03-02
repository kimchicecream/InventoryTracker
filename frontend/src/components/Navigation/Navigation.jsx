import { useState, useRef } from "react";
import "./Navigation.css";

function Navigation({ setActivePage }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [activeButton, setActiveButton] = useState("dashboard");
    const timeoutRef = useRef(null);

    const startMinimizeTimer = () => {
        timeoutRef.current = setTimeout(() => {
            setIsExpanded(false);
        }, 3000); // 3 seconds before collpasing
    };

    const cancelMinimize = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsExpanded(true);
    };

    const handleNavigation = (page) => {
        setActivePage(page);
        setActiveButton(page);
    };

    return (
        <div
            className={`navigation ${isExpanded ? "expanded" : "minimized"}`}
            onMouseEnter={cancelMinimize}
            onMouseLeave={startMinimizeTimer}
        >
            <button
                className={`dashboard ${activeButton === "dashboard" ? "selected" : ""}`}
                onClick={() => handleNavigation("dashboard")}
            >
                <i className="fa-solid fa-gauge"></i>
            </button>
            <button
                className={`inventory ${activeButton === "inventory" ? "selected" : ""}`}
                onClick={() => handleNavigation("inventory")}
            >
                <i className="fa-solid fa-warehouse"></i>
            </button>
            <button
                className={`settings ${activeButton === "settings" ? "selected" : ""}`}
                onClick={() => handleNavigation("settings")}
            >
                <i className="fa-solid fa-gear"></i>
            </button>
        </div>
    );
}

export default Navigation;
