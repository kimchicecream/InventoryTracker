import { useState, useEffect } from "react";
import AddItemModal from "../AddItemModal/AddItemModal";
import { fetchParts } from "../../api";
import './Inventory.css';

function Inventory() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [parts, setParts] = useState([]);

    useEffect(() => {
        loadParts();
    }, []);

    const loadParts = async () => {
        const data = await fetchParts();
        setParts(data);
    };

    return (
        <div className="inventory">
            <div className='header-container'><h1>Inventory</h1></div>
            <div className='data-cards-container'>

            </div>
            <div className="search-add-container">
                <div className="search-bar">
                    <div className="search-icon"><i className="fa-solid fa-magnifying-glass"></i></div>
                    <input type="text" placeholder="Search inventory" className="search-input"/>
                </div>
                <button className="add-item-button" onClick={() => setIsModalOpen(true) }>
                    <i className="fa-solid fa-plus"></i> Add Item
                </button>
            </div>
            <div className="big-box">
                <div className="filters-container"></div>
                <div className="labels-container"></div>
                <div className='part-container'></div>
                <div className='pagination'></div>
            </div>
            <AddItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onPartAdded={loadParts} />
        </div>
    );
}

export default Inventory;
