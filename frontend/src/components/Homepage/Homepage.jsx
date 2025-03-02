import Dashboard from '../Dashboard/Dashboard';
import Inventory from '../Inventory/Inventory';
import Settings from '../Settings/Settings';
import './Homepage.css';

function Homepage({ activePage }) {
    return (
        <div className='homepage'>
            {activePage === "dashboard" && <Dashboard />}
            {activePage === "inventory" && <Inventory />}
            {activePage === "settings" && <Settings />}
        </div>
    );
}

export default Homepage;
