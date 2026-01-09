import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DataProvider, useData } from './context/DataProvider';

// Layout
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Pages
import DashboardContent from './components/DashboardContent';
import PaymentsContent from './components/PaymentsContent';
import LeadStatisticsContent from './components/LeadStatisticsContent';
import DailyExpensesContent from './components/DailyExpensesContent';
import DailyExpenseCategoriesContent from './components/DailyExpenseCategoriesContent';
import SmsTemplatesContent from './components/SmsTemplatesContent';
import SmsSettingsContent from './components/SmsSettingsContent';
import GeneralSettingsContent from './components/GeneralSettingsContent';
import ManualContent from './components/ManualContent';
import DocumentsContent from './components/storage/DocumentsContent';
import ProductsContent from './components/storage/ProductsContent';
import CategoriesContent from './components/storage/CategoriesContent';
import BrandsContent from './components/storage/BrandsContent';
import UnitsContent from './components/storage/UnitsContent';
import SuppliersContent from './components/storage/SuppliersContent';
import ProductUsageContent from './components/storage/ProductUsageContent';
import OrderList from './components/pages/BTS/OrderList';
import Yetkazibberish from './components/pages/BTS/yetkazibBeruvchi';
import Results from './components/Results';
import ProfileContent from './components/ProfileContent';
import AppPaymentsContent from './components/AppPaymentsContent';
import TariffsContent from './components/TariffsContent';
import Cards from './components/pages/BTS/cards';
import Addproduct from './components/pages/addMahsulot';
import MahsulotQoshish from './components/pages/BTS/MahsulotQAdd';
import MyInformation from './components/MyInformayion';
import Bemorlarim from './components/Bemorlarim';

// Auth
import Login from './components/Login';
import Registration from './components/registration';

import Logo from "./assets/dentago.png";

// 🔵 Telegram tugmasi
const TelegramButton = () => (
  <a
    href="https://t.me/dentalsoft_uz"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-[9999] w-14 h-14 flex items-center justify-center bg-[#00BCE4] rounded-full shadow-2xl hover:scale-110 transition-all"
  >
    {/* <img src={Logo} alt="DentaGo" className="w-10 h-10 rounded" /> */}
    <i className='text-2xl font-bold text-white'>GO</i>
  </a>
);

// 🔐 Protected Layout (faqat autentifikatsiya qilinganlar uchun)
const ProtectedLayout = () => {
  const { isAuthenticated, theme } = useData();
  const location = useLocation();

  // Agar login qilinmagan bo'lsa — login sahifasiga yubor
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const path = location.pathname;

  const renderContent = () => {
    if (path === '/' || path === '/dashboard') return <DashboardContent />;
    if (path === "/hisobot/to'lovlar") return <PaymentsContent />;
    if (path === '/hisobot/lead-statistika') return <LeadStatisticsContent />;
    if (path === '/hisobot/kunilik-xarajatlar') return <DailyExpensesContent />;
    if (path === '/hisobot/kunilik-xarajatlar-kategoriyalari') return <DailyExpenseCategoriesContent />;
    if (path === '/sms/shablonlar') return <SmsTemplatesContent />;
    if (path === '/sms/sozlamalar') return <SmsSettingsContent />;
    if (path === '/settings/general') return <GeneralSettingsContent />;
    if (path === '/manual') return <ManualContent />;
    if (path === '/storage/documents') return <DocumentsContent />;
    if (path === '/storage/products' || path === '/storage') return <ProductsContent />;
    if (path === '/storage/categories') return <CategoriesContent />;
    if (path === '/storage/brands') return <BrandsContent />;
    if (path === '/storage/units') return <UnitsContent />;
    if (path === '/storage/suppliers') return <SuppliersContent />;
    if (path === '/storage/usage') return <ProductUsageContent />;
    if (path === '/orders') return <OrderList />;
    if (path === '/profile') return <ProfileContent />;
    if (path === '/payments/app') return <AppPaymentsContent />;
    if (path === '/payments/tariffs') return <TariffsContent />;
    if (path === '/yetkazibberish') return <Yetkazibberish />;
    if (path === '/result') return <Results />;
    if (path === '/cards') return <Cards />;
    if (path === '/addproduct') return <Addproduct />;
    if (path === '/MahsulotQoshish') return <MahsulotQoshish />;
    if (path === '/my-information') return <MyInformation />;
    if (path === '/bemorlarim') return <Bemorlarim />;

    return <div className="text-center text-3xl mt-20 text-gray-500">404 — Sahifa topilmadi</div>;
  };

  return (
    <>
      <div className={`flex h-screen overflow-hidden bg-white `}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Header />
          <div className="p-4 md:p-6 lg:p-8">
            {renderContent()}
          </div>
        </main>
      </div>
      <TelegramButton />
    </>
  );
};

// 🔑 Auth sahifalari
const LoginPage = () => (
  <>
    <Login />
    <TelegramButton />
  </>
);

const RegisterPage = () => (
  <>
    <Registration />
    <TelegramButton />
  </>
);

// 🏠 Bosh sahifa — smart redirect
const HomeRedirect = () => {
  const { isAuthenticated } = useData();

  // Login bo'lgan bo'lsa → dashboard, aks holda → login
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

// 🚀 MAIN APP
const App = () => {
  return (
    <DataProvider>
      <Routes>
        {/* Bosh sahifa — autentifikatsiyaga qarab yo'naltiradi */}
        <Route path="/" element={<HomeRedirect />} />

        {/* Auth sahifalari */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Barcha himoyalangan routelar (sidebar + header bilan) */}
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </DataProvider>
  );
};

export default App;
