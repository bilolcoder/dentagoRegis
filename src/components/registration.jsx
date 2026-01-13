import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../context/DataProvider';
import { useNavigate } from 'react-router-dom';
import {
    User, Calendar, Phone, Upload, ArrowLeft, XCircle,
    ChevronDown, BriefcaseMedical, Stethoscope,
    Wrench, Award, MapPin, Navigation, Camera
} from 'lucide-react';
import DentaGo from "../assets/dentago.png";

const uzbekistanCities = [
    // =========================
    // QORAQALPOG'ISTON
    // =========================
    {
        _id: "6964cadeb2a92667023e30c1",
        label: "Nukus",
        value: "nukus",
        region: "Qoraqalpog'iston Respublikasi"
    },
    {
        _id: "6964cadeb2a92667023e30c2",
        label: "Xo'jayli",
        value: "xojayli",
        region: "Qoraqalpog'iston Respublikasi"
    },
    {
        _id: "6964cadeb2a92667023e30c3",
        label: "To'rtko'l",
        value: "tortkol",
        region: "Qoraqalpog'iston Respublikasi"
    },
    {
        _id: "6964cadeb2a92667023e30c4",
        label: "Beruniy",
        value: "beruniy",
        region: "Qoraqalpog'iston Respublikasi"
    },
    {
        _id: "6964cadeb2a92667023e30c5",
        label: "Qo'ng'irot",
        value: "qongirot",
        region: "Qoraqalpog'iston Respublikasi"
    },

    // =========================
    // TOSHKENT SHAHAR
    // =========================
    {
        _id: "6964cadeb2a92667023e30c6",
        label: "Toshkent",
        value: "toshkent",
        region: "Toshkent shahri"
    },

    // =========================
    // TOSHKENT VILOYATI
    // =========================
    {
        _id: "6964cadeb2a92667023e30c7",
        label: "Chirchiq",
        value: "chirchiq",
        region: "Toshkent viloyati"
    },
    {
        _id: "6964cadeb2a92667023e30c8",
        label: "Angren",
        value: "angren",
        region: "Toshkent viloyati"
    },
    {
        _id: "6964cadeb2a92667023e30c9",
        label: "Olmaliq",
        value: "olmaliq",
        region: "Toshkent viloyati"
    },
    {
        _id: "6964cadeb2a92667023e30ca",
        label: "Bekobod",
        value: "bekobod",
        region: "Toshkent viloyati"
    },
    {
        _id: "6964cadeb2a92667023e30cb",
        label: "Yangiyo'l",
        value: "yangiyol",
        region: "Toshkent viloyati"
    },

    // =========================
    // SAMARQAND
    // =========================
    {
        _id: "6964cadeb2a92667023e30cc",
        label: "Samarqand",
        value: "samarqand",
        region: "Samarqand viloyati"
    },
    {
        _id: "6964cadeb2a92667023e30cd",
        label: "Kattaqo'rg'on",
        value: "kattaqorgon",
        region: "Samarqand viloyati"
    },
    {
        _id: "6964cadeb2a92667023e30ce",
        label: "Urgut",
        value: "urgut",
        region: "Samarqand viloyati"
    },

    // =========================
    // BUXORO
    // =========================
    {
        _id: "6964cadeb2a92667023e30cf",
        label: "Buxoro",
        value: "buxoro",
        region: "Buxoro viloyati"
    },
    {
        _id: "6964cadeb2a92667023e30d0",
        label: "G'ijduvon",
        value: "gijduvon",
        region: "Buxoro viloyati"
    },
    {
        _id: "6964cadeb2a92667023e30d1",
        label: "Kogon",
        value: "kogon",
        region: "Buxoro viloyati"
    },

    // =========================
    // FARG'ONA
    // =========================
    {
        _id: "6964cadeb2a92667023e30d2",
        label: "Farg'ona",
        value: "fargona",
        region: "Farg'ona viloyati"
    },
    {
        _id: "6964cadeb2a92667023e30d3",
        label: "Marg'ilon",
        value: "margilon",
        region: "Farg'ona viloyati"
    },
    {
        _id: "6964cadeb2a92667023e30d4",
        label: "Qo'qon",
        value: "qoqon",
        region: "Farg'ona viloyati"
    },

    // =========================
    // ANDIJON
    // =========================
    {
        _id: "6964cadeb2a92667023e30d5",
        label: "Andijon",
        value: "andijon",
        region: "Andijon viloyati"
    },
    {
        _id: "6964cadeb2a92667023e30d6",
        label: "Asaka",
        value: "asaka",
        region: "Andijon viloyati"
    },

    // =========================
    // NAMANGAN
    // =========================
    {
        _id: "6964cadeb2a92667023e30d7",
        label: "Namangan",
        value: "namangan",
        region: "Namangan viloyati"
    },
    {
        _id: "6964cadeb2a92667023e30d8",
        label: "Chust",
        value: "chust",
        region: "Namangan viloyati"
    },

    // =========================
    // QASHQADARYO
    // =========================
    {
        _id: "6964cadeb2a92667023e30d9",
        label: "Qarshi",
        value: "qarshi",
        region: "Qashqadaryo viloyati"
    },
    {
        _id: "6964cadeb2a92667023e30da",
        label: "Shahrisabz",
        value: "shahrisabz",
        region: "Qashqadaryo viloyati"
    },

    // =========================
    // SURXONDARYO
    // =========================
    {
        _id: "6964cadeb2a92667023e30db",
        label: "Termiz",
        value: "termiz",
        region: "Surxondaryo viloyati"
    },

    // =========================
    // XORAZM
    // =========================
    {
        _id: "6964cadeb2a92667023e30dc",
        label: "Urganch",
        value: "urganch",
        region: "Xorazm viloyati"
    },
    {
        _id: "6964cadeb2a92667023e30dd",
        label: "Xiva",
        value: "xiva",
        region: "Xorazm viloyati"
    }
];

const Registration = () => {
    const { loginWithPhone } = useData();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();

    const [phoneNumber, setPhoneNumber] = useState('+998');
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [gender, setGender] = useState('male');
    const [userType, setUserType] = useState('user');
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSmsStep, setIsSmsStep] = useState(false);
    const [smsCode, setSmsCode] = useState("");
    const [countdown, setCountdown] = useState(0);
    const [inputBorderState, setInputBorderState] = useState('default');
    const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false);
    const [showLocationPermission, setShowLocationPermission] = useState(false);
    const [locationStatus, setLocationStatus] = useState('pending');
    const [userLocation, setUserLocation] = useState(null);
    const [isGeolocating, setIsGeolocating] = useState(false);
    const [isSmsSent, setIsSmsSent] = useState(false);
    const [canResendSms, setCanResendSms] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    // Yangi state'lar - viloyat va tuman uchun
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedCityId, setSelectedCityId] = useState(""); // ID ni saqlash uchun
    const [selectedCityName, setSelectedCityName] = useState(""); // Nomini ham saqlash

    const inputsRef = useRef([]);
    const dropdownRef = useRef(null);
    const phoneInputRef = useRef(null);
    const formRef = useRef(null);

    // Barcha unikallik viloyatlarni olish
    const regions = [...new Set(uzbekistanCities.map(city => city.region))].sort();

    // Tanlangan viloyatga qarab tuman/shaharlar
    const filteredCities = uzbekistanCities.filter(
        city => city.region === selectedRegion
    );

    // GPS so'rovni 2 soniyadan keyin ko'rsatish
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isSmsStep && locationStatus === 'pending') {
                setShowLocationPermission(true);
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, [isSmsStep, locationStatus]);

    // Countdown timer
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setCanResendSms(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    // GPS ni olish funksiyasi
    const getGeolocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus('denied');
            setError('Brauzeringiz geolokatsiyani qo\'llab-quvvatlamaydi');
            return;
        }

        setIsGeolocating(true);
        setError("");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude });
                setLocationStatus('granted');
                setShowLocationPermission(false);
                setIsGeolocating(false);

                // Reverse geocoding
                fetchLocationName(latitude, longitude);
            },
            (error) => {
                console.error('Geolocation error:', error);
                setLocationStatus('denied');
                setIsGeolocating(false);
                if (error.code === 1) {
                    setError('Lokatsiya ruxsati berilmadi. Iltimos, brauzer sozlamalaridan ruxsat bering.');
                } else {
                    setError('Lokatsiyani aniqlashda xato yuz berdi');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    // Location nomini olish
    const fetchLocationName = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            if (data.display_name) {
                setUserLocation(prev => ({
                    ...prev,
                    address: data.display_name.split(',').slice(0, 3).join(', ')
                }));
                setValue('location', data.display_name.split(',').slice(0, 3).join(', '));
            }
        } catch (err) {
            console.log('Location name fetch error:', err);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowUserTypeDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userTypeOptions = [
        { value: 'user', label: 'Bemor', icon: BriefcaseMedical },
        { value: 'doctor', label: 'Stomatolog', icon: Stethoscope }, // "Stamatolog" emas "Stomatolog"
        { value: 'master', label: 'Usta', icon: Wrench },
        { value: 'technician', label: 'Zub-texnik', icon: Award }
    ];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Telefon raqam formatlash
    const formatPhoneNumber = (value) => {
        let numbers = value.replace(/\D/g, "");

        if (numbers.startsWith('998')) {
            numbers = numbers.substring(3);
        }

        numbers = numbers.substring(0, 9);

        let formatted = '+998';
        if (numbers.length > 0) formatted += ' (' + numbers.substring(0, 2);
        if (numbers.length > 2) formatted += ') ' + numbers.substring(2, 5);
        if (numbers.length > 5) formatted += '-' + numbers.substring(5, 7);
        if (numbers.length > 7) formatted += '-' + numbers.substring(7, 9);

        return formatted;
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhoneNumber(formatted);
    };

    // Telefon raqamni faqat raqamlarga aylantirish
    const getCleanPhoneNumber = () => {
        const clean = phoneNumber.replace(/\D/g, "");
        if (clean.length === 9) {
            return '998' + clean;
        }
        return clean;
    };

    const formatBirthDate = (dateString) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
    };

    const sendSmsForRegistration = async (isResend = false) => {
        // SMS allaqachon yuborilgan va countdown davom etayotgan bo'lsa, to'xtatish
        if (isSmsSent && !isResend && !canResendSms) {
            setError('SMS allaqachon yuborilgan. Iltimos kuting.');
            return;
        }

        setIsLoading(true);
        setError("");
        const cleanPhone = getCleanPhoneNumber();
        const fullPhone = `+${cleanPhone}`;

        try {
            const response = await fetch('https://app.dentago.uz/api/auth/app/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: fullPhone }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                // SMS muvaffaqiyatli yuborilganda
                setIsSmsSent(true);
                setCanResendSms(false);
                setCountdown(60);

                // Agar SMS qayta yuborilayotgan bo'lsa, sahifani o'zgartirmaymiz
                if (!isResend) {
                    setIsSmsStep(true);
                }

                // Countdown timer allaqachon useEffect orqali ishlaydi
            } else {
                setError(data.message || 'SMS joʻnatishda xato yuz berdi');
            }
        } catch (err) {
            setError('Internet aloqasi muammosi');
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitPersonalData = async (data) => {
        // Form allaqachon yuborilmoqda bo'lsa, to'xtatish
        if (isSubmitting || registrationSuccess) {
            return;
        }

        setError("");
        setIsSubmitting(true);
        setIsLoading(true);

        const cleanPhone = getCleanPhoneNumber();

        if (cleanPhone.length !== 12) {
            setError('Toʻliq telefon raqamini kiriting (+998 XX XXX-XX-XX)');
            setIsLoading(false);
            setIsSubmitting(false);
            return;
        }

        if (!selectedRegion || !selectedCityId) {
            setError('Viloyat va tuman/shaharni tanlang');
            setIsLoading(false);
            setIsSubmitting(false);
            return;
        }

        // Tanlangan shahar ma'lumotlarini olish
        const selectedCityData = uzbekistanCities.find(city => city._id === selectedCityId);

        if (!selectedCityData) {
            setError('Tanlangan shahar topilmadi. Iltimos, qayta tanlang.');
            setIsLoading(false);
            setIsSubmitting(false);
            return;
        }

        const fullPhone = `+${cleanPhone}`;

        // KONSOLGA JO'NATILAYOTGAN MA'LUMOTLARNI CHIQARAMIZ
        console.log('=== FORM MA\'LUMOTLARI ===');
        console.log('Ism:', data.firstName);
        console.log('Familiya:', data.lastName);
        console.log('Telefon:', fullPhone);
        console.log('Tug\'ilgan sana:', data.birthDate);
        console.log('Formatlangan sana:', formatBirthDate(data.birthDate));
        console.log('Jins:', gender);
        console.log('Foydalanuvchi turi:', userType);
        console.log('Viloyat:', selectedRegion);
        console.log('Shahar ID:', selectedCityId);
        console.log('Shahar nomi:', selectedCityData.label);
        console.log('Manzil:', data.location);
        console.log('GPS:', userLocation);
        console.log('========================');

        // Yangi payload - faqat city ga ID ni jo'natamiz
        const payload = {
            username: `${data.firstName.trim()} ${data.lastName.trim()}`,
            birthdate: formatBirthDate(data.birthDate),
            gender: gender,
            phone: fullPhone,
            role: userType,
            userType: userType,
            serviceId: true,
            city: selectedCityId, // ✅ Faqat ID ni jo'natamiz (string)
            region: selectedRegion,
            location: userLocation ? {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                address: data.location || ""
            } : null
        };

        console.log('=== PAYLOAD ===', payload);

        try {
            const response = await fetch('https://app.dentago.uz/api/auth/app/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            console.log('=== SERVER RESPONSE ===');
            console.log('Status:', response.status);

            const result = await response.json();
            console.log('Result:', result);

            if (response.ok && result.success) {
                // Registration muvaffaqiyatli bo'lganda
                setRegistrationSuccess(true);

                // SMS server tomonidan avtomatik yuboriladi
                setIsSmsSent(true);
                setCanResendSms(false);
                setCountdown(60);
                setIsSmsStep(true);

                console.log('✅ Registration muvaffaqiyatli!');
            } else {
                setError(result.message || 'Roʻyxatdan oʻtishda xato');
            }
        } catch (err) {
            console.error('❌ Server xatosi:', err);
            setError('Server bilan aloqa xatosi');
        } finally {
            setIsLoading(false);
            setIsSubmitting(false);
        }
    };

    const handleSmsConfirm = async (code) => {
        if (code.length !== 6) return;
        setIsLoading(true);
        const cleanPhone = getCleanPhoneNumber();
        const fullPhone = `+${cleanPhone}`;

        try {
            const response = await fetch('https://app.dentago.uz/api/auth/app/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: fullPhone, otp: code }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setInputBorderState('success');
                localStorage.setItem('accessToken', data.tokens.accessToken);
                localStorage.setItem('userLocation', JSON.stringify(userLocation));
                localStorage.setItem('userRole', userType);
                loginWithPhone(fullPhone);
                setTimeout(() => navigate('/dashboard'), 800);
            }  else {
                setInputBorderState('error');
                setError(data.message || 'Kod notoʻgʻri');
            }
        } catch (err) {
            setInputBorderState('error');
            setError('Tasdiqlashda xato');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSmsInputChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        const newCodeArr = smsCode.split("");
        newCodeArr[index] = value;
        const newCode = newCodeArr.join("");
        setSmsCode(newCode);
        if (value && index < 5) inputsRef.current[index + 1]?.focus();
        if (newCode.length === 6) handleSmsConfirm(newCode);
    };

    // SMS sahifasidan orqaga qaytish
    const handleBackFromSms = () => {
        setIsSmsStep(false);
        setSmsCode("");
        setInputBorderState('default');
        setRegistrationSuccess(false);
        setCanResendSms(true);
    };

    const getBorderClass = () => {
        if (inputBorderState === 'success') return 'border-green-500 bg-green-50';
        if (inputBorderState === 'error') return 'border-red-500 bg-red-50';
        return 'border-gray-200 focus:border-blue-500';
    };

    const selectedUserType = userTypeOptions.find(opt => opt.value === userType);

    // Shahar tanlanganda
    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setSelectedCityId(cityId);

        // Tanlangan shahar ma'lumotlarini olish
        const selectedCity = uzbekistanCities.find(city => city._id === cityId);
        if (selectedCity) {
            setSelectedCityName(selectedCity.label);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full font-sans bg-gray-900">
            {/* Background */}
            <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop"
                alt="Dental Office"
                className="fixed inset-0 w-full h-full object-cover"
            />
            <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"></div>

            {/* GPS Permission Modal */}
            {showLocationPermission && !isSmsStep && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <MapPin className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Lokatsiyangizni ulash
                            </h3>
                            <p className="text-gray-600 text-sm">
                                DentaGo sizga eng yaqin stomatologiya klinikalarini
                                topish uchun lokatsiyangizga ruxsat kerak.
                                Bu ma'lumot maxfiy saqlanadi.
                            </p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Navigation className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Eng yaqin klinikalarni topish</p>
                                    <p className="text-xs text-gray-500">Manzilingizga yaqin stomatologiyalar</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Tez yordam olish</p>
                                    <p className="text-xs text-gray-500">Zarur bo'lganda tez yordam jo'natish</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowLocationPermission(false);
                                    setLocationStatus('denied');
                                }}
                                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Keyinroq
                            </button>
                            <button
                                onClick={getGeolocation}
                                disabled={isGeolocating}
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50"
                            >
                                {isGeolocating ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Aniqlanmoqda...</span>
                                    </div>
                                ) : (
                                    'Ruxsat berish'
                                )}
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            Siz har qanday vaqt brauzer sozlamalaridan ruxsatni o'zgartirishingiz mumkin
                        </p>
                    </div>
                </div>
            )}

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-md">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Main Content */}
            <div className="relative w-full h-full overflow-y-auto p-4 md:p-6">
                <div className="min-h-full w-full flex items-center justify-center py-10">

                    {/* Form Card */}
                    <div className={`w-full ${isSmsStep ? 'max-w-md' : 'max-w-4xl'} bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-2xl`}>

                        {/* Header */}
                        <div className="p-5 md:p-8 border-b border-gray-100">
                            <div className="text-center">
                                <img src={DentaGo} alt="DentaGo" className="w-24 md:w-28 mx-auto mb-3" />
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                                    {isSmsStep ? 'Tasdiqlash' : 'Ro\'yxatdan o\'tish'}
                                </h2>
                                <p className="text-gray-500 text-xs md:text-sm mt-1">
                                    {isSmsStep ? 'Telefoningizga yuborilgan 6 xonali kodni kiriting' : 'DentaGo olamiga xush kelibsiz!'}
                                </p>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="p-5 md:p-8">
                            {!isSmsStep ? (
                                <form onSubmit={handleSubmit(onSubmitPersonalData)} className="space-y-6" ref={formRef}>
                                    {/* Profile Image */}
                                    <div className="flex flex-col items-center mb-6">
                                        <div className="relative group">
                                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-blue-100 flex items-center justify-center overflow-hidden bg-white shadow-lg">
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center">
                                                        <User className="w-10 h-10 md:w-12 md:h-12 text-gray-300" />
                                                        <span className="text-xs text-gray-400 mt-2">Rasm yuklash</span>
                                                    </div>
                                                )}
                                            </div>
                                            <label htmlFor="image" className="absolute bottom-1 right-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full p-2 cursor-pointer shadow-xl hover:shadow-2xl transition-all hover:scale-110">
                                                <Camera className="w-4 h-4 md:w-5 md:h-5" />
                                            </label>
                                            <input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Profil rasmini yuklang (ixtiyoriy)</p>
                                    </div>

                                    {/* GPS Status Indicator */}
                                    {locationStatus !== 'pending' && (
                                        <div className={`flex items-center justify-between p-3 rounded-xl mb-4 ${locationStatus === 'granted' ? 'bg-green-50 border border-green-200' : 'bg-gray-100 border border-gray-200'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${locationStatus === 'granted' ? 'bg-green-100' : 'bg-gray-200'}`}>
                                                    {locationStatus === 'granted' ? (
                                                        <MapPin className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <MapPin className="w-4 h-4 text-gray-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {locationStatus === 'granted' ? 'Lokatsiya ulangan' : 'Lokatsiya o\'chirilgan'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {locationStatus === 'granted'
                                                            ? userLocation?.address || 'Joylashuvingiz aniqlangan'
                                                            : 'Lokatsiya ruxsati berilmagan'}
                                                    </p>
                                                </div>
                                            </div>
                                            {locationStatus === 'denied' && (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowLocationPermission(true)}
                                                    className="text-xs font-medium text-blue-600 hover:text-blue-700"
                                                >
                                                    Yoqish
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Form Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {/* Ism */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500">Ism *</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    {...register('firstName', {
                                                        required: 'Ismni kiriting',
                                                        minLength: { value: 2, message: 'Ism kamida 2 harfdan iborat bo\'lishi kerak' }
                                                    })}
                                                    className="w-full pl-10 text-black pr-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all text-sm"
                                                    placeholder="Masalan: Ali"
                                                />
                                            </div>
                                            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                                        </div>

                                        {/* Familiya */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500">Familiya *</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    {...register('lastName', {
                                                        required: 'Familiyani kiriting',
                                                        minLength: { value: 2, message: 'Familiya kamida 2 harfdan iborat bo\'lishi kerak' }
                                                    })}
                                                    className="w-full pl-10 text-black pr-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all text-sm"
                                                    placeholder="Masalan: Valiyev"
                                                />
                                            </div>
                                            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                                        </div>

                                        {/* Telefon raqami */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500">Telefon raqami *</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    ref={phoneInputRef}
                                                    type="tel"
                                                    value={phoneNumber}
                                                    onChange={handlePhoneChange}
                                                    className="w-full pl-10 text-black pr-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all text-sm"
                                                    placeholder="+998 (XX) XXX-XX-XX"
                                                    inputMode="tel"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">+998 bilan boshlansin</p>
                                        </div>

                                        {/* Viloyat */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500">Viloyat *</label>
                                            <select
                                                value={selectedRegion}
                                                onChange={(e) => {
                                                    setSelectedRegion(e.target.value);
                                                    setSelectedCityId(""); // viloyat o'zgarganda tuman tozalanadi
                                                    setSelectedCityName("");
                                                }}
                                                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm"
                                                required
                                            >
                                                <option value="">Viloyatni tanlang</option>
                                                {regions.map(region => (
                                                    <option key={region} value={region}>
                                                        {region}
                                                    </option>
                                                ))}
                                            </select>
                                            {!selectedRegion && (
                                                <p className="text-red-500 text-xs mt-1">Viloyatni tanlang</p>
                                            )}
                                        </div>

                                        {/* Tuman/Shahar - ID ni saqlash uchun */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500">Tuman/Shahar *</label>
                                            <select
                                                value={selectedCityId}
                                                onChange={handleCityChange}
                                                disabled={!selectedRegion}
                                                className={`w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm ${!selectedRegion ? 'opacity-60 cursor-not-allowed' : ""}`}
                                                required
                                            >
                                                <option value="">Tuman/Shaharni tanlang</option>
                                                {filteredCities.map(city => (
                                                    <option key={city._id} value={city._id}>
                                                        {city.label}
                                                        {selectedCityId === city._id && ` (ID: ${city._id})`}
                                                    </option>
                                                ))}
                                            </select>
                                            {!selectedCityId && selectedRegion && (
                                                <p className="text-red-500 text-xs mt-1">Tuman/Shaharni tanlang</p>
                                            )}
                                            {selectedCityId && (
                                                <p className="text-xs text-green-600 mt-1">
                                                    Tanlangan: {selectedCityName} (ID: {selectedCityId})
                                                </p>
                                            )}
                                        </div>

                                        {/* User Type */}
                                        <div className="space-y-1" ref={dropdownRef}>
                                            <label className="text-xs font-semibold text-gray-500">Foydalanuvchi turi *</label>
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowUserTypeDropdown(!showUserTypeDropdown)}
                                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl flex items-center justify-between hover:border-blue-400 transition-all text-sm"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {selectedUserType && <selectedUserType.icon className="w-4 h-4 text-blue-500" />}
                                                        <span className="text-gray-700">{selectedUserType?.label}</span>
                                                    </div>
                                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserTypeDropdown ? 'rotate-180' : ""}`} />
                                                </button>
                                                {showUserTypeDropdown && (
                                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                                                        {userTypeOptions.map((opt) => (
                                                            <button
                                                                key={opt.value}
                                                                type="button"
                                                                onClick={() => { setUserType(opt.value); setShowUserTypeDropdown(false); }}
                                                                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 text-sm transition-colors ${userType === opt.value ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600'}`}
                                                            >
                                                                <opt.icon className="w-4 h-4" />
                                                                <span>{opt.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Jins */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500">Jins *</label>
                                            <div className="flex bg-gray-100 p-1 rounded-xl">
                                                <button
                                                    type="button"
                                                    onClick={() => setGender('male')}
                                                    className={`flex-1 py-2.5 flex items-center justify-center rounded-lg text-sm transition-all ${gender === 'male' ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
                                                >
                                                    Erkak
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setGender('female')}
                                                    className={`flex-1 py-2.5 flex items-center justify-center rounded-lg text-sm transition-all ${gender === 'female' ? 'bg-white shadow-sm text-pink-500 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
                                                >
                                                    Ayol
                                                </button>
                                            </div>
                                        </div>

                                        {/* Tug'ilgan sana */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500">Tug'ilgan sana *</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    {...register('birthDate', {
                                                        required: 'Sanani tanlang',
                                                        validate: value => {
                                                            const selectedDate = new Date(value);
                                                            const today = new Date();
                                                            const minDate = new Date();
                                                            minDate.setFullYear(today.getFullYear() - 120);
                                                            if (selectedDate > today) return 'Kelajakdagi sana kiritilmaydi';
                                                            if (selectedDate < minDate) return 'Sana noto\'g\'ri';
                                                            return true;
                                                        }
                                                    })}
                                                    type="date"
                                                    max={new Date().toISOString().split('T')[0]}
                                                    className="w-full text-black pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm"
                                                />
                                            </div>
                                            {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate.message}</p>}
                                        </div>

                                        {/* Manzil */}
                                        <div className="space-y-1 sm:col-span-2 lg:col-span-3">
                                            <label className="text-xs font-semibold text-gray-500">Manzil {userLocation?.address && '(GPS orqali aniqlangan)'}</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    {...register('location')}
                                                    type="text"
                                                    defaultValue={userLocation?.address || ""}
                                                    className="w-full text-black pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all text-sm"
                                                    placeholder="Manzilingizni kiriting yoki GPS orqali aniqlang"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowLocationPermission(true)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700"
                                                >
                                                    <Navigation className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-xs text-gray-500">
                                                    {locationStatus === 'granted'
                                                        ? '✅ Lokatsiya ulangan'
                                                        : locationStatus === 'denied'
                                                            ? '❌ GPS o\'chirilgan'
                                                            : '📍 GPS ni yoqing'}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={getGeolocation}
                                                    disabled={isGeolocating}
                                                    className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
                                                >
                                                    {isGeolocating ? 'Aniqlanmoqda...' : 'GPS orqali aniqlash'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Xato xabari */}
                                    {error && (
                                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 mt-4">
                                            <XCircle className="w-4 h-4 flex-shrink-0" />
                                            <span className="text-sm font-medium">{error}</span>
                                        </div>
                                    )}

                                    {/* Submit tugmasi */}
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isLoading || isSubmitting || registrationSuccess}
                                            className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading || isSubmitting ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Yuklanmoqda...</span>
                                                </div>
                                            ) : registrationSuccess ? (
                                                'SMS yuborildi...'
                                            ) : (
                                                'Roʻyxatdan oʻtish'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                /* SMS SECTION */
                                <div className="space-y-6">
                                    {/* Orqaga tugmasi */}
                                    <button
                                        onClick={handleBackFromSms}
                                        className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors text-sm font-medium"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Ma'lumotlarni o'zgartirish
                                    </button>

                                    {/* Telefon raqami ko'rsatish */}
                                    <div className="text-center mb-6">
                                        <p className="text-gray-500 text-sm mb-1">Tasdiqlash kodi yuborildi</p>
                                        <p className="text-gray-800 font-bold text-lg">{phoneNumber}</p>
                                    </div>

                                    {/* SMS inputlari */}
                                    <div className="space-y-4">
                                        <p className="text-center text-gray-600 text-sm">6 xonali kodni kiriting</p>
                                        <div className="flex justify-center gap-2 md:gap-3">
                                            {[...Array(6)].map((_, i) => (
                                                <input
                                                    key={i}
                                                    ref={el => inputsRef.current[i] = el}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength="1"
                                                    value={smsCode[i] || ""}
                                                    onChange={(e) => handleSmsInputChange(i, e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Backspace' && !smsCode[i] && i > 0) inputsRef.current[i - 1]?.focus();
                                                    }}
                                                    className={`w-10 h-12 md:w-12 md:h-14 text-center text-xl md:text-2xl font-bold rounded-xl border-2 ${getBorderClass()} transition-all outline-none shadow-sm`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Xato xabari */}
                                    {error && (
                                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                                            <XCircle className="w-4 h-4" />
                                            <span className="text-sm font-medium">{error}</span>
                                        </div>
                                    )}

                                    {/* Qayta yuborish */}
                                    <div className="text-center pt-4">
                                        {countdown > 0 ? (
                                            <p className="text-gray-500 text-sm">
                                                Yangi kodni so'rash mumkin: <span className="text-blue-600 font-bold">{countdown}s</span>
                                            </p>
                                        ) : (
                                            <button
                                                onClick={() => sendSmsForRegistration(true)}
                                                disabled={isLoading}
                                                className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors disabled:opacity-50"
                                            >
                                                Kod kelmadimi? Qayta yuborish
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-5 md:p-8 border-t border-gray-100 rounded-b-2xl bg-gray-50">
                            <p className="text-center text-xs text-gray-500">
                                Ro'yxatdan o'tish orqali siz bizning{' '}
                                <a href="#" className="text-blue-600 hover:text-blue-800 underline">shartlar</a>
                                {' '}va{' '}
                                <a href="#" className="text-blue-600 hover:text-blue-800 underline">maxfiylik siyosati</a>{' '}
                                ga rozilik bildirasiz
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;
