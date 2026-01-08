import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Ruler, ChevronRight, Hash, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataProvider';
import Modal from '../common/Modal'; // Umumiy modalni ishlatamiz

const UnitsContent = () => {
    const { data, updateData, t } = useData();
    const units = data.storage?.units || [];
    const PRIMARY_COLOR = "#00BCE4";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUnit, setCurrentUnit] = useState(null);

    // Modal form state
    const [formData, setFormData] = useState({
        name: '',
        status: true
    });

    const handleOpenModal = (unit = null) => {
        if (unit) {
            setCurrentUnit(unit);
            setFormData({ name: unit.name, status: unit.status });
        } else {
            setCurrentUnit(null);
            setFormData({ name: '', status: true });
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formData.name) return;

        const action = currentUnit ? 'UPDATE' : 'ADD';
        const payload = currentUnit
            ? { ...formData, id: currentUnit.id }
            : { ...formData, id: Date.now() };

        updateData('units', payload, action);
        setIsModalOpen(false);
    };

    const filteredUnits = units.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 bg-white min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">
                        <Link to="/" className="hover:text-[#00BCE4] transition-colors">BOSH SAHIFA</Link>
                        <ChevronRight size={10} />
                        <span className="text-[#00BCE4]">O'LCHOV BIRLIKLARI</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-[#00BCE4]/10 text-[#00BCE4]">
                            <Ruler size={28} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">
                            O'lchov <span style={{ color: PRIMARY_COLOR }}>Birliklari</span>
                        </h1>
                    </div>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-3 bg-[#00BCE4] text-white px-8 py-4 rounded-2xl transition-all shadow-xl shadow-[#00BCE4]/20 active:scale-95 font-black text-[10px] uppercase tracking-widest hover:brightness-110"
                >
                    <Plus className="w-5 h-5" strokeWidth={3} />
                    Yangi birlik qo'shish
                </button>
            </div>

            {/* Top Bar: Search & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
                <div className="lg:col-span-3 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#00BCE4] transition-colors" />
                    <input
                        type="text"
                        placeholder="Birlik nomini yozing (masalan: kg, dona, litr)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-100 rounded-[24px] text-slate-700 font-bold outline-none focus:ring-4 focus:ring-[#00BCE4]/5 focus:border-[#00BCE4] focus:bg-white transition-all shadow-sm"
                    />
                </div>
                <div className="bg-white p-5 rounded-[24px] border border-slate-100 flex items-center justify-between shadow-xl shadow-slate-100/50">
                    <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                        <Layers size={22} strokeWidth={2.5} />
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Jami turlar</p>
                        <p className="text-2xl font-black text-slate-800 tracking-tighter leading-none">{units.length}</p>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-50">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ID</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Birlik Nomi</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUnits.length > 0 ? (
                                filteredUnits.map((unit, index) => (
                                    <tr key={unit.id} className="hover:bg-[#00BCE4]/[0.02] transition-all group">
                                        <td className="px-10 py-6">
                                            <span className="text-xs font-black text-slate-300 font-mono group-hover:text-[#00BCE4] transition-colors">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-[#00BCE4] opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100" />
                                                <span className="text-sm font-black text-slate-700 uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-block">
                                                    {unit.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex justify-center">
                                                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                                                    unit.status
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : 'bg-rose-50 text-rose-600 border-rose-100'
                                                }`}>
                                                    {unit.status ? 'Faol' : 'Nofaol'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(unit)}
                                                    className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all active:scale-90 border border-transparent hover:border-blue-100"
                                                >
                                                    <Edit size={16} strokeWidth={2.5} />
                                                </button>
                                                <button className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90 border border-transparent hover:border-rose-100">
                                                    <Trash2 size={16} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-32 text-center bg-slate-50/30">
                                        <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200 border border-slate-100">
                                            <Hash className="w-10 h-10 text-slate-200" />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">Birliklar topilmadi</h3>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Qidiruv so'rovini tekshiring yoki yangi qo'shing</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal - Yangilangan Uslubda */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentUnit ? "Birlikni tahrirlash" : "Yangi birlik qo'shish"}
                footer={
                    <div className="flex gap-4 p-2 w-full">
                        <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4.5 bg-slate-100 text-slate-500 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all">
                            Bekor qilish
                        </button>
                        <button onClick={handleSave} className="flex-1 py-4.5 bg-[#00BCE4] text-white font-black rounded-2xl shadow-xl shadow-[#00BCE4]/30 text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all hover:brightness-110">
                            Saqlash
                        </button>
                    </div>
                }
            >
                <div className="space-y-6 py-6 px-2">
                    <div className="relative group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-[#00BCE4] transition-colors">O'lchov Birligi Nomi</label>
                        <div className="relative">
                            <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#00BCE4]" size={18} />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full pl-12 pr-5 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 outline-none focus:border-[#00BCE4] focus:bg-white transition-all font-bold text-sm"
                                placeholder="Masalan: Kilogramm, Dona..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                            <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Holati</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Tizimda foydalanish imkoniyati</p>
                        </div>
                        <button
                            onClick={() => setFormData({...formData, status: !formData.status})}
                            className={`w-14 h-8 rounded-full relative transition-all duration-300 ${formData.status ? 'bg-[#00BCE4]' : 'bg-slate-300'}`}
                        >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-sm ${formData.status ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UnitsContent;
