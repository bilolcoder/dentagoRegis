import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useData } from '../../../context/DataProvider'; // DataProvider'dan foydalanish uchun

const AddDocumentModal = ({ isOpen, onClose, document }) => {
    const { data } = useData();
    // Yetkazib beruvchilar ro'yxatini DataProvider'dan olamiz
    const suppliers = data.storage?.suppliers || [];

    const isEditing = !!document;
    const [name, setName] = useState(document?.name || '');
    const [supplier, setSupplier] = useState(document?.supplier || '');
    const [date, setDate] = useState(document?.date || '');
    const [file, setFile] = useState(null); // Fayl obyekti
    const [fileNameDisplay, setFileNameDisplay] = useState(document?.filename || 'Fayl tanlanmagan');

    useEffect(() => {
        if (document) {
            setName(document.name);
            setSupplier(document.supplier);
            setDate(document.date);
            setFileNameDisplay(document.filename);
        } else {
            setName('');
            setSupplier('');
            setDate('');
            setFile(null);
            setFileNameDisplay('Fayl tanlanmagan');
        }
    }, [document, isOpen]);

    // Input maydoniga bosish hodisasini to'xtatish
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    // Fayl tanlanganda
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileNameDisplay(selectedFile ? selectedFile.name : 'Fayl tanlanmagan');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Asosiy maydonlarni tekshirish
        if (!name.trim() || !supplier || !date.trim()) {
            alert("Iltimos, yulduzcha (*) bilan belgilangan barcha maydonlarni to'ldiring.");
            return;
        }

        // Saqlash mantig'i bu yerda bo'ladi (updateData orqali)
        console.log("Hujjat saqlandi:", { name, supplier, date, fileName: fileNameDisplay, file: file ? file.name : null });
        onClose();
    };


    if (!isOpen) return null;

    // Rasmdagi Saydbar (Modal) dizayni: image_fe7e54.png
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
                                {isEditing ? "Hujjatni tahrirlash" : "Hujjat qo'shish"}
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Saydbar kontenti (Forma) */}
                        <form onSubmit={handleSubmit} id="modal-form" className="p-6 space-y-6 grow overflow-y-auto">

                            {/* Nomi maydoni */}
                            <div>
                                <label htmlFor="documentName" className="block text-sm font-medium text-gray-700">Nomi*</label>
                                <input
                                    type="text"
                                    id="documentName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Nomi kiriting..."
                                    required
                                />
                            </div>

                            {/* Yetkazib beruvchi (Dropdown) */}
                            <div>
                                <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">Yetkazib beruvchi*</label>
                                <select
                                    id="supplier"
                                    value={supplier}
                                    onChange={(e) => setSupplier(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                                    required
                                >
                                    <option value="" disabled>Tanlang</option>
                                    {suppliers.map(s => (
                                        <option key={s.id} value={s.name}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sana maydoni */}
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Sana*</label>
                                <input
                                    type="date"
                                    id="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                />
                            </div>

                            {/* Fayl maydoni (file inputi) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fayl</label>
                                <label className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm text-gray-500 cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    {fileNameDisplay} {/* Tanlangan fayl nomini ko'rsatish */}
                                </label>
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

export default AddDocumentModal;
