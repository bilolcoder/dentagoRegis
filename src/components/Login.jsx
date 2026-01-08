import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../context/DataProvider';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import DentaGo from "../assets/dentago.png";

const Login = () => {
    const { loginWithPhone } = useData(); // Agar contextda updateUser funksiyasi bo'lsa, keyinroq qo'shamiz
    const navigate = useNavigate();

    const { handleSubmit, setValue } = useForm();

    const [error, setError] = useState('');
    const [isSmsStep, setIsSmsStep] = useState(false);
    const [smsCode, setSmsCode] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState('+998');
    const [isLoading, setIsLoading] = useState(false);
    const [inputBorderState, setInputBorderState] = useState('default');
    const [phoneNotRegistered, setPhoneNotRegistered] = useState(false);

    const inputsRef = useRef([]);

    // Ro'yxatdan o'tgandan keyin avtomatik SMS bosqichiga o'tish
    useEffect(() => {
        const justRegistered = localStorage.getItem('justRegistered');
        const savedPhone = localStorage.getItem('userPhone');

        if (justRegistered === 'true' && savedPhone) {
            let formattedPhone = savedPhone;
            if (!formattedPhone.startsWith('+')) {
                formattedPhone = '+' + formattedPhone;
            }

            const formatted = formatPhoneNumber(formattedPhone);
            setPhoneNumber(formatted);
            setIsSmsStep(true);
            localStorage.removeItem('justRegistered');
            sendSmsCode();
        }
    }, []);

    const formatPhoneNumber = (value) => {
        let numbers = value.replace(/\D/g, '');
        if (!numbers.startsWith('998')) {
            numbers = '998' + numbers.replace(/^998/, '');
        }

        let formatted = '+998';
        if (numbers.length > 3) formatted += '-' + numbers.substring(3, 5);
        if (numbers.length > 5) formatted += '-' + numbers.substring(5, 8);
        if (numbers.length > 8) formatted += '-' + numbers.substring(8, 10);
        if (numbers.length > 10) formatted += '-' + numbers.substring(10, 12);

        return formatted;
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhoneNumber(formatted);
        setValue('phone', formatted.replace(/\D/g, ''));
    };

    const sendSmsCode = async () => {
        setIsLoading(true);
        setError('');
        setInputBorderState('default');
        setPhoneNotRegistered(false);

        const cleanPhone = phoneNumber.replace(/\D/g, '');
        const fullPhone = `+${cleanPhone}`;

        try {
            const response = await fetch('https://app.dentago.uz/api/auth/app/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: fullPhone }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setCountdown(60);
                setIsSmsStep(true);

                const timer = setInterval(() => {
                    setCountdown(prev => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                if (data.message && (
                    data.message.toLowerCase().includes('not found') ||
                    data.message.includes('mavjud emas') ||
                    data.message.includes('роʻйхатдан ўтмаган') ||
                    data.message.includes('user not found') ||
                    data.message.includes('not registered')
                )) {
                    setPhoneNotRegistered(true);
                    setError('Ushbu telefon raqami tizimda roʻyxatdan oʻtmagan.');
                    localStorage.setItem('pendingRegisterPhone', fullPhone);
                    setIsSmsStep(false);
                } else {
                    setError(data.message || 'SMS joʻnatishda xato yuz berdi');
                    setIsSmsStep(false);
                }
            }
        } catch (err) {
            setError('Internet aloqasi muammosi yoki server xatosi');
            console.error('SMS send error:', err);
            setIsSmsStep(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSmsInputChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;

        const newCodeArr = smsCode.split('');
        newCodeArr[index] = value;
        const newCode = newCodeArr.join('');
        setSmsCode(newCode);
        setInputBorderState('default');

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }

        if (newCode.length === 6) {
            handleSmsConfirm(newCode);
        }
    };

    const handleBackToPhone = () => {
        setIsSmsStep(false);
        setSmsCode('');
        setError('');
        setInputBorderState('default');
        setPhoneNotRegistered(false);
        inputsRef.current.forEach(input => input && (input.value = ''));
    };

    const onSubmit = async () => {
        setError('');
        const cleanPhone = phoneNumber.replace(/\D/g, '');

        if (cleanPhone.length < 12) {
            setError('Iltimos, toʻliq telefon raqamini kiriting');
            return;
        }

        await sendSmsCode();
    };

    const handleSmsConfirm = async (code) => {
        if (code.length !== 6) return;
    
        setIsLoading(true);
        setError('');
        setInputBorderState('default');
    
        const cleanPhone = phoneNumber.replace(/\D/g, '');
        const fullPhone = `+${cleanPhone}`;
    
        try {
            // 1. SMS kodini tasdiqlash
            const verifyResponse = await fetch('https://app.dentago.uz/api/auth/app/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: fullPhone, otp: code }),
            });
    
            const verifyData = await verifyResponse.json();
    
            if (!verifyResponse.ok || !verifyData.success) {
                throw new Error(verifyData.message || 'Kod noto‘g‘ri');
            }
    
            // Tokenlarni saqlash
            localStorage.setItem('accessToken', verifyData.tokens.accessToken);
            localStorage.setItem('refreshToken', verifyData.tokens.refreshToken);
            localStorage.setItem('userPhone', fullPhone);
    
            console.log('✅ Verify muvaffaqiyatli, tokenlar saqlandi');
    
            // 2. /api/auth/me dan foydalanuvchi ma'lumotlarini olish
            let username = fullPhone.replace('+998', '9'); // fallback – telefon raqami
            let userRole = 'OPERATOR';
    
            try {
                const meResponse = await fetch('https://app.dentago.uz/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${verifyData.tokens.accessToken}`
                    }
                });
    
                console.log('meResponse status:', meResponse.status);
    
                if (meResponse.ok) {
                    const meData = await meResponse.json();
                    console.log('meData:', meData);
    
                    if (meData.user && meData.user.username) {
                        username = meData.user.username.trim();
                        userRole = 'OPERATOR'; // backendda "user" bo'lsa ham biz "OPERATOR" qilamiz
                        console.log('✅ Username olindi:', username);
                    } else {
                        console.warn('meData.user yoki username yo‘q');
                    }
                } else {
                    console.warn('meResponse OK emas:', meResponse.status);
                }
            } catch (meErr) {
                console.error('api/auth/me so‘rovida xato:', meErr);
            }
    
            // 3. Header uchun to‘g‘ri formatda saqlash
            const userForApp = {
                name: username,
                role: userRole
            };
    
            localStorage.setItem('userData', JSON.stringify(userForApp));
            console.log('✅ userData saqlandi:', userForApp);
    
            // Contextni yangilash
            loginWithPhone(fullPhone, userForApp);
    
            setInputBorderState('success');
            setTimeout(() => navigate('/dashboard'), 800);
    
        } catch (err) {
            setInputBorderState('error');
            setError(err.message || 'Tasdiqlashda xato yuz berdi');
            console.error('handleSmsConfirm xatosi:', err);
    
            setSmsCode('');
            inputsRef.current.forEach(input => input && (input.value = ''));
            inputsRef.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };
    const getBorderClass = () => {
        if (inputBorderState === 'success') return 'border-green-500 bg-green-50';
        if (inputBorderState === 'error') return 'border-red-500 bg-red-50';
        return 'border-gray-200 focus:border-blue-500';
    };

    // Qolgan UI qismi o'zgarmadi
    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex min-h-screen w-full overflow-hidden font-sans">
                {/* Chap taraf - rasm */}
                <div className="hidden lg:block lg:w-3/5 relative overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop"
                            alt="Dental Office"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-1/3"></div>
                    </div>

                    <div className="absolute inset-0 flex items-center p-12">
                        <div className="max-w-lg">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                                <CheckCircle className="w-4 h-4 text-white" />
                                <span className="text-sm text-white font-medium">Professional Dental Care</span>
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                                <span className="text-blue-300">DentaGo</span> Platformasiga xush kelibsiz
                            </h1>
                            <p className="text-gray-200 text-lg leading-relaxed">
                                Bemorlarga yuqori sifatli xizmat ko‘rsatish uchun mo‘ljallangan zamonaviy stomatologiya klinikasini boshqarish platformamiz bilan tanishing.
                            </p>
                        </div>
                    </div>
                </div>

                {/* O'ng taraf - form */}
                <div className="w-full lg:w-2/5 flex items-center justify-center p-6 md:p-8 lg:p-12">
                    <div className="w-full max-w-md bg-white rounded-2xl p-8 md:p-10">
                        <div className="flex justify-center mb-8">
                            <div className="relative">
                                <img src={DentaGo} alt="DentaGo" className="w-48" />
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {isSmsStep ? 'Tasdiqlash kodi' : 'Xush kelibsiz'}
                            </h2>
                            <p className="text-gray-500">
                                {isSmsStep ? 'Telefon raqamingizga yuborilgan 6 raqamli kodni kiriting' : 'Tizimga kirish uchun telefon raqamingizni kiriting'}
                            </p>
                        </div>

                        {!isSmsStep ? (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Telefon raqami</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            value={phoneNumber}
                                            onChange={handlePhoneChange}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400 text-base"
                                            placeholder="+998-XX-XXX-XX-XX"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                                        <XCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {!phoneNotRegistered && (
                                    <button
                                        type="submit"
                                        disabled={phoneNumber.replace(/\D/g, '').length < 12 || isLoading}
                                        className="w-full py-3.5 bg-[#00C1F3] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Yuborilmoqda...' : 'Tasdiqlash kodini olish'}
                                    </button>
                                )}

                                {phoneNotRegistered && (
                                    <button
                                        type="button"
                                        onClick={() => navigate('/register')}
                                        className="w-full py-3.5 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Ro'yxatdan o'tish
                                    </button>
                                )}
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-2">
                                    <button onClick={handleBackToPhone} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2">
                                        <ArrowLeft className="w-5 h-5" />
                                        <span className="text-sm font-medium">Orqaga</span>
                                    </button>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">{phoneNumber}</p>
                                        <p className="text-xs text-gray-500">Kod yuborildi</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700 text-center">6 raqamli kod</label>
                                    <div className="flex justify-between gap-3">
                                        {[...Array(6)].map((_, i) => (
                                            <input
                                                key={i}
                                                ref={el => inputsRef.current[i] = el}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength="1"
                                                value={smsCode[i] || ''}
                                                onChange={(e) => handleSmsInputChange(i, e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Backspace' && !smsCode[i] && i > 0) {
                                                        inputsRef.current[i - 1]?.focus();
                                                    }
                                                }}
                                                className={`w-full h-16 text-center text-3xl font-bold rounded-xl border-2 ${getBorderClass()} outline-none transition-all duration-300 text-gray-900`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                                        <XCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="text-center pt-2">
                                    {countdown > 0 ? (
                                        <p className="text-sm text-gray-500">Yangi kod: {countdown} s</p>
                                    ) : (
                                        <button onClick={sendSmsCode} className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                                            Kod kelmadimi? <span className="font-semibold">Qayta yuborish</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <p className="text-center text-xs text-gray-400">
                                Davom etish orqali siz platforma shartlariga rozilik bildirasiz
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;