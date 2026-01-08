import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useData } from '../../../context/DataProvider'; // DataProvider'dan foydalanish uchun

const AddProductModal = ({ isOpen, onClose, product }) => {
    const { data } = useData();
    // Dinamik tanlovlar uchun ma'lumotlarni DataProvider'dan olamiz
    const categories = data.storage?.categories || [];
    const brands = data.storage?.brands || [];
    const units = data.storage?.units || [];

    const isEditing = !!product;

    const [formData, setFormData] = useState({
        name: product?.name || '',
        price: product?.price || 0,
        category: product?.category || '',
        brand: product?.brand || '',
        unit: product?.unit || '',
        minQty: product?.minQty || 0,
        maxQty: product?.maxQty || 0,
        status: product?.status ?? true,
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                price: product.price,
                category: product.category,
                brand: product.brand,
                unit: product.unit,
                minQty: product.minQty,
                maxQty: product.maxQty,
                status: product.status,
            });
        } else {
            setFormData({
                name: '', price: 0, category: '', brand: '', unit: '',
                minQty: 0, maxQty: 0, status: true,
            });
        }
    }, [product, isOpen]);

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Majburiy maydonlarni tekshirish (Masalan, nom, narx, kategoriya)
        if (!formData.name.trim() || !formData.price || !formData.category) {
            alert("Iltimos, Mahsulot nomi, Narxi va Kategoriyasini kiriting.");
            return;
        }

        // Saqlash mantig'i bu yerda bo'ladi (updateData orqali)
        console.log(isEditing ? "Mahsulot tahrirlandi:" : "Yangi mahsulot qo'shildi:", formData);
        onClose();
    };

    if (!isOpen) return null;

    // Rasmdagi Saydbar (Modal) dizayni: image_fe7d5c.png
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Overlay */}
            <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] bg-opacity-50 transition-opacity" onClick={onClose}></div>

            {/* Modal/Saydbar Konteyner */}
            <div className="fixed inset-y-0 right-0 max-w-full flex">
                <div
                    className="w-screen max-w-lg bg-white shadow-xl" // Kengroq qilib qo'ydik
                    onClick={handleContentClick}
                >
                    <div className="h-full flex flex-col">

                        {/* Saydbar sarlavhasi */}
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-xl font-medium text-gray-900">
                                {isEditing ? "Mahsulotni tahrirlash" : "Mahsulot qo'shish"}
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Saydbar kontenti (Forma) */}
                        <form onSubmit={handleSubmit} id="modal-form" className="p-6 space-y-6 grow overflow-y-auto">

                            {/* 1-QATOR: Nomi va Narxi */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nomi*</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Mahsulot nomini kiriting"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Narxi*</label>
                                    <input
                                        type="number"
                                        id="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Narxini kiriting"
                                        required
                                    />
                                </div>
                            </div>

                            {/* 2-QATOR: Kategoriya, Brend, O'lchov birligi */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Kategoriya*</label>
                                    <select
                                        id="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="" disabled>Tanlang</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brend</label>
                                    <select
                                        id="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                                    >
                                        <option value="">Tanlang</option>
                                        {brands.map(b => (
                                            <option key={b.id} value={b.name}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700">O'lchov birligi</label>
                                    <select
                                        id="unit"
                                        value={formData.unit}
                                        onChange={handleChange}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                                    >
                                        <option value="">Tanlang</option>
                                        {units.map(u => (
                                            <option key={u.id} value={u.name}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* 3-QATOR: Minimal va Maksimal miqdor */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="minQty" className="block text-sm font-medium text-gray-700">Minimal miqdor</label>
                                    <input
                                        type="number"
                                        id="minQty"
                                        value={formData.minQty}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Minimal qoldiq miqdori"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="maxQty" className="block text-sm font-medium text-gray-700">Maksimal miqdor</label>
                                    <input
                                        type="number"
                                        id="maxQty"
                                        value={formData.maxQty}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Maksimal qoldiq miqdori"
                                    />
                                </div>
                            </div>

                            {/* Holati */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Holati</label>
                                <div className="flex gap-4 p-2 bg-gray-100 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, status: true }))}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${formData.status ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        Faol
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, status: false }))}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${!formData.status ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        Nofaol
                                    </button>
                                </div>
                            </div>

                        </form>

                        {/* Amallar (Footer) */}
                        <div className="p-4 border-t bg-gray-50">
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    form="modal-form"
                                    className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    <Check className="w-5 h-5 mr-1" /> {isEditing ? "Saqlash" : "Qo'shish"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProductModal;
