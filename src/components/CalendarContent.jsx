import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// icons
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCw, Plus, X, Search, User, Clock, Briefcase, Zap, Info } from 'lucide-react';
import { useData } from '../context/DataProvider';
import Modal from './common/Modal';

// Center Modal Komponenti (Rasm 4 va 5 uchun)
const CenterModal = ({ isOpen, onClose, title, children, size = "max-w-xl" }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className={`bg-white dark:bg-slate-900 w-full ${size} rounded-2xl shadow-2xl overflow-hidden`}>
                <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[85vh]">
                    {children}
                </div>
            </div>
        </div>
    );
};

const CalendarContent = () => {
    const { t, data, updateData } = useData();
    const patients = data?.patients || [];
    const staff = data?.staff || [];
    const technicians = staff.filter(s => s.lavozim === 'Texnik');

    // Drawer va Modal holatlari
    const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
    const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false);
    const [isAddNewPatientOpen, setIsAddNewPatientOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState("18.12.2025");

    // Jadval ustunlari (Doktorlar)
    const doctors = [
        { id: 1, name: "Sunnatillo", fullName: "Sunnatillo Istamov" },
        { id: 2, name: "Mateo", fullName: "Mateo Versace" },
        { id: 3, name: "Junior Mateo", fullName: "Junior Mateo" },
        { id: 4, name: "Jahongir", fullName: "Jahongir Xoliqov" }
    ];

    const [hoveredCell, setHoveredCell] = useState(null);

    const handleCellClick = (doctor) => {
        setSelectedDoctor(doctor);
        setIsSideDrawerOpen(true);
    };

    return (
        <div className="p-4 md:p-8 space-y-6 bg-white">
            {/* Breadcrumbs va Sana Navigatsiyasi */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 dark:text-white capitalize">{t('calendar')}</span>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 w-full sm:w-auto">
                    <button className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 px-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                        <CalendarIcon className='w-4 h-4 text-gray-400' />
                        <span>{selectedDate}</span>
                    </div>
                    <button className="p-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <button className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition border-l border-gray-100 dark:border-gray-700 ml-1">
                        <RotateCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Asosiy Taqvim Jadvali */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-r border-gray-200 dark:border-gray-800 w-40 bg-slate-50/50 dark:bg-slate-800/50">
                                    Sana
                                </th>
                                {doctors.map((doctor, index) => (
                                    <th
                                        key={index}
                                        className={`px-6 py-4 text-center text-sm font-black uppercase tracking-widest border-b border-r border-gray-200 dark:border-gray-800 min-w-[200px] ${doctor.name === 'Junior Mateo' ? 'bg-white dark:bg-slate-900' : 'bg-emerald-50/70 dark:bg-emerald-900/20'
                                            } text-slate-700 dark:text-slate-200`}
                                    >
                                        {doctor.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="h-32">
                                <td className="px-6 py-4 text-center text-sm font-bold text-slate-900 dark:text-white border-r border-gray-200 dark:border-gray-800 bg-slate-50/30 dark:bg-slate-800/30">
                                    {selectedDate}
                                </td>
                                {doctors.map((doctor, docIndex) => (
                                    <td
                                        key={docIndex}
                                        className="relative p-0 border-r border-gray-200 dark:border-gray-800 transition-colors cursor-pointer group"
                                        onMouseEnter={() => setHoveredCell(docIndex)}
                                        onMouseLeave={() => setHoveredCell(null)}
                                        onClick={() => handleCellClick(doctor)}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 bg-blue-50/30 dark:bg-blue-900/10">
                                            <Plus className="w-8 h-8 text-blue-500" />
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Image 3: Side Drawer (Mijoz qo'shish) */}
            <Modal
                isOpen={isSideDrawerOpen}
                onClose={() => setIsSideDrawerOpen(false)}
                title={t('add_client')}
            >
                <div className="space-y-6">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-400">{selectedDoctor?.fullName}</span>
                        <div className="mt-6 flex justify-between items-center bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                            <span className="text-lg font-black text-slate-900 dark:text-white">{selectedDate}</span>
                            <button
                                onClick={() => setIsAddAppointmentOpen(true)}
                                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 text-xs uppercase tracking-wider"
                            >
                                {t('add_new')}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center py-20 text-slate-300 dark:text-slate-600 space-y-4">
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-full">
                            <Zap className="w-12 h-12" />
                        </div>
                        <span className="text-sm font-medium">{t('no_data')}</span>
                    </div>
                </div>
            </Modal>

            {/* Image 4: Yangi qo'shish Modal */}
            <CenterModal
                isOpen={isAddAppointmentOpen}
                onClose={() => setIsAddAppointmentOpen(false)}
                title={t('add_new')}
            >
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('select_patient')}</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <select className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none text-slate-900 dark:text-white">
                                    <option value="">{t('select_patient').replace('*', '')}</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} {p.surname}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={() => setIsAddNewPatientOpen(true)}
                                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
                            >
                                <Plus className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('select_technician')}</label>
                        <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none text-slate-900 dark:text-white">
                            <option value="">{t('select_technician')}</option>
                            {technicians.map(t => (
                                <option key={t.id} value={t.id}>{t.fio}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('appointment_time')}</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input type="time" defaultValue="18:32" className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('duration_min')}</label>
                        <input type="text" placeholder="Yozing..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('comment')}</label>
                        <textarea rows="3" placeholder="Yozing..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-slate-900 dark:text-white" />
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('sms')}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <button className="w-full py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/40 uppercase tracking-widest mt-4 active:scale-[0.98]">
                        {t('attach')}
                    </button>
                </div>
            </CenterModal>

            {/* Image 5: Yangi Bemor qo'shish Modal */}
            <CenterModal
                isOpen={isAddNewPatientOpen}
                onClose={() => setIsAddNewPatientOpen(false)}
                title={t('add_new')}
                size="max-w-4xl"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('name')} <span className="text-red-500">*</span></label>
                            <input type="text" placeholder="Nomi kiriting..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('birth_date')}</label>
                            <input type="text" placeholder="kun.oy.yil" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('phone')} <span className="text-red-500">*</span></label>
                            <input type="text" placeholder="Telefon raqamini kiriting..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('gender')}</label>
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                <button className="flex-1 py-2 text-sm font-bold rounded-lg bg-blue-600 text-white shadow-lg">Erkak</button>
                                <button className="flex-1 py-2 text-sm font-bold rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition">Ayol</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('appointment_time')}</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input type="text" placeholder="Tanlang" className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('surname')}</label>
                            <input type="text" placeholder="Familiyani kiriting..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('address')}</label>
                            <input type="text" placeholder="Yozing..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('select_technician')} <span className="text-red-500">*</span></label>
                            <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none text-slate-900 dark:text-white">
                                <option value="">{t('select_technician')}</option>
                                {technicians.map(t => (
                                    <option key={t.id} value={t.id}>{t.fio}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('co_illnesses')}</label>
                            <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none text-slate-900 dark:text-white">
                                <option value="">Tanlang</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('duration_min')}</label>
                            <input type="text" placeholder="Yozing..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" />
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('comment')}</label>
                            <input type="text" placeholder="Yozing..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white" />
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('sms')}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-8">
                    <button className="px-10 py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/40 uppercase tracking-widest active:scale-[0.98]">
                        Qo'shish
                    </button>
                </div>
            </CenterModal>
        </div>
    );
};

export default CalendarContent;
