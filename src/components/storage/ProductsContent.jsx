import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Package, ChevronRight, Hash, Layers, Box, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataProvider';
import AddProductModal from './modals/AddProductModal';

const ProductsContent = () => {
    const { data, t } = useData();
    const products = data.storage?.products || [];
    const PRIMARY_COLOR = "#00BCE4";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenAddEditModal = (product = null) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 bg-white min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">
                        <Link to="/" className="hover:text-[#00BCE4] transition-colors">BOSH SAHIFA</Link>
                        <ChevronRight size={10} />
                        <span className="text-[#00BCE4]">MAHSULOTLAR</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#00BCE4]/10 text-[#00BCE4]">
                            <Box size={24} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">
                            Mahsulotlar <span style={{ color: PRIMARY_COLOR }}>Bozasi</span>
                        </h1>
                    </div>
                </div>

                <button
                    onClick={() => handleOpenAddEditModal(null)}
                    className="flex items-center gap-2 bg-[#00BCE4] text-white px-8 py-4 rounded-2xl transition-all shadow-xl shadow-[#00BCE4]/20 active:scale-95 font-black text-[10px] uppercase tracking-widest hover:brightness-110"
                >
                    <Plus className="w-5 h-5" strokeWidth={3} />
                    {t('add') || "Yangi Mahsulot Qo'shish"}
                </button>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">

                {/* Search & Stats Bar */}
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#00BCE4] transition-colors" />
                        <input
                            type="text"
                            placeholder={t('search') || "Mahsulot qidirish..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold bg-white outline-none focus:border-[#00BCE4] focus:ring-4 focus:ring-[#00BCE4]/5 transition-all text-slate-700 placeholder:text-slate-400 focus:text-[#00BCE4]"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#00BCE4]/10 text-[#00BCE4]">
                                <Package size={20} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] leading-none mb-1 text-right">Turlar</p>
                                <p className="text-lg font-black text-slate-800 tracking-tighter leading-none text-right">{filteredProducts.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-white">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"># No</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mahsulot Ma'lumoti</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kategoriya</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Brend / O'lchov</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Qoldiq</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Narxi</th>
                                <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Boshqaruv</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredProducts.map((prod, index) => (
                                <tr key={prod.id} className="hover:bg-[#00BCE4]/[0.02] transition-all group">
                                    <td className="px-8 py-5">
                                        <span className="text-xs font-black text-slate-300 group-hover:text-[#00BCE4] transition-colors tracking-tighter">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-700 tracking-tight uppercase group-hover:text-[#00BCE4] transition-colors">
                                                {prod.name}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">ID: {prod.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-tight group-hover:bg-[#00BCE4]/10 group-hover:text-[#00BCE4] transition-all">
                                            {prod.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{prod.brand}</span>
                                            <span className="text-[10px] font-medium text-slate-400 italic">{prod.unit}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {prod.quantity < 10 && <AlertTriangle size={12} className="text-rose-500 animate-pulse" />}
                                            <span className={`text-sm font-black tracking-tighter ${prod.quantity < 10 ? 'text-rose-500' : 'text-slate-700'}`}>
                                                {prod.quantity}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <span className="text-sm font-black text-[#00BCE4] tracking-tighter bg-[#00BCE4]/5 px-3 py-1 rounded-lg border border-[#00BCE4]/10">
                                            {prod.price.toLocaleString()} so'm
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-center items-center gap-2">
                                            <button
                                                onClick={() => handleOpenAddEditModal(prod)}
                                                className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-[#00BCE4] hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                                                title="Tahrirlash"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                                                title="O'chirish"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="py-32 flex flex-col items-center justify-center bg-slate-50/50">
                        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-slate-200 border border-slate-100">
                            <Box className="text-slate-200 w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">Mahsulot topilmadi</h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">
                            Qidiruv so'rovini boshqacharoq kiritib ko'ring
                        </p>
                    </div>
                )}
            </div>

            {/* Modal Component */}
            {isModalOpen && (
                <AddProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    product={currentProduct}
                />
            )}
        </div>
    );
};

export default ProductsContent;
