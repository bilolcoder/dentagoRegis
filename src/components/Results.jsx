import React, { useState, useRef } from 'react';

// Icons
import { Calendar } from 'lucide-react';

// Recharts
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

// Context
import { useData } from '../context/DataProvider';

const Results = () => {
  const { data, t } = useData();
  const dateInputRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState('2025-01-12');

  // Helper functions
  const parseCurrency = (str) => {
    if (!str) return 0;
    if (typeof str === 'number') return str;
    return parseInt(str.toString().replace(/\s/g, '').replace("so'm", '')) || 0;
  };

  const formatCurrency = (num) => {
    return num.toLocaleString() + " so'm";
  };

  // Data
  const services = data.services || [];
  const payments = data.payments || [];

  // Chart Data
  const chartData = [
    {
      name: t('cash') || 'Naqd',
      value: payments.filter(p => p.type === 'Naqd').reduce((s, p) => s + parseCurrency(p.amount), 0),
    },
    {
      name: t('card') || 'Karta',
      value: payments.filter(p => p.type === 'Karta').reduce((s, p) => s + parseCurrency(p.amount), 0),
    },
    {
      name: t('bank_transfer') || 'Hisob raqam',
      value: payments.filter(p => p.type === 'Hisob raqam' || p.type === 'Bank').reduce((s, p) => s + parseCurrency(p.amount), 0),
    },
    {
      name: 'K-to-K',
      value: payments.filter(p => p.type === 'Kartadan-kartaga').reduce((s, p) => s + parseCurrency(p.amount), 0),
    },
  ];

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      {/* Chart & Top Services */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* PAYMENTS CHART */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-blue-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800 capitalize">
                {t('payments') || "To'lovlar"}
              </h3>
              <p className="text-sm text-slate-400 font-medium">To'lov turlari bo'yicha tahlil</p>
            </div>

            {/* Interactive Calendar */}
            <div className="relative">
              <button
                onClick={() => dateInputRef.current?.showPicker()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl text-sm font-bold text-[#00BCE4] hover:bg-blue-100 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>{selectedDate}</span>
              </button>
              <input
                type="date"
                ref={dateInputRef}
                className="absolute opacity-0 pointer-events-none"
                onChange={(e) => setSelectedDate(e.target.value)}
                value={selectedDate}
              />
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00BCE4" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#00BCE4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00BCE4" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#00BCE4', fontWeight: 500 }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#ffffff'
                  }}
                  formatter={(value) => [formatCurrency(value), "Summa"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#00BCE4"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TOP SERVICES */}
        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">
              {t('top_services') || "Top Xizmatlar"}
            </h3>
          </div>

          <div className="space-y-3">
            {services.slice(0, 6).map((service, index) => (
              <div
                key={service.id || index}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#00BCE4] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-100">
                    {index + 1}
                  </div>
                  <div className="max-w-[160px]">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {service.name}
                    </p>
                    <p className="text-[10px] font-bold text-[#00BCE4] uppercase tracking-wider">
                      {service.status || 'Aktiv'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-[#00BCE4]">{service.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
