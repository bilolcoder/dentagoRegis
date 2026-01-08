import React, { useState } from 'react';
import {
    Search, Calendar, DollarSign, CreditCard,
    Smartphone, RefreshCw, Plus, User,
    ArrowUpRight, Wallet, Filter, ChevronRight
} from 'lucide-react';
import { useData } from '../context/DataProvider';
import Modal from './common/Modal';
import { Link } from 'react-router-dom';

const PaymentsContent = () => {
    const { data, updateData, t } = useData();
    const payments = data.payments || [];
    const patients = data.patients || [];
    const PRIMARY_COLOR = "#00BCE4";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        patientId: '',
        amount: '',
        type: 'Naqd',
        date: new Date().toLocaleDateString('ru-RU')
    });

    const calculateTotal = (type) => {
        const total = payments
            .filter(p => p.type === type)
            .reduce((sum, p) => {
                const amount = typeof p.amount === 'string'
                    ? parseInt(p.amount.replace(/\s/g, '').replace("so'm", ''))
                    : (parseInt(p.amount) || 0);
                return sum + amount;
            }, 0);
        return total.toLocaleString();
    };

    const paymentCards = [
        { type: "Naqd pul", amount: calculateTotal("Naqd"), icon: <DollarSign size={24} />, color: "emerald" },
        { type: "Plastik karta", amount: calculateTotal("Karta"), icon: <CreditCard size={24} />, color: "blue" },
        { type: "Hisob raqam", amount: calculateTotal("Hisob raqam"), icon: <Smartphone size={24} />, color: "indigo" },
        { type: "O'tkazmalar", amount: calculateTotal("Kartadan-kartaga"), icon: <RefreshCw size={24} />, color: "purple" },
    ];

    const filteredPayments = payments.filter(p => {
        const patientName = p.name ? String(p.name).toLowerCase() : "";
        return patientName.includes(searchTerm.toLowerCase());
    });

    const handleSave = () => {
        if (!formData.patientId || !formData.amount) return;

        const patient = patients.find(p => String(p.id) === String(formData.patientId));
        const newPayment = {
            id: Date.now(),
            ...formData,
            name: patient ? `${patient.name} ${patient.familya}` : 'Noma\'lum',
            amount: `${parseInt(formData.amount).toLocaleString()} so'm`
        };

        updateData('payments', newPayment, 'ADD');
        setIsModalOpen(false);
        setFormData({ patientId: '', amount: '', type: 'Naqd', date: new Date().toLocaleDateString('ru-RU') });
    };

    return (
        <div className="p-4 md:p-8 bg-white min-h-screen">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">
                        <Link to="/" className="hover:text-[#00BCE4] transition-colors">BOSH SAHIFA</Link>
                        <ChevronRight size={10} />
                        <span className="text-[#00BCE4]">TO'LOVLAR</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-[#00BCE4]/10 text-[#00BCE4]">
                            <Wallet size={28} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">
                            Moliya <span style={{ color: PRIMARY_COLOR }}>Jurnali</span>
                        </h1>
                    </div>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-3 bg-[#00BCE4] text-white px-8 py-4 rounded-2xl transition-all shadow-xl shadow-[#00BCE4]/20 active:scale-95 font-black text-[10px] uppercase tracking-widest hover:brightness-110"
                >
                    <Plus className="w-5 h-5" strokeWidth={3} />
                    To'lov qabul qilish
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {paymentCards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700 bg-current`} />
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className={`p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-[#00BCE4] group-hover:text-white transition-all duration-300`}>
                                    {card.icon}
                                </div>
                                <ArrowUpRight className="text-slate-200" size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.type}</p>
                                <p className="text-2xl font-black text-slate-800 tracking-tighter">{card.amount} <span className="text-[10px] text-slate-400">UZS</span></p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <div className="relative flex-[2] group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#00BCE4] transition-colors" />
                    <input
                        type="text"
                        placeholder="Bemor ismi orqali qidirish..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-700 font-bold outline-none focus:ring-4 focus:ring-[#00BCE4]/5 focus:border-[#00BCE4] focus:bg-white transition-all shadow-sm"
                    />
                </div>
                <div className="flex flex-1 gap-4">
                    <div className="relative flex-1 group">
                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#00BCE4]" />
                        <input
                            type="date"
                            className="w-full pl-12 pr-5 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-xs font-black text-slate-500 uppercase outline-none focus:border-[#00BCE4] transition-all cursor-pointer"
                        />
                    </div>
                    <button className="px-6 py-5 bg-slate-800 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-50">
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kvitansiya</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bemor</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">To'lov Summasi</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Usul</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Sana</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredPayments.map((p, index) => (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition-all group cursor-default">
                                    <td className="px-10 py-6">
                                        <span className="text-xs font-black text-slate-300 font-mono group-hover:text-[#00BCE4]">
                                            #{String(index + 1).padStart(4, '0')}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 bg-slate-100 rounded-[14px] flex items-center justify-center text-slate-400 group-hover:bg-[#00BCE4]/10 group-hover:text-[#00BCE4] transition-all">
                                                <User size={18} strokeWidth={2.5} />
                                            </div>
                                            <span className="text-sm font-black text-slate-700 uppercase tracking-tight group-hover:translate-x-1 transition-transform inline-block">
                                                {p.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-sm font-black text-slate-800 tracking-tight italic">{p.amount}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex justify-center">
                                            <span className="px-5 py-2 bg-white border border-slate-100 shadow-sm rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:border-[#00BCE4]/30 transition-colors">
                                                {p.type}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-xl group-hover:bg-white transition-colors">
                                            <Calendar size={12} strokeWidth={3} className="text-[#00BCE4]" />
                                            {p.date}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Action Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yangi to'lov qabul qilish">
                <div className="space-y-6 py-4 px-2">
                    <div className="relative group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-[#00BCE4] transition-colors">Bemorni tanlang</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#00BCE4]" size={18} />
                            <select
                                value={formData.patientId}
                                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                                className="w-full pl-12 pr-5 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 outline-none focus:border-[#00BCE4] focus:bg-white transition-all font-bold text-sm appearance-none"
                            >
                                <option value="">Ro'yxatdan tanlang...</option>
                                {patients.map(p => <option key={p.id} value={p.id}>{p.name} {p.familya}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="relative group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-[#00BCE4] transition-colors">To'lov summasi (UZS)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#00BCE4]" size={18} />
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full pl-12 pr-5 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 outline-none focus:border-[#00BCE4] focus:bg-white transition-all font-bold text-sm"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">To'lov usuli</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['Naqd', 'Karta', 'Hisob raqam', 'Kartadan-kartaga'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFormData({ ...formData, type })}
                                    className={`py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                                        formData.type === type
                                        ? 'bg-[#00BCE4] border-[#00BCE4] text-white shadow-lg shadow-[#00BCE4]/20 scale-[1.02]'
                                        : 'bg-white border-slate-100 text-slate-400 hover:border-[#00BCE4]/30'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full py-5 bg-slate-900 text-white font-black rounded-[2rem] shadow-xl shadow-slate-200 hover:bg-black transition-all uppercase tracking-[0.2em] text-[10px] mt-4 active:scale-95"
                    >
                        Tranzaksiyani yakunlash
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default PaymentsContent;
