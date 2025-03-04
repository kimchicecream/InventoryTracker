import './Inventory.css';

function Inventory() {
    return (
        <div className="inventory">
            <div className='header-container'><h1>Inventory</h1></div>
            <div className='data-cards-container'></div>
            <div className="search-add-container">
                <div className="search-bar">
                    <div className="search-icon"><i className="fa-solid fa-magnifying-glass"></i></div>
                    <input
                        type="text"
                        placeholder="Search inventory"
                        className="search-input"
                    />
                </div>
                <button className="add-item-button">
                    <i className="fa-solid fa-plus"></i> Add Item
                </button>
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
