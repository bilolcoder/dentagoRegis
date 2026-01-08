// src/components/ViewTemplateModal.jsx
import React from 'react';
import { X } from 'lucide-react';

const ViewTemplateModal = ({ isOpen, onClose, template }) => {
    if (!isOpen || !template) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] bg-opacity-75 transition-opacity" onClick={onClose} aria-hidden="true"></div> */}

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                Shablon ma'lumotlari
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-3">
                            <div className="text-sm">
                                <p className="font-semibold text-gray-700">Nomi:</p>
                                <p className="text-gray-900">{template.name}</p>
                            </div>

                            <div className="text-sm">
                                <p className="font-semibold text-gray-700">Turi:</p>
                                <p className="text-blue-600 font-medium">{template.type}</p>
                            </div>

                            <div className="text-sm">
                                <p className="font-semibold text-gray-700">Holati:</p>
                                <p className={`font-medium ${template.status ? 'text-green-600' : 'text-red-600'}`}>
                                    {template.status ? 'Faol' : 'Nofaol'}
                                </p>
                            </div>

                            <div className="text-sm">
                                <p className="font-semibold text-gray-700">Yaratilgan:</p>
                                <p className="text-gray-600">{template.createdAt}</p>
                            </div>

                            <div className="text-sm">
                                <p className="font-semibold text-gray-700">Yangilangan:</p>
                                <p className="text-gray-600">{template.updatedAt}</p>
                            </div>

                            <div className="text-sm border-t pt-3">
                                <p className="font-semibold text-gray-700 mb-1">Xabar matni:</p>
                                <div className="bg-gray-50 p-3 rounded-md border text-gray-800 whitespace-pre-wrap">
                                    {template.message}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Yopish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewTemplateModal;
