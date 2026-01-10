import React, { useState, useEffect } from 'react';
import { X, Upload, Check, FileText } from 'lucide-react';
import { useData } from '../../../context/DataProvider';

const AddDocumentModal = ({ isOpen, onClose, document }) => {
    const { data, updateDocuments } = useData();

    const isEditing = !!document;

    const [name, setName] = useState('');
    const [supplier, setSupplier] = useState('');
    const [date, setDate] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('');
    const [file, setFile] = useState(null);
    const [fileNameDisplay, setFileNameDisplay] = useState('Fayl tanlanmagan');

    useEffect(() => {
        if (isOpen) {
            if (document) {
                setName(document.name || '');
                setSupplier(document.supplier || '');
                setDate(document.date || '');
                setDeliveryMethod(document.deliveryMethod || '');
                setFileNameDisplay(document.filename || 'Fayl tanlanmagan');
                setFile(null);
            } else {
                setName('');
                setSupplier('');
                setDate(new Date().toISOString().split('T')[0]);
                setDeliveryMethod('');
                setFile(null);
                setFileNameDisplay('Fayl tanlanmagan');
            }
        }
    }, [document, isOpen]);

    const handleContentClick = (e) => e.stopPropagation();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileNameDisplay(selectedFile.name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim() || !supplier.trim() || !date.trim() || !deliveryMethod.trim()) {
            alert("Iltimos, barcha majburiy maydonlarni to'ldiring (*)");
            return;
        }

        const newDoc = {
            id: isEditing ? document.id : Date.now().toString(),
            name: name.trim(),
            supplier: supplier.trim(),
            date,
            deliveryMethod: deliveryMethod.trim(),
            filename: file ? file.name : (fileNameDisplay !== 'Fayl tanlanmagan' ? fileNameDisplay : ''),
        };

        let updatedDocs;

        if (isEditing) {
            updatedDocs = (data.storage?.documents || []).map((doc) =>
                doc.id === document.id ? { ...doc, ...newDoc } : doc
            );
        } else {
            updatedDocs = [...(data.storage?.documents || []), newDoc];
        }

        // Yangi ro'yxatni saqlaymiz
        updateDocuments(updatedDocs);

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden" onClick={onClose} role="dialog">
            <div className="absolute inset-0 bg-black/40 transition-opacity" />

            <div
                className="absolute inset-y-0 right-0 w-full max-w-md transform transition-transform duration-300 ease-out translate-x-0"
                onClick={handleContentClick}
            >
                <div className="h-full flex flex-col bg-white shadow-2xl">
                    {/* Header */}
                    <div className="px-6 py-5 border-b flex items-center justify-between bg-gray-50">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {isEditing ? "Hujjatni tahrirlash" : "Yangi hujjat qo'shish"}
                        </h3>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6 overflow-y-auto">
                        {/* Nomi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nomi <span className="text-red-500">*</span>
                            </label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="Hujjat nomini kiriting..." />
                        </div>

                        {/* Yetkazib beruvchi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Yetkazib beruvchi / Ta'minotchi <span className="text-red-500">*</span>
                            </label>
                            <input type="text" value={supplier} onChange={(e) => setSupplier(e.target.value)} required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="Kompaniya yoki shaxs nomi..." />
                        </div>

                        {/* Sana */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sana <span className="text-red-500">*</span>
                            </label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                        </div>

                        {/* Yetkazib berish usuli */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Qanday yetkazib berildi? <span className="text-red-500">*</span>
                            </label>
                            <input type="text" value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)} required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="Masalan: shaxsan, kuryer, email orqali..." />
                        </div>

                        {/* Fayl */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fayl yuklash</label>
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-colors">
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600">Faylni tanlang yoki bu yerga tortib tashlang</span>
                                <span className="text-xs text-gray-500 mt-1">PDF, Word, Excel, PPT (maks 25MB)</span>
                                <input type="file" className="hidden" onChange={handleFileChange} />
                            </label>
                            {fileNameDisplay && fileNameDisplay !== 'Fayl tanlanmagan' && (
                                <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    <span className="truncate max-w-[260px]">{fileNameDisplay}</span>
                                </div>
                            )}
                        </div>
                    </form>

                    <div className="px-6 py-4 border-t bg-gray-50">
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={onClose}
                                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                                Bekor qilish
                            </button>
                            <button type="submit"
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium">
                                <Check className="w-5 h-5" />
                                {isEditing ? "Saqlash" : "Qo'shish"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddDocumentModal;
