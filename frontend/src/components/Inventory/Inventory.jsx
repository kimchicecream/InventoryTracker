import { useState, useEffect, useRef } from "react";
import AddItemModal from "../AddItemModal/AddItemModal";
import { fetchParts } from "../../api";
import { getLowStockParts, capitalizeFirstLetter, isLowStock } from "../../utils/inventoryLogic";
import './Inventory.css';

function Inventory() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [parts, setParts] = useState([]);
    const [selectedParts, setSelectedParts] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRefs = useRef(new Map());

    useEffect(() => {
        loadParts();
    }, []);

    const loadParts = async () => {
        const data = await fetchParts();
        setParts(data);
    };

    const toggleSelect = (id) => {
        setSelectedParts((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((partId) => partId !== id)
                : [...prevSelected, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedParts.length === parts.length) {
            setSelectedParts([]);
        } else {
            setSelectedParts(parts.map((part) => part.id));
        }
    };

    const handleEllipsisClick = (id) => {
        event.stopPropagation();
        setOpenDropdown(openDropdown === id ? null : id);
    };

    const handleEdit = (id) => {
        console.log(`Edit part: ${id}`);
        setOpenDropdown(null);
    };

    const handleDelete = (id) => {
        console.log(`Delete part: ${id}`);
        setOpenDropdown(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                openDropdown !== null &&
                dropdownRefs.current.get(openDropdown) &&
                !dropdownRefs.current.get(openDropdown).contains(event.target)
            ) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDropdown]);

    const lowStockParts = getLowStockParts(parts);
    const lowStockCount = lowStockParts.length;

    return (
        <div className="inventory">
            <div className='header-container'><h1>Inventory</h1></div>
            <div className="search-add-container">
                <div className="search-bar">
                    <div className="search-icon"><i className="fa-solid fa-magnifying-glass"></i></div>
                    <input type="text" placeholder="Search inventory" className="search-input"/>
                </div>
                <button className="add-item-button" onClick={() => setIsModalOpen(true) }>
                    <i className="fa-solid fa-plus"></i>Add Item
                </button>
            </div>
            <div className='data-cards-container'>
                <div className="data-card" id='one'>
                    <div className="title-number">
                        <div className="data-title">
                            Unavailable parts
                            <div className="tooltip-container">
                                <i className="fa-solid fa-circle-info"></i>
                                <div className="tooltip">Items that have less quantity than its parts per machine, meaning a machine can't be completed until the item is restocked.</div>
                            </div>
                        </div>
                        <div className="data-number">{lowStockCount}</div>
                    </div>
                    <div className="changes"></div>
                </div>
                <div className="data-card" id="two">
                    <div className="title-number">
                        <div className="data-title"></div>
                        <div className="data-number"></div>
                    </div>
                    <div className="changes"></div>
                </div>
                <div className="data-card" id="three">
                    <div className="title-number">
                        <div className="data-title"></div>
                        <div className="data-number"></div>
                    </div>
                    <div className="changes"></div>
                </div>
                <div className="data-card" id="four">
                    <div className="title-number">
                        <div className="data-title"></div>
                        <div className="data-number"></div>
                    </div>
                    <div className="changes"></div>
                </div>
            </div>
            <div className="big-box">
                <div className="filters-container"></div>
                <div className="labels-container">
                    <div className="label select-all">
                        <input
                            type="checkbox"
                            className="checkbox"
                            checked={selectedParts.length === parts.length && parts.length > 0}
                            onChange={toggleSelectAll}
                        />
                    </div>
                    <div className="label image"></div>
                    <div className="label name">Name</div>
                    <div className="label quantity">Quantity</div>
                    <div className="label ppm">PPM</div>
                    <div className="label category">Category</div>
                    <div className="label type">Type</div>
                    <div className="label link">Link</div>
                </div>
                <div className='part-container'>
                    {parts.length > 0 ? (
                            parts.map((part) => (
                            <div
                                key={part.id}
                                className={`part-item ${selectedParts.includes(part.id) ? "selected" : ""}`}
                            >
                                <div className="part select-box">
                                    <input
                                        type="checkbox"
                                        className="checkbox"
                                        checked={selectedParts.includes(part.id)}
                                        onChange={() => toggleSelect(part.id)}
                                    />
                                </div>
                                <img src={part.image || "placeholder.jpg"} alt={part.name} className="part image" />
                                <p className="part name">{part.name}</p>
                                <p className="part quantity">{part.quantity}</p>
                                <p className="part ppm">{part.parts_per_machine}</p>
                                <p className="part category">{capitalizeFirstLetter(part.category)}</p>
                                <p className="part type">{capitalizeFirstLetter(part.type)}</p>
                                <p className="part link">
                                    {part.link && part.link.trim() !== "" ? (
                                        <a href={part.link} target="_blank" rel="noopener noreferrer">
                                            <i className="fa-solid fa-link"></i>
                                        </a>
                                    ) : null}
                                </p>
                                <div className="part options" onClick={(e) => handleEllipsisClick(part.id, e)}>
                                    <i className="fa-solid fa-ellipsis"></i>
                                    {openDropdown === part.id && (
                                        <div
                                            className="dropdown-menu"
                                            ref={(el) => dropdownRefs.current.set(part.id, el)}
                                        >
                                            <button onClick={() => handleEdit(part.id)}>Edit</button>
                                            <span></span>
                                            <button onClick={() => handleDelete(part.id)}>Delete</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            ))
                        ) : (
                            <p className="no-items">No items found</p>
                        )}
                </div>
                <div className='pagination'></div>
            </div>
            <AddItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onPartAdded={loadParts} />
        </div>
    );
}

export default Inventory;
