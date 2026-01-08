import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
// import { useData } from '../../../context/DataProvider';

const AddBrandModal = ({ isOpen, onClose, brand }) => {
    // const { updateData } = useData();
    const isEditing = !!brand;
    const [name, setName] = useState(brand?.name || '');
    const [status, setStatus] = useState(brand?.status ?? true);

    useEffect(() => {
        if (brand) {
            setName(brand.name);
            setStatus(brand.status);
        } else {
            setName('');
            setStatus(true);
        }
    }, [brand, isOpen]);


    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Saqlash mantig'i bu yerda bo'ladi (updateData orqali)
        console.log("Brend saqlandi:", { name, status });
        onClose();
    };


    if (!isOpen) return null;

    // Rasmdagi Saydbar (Modal) dizayni: image_fe7a1b.png
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
                                {isEditing ? "Brendni tahrirlash" : "Brend qo'shish"}
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Saydbar kontenti (Forma) */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6 grow overflow-y-auto">
                            {/* Nomi maydoni (image_fe7a1b.png) */}
                            <div>
                                <label htmlFor="brandName" className="block text-sm font-medium text-gray-700">Nomi*</label>
                                <input
                                    type="text"
                                    id="brandName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Nomi kiriting..."
                                    required
                                />
                            </div>

                            {/* Holati (Lead kategoriyalariga o'xshash) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Holati</label>
                                <div className="flex gap-4">
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
                                    form="modal-form" // Submit qilish uchun formani id orqali bog'lashimiz mumkin
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

export default AddBrandModal;
