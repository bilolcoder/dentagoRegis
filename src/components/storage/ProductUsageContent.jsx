import React, { useState } from 'react';
import { Plus, Search, Trash2, Calendar, Package, ClipboardList, Stethoscope, UserRound, ChevronRight, Activity, Filter } from 'lucide-react';
import { useData } from '../../context/DataProvider';
import Modal from '../common/Modal';
import { Link } from 'react-router-dom';

const ProductUsageContent = () => {
    const { data, updateData, t } = useData();
    const productUsage = data.productUsage || [];
    const PRIMARY_COLOR = "#00BCE4";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        doctorName: '',
        patientName: '',
        productName: '',
        quantity: '',
        date: new Date().toISOString().split('T')[0]
    });

    const filteredUsage = productUsage.filter(item =>
        (item.doctorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.productName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddUsage = () => {
        if (!formData.doctorName || !formData.patientName || !formData.productName || !formData.quantity) {
            alert(t('fill_required'));
            return;
        }

        const newUsage = {
            id: Date.now(),
            doctorName: formData.doctorName,
            patientName: formData.patientName,
            productName: formData.productName,
            quantity: formData.quantity,
            date: formData.date
        };

        updateData('productUsage', newUsage, 'ADD');
        setIsModalOpen(false);
        setFormData({
            doctorName: '',
            patientName: '',
            productName: '',
            quantity: '',
            date: new Date().toISOString().split('T')[0]
        });
    };

    const handleDeleteUsage = (id) => {
        if (window.confirm(t('confirm_delete'))) {
            updateData('productUsage', { id }, 'DELETE');
        }
    };

    return (
        <div className="p-4 md:p-8 bg-white min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">
                        <Link to="/" className="hover:text-[#00BCE4] transition-colors">BOSH SAHIFA</Link>
                        <ChevronRight size={10} />
                        <span className="text-[#00BCE4]">SARFLAR JURNALI</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#00BCE4]/10 text-[#00BCE4]">
                            <Activity size={24} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">
                            Sarflar <span style={{ color: PRIMARY_COLOR }}>Jurnali</span>
                        </h1>
                    </div>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-[#00BCE4] text-white px-8 py-4 rounded-2xl transition-all shadow-xl shadow-[#00BCE4]/20 active:scale-95 font-black text-[10px] uppercase tracking-widest hover:brightness-110"
                >
                    <Plus className="w-5 h-5" strokeWidth={3} />
                    {t('add_usage') || "Yangi Sarf Qo'shish"}
                </button>
            </div>

            {/* Stats & Search Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
                <div className="lg:col-span-3 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#00BCE4] transition-colors" />
                    <input
                        type="text"
                        placeholder="Shifokor, bemor yoki mahsulot bo'yicha qidirish..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-100 rounded-[24px] text-slate-700 font-bold outline-none focus:ring-4 focus:ring-[#00BCE4]/5 focus:border-[#00BCE4] focus:bg-white transition-all shadow-sm placeholder:text-slate-400"
                    />
                </div>
                <div className="bg-white p-5 rounded-[24px] border border-slate-100 flex items-center justify-between shadow-xl shadow-slate-100/50">
                    <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                        <ClipboardList size={22} strokeWidth={2.5} />
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Jami Amallar</p>
                        <p className="text-2xl font-black text-slate-800 tracking-tighter leading-none">{filteredUsage.length}</p>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('doctor')}</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('patient')}</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('product')}</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Miqdor</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Sana</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Boshqaruv</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsage.length > 0 ? (
                                filteredUsage.map((item) => (
                                    <tr key={item.id} className="hover:bg-[#00BCE4]/[0.02] transition-all group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                                    <Stethoscope size={18} strokeWidth={2.5} />
                                                </div>
                                                <span className="text-sm font-black text-slate-700 tracking-tight uppercase italic">{item.doctorName}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                                <span className="text-sm font-bold text-slate-500 tracking-tight">{item.patientName}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                                                <Package size={14} className="text-[#00BCE4]" />
                                                <span className="text-xs font-black text-[#00BCE4] uppercase tracking-tighter">{item.productName}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="text-sm font-black text-slate-800 bg-slate-100 px-4 py-1.5 rounded-xl">
                                                {item.quantity}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="inline-flex items-center gap-2 text-[11px] font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 group-hover:border-[#00BCE4]/20 transition-all">
                                                <Calendar size={13} strokeWidth={2.5} />
                                                {item.date}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={() => handleDeleteUsage(item.id)}
                                                className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-90"
                                            >
                                                <Trash2 size={18} strokeWidth={2.5} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-32 text-center bg-slate-50/30">
                                        <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200 border border-slate-100">
                                            <ClipboardList className="w-10 h-10 text-slate-200" />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">Sarf topilmadi</h3>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Qidiruv so'rovini boshqacharoq kiritib ko'ring</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal - Yangilangan Premium Modal Stili */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Yangi sarf yozuvi"
                footer={
                    <div className="flex gap-4 p-2 w-full">
                        <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4.5 bg-slate-100 text-slate-500 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all">
                            {t('cancel')}
                        </button>
                        <button onClick={handleAddUsage} className="flex-1 py-4.5 bg-[#00BCE4] text-white font-black rounded-2xl shadow-xl shadow-[#00BCE4]/30 text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all hover:brightness-110">
                            {t('add')}
                        </button>
                    </div>
                }
            >
                <div className="space-y-6 py-6 px-2">
                    {[
                        { label: 'Shifokor F.I.Sh', key: 'doctorName', icon: <Stethoscope size={16}/> },
                        { label: 'Bemor F.I.Sh', key: 'patientName', icon: <UserRound size={16}/> },
                        { label: 'Ishlatilgan Mahsulot', key: 'productName', icon: <Package size={16}/> },
                        { label: 'Miqdori (dona/litr)', key: 'quantity', icon: <Activity size={16}/> },
                    ].map((field) => (
                        <div key={field.key} className="relative group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-[#00BCE4] transition-colors">
                                {field.label}
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#00BCE4] transition-colors">
                                    {field.icon}
                                </div>
                                <input
                                    type="text"
                                    value={formData[field.key]}
                                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                    className="w-full pl-12 pr-5 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 outline-none focus:border-[#00BCE4] focus:bg-white transition-all font-bold text-sm"
                                    placeholder={`${field.label}ni kiriting...`}
                                />
                            </div>
                        </div>
                    ))}
                    <div className="relative group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Amal Sanasi</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#00BCE4]" size={16} />
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full pl-12 pr-5 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 outline-none focus:border-[#00BCE4] focus:bg-white transition-all font-bold text-sm"
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ProductUsageContent;
