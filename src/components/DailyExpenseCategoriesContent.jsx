// src/components/DailyExpenseCategoriesContent.jsx

import React, { useState, useEffect } from 'react';
import { Plus, X, Search, Edit, Trash2, FolderTree, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';

// Kategoriya qo'shish/tahrirlash modal oynasi
const AddEditCategoryModal = ({ isOpen, onClose, editingCategory }) => {
    const { updateData, t } = useData();
    const [categoryName, setCategoryName] = useState('');
    const [status, setStatus] = useState('Faol');

    // EditingCategory o'zgarganda formani to'ldirish
    useEffect(() => {
        if (editingCategory) {
            setCategoryName(editingCategory.name || '');
            setStatus(editingCategory.status || 'Faol');
        } else {
            setCategoryName('');
            setStatus('Faol');
        }
    }, [editingCategory, isOpen]);

    const handleSave = () => {
        if (!categoryName) {
            alert(t('fill_required'));
            return;
        }

        const categoryData = {
            id: editingCategory?.id || Date.now(),
            name: categoryName,
            status: status,
        };

        if (editingCategory) {
            updateData('expenseCategories', categoryData, 'UPDATE');
        } else {
            updateData('expenseCategories', categoryData, 'ADD');
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex justify-end transition-all">
            <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex justify-between items-center p-8 border-b border-slate-50">
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tighter italic uppercase">
                            {editingCategory ? t('edit') : t('add')}
                        </h3>
                        <p className="text-[10px] font-bold text-[#00BCE4] uppercase tracking-widest">{t('category')}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8 flex-1">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('category')} {t('name')}</label>
                        <input
                            type="text"
                            placeholder={t('name')}
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:border-[#00BCE4] font-bold text-slate-800 transition-all"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('status')}</label>
                        <div className="flex bg-slate-100 rounded-2xl p-1.5">
                            <button
                                onClick={() => setStatus('Faol')}
                                className={`flex-1 py-3 text-xs font-black uppercase tracking-tighter rounded-xl transition-all ${status === 'Faol' ? 'bg-[#00BCE4] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {t('active')}
                            </button>
                            <button
                                onClick={() => setStatus('Nofaol')}
                                className={`flex-1 py-3 text-xs font-black uppercase tracking-tighter rounded-xl transition-all ${status === 'Nofaol' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {t('inactive')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-slate-50">
                    <button
                        onClick={handleSave}
                        className="w-full py-5 bg-[#00BCE4] text-white font-black rounded-[2rem] shadow-xl shadow-blue-500/20 hover:bg-[#00BCE4] transition-all uppercase tracking-[0.2em] text-xs"
                    >
                        {editingCategory ? t('save') : t('add')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const DailyExpenseCategoriesContent = () => {
    const { data, updateData, t } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenModal = (category = null) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`${name}: ${t('confirm_delete')}`)) {
            updateData('expenseCategories', { id }, 'DELETE');
        }
    };

    const filteredCategories = (data.expenseCategories || []).filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-[0.2em]">
                        <Link to="/" className="hover:text-[#00BCE4] transition-colors">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-[#00BCE4]">{t('expense_categories')}</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">Kategoriyalar</h1>
                </div>

                <div className='flex items-center gap-3 w-full md:w-auto'>
                    <div className="relative flex-1 md:w-72 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#00BCE4] transition-colors" />
                        <input
                            type="text"
                            placeholder={t('search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-4 bg-white text-[#00BCE4] border border-blue-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-sm"
                        />
                    </div>

                    <button
                        onClick={() => handleOpenModal(null)}
                        className='p-4 bg-[#00BCE4] text-white rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-[#00BCE4] transition-all active:scale-95'
                    >
                        <Plus className='w-6 h-6' />
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-[3rem] border border-blue-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-20">#</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('name')}</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-40">{t('status')}</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-32">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((cat, index) => (
                                    <tr key={cat.id} className='hover:bg-blue-50/20 transition-all group'>
                                        <td className="px-8 py-6 text-xs font-bold text-slate-300">{(index + 1).toString().padStart(2, '0')}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#00BCE4]">
                                                    <FolderTree size={14} />
                                                </div>
                                                <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">{cat.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                                cat.status === 'Faol'
                                                ? 'bg-green-50 text-green-600'
                                                : 'bg-red-50 text-red-600'
                                            }`}>
                                                {cat.status === 'Faol' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                                                {cat.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleOpenModal(cat)} className='p-2 bg-blue-50 text-[#00BCE4] rounded-xl hover:bg-[#00BCE4] hover:text-white transition-all'>
                                                    <Edit className='w-4 h-4' />
                                                </button>
                                                <button onClick={() => handleDelete(cat.id, cat.name)} className='p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all'>
                                                    <Trash2 className='w-4 h-4' />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-32 text-center text-slate-300">
                                        <FolderTree size={48} className="mx-auto mb-4 opacity-20" />
                                        <p className="font-bold italic text-slate-400">Hech qanday kategoriya topilmadi</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddEditCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingCategory={editingCategory}
            />
        </div>
    );
};

export default DailyExpenseCategoriesContent;
