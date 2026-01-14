import React, { useState, useEffect, useRef } from 'react';
// Chiroyli va mantiqiy iconlar
import {
    ShoppingBag,    // Jami buyurtmalar
    CheckCircle2,   // To'langanlar
    Wallet,         // To'lov kutilmoqda
    Zap,            // Jarayonda
    Truck,          // Yetkazilmoqda
    PackageCheck,   // Yetkazib berildi
    Calendar,
    Users,
    ChevronRight,
    ShieldCheck,
    Briefcase
} from 'lucide-react';
import { MdMedicalServices } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { useData } from '../context/DataProvider';
import { Link, useNavigate } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import axios from 'axios';

const DashboardContent = () => {
    const { data, t, logout } = useData();
    const navigate = useNavigate();
    const dateInputRef = useRef(null);

    // API ma'lumotlari uchun statelar
    const [selectedDate, setSelectedDate] = useState('2025-01-12');
    const [orderStats, setOrderStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [showOfferModal, setShowOfferModal] = useState(false);

    const BASE_URL = "https://app.dentago.uz";

    // Statistikani yuklash funksiyasi
    const fetchOrderStats = async () => {
        try {
            setLoadingStats(true);
            const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

            const response = await axios.get(`${BASE_URL}/api/order/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                setOrderStats(response.data.data);
            }
        } catch (err) {
            console.error("Statistika yuklashda xatolik:", err);
        } finally {
            setLoadingStats(false);
        }
    };

    useEffect(() => {
        const accepted = localStorage.getItem('offerAccepted');
        if (!accepted) {
            setShowOfferModal(true);
        }
        fetchOrderStats();
    }, []);

    const handleAcceptOffer = () => {
        localStorage.setItem('offerAccepted', 'true');
        setShowOfferModal(false);
    };

    const handleRejectOffer = () => {
        logout();
        navigate('/login');
    };

    // Data Processing
    const services = data.services || [];
    const payments = data.payments || [];
    const staff = data.staff || [];

    const dentistsCount = staff.filter(s => s.position === 'Shifokor').length;
    const staffCount = staff.length;

    // API'dan kelgan ma'lumotlarga asoslangan 6 ta karta
    const topStats = [
        {
            title: "Jami Buyurtmalar",
            value: orderStats?.totalOrders || 0,
            icon: ShoppingBag,
            link: "/cards",
            color: "#0ea5e9"
        },
        {
            title: "To'langanlar",
            value: orderStats?.paid || 0,
            icon: CheckCircle2,
            link: "#",
            color: "#10b981"
        },
        {
            title: "To'lov kutilmoqda",
            value: orderStats?.pendingPayment || 0,
            icon: Wallet,
            link: "#",
            color: "#f59e0b"
        },
        {
            title: "Jarayonda",
            value: orderStats?.processing || 0,
            icon: Zap,
            link: "#",
            color: "#6366f1"
        },
        {
            title: "Yetkazilmoqda",
            value: orderStats?.shipped || 0,
            icon: Truck,
            link: "#",
            color: "#8b5cf6"
        },
        {
            title: "Yetkazib berildi",
            value: orderStats?.delivered || 0,
            icon: PackageCheck,
            link: "#",
            color: "#22c55e"
        },
        {
            title: "test",
            value: orderStats?.shipped || 0,
            icon:  PackageCheck,
            color: "#22c55e"
        },
        {
            title: "test",
            value: orderStats?.delivered || 0,
            icon: PackageCheck,
            color: "#22c55e"
        },
    ];

    const chartData = [
        { name: t('cash') || 'Naqd', value: payments.filter(p => p.type === 'Naqd').reduce((s, p) => s + (parseInt(p.amount) || 0), 0) },
        { name: t('card') || 'Karta', value: payments.filter(p => p.type === 'Karta').reduce((s, p) => s + (parseInt(p.amount) || 0), 0) },
        { name: 'Bank', value: payments.filter(p => p.type === 'Hisob raqam' || p.type === 'Bank').reduce((s, p) => s + (parseInt(p.amount) || 0), 0) },
    ];

    return (
        <div className="bg-[#f8fdff] min-h-screen font-sans">
            {/* Oferta Modal */}
            {showOfferModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#00BCE4]/20 backdrop-blur-sm" onClick={handleRejectOffer} />
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#00BCE4]/20">
                        <div className="p-8 bg-gradient-to-r from-[#00BCE4] to-[#0096b8] text-white">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-white/20 rounded-2xl"><ShieldCheck size={40} /></div>
                                <div>
                                    <h2 className="text-2xl font-bold uppercase tracking-tight">🦷 Dentago Platformasi</h2>
                                    <p className="text-sm opacity-90 mt-1">Ommaviy oferta shartnomasi</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 text-slate-700">
                             <p>Oferta matni...</p>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-4">
                            <button onClick={handleRejectOffer} className="flex-1 py-4 px-8 text-slate-500 font-bold rounded-2xl border border-slate-200">Bekor qilish</button>
                            <button onClick={handleAcceptOffer} className="flex-[2] py-4 px-8 bg-[#00BCE4] text-white font-bold rounded-2xl shadow-lg">Roziman va davom etish</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-4 md:p-8 space-y-6">
                {/* Dashboard Kartalari - 6 ta karta grid tizimida */}
                <section className="grid grid-cols-2 max-sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                    {topStats.map((stat, index) => (
                        <Link
                            to={stat.link}
                            key={index}
                            className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex justify-between items-center transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group"
                        >
                            <div className="flex items-center gap-5">
                                <div
                                    className="p-4 rounded-2xl transition-all duration-300 group-hover:rotate-6"
                                    style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                                >

<stat.icon size={32} strokeWidth={2} />


                                </div>
                                <div>
                                    {loadingStats ? (
                                        <div className="h-8 w-12 bg-slate-100 animate-pulse rounded-md mb-1"></div>
                                    ) : (
                                        <p className="text-[20px] font-black text-slate-800 tracking-tight leading-none">
                                            {stat.value}
                                        </p>
                                    )}
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                                        {stat.title}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-full group-hover:bg-[#00BCE4]/10 transition-colors">
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#00BCE4]" />
                            </div>
                        </Link>
                    ))}
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* To'lovlar Grafigi */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 tracking-tight">{t('payments')}</h3>
                                <p className="text-xs text-slate-400 font-medium">To'lovlar dinamikasi</p>
                            </div>
                            <button onClick={() => dateInputRef.current?.showPicker()} className="flex items-center gap-2 px-4 py-2 bg-[#e6f8fc] rounded-xl text-xs font-bold text-[#00BCE4]">
                                <Calendar className="w-4 h-4" />
                                <span>{selectedDate}</span>
                                <input type="date" ref={dateInputRef} className="absolute opacity-0 pointer-events-none" onChange={(e) => setSelectedDate(e.target.value)} />
                            </button>
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00BCE4" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#00BCE4" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                    <YAxis hide />
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="value" stroke="#00BCE4" strokeWidth={4} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Ommabop xizmatlar */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-6">{t('top_services') || "Ommabop xizmatlar"}</h3>
                        <div className="space-y-3">
                            {services.slice(0, 6).map((service, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-[#fcfdfe] border border-slate-50 transition-colors hover:bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#00BCE4] flex items-center justify-center text-white text-xs font-bold">
                                            {index + 1}
                                        </div>
                                        <p className="text-sm font-bold text-slate-800 truncate w-32">{service.name}</p>
                                    </div>
                                    <p className="text-sm font-black text-slate-700">{(service.price || 0).toLocaleString()} so'm</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;
