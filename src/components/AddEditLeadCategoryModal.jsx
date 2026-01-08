// src/components/AddEditLeadCategoryModal.jsx

import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
// import { useData } from '../context/DataProvider'; // Keyinroq kerak bo'ladi

const AddEditLeadCategoryModal = ({ isOpen, onClose, category }) => {
    // const { updateData } = useData();
    const isEditing = !!category;
    const [name, setName] = useState(category?.name || '');
    const [status, setStatus] = useState(category?.status ?? true);

    useEffect(() => {
        if (category) {
            setName(category.name);
            setStatus(category.status);
        } else {
            setName('');
            setStatus(true);
        }
    }, [category, isOpen]);

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] bg-opacity-75 transition-opacity" onClick={onClose} aria-hidden="true"></div> */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div
                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full"
                    onClick={handleContentClick}
                >
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                {isEditing ? "Kategoriyani tahrirlash" : "Kategoriya qo'shish"}
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form className="mt-4 space-y-4">
                            {/* Nomi */}
                            <div>
                                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">Kategoriya nomi</label>
                                <input
                                    type="text"
                                    id="categoryName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Kategoriya nomini kiriting"
                                />
                            </div>

                            {/* Holati */}
                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setStatus(true)}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${status ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    Faol
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStatus(false)}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${!status ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    Nofaol
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            // onClick={handleSubmit} // Funksionallik keyin qo'shiladi
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            <Check className="w-5 h-5 mr-1" /> {isEditing ? "Saqlash" : "Qo'shish"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Bekor qilish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditLeadCategoryModal;
