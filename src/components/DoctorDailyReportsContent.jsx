// src/components/DoctorDailyReportsContent.jsx

import React, { useState } from 'react';
import { Search, Calendar, User, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';

const DoctorDailyReportsContent = () => {
    const { data, t } = useData();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10)); // Bugungi sana
    const [searchTerm, setSearchTerm] = useState('');

    // Barcha doktorlar va ularning ID'larini olish
    const doctors = data.staff.filter(s => s.lavozim === 'Shifokor');

    // Tanlangan sanaga mos keladigan davolashlarni topish
    const getReportData = (date) => {
        // Sana bo'yicha filter qilish logikasi (soddalashtirilgan)
        const treatmentsToday = data.treatments.filter(t =>
            t.date.startsWith(new Date(date).toLocaleDateString('uz-UZ'))
        );

        // Hisobotni tayyorlash
        const report = doctors.map(doc => {
            const docTreatments = treatmentsToday.filter(t => t.doctor === doc.FIO);

            // Faqat to'langan xizmatlarni hisoblaymiz (soddalashtirilgan hisob-kitob)
            const income = docTreatments.reduce((sum, t) => {
                // Bizda xizmat narxi yo'q, shuning uchun 'qarz' teskarisini daromad deb olamiz (faqat simulyatsiya)
                const debtValue = parseInt(t.debt.replace(" so'm", '').replace(/\s/g, '')) || 0;
                return sum + Math.abs(debtValue); // Daromad ijobiy bo'ladi deb hisoblaymiz
            }, 0);

            return {
                id: doc.id,
                FIO: doc.FIO,
                totalIncome: income,
                totalExpense: 0, // Hozircha xarajatlar qismi qo'shilmadi
                treatmentCount: docTreatments.length
            };
        });

        return report;
    };

    const dailyReport = getReportData(selectedDate);

    const filteredReport = dailyReport.filter(r =>
        r.FIO.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // Umumiy jami hisob-kitob
    const grandTotalIncome = dailyReport.reduce((sum, r) => sum + r.totalIncome, 0);
    const grandTotalExpense = dailyReport.reduce((sum, r) => sum + r.totalExpense, 0);


    return (
        <div className="p-4 md:p-8 space-y-6">
            {/* Breadcrumbs va Filterlar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('doc_daily_reports')}</span>
                    </div>
                </div>

                <div className='flex flex-wrap gap-3'>
                    {/* Sana tanlash */}
                    <div className="relative">
                        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full py-2.5 px-3 border border-gray-300 rounded-lg bg-white text-gray-700 cursor-pointer focus:border-blue-500 min-w-[150px]" />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Qidirish */}
                    <div className="relative w-full md:w-auto min-w-[200px]">
                        <input type="text" placeholder="Doktorni qidirish..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2.5 px-3 pl-10 border border-gray-300 rounded-lg bg-white text-gray-700 focus:border-blue-500" />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Asosiy Jadval */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-12">#</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[180px]">Doktor F.I.O</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[120px]">Davolashlar soni</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[150px]">Umumiy daromad</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase min-w-[150px]">Xarajatlar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 whitespace-nowrap">
                        {filteredReport.length > 0 ? (
                            filteredReport.map((r, index) => (
                                <tr key={r.id} className='hover:bg-gray-50'>
                                    <td className="px-4 py-3 text-sm text-gray-800">{index + 1}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{r.FIO}</td>
                                    <td className="px-4 py-3 text-sm text-center text-blue-600">{r.treatmentCount}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-green-600">{r.totalIncome.toLocaleString('uz-UZ')} so'm</td>
                                    <td className="px-4 py-3 text-sm font-medium text-red-600">{r.totalExpense.toLocaleString('uz-UZ')} so'm</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className='p-10 text-center text-gray-500'>Bu sanada ma'lumot topilmadi.</td></tr>
                        )}
                    </tbody>
                </table>

                {/* Umumiy Summa */}
                <div className='p-4 bg-gray-50 flex justify-end gap-12 border-t font-bold text-lg'>
                    <div className='text-gray-800'>Jami Daromad: <span className='text-green-600'>{grandTotalIncome.toLocaleString('uz-UZ')} so'm</span></div>
                    <div className='text-gray-800'>Jami Xarajat: <span className='text-red-600'>{grandTotalExpense.toLocaleString('uz-UZ')} so'm</span></div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDailyReportsContent;
