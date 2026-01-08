// src/components/AppPaymentsContent.jsx
import React from 'react';
import { useData } from '../context/DataProvider';
import { Search, ChevronDown, ChevronUp, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const AppPaymentsContent = () => {
    const { t } = useData();

    return (
        <div className="p-6">
            {/* Top Section: Breadcrumb & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                {/* Breadcrumb */}
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('app_payments')}</span>
                    </div>
                </div>

                {/* Search & Actions */}
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t('search')}
                            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-colors text-gray-700 dark:text-gray-200"
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                    <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                        <ChevronDown className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <ChevronUp className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Content: Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-left">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                                    #
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t('sum')}
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">
                                    {t('type_short')}
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                                    {t('payment_date')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Empty State */}
                            <tr>
                                <td colSpan="4">
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                            <Database className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                                        </div>
                                        <h3 className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                                            {t('no_data')}
                                        </h3>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AppPaymentsContent;
