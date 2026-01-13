// src/components/ProfileContent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataProvider';
import { Edit2, ArrowLeft, Loader2, Upload, CheckCircle, X } from 'lucide-react';

const ProfileContent = () => {
  const { t } = useData();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    company: '',
    birthdate: '',
    gender: 'male',
    image: null,
    currentImage: null
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Kirish tokeni topilmadi');
        setLoading(false);
        return;
      }

      try {
        console.log('Token:', token.substring(0, 20) + '...'); // Debug uchun

        const response = await fetch('https://app.dentago.uz/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          credentials: 'include' // Cookie lar uchun kerak bo'lishi mumkin
        });

        console.log('Response status:', response.status); // Debug

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server error:', errorText);
          throw new Error(`Serverdan javob kelmadi: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API response data:', data); // Debug uchun

        if (data.user) {
          const fullName = data.user.username || data.user.full_name || 'Foydalanuvchi';
          const nameParts = fullName.trim().split(' ');
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(' ');

          let formattedBirthDate = '';
          if (data.user.birthdate) {
            const date = new Date(data.user.birthdate);
            if (!isNaN(date.getTime())) {
              formattedBirthDate = date.toISOString().split('T')[0];
            }
          }

          setUser({
            firstName,
            lastName,
            fullName,
            phone: data.user.phone || data.user.phone_number || '+998',
            company: data.user.company || data.user.organization || '',
            gender: data.user.gender === 'female' ? 'Ayol' : 'Erkak'
          });

          setFormData({
            username: data.user.username || data.user.full_name || '',
            phone: data.user.phone || data.user.phone_number || '',
            company: data.user.company || data.user.organization || '',
            birthdate: formattedBirthDate,
            gender: data.user.gender || 'male',
            image: null,
            currentImage: data.user.image || data.user.profile_picture || data.user.avatar || null
          });

          localStorage.setItem('userData', JSON.stringify({
            name: data.user.username || data.user.full_name,
            role: data.user.role || 'OPERATOR',
            phone: data.user.phone || data.user.phone_number
          }));
        } else {
          throw new Error('Foydalanuvchi ma\'lumotlari topilmadi');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Profil yuklanmadi: ' + err.message);

        // Mock ma'lumotlar (test uchun)
        if (process.env.NODE_ENV === 'development') {
          setTimeout(() => {
            setUser({
              firstName: 'Qobiljon',
              lastName: 'Solijanov',
              fullName: 'Qobiljon Solijanov',
              phone: '+998901234567',
              company: 'DentaGo MChJ',
              gender: 'Erkak'
            });

            setFormData({
              username: 'Qobiljon Solijanov',
              phone: '+998901234567',
              company: 'DentaGo MChJ',
              birthdate: '1990-01-01',
              gender: 'male',
              image: null,
              currentImage: null
            });

            setLoading(false);
          }, 1000);
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Rasm formatini tekshirish
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Faqat JPEG, PNG, GIF yoki WebP formatidagi rasmlar qabul qilinadi');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Rasm hajmi 5MB dan oshmasligi kerak');
      return;
    }

    const reader = new FileReader();
    reader.onloadstart = () => {
      setError('');
    };
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
      setError('');
    };
    reader.onerror = () => {
      setError('Rasm yuklanmadi');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!formData.username.trim()) {
      setError('Ism familiya kiritilishi shart');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Kirish tokeni topilmadi');

      // Tug'ilgan sanani tekshirish
      let birthdateValue = null;
      if (formData.birthdate) {
        const date = new Date(formData.birthdate);
        if (!isNaN(date.getTime())) {
          birthdateValue = date.toISOString();
        }
      }

      const payload = {
        username: formData.username.trim(),
        gender: formData.gender,
        birthdate: birthdateValue,
        company: formData.company.trim() || null
      };

      // Agar yangi rasm yuklangan bo'lsa
      if (formData.image) {
        payload.image = formData.image;
      }

      console.log('Sending payload:', payload); // Debug

      const response = await fetch('https://app.dentago.uz/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();
      console.log('Update response:', responseData); // Debug

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || `Saqlashda xato: ${response.status}`);
      }

      setSuccess('Profil muvaffaqiyatli yangilandi!');

      // Local ma'lumotlarni yangilash
      localStorage.setItem('userData', JSON.stringify({
        name: formData.username.trim(),
        role: 'OPERATOR'
      }));

      // Yangi ma'lumotlarni olish
      setIsEditing(false);

      // Sahifani yangilash
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (err) {
      console.error('Save error:', err);
      setError('Saqlashda xato: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
      setError('');
      setSuccess('');
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    // Asl ma'lumotlarni qayta yuklash
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.fullName,
        company: user.company,
        birthdate: formData.birthdate,
        image: null // Faqat yuklangan yangi rasmni o'chirish
      }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    fileInputRef.current.value = '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-[#00BCE4] mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Profil ma'lumotlari yuklanmoqda...</p>
          <p className="text-gray-400 text-sm mt-2">Iltimos, kuting</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Xatolik yuz berdi</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#00BCE4] text-white font-medium rounded-xl hover:bg-[#00a8cc] transition"
            >
              Qayta yuklash
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition"
            >
              Orqaga qaytish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Sarlavha */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="p-3 bg-white rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{t('profile.title') || 'Mening Profilim'}</h1>
          </div>
          <div className="hidden md:block">
            <div className="px-4 py-2 bg-white rounded-full shadow-sm">
              <span className="text-gray-600">ID: </span>
              <span className="font-semibold text-[#00BCE4]">{user?.phone?.substring(4) || '12345'}</span>
            </div>
          </div>
        </div>

        {/* Asosiy kartochka */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Dekorativ chiziq */}
          <div className="h-2 bg-gradient-to-r from-[#00BCE4] to-blue-400"></div>

          <div className="p-8 md:p-12">
            {/* Avatar va asosiy ma'lumotlar */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
              {/* Avatar qismi */}
              <div className="relative">
                <div className="relative w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-[#00BCE4]/20 to-blue-300/10 border-8 border-white shadow-2xl">
                  {formData.image ? (
                    <div className="relative">
                      <img
                        src={formData.image}
                        alt="Yangi profil rasmi"
                        className="w-full h-full object-cover"
                      />
                      {isEditing && (
                        <button
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : formData.currentImage ? (
                    <img
                      src={formData.currentImage}
                      alt="Profil rasmi"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center text-6xl font-black text-[#00BCE4]">
                            ${getInitials()}
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl font-black text-[#00BCE4]">
                        {getInitials()}
                      </div>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-4 bg-gradient-to-r from-[#00BCE4] to-blue-400 text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-200"
                  >
                    <Upload className="w-6 h-6" />
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Ma'lumotlar qismi */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {user?.fullName || 'Foydalanuvchi'}
                </h2>
                <p className="text-lg text-[#00BCE4] font-semibold mb-1">
                  {formData.gender === 'male' ? 'Erkak' : 'Ayol'}
                </p>
                <p className="text-gray-600 mb-4">{user?.company || 'Kompaniya nomi'}</p>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Faol</span>
                </div>
              </div>
            </div>

            {/* Form grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ism familiya */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Ism familiya
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Ism familiyangizni kiriting"
                    className={`w-full px-5 py-4 rounded-2xl font-medium transition-all
                      ${isEditing
                        ? 'bg-gray-50 border-2 border-[#00BCE4] focus:ring-4 focus:ring-[#00BCE4]/20 pl-12'
                        : 'bg-gray-100 text-gray-900 pl-5'
                      }`}
                  />
                  {isEditing && (
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-6 rounded-full bg-[#00BCE4]/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-[#00BCE4]">I</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Telefon raqam */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Telefon raqam
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={formData.phone}
                    className="w-full px-5 py-4 bg-gray-100 rounded-2xl text-gray-900 font-medium pl-12"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-green-600">📱</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kompaniya */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Kompaniya nomi
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Kompaniya nomi"
                    className={`w-full px-5 py-4 rounded-2xl transition-all
                      ${isEditing
                        ? 'bg-gray-50 border-2 border-[#00BCE4] focus:ring-4 focus:ring-[#00BCE4]/20 pl-12 italic'
                        : 'bg-gray-100 text-gray-700 pl-5 italic'
                      }`}
                  />
                  {isEditing && (
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">🏢</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tug'ilgan sana */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Tug'ilgan sana
                </label>
                <div className="relative">
                  <input
                    type={isEditing ? 'date' : 'text'}
                    readOnly={!isEditing}
                    value={isEditing ? formData.birthdate : (formData.birthdate ? new Date(formData.birthdate).toLocaleDateString('uz-UZ') : 'Belgilanmagan')}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthdate: e.target.value }))}
                    placeholder="YYYY-MM-DD"
                    className={`w-full px-5 py-4 rounded-2xl transition-all
                      ${isEditing
                        ? 'bg-gray-50 border-2 border-[#00BCE4] focus:ring-4 focus:ring-[#00BCE4]/20 pl-12 italic'
                        : 'bg-gray-100 text-gray-700 pl-5 italic'
                      }`}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-yellow-600">🎂</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Jinsi */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Jinsi
                </label>
                <div className="relative">
                  {isEditing ? (
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-[#00BCE4] rounded-2xl focus:ring-4 focus:ring-[#00BCE4]/20 font-medium pl-12 appearance-none"
                    >
                      <option value="male">Erkak</option>
                      <option value="female">Ayol</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      readOnly
                      value={formData.gender === 'male' ? 'Erkak' : 'Ayol'}
                      className="w-full px-5 py-4 bg-gray-100 rounded-2xl text-gray-900 font-medium pl-12"
                    />
                  )}
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-purple-600">👤</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Xabarlar */}
            {(error || success) && (
              <div className={`mt-8 p-6 rounded-2xl border ${error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-start gap-3">
                  {error ? (
                    <>
                      <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <X className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-red-800">Xatolik</p>
                        <p className="text-red-600 mt-1">{error}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-800">Muvaffaqiyat!</p>
                        <p className="text-green-600 mt-1">{success}</p>
                        <p className="text-green-500 text-sm mt-2">Sahifa tez orada yangilanadi...</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Tugmalar */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              {isEditing && (
                <button
                  onClick={cancelEdit}
                  disabled={saving}
                  className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-lg rounded-2xl shadow transition-all flex-1 sm:flex-none"
                >
                  Bekor qilish
                </button>
              )}

              <button
                onClick={toggleEdit}
                disabled={saving}
                className="px-8 py-4 bg-gradient-to-r from-[#00BCE4] to-blue-500 hover:from-[#00a8cc] hover:to-blue-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 flex-1 sm:flex-none disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Saqlanmoqda...
                  </>
                ) : (
                  <>
                    <Edit2 className="w-6 h-6" />
                    {isEditing ? 'Saqlash' : 'Tahrirlash'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Qo'shimcha ma'lumotlar */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ro'yxatdan o'tgan</p>
                <p className="font-semibold">2024 yil</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Holati</p>
                <p className="font-semibold text-green-600">Faol</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👑</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rol</p>
                <p className="font-semibold text-[#00BCE4]">OPERATOR</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
