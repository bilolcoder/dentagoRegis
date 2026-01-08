import React, { useState, useEffect } from 'react';
import { MdDeleteOutline, MdCheck } from "react-icons/md";
import { Search, Filter, Download, MoreHorizontal, Package, Truck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Aperator() {
  const navigate = useNavigate();
  const PRIMARY_COLOR = "#00BCE4";
  const BASE_URL = "https://app.dentago.uz";

  // Statelar
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeMenu, setActiveMenu] = useState(null); // Qaysi qator menyusi ochiqligini saqlaydi

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

                  
      const token = localStorage.getItem('accessToken');

      if (!token) {
        throw new Error("Token topilmadi! Tizimga qayta kiring.");
      }

      const response = await axios.get(`${BASE_URL}/api/order/history`, {
        params: { page: 1, limit: 10 },
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = response.data;

      if (!result.success) {
        throw new Error(result.message || "Ma'lumotlar olinmadi");
      }

      const ordersData = Array.isArray(result.data) ? result.data : [];

      const mappedOrders = ordersData.map(order => {
        const firstItem = order.items?.[0] || {};
        const snapshot = firstItem.productSnapshot || {};

        // Statusni aniqlash
        let status = "o'rtacha";
        if (order.paymentStatus === "paid") {
          if (order.deliveryStatus === "delivered") status = "yaxshi";
          else status = "o'rtacha";
        } else {
          status = "yomon";
        }

        return {
          id: order._id,
          orderNumber: order.orderNumber || order._id.slice(-8).toUpperCase(),
          mahsulotNomi: snapshot.name || "Noma'lum mahsulot",
          mahsulotNarxi: snapshot.price || 0,
          soni: firstItem.quantity || 1,
          mijoz: order.user?.username || order.user?.name || "Mijoz",
          totalNarx: order.totalAmount || (snapshot.price * firstItem.quantity) || 0,
          tadbirkor: snapshot.company || "Dentago",
          status,
          selectedAction: null, // Foydalanuvchi tanlaydigan amal uchun
          manzil: order.shippingAddress || "Manzil ko'rsatilmagan",
        };
      });

      setOrders(mappedOrders);

      const pag = result.pagination || {};
      setTotalOrders(pag.total || mappedOrders.length);
      setTotalPages(pag.pages || 1);
      setCurrentPage(pag.page || 1);

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

  // Amalni tanlash funksiyasi
  const handleAction = (orderId, actionName) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, selectedAction: actionName } : order
    ));
    setActiveMenu(null);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'yaxshi': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'o\'rtacha': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'yomon': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#00BCE4] mx-auto mb-4" />
          <p className="text-slate-600 font-bold">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-[#00BCE4]/10 text-[#00BCE4]">
              <Package size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">
              Buyurtmalar <span style={{ color: PRIMARY_COLOR }}>Tarixi</span>
            </h1>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
            Jami: {totalOrders} ta buyurtma
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Qidiruv..." className="pl-12 pr-6 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 outline-none w-full md:w-80 text-sm font-bold" />
          </div>
          <button className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:text-[#00BCE4] transition-all"><Filter size={20} /></button>
          <button className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#00BCE4] text-white font-black text-[10px] uppercase tracking-widest hover:shadow-lg transition-all"><Download size={16} />Eksport</button>
        </div>
      </div>

      {/* Jadval */}
      <div className="bg-white rounded-[2.5rem] border  border-slate-100 shadow-2xl overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full min-w-[1100px]   ml-[10px]">
            <thead >
              <tr className="bg-slate-50/50 border-b border-slate-100    ">
                <th className="px-4 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Mahsulot</th>
                <th className="px-4 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Kompaniya</th>
                <th className="px-4 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Soni</th>
                <th className="px-4 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Mijoz</th>
                <th className="px-4 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Narxi</th>
                <th className="px-4 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-4 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.length > 0 ? orders.map(order => (
                <tr key={order.id} className="hover:bg-[#00BCE4]/[0.02] transition-all">
               
                  <td className="px-4 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-[#00BCE4] mb-0.5">#{order.orderNumber}</span>
                      <span className="text-sm font-bold text-slate-700 uppercase tracking-tighter">{order.mahsulotNomi}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-sm font-bold text-slate-500">{order.tadbirkor}</td>
                  <td className="px-4 py-5 text-center">
                    <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-black">{order.soni} ta</span>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#00BCE4]/10 flex items-center justify-center text-[10px] font-black text-[#00BCE4]">
                        {order.mijoz.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{order.mijoz}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-center text-sm font-black text-slate-800 tracking-tighter">
                    {order.mahsulotNarxi.toLocaleString()} so'm
                  </td>
                  <td className="px-4 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  
                  {/* Amallar Ustuni */}
                  <td className="px-4 py-5 relative">
                    <div className="flex items-center justify-center">
                      {order.selectedAction ? (
                        <button 
                          onClick={() => setActiveMenu(activeMenu === order.id ? null : order.id)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-tighter border transition-all hover:scale-105 shadow-sm ${
                            order.selectedAction === 'Yetkazib berish' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            order.selectedAction === 'Qabul qilish' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            'bg-rose-50 text-rose-600 border-rose-100'
                          }`}
                        >
                          {order.selectedAction}
                        </button>
                      ) : (
                        <button 
                          onClick={() => setActiveMenu(activeMenu === order.id ? null : order.id)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeMenu === order.id ? 'bg-[#00BCE4] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100 border border-transparent hover:border-slate-200'}`}
                        >
                          <MoreHorizontal size={20} />
                        </button>
                      )}

                      {/* Dropdown Menu */}
                      {activeMenu === order.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)}></div>
                          <div className="absolute right-full mr-2 top-0 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 z-20 overflow-hidden p-2 flex flex-col gap-1 animate-in fade-in slide-in-from-right-2">
                            <button 
                              onClick={() => handleAction(order.id, 'Yetkazib berish')}
                              className="flex items-center gap-3 w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            >
                              <Truck size={16} /> Yetkazib berish
                            </button>
                            <button 
                              onClick={() => handleAction(order.id, 'Qabul qilish')}
                              className="flex items-center gap-3 w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                            >
                              <MdCheck size={18} /> Qabul qilish
                            </button>
                            <div className="h-[1px] bg-slate-100 my-1 mx-2"></div>
                            <button 
                              onClick={() => handleAction(order.id, 'Bekor qilish')}
                              className="flex items-center gap-3 w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            >
                              <MdDeleteOutline size={18} /> Bekor qilish
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="px-6 py-20 text-center">
                    <Package size={60} className="mx-auto mb-4 text-slate-200" />
                    <p className="text-xl font-bold text-slate-400">Hech qanday buyurtma topilmadi</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Aperator;