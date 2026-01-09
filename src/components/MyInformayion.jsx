import React, { useState, useEffect } from 'react';
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

  // LocalStorage'dan tokenni olish
  useEffect(() => {
    const loadToken = () => {
      const savedToken = localStorage.getItem('dentago_access_token');
      setToken(savedToken);
      setIsLoading(false);

      if (!savedToken) {
        setSubmitMessage({
          type: 'error',
          text: '❌ Access token topilmadi. Tokenni localStoragega "dentago_access_token" keyi ostida saqlang.'
        });
      }
    };

    loadToken();
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
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
    }
  });

  const onSubmit = async (data) => {
    if (!token) {
      setSubmitMessage({
        type: 'error',
        text: '❌ Access token mavjud emas. Tokenni localStoragega "dentago_access_token" keyi ostida saqlang.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      const doctorData = {
        fullName: data.fullName,
        specialty: data.specialty,
        experienceYears: parseInt(data.experienceYears),
        patientsCount: parseInt(data.patientsCount),
        price: parseInt(data.price),
        rating: parseFloat(data.rating),
        reviewsCount: parseInt(data.reviewsCount),
        clinic: {
          name: data.clinicName,
          address: data.clinicAddress,
          location: {
            lat: 41.3111,
            lng: 69.2797
          },
          distanceKm: 2.5
        },
        workTime: {
          start: data.workTimeStart,
          end: data.workTimeEnd
        },
        subscription: {
          startAt: new Date().toISOString(),
          endAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
          isActive: true
        },
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}&background=00BCE4&color=fff`,
        phone: data.phone,
        email: data.email,
        description: data.description,
        isAvailable24x7: data.isAvailable24x7,
        isActive: data.isActive
      };

      const response = await axios.post('https://app.dentago.uz/api/admin/doctors', doctorData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200 || response.status === 201) {
        reset();
        setSubmitMessage({
          type: 'success',
          text: '✅ Shifokor muvaffaqiyatli qo\'shildi!'
        });
      }
    } catch (err) {
      console.error('Submit error:', err);

      if (err.response?.status === 401) {
        setSubmitMessage({
          type: 'error',
          text: '❌ Token noto\'g\'ri yoki muddati o\'tgan. Tokenni yangilang.'
        });
      } else if (err.code === 'ERR_NETWORK') {
        setSubmitMessage({
          type: 'error',
          text: '❌ Server bilan bog\'lanishda muammo. Internet aloqasini tekshiring.'
        });
      } else {
        setSubmitMessage({
          type: 'error',
          text: `❌ Xatolik: ${err.response?.data?.message || err.message}`
        });
      }
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
      <div className="min-h-screen text-black bg-gradient-to-br from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#00BCE4] mx-auto mb-4" />
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-white to-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#00BCE4] to-[#0099CC] mb-4">
            <BriefcaseMedical className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Shifokor Qo'shish
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Yangi shifokor ma'lumotlarini kiritish uchun quyidagi formani to'ldiring
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
            <div className={`w-3 h-3 rounded-full ${token ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">
              {token ? 'Token mavjud' : 'Token topilmadi'}
            </span>
            <Key className="w-4 h-4 text-gray-500" />
          </div>
        </div>

        {submitMessage.text && (
          <div className={`mb-6 p-4 rounded-lg ${submitMessage.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            <div className="flex items-center gap-3">
              {submitMessage.type === 'success' ? (
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{submitMessage.text}</span>
            </div>
          </div>
        )}

        {!token ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                <Key className="w-10 h-10 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Access Token Topilmadi
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Shifokor qo'shish uchun access token kerak.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <h4 className="font-medium text-gray-700 mb-2">Token qo'yish yo'riqnomasi:</h4>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
                  <li>Browserning Developer Tools'ini oching (F12)</li>
                  <li>Console yoki Application bo'limiga o'ting</li>
                  <li>Quyidagi kodni kiriting:</li>
                </ol>
                <div className="mt-3 p-3 bg-gray-800 text-gray-100 rounded-lg font-mono text-sm">
                  localStorage.setItem('dentago_access_token', 'SIZNING_TOKENIZ');
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  Tokenni admin panel orqali oling va yuqoridagi kodda 'SIZNING_TOKENIZ' o'rniga qo'ying.
                </p>
              </div>

              <p className="text-sm text-gray-500">
                Tokenni qo'yganingizdan keyin sahifani yangilang (F5)
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 text-lg border-l-4 border-[#00BCE4] pl-3">Asosiy Ma'lumotlar</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                    <UserCircle className="w-4 h-4" />
                    To'liq Ismi *
                  </label>
                  <input
                    {...register("fullName", {
                      required: "Ism kiritilishi shart",
                      minLength: { value: 3, message: "Kamida 3 ta harf bo'lishi kerak" }
                    })}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'} focus:ring-2 focus:ring-[#00BCE4] focus:border-[#00BCE4] outline-none transition placeholder-gray-400`}
                    placeholder="Aliyev Ali Aliyevich"
                  />
                  {errors.fullName && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telefon *
                    </label>
                    <input
                      {...register("phone", {
                        required: "Telefon raqam kiritilishi shart",
                        pattern: {
                          value: /^\+998\d{9}$/,
                          message: "+998XXXXXXXXX formatida bo'lishi kerak"
                        }
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#00BCE4] focus:border-[#00BCE4] outline-none transition placeholder-gray-400"
                      placeholder="+998 90 123 45 67"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <input
                      {...register("email", {
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Noto'g'ri email formati"
                        }
                      })}
                      type="email"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#00BCE4] focus:border-[#00BCE4] outline-none transition placeholder-gray-400"
                      placeholder="ali@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mutaxassislik *
                  </label>
                  <select
                    {...register("specialty", { required: true })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#00BCE4] focus:border-[#00BCE4] outline-none transition appearance-none"
                  >
                    {specialties.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tavsif
                  </label>
                  <textarea
                    {...register("description")}
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#00BCE4] focus:border-[#00BCE4] outline-none transition placeholder-gray-400 resize-none"
                    placeholder="Shifokor haqida qisqacha ma'lumot..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 text-lg border-l-4 border-[#00BCE4] pl-3">Tajriba</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Tajriba (yil) *
                    </label>
                    <input
                      {...register("experienceYears", {
                        required: "Tajriba yilini kiriting",
                        min: { value: 0, message: "Musbat son kiriting" },
                        max: { value: 60, message: "60 yildan ko'p bo'lmasin" }
                      })}
                      type="number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#00BCE4] focus:border-[#00BCE4] outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Reyting *
                    </label>
                    <input
                      {...register("rating", {
                        required: "Reytingni kiriting",
                        min: { value: 0, message: "0 dan kichik bo'lmasin" },
                        max: { value: 5, message: "5 dan katta bo'lmasin" }
                      })}
                      type="number"
                      step="0.1"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#00BCE4] focus:border-[#00BCE4] outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 text-lg border-l-4 border-[#00BCE4] pl-3">Klinika Ma'lumotlari</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Klinika nomi *
                  </label>
                  <input
                    {...register("clinicName", {
                      required: "Klinika nomini kiriting",
                      minLength: { value: 2, message: "Kamida 2 ta harf bo'lishi kerak" }
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#00BCE4] focus:border-[#00BCE4] outline-none transition placeholder-gray-400"
                    placeholder="Стоматология Премиум"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Manzil *
                  </label>
                  <input
                    {...register("clinicAddress", {
                      required: "Manzilni kiriting",
                      minLength: { value: 5, message: "Kamida 5 ta harf bo'lishi kerak" }
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#00BCE4] focus:border-[#00BCE4] outline-none transition placeholder-gray-400"
                    placeholder="г. Ташкент, ул. Навои, д. 15"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 text-lg border-l-4 border-[#00BCE4] pl-3">Narx va Ish Vaqti</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Konsultatsiya narxi *
                  </label>
                  <input
                    {...register("price", {
                      required: "Narxni kiriting",
                      min: { value: 0, message: "Musbat son kiriting" }
                    })}
                    type="number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#00BCE4] focus:border-[#00BCE4] outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Ish boshlash
                    </label>
                    <input
                      {...register("workTimeStart")}
                      type="time"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#00BCE4] focus:border-[#00BCE4] outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Ish tugash
                    </label>
                    <input
                      {...register("workTimeEnd")}
                      type="time"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#00BCE4] focus:border-[#00BCE4] outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 text-lg border-l-4 border-[#00BCE4] pl-3">Qo'shimcha Ma'lumotlar</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Bemorlar soni
                    </label>
                    <input
                      {...register("patientsCount", {
                        min: { value: 0, message: "Musbat son kiriting" }
                      })}
                      type="number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#00BCE4] focus:border-[#00BCE4] outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Sharhlar soni
                    </label>
                    <input
                      {...register("reviewsCount", {
                        min: { value: 0, message: "Musbat son kiriting" }
                      })}
                      type="number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#00BCE4] focus:border-[#00BCE4] outline-none transition"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                    <input
                      {...register("isAvailable24x7")}
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-[#00BCE4] focus:ring-[#00BCE4]"
                    />
                    <div>
                      <span className="font-medium text-gray-700">24/7 Murojat qilish mumkin</span>
                      <p className="text-sm text-gray-500">Har qanday vaqtda konsultatsiya</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                    <input
                      {...register("isActive")}
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded border-gray-300 text-[#00BCE4] focus:ring-[#00BCE4]"
                    />
                    <div>
                      <span className="font-medium text-gray-700">Faol</span>
                      <p className="text-sm text-gray-500">Shifokor ishlayotgan holatda</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#00BCE4] to-[#0099CC] text-white font-semibold py-3.5 px-4 rounded-xl hover:from-[#00A8D4] hover:to-[#0088B3] focus:outline-none focus:ring-2 focus:ring-[#00BCE4] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
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
                  Barcha maydonlar (*) bilan belgilanganlar majburiydir
                </p>
              </div>
            </form>
          </div>
        )}

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Dental Clinic. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </div>
  );
}

export default MyInformation;
