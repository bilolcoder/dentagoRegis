// src/components/storage/modals/AddEditUnitModal.jsx

import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
// import { useData } from '../../../context/DataProvider'; // Saqlash uchun

const AddEditUnitModal = ({ isOpen, onClose, unit }) => {
    // const { updateData } = useData();
    const isEditing = !!unit;
    const [name, setName] = useState(unit?.name || '');
    // O'lchov birliklari rasmda Faol/Nofaol holatiga ega
    const [status, setStatus] = useState(unit?.status ?? true);

    useEffect(() => {
        if (unit) {
            setName(unit.name);
            setStatus(unit.status ?? true); // Default holatni Faol deb olamiz
        } else {
            setName('');
            setStatus(true);
        }
    }, [unit, isOpen]);

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Nomini kiriting!");
            return;
        }

        // Saqlash mantig'i bu yerda bo'ladi (updateData orqali)
        console.log("O'lchov birligi saqlandi:", { name, status });
        onClose();
    };

    if (!isOpen) return null;

    // Rasmdagi Saydbar (Modal) dizayni: image_fd9558.png, image_fd953d.png
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Overlay */}
            <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] bg-opacity-50 transition-opacity" onClick={onClose}></div>

            {/* Modal/Saydbar Konteyner */}
            <div className="fixed inset-y-0 right-0 max-w-full flex">
                <div
                    className="w-screen max-w-sm bg-white shadow-xl"
                    onClick={handleContentClick}
                >
                    <div className="h-full flex flex-col">

                        {/* Saydbar sarlavhasi */}
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-xl font-medium text-gray-900">
                                {isEditing ? "Tahrirlash" : "O'lchov birlik qo'shish"}
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Saydbar kontenti (Forma) */}
                        <form onSubmit={handleSubmit} id="modal-form" className="p-6 space-y-6 grow overflow-y-auto">

                            {/* Nomi maydoni */}
                            <div>
                                <label htmlFor="unitName" className="block text-sm font-medium text-gray-700">Nomi</label>
                                <input
                                    type="text"
                                    id="unitName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Nomi kiriting..."
                                    required
                                />
                            </div>

                            {/* Holati (Faol / Nofaol) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Holati</label>
                                <div className="flex gap-4 p-2 bg-gray-100 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setStatus(true)}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${status ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        Faol
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStatus(false)}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${!status ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        Nofaol
                                    </button>
                                </div>
                            </div>

                            {/* Qo'shish / Saqlash tugmasi */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="inline-flex justify-center items-center w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    {isEditing ? "Saqlash" : "Qo'shish"}
                                </button>
                            </div>
                        </form>

                        {/* Bekor qilish tugmasi */}
                        <div className="p-4 border-t bg-gray-50">
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex justify-center w-full py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100"
                            >
                                Bekor qilish
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditUnitModal;
