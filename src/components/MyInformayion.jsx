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
  Edit,
  Trash2,
  Eye,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin as MapIcon,
  User,
  Plus,
  ArrowUp
} from 'lucide-react';

function MyInformation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewDoctor, setViewDoctor] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [isFormCollapsed, setIsFormCollapsed] = useState(false);

  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const ITEMS_PER_PAGE = 6;

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

  // Shifokorlarni yuklash
  useEffect(() => {
    if (token) {
      fetchDoctors();
    }
  }, [token]);

  const fetchDoctors = async () => {
    try {
      console.log('Shifokorlarni yuklash boshlandi...');
      setDebugInfo('Shifokorlarni yuklash boshlandi...');

      const response = await axios.get(
        'https://app.dentago.uz/api/admin/doctors',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Server response:', response);
      setDebugInfo(`Response status: ${response.status}, Data length: ${response.data?.length || 0}`);

      // Turli formatlarni qo'llab-quvvatlash
      let doctorsData = [];

      if (Array.isArray(response.data)) {
        doctorsData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        doctorsData = response.data.data;
      } else if (response.data && response.data.doctors) {
        doctorsData = response.data.doctors;
      } else if (response.data && response.data.items) {
        doctorsData = response.data.items;
      } else if (response.data && typeof response.data === 'object') {
        doctorsData = Object.values(response.data);
      }

      console.log('Loaded doctors:', doctorsData);
      setDoctors(doctorsData);
      setDebugInfo(`Shifokorlar soni: ${doctorsData.length}`);

    } catch (error) {
      console.error('Shifokorlarni yuklashda xato:', error);
      setDebugInfo(`Xato: ${error.message}`);
      setSubmitMessage({
        type: 'error',
        text: `Shifokorlarni yuklashda xato: ${error.message}`
      });
    }
  };

  // ID orqali shifokorni ko'rish - To'liq tuzatilgan va mustahkamlangan
  const handleViewDoctor = async (id) => {
    try {
      if (!id) {
        alert('Shifokor ID topilmadi');
        setDebugInfo('ID topilmadi');
        return;
      }

      console.log('View doctor ID:', id);
      setDebugInfo(`ID orqali shifokor yuklanmoqda: ${id}`);

      const response = await axios.get(
        `https://app.dentago.uz/api/admin/doctors/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('View doctor response:', response.data);

      // Response formatini to'g'ri qayta ishlash (agar nested bo'lsa)
      const doctorData = response.data?.data || response.data || null;

      if (doctorData) {
        setViewDoctor(doctorData);
        setIsViewModalOpen(true);
        setDebugInfo(`Shifokor ma'lumotlari yuklandi`);
      } else {
        setDebugInfo('Shifokor ma\'lumotlari topilmadi');
        alert('Shifokor ma\'lumotlari topilmadi');
      }
    } catch (error) {
      console.error('Shifokorni ko\'rishda xato:', error);
      console.error('Error details:', error.response?.data || error.message);
      setDebugInfo(`Xato: ${error.response?.status || error.message}`);

      let errorMsg = 'Shifokor ma\'lumotlarini yuklashda xato yuz berdi';
      if (error.response?.status === 404) {
        errorMsg = 'Shifokor topilmadi (404)';
      } else if (error.response?.status === 401) {
        errorMsg = 'Kirish huquqi yo\'q (401) - Tokenni tekshiring';
      } else if (error.response?.status === 403) {
        errorMsg = 'Ruxsat yo\'q (403) - Admin huquqlarini tekshiring';
      } else if (error.response?.status === 500) {
        errorMsg = 'Server xatosi (500) - Backendni tekshiring';
      }
      alert(errorMsg);
    }
  };

  // Shifokorni tahrirlash
  const handleEditDoctor = (doctor) => {
    console.log('Edit doctor:', doctor);

    if (!doctor || (!doctor._id && !doctor.id)) {
      alert('Shifokor ma\'lumotlari noto\'g\'ri');
      return;
    }

    setSelectedDoctor(doctor);
    setIsEditing(true);
    setShowForm(true);
    setIsFormCollapsed(false);

    // Form qiymatlarini to'ldirish
    const formValues = {
      fullName: doctor.fullName || doctor.name || '',
      gender: doctor.gender || 'male',
      specialty: doctor.specialty || doctor.specialization || 'Terapevt',
      experienceYears: doctor.experienceYears || doctor.experience || 5,
      patientsCount: doctor.patientsCount || doctor.patients || 100,
      clinicName: doctor.clinic?.name || doctor.hospitalName || '',
      clinicAddress: doctor.clinic?.address || doctor.address || '',
      price: doctor.price || doctor.consultationPrice || 150000,
      rating: doctor.rating || 4.5,
      reviewsCount: doctor.reviewsCount || doctor.reviews || 50,
      workTimeStart: doctor.workTime?.start || doctor.workHours?.start || '09:00',
      workTimeEnd: doctor.workTime?.end || doctor.workHours?.end || '18:00',
      isAvailable24x7: doctor.isAvailable24x7 || doctor.available24_7 || false,
      isActive: doctor.isActive !== undefined ? doctor.isActive : true,
      phone: doctor.phone || doctor.phoneNumber || '',
      email: doctor.email || '',
      description: doctor.description || doctor.bio || ''
    };

    console.log('Form values to reset:', formValues);
    reset(formValues);

    if (doctor.avatar || doctor.profileImage || doctor.image) {
      setPreviewUrl(doctor.avatar || doctor.profileImage || doctor.image);
    } else {
      setPreviewUrl(null);
    }

    // Formga scroll qilish
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Shifokorni o'chirish
  const handleDeleteDoctor = async (id) => {
    if (!id) {
      alert('Shifokor ID topilmadi');
      return;
    }

    if (!window.confirm('Haqiqatan ham bu shifokorni o\'chirmoqchimisiz?')) {
      return;
    }

    try {
      await axios.delete(
        `https://app.dentago.uz/api/admin/doctors/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Ro'yxatni yangilash
      setDoctors(doctors.filter(doctor => (doctor._id || doctor.id) !== id));
      setSubmitMessage({
        type: 'success',
        text: '✅ Shifokor muvaffaqiyatli o\'chirildi!'
      });
    } catch (error) {
      console.error('O\'chirishda xato:', error);
      setSubmitMessage({
        type: 'error',
        text: `❌ O'chirishda xato: ${error.message}`
      });
    }
  };

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
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

  // Subscription maydonlarini yaratish
  const createSubscriptionData = () => {
    const now = new Date();
    const oneYearLater = new Date();
    oneYearLater.setFullYear(now.getFullYear() + 1);

    return {
      startAt: now.toISOString(),
      endAt: oneYearLater.toISOString(),
      isActive: true
    };
  };

  const onSubmit = async (data) => {
    if (!token) {
      setSubmitMessage({ type: 'error', text: '❌ Token mavjud emas!' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });
    setDebugInfo('Form yuborilmoqda...');

    try {
      let avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName || 'Doctor')}&background=00BCE4&color=fff`;

      // Rasm yuklash (agar yangi rasm tanlangan bo'lsa)
      if (selectedFile) {
        setDebugInfo('Rasm yuklanmoqda...');
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
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

          console.log('Upload response:', uploadRes.data);

          let filename = uploadRes.data?.file?.savedName ||
                        uploadRes.data?.filename ||
                        (uploadRes.data?.url ? uploadRes.data.url.split('/').pop() : null);

          if (filename) {
            avatarUrl = `https://app.dentago.uz/images/${filename}`;
          }
        } catch (uploadError) {
          console.warn('Rasm yuklashda xato:', uploadError);
          // Rasm yuklashda xato bo'lsa ham davom etish
        }
      } else if (isEditing && selectedDoctor && (selectedDoctor.avatar || selectedDoctor.image)) {
        // Tahrirlashda eski rasmni saqlash
        avatarUrl = selectedDoctor.avatar || selectedDoctor.image;
      }

      // TO'G'RI FORMAT: Subscription maydonlarini qo'shish
      const doctorData = {
        fullName: data.fullName?.trim() || 'Noma\'lum Shifokor',
        gender: data.gender || 'male',
        specialty: data.specialty || 'Terapevt',
        experienceYears: Number(data.experienceYears) || 0,
        patientsCount: Number(data.patientsCount) || 0,
        price: Number(data.price) || 0,
        rating: Number(data.rating) || 0,
        reviewsCount: Number(data.reviewsCount) || 0,
        clinic: {
          name: data.clinicName?.trim() || 'Noma\'lum Klinika',
          address: data.clinicAddress?.trim() || 'Manzil kiritilmagan',
          location: { lat: 41.3111, lng: 69.2797 },
          distanceKm: 2.5
        },
        workTime: {
          start: data.workTimeStart || '09:00',
          end: data.workTimeEnd || '18:00'
        },
        // MUHIM: Subscription maydonlarini qo'shish
        subscription: createSubscriptionData(),
        avatar: avatarUrl,
        phone: data.phone?.trim() || '',
        email: data.email?.trim() || '',
        description: data.description?.trim() || '',
        isAvailable24x7: !!data.isAvailable24x7,
        isActive: !!data.isActive
      };

      console.log('Yuborilayotgan ma\'lumot:', doctorData);
      setDebugInfo(`Ma'lumot yuborilmoqda (${isEditing ? 'PUT' : 'POST'})...`);

      let response;
      let doctorId = isEditing && selectedDoctor ? (selectedDoctor._id || selectedDoctor.id) : null;

      if (isEditing && doctorId) {
        // Tahrirlash - subscription maydonlari bilan
        console.log(`Tahrirlash uchun ID: ${doctorId}`);
        response = await axios.put(
          `https://app.dentago.uz/api/admin/doctors/${doctorId}`,
          doctorData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
      } else {
        // Yangi qo'shish - subscription maydonlari bilan
        response = await axios.post(
          'https://app.dentago.uz/api/admin/doctors',
          doctorData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
      }

      console.log('Server response:', response.data);
      setDebugInfo(`Muvaffaqiyatli: ${response.status}`);

      if (response.status === 200 || response.status === 201) {
        // Tozalash
        reset();
        setSelectedFile(null);
        setPreviewUrl(null);
        setSelectedDoctor(null);
        setIsEditing(false);
        setShowForm(false);
        setIsFormCollapsed(true);

        // Ro'yxatni yangilash
        await fetchDoctors();

        setSubmitMessage({
          type: 'success',
          text: `✅ Shifokor ${isEditing ? 'tahrirlandi' : 'qo\'shildi'}!`
        });
      }
    } catch (err) {
      console.error('Form yuborishda xato:', err);
      console.error('Error response:', err.response?.data);

      let msg = 'Xatolik yuz berdi';

      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error response status:', err.response.status);

        if (err.response.status === 400) {
          msg = '❌ 400 Bad Request: ' + (err.response.data?.message || 'Maydonlar noto\'g\'ri yoki yetishmayapti');
        } else if (err.response.status === 401) {
          msg = '❌ Token noto\'g\'ri yoki muddati o\'tgan';
        } else if (err.response.status === 403) {
          msg = '❌ 403 Forbidden: Server ruxsat bermadi';
        } else if (err.response.status === 409) {
          msg = '❌ Bu ma\'lumot allaqachon mavjud';
        } else if (err.response.status === 404) {
          msg = '❌ 404 Not Found: URL topilmadi';
        } else if (err.response.status === 500) {
          msg = '❌ 500 Server Error: Ichki server xatosi';
        } else {
          msg = `❌ Server xatosi: ${err.response.status} - ${err.response.data?.message || ''}`;
        }
      } else if (err.code === 'ERR_NETWORK') {
        msg = '❌ Internet aloqasi uzildi yoki serverga ulanishda xato';
      } else if (err.code === 'ERR_BAD_REQUEST') {
        msg = '❌ Noto\'g\'ri so\'rov: Maydonlar noto\'g\'ri kiritilgan';
      }

      setDebugInfo(`Xato: ${msg}`);
      setSubmitMessage({ type: 'error', text: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const specialties = [
    'Terapevt',
    'Ortoped',
    'Ayol shifokor',
    'Bolalar stomatologi',
    'Хирург',
    'Ортодонт',
    'Пародонтолог',
    'Имплантолог',
    'Гигиенист',
    'Эндодонт',
    'Протезист',
    'Челюстно-лицевой хирург'
  ];

  // Formani yopish
  const handleCloseForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setSelectedDoctor(null);
    reset();
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsFormCollapsed(true);
    setSubmitMessage({ type: '', text: '' });
  };

  // Yangi shifokor qo'shish tugmasi
  const handleAddNewDoctor = () => {
    setIsEditing(false);
    setSelectedDoctor(null);
    setShowForm(true);
    setIsFormCollapsed(false);

    // Formani tozalash
    reset({
      fullName: '',
      gender: 'male',
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
    });
    setPreviewUrl(null);
    setSelectedFile(null);

    // Formaga scroll qilish
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Filtrlangan shifokorlar
  const filteredDoctors = doctors.filter(doctor => {
    const doctorName = (doctor.fullName || doctor.name || '').toLowerCase();
    const doctorSpecialty = (doctor.specialty || doctor.specialization || '').toLowerCase();
    const clinicName = (doctor.clinic?.name || doctor.hospitalName || '').toLowerCase();
    const search = searchTerm.toLowerCase();

    return (
      doctorName.includes(search) ||
      doctorSpecialty.includes(search) ||
      clinicName.includes(search)
    );
  });

  // Sahifalangan shifokorlar
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);

  // Shifokor kartasi komponenti
  const DoctorCard = ({ doctor, onView, onEdit, onDelete }) => {
    const doctorId = doctor._id || doctor.id;
    const doctorName = doctor.fullName || doctor.name || 'Noma\'lum Shifokor';
    const doctorSpecialty = doctor.specialty || doctor.specialization || 'Mutaxassislik kiritilmagan';
    const patientsCount = doctor.patientsCount || doctor.patients || 0;
    const experienceYears = doctor.experienceYears || doctor.experience || 0;
    const price = doctor.price || doctor.consultationPrice || 0;
    const rating = doctor.rating || 0;
    const reviewsCount = doctor.reviewsCount || doctor.reviews || 0;
    const avatar = doctor.avatar || doctor.profileImage || doctor.image || null;

    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 bg-gradient-to-r from-blue-50 to-cyan-50">
          {avatar ? (
            <img
              src={avatar}
              alt={doctorName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctorName)}&background=00BCE4&color=fff`;
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="w-16 h-16 text-gray-300" />
            </div>
          )}

          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-800 flex items-center gap-1">
              <MapIcon className="w-3 h-3" />
              {doctor.clinic?.distanceKm || 2.5} km
            </span>
          </div>

          <div className="absolute top-4 right-4">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-xl shadow-lg font-bold">
              {price > 0 ? (
                <div className="text-center">
                  <div className="text-lg">{price.toLocaleString()}</div>
                  <div className="text-xs opacity-90">so'm</div>
                </div>
              ) : (
                <div className="text-center px-3 py-1">
                  <div className="text-sm">Narx mavjud emas</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{doctorName}</h3>
            <div className="flex items-center gap-2 text-cyan-600 font-medium">
              <BriefcaseMedical className="w-4 h-4" />
              {doctorSpecialty}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">{patientsCount} ta bemor</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{experienceYears} yil tajriba</span>
              </div>
            </div>

            {rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-300 text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({reviewsCount} sharh)
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => doctorId && onView(doctorId)}
              disabled={!doctorId}
              className={`flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg ${
                !doctorId ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Eye className="w-4 h-4" />
              Profilni ko'rish
            </button>

            <button
              onClick={() => onEdit(doctor)}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
              title="Tahrirlash"
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              onClick={() => doctorId && onDelete(doctorId)}
              disabled={!doctorId}
              className={`px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors ${
                !doctorId ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="O'chirish"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-[#00BCE4]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Debug info */}
        {debugInfo && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            <strong>Debug Info:</strong> {debugInfo}
          </div>
        )}

        {/* Sarlavha */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Shifokorlar Boshqaruvi
              </h1>
              <p className="text-gray-600 mt-2">
                {doctors.length} ta shifokor, {filteredDoctors.length} ta topildi
              </p>
            </div>

            <button
              onClick={handleAddNewDoctor}
              className="bg-gradient-to-r from-[#00BCE4] to-[#0099CC] hover:from-[#00A8D4] hover:to-[#0088B3] text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              Yangi Shifokor Qo'shish
            </button>
          </div>

          {/* Qidiruv va token holati */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/3 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Shifokor ismi, mutaxassisligi yoki klinika nomi bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00BCE4] focus:border-transparent outline-none transition"
              />
            </div>

            {token ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3 text-green-700">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Token olindi ✓</h3>
                    <p className="text-sm text-green-600 mt-1">
                      {doctors.length} ta shifokor yuklandi
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-3 text-red-700">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Token olinmadi ✗</h3>
                    <p className="text-sm text-red-600 mt-1">
                      localStorage.setItem('accessToken', 'SIZNING_TOKENINGIZ')
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {submitMessage.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            submitMessage.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {submitMessage.text}
          </div>
        )}

        {/* Shifokorlar ro'yxati */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Barcha Shifokorlar</h2>

          {doctors.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Shifokorlar topilmadi</h3>
              <p className="text-gray-500 mb-4">
                Hali shifokor qo'shilmagan yoki yuklashda xatolik yuz berdi
              </p>
              <button
                onClick={fetchDoctors}
                className="bg-[#00BCE4] hover:bg-[#0099CC] text-white font-semibold py-2 px-6 rounded-xl transition-colors"
              >
                Qayta Yuklash
              </button>
            </div>
          ) : paginatedDoctors.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Qidiruv natijasi topilmadi</h3>
              <p className="text-gray-500">
                "{searchTerm}" bo'yicha hech narsa topilmadi
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedDoctors.map((doctor, index) => (
                  <DoctorCard
                    key={doctor._id || doctor.id || index}
                    doctor={doctor}
                    onView={handleViewDoctor}
                    onEdit={handleEditDoctor}
                    onDelete={handleDeleteDoctor}
                  />
                ))}
              </div>

              {/* Sahifalash */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition ${
                          currentPage === pageNum
                            ? 'bg-[#00BCE4] text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {totalPages > 5 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Forma qismi */}
        {showForm && (
          <div ref={formRef} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 mb-8">
            {/* Form sarlavhasi */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {isEditing ? 'Shifokorni Tahrirlash' : 'Yangi Shifokor Qo\'shish'}
                </h2>
                {isEditing && selectedDoctor && (
                  <p className="text-gray-600 mt-1">
                    ID: {selectedDoctor._id || selectedDoctor.id}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFormCollapsed(!isFormCollapsed)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title={isFormCollapsed ? "Formani ko'rsatish" : "Formani yashirish"}
                >
                  {isFormCollapsed ? <ArrowUp className="w-5 h-5 transform rotate-180" /> : <ArrowUp className="w-5 h-5" />}
                </button>

                <button
                  onClick={handleCloseForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title="Formani yopish"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form mazmuni */}
            {!isFormCollapsed && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Rasm yuklash */}
                <div className="flex flex-col items-center mb-8">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-32 h-32 rounded-[10px] overflow-hidden bg-gray-200 cursor-pointer hover:opacity-90 transition border-2 border-[#00BCE4] relative shadow-md"
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent('Doctor')}&background=00BCE4&color=fff`;
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                        <UserCircle className="w-10 h-10 mb-1" />
                        <span className="text-xs">Rasm yuklash</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : (isEditing && selectedDoctor?.avatar) ? 'Joriy rasm' : 'Shifokor rasmini tanlang'}
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

                  {/* Jins */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Jins *
                    </label>
                    <div className="flex gap-8">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="male"
                          {...register('gender', { required: 'Jinsni tanlang' })}
                          className="w-5 h-5 text-[#00BCE4]"
                        />
                        <span>Erkak</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="female"
                          {...register('gender', { required: 'Jinsni tanlang' })}
                          className="w-5 h-5 text-[#00BCE4]"
                        />
                        <span>Ayol</span>
                      </label>
                    </div>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
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
                            message: 'Noto\'g\'ri email formati'
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
                      {...register('specialty', { required: 'Mutaxassislikni tanlang' })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00BCE4] outline-none transition"
                    >
                      <option value="">Tanlang...</option>
                      {specialties.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                    {errors.specialty && (
                      <p className="mt-1 text-sm text-red-600">{errors.specialty.message}</p>
                    )}
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
                          required: 'Tajriba majburiy',
                          min: { value: 0, message: 'Musbat son kiriting' },
                          max: { value: 50, message: '50 yildan kam bo\'lishi kerak' }
                        })}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.experienceYears ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        } focus:ring-2 focus:ring-[#00BCE4] outline-none transition`}
                      />
                      {errors.experienceYears && (
                        <p className="mt-1 text-sm text-red-600">{errors.experienceYears.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Star className="w-4 h-4" /> Reyting *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        {...register('rating', {
                          required: 'Reyting majburiy',
                          min: { value: 0, message: '0 dan kam bo\'lmasligi kerak' },
                          max: { value: 5, message: '5 dan ko\'p bo\'lmasligi kerak' }
                        })}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.rating ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        } focus:ring-2 focus:ring-[#00BCE4] outline-none transition`}
                      />
                      {errors.rating && (
                        <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
                      )}
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
                      {...register('clinicName', {
                        required: 'Klinika nomi majburiy',
                        minLength: { value: 2, message: 'Kamida 2 ta belgi' }
                      })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.clinicName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      } focus:ring-2 focus:ring-[#00BCE4] outline-none transition`}
                      placeholder="Stomatologiya Premium"
                    />
                    {errors.clinicName && (
                      <p className="mt-1 text-sm text-red-600">{errors.clinicName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Manzil *
                    </label>
                    <input
                      {...register('clinicAddress', {
                        required: 'Manzil majburiy',
                        minLength: { value: 5, message: 'Kamida 5 ta belgi' }
                      })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.clinicAddress ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      } focus:ring-2 focus:ring-[#00BCE4] outline-none transition`}
                      placeholder="Toshkent sh., Chilanzor tumani, 45-uy"
                    />
                    {errors.clinicAddress && (
                      <p className="mt-1 text-sm text-red-600">{errors.clinicAddress.message}</p>
                    )}
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
                      {...register('price', {
                        required: 'Narx majburiy',
                        min: { value: 0, message: 'Musbat son kiriting' }
                      })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      } focus:ring-2 focus:ring-[#00BCE4] outline-none transition`}
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                    )}
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
                        {...register('patientsCount', { min: 0 })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#00BCE4] outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> Sharhlar soni
                      </label>
                      <input
                        type="number"
                        {...register('reviewsCount', { min: 0 })
                        }
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
                        {isEditing ? 'O\'zgarishlarni Saqlash' : 'Shifokorni Saqlash'}
                      </>
                    )}
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    * bilan belgilangan maydonlar majburiy
                  </p>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Shifokorni ko'rish modal oynasi */}
        {isViewModalOpen && viewDoctor && (
          <div className="fixed inset-0 bg-opacity-10 flex items-center backdrop-blur-sm justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Shifokor Profili</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {/* Profil ma'lumotlari */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border-4 border-white shadow-lg">
                      {viewDoctor.avatar || viewDoctor.profileImage || viewDoctor.image ? (
                        <img
                          src={viewDoctor.avatar || viewDoctor.profileImage || viewDoctor.image}
                          alt={viewDoctor.fullName || viewDoctor.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(viewDoctor.fullName || viewDoctor.name || 'Doctor')}&background=00BCE4&color=fff`;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-16 h-16 text-gray-300" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {viewDoctor.fullName || viewDoctor.name || 'Noma\'lum Shifokor'}
                    </h3>
                    <div className="flex items-center gap-3 text-cyan-600 font-semibold mb-4">
                      <BriefcaseMedical className="w-5 h-5" />
                      {viewDoctor.specialty || viewDoctor.specialization || 'Mutaxassislik kiritilmagan'}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                        {viewDoctor.gender === 'male' ? 'Erkak' : 'Ayol'}
                      </div>
                      <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-medium">
                        {viewDoctor.experienceYears || viewDoctor.experience || 0} yil tajriba
                      </div>
                      {viewDoctor.isAvailable24x7 && (
                        <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium">
                          24/7 Mavjud
                        </div>
                      )}
                      <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        viewDoctor.isActive !== false
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {viewDoctor.isActive !== false ? 'Faol' : 'Faol emas'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistikalar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      {(viewDoctor.patientsCount || viewDoctor.patients || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Bemorlar</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      {(viewDoctor.rating || 0).toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Reyting</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      {(viewDoctor.reviewsCount || viewDoctor.reviews || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Sharhlar</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      {viewDoctor.price ? `${viewDoctor.price.toLocaleString()} so'm` : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Narx</div>
                  </div>
                </div>

                {/* Kontakt ma'lumotlari */}
                <div className="space-y-4 mb-8">
                  <h4 className="text-lg font-semibold text-gray-800 border-l-4 border-cyan-500 pl-3">
                    Kontakt Ma'lumotlari
                  </h4>

                  <div className="space-y-3">
                    {viewDoctor.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">{viewDoctor.phone}</span>
                      </div>
                    )}

                    {viewDoctor.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">{viewDoctor.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Klinika ma'lumotlari */}
                <div className="space-y-4 mb-8">
                  <h4 className="text-lg font-semibold text-gray-800 border-l-4 border-cyan-500 pl-3">
                    Klinika Ma'lumotlari
                  </h4>

                  <div className="bg-gray-50 p-5 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Building className="w-5 h-5 text-cyan-600" />
                      <span className="font-semibold text-gray-800">
                        {viewDoctor.clinic?.name || viewDoctor.hospitalName || 'Klinika nomi kiritilmagan'}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-700">
                          {viewDoctor.clinic?.address || viewDoctor.address || 'Manzil kiritilmagan'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Masofa: {viewDoctor.clinic?.distanceKm || 2.5} km
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ish vaqti */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 border-l-4 border-cyan-500 pl-3">
                    Ish Vaqti
                  </h4>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-green-500" />
                      <span className="font-medium">
                        {viewDoctor.workTime?.start || viewDoctor.workHours?.start || '09:00'}
                      </span>
                    </div>
                    <div className="text-gray-400">—</div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-red-500" />
                      <span className="font-medium">
                        {viewDoctor.workTime?.end || viewDoctor.workHours?.end || '18:00'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tavsif */}
                {viewDoctor.description && (
                  <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-2">Qo'shimcha Ma'lumot</h4>
                    <p className="text-gray-700">{viewDoctor.description}</p>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      handleEditDoctor(viewDoctor);
                    }}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Edit className="w-4 h-4" />
                    Tahrirlash
                  </button>

                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      handleDeleteDoctor(viewDoctor._id || viewDoctor.id);
                    }}
                    className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    O'chirish
                  </button>
                </div>
              </div>
            </div>
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
