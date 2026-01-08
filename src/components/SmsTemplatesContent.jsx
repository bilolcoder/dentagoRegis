import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';
import { Plus, Eye, Edit, Trash2, MessageSquare, ShieldCheck, ShieldAlert } from 'lucide-react';

import AddEditTemplateModal from './AddEditTemplateModal';
import ViewTemplateModal from './ViewTemplateModal';

const SmsTemplatesContent = () => {
    const { data, updateData, t } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState(null);

    const toggleTemplateStatus = (id, currentStatus) => {
        updateData('smsTemplates', { id, status: !currentStatus }, 'UPDATE');
    };

    const handleOpenAddEditModal = (template = null) => {
        setCurrentTemplate(template);
        setIsModalOpen(true);
    };

    const handleOpenViewModal = (template) => {
        setCurrentTemplate(template);
        setIsViewModalOpen(true);
    };

    const handleDeleteTemplate = (id) => {
        if (window.confirm(t('confirm_delete'))) {
            updateData('smsTemplates', { id }, 'DELETE');
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-[0.2em]">
                        <Link to="/" className="hover:text-[#00BCE4] transition-colors tracking-widest">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-[#00BCE4] tracking-widest">{t('sms_templates')}</span>
                    </div>
                    <h1 className="text-3xl font-black text-[#00BCE4] tracking-tighter italic uppercase">SMS Shablonlar</h1>
                </div>

                <button
                    onClick={() => handleOpenAddEditModal(null)}
                    className="flex items-center gap-3 px-8 py-4 bg-[#00BCE4] text-white font-black rounded-[1.5rem] shadow-xl shadow-blue-500/20 hover:bg-[#00BCE4] hover:-translate-y-0.5 transition-all active:scale-95 text-xs uppercase tracking-widest"
                >
                    <Plus className="w-5 h-5" />
                    {t('add')}
                </button>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-[3rem] border border-blue-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-20">ID</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('name')}</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Turi</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('status')}</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('message')}</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {(data?.smsTemplates || []).length > 0 ? (
                                data.smsTemplates.map((template) => (
                                    <tr key={template.id} className="hover:bg-blue-50/20 transition-all group">
                                        <td className="px-8 py-6 text-xs font-bold text-slate-300 italic">
                                            #{template.id.toString().padStart(3, '0')}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 rounded-xl text-[#00BCE4] group-hover:bg-white transition-colors">
                                                    <MessageSquare size={16} />
                                                </div>
                                                <span className="text-[13px] font-bold text-slate-800 uppercase tracking-tighter">{template.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-lg bg-slate-100 text-slate-500 border border-slate-200">
                                                {template.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <button
                                                onClick={() => toggleTemplateStatus(template.id, template.status)}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                                                    template.status
                                                    ? 'bg-green-50 text-green-600'
                                                    : 'bg-red-50 text-red-500 opacity-60'
                                                }`}
                                            >
                                                {template.status ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                                                <span className="text-[10px] font-black uppercase tracking-widest">
                                                    {template.status ? t('active') : t('inactive')}
                                                </span>
                                            </button>
                                        </td>
                                        <td className="px-8 py-6 max-w-xs">
                                            <p className="text-xs text-slate-500 font-medium truncate italic italic-none">
                                                {template.message}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenViewModal(template)}
                                                    className="p-2.5 bg-blue-50 text-[#00BCE4] rounded-xl hover:bg-[#00BCE4] hover:text-white transition-all shadow-sm"
                                                    title={t('view')}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenAddEditModal(template)}
                                                    className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                                                    title={t('edit')}
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTemplate(template.id)}
                                                    className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                    title={t('delete')}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-32 text-center">
                                        <div className="inline-flex p-6 bg-slate-50 rounded-[2.5rem] mb-4 text-slate-200 border border-dashed border-slate-200">
                                            <MessageSquare size={48} />
                                        </div>
                                        <p className="text-slate-400 font-bold italic">Shablonlar mavjud emas</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modallar */}
            {isModalOpen && (
                <AddEditTemplateModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    template={currentTemplate}
                    updateData={updateData}
                />
            )}

            {isViewModalOpen && (
                <ViewTemplateModal
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                    template={currentTemplate}
                />
            )}
        </div>
    );
};

export default SmsTemplatesContent;
