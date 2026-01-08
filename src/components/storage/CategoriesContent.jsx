import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Tag, ChevronRight, Hash, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataProvider';
import AddCategoryModal from './modals/AddCategoryModal';

const CategoriesContent = () => {
    const { data, t } = useData();
    const categories = data.storage?.categories || [];
    const PRIMARY_COLOR = "#00BCE4";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenAddEditModal = (category = null) => {
        setCurrentCategory(category);
        setIsModalOpen(true);
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 bg-white min-h-screen">
            {/* Breadcrumbs & Title Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">
                        <Link to="/" className="hover:text-[#00BCE4] transition-colors">BOSH SAHIFA</Link>
                        <ChevronRight size={10} />
                        <span className="text-[#00BCE4]">KATEGORIYALAR</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#00BCE4]/10 text-[#00BCE4]">
                            <Layers size={24} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">
                            Kategoriyalar <span style={{ color: PRIMARY_COLOR }}>Nazorati</span>
                        </h1>
                    </div>
                </div>

                <button
                    onClick={() => handleOpenAddEditModal(null)}
                    className="flex items-center gap-2 bg-[#00BCE4] text-white px-8 py-4 rounded-2xl transition-all shadow-xl shadow-[#00BCE4]/20 active:scale-95 font-black text-[10px] uppercase tracking-widest hover:brightness-110"
                >
                    <Plus className="w-5 h-5" strokeWidth={3} />
                    {t('add') || "Yangi Kategoriya"}
                </button>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">

                {/* Search & Statistics Bar */}
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#00BCE4] transition-colors" />
                        <input
                            type="text"
                            placeholder={t('search') || "Kategoriyani qidirish..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold bg-white outline-none focus:border-[#00BCE4] focus:ring-4 focus:ring-[#00BCE4]/5 transition-all text-slate-700 placeholder:text-slate-400 focus:text-[#00BCE4]"
                        />
                    </div>

                    <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#00BCE4]/10 text-[#00BCE4]">
                            <Tag size={20} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Jami turlar</p>
                            <p className="text-lg font-black text-slate-800 tracking-tighter leading-none">{filteredCategories.length} ta kategoriya</p>
                        </div>
                    </div>
                </div>

                {/* Categories Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-white">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ID</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kategoriya Nomi</th>
                                <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Boshqaruv</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredCategories.map((category) => (
                                <tr key={category.id} className="hover:bg-[#00BCE4]/[0.02] transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-[#00BCE4]">
                                            <Hash size={14} strokeWidth={3} />
                                            <span className="text-sm font-black tracking-tighter">
                                                {category.id}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-sm font-bold text-slate-700 uppercase tracking-tight group-hover:text-[#00BCE4] transition-colors">
                                            {category.name}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                                            category.status
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            : 'bg-rose-50 text-rose-500 border-rose-100'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${category.status ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`}></span>
                                            {category.status ? "Aktiv" : "Nofaol"}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-end items-center gap-3">
                                            <button
                                                onClick={() => handleOpenAddEditModal(category)}
                                                className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-[#00BCE4] hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                                                title="Tahrirlash"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                                                title="O'chirish"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State Illustration */}
                {filteredCategories.length === 0 && (
                    <div className="py-32 flex flex-col items-center justify-center bg-slate-50/50">
                        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-slate-200 border border-slate-100">
                            <Layers className="text-slate-200 w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">Kategoriya topilmadi</h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">
                            Qidiruv so'rovini tekshiring yoki yangi tur qo'shing
                        </p>
                    </div>
                )}
            </div>

            {/* Modal Component */}
            {isModalOpen && (
                <AddCategoryModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    category={currentCategory}
                />
            )}
        </div>
    );
};

export default CategoriesContent;
