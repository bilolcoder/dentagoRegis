import React, { useState, useEffect } from 'react';
import { Package, Loader2, ArrowLeft } from 'lucide-react'; // ArrowLeft qo'shildi
import { useNavigate } from 'react-router-dom'; // Orqaga o'tish uchun
import axios from 'axios';

function Cards() {
  const BASE_URL = "https://app.dentago.uz";
  const navigate = useNavigate(); // React Routerdan foydalanamiz

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('accessToken') || 
                    localStorage.getItem('token') || 
                    localStorage.getItem('authToken') || 
                    localStorage.getItem('jwt');

      if (!token) {
        throw new Error("Token topilmadi! Tizimga qayta kiring.");
      }

      const response = await axios.get(`${BASE_URL}/api/order/history`, {
        params: { page: 1, limit: 50 },
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.data.success) {
        throw new Error("Ma'lumotlar olinmadi");
      }

      const ordersData = Array.isArray(response.data.data) ? response.data.data : [];

      const mappedOrders = ordersData.map(order => {
        const firstItem = order.items?.[0] || {};
        const snapshot = firstItem.productSnapshot || {};

        // Rasm URL — to'g'ri yo'l: /uploads emas, /images bo'lishi mumkin
        const imgName = Array.isArray(snapshot.imageUrl) 
          ? snapshot.imageUrl[0] 
          : (typeof snapshot.imageUrl === 'string' ? snapshot.imageUrl : null);

        const finalImg = imgName ? `${BASE_URL}/images/${imgName}` : null;

        return {
          id: order._id,
          orderNumber: order.orderNumber || order._id.slice(-8).toUpperCase(),
          mahsulotNomi: snapshot.name || "Noma'lum mahsulot",
          mahsulotNarxi: snapshot.price || 0,
          soni: firstItem.quantity || 1,
          rasmi: finalImg,
          tadbirkor: snapshot.company || "Dentago",
        };
      });

      setOrders(mappedOrders);

      // Console log — tekshirish uchun
      mappedOrders.forEach((order, index) => {
        console.log(`Buyurtma ${index + 1}:`);
        console.log("Mahsulot nomi:", order.mahsulotNomi);
        console.log("Rasm URL:", order.rasmi);
        console.log("Narxi:", order.mahsulotNarxi);
        console.log("-------------------");
      });

    } catch (err) {
      console.error("Xatolik:", err);
      setError(err.message || "Internet yoki server bilan muammo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Orqaga o'tish funksiyasi
  const handleGoBack = () => {
    navigate(-1); // Oldingi sahifaga qaytadi
    // Agar ma'lum bir sahifaga qaytmoqchi bo'lsangiz:
    // navigate('/dashboard'); yoki navigate('/home');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-[#00BCE4]" />
        <p className="ml-4 text-xl font-medium text-slate-600">Yuklanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-600 font-bold text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Orqaga tugmasi + Sarlavha */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleGoBack}
            className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all hover:bg-gray-50 border border-gray-200 flex items-center gap-2 text-gray-700 font-medium"
          >
            <ArrowLeft size={20} />
            Orqaga
          </button>

          <div className="flex-1 flex items-center justify-between">
            <h1 className="text-3xl font-black text-slate-800">
              Buyurtmalar <span className="text-[#00BCE4]">Ro'yxati</span>
            </h1>
            <span className="bg-[#00BCE4] text-white px-6 py-3 rounded-full text-lg font-bold shadow-md">
              {orders.length} ta
            </span>
          </div>
        </div>

        {/* Cardlar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {orders.length > 0 ? orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col group"
            >
              {/* Rasm */}
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                {order.rasmi ? (
                  <img
                    src={order.rasmi}
                    alt={order.mahsulotNomi}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Rasm+yuklanmadi";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <Package size={60} />
                    <p className="mt-3 text-sm">Rasm yo'q</p>
                  </div>
                )}

                <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm">
                  {order.soni} ta
                </div>
              </div>

              {/* Matn */}
              <div className="p-6 flex flex-col space-y-4">
                <h3 className="text-lg font-extrabold text-slate-800 line-clamp-2">
                  {order.mahsulotNomi}
                </h3>

                <p className="text-sm text-slate-500 font-medium">
                  {order.tadbirkor}
                </p>

                <div className="mt-auto">
                  <p className="text-2xl font-black text-[#00BCE4]">
                    {order.mahsulotNarxi.toLocaleString()} so'm
                  </p>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-32">
              <Package size={100} className="mx-auto text-gray-300 mb-8" />
              <p className="text-2xl font-bold text-gray-400">Hech qanday buyurtma topilmadi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cards;