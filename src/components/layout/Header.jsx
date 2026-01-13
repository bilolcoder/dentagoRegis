import React, { useState } from 'react';
import { useData } from '../../context/DataProvider';
import {
    Search,
    Maximize,
    Menu,
    ChevronDown,
    Calendar,
    LogOut,
    User,
    CreditCard,
    FileText,
} from 'lucide-react';
import { UZ, US, RU } from 'country-flag-icons/react/3x2';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmationModal from '../modals/LogoutConfirmationModal';

// Qidiruv Modali
const SearchModal = ({ isOpen, onClose }) => {
    const { t } = useData();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 sm:pt-20 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-blue-100 animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-blue-50 flex items-center gap-3">
                    <Search className="w-5 h-5 text-[#00BCE4]" />
                    <input
                        type="text"
                        placeholder={t('search') || "Qidiruv..."}
                        className="flex-1 bg-transparent outline-none text-slate-900 placeholder-slate-400 text-base sm:text-lg"
                        autoFocus
                    />
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-blue-50 rounded-full text-slate-400 hover:text-[#00BCE4] transition-colors"
                    >
                        <span className="text-2xl leading-none">&times;</span>
                    </button>
                </div>
                <div className="p-6 min-h-75 max-h-[60vh] overflow-y-auto bg-white">
                    <div className="flex flex-col items-center justify-center text-center space-y-3 py-10">
                        <div className="p-4 bg-blue-50 rounded-full">
                            <Search className="w-8 h-8 text-[#00BCE4]" />
                        </div>
                        <p className="text-slate-500 text-sm sm:text-base font-medium">
                            Bemorlar, Davolashlar va Xizmatlar bo'yicha tezkor qidiruv...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Header = ({ setIsSidebarOpen, isSidebarOpen, currentPage }) => {
    const navigate = useNavigate();

    const {
        data = {},
        locale,
        switchLocale,
        t,
        logout
    } = useData();

    // Foydalanuvchi ma'lumotlari
    const getCurrentUser = () => {
        const stored = localStorage.getItem('userData');
        const rolee = localStorage.getItem('userRole') || '';
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                return {
                    username: parsed.name || parsed.username || 'Foydalanuvchi',
                    role: rolee === 'user' ? 'OPERATOR' : (parsed.role || 'OPERATOR').toUpperCase()
                };
            } catch (e) {
                console.error("userData parse xatosi:", e);
            }
        }

        if (data.user) {
            return {
                username: data.user.username || data.user.name || 'Foydalanuvchi',
                role: data.user.role === 'user' ? 'OPERATOR' : (data.user.role || 'OPERATOR').toUpperCase()
            };
        }

        const phone = localStorage.getItem('userPhone') || '';
        const formattedPhone = phone ? phone.replace('+998', '9') : 'Foydalanuvchi';

        // return {
        //     username: formattedPhone,
        //     role: rolee || 'role kiritilmagan'
        // };
    };

    const user = getCurrentUser();

    const getInitial = () => {
        if (user.username && user.username.trim()) {
            const firstChar = user.username.trim().charAt(0).toUpperCase();
            return isNaN(firstChar) ? firstChar : firstChar;
        }
        return 'U';
    };

    const [isLocaleMenuOpen, setIsLocaleMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogoutClick = () => {
        setIsProfileMenuOpen(false);
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = () => {
        logout();
        localStorage.removeItem('userData');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsLogoutModalOpen(false);
        navigate('/login');
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };

    const handleLocaleChange = (newLocale) => {
        switchLocale(newLocale);
        setIsLocaleMenuOpen(false);
    };

    const getFlag = (loc) => {
        const flagClass = "w-5 h-3.5 object-cover rounded-sm shadow-sm";
        switch (loc) {
            case 'uz': return <UZ title="O'zbek" className={flagClass} />;
            case 'en': return <US title="English" className={flagClass} />;
            case 'ru': return <RU title="Русский" className={flagClass} />;
            default: return null;
        }
    };

    // MOBIL SIDEBAR OCHISH/YOPISH FUNKSIYASI
    const handleMobileMenuToggle = () => {
        console.log('Menu tugmasi bosildi, hozirgi holat:', isSidebarOpen);
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <header className="flex items-center justify-between px-3 sm:px-6 py-3 bg-white border-b border-blue-100 shadow-sm sticky top-0 z-40">
            {/* Chap qism: Menu tugmasi va Sarlavha */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* MOBIL MENU TUGMASI */}
                <button
                    onClick={handleMobileMenuToggle}
                    className="p-2.5 text-slate-600 rounded-xl hover:bg-blue-50 active:scale-95 transition-all md:hidden"
                    aria-label="Sidebar ochish/yopish"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <h1 className="text-lg sm:text-2xl font-bold text-[#00BCE4] tracking-tight">
                    {currentPage}
                </h1>
            </div>

            {/* O'ng qism: Ikonkalar */}
            <div className="flex items-center gap-1 sm:gap-3">
                {/* Qidiruv */}
                <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-slate-500 rounded-xl hover:bg-blue-50 transition-all group"
                >
                    <Search className="w-5 h-5 group-hover:text-[#00BCE4] transition-colors" />
                </button>

                {/* Taqvim */}
                <button
                    onClick={() => navigate('/taqvim')}
                    className="p-2 text-slate-500 rounded-xl hover:bg-blue-50 transition-all hidden xs:flex"
                >
                    <Calendar className="w-5 h-5 hover:text-[#00BCE4]" />
                </button>

                {/* Fullscreen */}
                <button
                    onClick={toggleFullscreen}
                    className="p-2 text-slate-500 rounded-xl hover:bg-blue-50 transition-all hidden md:flex"
                    title="To'liq ekran"
                >
                    <Maximize className="w-5 h-5 hover:text-[#00BCE4]" />
                </button>

                {/* Til tanlash */}
                <div className="relative">
                    <button
                        onClick={() => setIsLocaleMenuOpen(!isLocaleMenuOpen)}
                        className="flex items-center gap-1.5 p-1.5 sm:p-2 text-slate-600 rounded-xl hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
                    >
                        {getFlag(locale)}
                        <span className="text-xs sm:text-sm font-bold hidden xs:inline uppercase">{locale}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLocaleMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isLocaleMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsLocaleMenuOpen(false)}></div>
                            <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl z-20 border border-blue-50 py-2">
                                {['uz', 'ru', 'en'].map(lang => (
                                    <button
                                        key={lang}
                                        onClick={() => handleLocaleChange(lang)}
                                        className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${locale === lang ? 'bg-[#00BCE4] text-white' : 'text-slate-700 hover:bg-blue-50 hover:text-[#00BCE4]'}`}
                                    >
                                        {getFlag(lang)}
                                        <span className="font-bold uppercase">{lang}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Profil */}
                <div className="relative flex items-center border-l border-slate-100 ml-1 pl-2 sm:pl-4">
                    <button
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="flex items-center gap-2 group outline-none"
                    >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#00BCE4] text-white flex items-center justify-center rounded-full text-sm font-black shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                            {getInitial()}
                        </div>
                        <div className="hidden lg:flex flex-col items-start text-left">
                            <span className="text-sm font-bold text-slate-900 leading-tight group-hover:text-[#00BCE4]">
                                {user.username}
                            </span>
                            <span className="text-[10px] font-bold text-[#00BCE4] uppercase tracking-wider">
                                {user.role}
                            </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isProfileMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsProfileMenuOpen(false)}></div>
                            <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-2xl z-20 border border-blue-50 py-3">
                                <div className="px-4 py-2 mb-2 border-b border-blue-50 lg:hidden">
                                    <p className="text-sm font-bold text-slate-900">{user.username}</p>
                                    <p className="text-xs text-[#00BCE4] font-medium">{user.role}</p>
                                </div>

                                <button onClick={() => { navigate('/profile'); setIsProfileMenuOpen(false); }} className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-[#00BCE4] group">
                                    <User className="w-4 h-4 mr-3 text-slate-400 group-hover:text-[#00BCE4]" />
                                    <span className="font-medium">{t('my_profile') || "Mening profilim"}</span>
                                </button>
                                <button onClick={() => { navigate('/payments/app'); setIsProfileMenuOpen(false); }} className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-[#00BCE4] group">
                                    <CreditCard className="w-4 h-4 mr-3 text-slate-400 group-hover:text-[#00BCE4]" />
                                    <span className="font-medium">{t('app_payments') || "To'lovlar"}</span>
                                </button>
                                <button onClick={() => { navigate('/payments/tariffs'); setIsProfileMenuOpen(false); }} className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-[#00BCE4] group">
                                    <FileText className="w-4 h-4 mr-3 text-slate-400 group-hover:text-[#00BCE4]" />
                                    <span className="font-medium">{t('tariffs') || "Tariflar"}</span>
                                </button>

                                <div className="h-px bg-blue-50 my-2"></div>

                                <button
                                    onClick={handleLogoutClick}
                                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-bold"
                                >
                                    <LogOut className="w-4 h-4 mr-3" />
                                    {t('logout') || "Chiqish"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modallar */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <LogoutConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleConfirmLogout}
            />
        </header>
    );
};

export default Header;
