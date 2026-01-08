import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home, Calendar, Users, Stethoscope, Briefcase, FileText, Send, Settings, BookOpen,
    Phone, ChevronRight, ChevronDown, ListOrdered, DollarSign, TrendingUp, LayoutList,
    Archive,
    User
} from 'lucide-react';
import { BsTelegram } from 'react-icons/bs';
import { Result } from 'antd';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const location = useLocation();

    // Har bir guruh menyu uchun alohida ochilish holati (state)
    const [openMenus, setOpenMenus] = useState({
        ombor: false,
        hisobot: false,
    });

    // Menyu ochilish/yopilish funksiyasi
    const handleMenuToggle = (menuName) => {
        setOpenMenus(prev => ({
            ...prev,
            [menuName]: !prev[menuName],
        }));
    };

    // Sahifa o'zgarganda tegishli menyuni avtomatik ochish
    useEffect(() => {
        // Ombor bo'limi sahifalaridan biri bo'lsa (Ombor sahifalarini qo'shgandan so'ng ishlaydi)
        if (location.pathname.startsWith('/ombor')) {
            setOpenMenus(prev => ({ ...prev, ombor: true }));
        }
        // Hisobot bo'limi sahifalaridan biri bo'lsa
        if (location.pathname.startsWith('/hisobot')) {
            setOpenMenus(prev => ({ ...prev, hisobot: true }));
        }
        // SMS bo'limi sahifalaridan biri bo'lsa
        if (location.pathname.startsWith('/sms')) {
            setOpenMenus(prev => ({ ...prev, sms: true })); // <-- QO'SHILADI
        }

        if (location.pathname.startsWith('/settings')) {
            setOpenMenus(prev => ({ ...prev, settings: true })); // 'settings' nomi subItems dagi 'name' bilan bir xil bo'lishi kerak
        }
    }, [location.pathname]);

    // Menyu elementlari tuzilmasi
    const navItems = [
        { icon: Home, label: "Asosiy", route: "/", type: "link" },
        { icon: Calendar, label: "Taqvim", route: "/taqvim", type: "link" },
        { icon: Users, label: "Navbat", route: "/queue", type: "link" },
        { icon: Users, label: "Natijalarim", route: "/result", type: "link" },
        // ✨ YANGI QISM: BUYURTMALAR (BTS)
        { icon: ListOrdered, label: "Buyurtmalar (BTS)", route: "/orders", type: "link" },

        // --- OMBOR BO'LIMI (YANGI GROUP) ---
        {
            icon: Archive, // Ikonka (lucide-react'dan import qilinadi)
            label: "Ombor",
            route: "/storage",
            type: "group",
            name: "storage",
            subItems: [
                { label: "Hujjatlar", route: "/storage/documents" },
                { label: "Mahsulotlar", route: "/storage/products" },
                { label: "Kategoriyalar", route: "/storage/categories" },
                { label: "Brend", route: "/storage/brands" },
                { label: "O'lchov birliklari", route: "/storage/units" }, // Keyingi qadam uchun qoldirildi
                { label: "Yetkazib beruvchi", route: "/storage/suppliers" }, // Keyingi qadam uchun qoldirildi
            ]
        },

        // --- HISOBOT BO'LIMI (YANGI GROUP) ---
        {
            icon: FileText,
            label: "Hisobot",
            route: "/hisobot",
            type: "group",
            name: "hisobot",
            subItems: [
                { label: "To'lovlar", route: "/hisobot/to'lovlar", icon: DollarSign },
                { label: "Lead statistika", route: "/hisobot/lead-statistika", icon: TrendingUp },
                { label: "Dok. Kunilik hisobotlari", route: "/hisobot/doktor-hisobotlari", icon: LayoutList },
                { label: "Doktorlarga pul berish", route: "/hisobot/doktorlarga-pul-berish", icon: DollarSign },
                { label: "Kunilik harajatlar", route: "/hisobot/kunilik-xarajatlar", icon: ListOrdered },
                { label: "Kunilik harajatlar kategoriyalari", route: "/hisobot/kunilik-xarajatlar-kategoriyalari", icon: LayoutList },
            ]
        },

        // --- SMS BO'LIMI (YANGI GROUP) ---
        {
            icon: Send,
            label: "Sms",
            route: "/sms",
            type: "group", // E'tibor bering, endi 'group'
            name: "sms",
            subItems: [
                { label: "Sms shablonlari", route: "/sms/shablonlar" },
                { label: "Sms sozlamalari", route: "/sms/sozlamalar" },
            ]
        },
        // --- SOZLAMALAR BO'LIMI (YANGI GROUP) ---
        {
            icon: Settings, // import qilish kerak bo'lishi mumkin
            label: "Sozlamalar",
            route: "/settings",
            type: "group",
            name: "settings",
            subItems: [
                { label: "Sozlamalar", route: "/settings/general" },           // 1. Umumiy sozlamalar
                { label: "Lead kategoriyalar", route: "/settings/lead-categories" }, // 2. Lead kategoriyalar
                { label: "Kasalliklar", route: "/settings/diseases" },         // 3. Kasalliklar
                { label: "Reklama sozlamalari", route: "/settings/advertising" },
            ]
        },

    ];

    const bottomItems = [
        {
            icon: BookOpen, // Ikonka (lucide-react'dan import qilinadi)
            label: "Qo'llanma",
            route: "/manual",
            type: "single",
            name: "manual",
        },
    ];

    // Faol linklar uchun umumiy style klasslari
    const activeLinkClasses = "bg-[#273549] text-white font-semibold border-r-4 border-blue-600";
    const inactiveLinkClasses = "text-gray-600 hover:bg-[#273549] hover:text-white";
    const subActiveLinkClasses = "bg-[#273549] text-white font-semibold border-r-4 border-blue-600";
    const subInactiveLinkClasses = "text-gray-300 hover:bg-[#273549]";

    return (
        <>
            <aside
                className={`fixed top-0 left-0 w-64 h-full min-h-screen flex flex-col bg-[#3A455A] shadow-lg z-50 transition-transform duration-300
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:shadow-none`}
            >
                {/* Logo qismi */}
                <div className="shrink-0 pt-6 px-4 pb-4 bg-[#3A455A]">
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        <span className="text-blue-500">Denta</span>
                        <span className="text-white">Go</span>
                    </h1>
                </div>

                {/* Asosiy navigatsiya qismi */}
                <nav className="grow overflow-y-auto custom-scrollbar">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            // Faollikni tekshirish: agar joriy sahifa linkning o'zi bo'lsa
                            const isExactActive = location.pathname === item.route;

                            // Faollikni tekshirish: agar joriy sahifa guruh ichidagi sub-linklardan biri bo'lsa (faqat guruhlar uchun kerak)
                            const isGroupActive = item.type === 'group' && item.subItems.some(sub => location.pathname.startsWith(sub.route));

                            if (item.type === 'link') {
                                return (
                                    <li key={item.label}>
                                        <Link
                                            to={item.route}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className={`flex items-center justify-between gap-4 text-white px-4 py-3 transition-all
                                                ${isExactActive ? activeLinkClasses : inactiveLinkClasses}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <item.icon className="w-5 h-5" />
                                                <span className="text-sm">{item.label}</span>
                                            </div>
                                            {/* Faqat group bo'lmagan, lekin o'zi group bo'lishi kerak bo'lganlar uchun ikonka qo'shimcha shart emas */}
                                        </Link>
                                    </li>
                                );
                            }

                            if (item.type === 'group') {
                                const isOpen = openMenus[item.name] || isGroupActive;

                                return (
                                    <li key={item.label}>
                                        <button
                                            onClick={() => handleMenuToggle(item.name)}
                                            className={`flex w-full items-center justify-between gap-4 px-6 py-3 transition-all text-white
                                                ${isOpen ? 'bg-[#273549] text-white font-semibold' : inactiveLinkClasses}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <item.icon className="w-5 h-5" />
                                                <span className="text-sm">{item.label}</span>
                                            </div>
                                            {isOpen ? (
                                                <ChevronDown className='w-4 h-4 text-gray-400' />
                                            ) : (
                                                <ChevronRight className='w-4 h-4 text-gray-400' />
                                            )}
                                        </button>

                                        {/* Group sub-menu kontenti */}
                                        {isOpen && (
                                            <ul className="pl-4">
                                                {item.subItems.map(subItem => {
                                                    const isSubActive = location.pathname === subItem.route;
                                                    return (
                                                        <li key={subItem.label}>
                                                            <Link
                                                                to={subItem.route}
                                                                onClick={() => setIsSidebarOpen(false)}
                                                                className={`flex items-center w-full px-4 py-3 text-sm transition-all
                                                                    ${isSubActive ? subActiveLinkClasses : subInactiveLinkClasses}`}
                                                            >
                                                                {subItem.label}
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </li>
                                );
                            }
                            return null;
                        })}
                    </ul>
                </nav>

                {/* Pastki menyu qismi */}
                <div className="shrink-0 pt-4 border-t border-[#273549]">
                    <ul className="space-y-1">
                        {bottomItems.map((item) => (
                            <li key={item.label}>
                                <Link
                                    to={item.route}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="flex items-center justify-between gap-4 px-6 py-3 text-gray-300 hover:bg-[#273549] transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <item.icon className="w-5 h-5" />
                                        <span className="text-sm">{item.label}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Bog'lanish ma'lumotlari */}
                    <div className="px-6 py-4">
                        <p className="font-semibold text-sm mb-2 text-white">Bog'lanish</p>
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-400">+998 71 XXX-XX-XX</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <BsTelegram className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-400">@example_uz</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Backdrop (Mobil versiya uchun) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </>
    );
};

export default Sidebar;
