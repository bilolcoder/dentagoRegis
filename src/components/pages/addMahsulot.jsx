import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Loader2, Edit3, Trash2, Plus, Search, Eye, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AddMahsulot() {
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    category: '',
    discount: '0',
    description: ''
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const navigate = useNavigate();

  const BASE_URL = "https://app.dentago.uz";
  const TOKEN = localStorage.getItem('accessToken');
  useEffect(() => {
    fetchProducts();
  }, []);

  // Qidiruv maydoni o'zgarganda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults(products);
    } else {
      handleSearch();
    }
  }, [searchTerm, products]);

  // Bildirishnoma ko'rsatish
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Mahsulotlarni yuklash
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/product`, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      });

      console.log("API javobi:", response.data);

      let productsData = [];
      if (response.data && response.data.data) {
        productsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        productsData = response.data;
      }

      setProducts(productsData);
      setSearchResults(productsData);
      setError(null);
    } catch (err) {
      setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
      console.error("Yuklash xatosi:", err);
    } finally {
      setLoading(false);
    }
  };

  // Qidiruv funksiyasi
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults(products);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const results = products.filter(product => {
      const nameMatch = product.name?.toLowerCase().includes(term) || false;
      const categoryMatch = product.category?.toLowerCase().includes(term) || false;
      const descriptionMatch = product.description?.toLowerCase().includes(term) || false;
      const priceMatch = product.price?.toString().includes(term) || false;

      return nameMatch || categoryMatch || descriptionMatch || priceMatch;
    });

    setSearchResults(results);
  };

  // Qidiruvni tozalash
  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults(products);
  };

  // Input'ga bosilgan tugmalarni qayta ishlash
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Tahrirlashni boshlash
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name || '',
      price: product.price || '',
      category: product.category || '',
      discount: product.discount || '0',
      description: product.description || ''
    });
    setEditModalOpen(true);
  };

  // Tahrirlash formasi o'zgarishi
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Tahrirlashni saqlash
  const handleSaveEdit = async () => {
    if (!editingProduct?._id) {
      showNotification("Mahsulot ID topilmadi!", 'error');
      return;
    }

    if (!editForm.name.trim() || !editForm.price) {
      showNotification("Nomi va narxi maydonlari to'ldirilishi shart!", 'error');
      return;
    }

    setSavingEdit(true);

    const payload = {
      name: editForm.name.trim(),
      price: Number(editForm.price),
      category: editForm.category,
      discount: Number(editForm.discount || 0),
      description: editForm.description.trim()
    };

    try {
      // Avval PUT metodini sinab ko'ramiz
      let response;
      let methodUsed = 'PUT';

      try {
        response = await axios.put(
          `${BASE_URL}/api/product/${editingProduct._id}`,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } catch (putErr) {
        // PUT ishlamasa, PATCH sinab ko'ramiz
        methodUsed = 'PATCH';
        try {
          response = await axios.patch(
            `${BASE_URL}/api/product/${editingProduct._id}`,
            payload,
            {
              headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
              }
            }
          );
        } catch (patchErr) {
          // PATCH ham ishlamasa, POST sinab ko'ramiz
          methodUsed = 'POST';
          response = await axios.post(
            `${BASE_URL}/api/product/${editingProduct._id}`,
            payload,
            {
              headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
              }
            }
          );
        }
      }

      console.log(`${methodUsed} metodidan javob:`, response.data);

      // Mahsulotlar ro'yxatini yangilash
      const updatedProducts = products.map(p =>
        p._id === editingProduct._id ? { ...p, ...payload } : p
      );

      setProducts(updatedProducts);
      setSearchResults(updatedProducts);

      showNotification("Mahsulot muvaffaqiyatli yangilandi!");
      setEditModalOpen(false);
      setEditingProduct(null);

    } catch (err) {
      console.error("Tahrirlashda xatolik:", err);
      let errorMsg = "Tahrirlashda xatolik yuz berdi";

      if (err.response?.status === 401) {
        errorMsg = "Token noto'g'ri yoki muddati tugagan";
      } else if (err.response?.status === 404) {
        errorMsg = "API endpoint topilmadi";
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }

      showNotification(`Xatolik: ${errorMsg}`, 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  // O'chirishni tasdiqlash
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  // O'chirishni amalga oshirish
  const handleConfirmDelete = async () => {
    if (!productToDelete?._id) return;

    try {
      await axios.delete(
        `${BASE_URL}/api/product/${productToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${TOKEN}` }
        }
      );

      // Ikki ro'yxatdan ham o'chirish
      const updatedProducts = products.filter(p => p._id !== productToDelete._id);
      setProducts(updatedProducts);
      setSearchResults(updatedProducts);

      showNotification("Mahsulot muvaffaqiyatli o'chirildi!");
    } catch (err) {
      console.error("O'chirish xatosi:", err);
      let errorMsg = "O'chirishda xatolik yuz berdi";

      if (err.response?.status === 404) {
        errorMsg = "Mahsulot topilmadi";
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }

      showNotification(`Xatolik: ${errorMsg}`, 'error');
    } finally {
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  // Yangi mahsulot qo'shish sahifasiga o'tish
  const handleAddProduct = () => {
    navigate("/MahsulotQoshish");
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-[#00BCE4] mb-4" />
        <p className="text-gray-600 font-medium">Mahsulotlar yuklanmoqda...</p>
        <p className="text-sm text-gray-400 mt-2">Iltimos kuting</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">

          {/* Header qismi */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Mahsulotlar Ombori</h1>
              <p className="text-gray-500 text-sm">
                {searchTerm
                  ? `"${searchTerm}" uchun ${searchResults.length} ta natija`
                  : `Jami ${products.length} ta mahsulot`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* QIDIRUV INPUTI */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Nomi, kategoriyasi bo'yicha qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00BCE4] focus:border-transparent w-full md:w-96 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Tozalash"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <button
                onClick={handleAddProduct}
                className="flex items-center gap-2 bg-[#00BCE4] hover:bg-[#00a6c9] text-white px-5 py-3 rounded-xl font-semibold transition-colors shadow-lg"
              >
                <Plus size={20} /> Yangi qo'shish
              </button>
            </div>
          </div>

          {/* Xato xabari */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="ml-auto text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg transition-colors"
                >
                  Qayta urinish
                </button>
              </div>
            </div>
          )}

          {/* Qidiruv natijasi bo'sh bo'lsa */}
          {searchTerm && searchResults.length === 0 && (
            <div className="mb-6 p-6 bg-white border border-gray-200 rounded-2xl text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                "{searchTerm}" uchun natija topilmadi
              </h3>
              <p className="text-gray-500 mb-4">
                Boshqa so'z yoki kategoriya bilan qidirib ko'ring
              </p>
              <button
                onClick={clearSearch}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Barcha mahsulotlarni ko'rish
              </button>
            </div>
          )}

          {/* Jadval */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Mahsulot</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Kategoriya</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Narxi</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.length > 0 ? (
                    searchResults.map((product) => (
                      <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden border">
                              {product.imageUrl?.[0] ? (
                                <img
                                  src={`${BASE_URL}/images/${product.imageUrl[0]}`}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <Package size={24} />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-gray-800">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">ID: {product._id?.slice(-6)}</div>
                              {product.description && (
                                <div className="text-sm text-gray-500 mt-2 line-clamp-2 max-w-md">
                                  {product.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {product.category || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-800 text-lg">
                            {product.price?.toLocaleString()} UZS
                          </div>
                          {product.discount > 0 && (
                            <div className="text-sm text-red-500 line-through mt-1">
                              {Math.round((product.price * 100) / (100 - product.discount)).toLocaleString()} UZS
                              <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                -{product.discount}%
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">

                            <button
                              onClick={() => handleEditClick(product)}
                              className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Tahrirlash"
                            >
                              <Edit3 size={20} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(product)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="O'chirish"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : !searchTerm && !loading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Mahsulotlar topilmadi</h3>
                        <p className="text-gray-500 mb-4">Hozircha mahsulotlar mavjud emas</p>
                        <button
                          onClick={handleAddProduct}
                          className="px-6 py-2 bg-[#00BCE4] text-white rounded-lg hover:bg-[#00a6c9] transition-colors"
                        >
                          Birinchi mahsulotni qo'shing
                        </button>
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Tahrirlash Modali */}
      {editModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Mahsulotni tahrirlash</h3>
                  <p className="text-gray-500 text-sm mt-1">{editingProduct.name}</p>
                </div>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mahsulot nomi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BCE4] focus:border-transparent"
                  required
                  placeholder="Mahsulot nomini kiriting"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Narxi (UZS) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BCE4] focus:border-transparent"
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chegirma (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={editForm.discount}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BCE4] focus:border-transparent"
                    min="0"
                    max="100"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategoriya
                </label>
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BCE4] focus:border-transparent"
                >
                  <option value="">Kategoriyani tanlang</option>
                  <option value="Terapiya">Terapiya</option>
                  <option value="Jarrohlik">Jarrohlik</option>
                  <option value="Burlar">Burlar</option>
                  <option value="Sarf materiallari">Sarf materiallari</option>
                  <option value="Fayllar">Fayllar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tavsif
                </label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BCE4] focus:border-transparent"
                  rows="4"
                  placeholder="Mahsulot haqida qo'shimcha ma'lumot..."
                />
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setEditModalOpen(false)}
                disabled={savingEdit}
                className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="px-6 py-3 bg-[#00BCE4] text-white font-semibold rounded-lg hover:bg-[#00a6c9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {savingEdit ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saqlanmoqda...
                  </>
                ) : (
                  'Saqlash'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* O'chirish Tasdiqlash Modali */}
      {deleteConfirmOpen && productToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Mahsulotni o'chirish</h3>
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{productToDelete.name}</p>
                  <p className="text-sm text-gray-500">ID: {productToDelete._id?.slice(-6)}</p>
                </div>
              </div>

              <p className="text-gray-600 mb-2">
                Ushbu mahsulotni rostdan ham o'chirmoqchimisiz?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Bu amalni qaytarib bo'lmaydi. Barcha ma'lumotlar butunlay o'chiriladi.
              </p>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Trash2 size={20} />
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bildirishnoma */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 ${notification.type === 'success' ? 'bg-green-50 border-green-200' : notification.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'} border rounded-lg shadow-lg p-4 max-w-sm transition-all duration-300`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-600" />
            ) : (
              <Eye className="w-5 h-5 text-blue-600" />
            )}
            <div>
              <p className={`font-medium ${notification.type === 'success' ? 'text-green-800' : notification.type === 'error' ? 'text-red-800' : 'text-blue-800'}`}>
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification({ show: false, message: '', type: 'success' })}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AddMahsulot;