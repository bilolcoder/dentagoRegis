// src/components/ProfileContent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataProvider';
import { Edit2, ArrowLeft, Loader2, Upload, CheckCircle } from 'lucide-react';

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
    image: null,        // yangi yuklangan rasm (base64)
    currentImage: null   // backenddagi joriy rasm
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
        const response = await fetch('https://app.dentago.uz/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Maʼlumotlar olinmadi');

        const data = await response.json();

        if (data.user) {
          const fullName = data.user.username || 'Foydalanuvchi';
          const nameParts = fullName.trim().split(' ');
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(' ');

          const formattedBirthDate = data.user.birthdate
            ? new Date(data.user.birthdate).toISOString().split('T')[0]
            : '';

          setUser({
            firstName,
            lastName,
            fullName,
            phone: data.user.phone || '+998',
            company: data.user.company || '',
            gender: data.user.gender === 'female' ? 'Ayol' : 'Erkak'
          });

          setFormData({
            username: data.user.username || '',
            phone: data.user.phone || '',
            company: data.user.company || '',
            birthdate: formattedBirthDate,
            gender: data.user.gender || 'male',
            image: null,
            currentImage: data.user.image || null
          });

          localStorage.setItem('userData', JSON.stringify({
            name: data.user.username,
            role: 'OPERATOR'
          }));
        }
      } catch (err) {
        setError('Profil yuklanmadi: ' + err.message);
        console.error(err);
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

    if (file.size > 5 * 1024 * 1024) {
      setError('Rasm hajmi 5MB dan oshmasligi kerak');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
      setError('');
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
      if (!token) throw new Error('Token yo‘q');

      const payload = {
        username: formData.username.trim(),
        gender: formData.gender,
        birthdate: formData.birthdate || null,
        company: formData.company.trim() || null
      };

      if (formData.image) {
        payload.image = formData.image;
      }

      const response = await fetch('https://app.dentago.uz/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Saqlashda xato');
      }

      setSuccess('Profil muvaffaqiyatli yangilandi!');
      
      // Local ma'lumotlarni yangilash
      localStorage.setItem('userData', JSON.stringify({
        name: formData.username.trim(),
        role: 'OPERATOR'
      }));

      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err) {
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

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#00BCE4]" />
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>Xato: {error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-blue-600 underline">
          Qayta yuklash
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Sarlavha */}
        <div className="flex items-center justify-between mb-8">
         
        
        </div>

        {/* Asosiy kartochka */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-10 relative">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#00BCE4]/20 to-[#00BCE4]/10 border-4 border-white shadow-2xl">
                {formData.image ? (
                  <img src={formData.image} alt="Yangi" className="w-full h-full object-cover" />
                ) : formData.currentImage ? (
                  <img src={formData.currentImage} alt="Joriy" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl font-black text-[#00BCE4]">
                    {getInitials()}
                  </div>
                )}
              </div>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-3 bg-[#00BCE4] text-white rounded-full shadow-lg hover:scale-110 transition"
                >
                  <Upload className="w-5 h-5" />
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              {user?.fullName || 'Foydalanuvchi'}
            </h2>
            <p className="mt-2 text-lg text-[#00BCE4] font-semibold">
              {formData.gender === 'male' ? 'Erkak' : 'Ayol'}
            </p>
          </div>

          {/* Form grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ism */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Исм</label>
              <input
                type="text"
                readOnly={!isEditing}
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Qobiljon Solijanov"
                className={`w-full px-5 py-4 rounded-2xl font-medium transition-all
                  ${isEditing 
                    ? 'bg-gray-50 border-2 border-[#00BCE4] focus:ring-4 focus:ring-[#00BCE4]/20' 
                    : 'bg-gray-100 text-gray-900'
                  }`}
              />
            </div>

            {/* Telefon */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Телефон</label>
              <input
                type="text"
                readOnly
                value={formData.phone}
                className="w-full px-5 py-4 bg-gray-100 rounded-2xl text-gray-900 font-medium"
              />
            </div>

            {/* Kompaniya */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Название компании</label>
              <input
                type="text"
                readOnly={!isEditing}
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Название вашей компании"
                className={`w-full px-5 py-4 rounded-2xl italic transition-all
                  ${isEditing 
                    ? 'bg-gray-50 border-2 border-[#00BCE4] focus:ring-4 focus:ring-[#00BCE4]/20 text-gray-900' 
                    : 'bg-gray-100 text-gray-700'
                  }`}
              />
            </div>

            {/* Tug'ilgan sana */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Туғилган сана</label>
              <input
                type={isEditing ? 'date' : 'text'}
                readOnly={!isEditing}
                value={isEditing ? formData.birthdate : (formData.birthdate ? new Date(formData.birthdate).toLocaleDateString('uz-UZ') : '')}
                onChange={(e) => setFormData(prev => ({ ...prev, birthdate: e.target.value }))}
                placeholder="mm/dd/yyyy"
                className={`w-full px-5 py-4 rounded-2xl italic transition-all
                  ${isEditing 
                    ? 'bg-gray-50 border-2 border-[#00BCE4] focus:ring-4 focus:ring-[#00BCE4]/20 text-gray-900' 
                    : 'bg-gray-100 text-gray-700'
                  }`}
              />
            </div>

            {/* Jinsi */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-2">Жинси</label>
              {isEditing ? (
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-[#00BCE4] rounded-2xl focus:ring-4 focus:ring-[#00BCE4]/20 font-medium"
                >
                  <option value="male">Erkak</option>
                  <option value="female">Ayol</option>
                </select>
              ) : (
                <input
                  type="text"
                  readOnly
                  value={formData.gender === 'male' ? 'Erkak' : 'Ayol'}
                  className="w-full px-5 py-4 bg-gray-100 rounded-2xl text-gray-900 font-medium"
                />
              )}
            </div>
          </div>

          {/* Xabarlar */}
          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-2xl text-red-700 font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-2xl text-green-700 font-medium flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {success}
            </div>
          )}

          {/* Tugma - pastda */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={toggleEdit}
              disabled={saving}
              className="px-12 py-5 bg-[#00BCE4] hover:bg-[#00a8cc] text-white font-bold text-xl rounded-2xl shadow-lg transition-all flex items-center gap-3 disabled:opacity-70"
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
    </div>
  );
};

export default ProfileContent;