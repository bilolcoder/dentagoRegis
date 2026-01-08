import React, { useState, useRef, useEffect } from 'react';
import { Camera, Save, Globe, Phone, Mail, MapPin, Building, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';

const GeneralSettingsContent = () => {
    const { data, updateData, t } = useData();
    const initialSettings = data.generalSettings || {};

    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState(initialSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setFormData(initialSettings);
    }, [data.generalSettings]);

    const handleLogoClick = () => fileInputRef.current.click();

    const handleLogoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                logoUrl: URL.createObjectURL(file)
            }));
            setSuccess("Logotip tanlandi, saqlash tugmasini bosing.");
            setError('');
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.companyName?.trim() || !formData.phone1?.trim() || !formData.address?.trim()) {
            setError(t('fill_required'));
            return;
        }

        setIsSaving(true);
        const updatedSetting = {
            ...formData,
            lastUpdated: new Date().toLocaleString('uz-UZ'),
        };

        updateData('generalSettings', updatedSetting, 'UPDATE');

        setTimeout(() => {
            setIsSaving(false);
            setSuccess("Sozlamalar muvaffaqiyatli saqlandi!");
            setTimeout(() => setSuccess(''), 5000);
        }, 800);
    };

    return (
        <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-[0.2em]">
                        <Link to="/" className="hover:text-blue-600 transition-colors tracking-widest">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-blue-600 tracking-widest">{t('general_settings')}</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">Asosiy Sozlamalar</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chap tomondagi karta: Logotip */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[3rem] border border-blue-100 shadow-sm flex flex-col items-center text-center">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Brending</h3>

                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleLogoChange}
                            className="hidden"
                        />

                        <div
                            onClick={handleLogoClick}
                            className="relative group cursor-pointer mb-6"
                        >
                            <div className="absolute inset-0 bg-[#00BCE4] rounded-[2.5rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                            <div className="relative w-40 h-40 bg-slate-50 border-2 border-dashed border-[#00BCE4] rounded-[3rem] flex items-center justify-center overflow-hidden group-hover:border-[#00BCE4] transition-all">
                                {formData.logoUrl ? (
                                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <Building className="w-12 h-12 text-[#00BCE4]" />
                                )}
                                <div className="absolute inset-0 bg-[#00BCE4] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <Camera className="text-white w-8 h-8" />
                                </div>
                            </div>
                        </div>

                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-tighter mb-2">Kompaniya Logotipi</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
                            JPEG yoki PNG formatda yuklang.<br/>Tavsiya etilgan o'lcham: 512x512px
                        </p>
                    </div>

                    <div className="bg-[#00BCE4] p-8 rounded-[3rem] text-white shadow-xl shadow-[#00BCE4] relative overflow-hidden group">
                        <Sparkles className="absolute top-4 right-4 text-[#00BCE4] opacity-50 group-hover:rotate-12 transition-transform" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Holat</h3>
                        <p className="text-xs font-bold italic">Oxirgi yangilanish:</p>
                        <p className="text-lg font-black tracking-tighter">{formData.lastUpdated || 'Hali yangilanmagan'}</p>
                    </div>
                </div>

                {/* O'ng tomondagi karta: Forma */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-blue-100 shadow-sm relative overflow-hidden">
                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Firma nomi */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        <Building size={12} className="text-[#00BCE4]" /> Firma nomi*
                                    </label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        value={formData.companyName || ''}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#00BCE4] transition-all placeholder:text-slate-300"
                                        placeholder="Klinika yoki firma nomi"
                                    />
                                </div>

                                {/* Telefon 1 */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        <Phone size={12} className="text-[#00BCE4]" /> {t('phone')} 1*
                                    </label>
                                    <input
                                        type="text"
                                        id="phone1"
                                        value={formData.phone1 || ''}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#00BCE4] transition-all placeholder:text-slate-300"
                                        placeholder="+998 00 000 00 00"
                                    />
                                </div>

                                {/* Telefon 2 */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        <Phone size={12} className="text-slate-300" /> {t('phone')} 2
                                    </label>
                                    <input
                                        type="text"
                                        id="phone2"
                                        value={formData.phone2 || ''}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#00BCE4] transition-all placeholder:text-slate-300"
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        <Mail size={12} className="text-[#00BCE4]" /> {t('email')}
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#00BCE4] transition-all placeholder:text-slate-300"
                                        placeholder="info@example.com"
                                    />
                                </div>
                            </div>

                            {/* Manzil */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    <MapPin size={12} className="text-[#00BCE4]" /> {t('address')}*
                                </label>
                                <textarea
                                    id="address"
                                    rows="3"
                                    value={formData.address || ''}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-3xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#00BCE4] transition-all placeholder:text-slate-300 resize-none"
                                    placeholder="To'liq manzilni kiriting..."
                                />
                            </div>

                            {/* Xabarlar */}
                            <div className="min-h-[40px]">
                                {error && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-shake italic">{error}</p>}
                                {success && <p className="text-[10px] font-black text-green-500 uppercase tracking-widest animate-bounce italic">{success}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex items-center gap-3 px-10 py-5 bg-[#00BCE4] text-white font-black rounded-[2rem] shadow-xl shadow-[#00BCE4]/20 hover:bg-[#00BCE4] hover:-translate-y-1 transition-all active:scale-95 disabled:bg-slate-200 disabled:shadow-none text-xs uppercase tracking-[0.2em]"
                                >
                                    {isSaving ? (
                                        <span className="flex items-center gap-2">Saqlanmoqda...</span>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            {t('save')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneralSettingsContent;
