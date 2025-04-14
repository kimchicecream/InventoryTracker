import { useLocation } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import Inventory from "../Inventory/Inventory";
import Settings from "../Settings/Settings";
import './Homepage.css';

function Homepage({ parts }) {
    const location = useLocation();
    const currentPath = location.pathname.replace("/", "") || "dashboard";

    return (
        <>
            <div style={{ display: currentPath === "dashboard" ? "block" : "none" }}>
                <Dashboard parts={parts} />
            </div>
            <div style={{ display: currentPath === "inventory" ? "block" : "none" }}>
                <Inventory parts={parts} />
            </div>
            <div style={{ display: currentPath === "settings" ? "block" : "none" }}>
                <Settings />
            </div>
        </>
    );
}

export default Homepage;
