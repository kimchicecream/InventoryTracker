import { useState, useEffect, useRef } from "react";
import AddItemModal from "../AddItemModal/AddItemModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { fetchParts, updatePart, deletePart } from "../../api";
import { getUnavailableParts, capitalizeFirstLetter, getLowStockItems, getMachinesPossible, getTotalUniqueParts } from "../../utils/inventoryLogic";
import './Inventory.css';

function Inventory() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [parts, setParts] = useState([]);
    const [selectedParts, setSelectedParts] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [partToDelete, setPartToDelete] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState("");
    const dropdownRefs = useRef(new Map());

    useEffect(() => {
        loadParts();
    }, []);

    const loadParts = async () => {
        const data = await fetchParts();
        // console.log("Parts received from API:", data);
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

    const handleEllipsisClick = (id, event) => {
        event.stopPropagation();
        setOpenDropdown((prev) => (prev === id ? null : id));
    };


    const handleEdit = (id) => {
        // console.log(`Edit part: ${id}`);
        setOpenDropdown(null);
    };

    const handleDelete = (part) => {
        setPartToDelete(part);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!partToDelete) return;

        try {
            await deletePart(partToDelete.id);
            setParts((prevParts) => prevParts.filter((p) => p.id !== partToDelete.id));
            setIsDeleteModalOpen(false);
            setPartToDelete(null);
        } catch (error) {
            console.error("Error deleting part:", error);
        }
    };

    // const handleEditClick = (partId, field, value) => {
    // };

    const handleEditClick = (partId, field, value) => {
        setParts((prevParts) =>
            prevParts.map((p) =>
                p.id === partId ? { ...p, [field]: value } : p
            )
        );
        setEditingField({ partId, field });
        setEditValue(value);
        updatePart(partId, { [field]: value }).catch((error) => {
            console.error("Error updating part:", error);

        });
    };

    const handleSaveEdit = async () => {
        if (!editingField) return;

        const { partId, field } = editingField;

        try {
            const updatedPart = await updatePart(partId, { [field]: editValue });

            setParts((prevParts) =>
                prevParts.map((p) =>
                    p.id === partId ? { ...p, [field]: updatedPart[field] } : p
                )
            );
        } catch (error) {
            console.error("Error updating part:", error);
        }

        setEditingField(null);
        setEditValue("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSaveEdit();
        }
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

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [openDropdown]);

    const toggleOrderStatus = async (part) => {
        const newStatus = part.status === "Unordered" ? "Ordered" : "Unordered";

        try {
            // console.log("Updating part ID:", part.id);
            // console.log("Sending status:", newStatus);

            const updatedPart = await updatePart(part.id, { status: newStatus });

            setParts((prevParts) =>
                prevParts.map((p) => (p.id === part.id ? { ...p, status: updatedPart.status } : p))
            );

            // console.log("Update successful:", updatedPart);
        } catch (error) {
            console.error("Error updating order status:", error.response?.data || error.message);
        }
    };

    const getAvailabilityStatus = (part) => {
        if (part.quantity === 0) {
            return { label: "Out of Stock", className: "out-of-stock" };
        }
        if (part.parts_per_machine > 0 && part.quantity < part.parts_per_machine * 6) {
            return { label: "Low Stock", className: "low-stock" };
        }
        return { label: "In Stock", className: "in-stock" };
    };

    const unavailablePartsCount = getUnavailableParts(parts).length;
    const lowStockCount = getLowStockItems(parts).length;
    const totalMachinesBuildable = getMachinesPossible(parts);
    const totalUniqueParts = getTotalUniqueParts(parts);
    const categoryOptions = ["Writing", "Feeding", "Electronic", "Hardware"];
    const typeOptions = ["OTS", "3D-print", "Laser cut"];

    return (
        <div className="inventory">
            <div className='header-container'><h1>Inventory</h1></div>
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
                        <div className="data-number">{unavailablePartsCount}</div>
                    </div>
                    <div className="changes"></div>
                </div>
                <div className="data-card" id="two">
                    <div className="title-number">
                        <div className="data-title">
                            Low stock items
                            <div className="tooltip-container">
                                <i className="fa-solid fa-circle-info"></i>
                                <div className="tooltip">Items that don't have enough quantity to complete the next 6 machines.</div>
                            </div>
                        </div>
                        <div className="data-number">{lowStockCount}</div>
                    </div>
                    <div className="changes"></div>
                </div>
                <div className="data-card" id="three">
                    <div className="title-number">
                        <div className="data-title">
                            Total machines possible
                            <div className="tooltip-container">
                                <i className="fa-solid fa-circle-info"></i>
                                <div className="tooltip">The total number of machines that are possible to complete with current inventory quantity.</div>
                            </div>
                        </div>
                        <div className="data-number">{totalMachinesBuildable}</div>
                    </div>
                    <div className="changes"></div>
                </div>
                <div className="data-card" id="four">
                    <div className="title-number">
                        <div className="data-title">
                            Total items
                            <div className="tooltip-container">
                                <i className="fa-solid fa-circle-info"></i>
                                <div className="tooltip">The total number of unqiue items in the inventory.</div>
                            </div>
                        </div>
                        <div className="data-number">{totalUniqueParts}</div>
                    </div>
                    <div className="changes"></div>
                </div>
            </div>
            <div className="search-add-container">
                <div className="search-bar">
                    <div className="search-icon"><i className="fa-solid fa-magnifying-glass"></i></div>
                    <input type="text" placeholder="Search inventory" className="search-input"/>
                </div>
                <button className="add-item-button" onClick={() => setIsModalOpen(true) }>
                    <i className="fa-solid fa-plus"></i>Add Item
                </button>
            </div>
            <div className="big-box">
                <div className="filters-container">
                    <div className="total-items-shown">
                        Showing {parts.length} {parts.length === 1 ? "item" : "items"}
                    </div>
                    <button className="delete-selected"><i className="fa-solid fa-trash"></i></button>
                </div>
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
                    <div className="label status">Order status</div>
                    <div className="label availability">Availability</div>
                </div>
                <div className='part-container'>
                {parts.map((part) => {
                    const { label, className } = getAvailabilityStatus(part);

                    return (
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
                            <p className="part placeholder"></p>
                            <p
                                className="part name"
                                onClick={() => handleEditClick(part.id, "name", part.name)}
                            >
                                {editingField?.partId === part.id && editingField?.field === "name" ? (
                                    <input
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onBlur={handleSaveEdit}
                                        onKeyDown={handleKeyDown}
                                        autoFocus
                                    />
                                ) : (
                                    part.name
                                )}
                            </p>
                            <p
                                className="part quantity"
                                onClick={() => handleEditClick(part.id, "quantity", part.quantity)}
                            >
                                {editingField?.partId === part.id && editingField?.field === "quantity" ? (
                                    <input
                                        type="number"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onBlur={handleSaveEdit}
                                        onKeyDown={handleKeyDown}
                                        autoFocus
                                    />
                                ) : (
                                    part.quantity
                                )}
                            </p>

                            <p
                                className="part ppm"
                                onClick={() => handleEditClick(part.id, "parts_per_machine", part.parts_per_machine)}
                            >
                                {editingField?.partId === part.id && editingField?.field === "parts_per_machine" ? (
                                    <input
                                        type="number"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onBlur={handleSaveEdit}
                                        onKeyDown={handleKeyDown}
                                        autoFocus
                                    />
                                ) : (
                                    part.parts_per_machine
                                )}
                            </p>
                            <div className="part category">
                                <div className="custom-select">
                                    <select
                                        value={part.category || "-"}
                                        onChange={(e) => handleEditClick(part.id, "category", e.target.value)}
                                        onBlur={handleSaveEdit}
                                    >
                                        <option value="-" disabled>-</option>
                                        {categoryOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="part type">
                                <div className="custom-select">
                                    <select
                                        value={part.part_type || "-"}
                                        onChange={(e) => handleEditClick(part.id, "part_type", e.target.value)}
                                        onBlur={handleSaveEdit}
                                    >
                                        <option value="-" disabled>-</option>
                                        {typeOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <p className="part link">
                                {part.link && part.link.trim() !== "" ? (
                                    <a href={part.link} target="_blank" rel="noopener noreferrer">
                                        <i className="fa-solid fa-link"></i>
                                    </a>
                                ) : null}
                            </p>
                            <p className={`part status ${part.status.toLowerCase()}`} onClick={() => toggleOrderStatus(part)}>{part.status}</p>
                            <p className={`part availability ${className}`}>{label}</p>
                            <div className="part options" onClick={(e) => handleEllipsisClick(part.id, e)}>
                                <i className="fa-solid fa-ellipsis"></i>
                                {openDropdown === part.id && (
                                    <div
                                        className="dropdown-menu"
                                        ref={(el) => dropdownRefs.current.set(part.id, el)}
                                    >
                                        <button onClick={() => handleEdit(part.id)}>Edit</button>
                                        <span></span>
                                        <button onClick={() => handleDelete(part)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                </div>
                <div className='pagination'></div>
            </div>
            <AddItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onPartAdded={loadParts} />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                partName={partToDelete?.name}
            />
        </div>
    );
}

export default Inventory;
