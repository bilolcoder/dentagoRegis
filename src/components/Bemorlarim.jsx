import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Bemorlarim() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');

      // LocalStorage'dan tokenni olish
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setError('Token topilmadi. Iltimos, tizimga kiring.');
        setLoading(false);
        return;
      }

      // API so'rovi
      const response = await axios.get('http://app.dentago.uz/api/admin/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response:', response.data);

      // Ma'lumotlarni tekshirish
      if (response.data && response.data.success === true) {
        setAppointments(response.data.data || []);
      } else {
        setError('Ma\'lumotlar formati noto\'g\'ri');
      }
    } catch (err) {
      console.error('API xatosi:', err);
      setError('Ma\'lumotlarni yuklashda xatolik: ' + (err.message || 'Noma\'lum xato'));
    } finally {
      setLoading(false);
    }
  };

  // Formatlash funksiyalari
  const formatDate = (dateString) => {
    if (!dateString) return 'Sana ko\'rsatilmagan';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('uz-UZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Kutilmoqda';
      case 'confirmed': return 'Tasdiqlangan';
      case 'completed': return 'Bajarildi';
      case 'cancelled': return 'Bekor qilingan';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-red-500 text-center mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Xatolik</h3>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={fetchAppointments}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Navbatlar yo'q</h3>
          <p className="text-gray-600">Hozircha hech qanday navbat mavjud emas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Sarlavha */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Bemorlar Navbatlari</h1>
        <p className="text-gray-600 mt-1">Jami: {appointments.length} ta navbat</p>
      </div>

      {/* Bemorlar kartalari */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((appointment) => (
          <div
            key={appointment._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Status bar */}
            <div className={`h-2 ${getStatusStyle(appointment.status)}`}></div>

            {/* Card content */}
            <div className="p-5">
              {/* Bemor ismi va sana */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {appointment.patient?.fullName || 'Ism ko\'rsatilmagan'}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {formatDate(appointment.appointmentDate)} • {formatTime(appointment.appointmentTime)}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusStyle(appointment.status)}`}>
                  {getStatusText(appointment.status)}
                </span>
              </div>

              {/* Telefon raqami */}
              <div className="mb-3">
                <p className="text-gray-500 text-sm">Telefon</p>
                <p className="text-gray-800 font-medium">
                  {appointment.patient?.phone || 'Ko\'rsatilmagan'}
                </p>
              </div>

              {/* Shifokor ma'lumotlari */}
              {appointment.doctor && (
                <div className="mb-3">
                  <p className="text-gray-500 text-sm">Shifokor</p>
                  <p className="text-gray-800 font-medium">
                    {appointment.doctor.fullName || 'Ko\'rsatilmagan'}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {appointment.doctor.specialty || 'Mutaxassislik ko\'rsatilmagan'}
                  </p>
                </div>
              )}

              {/* Xizmat ma'lumotlari */}
              <div className="mb-3">
                <p className="text-gray-500 text-sm">Xizmat turi</p>
                <p className="text-gray-800 font-medium">
                  {appointment.service || 'Xizmat ko\'rsatilmagan'}
                </p>
                {appointment.doctor?.price && (
                  <p className="text-blue-600 font-bold mt-1">
                    {Number(appointment.doctor.price).toLocaleString('uz-UZ')} so'm
                  </p>
                )}
              </div>

              {/* Izoh */}
              {appointment.comment && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-gray-500 text-sm mb-1">Izoh</p>
                  <p className="text-gray-700 text-sm">{appointment.comment}</p>
                </div>
              )}

              {/* Klinika ma'lumoti */}
              {appointment.doctor?.clinic && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-gray-500 text-sm mb-1">Klinika</p>
                  <p className="text-gray-700 text-sm font-medium">
                    {appointment.doctor.clinic.name || 'Klinika ko\'rsatilmagan'}
                  </p>
                  <p className="text-gray-600 text-xs">
                    {appointment.doctor.clinic.address || 'Manzil ko\'rsatilmagan'}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bemorlarim;
