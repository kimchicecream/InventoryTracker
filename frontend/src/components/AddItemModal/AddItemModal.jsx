import { useState, useRef } from "react";
import { addPart, uploadImage } from "../../api.js";
import "./AddItemModal.css";

function AddItemModal({ isOpen, onClose, onPartAdded }) {
    const [formData, setFormData] = useState({
        name: "",
        quantity: "",
        category: "",
        file: null,
    });

    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    };

    const handleClose = () => {
        setFormData({
            name: "",
            quantity: "",
            category: "",
            file: null,
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = null;

        if (formData.file) {
            imageUrl = await uploadImage(formData.file);
        }

        const newPart = {
            name: formData.name,
            quantity: parseInt(formData.quantity, 10),
            category: formData.category,
            image: imageUrl,
        };

        await addPart(newPart);

        onPartAdded();
        handleClose();
    };

    return (
        <div className={`modal-overlay ${isOpen ? "show" : "hide"}`} onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <form id="add-item-form" onSubmit={handleSubmit}>
                    <h3>Add New Item</h3>
                    <label>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                    <label>Quantity</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />

                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleChange}>
                        <option value="">Select a category</option>
                        <option value="writing">Writing</option>
                        <option value="feeding">Feeding</option>
                        <option value="electronics">Electronics</option>
                    </select>

                    <label>Image</label>
                    <input type="file" onChange={handleFileChange} />
                </form>
                <div className="footer-buttons">
                    <button className='submit-button' type="submit" form="add-item-form">Add Item</button>
                    <button className="close-button" onClick={handleClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default AddItemModal;
