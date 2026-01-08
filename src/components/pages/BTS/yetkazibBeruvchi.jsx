import React from 'react';
import { Phone, Home, Truck, CheckCircle, House, BaggageClaim, UserCheck, CheckCheck } from 'lucide-react';
import Map from "../../../assets/map.png";
import Profile from "../../../assets/profile.jpg";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
function YetkazibBerish() {
const navigate = useNavigate();

    const KuryerBloki = ({ name, profileSrc }) => (
    <div className="p-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img
          src={profileSrc}
          alt={`Kuryer ${name}`}
          className="w-16 h-16 rounded-full object-cover border-2 border-[#00BCE4]"
        />
        <div>
          <p className="text-sm text-gray-600">Yetkazib beruvchi</p>
          <p className="font-semibold text-gray-900">{name}</p>
          <p className="font-sm text-gray-600">yolda</p>
        </div>
      </div>
      <button className="bg-[#00BCE4] flex items-center justify-center gap-2 py-3 px-5 rounded-full text-white shadow-lg cursor-pointer  transition duration-200 text-sm">
        <Phone className="w-4 h-4" /> Qo'ng'iroq qilish
      </button>
    </div>
  );
  const navigateback = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen mt-[60px] bg-white px-4 md:px-10 lg:px-[150px] xl:px-[300px]">
<FaArrowLeftLong 
onClick={navigateback}
className='mb-6 text-[20px] cursor-pointer'
/>
      {/* Xarita rasmi */}
      <div className="mb-[20px] rounded-lg overflow-hidden">
        <img
          src={Map}
          alt="Yetkazib berish xaritasi"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Pastki oq qism */}
      <div className="bg-white -mt-8 px-6 pt-8 pb-10 rounded-t-xl">

        {/* Vaqt */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-600">Yetkazib berish vaqtimiz</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">12:40–13:30</p>
        </div>

        {/* Statuslar */}
        <div className="flex justify-between mb-10 gap-2">
           {/* Bu qism o'zgartirilmasdan qoldi, chunki so'rov faqat kuryer qismiga tegishli edi */}
            <div className="text-center">
                <div className="w-14 h-14 bg-[#00BCE4] rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCheck className="w-7 h-7 text-white" />
                </div>
                <p className="text-medium text-gray-600">Qabul qildi</p>
            </div>

            <div className="text-center">
                <div className="w-14 h-14 bg-[#00BCE4] rounded-full flex items-center justify-center mx-auto mb-2">
                  <BaggageClaim className="w-7 h-7 text-white" />
                </div>
                <p className="text-medium text-gray-600">Yuklanmoqda</p>
            </div>

            <div className="text-center">
                <div className="w-14 h-14 bg-[#00BCE4] rounded-full flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-7 h-7 text-white" />
                </div>
                <p className="text-medium text-gray-600">Yo‘lda</p>
            </div>

            <div className="text-center">
                <div className="w-14 h-14 bg-[#00BCE4] rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <p className="text-medium text-gray-600">Yetkazib berildi</p>
            </div>

            <div className="text-center">
                <div className="w-14 h-14 bg-[#00BCE4] rounded-full flex items-center justify-center mx-auto mb-2">
                  <UserCheck className="w-7 h-7 text-white" />
                </div>
                <p className="text-medium text-gray-600">Qabul qilindi</p>
            </div>
        </div>

        {/* KURYERLAR VA MANZIL BLOKI */}
        <div className="bg-white rounded-2xl shadow-sm">

            {/* Kuryer 1 (Asl kuryer) */}
            <KuryerBloki name="Muzaffar" profileSrc={Profile} />

            {/* Kuryer 2 (Statik takrorlanish) */}
            <div className="border-t border-gray-100">
                <KuryerBloki name="Ali" profileSrc={Profile} />
            </div>

            {/* Kuryer 3 (Statik takrorlanish) */}
             <div className="border-t border-gray-100">
                <KuryerBloki name="Botir" profileSrc={Profile} />
            </div>

            {/* Manzil */}
            <div className="px-5 py-4 rounded-b-2xl border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <p className="text-sm text-gray-600 font-medium">Yetkazib berish manzili</p>
                <p className="text-[13px] text-gray-700 mt-1 font-medium">Toshkent Yunusobod</p>
              </div>

              <div className="w-12 h-12 bg-[#00BCE4] rounded-full flex items-center justify-center shadow-md">
                <House className='text-white w-6 h-6'/>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default YetkazibBerish;
