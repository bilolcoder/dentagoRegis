import React from 'react';
import { Play, Bookmark, Clock, ChevronRight, Video, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';

// Video kartochka uchun yangilangan premium komponent
const VideoCard = ({ title, thumbnailUrl }) => {
    return (
        <div className="group relative bg-white rounded-[2rem] border border-blue-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-[#00BCE4] hover:-translate-y-2 transition-all duration-500 cursor-pointer">
            {/* Thumbnail qismi */}
            <div className="relative h-44 bg-slate-100 overflow-hidden">
                {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-300">
                        <Video size={32} strokeWidth={1} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Video preview</span>
                    </div>
                )}

                {/* Glassmorphism Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#00BCE4] opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px]">
                    <div className="bg-white/90 p-4 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                        <Play className="w-6 h-6 text-[#00BCE4] fill-current" />
                    </div>
                </div>

                {/* Davomiyligi (Fake data misolida) */}
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-white tracking-tighter">
                    12:45
                </div>
            </div>

            {/* Kontent qismi */}
            <div className="p-5 space-y-3">
                <div className="flex justify-between items-start gap-2">
                    <p className="text-xs font-black text-slate-800 uppercase tracking-tighter leading-tight line-clamp-2 group-hover:text-[#00BCE4] transition-colors">
                        {title}
                    </p>
                    <button className="text-slate-300 hover:text-[#00BCE4] transition-colors">
                        <Bookmark size={14} />
                    </button>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <Clock size={12} />
                        <span>Yangi</span>
                    </div>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span className="text-[10px] font-black text-[#00BCE4] uppercase tracking-widest">Darslik</span>
                </div>
            </div>
        </div>
    );
};

const ManualContent = () => {
    const { data, t } = useData();
    const manualSections = data.manualSections || [];

    return (
        <div className="p-4 md:p-8 space-y-12 bg-slate-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-[0.2em]">
                        <Link to="/" className="hover:text-[#00BCE4] transition-colors tracking-widest">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-[#00BCE4] tracking-widest">{t('manual')}</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">Video Yo'riqnomalar</h1>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-[1.5rem] border border-blue-100 shadow-sm">
                    <div className="px-4 py-2 bg-blue-50 rounded-xl">
                        <p className="text-[10px] font-black text-[#00BCE4] uppercase tracking-widest">Jami videolar</p>
                        <p className="text-xl font-black text-slate-800 tracking-tighter">24 ta</p>
                    </div>
                </div>
            </div>

            {/* Ma'lumotlar mavjud bo'lsa ko'rsatish */}
            {manualSections.length > 0 ? (
                <div className="space-y-16">
                    {manualSections.map((section, index) => (
                        <section key={index} className="relative">
                            {/* Bo'lim sarlavhasi */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#00BCE4] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#00BCE4]">
                                        <ChevronRight size={24} />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">
                                        {section.title}
                                    </h2>
                                </div>
                                <div className="hidden md:block h-[2px] flex-1 mx-8 bg-gradient-to-r from-blue-100 to-transparent"></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    {section.videos.length} Video
                                </span>
                            </div>

                            {/* Video kartochkalar gridi */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                                {section.videos.map((video) => (
                                    <VideoCard
                                        key={video.id}
                                        title={video.title}
                                        videoUrl={video.url}
                                        thumbnailUrl={video.thumbnailUrl}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[4rem] border border-blue-100 shadow-sm border-dashed">
                    <div className="p-8 bg-blue-50 rounded-[3rem] text-blue-200 mb-6">
                        <HelpCircle size={64} strokeWidth={1} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-2">Hali videolar yuklanmadi</h3>
                    <p className="text-sm text-slate-400 font-bold italic tracking-tight uppercase">Tizim operatori bilan bog'laning</p>
                </div>
            )}
        </div>
    );
};

export default ManualContent;
