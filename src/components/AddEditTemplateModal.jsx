// src/components/AddEditTemplateModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const availableVariables = [
    { var: '{bemor}', label: 'Bemor ismi' },
    { var: '{sana}', label: 'Sana va vaqt' },
    { var: '{doctor}', label: 'Shifokor ismi' },
    { var: '{clinic}', label: 'Klinika nomi' },
];

const templateTypes = [
    { name: "Bemor qabuli", variables: ['{bemor}', '{sana}', '{doctor}', '{clinic}'] },
    { name: "Tug'ilgan kun", variables: ['{bemor}', '{clinic}'] },
    { name: "Umumiy", variables: ['{bemor}', '{clinic}'] }, // Misol uchun
];

const AddEditTemplateModal = ({ isOpen, onClose, template, updateData }) => {
    const isEditing = !!template;
    const [name, setName] = useState(template?.name || '');
    const [type, setType] = useState(template?.type || templateTypes[0].name);
    const [message, setMessage] = useState(template?.message || '');
    const [status, setStatus] = useState(template?.status ?? true);
    const [error, setError] = useState('');

    // Tanlangan turga mos o'zgaruvchilarni topish
    const selectedType = templateTypes.find(t => t.name === type);
    const currentVariables = selectedType ? selectedType.variables.map(v => availableVariables.find(av => av.var === v)) : [];

    useEffect(() => {
        if (template) {
            setName(template.name);
            setType(template.type);
            setMessage(template.message);
            setStatus(template.status);
        } else {
            setName('');
            setType(templateTypes[0].name);
            setMessage('');
            setStatus(true);
        }
        setError('');
    }, [template, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !message.trim()) {
            setError("Shablon nomi va xabar matni bo'sh bo'lmasligi kerak.");
            return;
        }

        // Xabardagi o'zgaruvchilarni topish (eng sodda usul)
        const usedVariables = availableVariables.filter(v => message.includes(v.var)).map(v => v.var);

        const newTemplate = {
            id: template?.id, // Yangi bo'lsa ID yo'q
            name,
            type,
            status,
            message,
            variables: usedVariables,
            updatedAt: new Date().toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ''),
            createdAt: isEditing ? template.createdAt : new Date().toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ''),
        };

        if (isEditing) {
            updateData('smsTemplates', newTemplate, 'UPDATE');
        } else {
            updateData('smsTemplates', newTemplate, 'ADD');
        }

        onClose();
    };

    const handleVariableInsert = (variable) => {
        setMessage(prev => prev + variable);
    };

    // Bosish hodisasini yuqoriga tarqalishini to'xtatish funksiyasi
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* <div className="fixed inset-0 bg-opacity-75 transition-opacity" onClick={onClose} aria-hidden="true"></div> */}

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" onClick={handleContentClick}>
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                {isEditing ? "Shablonni tahrirlash" : "Yangi shablon qo'shish"}
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            {/* Shablon turi */}
                            <div>
                                <label htmlFor="shablonTuri" className="block text-sm font-medium text-gray-700 mb-1">Shablon turi <span className="text-red-500">*</span></label>
                                <select
                                    id="shablonTuri"
                                    name="shablonTuri"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                                >
                                    {templateTypes.map(t => (
                                        <option key={t.name} value={t.name}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Nomi */}
                            <div>
                                <label htmlFor="shablonNomi" className="block text-sm font-medium text-gray-700 mb-1">Nomi <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="shablonNomi"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Shablon nomi"
                                />
                            </div>

                            {/* Xabar Matni */}
                            <div>
                                <label htmlFor="xabarMatni" className="block text-sm font-medium text-gray-700 mb-1">Xabar matni <span className="text-red-500">*</span></label>
                                <textarea
                                    id="xabarMatni"
                                    rows="5"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                                    placeholder="Xabar matnini kiriting..."
                                ></textarea>
                            </div>

                            {/* Foydali o'zgaruvchilar */}
                            <div className="bg-gray-50 p-3 rounded-md border">
                                <p className="text-sm font-medium text-gray-700 mb-2">Foydali o'zgaruvchilar:</p>
                                <div className="flex flex-wrap gap-2">
                                    {currentVariables.map((v) => (
                                        <button
                                            key={v.var}
                                            type="button"
                                            onClick={() => handleVariableInsert(v.var)}
                                            className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                                            title={v.label}
                                        >
                                            {v.var}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Holati */}
                            <div className="flex items-center pt-2">
                                <input
                                    id="status"
                                    type="checkbox"
                                    checked={status}
                                    onChange={(e) => setStatus(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="status" className="ml-2 block text-sm text-gray-900">
                                    Faol (SMS yuborishda ishlatiladi)
                                </label>
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

export default AddEditTemplateModal;
