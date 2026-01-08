import React, { createContext, useState, useEffect, useContext } from 'react';
import { translations } from '../constants/translations';

const initialData = {
    staff: [
        { id: 1, fio: "Abduxalim To'xtayev", position: "Sotuvchi", login: "test_admin", phone: "+998934445566", color: 'white', status: 'Faol' },
        { id: 2, fio: "Mateo Versace", position: "Texnik", login: "tech", phone: "+998991234567", color: 'blue', status: 'Faol' },
    ],
    dailyExpenses: [],
    expenseCategories: [
        { id: 1, name: "Oziq-ovqat" },
        { id: 2, name: "Transport" },
        { id: 3, name: "Kanselyariya" },
        { id: 4, name: "Kommunal" },
        { id: 5, name: "Boshqa" }
    ],
    clinicInfo: {
        id: 1,
        name: "DentaGo Sotuv Platformasi",
        address: "Toshkent sh., Amir Temur ko'chasi 1",
        phone: "+998 90 123 45 67",
        email: "info@dentago.uz",
        bankDetails: "Hisob raqam: 20208000900000123456, MFO: 00424",
    },
    smsTemplates: [
        {
            id: 75,
            name: "Bemorga kelish uchun eslatma",
            type: "Bemor qabuli",
            status: true,
            message: "Hurmatli {bemor}! Sizning qabulgilingiz {doctor} qabulida {clinic} da belgilangan. Qabul vaqti: {sana}. Iltimos, vaqtida tashrif buyuring.",
            variables: ['{bemor}', '{sana}', '{doctor}', '{clinic}'],
            createdAt: "16.10.2025 11:38",
            updatedAt: "12.12.2025 14:28"
        },
        {
            id: 76,
            name: "Tug'ilgan kun bilari",
            type: "Tug'ilgan kun",
            status: true,
            message: "Hurmatli {bemor}! Sizni tug'ilgan kuniningiz bilan chin qalbimizdan tabriklaymiz. {clinic} jamoasi.",
            variables: ['{bemor}', '{clinic}'],
            createdAt: "16.10.2025 11:40",
            updatedAt: "12.12.2025 14:30"
        },
    ],
    smsSettings: [
        {
            id: 1,
            clinicName: "Dental Soft Klinikasi",
            token: "ASDF123-ZXCV456-QWER789-MNBV012",
            updatedAt: "15.12.2025 14:00",
        },
    ],
    generalSettings: {
        id: 1,
        companyName: "Dental Soft Klinika",
        phone1: "+998 90 123 45 67",
        phone2: "+998 91 765 43 21",
        email: "info@dentalsoft.uz",
        address: "Toshkent sh., Yunusobod tumani, Amir Temur ko'chasi 16-uy",
        logoUrl: "/path/to/default/logo.png",
        lastUpdated: "15.12.2025 14:30"
    },
    storage: {
        documents: [
            { id: 1, name: "Asosiy shartnoma", supplier: "Global Pharma", date: "01.12.2025", filename: "contract_global_pharma.pdf" },
            { id: 2, name: "Litsenziya nusxasi", supplier: "—", date: "10.11.2025", filename: "license.jpg" },
        ],
        categories: [
            { id: 1, name: "Pechatkalar", status: true },
            { id: 2, name: "Iglalar", status: true },
        ],
        brands: [
            { id: 1, name: "Colgate", status: true },
            { id: 2, name: "3M Espe", status: false },
        ],
        products: [
            { id: 1, name: "Kariyes to'ldirgich", price: 150000, minQty: 5, maxQty: 50, brand: "3M Espe", category: "Pechatkalar", unit: "dona", quantity: 15, status: true },
        ],
        units: [
            { id: 1, name: "dona", status: true },
            { id: 2, name: "quti", status: true },
            { id: 3, name: "korobka", status: true },
            { id: 4, name: "M", status: true },
            { id: 5, name: "L", status: true },
            { id: 6, name: "KG", status: true },
            { id: 7, name: "шт", status: true },
        ],
        suppliers: [
            { id: 101, firstName: "Ali", lastName: "Valiyev", phone1: "+998 90 123 45 67", phone2: "", status: true, company: 'Yetkazib beruvchi A' },
            { id: 102, firstName: "Bahodir", lastName: "Ahmadov", phone1: "+998 99 987 65 43", phone2: "+998 97 777 77 77", status: true, company: 'Dental World' },
            { id: 103, firstName: "Dilfuza", lastName: "Karimova", phone1: "+998 88 555 55 55", phone2: "", status: false, company: 'Global Pharma' },
        ],
    },
    advertisements: [
        { id: 1, title: "Yangi yil aksiyasi", content: "Davolash xizmatlariga 15% chegirma.", status: "active", date: "2025-12-01" },
        { id: 2, title: "Vrach qabuli", content: "Bepul diagnostika!", status: "inactive", date: "2025-11-15" },
    ],
    announcements: [
        {
            id: 1,
            image: "https://via.placeholder.com/400x300",
            description: "Yangi xizmatlarimiz haqida ma'lumot! Tishlarni oqartirish xizmati 30% chegirma bilan.",
            paymentStatus: "To'landi",
            createdAt: "2025-12-10",
            expiresAt: "2025-12-17",
            isActive: true
        }
    ],
    payments: [
        { id: 1, patientId: 1, amount: "100 000", type: "Naqd", date: "15.12.2025", comment: "Oldindan to'lov" },
    ],
    orderStatuses: [
        { id: 1, name: "Yangi", color: "gray-500", step: 1 },
        { id: 2, name: "Jarayonda (Ishlash)", color: "blue-500", step: 2 },
        { id: 3, name: "Sifat Tekshiruvi", color: "yellow-500", step: 3 },
        { id: 4, name: "Tayyor/Yetkazib Berildi", color: "green-500", step: 4 },
        { id: 5, name: "Qaytarildi (Defekt)", color: "red-500", step: 5 },
    ],
    courses: [
        {
            id: 1,
            name: "Zamonaviy Endodontiya",
            teacher: "Dr. Alisher Valiyev",
            price: "1 500 000 so'm",
            image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop",
            comments: [
                { id: 1, user: "Bahodir", text: "Juda foydali kurs ekan!", date: "2025-12-10" }
            ]
        },
        {
            id: 2,
            name: "Ortopedik Stomatologika Asoslari",
            teacher: "Prof. Jamshid Karimov",
            price: "2 200 000 so'm",
            image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2074&auto=format&fit=crop",
            comments: []
        }
    ],
    btsOrders: [
        {
            id: 1,
            title: "Yuqori jag'ga keramik kron",
            doctor: "Jahongir Ahmedov (ID:1)",
            patientName: "Abdurahmon Safarov",
            technician: "Mateo Versace (ID:2)",
            dateCreated: "2025-12-14",
            dateDue: "2025-12-20",
            statusId: 2,
            price: 500000,
            paymentStatus: "To'lanmadi",
            comments: "Rangi A2. Qat'iy o'lchamga rioya qiling.",
            materials: [
                { name: "Keramika bloki", qty: 1, unit: "dona" },
                { name: "Sementlash vositasi", qty: 0.5, unit: "ml" },
            ]
        },
        {
            id: 2,
            title: "Pastki jag'da metall kasting",
            doctor: "Abduxalim To'xtayev (ID:4)",
            patientName: "Jonibek Tursunov",
            technician: "Mateo Versace (ID:2)",
            dateCreated: "2025-12-10",
            dateDue: "2025-12-15",
            statusId: 4,
            price: 150000,
            paymentStatus: "To'landi",
            comments: "Oddiy kasting, tezlashtirilgan tartibda.",
            materials: []
        },
    ],
    user: null  // <<< Muhim: Boshida null qilamiz, chunki real user login orqali keladi
};

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [locale, setLocale] = useState(localStorage.getItem('app_locale') || 'uz');
    const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'light');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoaded, setAuthLoaded] = useState(false);

    const [data, setData] = useState(() => {
        // localStorage'dan umumiy ma'lumotlarni o'qish
        const saved = localStorage.getItem('clinic_app_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return {
                    ...initialData,
                    ...parsed,
                    user: parsed.user || null
                };
            } catch (e) {
                console.error('Maʼlumotlar oʻqishda xato:', e);
            }
        }
        return initialData;
    });

    // === YANGI: Sahifa ochilganda user ma'lumotlarini yuklash ===
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const savedPhone = localStorage.getItem('userPhone');
        const savedUser = localStorage.getItem('userData');

        if (accessToken && savedPhone) {
            setIsAuthenticated(true);

            // Agar localStorage'da user ma'lumotlari bo'lsa – kontekstga yuklaymiz
            if (savedUser) {
                try {
                    const userObj = JSON.parse(savedUser);
                    setData(prev => ({ ...prev, user: userObj }));
                } catch (e) {
                    console.error("userData parse xatosi:", e);
                }
            }
        }

        setAuthLoaded(true);
    }, []);

    // === YANGI: loginWithPhone – endi user obyekti qabul qiladi ===
    const loginWithPhone = (phone, userObj = null) => {
        localStorage.setItem('userPhone', phone);
        setIsAuthenticated(true);

        if (userObj) {
            // Kontekstga va localStorage'ga saqlaymiz
            setData(prev => ({ ...prev, user: userObj }));
            localStorage.setItem('userData', JSON.stringify(userObj));
        }
    };

    // === Logout – to'liq tozalash ===
    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('userData'); // <<< Muhim!

        setIsAuthenticated(false);
        setData(prev => ({ ...prev, user: null })); // Kontekstdan ham o'chiramiz
    };

    const t = (key) => translations[locale][key] || key;

    useEffect(() => {
        localStorage.setItem('app_locale', locale);
    }, [locale]);

    useEffect(() => {
        localStorage.setItem('app_theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    useEffect(() => {
        // Umumiy ma'lumotlarni saqlash (user bundan tashqari alohida boshqariladi)
        localStorage.setItem('clinic_app_data', JSON.stringify({
            ...data,
            user: null // user ni bu yerga saqlamaymiz, chunki u alohida localStorage'da
        }));
    }, [data]);

    const switchLocale = (newLocale) => setLocale(newLocale);
    const switchTheme = (newTheme) => setTheme(newTheme);

    // updateData funksiyasi (hozircha o'zgartirmaymiz)
    const updateData = (type, item, action = 'ADD') => {
        setData(prev => {
            return { ...prev };
        });
    };

    if (!authLoaded) {
        return <div className="flex h-screen items-center justify-center">Yuklanmoqda...</div>;
    }

    return (
        <DataContext.Provider value={{
            data,
            updateData,
            locale,
            switchLocale,
            theme,
            switchTheme,
            t,
            isAuthenticated,
            loginWithPhone,
            logout
        }}>
            {children}
        </DataContext.Provider>
    );
};