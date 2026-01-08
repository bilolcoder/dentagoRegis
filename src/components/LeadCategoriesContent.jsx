import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Target, ChevronRight, BarChart3, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';
import Modal from './common/Modal';

const LeadCategoriesContent = () => {
    const { data, updateData, t } = useData();
    const PRIMARY_COLOR = "#00BCE4";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        status: true
    });

    const categories = data.leadCategories || [
        { id: 1, name: "Yangi kelganlar", status: true },
        { id: 2, name: "Muloqotda", status: true },
        { id: 3, name: "Uchrashuv belgilandi", status: true },
        { id: 4, name: "Rad etildi", status: false },
    ];

    const handleOpenModal = (category = null) => {
        if (category) {
            setCurrentCategory(category);
            setFormData({ name: category.name, status: category.status });
        } else {
            setCurrentCategory(null);
            setFormData({ name: '', status: true });
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formData.name) return;
        const action = currentCategory ? 'UPDATE' : 'ADD';
        const payload = currentCategory
            ? { ...formData, id: currentCategory.id }
            : { ...formData, id: Date.now() };

        updateData('leadCategories', payload, action);
        setIsModalOpen(false);
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 bg-white min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">
                        <Link to="/" className="hover:text-[#00BCE4] transition-colors">BOSH SAHIFA</Link>
                        <ChevronRight size={10} />
                        <span className="text-[#00BCE4]">LEAD KATEGORIYALARI</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-[#00BCE4]/10 text-[#00BCE4]">
                            <Target size={28} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">
                            Lead <span style={{ color: PRIMARY_COLOR }}>Bosqichlari</span>
                        </h1>
                    </div>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-3 bg-[#00BCE4] text-white px-8 py-4 rounded-2xl transition-all shadow-xl shadow-[#00BCE4]/20 active:scale-95 font-black text-[10px] uppercase tracking-widest hover:brightness-110"
                >
                    <Plus className="w-5 h-5" strokeWidth={3} />
                    Yangi bosqich qo'shish
                </button>
            </div>

            {/* Quick Stats & Search */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#00BCE4] transition-colors" />
                    <input
                        type="text"
                        placeholder="Kategoriya nomini qidirish..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-700 font-bold outline-none focus:ring-4 focus:ring-[#00BCE4]/5 focus:border-[#00BCE4] focus:bg-white transition-all shadow-sm"
                    />
                </div>
                <div className="bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center justify-around shadow-xl shadow-slate-200/40">
                    <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Jami bosqich</p>
                        <p className="text-xl font-black text-slate-800 tracking-tighter">{categories.length}</p>
                    </div>
                    <div className="w-[1px] h-8 bg-slate-100" />
                    <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Faol bosqich</p>
                        <p className="text-xl font-black text-emerald-500 tracking-tighter">{categories.filter(c => c.status).length}</p>
                    </div>
                </div>
            </div>

            {/* Table Layout */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-50">
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sira</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bosqich Nomi</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredCategories.map((cat, index) => (
                                <tr key={cat.id} className="hover:bg-[#00BCE4]/[0.02] transition-all group">
                                    <td className="px-10 py-7">
                                        <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-[#00BCE4] group-hover:text-white transition-all">
                                            {index + 1}
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-[#00BCE4] opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100" />
                                            <span className="text-sm font-black text-slate-700 uppercase tracking-wide group-hover:translate-x-1 transition-transform inline-block italic">
                                                {cat.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex justify-center">
                                            <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                                                cat.status
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                : 'bg-rose-50 text-rose-600 border-rose-100'
                                            }`}>
                                                {cat.status ? 'Faol bosqich' : 'To\'xtatilgan'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => handleOpenModal(cat)}
                                                className="w-11 h-11 flex items-center justify-center text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-[14px] transition-all active:scale-90 border border-transparent hover:border-blue-100"
                                            >
                                                <Edit size={18} strokeWidth={2.5} />
                                            </button>
                                            <button className="w-11 h-11 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-[14px] transition-all active:scale-90 border border-transparent hover:border-rose-100">
                                                <Trash2 size={18} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentCategory ? "Bosqichni tahrirlash" : "Yangi bosqich qo'shish"}
            >
                <div className="space-y-6 py-4 px-2">
                    <div className="relative group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-[#00BCE4] transition-colors">Kategoriya Nomi</label>
                        <div className="relative">
                            <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#00BCE4]" size={18} />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full pl-12 pr-5 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 outline-none focus:border-[#00BCE4] focus:bg-white transition-all font-bold text-sm"
                                placeholder="Masalan: Muloqot boshlandi..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 group">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${formData.status ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                                <BarChart3 size={18} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Status</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Hozirgi holati</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setFormData({...formData, status: !formData.status})}
                            className={`w-14 h-8 rounded-full relative transition-all duration-300 shadow-inner ${formData.status ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-md ${formData.status ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full py-5 bg-slate-900 text-white font-black rounded-[2rem] shadow-xl shadow-slate-200 hover:bg-black transition-all uppercase tracking-[0.2em] text-[10px] mt-4"
                    >
                        Bosqichni saqlash
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default LeadCategoriesContent;
