import './Inventory.css';

function Inventory() {
    return (
        <div className="inventory">
            <div className='header-container'><h1>Inventory</h1></div>
            <div className='data-cards-container'></div>
            <div className="search-add-container">
                <div className="search-bar">
                    <div className="search-icon"></div>
                    <div className="text-field"></div>
                </div>
                <div className="add-part-button">
                    <i className="fa-solid fa-plus"></i> Add part
                </div>
            </div>
            <div className="big-box">
                <div className="filters-container"></div>
                <div className="labels-container"></div>
                <div className='part-container'></div>
            </div>
        </div>
    );
}

export default Inventory;
