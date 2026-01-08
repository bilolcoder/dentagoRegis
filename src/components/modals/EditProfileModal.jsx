// src/components/modals/EditProfileModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Loader2, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataProvider';

const EditProfileModal = ({ isOpen, onClose }) => {
    const { t } = useData();
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        gender: 'male',
        birthdate: '',
        image: null,
        currentImage: null
    });

    useEffect(() => {
        if (!isOpen) {
            setError('');
            setSuccess('');
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            setError('');

            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('Tizimga qayta kirish kerak');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('https://app.dentago.uz/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Profil yuklanmadi');

                const data = await response.json();

                if (data.user) {
                    setFormData({
                        username: data.user.username || '',
                        phone: data.user.phone || '',
                        gender: data.user.gender || 'male',
                        birthdate: data.user.birthdate || '',
                        image: null,
                        currentImage: data.user.image || null
                    });
                }
            } catch (err) {
                setError('Maʼlumotlar yuklanmadi');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [isOpen]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setError('Rasm hajmi 5MB dan oshmasligi kerak');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, image: reader.result }));
            setSuccess('Rasm tanlandi');
            setError('');
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username.trim()) {
            setError('Ism familiya kiritilishi shart');
            return;
        }

        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('Token yo‘q');

            const payload = {
                username: formData.username.trim(),
                gender: formData.gender,
                birthdate: formData.birthdate || null
            };

            if (formData.image) {
                payload.image = formData.image;
            }

            // === TO'G'RI METHOD: PATCH ===
            const response = await fetch('https://app.dentago.uz/api/auth/profile', {
                method: 'PATCH',  // <--- Bu joyni PATCH ga o‘zgartirdik!
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Backend xatosi');
            }

            const result = await response.json();
            console.log('Backend muvaffaqiyatli yangilandi:', result);

            // Frontendda ham yangilash
            const updatedUser = {
                name: formData.username.trim(),
                role: 'OPERATOR'
            };
            localStorage.setItem('userData', JSON.stringify(updatedUser));

            setSuccess('Profil muvaffaqiyatli yangilandi!');

            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 1500);

        } catch (err) {
            setError('Saqlashda xato: ' + err.message);
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg h-[90vh] max-h-[800px] flex flex-col">

                {/* Header */}
                <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                        Profilni tahrirlash
                    </h3>
                    <button onClick={onClose} className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Scroll kontent */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <Loader2 className="w-12 h-12 animate-spin text-[#00BCE4]" />
                            <p className="mt-4 text-lg text-gray-500">Yuklanmoqda...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Avatar */}
                            <div className="flex flex-col items-center mb-8">
                                <div className="relative">
                                    <div className="w-36 h-36 rounded-full overflow-hidden bg-gradient-to-br from-[#00BCE4]/20 to-blue-200 border-8 border-white dark:border-gray-800 shadow-2xl">
                                        {formData.image ? (
                                            <img src={formData.image} alt="Yangi" className="w-full h-full object-cover" />
                                        ) : formData.currentImage ? (
                                            <img src={formData.currentImage} alt="Joriy" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-6xl font-black text-[#00BCE4]">
                                                {formData.username.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-3 right-3 p-4 bg-[#00BCE4] text-white rounded-full shadow-2xl hover:scale-110 transition-all"
                                    >
                                        <Upload className="w-6 h-6" />
                                    </button>
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                <p className="text-sm text-gray-500 mt-3">Yangi rasm yuklash uchun bosing</p>
                            </div>

                            {/* Ism Familiya */}
                            <div>
                                <label className="block text-lg font-bold text-gray-800 dark:text-white mb-3">
                                    Ism Familiya *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                    placeholder="Qobiljon Solijanov"
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:border-[#00BCE4] focus:ring-4 focus:ring-[#00BCE4]/20 outline-none text-lg font-medium transition-all"
                                />
                            </div>

                            {/* Telefon */}
                            <div>
                                <label className="block text-lg font-bold text-gray-800 dark:text-white mb-3">
                                    Telefon raqami
                                </label>
                                <div className="w-full px-6 py-4 bg-gray-100 dark:bg-gray-900 rounded-2xl text-lg text-gray-600 font-medium">
                                    {formData.phone}
                                </div>
                            </div>

                            {/* Jins */}
                            <div>
                                <label className="block text-lg font-bold text-gray-800 dark:text-white mb-3">
                                    Jins
                                </label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:border-[#00BCE4] focus:ring-4 focus:ring-[#00BCE4]/20 outline-none text-lg font-medium"
                                >
                                    <option value="male">Erkak</option>
                                    <option value="female">Ayol</option>
                                </select>
                            </div>

                            {/* Tug'ilgan sana */}
                            <div>
                                <label className="block text-lg font-bold text-gray-800 dark:text-white mb-3">
                                    Tug'ilgan sana
                                </label>
                                <input
                                    type="date"
                                    value={formData.birthdate}
                                    onChange={(e) => setFormData(prev => ({ ...prev, birthdate: e.target.value }))}
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:border-[#00BCE4] focus:ring-4 focus:ring-[#00BCE4]/20 outline-none text-lg font-medium"
                                />
                            </div>

                            {/* Xabarlar */}
                            {error && (
                                <div className="p-5 bg-red-100 dark:bg-red-900/40 border-2 border-red-300 dark:border-red-700 rounded-2xl flex items-center gap-3 text-red-700 dark:text-red-300 font-medium">
                                    <X className="w-6 h-6" />
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="p-5 bg-green-100 dark:bg-green-900/40 border-2 border-green-300 dark:border-green-700 rounded-2xl flex items-center gap-3 text-green-700 dark:text-green-300 font-medium">
                                    <CheckCircle className="w-6 h-6" />
                                    {success}
                                </div>
                            )}
                        </form>
                    )}
                </div>

                {/* Tugmalar – doim pastda */}
                <div className="px-8 py-6 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
                    <div className="flex gap-5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="flex-1 py-5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-xl"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={saving}
                            className="flex-1 py-5 rounded-2xl bg-[#00BCE4] hover:bg-[#0099c7] text-white font-bold shadow-2xl hover:shadow-[#00BCE4]/50 transition-all text-xl flex items-center justify-center gap-3 disabled:opacity-70"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Saqlanmoqda...
                                </>
                            ) : (
                                'Saqlash'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;