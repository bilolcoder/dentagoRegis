import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Home, FileText,   Stethoscope, Send, Users, Settings, BookOpen,
    ChevronDown, ListOrdered,Archive, User, PlusCircle, ArrowLeft
} from 'lucide-react';
import { HiOutlineInformationCircle } from "react-icons/hi";
import { BsInstagram, BsTelegram } from 'react-icons/bs';
import { FaYoutube } from "react-icons/fa";
import { useData } from '../../context/DataProvider';
import Logo from '../../assets/dentago.png';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useData();

    const [openMenus, setOpenMenus] = useState({
        ombor: false,
        hisobot: false,
        sms: false,
        settings: false,
    });

    // Markazlashgan navigatsiya funksiyasi
    const handleNavigation = (route, isExternal = false) => {
        if (isExternal) {
            window.open(route, '_blank', 'noopener,noreferrer');
        } else {
            navigate(route);
            setIsSidebarOpen(false); // Mobil versiyada sidebarni yopish
        }
    };

    const handleMenuToggle = (menuName) => {
        setOpenMenus(prev => ({
            ...prev,
            [menuName]: !prev[menuName],
        }));
    };

    // Sahifa yuklanganda aktiv menyuni avtomatik ochish
    useEffect(() => {
        if (location.pathname.startsWith('/storage')) setOpenMenus(prev => ({ ...prev, ombor: true }));
        if (location.pathname.startsWith('/hisobot')) setOpenMenus(prev => ({ ...prev, hisobot: true }));
        if (location.pathname.startsWith('/sms')) setOpenMenus(prev => ({ ...prev, sms: true }));
        if (location.pathname.startsWith('/settings')) setOpenMenus(prev => ({ ...prev, settings: true }));
    }, [location.pathname]);

    const navItems = [
        { icon: Home, label: t('main'), route: "/dashboard", type: "link" },
        { icon: HiOutlineInformationCircle, label: t('my_information'), route: "/my-information", type: "link" },
        { icon: Users, label: t('bemorlarim'), route: "/bemorlarim", type: "link" },
        { icon: ListOrdered, label: t('orders_bts'), route: "/orders", type: "link" },
        { icon: User, label: t('my_results'), route: "/result", type: "link" },
        { icon: PlusCircle, label: "Mahsulot qo'shish", route: "/addproduct", type: "link" },

        {
            icon: Archive,
            label: t('warehouse'),
            route: "/storage",
            type: "group",
            name: "ombor",
            subItems: [
                { label: t('documents'), route: "/storage/documents" },
                { label: t('products'), route: "/storage/products" },
                { label: t('categories'), route: "/storage/categories" },
                { label: t('brands'), route: "/storage/brands" },
                { label: t('units'), route: "/storage/units" },
                { label: t('suppliers'), route: "/storage/suppliers" },
                { label: t('product_usage'), route: "/storage/usage" },
            ]
        },
        {
            icon: FileText,
            label: t('reports'),
            route: "/hisobot",
            type: "group",
            name: "hisobot",
            subItems: [
                { label: t('payments'), route: "/hisobot/to'lovlar" },
                { label: t('lead_statistics'), route: "/hisobot/lead-statistika" },
                // { label: t('doc_daily_reports'), route: "/hisobot/doktor-hisobotlari" },
                // { label: t('give_money_docs'), route: "/hisobot/doktorlarga-pul-berish" },
                { label: t('daily_expenses'), route: "/hisobot/kunilik-xarajatlar" },
                { label: t('daily_expense_categories'), route: "/hisobot/kunilik-xarajatlar-kategoriyalari" },
            ]
        },
        {
            icon: Send,
            label: t('sms'),
            route: "/sms",
            type: "group",
            name: "sms",
            subItems: [
                { label: t('sms_templates'), route: "/sms/shablonlar" },
                { label: t('sms_settings'), route: "/sms/sozlamalar" },
            ]
        },
        {
            icon: Settings,
            label: t('settings'),
            route: "/settings",
            type: "group",
            name: "settings",
            subItems: [
                { label: t('general_settings'), route: "/settings/general" },
                // { label: t('lead_categories'), route: "/settings/lead-categories" },
                // { label: t('diseases'), route: "/settings/diseases" },
                // { label: t('ad_settings'), route: "/settings/advertising" },
                // { label: t('announcements'), route: "/settings/announcements" },
            ]
        },
    ];

    const renderNavItem = (item, index) => {
        // Bosh sahifa uchun aniq tekshiruv, guruhlar uchun startsWith tekshiruvi
        const isActive = item.route === "/"
            ? location.pathname === "/"
            : location.pathname === item.route || (item.type === "group" && location.pathname.startsWith(item.route));

        if (item.type === "link") {
            return (
                <div key={index} className="space-y-1">
                    <div
                        onClick={() => handleNavigation(item.route)}
                        className={`
                            flex items-center gap-4 px-5 py-3 rounded-[7px] cursor-pointer transition-all duration-300
                            ${isActive
                                ? 'bg-[#00BCE4] text-white'
                                : 'text-slate-400 font-bold hover:bg-[#00BCE4] hover:text-slate-50'}
                        `}
                    >
                        <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[11px] uppercase tracking-widest">{item.label}</span>
                    </div>
                </div>
            );
        } else {
            return (
                <div key={index} className="space-y-1">
                    <button
                        onClick={() => handleMenuToggle(item.name)}
                        className={`
                            w-full flex items-center justify-between px-5 py-3 rounded-[7px] transition-all duration-300
                            ${isActive
                                ? 'bg-slate-50 text-[#00BCE4]'
                                : 'text-slate-400 font-bold hover:bg-[#00BCE4] hover:text-slate-50'}
                        `}
                    >
                        <div className="flex items-center gap-4">
                            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[11px] uppercase tracking-widest">{item.label}</span>
                        </div>
                        <ChevronDown size={16} className={`transition-transform duration-300 ${openMenus[item.name] ? 'rotate-180' : ''}`} />
                    </button>

                    <div className={`
                        overflow-hidden transition-all duration-500
                        ${openMenus[item.name] ? 'max-h-[600px] opacity-100 mt-2' : 'max-h-0 opacity-0'}
                    `}>
                        <div className="pl-5 space-y-1">
                            {item.subItems.map((sub, sIdx) => {
                                const isSubActive = location.pathname === sub.route;
                                return (
                                    <div
                                        key={sIdx}
                                        onClick={() => handleNavigation(sub.route)}
                                        className={`
                                            cursor-pointer block py-3 px-4 rounded-[7px] text-[10px] font-black uppercase tracking-tight transition-all
                                            ${isSubActive
                                                ? 'text-white bg-[#00BCE4]'
                                                : 'text-slate-400 hover:text-[#00BCE4] hover:translate-x-1'}
                                        `}
                                    >
                                        {sub.label}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-all duration-500"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
            <aside className={`
                fixed top-0 left-0 h-full bg-blue-50 z-50
                transition-all duration-500 ease-in-out
                w-72 flex flex-col justify-between border-r border-blue-50
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static md:h-screen
            `}>
                <div className="flex-1 flex flex-col relative min-h-0">
                    {/* Brand Identity */}
                    <div className="p-8 pb-6 flex bg-white items-center justify-between">
                        <div onClick={() => handleNavigation("/")} className="cursor-pointer flex items-center justify-center gap-3 group">
                            <img className='h-37.5 -mt-18.25 mx-auto ml-[32px]' src={Logo} alt="Logo" />
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute top-4 left-2 p-2 text-slate-400">
                            <ArrowLeft size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto bg-white mt-[-65px] px-4 space-y-2 custom-scrollbar pb-10">
                        {navItems.map((item, index) => renderNavItem(item, index))}
                    </nav>
                </div>

                {/* Footer Section */}
                <div className="px-6 py-8 bg-white border-t border-gray-200">
                    <div
                        onClick={() => handleNavigation("/manual")}
                        className={`
                            cursor-pointer flex items-center gap-2 w-[105px] m-auto mb-[20px] py-1 justify-center transition-all
                            ${location.pathname === '/manual'
                                ? 'text-[#00BCE4] border-b-2'
                                : 'text-slate-500 font-bold'}
                        `}
                    >
                        <BookOpen size={15} />
                        <span className="text-[11px] uppercase tracking-widest">{t('manual')}</span>
                    </div>

                    {/* Social Connect */}
                    <div className="flex justify-center gap-4 mb-[10px] h-8 items-center">
                        <div onClick={() => handleNavigation("https://t.me/Dentago_uz", true)} className="cursor-pointer text-[#00BCE4] hover:scale-110 transition-all">
                            <BsTelegram size={20} />
                        </div>
                        <div onClick={() => handleNavigation("https://www.instagram.com/dentago__uz", true)} className="cursor-pointer text-red-700 hover:scale-110 transition-all">
                            <BsInstagram size={20} />
                        </div>
                        <div onClick={() => handleNavigation("mailto:ddentago@gmail.com", true)} className="cursor-pointer text-red-500 hover:scale-110 transition-all">
                            <FaYoutube size={22} />
                        </div>
                    </div>

                    <p className="text-center mt-[25px] text-[10px] font-medium text-black uppercase tracking-tighter">
                        &copy; 2025 DentaGo Platform
                    </p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
