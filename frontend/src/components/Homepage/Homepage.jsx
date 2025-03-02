import Navigation from '../Navigation/Navigation';
import Dashboard from '../Dashboard/Dashboard';
import Inventory from '../Inventory/Inventory';
import './Homepage.css';

function Homepage() {
    return (
        <div className='homepage'>
            <Dashboard />
            <Inventory />
        </div>
    );
}

export default Homepage;
