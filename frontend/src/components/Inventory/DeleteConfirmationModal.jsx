import "./DeleteConfirmationModal.css";

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, partName }) {
    if (!isOpen) return null;

    return (
        <div className="delete-modal-overlay">
            <div className="delete-modal">
                <h2>Delete Part</h2>
                <p>Are you sure you want to delete <strong>{partName}</strong>?</p>
                <div className="delete-modal-actions">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="delete-btn" onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmationModal;
