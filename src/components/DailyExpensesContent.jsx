import React, { useState } from 'react';
import { Plus, Calendar, Search, Edit, Trash2, Wallet, Tag, CreditCard, ChevronRight, ArrowDownRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';
import Modal from './common/Modal';

const DailyExpensesContent = () => {
    const { data, updateData, t } = useData();
    const categories = data.expenseCategories || [];
    const expensesList = data.dailyExpenses || [];
    const PRIMARY_COLOR = "#00BCE4";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        date: new Date().toLocaleDateString('uz-UZ'),
        category: '',
        paymentType: 'Naqd',
    });

    const handleOpenModal = (expense = null) => {
        if (expense) {
            setEditingExpense(expense);
            setFormData({ ...expense });
        } else {
            setEditingExpense(null);
            setFormData({
                name: '',
                price: '',
                description: '',
                date: new Date().toLocaleDateString('uz-UZ'),
                category: '',
                paymentType: 'Naqd',
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`${name}: ${t('confirm_delete')}`)) {
            updateData('dailyExpenses', { id }, 'DELETE');
        }
    };

    const handleSave = () => {
        if (!formData.name || !formData.price || !formData.category) {
            alert("Iltimos, barcha majburiy maydonlarni to'ldiring!");
            return;
        }
        if (editingExpense) {
            updateData('dailyExpenses', formData, 'UPDATE');
        } else {
            updateData('dailyExpenses', { ...formData, id: Date.now() }, 'ADD');
        }
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const totalSum = expensesList.reduce((sum, item) => sum + (parseInt(String(item.price).replace(/\s/g, '')) || 0), 0);

    const filteredExpenses = expensesList.filter(exp =>
        exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 bg-white min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">
                        <Link to="/" className="hover:text-[#00BCE4] transition-colors">BOSH SAHIFA</Link>
                        <ChevronRight size={10} />
                        <span className="text-[#00BCE4]">KUNLIK XARAJATLAR</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-[#00BCE4] text-white">
                            <ArrowDownRight size={28} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">
                            Xarajatlar <span className="text-[#00BCE4]">Nazorati</span>
                        </h1>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    <div className="flex-1 lg:flex-none bg-slate-50 px-6 py-3.5 rounded-2xl border border-slate-100 shadow-sm min-w-[200px]">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Umumiy chiqim</p>
                        <p className="text-xl font-black text-slate-800 tracking-tight italic">
                            {totalSum.toLocaleString('uz-UZ')} <span className="text-[10px] text-slate-400 uppercase ml-1">UZS</span>
                        </p>
                    </div>
                    <button
                        onClick={() => handleOpenModal(null)}
                        className="flex items-center gap-3 bg-[#00BCE4] text-white px-8 py-4.5 rounded-2xl transition-all shadow-xl shadow-slate-200 active:scale-95 font-black text-[10px] uppercase tracking-widest hover:bg-black"
                    >
                        <Plus size={18} strokeWidth={3} />
                        Xarajat qo'shish
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#00BCE4] transition-colors" />
                    <input
                        type="text"
                        placeholder="Nomi yoki kategoriya bo'yicha qidirish..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-700 font-bold outline-none focus:ring-4 focus:ring-[#00BCE4]/5 focus:border-[#00BCE4] focus:bg-white transition-all shadow-sm"
                    />
                </div>
                <button className="px-6 py-5 bg-white border border-slate-100 rounded-[2rem] text-slate-400 hover:text-[#00BCE4] transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest shadow-sm">
                    <Filter size={18} /> Saralash
                </button>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-50">
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sana / Izoh</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Xarajat Nomi</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kategoriya</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">To'lov</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Summa</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredExpenses.length > 0 ? (
                                filteredExpenses.map((exp) => (
                                    <tr key={exp.id} className="hover:bg-slate-50/80 transition-all group">
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-xl bg-slate-100 text-slate-400 group-hover:bg-[#00BCE4]/10 group-hover:text-[#00BCE4] transition-colors">
                                                    <Calendar size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-700 italic uppercase">{exp.date}</p>
                                                    {exp.description && <p className="text-[10px] text-slate-400 font-bold truncate max-w-[120px] uppercase tracking-tighter mt-0.5">{exp.description}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <span className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-[#00BCE4] transition-colors">{exp.name}</span>
                                        </td>
                                        <td className="px-10 py-7">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200/50 group-hover:bg-white transition-colors">
                                                <Tag size={10} strokeWidth={3} /> {exp.category}
                                            </span>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-2">
                                                <CreditCard size={14} className="text-slate-300" />
                                                <span className="text-[10px] font-black text-slate-500 uppercase italic">{exp.paymentType}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <span className="text-base font-black text-[#00BCE4] tracking-tighter italic">-{exp.price}</span>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                <button onClick={() => handleOpenModal(exp)} className="w-10 h-10 flex items-center justify-center bg-blue-50 text-[#00BCE4] rounded-xl hover:bg-[#00BCE4] hover:text-white transition-all shadow-sm active:scale-90">
                                                    <Edit size={16} strokeWidth={2.5} />
                                                </button>
                                                <button onClick={() => handleDelete(exp.id, exp.name)} className="w-10 h-10 flex items-center justify-center bg-rose-50 text-[#00BCE4] rounded-xl hover:bg-[#00BCE4] hover:text-white transition-all shadow-sm active:scale-90">
                                                    <Trash2 size={16} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-32 text-center">
                                        <div className="inline-flex p-8 bg-slate-50 rounded-[3rem] mb-6 text-slate-200 border-2 border-dashed border-slate-200">
                                            <Wallet size={64} strokeWidth={1} />
                                        </div>
                                        <p className="text-slate-400 font-black uppercase tracking-[0.3em] italic text-xs">Ma'lumot topilmadi</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Premium Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingExpense ? "Xarajatni Tahrirlash" : "Yangi Xarajat Qayd Etish"}>
                <div className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block group-focus-within:text-[#00BCE4] transition-colors">Xarajat nomi</label>
                            <input name="name" value={formData.name} onChange={handleChange} placeholder="Nima uchun xarajat qilindi?" className="w-full p-4.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#00BCE4] focus:bg-white font-bold text-slate-800 transition-all shadow-inner" />
                        </div>
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block group-focus-within:text-[#00BCE4] transition-colors">Summa (UZS)</label>
                            <input name="price" value={formData.price} onChange={handleChange} placeholder="0.00" className="w-full p-4.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#00BCE4] focus:bg-white font-black text-[#00BCE4] transition-all shadow-inner" />
                        </div>
                    </div>

                    <div className="space-y-2 group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block group-focus-within:text-[#00BCE4]">Kategoriya tanlash</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full p-4.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#00BCE4] focus:bg-white font-bold text-slate-800 transition-all appearance-none cursor-pointer shadow-inner">
                            <option value="">Kategoriyani belgilang</option>
                            {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">To'lov usuli</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Naqd', 'Karta', 'Hisob'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, paymentType: type })}
                                    className={`py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.1em] transition-all border ${
                                        formData.paymentType === type
                                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200'
                                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block group-focus-within:text-[#00BCE4]">Qo'shimcha ma'lumot</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Xarajat bo'yicha izoh (ixtiyoriy)..." className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:border-[#00BCE4] focus:bg-white font-bold text-slate-800 min-h-[100px] transition-all shadow-inner" />
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full py-5 bg-[#00BCE4] text-white font-black rounded-[2rem] shadow-xl shadow-[#00BCE4]/20 hover:brightness-110 transition-all uppercase tracking-[0.2em] text-[10px] mt-4 active:scale-95"
                    >
                        {editingExpense ? 'O\'zgarishlarni saqlash' : 'Xarajatni tasdiqlash'}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default DailyExpensesContent;
