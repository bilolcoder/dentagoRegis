// src/components/SmsSettingsContent.jsx

import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { Link } from 'react-router-dom';
import { Edit, Settings, Building2, KeyRound, CalendarClock, ShieldCheck } from 'lucide-react';
import EditSettingsModal from './EditSettingsModal';

const SmsSettingsContent = () => {
    const { data, t } = useData();
    const settings = data.smsSettings || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSetting, setCurrentSetting] = useState(null);

    const handleEdit = (setting) => {
        setCurrentSetting(setting);
        setIsModalOpen(true);
    };

    const setting = settings.length > 0 ? settings[0] : null;

    return (
        <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-[0.2em]">
                        <Link to="/" className="hover:text-[#00BCE4] transition-colors">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-[#00BCE4]">{t('sms_settings')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black text-[#00BCE4] tracking-tighter italic uppercase">SMS Sozlamalar</h1>
                        <div className="p-2 bg-[#00BCE4] rounded-lg text-white animate-pulse">
                            <Settings size={18} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Card */}
            <div className="bg-white rounded-[3rem] border border-blue-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-20">ID</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Shifoxona</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">SMS Token</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Yangilangan sana</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-32">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {setting ? (
                                <tr className="group hover:bg-blue-50/20 transition-all">
                                    <td className="px-8 py-8 text-xs font-bold text-slate-300 italic">#{setting.id}</td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-[#00BCE4] group-hover:bg-white transition-colors">
                                                <Building2 size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-800 uppercase tracking-tighter">{setting.clinicName}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-2">
                                            <KeyRound size={14} className="text-slate-400" />
                                            <code className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-mono text-slate-600 group-hover:bg-blue-100 transition-colors">
                                                {setting.token ? `••••••••${setting.token.slice(-6)}` : 'Noma’lum'}
                                            </code>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <CalendarClock size={14} />
                                            <span className="text-xs font-bold italic tracking-tight">{setting.updatedAt}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-center">
                                        <button
                                            onClick={() => handleEdit(setting)}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00BCE4] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#00BCE4] shadow-lg shadow-[#00BCE4]/20 active:scale-95 transition-all"
                                        >
                                            <Edit size={14} />
                                            {t('edit')}
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-32 text-center">
                                        <div className="inline-flex p-6 bg-slate-50 rounded-[2.5rem] mb-4 text-slate-200 border border-dashed border-slate-200">
                                            <ShieldCheck size={48} />
                                        </div>
                                        <p className="text-slate-400 font-bold italic mb-4">Sozlamalar topilmadi</p>
                                        <button
                                            onClick={() => handleEdit(null)}
                                            className="px-6 py-3 bg-[#00BCE4] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#00BCE4] hover:bg-[#00BCE4] transition-all"
                                        >
                                            + {t('add')}
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Settings Modal */}
            {isModalOpen && (
                <EditSettingsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    setting={currentSetting}
                    updateData={data.updateData}
                />
            )}
        </div>
    );
};

export default SmsSettingsContent;
