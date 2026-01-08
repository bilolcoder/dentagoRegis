// src/components/AddEditDiseaseModal.jsx
import React from 'react';

const AddEditDiseaseModal = ({ isOpen, onClose, disease }) => {
    if (!isOpen) return null;

    // Vaqtinchalik kontent
    return (
        <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center z-50">
            <div className bg-white p-6 rounded-lg>
                <h3>Kasallik tahrirlash/qo'shish modali</h3>
                <button onClick={onClose}>Yopish</button>
            </div>
        </div>
    );
};

export default AddEditDiseaseModal;
