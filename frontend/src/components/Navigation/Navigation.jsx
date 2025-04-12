import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navigation.css";

function Navigation() {
    const [isExpanded, setIsExpanded] = useState(true);
    const timeoutRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Derive active button from URL
    const currentPath = location.pathname.replace("/", "") || "dashboard";

    const startMinimizeTimer = () => {
        timeoutRef.current = setTimeout(() => {
            setIsExpanded(false);
        }, 3000); // 3 seconds before collapsing
    };

    const cancelMinimize = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsExpanded(true);
    };

    const handleNavigation = (page) => {
        navigate(`/${page}`);
    };

    return (
        <div
            className={`navigation ${isExpanded ? "expanded" : "minimized"}`}
            onMouseEnter={cancelMinimize}
            onMouseLeave={startMinimizeTimer}
        >
            <button
                className={`dashboard ${currentPath === "dashboard" ? "selected" : ""}`}
                onClick={() => handleNavigation("dashboard")}
            >
                <i className="fa-solid fa-gauge"></i>
            </button>
            <button
                className={`inventory ${currentPath === "inventory" ? "selected" : ""}`}
                onClick={() => handleNavigation("inventory")}
            >
                <i className="fa-solid fa-warehouse"></i>
            </button>
            <button
                className={`settings ${currentPath === "settings" ? "selected" : ""}`}
                onClick={() => handleNavigation("settings")}
            >
                <i className="fa-solid fa-gear"></i>
            </button>
        </div>
    );
}

export default Navigation;
