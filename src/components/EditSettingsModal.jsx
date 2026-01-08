// src/components/EditSettingsModal.jsx

import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useData } from '../context/DataProvider'; // DataProvider'ni to'g'ri ishlatish uchun

const EditSettingsModal = ({ isOpen, onClose, setting }) => {
    const { updateData } = useData(); // updateData ni context'dan olamiz

    const isEditing = !!setting;

    // Agar sozlama mavjud bo'lsa, uni ishlatamiz. Aks holda bo'sh qiymatlar
    const [clinicName, setClinicName] = useState(setting?.clinicName || '');
    const [token, setToken] = useState(setting?.token || '');
    const [error, setError] = useState('');

    useEffect(() => {
        if (setting) {
            setClinicName(setting.clinicName);
            setToken(setting.token);
        } else {
            setClinicName('');
            setToken('');
        }
        setError('');
    }, [setting, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!clinicName.trim() || !token.trim()) {
            setError("Shifoxona nomi va SMS tokeni bo'sh bo'lmasligi kerak.");
            return;
        }

        const newSetting = {
            id: setting?.id || 1, // Sozlamalar odatda bitta bo'ladi, ID 1 bo'lishi mumkin
            clinicName,
            token,
            updatedAt: new Date().toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ''),
        };

        // Sozlama bitta bo'lgani uchun uni har doim o'zgartirish (UPDATE) sifatida qaraymiz
        // Agar massiv bo'sh bo'lsa, ADD (qo'shish) bo'ladi
        if (isEditing) {
            updateData('smsSettings', newSetting, 'UPDATE');
        } else {
            // Agar birinchi marta qo'shayotgan bo'lsa
            updateData('smsSettings', newSetting, 'ADD');
        }

        onClose();
    };

    // Modal ichidagi bosish hodisasini yuqoriga tarqalishini to'xtatish funksiyasi
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Orqa fon (Backdrop) */}
                {/* <div className="fixed inset-0 bg-opacity-75 transition-opacity" onClick={onClose} aria-hidden="true"></div> */}

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div
                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                    onClick={handleContentClick} // Modal ichiga bosish tashqariga o'tmaydi
                >
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                SMS Sozlamalarini tahrirlash
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">

                            {/* Shifoxona nomi */}
                            <div>
                                <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700 mb-1">Shifoxona nomi <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="clinicName"
                                    value={clinicName}
                                    onChange={(e) => setClinicName(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Klinika nomi"
                                />
                            </div>

                            {/* SMS Token */}
                            <div>
                                <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">SMS Token (API kalit) <span className="text-red-500">*</span></label>
                                <input
                                    type="password" // Parol kabi yashirish yaxshi
                                    id="token"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="SMS provayder tomonidan berilgan token"
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-600 mt-2">{error}</p>
                            )}

                        </form>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            <Check className="w-5 h-5 mr-1" /> Saqlash
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

export default EditSettingsModal;
