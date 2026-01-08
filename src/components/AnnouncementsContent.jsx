import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Upload, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';
import Modal from './common/Modal';

const AnnouncementsContent = () => {
    const { data, updateData, t } = useData();
    const announcements = data.announcements || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [viewingAnnouncement, setViewingAnnouncement] = useState(null);

    const [formData, setFormData] = useState({
        image: '',
        description: '',
        paymentStatus: 'Kutilmoqda'
    });

    // 7 kun qo'shish funksiyasi
    const addSevenDays = (date) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 7);
        return newDate.toISOString().split('T')[0];
    };

    // Muddati o'tganligini tekshirish
    const isExpired = (expiresAt) => {
        return new Date(expiresAt) < new Date();
    };

    // Qolgan kunlarni hisoblash
    const getDaysRemaining = (expiresAt) => {
        const diff = new Date(expiresAt) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };

    const handleOpenModal = (announcement = null) => {
        if (announcement) {
            setEditingAnnouncement(announcement);
            setFormData({
                image: announcement.image,
                description: announcement.description,
                paymentStatus: announcement.paymentStatus
            });
        } else {
            setEditingAnnouncement(null);
            setFormData({
                image: '',
                description: '',
                paymentStatus: 'Kutilmoqda'
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = (id, description) => {
        if (window.confirm(`"${description.substring(0, 30)}..." e'lonini o'chirmoqchimisiz?`)) {
            updateData('announcements', { id }, 'DELETE');
        }
    };

    const handleSave = () => {
        if (!formData.image || !formData.description) {
            alert(t('fill_required'));
            return;
        }

        const currentDate = new Date().toISOString().split('T')[0];
        const expiryDate = addSevenDays(currentDate);

        const dataToSend = {
            ...formData,
            createdAt: editingAnnouncement ? editingAnnouncement.createdAt : currentDate,
            expiresAt: editingAnnouncement ? editingAnnouncement.expiresAt : expiryDate,
            isActive: true
        };

        if (editingAnnouncement) {
            updateData('announcements', { id: editingAnnouncement.id, ...dataToSend }, 'UPDATE');
        } else {
            updateData('announcements', dataToSend, 'ADD');
        }
        setIsModalOpen(false);
        setFormData({ image: '', description: '', paymentStatus: 'Kutilmoqda' });
    };

    const handleExtendLimit = (announcement) => {
        const newExpiryDate = addSevenDays(new Date().toISOString().split('T')[0]);
        updateData('announcements', {
            id: announcement.id,
            expiresAt: newExpiryDate,
            isActive: true
        }, 'UPDATE');
        alert('E\'lon muddati 7 kunga uzaytirildi!');
    };

    const handleViewAnnouncement = (announcement) => {
        setViewingAnnouncement(announcement);
        setIsViewModalOpen(true);
    };

    return (
        <div className="p-4 md:p-8 space-y-6 bg-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('announcements')}</span>
                    </div>
                </div>

                <button
                    onClick={() => handleOpenModal(null)}
                    className='flex items-center gap-2 py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap'
                >
                    <Plus className='w-5 h-5' /> {t('add')} {t('announcement')}
                </button>
            </div>

            {/* E'lonlar Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {announcements.length > 0 ? (
                    announcements.map((announcement) => {
                        const expired = isExpired(announcement.expiresAt);
                        const daysLeft = getDaysRemaining(announcement.expiresAt);

                        return (
                            <div
                                key={announcement.id}
                                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border ${expired ? 'border-red-300 dark:border-red-700' : 'border-gray-100 dark:border-gray-700'} overflow-hidden transition-all hover:shadow-lg`}
                            >
                                {/* Rasm */}
                                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                                    <img
                                        src={announcement.image}
                                        alt="E'lon rasmi"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x300?text=Rasm+Topilmadi';
                                        }}
                                    />
                                    {expired && (
                                        <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                            Muddati tugagan
                                        </div>
                                    )}
                                    {!expired && (
                                        <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                            {daysLeft} kun qoldi
                                        </div>
                                    )}
                                </div>

                                {/* Mazmun */}
                                <div className="p-4">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                                        {announcement.description}
                                    </p>

                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            <Calendar className="w-3 h-3 inline mr-1" />
                                            {announcement.createdAt}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${announcement.paymentStatus === 'To\'landi' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                            {announcement.paymentStatus}
                                        </span>
                                    </div>

                                    {/* Amallar */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleViewAnnouncement(announcement)}
                                            className='flex-1 p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition flex items-center justify-center gap-1'
                                            title="Ko'rish"
                                        >
                                            <Eye className='w-4 h-4' />
                                        </button>
                                        <button
                                            onClick={() => handleOpenModal(announcement)}
                                            className='flex-1 p-2 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition flex items-center justify-center gap-1'
                                            title="Tahrirlash"
                                        >
                                            <Edit className='w-4 h-4' />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(announcement.id, announcement.description)}
                                            className='flex-1 p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition flex items-center justify-center gap-1'
                                            title="O'chirish"
                                        >
                                            <Trash2 className='w-4 h-4' />
                                        </button>
                                    </div>

                                    {/* Limit uzaytirish */}
                                    {expired && (
                                        <button
                                            onClick={() => handleExtendLimit(announcement)}
                                            className='w-full mt-3 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition text-sm'
                                        >
                                            Limitni uzaytirish (+7 kun)
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-20 text-gray-500 dark:text-gray-400">
                        E'lonlar topilmadi. Yangi e'lon qo'shing!
                    </div>
                )}
            </div>

            {/* Qo'shish/Tahrirlash Modali */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingAnnouncement(null);
                    setFormData({ image: '', description: '', paymentStatus: 'Kutilmoqda' });
                }}
                title={editingAnnouncement ? "E'lonni tahrirlash" : "Yangi e'lon yaratish"}
                footer={
                    <button
                        onClick={handleSave}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                        {editingAnnouncement ? t('save') : "E'lonni yaratish"}
                    </button>
                }
            >
                <div className="space-y-4">
                    {/* Rasm URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            E'lon rasmi (URL)*
                        </label>
                        <input
                            type="text"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                        {formData.image && (
                            <img
                                src={formData.image}
                                alt="Preview"
                                className="mt-2 w-full h-40 object-cover rounded-lg"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/400x200?text=Noto\'g\'ri+URL';
                                }}
                            />
                        )}
                    </div>

                    {/* Tavsif */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tavsif (E'lon matni)*
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="E'lon haqida batafsil ma'lumot yozing..."
                            rows={4}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* To'lov holati (placeholder) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            To'lov holati (Hozircha placeholder)
                        </label>
                        <select
                            value={formData.paymentStatus}
                            onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="Kutilmoqda">Kutilmoqda</option>
                            <option value="To'landi">To'landi</option>
                            <option value="Bekor qilindi">Bekor qilindi</option>
                        </select>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            * To'lov tizimi keyinchalik API orqali ulanadi
                        </p>
                    </div>
                </div>
            </Modal>

            {/* Ko'rish Modali */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="E'lon tafsilotlari"
            >
                {viewingAnnouncement && (
                    <div className="space-y-4">
                        <img
                            src={viewingAnnouncement.image}
                            alt="E'lon rasmi"
                            className="w-full h-64 object-cover rounded-lg"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/600x400?text=Rasm+Topilmadi';
                            }}
                        />
                        <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Tavsif:</h3>
                            <p className="text-gray-700 dark:text-gray-300">{viewingAnnouncement.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-600 dark:text-gray-400">Yaratilgan:</span>
                                <p className="text-gray-800 dark:text-white">{viewingAnnouncement.createdAt}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600 dark:text-gray-400">Tugash sanasi:</span>
                                <p className="text-gray-800 dark:text-white">{viewingAnnouncement.expiresAt}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600 dark:text-gray-400">To'lov holati:</span>
                                <p className="text-gray-800 dark:text-white">{viewingAnnouncement.paymentStatus}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600 dark:text-gray-400">Qolgan kunlar:</span>
                                <p className="text-gray-800 dark:text-white">
                                    {isExpired(viewingAnnouncement.expiresAt) ? 'Muddati tugagan' : `${getDaysRemaining(viewingAnnouncement.expiresAt)} kun`}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AnnouncementsContent;
