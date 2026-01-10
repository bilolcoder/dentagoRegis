import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import {
  UserCircle,
  BriefcaseMedical,
  Calendar,
  Users,
  Building,
  MapPin,
  Clock,
  DollarSign,
  Star,
  MessageSquare,
  Phone,
  Mail,
  Save,
  Loader2,
  AlertCircle,
  Key
} from 'lucide-react';

function MyInformation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef(null);

  // Token yuklash
  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    setToken(savedToken);
    setIsLoading(false);

    if (!savedToken) {
      setSubmitMessage({
        type: 'error',
        text: '❌ Access token topilmadi. localStorage.setItem("accessToken", "YOUR_TOKEN") qilib sinab ko‘ring'
      });
    }
  }, []);

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm({
    defaultValues: {
      fullName: '',
      specialty: 'Terapevt',
      experienceYears: 5,
      patientsCount: 100,
      clinicName: '',
      clinicAddress: '',
      price: 150000,
      rating: 4.5,
      reviewsCount: 50,
      workTimeStart: '09:00',
      workTimeEnd: '18:00',
      isAvailable24x7: false,
      isActive: true,
      phone: '',
      email: '',
      description: ''
    },
    mode: 'onChange'
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Faqat rasm fayllarini tanlashingiz mumkin!');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    if (!token) {
      setSubmitMessage({ type: 'error', text: '❌ Token mavjud emas!' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      let avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName || 'Doctor')}&background=00BCE4&color=fff`;

      // Rasm yuklash
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);  // ← Backend "image" kalitini kutadi

        const uploadRes = await axios.post(
          'https://app.dentago.uz/api/upload/image',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        console.log('Upload javobi:', uploadRes.data); // ← Debug uchun

        let filename =
          uploadRes.data?.file?.savedName ||
          uploadRes.data?.filename ||
          (uploadRes.data?.url ? uploadRes.data.url.split('/').pop() : null);

        if (filename) {
          avatarUrl = `https://app.dentago.uz/images/${filename}`;
        } else {
          console.warn('Fayl nomi topilmadi → default avatar');
        }
      }

      // To‘liq tozalangan va to‘g‘ri formatdagi ma'lumot
      const doctorData = {
        fullName: data.fullName.trim() || 'Noma\'lum Shifokor',
        specialty: data.specialty || 'Terapevt',
        experienceYears: Number(data.experienceYears) || 0,
        patientsCount: Number(data.patientsCount) || 0,
        price: Number(data.price) || 0,
        rating: Number(data.rating) || 0,
        reviewsCount: Number(data.reviewsCount) || 0,
        clinic: {
          name: data.clinicName.trim() || 'Noma\'lum Klinika',
          address: data.clinicAddress.trim() || 'Manzil kiritilmagan',
          location: { lat: 41.3111, lng: 69.2797 },
          distanceKm: 2.5
        },
        workTime: {
          start: data.workTimeStart || '09:00',
          end: data.workTimeEnd || '18:00'
        },
        subscription: {
          startAt: new Date().toISOString(),
          endAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
          isActive: true
        },
        avatar: avatarUrl,
        phone: data.phone.trim() || '',
        email: data.email.trim() || '',
        description: data.description.trim() || '',
        isAvailable24x7: !!data.isAvailable24x7,
        isActive: !!data.isActive
      };

      console.log('Yuborilayotgan doctor data:', doctorData); // ← Debug

      const response = await axios.post(
        'https://app.dentago.uz/api/admin/doctors',
        doctorData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        reset();
        setSelectedFile(null);
        setPreviewUrl(null);
        setSubmitMessage({
          type: 'success',
          text: '✅ Shifokor va rasm muvaffaqiyatli qo‘shildi!'
        });
      }
    } catch (err) {
      console.error('Xato:', err);

      let msg = 'Xatolik yuz berdi';

      if (err.response) {
        if (err.response.status === 400) {
          msg = '❌ 400 Bad Request: ' + (err.response.data?.message || 'Maydonlar noto‘g‘ri yoki yetishmayapti');
        } else if (err.response.status === 401) {
          msg = '❌ Token noto‘g‘ri yoki muddati o‘tgan';
        } else if (err.response.status === 409) {
          msg = '❌ Bu ma‘lumot allaqachon mavjud';
        } else {
          msg = `❌ Server xatosi: ${err.response.status}`;
        }
      } else if (err.code === 'ERR_NETWORK') {
        msg = '❌ Internet aloqasi uzildi';
      }

      setSubmitMessage({ type: 'error', text: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const specialties = [
    'Terapevt',
    'Хирург',
    'Ортодонт',
    'Пародонтолог',
    'Педиатр',
    'Имплантолог',
    'Гигиенист',
    'Эндодонт',
    'Протезист',
    'Челюстно-лицевой хирург'
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-[#00BCE4]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Sarlavha */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#00BCE4] to-[#0099CC] mb-4">
            <BriefcaseMedical className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Shifokor Qo'shish
          </h1>
          <p className="text-gray-600 mt-2">
            Yangi shifokor ma'lumotlarini kiritish uchun formani to'ldiring
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
            <div className={`w-3 h-3 rounded-full ${token ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">
              {token ? 'Token mavjud' : 'Token topilmadi'}
            </span>
          </div>
        </div>

        {/* Xabarlar */}
        {submitMessage.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            submitMessage.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {submitMessage.text}
          </div>
        )}

        {/* Token yo'q bo'lsa */}
        {!token ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-red-600">Access Token Topilmadi</h3>
            <p className="mb-4">
              Iltimos, brauzer konsolida quyidagi kodni bajaring:
            </p>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
              localStorage.setItem('accessToken', 'SIZNING_TOKENINGIZ')
            </div>
            <p className="text-gray-600">Keyin sahifani yangilang (F5)</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Rasm yuklash */}
              <div className="flex flex-col items-center mb-8">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 rounded-[10px] overflow-hidden bg-gray-200 cursor-pointer hover:opacity-90 transition border-2 border-[#00BCE4] relative shadow-md"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                      <BriefcaseMedical className="w-10 h-10 mb-1" />
                      <span className="text-xs">Rasm yuklash</span>
                    </div>
                  )}
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : 'klinika rasmini tanlang'}
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Asosiy ma'lumotlar */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-l-4 border-[#00BCE4] pl-3">
                  Asosiy Ma'lumotlar
                </h3>

                {/* Ism */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <UserCircle className="w-4 h-4" /> To'liq Ismi *
                  </label>
                  <input
                    {...register('fullName', {
                      required: 'Ism majburiy',
                      minLength: { value: 3, message: 'Kamida 3 ta belgi' }
                    })}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    } focus:ring-2 focus:ring-[#00BCE4] outline-none transition`}
                    placeholder="Aliyev Ali Aliyevich"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>

                {/* Telefon + Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Telefon *
                    </label>
                    <input
                      {...register('phone', {
                        required: 'Telefon raqami majburiy',
                        pattern: {
                          value: /^\+998[0-9]{9}$/,
                          message: '+998XXXXXXXXX formatida kiriting'
                        }
                      })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      } focus:ring-2 focus:ring-[#00BCE4] outline-none transition`}
                      placeholder="+998901234567"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email
                    </label>
                    <input
                      type="email"
                      {...register('email', {
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Noto‘g‘ri email formati'
                        }
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00BCE4] outline-none transition"
                      placeholder="example@gmail.com"
                    />
                  </div>
                </div>

                {/* Mutaxassislik */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mutaxassislik *
                  </label>
                  <select
                    {...register('specialty', { required: true })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00BCE4] outline-none transition"
                  >
                    {specialties.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tavsif */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tavsif</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00BCE4] outline-none transition resize-none"
                    placeholder="Shifokor haqida qisqacha ma'lumot..."
                  />
                </div>
              </div>

              {/* Tajriba */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-l-4 border-[#00BCE4] pl-3">Tajriba</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Tajriba (yil) *
                    </label>
                    <input
                      type="number"
                      {...register('experienceYears', {
                        required: true,
                        min: { value: 0, message: 'Musbat son kiriting' }
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00BCE4] outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Star className="w-4 h-4" /> Reyting *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('rating', {
                        required: true,
                        min: 0,
                        max: 5
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00BCE4] outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Klinika */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-l-4 border-[#00BCE4] pl-3">Klinika Ma'lumotlari</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Building className="w-4 h-4" /> Klinika nomi *
                  </label>
                  <input
                    {...register('clinicName', { required: 'Klinika nomi majburiy' })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00BCE4] outline-none transition"
                    placeholder="Stomatologiya Premium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Manzil *
                  </label>
                  <input
                    {...register('clinicAddress', { required: 'Manzil majburiy' })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00BCE4] outline-none transition"
                    placeholder="Toshkent sh., Chilanzor tumani, 45-uy"
                  />
                </div>
              </div>

              {/* Narx va ish vaqti */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-l-4 border-[#00BCE4] pl-3">Narx va Ish Vaqti</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Konsultatsiya narxi (so'm) *
                  </label>
                  <input
                    type="number"
                    {...register('price', { required: true, min: 0 })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00BCE4] outline-none transition"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Ish boshlash
                    </label>
                    <input
                      type="time"
                      {...register('workTimeStart')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00BCE4] outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Ish tugash
                    </label>
                    <input
                      type="time"
                      {...register('workTimeEnd')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00BCE4] outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Qo'shimcha */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-l-4 border-[#00BCE4] pl-3">Qo'shimcha Ma'lumotlar</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Bemorlar soni
                    </label>
                    <input
                      type="number"
                      {...register('patientsCount', { min: 0 })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00BCE4] outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" /> Sharhlar soni
                    </label>
                    <input
                      type="number"
                      {...register('reviewsCount', { min: 0 })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00BCE4] outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border cursor-pointer hover:bg-gray-100 transition">
                    <input
                      type="checkbox"
                      {...register('isAvailable24x7')}
                      className="w-5 h-5 text-[#00BCE4]"
                    />
                    <div>
                      <span className="font-medium">24/7 qabul</span>
                      <p className="text-sm text-gray-500">Doimiy mavjud</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border cursor-pointer hover:bg-gray-100 transition">
                    <input
                      type="checkbox"
                      {...register('isActive')}
                      defaultChecked
                      className="w-5 h-5 text-[#00BCE4]"
                    />
                    <div>
                      <span className="font-medium">Faol</span>
                      <p className="text-sm text-gray-500">Hozirda ishlayapti</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit tugmasi */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 px-6 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg
                    ${isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#00BCE4] to-[#0099CC] hover:from-[#00A8D4] hover:to-[#0088B3] hover:shadow-xl'}`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saqlanmoqda...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Shifokorni Saqlash
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  * bilan belgilangan maydonlar majburiy
                </p>
              </div>
            </form>
          </div>
        )}

        <footer className="mt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} DentaGo. Barcha huquqlar himoyalangan.
        </footer>
      </div>
    </div>
  );
}

export default MyInformation;
