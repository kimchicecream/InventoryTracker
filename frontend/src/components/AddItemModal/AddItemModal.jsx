import { useState } from "react";
import { addPart, uploadImage } from "../../api.js"; // Import API functions
import "./AddItemModal.css";

function AddItemModal({ isOpen, onClose, onPartAdded }) {
    const [formData, setFormData] = useState({
        name: "",
        quantity: "",
        category: "",
        file: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = null;

        if (formData.file) {
            imageUrl = await uploadImage(formData.file); // Upload the image
        }

        const newPart = {
            name: formData.name,
            quantity: parseInt(formData.quantity, 10),
            category: formData.category,
            image: imageUrl,
        };

        await addPart(newPart); // Send part data to backend
        onPartAdded(); // Refresh inventory list
        onClose(); // Close modal
    };

    return (
        <div className={`modal-overlay ${isOpen ? "show" : ""}`} onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Add New Item</h2>
                <form onSubmit={handleSubmit}>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                    <label>Quantity:</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />

                    <label>Category:</label>
                    <select name="category" value={formData.category} onChange={handleChange}>
                        <option value="">Select a category</option>
                        <option value="writing">Writing</option>
                        <option value="feeding">Feeding</option>
                        <option value="electronics">Electronics</option>
                    </select>

                    <label>Image:</label>
                    <input type="file" onChange={handleFileChange} />

                    <button type="submit">Add Item</button>
                </form>
                <button className="close-btn" onClick={onClose}>X</button>
            </div>
        </div>
    );
}

export default AddItemModal;
