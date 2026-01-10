import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

function Bemorlarim() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // View mode: 'card' yoki 'table'
  const [viewMode, setViewMode] = useState('card');

  // Modal uchun state'lar
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Bekor qilish modali uchun state'lar
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false); // ✅ Yangi loading state

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Token topilmadi. Iltimos, qayta tizimga kiring.');
        return;
      }

      const response = await axios.get(
        'https://app.dentago.uz/api/admin/appointments',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          timeout: 15000,
        }
      );

      if (response.data?.success) {
        setAppointments(response.data.data || response.data.appointments || response.data || []);
      } else if (Array.isArray(response.data)) {
        setAppointments(response.data);
      } else {
        setError('Ma\'lumotlar formati kutilmagan');
      }
    } catch (err) {
      let errorMsg = 'Ma\'lumotlarni yuklab bo\'lmadi';
      if (err.response) {
        errorMsg = err.response.data?.message || `Server xatosi: ${err.response.status}`;
      } else if (err.request) {
        errorMsg = 'Serverga ulanib bo\'lmadi (CORS yoki tarmoq muammosi)';
      } else {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // To'liq ma'lumotni olish
  const fetchAppointmentById = async (id) => {
    try {
      setModalLoading(true);
      setModalError('');
      setSelectedAppointment(null);

      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `https://app.dentago.uz/api/admin/appointments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          timeout: 10000,
        }
      );

      if (response.data?.success) {
        setSelectedAppointment(response.data.data || response.data);
      } else {
        setModalError('To\'liq ma\'lumot yuklanmadi');
      }
    } catch (err) {
      let msg = 'To\'liq ma\'lumotni yuklab bo\'lmadi';
      if (err.response) {
        msg = err.response.data?.message || `Xato: ${err.response.status}`;
      } else if (err.request) {
        msg = 'Server bilan aloqa muammosi';
      } else {
        msg = err.message;
      }
      setModalError(msg);
    } finally {
      setModalLoading(false);
    }
  };

  // Bekor qilish modali ochish
  const handleCancel = (id) => {
    setCancelId(id);
    setIsCancelModalOpen(true);
    reset(); // Formani tozalash
  };

  // Bekor qilish sababini yuborish va statusni o'zgartirish
  const onCancelSubmit = async (data) => {
    try {
      setIsCancelling(true); // ✅ Loading boshlash

      const token = localStorage.getItem('accessToken');

      const response = await axios.put(
        `https://app.dentago.uz/api/admin/appointments/${cancelId}/status`,
        {
          status: 'cancelled',
          cancellationReason: data.cancellationReason || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        }
      );

      if (response.data?.success || response.status === 200) {
        // Ro'yxatni yangilash
        setAppointments(prev => prev.map(app =>
          app._id === cancelId ? { ...app, status: 'cancelled' } : app
        ));

        // Agar modal ochiq bo'lsa, modaldagi ma'lumotni ham yangilash
        if (selectedAppointment && selectedAppointment._id === cancelId) {
          setSelectedAppointment(prev => ({ ...prev, status: 'cancelled' }));
        }

        setIsCancelModalOpen(false);
        reset();
      } else {
        alert("Navbatni bekor qilib bo'lmadi.");
      }
    } catch (err) {
      console.error("Bekor qilish xatosi:", err);
      let msg = "Navbatni bekor qilib bo'lmadi";
      if (err.response) {
        msg += `: ${err.response.status} - ${err.response.data?.message || 'Server xatosi'}`;
      } else if (err.request) {
        msg += " (Serverga ulanib bo'lmadi)";
      } else {
        msg += `: ${err.message}`;
      }
      alert(msg);
    } finally {
      setIsCancelling(false); // ✅ Loading tugashi
    }
  };

  // O'chirish funksiyasi
  const handleDelete = async (id) => {
    if (!window.confirm("Bu navbatni o'chirishni xohlaysizmi?")) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(
        `https://app.dentago.uz/api/admin/appointments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      // Muvaffaqiyatli o'chirilgandan keyin ro'yxatni yangilash
      setAppointments(prev => prev.filter(app => app._id !== id));

      // Agar modal ochiq bo'lsa va o'chirilayotgan element modalda ko'rinayotgan bo'lsa, modalni yopish
      if (selectedAppointment && selectedAppointment._id === id) {
        closeModal();
      }

    } catch (err) {
      console.error("O'chirish xatosi:", err);
      let msg = "Navbatni o'chirib bo'lmadi";
      if (err.response) {
        msg += `: ${err.response.status} - ${err.response.data?.message || 'Server xatosi'}`;
      } else if (err.request) {
        msg += " (Serverga ulanib bo'lmadi)";
      } else {
        msg += `: ${err.message}`;
      }
      alert(msg);
    }
  };

  const handleViewDetails = (appointment) => {
    fetchAppointmentById(appointment._id);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setModalError('');
    setModalLoading(false);
  };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setCancelId(null);
    setIsCancelling(false); // ✅ Loading ni tozalash
    reset();
  };

  // Format funksiyalari
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '—';
      return date.toLocaleDateString('uz-UZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return String(dateString);
    }
  };

  const formatTime = (timeString) => (timeString ? timeString.substring(0, 5) : '');

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'Kutilmoqda';
      case 'confirmed': return 'Tasdiqlangan';
      case 'completed': return 'Bajarildi';
      case 'cancelled': return 'Bekor qilingan';
      default: return status || 'Noma\'lum';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00BCE4] mb-4"></div>
        <p className="text-gray-600">Yuklanmoqda...</p>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full border border-gray-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 mb-6 font-medium">{error}</p>
          <button
            onClick={fetchAppointments}
            className="bg-[#00BCE4] hover:bg-[#00a8cc] text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-5">
      <div className="mb-8 md:mb-10">
        <div className="flex flex-col lg:flex-row justify-between border-b pb-4 gap-4">
          {/* Sarlavha qismi */}
          <div className="text-left">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 tracking-tight">
              Bemorlar Navbatlari
            </h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              Jami: <span className="font-semibold text-gray-800">{appointments.length} ta</span>
            </p>
          </div>

          {/* Tugmalar qismi */}
          <div className="flex flex-wrap items-center gap-3 justify-start md:justify-start">
            {/* View toggle buttons */}
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setViewMode('card')}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-all duration-300 text-sm md:text-base ${
                  viewMode === 'card'
                    ? 'bg-white text-[#00BCE4] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="hidden xs:block">Kartalar</span>
              </button>

              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-all duration-300 text-sm md:text-base ${
                  viewMode === 'table'
                    ? 'bg-white text-[#00BCE4] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="hidden xs:block">Jadval</span>
              </button>
            </div>

            {/* Yangilash tugmasi */}
            <button
              onClick={fetchAppointments}
              className="bg-[#00BCE4] hover:bg-[#00a8cc] text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 text-sm md:text-base shadow-md active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Yangilash
            </button>
          </div>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#00BCE4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Navbatlar topilmadi</h3>
          <p className="text-gray-600">Hozircha hech qanday navbat mavjud emas</p>
        </div>
      ) : viewMode === 'card' ? (
        // CARD VIEW
        <div className="grid grid-cols-3 md:grid-cols-1 sm:grid-cols-2 max-sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#00BCE4] transition-colors">
                      {appointment.patient?.fullName || 'Noma\'lum bemor'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{appointment.patient?.phone || '—'}</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white ${getStatusStyle(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </div>

                <div className="space-y-3 text-gray-700 mb-6">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00BCE4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(appointment.appointmentDate)} • {formatTime(appointment.appointmentTime)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00BCE4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>{appointment.service || '—'}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewDetails(appointment)}
                    className="flex-1 bg-[#00BCE4] hover:bg-[#00a8cc] text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    To'liq ko'rish
                  </button>

                  {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                    <button
                      onClick={() => handleCancel(appointment._id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 p-3 rounded-xl transition-all duration-300 flex items-center justify-center w-12 h-12"
                      title="Bekor qilish"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(appointment._id)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-xl transition-all duration-300 flex items-center justify-center w-12 h-12"
                    title="O'chirish"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // TABLE VIEW
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Bemor
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Telefon
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Sana & Vaqt
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Xizmat
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Holati
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Harakatlar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
                          <span className="text-[#00BCE4] font-semibold">
                            {appointment.patient?.fullName?.charAt(0) || 'N'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.patient?.fullName || 'Noma\'lum bemor'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.patient?.phone || '—'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(appointment.appointmentDate)}</div>
                      <div className="text-sm text-gray-500">{formatTime(appointment.appointmentTime)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.service || '—'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getStatusStyle(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(appointment)}
                          className="text-[#00BCE4] hover:text-[#00a8cc] bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-all duration-300"
                          title="To'liq ko'rish"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                          <button
                            onClick={() => handleCancel(appointment._id)}
                            className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-all duration-300"
                            title="Bekor qilish"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(appointment._id)}
                          className="text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-all duration-300"
                          title="O'chirish"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {(selectedAppointment || modalLoading || modalError) && (
        <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-gray-800">To'liq ma'lumot</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-full transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {modalLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00BCE4] mb-4"></div>
                  <p className="text-gray-600 font-medium">Yuklanmoqda...</p>
                </div>
              ) : modalError ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-red-600 font-medium">{modalError}</p>
                </div>
              ) : selectedAppointment ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-5 rounded-xl">
                      <p className="text-gray-500 text-sm mb-1">Bemor</p>
                      <p className="font-bold text-lg text-gray-800">{selectedAppointment.patient?.fullName || '—'}</p>
                      <p className="text-gray-600 mt-2">
                        <span className="font-medium">Telefon:</span> {selectedAppointment.patient?.phone || '—'}
                      </p>
                    </div>

                    <div className="bg-blue-50 p-5 rounded-xl">
                      <p className="text-gray-500 text-sm mb-1">Holati</p>
                      <span className={`inline-block px-4 py-2 rounded-full font-semibold text-white ${getStatusStyle(selectedAppointment.status)}`}>
                        {getStatusText(selectedAppointment.status)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-5 rounded-xl">
                      <p className="text-gray-500 text-sm mb-1">Sana va vaqt</p>
                      <p className="font-medium text-lg">
                        {formatDate(selectedAppointment.appointmentDate)} • {formatTime(selectedAppointment.appointmentTime)}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-xl">
                      <p className="text-gray-500 text-sm mb-1">Xizmat turi</p>
                      <p className="font-medium text-lg">{selectedAppointment.service || '—'}</p>
                    </div>
                  </div>

                  {selectedAppointment.doctor && (
                    <div className="bg-gradient-to-r from-blue-50 to-white p-5 rounded-xl border border-blue-100">
                      <p className="text-gray-500 text-sm mb-2">Shifokor</p>
                      <p className="font-bold text-lg text-gray-800">{selectedAppointment.doctor.fullName}</p>
                      <p className="text-[#00BCE4] font-medium mt-1">{selectedAppointment.doctor.specialty}</p>
                    </div>
                  )}

                  {selectedAppointment.comment && (
                    <div className="bg-white border border-gray-200 p-5 rounded-xl">
                      <p className="text-gray-500 text-sm mb-2">Izoh</p>
                      <p className="text-gray-700 whitespace-pre-wrap whitespace-pre-wrap break-words bg-gray-50 p-4 rounded-lg">{selectedAppointment.comment}</p>
                    </div>
                  )}

                  {selectedAppointment.doctor?.clinic && (
                    <div className="bg-white border border-gray-200 p-5 rounded-xl">
                      <p className="text-gray-500 text-sm mb-2">Klinika</p>
                      <p className="font-bold text-gray-800">{selectedAppointment.doctor.clinic.name}</p>
                      <p className="text-gray-600 mt-1">{selectedAppointment.doctor.clinic.address}</p>
                    </div>
                  )}

                  {/* Modal ichida bekor qilish va o'chirish tugmalari */}
                  <div className="pt-6 border-t border-gray-200 flex gap-4">
                    {selectedAppointment.status !== 'cancelled' && selectedAppointment.status !== 'completed' && (
                      <button
                        onClick={() => handleCancel(selectedAppointment._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Bekor qilish
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(selectedAppointment._id)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      O'chirish
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* ================= BEKOR QILISH SABABI MODALI ================= */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-gray-800">Bekor qilish</h2>
              <button
                onClick={closeCancelModal}
                className="text-gray-400 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isCancelling}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit(onCancelSubmit)}>
                <h1 className="text-xl font-semibold text-gray-800 mb-4">Nimaga bekor qilyapsiz?</h1>
                <textarea
                  {...register('cancellationReason', { required: 'Sababni kiriting' })}
                  className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00BCE4] focus:border-transparent resize-none disabled:opacity-70 disabled:cursor-not-allowed"
                  placeholder="Bekor qilish sababini yozing..."
                  disabled={isCancelling}
                ></textarea>
                {errors.cancellationReason && (
                  <p className="text-red-600 text-sm mt-2">{errors.cancellationReason.message}</p>
                )}

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={closeCancelModal}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-200"
                    disabled={isCancelling}
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="bg-[#00BCE4] hover:bg-[#00a8cc] text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 min-w-[120px] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#00BCE4]"
                    disabled={isCancelling}
                  >
                    {isCancelling ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Yuborilmoqda...
                      </>
                    ) : (
                      'Yuborish'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Bemorlarim;
