import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Bemorlarim() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal uchun state'lar
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

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

  // Bekor qilish funksiyasi
  const handleCancel = async (id) => {
    if (!window.confirm("Bu navbatni bekor qilishni xohlaysizmi?")) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');

      // API so'rovini sinab ko'rish - turli variantlar
      const endpoints = [
        { method: 'PUT', url: `https://app.dentago.uz/api/admin/appointments/${id}` },
        { method: 'PATCH', url: `https://app.dentago.uz/api/admin/appointments/${id}` },
        { method: 'POST', url: `https://app.dentago.uz/api/admin/appointments/${id}/cancel` },
        { method: 'PUT', url: `https://app.dentago.uz/api/admin/appointments/${id}/status` },
        { method: 'PATCH', url: `https://app.dentago.uz/api/admin/appointments/${id}/status` },
      ];

      let success = false;
      let usedMethod = '';

      for (const endpoint of endpoints) {
        try {
          console.log(`Sinab ko'rmoqda: ${endpoint.method} ${endpoint.url}`);

          const response = await axios({
            method: endpoint.method,
            url: endpoint.url,
            data: endpoint.method === 'POST' || endpoint.method === 'PUT' || endpoint.method === 'PATCH'
              ? { status: 'cancelled' }
              : {},
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            timeout: 5000,
          });

          console.log("Javob:", response.data);

          if (response.data?.success || response.status === 200) {
            // Ro'yxatni yangilash
            setAppointments(prev => prev.map(app =>
              app._id === id ? { ...app, status: 'cancelled' } : app
            ));

            // Agar modal ochiq bo'lsa, modaldagi ma'lumotni ham yangilash
            if (selectedAppointment && selectedAppointment._id === id) {
              setSelectedAppointment(prev => ({ ...prev, status: 'cancelled' }));
            }

            alert(`Navbat muvaffaqiyatli bekor qilindi (${endpoint.method})`);
            success = true;
            usedMethod = endpoint.method;
            break;
          }
        } catch (err) {
          console.log(`${endpoint.method} ${endpoint.url} ishlamadi:`, err.response?.status || err.message);
        }
      }

      if (!success) {
        alert("Navbatni bekor qilib bo'lmadi. Iltimos, server administratoriga murojaat qiling.");
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

      alert("Navbat muvaffaqiyatli o'chirildi");
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
      case 'cancelled': return 'bg-red-500';
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Yuklanmoqda...</div>;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md w-full">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchAppointments}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Bemorlar Navbatlari</h1>
        <p className="text-gray-600 mt-2">Jami: {appointments.length} ta</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((appointment) => (
          <div
            key={appointment._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className={`h-2 ${getStatusStyle(appointment.status)}`}></div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {appointment.patient?.fullName || 'Noma\'lum bemor'}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusStyle(appointment.status)}`}>
                  {getStatusText(appointment.status)}
                </span>
              </div>

              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="text-gray-500">Sana:</span>{' '}
                  {formatDate(appointment.appointmentDate)} {formatTime(appointment.appointmentTime)}
                </p>
                <p>
                  <span className="text-gray-500">Telefon:</span>{' '}
                  {appointment.patient?.phone || '—'}
                </p>
                <p>
                  <span className="text-gray-500">Xizmat:</span>{' '}
                  {appointment.service || '—'}
                </p>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => handleViewDetails(appointment)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition font-medium"
                >
                  To'liq ko'rish
                </button>

                {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                  <button
                    onClick={() => handleCancel(appointment._id)}
                    className="bg-orange-50 hover:bg-orange-100 text-orange-600 p-2.5 rounded-lg transition flex items-center justify-center w-11 h-11"
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
                  className="bg-red-50 hover:bg-red-100 text-red-600 p-2.5 rounded-lg transition flex items-center justify-center w-11 h-11"
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

      {/* ================= MODAL ================= */}
      {(selectedAppointment || modalLoading || modalError) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-5 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">To'liq ma'lumot</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {modalLoading ? (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
                </div>
              ) : modalError ? (
                <p className="text-red-600 text-center py-8">{modalError}</p>
              ) : selectedAppointment ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-500 mb-1">Bemor</p>
                      <p className="font-medium">{selectedAppointment.patient?.fullName || '—'}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Telefon: {selectedAppointment.patient?.phone || '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 mb-1">Holati</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusStyle(selectedAppointment.status)}`}>
                        {getStatusText(selectedAppointment.status)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-500 mb-1">Sana va vaqt</p>
                      <p className="font-medium">
                        {formatDate(selectedAppointment.appointmentDate)} • {formatTime(selectedAppointment.appointmentTime)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 mb-1">Xizmat turi</p>
                      <p className="font-medium">{selectedAppointment.service || '—'}</p>
                    </div>
                  </div>

                  {selectedAppointment.doctor && (
                    <div className="pt-4 border-t">
                      <p className="text-gray-500 mb-2">Shifokor</p>
                      <p className="font-medium">{selectedAppointment.doctor.fullName}</p>
                      <p className="text-sm text-gray-600">{selectedAppointment.doctor.specialty}</p>
                    </div>
                  )}

                  {selectedAppointment.comment && (
                    <div className="pt-4 border-t">
                      <p className="text-gray-500 mb-2">Izoh</p>
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedAppointment.comment}</p>
                    </div>
                  )}

                  {selectedAppointment.doctor?.clinic && (
                    <div className="pt-4 border-t">
                      <p className="text-gray-500 mb-2">Klinika</p>
                      <p className="font-medium">{selectedAppointment.doctor.clinic.name}</p>
                      <p className="text-sm text-gray-600">{selectedAppointment.doctor.clinic.address}</p>
                    </div>
                  )}

                  {/* Modal ichida bekor qilish tugmasi */}
                  {selectedAppointment.status !== 'cancelled' && selectedAppointment.status !== 'completed' && (
                    <div className="pt-6 border-t flex gap-3">
                      <button
                        onClick={() => handleCancel(selectedAppointment._id)}
                        className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg transition font-medium flex-1"
                      >
                        Bekor qilish
                      </button>
                      <button
                        onClick={() => handleDelete(selectedAppointment._id)}
                        className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition font-medium flex-1"
                      >
                        O'chirish
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bemorlarim;
