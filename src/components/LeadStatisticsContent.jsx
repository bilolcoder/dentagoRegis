// src/components/LeadStatisticsContent.jsx

import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataProvider';
import { Link } from 'react-router-dom';
import { Calendar, Users, Briefcase, DollarSign, TrendingUp, ChevronRight } from 'lucide-react';

const LeadStatisticsContent = () => {
    const { data, t } = useData();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statistics, setStatistics] = useState({
        totalTreatments: 0,
        newTreatments: 0,
        finishedTreatments: 0,
        totalIncome: 0,
    });

    useEffect(() => {
        let filteredTreatments = data.treatments || [];

        if (startDate && endDate) {
            filteredTreatments = filteredTreatments.filter(t => {
                if (!t.date) return false;
                // Sana formatini (DD.MM.YYYY) Date obyektiga o'tkazish
                const treatmentDate = new Date(t.date.split(' ')[0].split('.').reverse().join('-'));
                const start = new Date(startDate);
                const end = new Date(endDate);

                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                return treatmentDate >= start && treatmentDate <= end;
            });
        }

        const totalTreatments = filteredTreatments.length;
        const newTreatments = filteredTreatments.filter(t => t.status === 'Yangi').length;
        const finishedTreatments = filteredTreatments.filter(t => t.status && t.status.includes('yakunlandi')).length;

        const totalIncome = filteredTreatments.reduce((sum, t) => {
            const debtValue = t.debt ? parseInt(t.debt.replace(" so'm", '').replace(/\s/g, '')) : 0;
            return sum + Math.abs(debtValue);
        }, 0);

        setStatistics({
            totalTreatments,
            newTreatments,
            finishedTreatments,
            totalIncome,
        });

    }, [data.treatments, startDate, endDate]);

    const StatCard = ({ title, value, icon: Icon }) => (
        <div className="bg-white p-6 rounded-[2.5rem] border border-blue-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-2xl text-[#00BCE4] group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                </div>
                <div className="h-1 w-12 bg-blue-50 rounded-full" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
                <p className="text-2xl font-black text-slate-800 mt-1">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-[0.2em]">
                        <Link to="/" className="hover:text-[#00BCE4] transition-colors">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-[#00BCE4]">{t('lead_statistics')}</span>
                    </div>
                    <div className="flex gap-2">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">Analitika</h1>
                       <h1 className="text-3xl font-black text-[#00BCE4] tracking-tighter italic uppercase"> Markazi</h1>
                    </div>
                </div>

                <div className='flex flex-wrap gap-3 bg-white p-2 rounded-3xl border border-blue-100 shadow-sm'>
                    <div className="relative">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="py-2 px-4 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    </div>
                    <div className="flex items-center text-slate-300">
                        <ChevronRight size={16} />
                    </div>
                    <div className="relative">
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="py-2 px-4 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Statistika kartochkalari */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Jami davolashlar" value={statistics.totalTreatments} icon={Briefcase} />
                <StatCard title="Yangi arizalar" value={statistics.newTreatments} icon={Users} />
                <StatCard title="Muvaffaqiyatli yakun" value={statistics.finishedTreatments} icon={TrendingUp} />
                <StatCard title="Umumiy aylanma" value={`${statistics.totalIncome.toLocaleString('uz-UZ')} so'm`} icon={DollarSign} />
            </div>

            {/* Ma'lumotlar jadvali */}
            <div className="bg-white rounded-[3rem] border border-blue-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50">
                    <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight italic">
                        Batafsil hisobot <span className="text-[#00BCE4] ml-2 font-normal not-italic text-sm">({statistics.totalTreatments})</span>
                    </h4>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className='bg-slate-50/50'>
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">#</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('patient')}</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('doctor')}</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('status')}</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t('date')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {statistics.totalTreatments > 0 ? (
                                // Bu yerda aslidada filtrlangan data.treatments map bo'lishi kerak
                                (data.treatments || []).slice(0, 10).map((item, index) => (
                                    <tr key={index} className="hover:bg-blue-50/20 transition-colors group">
                                        <td className="px-8 py-5 text-xs font-bold text-slate-300">{(index + 1).toString().padStart(2, '0')}</td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">{item.patientName || 'Noma\'lum'}</span>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <span className="text-sm font-bold text-slate-500">{item.doctorName || 'Tayinlanmagan'}</span>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-center">
                                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${
                                                item.status === 'Yangi' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-right">
                                            <div className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                                <Calendar size={12} className="text-[#00BCE4]" />
                                                {item.date}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                        <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
                                            <Briefcase className="w-10 h-10 text-slate-200" />
                                        </div>
                                        <p className="text-slate-400 font-bold italic tracking-tight">Tanlangan muddatda ma'lumot topilmadi</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeadStatisticsContent;
