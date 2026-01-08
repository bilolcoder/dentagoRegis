// src/components/AdvertisingContent.jsx

import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit } from 'lucide-react';

// Yangi reklama qo'shish uchun Modal
const AddAdvertisementModal = ({ isOpen, onClose }) => {
    const { addAdvertisement, t } = useData();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('active');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title && content) {
            addAdvertisement({ title, content, status });
            onClose();
            setTitle('');
            setContent('');
            setStatus('active');
        } else {
            alert(t('fill_required'));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Yangi Reklama Qo'shish</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sarlavha</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kontent</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="3"
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('status')}</label>
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => setStatus('active')}
                                className={`px-4 py-2 rounded-md transition-colors ${status === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 hover:bg-blue-500 hover:text-white'}`}
                            >
                                {t('active')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatus('inactive')}
                                className={`px-4 py-2 rounded-md transition-colors ${status === 'inactive' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 hover:bg-red-500 hover:text-white'}`}
                            >
                                {t('inactive')}
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {t('add')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const AdvertisingContent = () => {
    const { data, t } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const advertisements = data.advertisements || [];

    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('advertising')}</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 shadow-md"
                >
                    <Plus className="w-5 h-5 mr-2" /> {t('add')}
                </button>
            </div>

            <div className="bg-white  shadow-lg rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 ">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sarlavha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kontent</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('status')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('date')}</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                        {advertisements.length > 0 ? (
                            advertisements.map((ad, index) => (
                                <tr key={ad.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{ad.title}</td>
                                    <td className="px-6 py-4 max-w-xs text-sm text-gray-700 dark:text-gray-300 truncate">{ad.content}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ad.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                            {ad.status === 'active' ? t('active') : t('inactive')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{ad.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Hozircha reklama mavjud emas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <AddAdvertisementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default AdvertisingContent;
