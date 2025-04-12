import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import Inventory from "../Inventory/Inventory";
import Settings from "../Settings/Settings";
import './Homepage.css';

function Homepage({ parts }) {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard parts={parts} />} />
            <Route path="/inventory" element={<Inventory parts={parts} />} />
            <Route path="/settings" element={<Settings />} />
        </Routes>
    );
}

export default Homepage;
