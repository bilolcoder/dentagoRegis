// src/components/DiseasesContent.jsx (Kasalliklar)

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';
import AddEditDiseaseModal from './AddEditDiseaseModal';

const DiseasesContent = () => {
    const { data, t } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDisease, setCurrentDisease] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Kasalliklar ma'lumotlari (vaqtinchalik - keyinchalik DataProvider'dan olinadi)
    const diseases = data.diseases || [
        { id: 1, name: "Karies", color: "#F05252", status: true },
        { id: 2, name: "Pulpit", color: "#3B82F6", status: true },
        { id: 3, name: "Periodontit", color: "#10B981", status: false },
    ];

    const handleOpenAddEditModal = (disease = null) => {
        setCurrentDisease(disease);
        setIsModalOpen(true);
    };

    const filteredDiseases = diseases.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('diseases')}</span>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenAddEditModal(null)}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 w-full sm:w-auto"
                >
                    <Plus className="w-5 h-5" />
                    {t('add')}
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900/10 overflow-hidden relative">
                <div className="p-4 border-b border-blue-50 dark:border-blue-900/10 flex justify-between items-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <div className="relative grow max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-gray-200 dark:border-blue-900/30 rounded-xl py-2.5 pl-10 pr-4 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-blue-900/10">
                        <thead className="bg-blue-50/50 dark:bg-blue-900/20">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest w-16">#</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">{t('name')}</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">{t('color')}</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">{t('status')}</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest w-24">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-blue-900/10">
                            {filteredDiseases.map((dis) => (
                                <tr key={dis.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors border-b dark:border-blue-900/10 last:border-0">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">{dis.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">{dis.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-lg shadow-sm border border-white/20" style={{ backgroundColor: dis.color }}></span>
                                            <span className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 uppercase">{dis.color}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-black rounded-lg ${dis.status ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                                            {dis.status ? t('active') : t('inactive')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenAddEditModal(dis)} className="p-2 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 rounded-xl transition-all active:scale-90"><Edit className="w-4 h-4" /></button>
                                            <button className="p-2 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 rounded-xl transition-all active:scale-90"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Kasallik qo'shish/tahrirlash modali */}
            {isModalOpen && (
                <AddEditDiseaseModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    disease={currentDisease}
                />
            )}
        </div>
    );
};

export default DiseasesContent;
