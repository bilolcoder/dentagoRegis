// src/components/GiveMoneyToDoctorsContent.jsx

import React, { useState } from 'react';
import { Search, DollarSign, User, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';

const SalaryCard = ({ title, staffList, isDoctor = false }) => {
    const { t } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);

    const filteredStaff = staffList.filter(s =>
        s.FIO.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePay = (staff) => {
        setSelectedStaff(staff);
        setModalOpen(true);
    };

    const SalaryPaymentModal = () => {
        if (!selectedStaff) return null;

        // Bu yerda backend bo'lmagani uchun maosh hisoblash murakkab.
        // Shuning uchun oddiygina to'lov funksiyasi yaratamiz.
        const [amount, setAmount] = useState('');

        const confirmPayment = () => {
            if (!amount) {
                alert("Iltimos, summani kiriting.");
                return;
            }
            alert(`${selectedStaff.FIO}ga ${amount} so'm miqdorida maosh to'landi. (Simulyatsiya)`);
            setModalOpen(false);
            setSelectedStaff(null);
        };

        return (
            <div className="fixed inset-0 z-50 bg-[rgb(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm space-y-4">
                    <h4 className="text-xl font-bold border-b pb-2">Maosh to'lash</h4>
                    <p>Kimga: <span className='font-semibold text-blue-600'>{selectedStaff.FIO}</span></p>
                    <input
                        type="text"
                        placeholder="Summani kiriting (so'm)"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setModalOpen(false)} className="py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg">Bekor qilish</button>
                        <button onClick={confirmPayment} className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1">
                            <Send className='w-4 h-4' /> To'lash
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4 bg-white rounded-xl shadow-md border border-gray-100 p-4 min-h-[400px]">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <User className={`w-5 h-5 ${isDoctor ? 'text-blue-600' : 'text-green-600'}`} /> {title} ({staffList.length} kishi)
            </h3>

            <div className="relative">
                <input
                    type="text"
                    placeholder={`${title} ichida qidirish...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2.5 px-3 pl-10 border border-gray-300 rounded-lg bg-white text-gray-700 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredStaff.length > 0 ? (
                    filteredStaff.map(staff => (
                        <div key={staff.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                            <div className="font-medium text-gray-800">{staff.FIO}</div>
                            <div className='flex items-center gap-3'>
                                <span className='text-sm text-gray-500'>Hisoblangan: 0 so'm</span>
                                <button onClick={() => handlePay(staff)} className='py-1 px-3 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600'>
                                    Pul berish
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-10">Ma'lumot topilmadi.</p>
                )}
            </div>

            {modalOpen && <SalaryPaymentModal />}
        </div>
    );
};

const GiveMoneyToDoctorsContent = () => {
    const { data, t } = useData();
    const doctors = data.staff.filter(s => s.lavozim === 'Shifokor');
    const technicians = data.staff.filter(s => s.lavozim === 'Texnik' || s.lavozim === 'Qabulxona xodimi'); // Texniklar deb umumlashtiramiz

    return (
        <div className="p-4 md:p-8 space-y-6">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('give_money_docs')}</span>
                    </div>
                </div>
            </div>

            {/* Asosiy Kontent: Doktorlar va Texniklar ustunlari */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 1-Ustun: Doktorlar */}
                <SalaryCard title="Doktorlar" staffList={doctors} isDoctor={true} />

                {/* 2-Ustun: Texniklar */}
                <SalaryCard title="Qabulxona/Texniklar" staffList={technicians} isDoctor={false} />
            </div>
        </div>
    );
};

export default GiveMoneyToDoctorsContent;
