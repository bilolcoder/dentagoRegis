// src/components/modals/LogoutConfirmationModal.jsx
import React, { useEffect } from 'react';
import { X, LogOut } from 'lucide-react';
import { useData } from '../../context/DataProvider';

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    const { t } = useData();

    // Esc tugmasi bilan yopish
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Modal ochiq bo‘lmasa – hech narsa qaytarmaslik
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose} // Tashqi fon bosilganda yopiladi
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95"
                onClick={(e) => e.stopPropagation()} // Ichki qism bosilganda yopilmasin
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t('logout') || 'Chiqish'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Yopish"
                    >
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-8 flex flex-col items-center text-center">
                    {/* Qizil doira + LogOut ikonasi */}
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-100/50 dark:ring-red-900/20">
                        <LogOut className="w-10 h-10 text-red-600 dark:text-red-400" strokeWidth={2} />
                    </div>

                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        {t('sure_to_logout') || 'Haqiqatan ham chiqmoqchimisiz?'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
                        {t('logout_confirmation_message') || 'Tizimdan chiqasiz va barcha faol sessiyalar tugatiladi. Keyingi safar qayta kirishingiz kerak bo‘ladi.'}
                    </p>
                </div>

                {/* Footer / Actions */}
                <div className="px-6 py-5 bg-gray-50 dark:bg-gray-900/50 flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 active:scale-95"
                    >
                        {t('no_close') || 'Yo‘q, qolaman'}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-8 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-red-600/30 active:scale-95"
                    >
                        {t('yes_logout') || 'Ha, chiqaman'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmationModal;