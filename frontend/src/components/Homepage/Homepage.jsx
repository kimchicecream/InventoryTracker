import Dashboard from '../Dashboard/Dashboard';
import Inventory from '../Inventory/Inventory';
import Settings from '../Settings/Settings';
import './Homepage.css';

function Homepage() {
    return (
        <div className='homepage'>
            <Dashboard />
            <Inventory />
            <Settings />
        </div>
    );
}

export default Homepage;
