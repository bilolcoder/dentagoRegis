import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Award, ChevronRight, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataProvider';
import AddBrandModal from './modals/AddBrandModal';

const BrandsContent = () => {
    const { data, t } = useData();
    const brands = data.storage?.brands || [];
    const PRIMARY_COLOR = "#00BCE4";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBrand, setCurrentBrand] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenAddEditModal = (brand = null) => {
        setCurrentBrand(brand);
        setIsModalOpen(true);
    };

    const filteredBrands = brands.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 bg-white min-h-screen">
            {/* Header & Breadcrumbs */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">
                        <Link to="/" className="hover:text-[#00BCE4] transition-colors">BOSH SAHIFA</Link>
                        <ChevronRight size={10} />
                        <span className="text-[#00BCE4]">BRENDLAR</span>
                    </nav>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">
                        Brendlar <span style={{ color: PRIMARY_COLOR }}>Boshqaruvi</span>
                    </h1>
                </div>

                <button
                    onClick={() => handleOpenAddEditModal(null)}
                    className="flex items-center gap-2 bg-[#00BCE4] text-white px-8 py-4 rounded-2xl transition-all shadow-xl shadow-[#00BCE4]/20 active:scale-95 font-black text-[10px] uppercase tracking-widest hover:bg-[#009cb3]"
                >
                    <Plus className="w-5 h-5" />
                    {t('add') || "Yangi brend qo'shish"}
                </button>
            </div>

            {/* Brands Main Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">

                {/* Search and Stats Section */}
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#00BCE4] transition-colors" />
                        <input
                            type="text"
                            placeholder={t('search') || "Brend nomini qidirish..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold bg-white outline-none focus:border-[#00BCE4] focus:ring-4 focus:ring-[#00BCE4]/5 transition-all text-slate-700 placeholder:text-slate-400 focus:text-[#00BCE4]"
                        />
                    </div>

                    <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner" style={{ backgroundColor: `${PRIMARY_COLOR}15`, color: PRIMARY_COLOR }}>
                            <Award size={20} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Umumiy miqdor</p>
                            <p className="text-lg font-black text-slate-800 tracking-tighter">{filteredBrands.length} ta brend</p>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-white">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ID Raqami</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Brend nomi</th>
                                <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Holati</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredBrands.map((brand) => (
                                <tr key={brand.id} className="hover:bg-[#00BCE4]/[0.02] transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-[#00BCE4]">
                                            <Hash size={14} strokeWidth={3} />
                                            <span className="text-sm font-black tracking-tighter">
                                                {brand.id.toString().padStart(3, '0')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-sm font-bold text-slate-700 uppercase tracking-tight group-hover:text-[#00BCE4] transition-colors">
                                            {brand.name}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                                            brand.status
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            : 'bg-rose-50 text-rose-500 border-rose-100'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-2 animate-pulse ${brand.status ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                            {brand.status ? "Aktiv" : "Nofaol"}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-end items-center gap-3">
                                            <button
                                                onClick={() => handleOpenAddEditModal(brand)}
                                                className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-[#00BCE4] hover:text-white rounded-xl transition-all shadow-sm"
                                                title="Tahrirlash"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm"
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

                {/* Empty State */}
                {filteredBrands.length === 0 && (
                    <div className="py-32 text-center bg-slate-50/50">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2rem] mb-6 shadow-xl shadow-slate-200 border border-slate-100">
                            <Award className="w-10 h-10 text-slate-200" />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">Brend topilmadi</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Qidiruv so'rovini o'zgartirib ko'ring</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <AddBrandModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    brand={currentBrand}
                />
            )}
        </div>
    );
};

export default BrandsContent;
