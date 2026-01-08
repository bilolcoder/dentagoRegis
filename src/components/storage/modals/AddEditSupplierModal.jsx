// src/components/storage/modals/AddEditSupplierModal.jsx

import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const AddEditSupplierModal = ({ isOpen, onClose, supplier }) => {
    const isEditing = !!supplier;
    const [formData, setFormData] = useState({
        firstName: supplier?.firstName || supplier?.name || '',
        lastName: supplier?.lastName || '',
        phone1: supplier?.phone1 || '',
        phone2: supplier?.phone2 || '',
        status: supplier?.status ?? true,
    });

    useEffect(() => {
        if (supplier) {
            setFormData({
                firstName: supplier.firstName || supplier.name,
                lastName: supplier.lastName || '',
                phone1: supplier.phone1 || '',
                phone2: supplier.phone2 || '',
                status: supplier.status ?? true,
            });
        } else {
            setFormData({ firstName: '', lastName: '', phone1: '', phone2: '', status: true });
        }
    }, [supplier, isOpen]);

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Majburiy maydonlarni tekshirish (Ism, Telefon 1)
        if (!formData.firstName.trim() || !formData.phone1.trim()) {
            alert("Iltimos, Ism va Kamida 1-telefon raqamini kiriting.");
            return;
        }

        // Saqlash mantig'i bu yerda bo'ladi (updateData orqali)
        console.log(isEditing ? "Yetkazib beruvchi tahrirlandi:" : "Yangi Yetkazib beruvchi qo'shildi:", formData);
        onClose();
    };


    if (!isOpen) return null;

    // Rasmdagi Saydbar (Modal) dizayni: image_fd951e.png
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Overlay */}
            <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] bg-opacity-50 transition-opacity" onClick={onClose}></div>

            {/* Modal/Saydbar Konteyner */}
            <div className="fixed inset-y-0 right-0 max-w-full flex">
                <div
                    className="w-screen max-w-md bg-white shadow-xl"
                    onClick={handleContentClick}
                >
                    <div className="h-full flex flex-col">

                        {/* Saydbar sarlavhasi */}
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-xl font-medium text-gray-900">
                                {isEditing ? "Yetkazib beruvchini tahrirlash" : "Yetkazib beruvchi qo'shish"}
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Saydbar kontenti (Forma) */}
                        <form onSubmit={handleSubmit} id="modal-form" className="p-6 space-y-6 grow overflow-y-auto">

                            {/* Ism maydoni */}
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Ism*</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Ismini kiriting..."
                                    required
                                />
                            </div>

                            {/* Familiya maydoni */}
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Familiya</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Familiyasini kiriting..."
                                />
                            </div>

                            {/* Telefon raqami 1 */}
                            <div>
                                <label htmlFor="phone1" className="block text-sm font-medium text-gray-700">Telefon raqami 1*</label>
                                <input
                                    type="text"
                                    id="phone1"
                                    value={formData.phone1}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Telefon raqamini kiriting..."
                                    required
                                />
                            </div>

                            {/* Telefon raqami 2 */}
                            <div>
                                <label htmlFor="phone2" className="block text-sm font-medium text-gray-700">Telefon raqami 2</label>
                                <input
                                    type="text"
                                    id="phone2"
                                    value={formData.phone2}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Telefon raqamini kiriting..."
                                />
                            </div>

                            {/* Holati (Faol / Nofaol) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Holati</label>
                                <div className="flex gap-4 p-2 bg-gray-100 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, status: true }))}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${formData.status ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        Faol
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, status: false }))}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${!formData.status ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        Nofaol
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Amallar (Footer) */}
                        <div className="p-4 border-t bg-gray-50">
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    form="modal-form"
                                    className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    <Check className="w-5 h-5 mr-1" /> {isEditing ? "Saqlash" : "Qo'shish"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditSupplierModal;
