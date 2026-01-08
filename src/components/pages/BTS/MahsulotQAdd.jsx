import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

function ProductForm({ productToEdit }) {
  const navigate = useNavigate();

  // Tokenni localStoragedan olish
  const token = localStorage.getItem('accessToken');

  const [categories, setCategories] = useState([]);
  const [codeOptions, setCodeOptions] = useState([
    { code: '03004010003004001', name: 'Ortopedik materiallar' },
    { code: '03004097001006002', name: 'Behushlik vositalari' },
    { code: '03004097001006003', name: 'Terapevtik materiallar' },
    { code: '03004097001006004', name: 'Jarrohlik asboblari' },
    { code: '03004097001006005', name: 'Dezinfeksiya vositalari' },
    { code: '03004097001006006', name: 'Polishing materiallari' },
    { code: '03004097001006007', name: 'Stomatologik stullar' },
    { code: '03004097001006008', name: 'Rentgen uskunalari' },
    { code: '03004097001006009', name: 'Skalatorlar' },
    { code: '03004097001006010', name: 'Elektromotorlar' }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    imageUrl: [],
    category: '',
    company: '',
    price: '',
    description: '',
    deliveryDays: '',
    salePercentage: '',
    quantity: '',
    code: '',
    vat_percent: 0,
    package_code: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://app.dentago.uz/api/category', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data && Array.isArray(response.data)) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Kategoriyalar yuklanmadi:", error);
        if (error.response?.status === 401) {
          setErrorMessage('Kirish rad etildi. Tokenni tekshiring.');
        } else {
          setErrorMessage('Kategoriyalar yuklanmadi. Sahifani yangilang.');
        }
      }
    };

    fetchCategories();

    if (productToEdit) {
      const editData = {
        ...productToEdit,
        imageUrl: productToEdit.imageUrl || []
      };

      // Raqamli maydonlarni stringga o'tkazish
      Object.keys(editData).forEach(key => {
        if (typeof editData[key] === 'number') {
          editData[key] = editData[key].toString();
        }
      });

      setFormData(editData);

      if (productToEdit.imageUrl && productToEdit.imageUrl.length > 0) {
        setPreviewImages(productToEdit.imageUrl.map(img =>
          `https://app.dentago.uz/images/${img}`
        ));
      }
    }
  }, [productToEdit, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['price', 'salePercentage', 'vat_percent', 'quantity', 'deliveryDays'];

    setFormData((prevData) => ({
      ...prevData,
      [name]: numericFields.includes(name) ?
        (value === '' ? '' : parseFloat(value) || 0) :
        value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      setErrorMessage('Faqat rasm fayllar yuklanishi mumkin!');
      return;
    }

    if (validFiles.length > 10) {
      setErrorMessage('Maksimal 10 ta rasm yuklashingiz mumkin!');
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
    setErrorMessage('');
  };

  const removeImage = (index) => {
    const isOldImage = productToEdit && index < (productToEdit.imageUrl?.length || 0);

    if (isOldImage) {
      const newImageUrls = [...formData.imageUrl];
      newImageUrls.splice(index, 1);
      setFormData(prev => ({ ...prev, imageUrl: newImageUrls }));
    } else {
      const fileIndex = index - (productToEdit?.imageUrl?.length || 0);
      setSelectedFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }

    setPreviewImages(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      return newPreviews.filter((_, i) => i !== index);
    });
  };

  const uploadImagesToServer = async () => {
    if (selectedFiles.length === 0) {
      return formData.imageUrl || [];
    }

    setUploadingImages(true);
    const uploadedFilenames = [];

    try {
      for (const file of selectedFiles) {
        const formDataImage = new FormData();
        formDataImage.append('image', file);

        const response = await axios.post(
          'https://app.dentago.uz/api/upload/image',
          formDataImage,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            },
          }
        );

        if (response.data && response.data.file && response.data.file.savedName) {
          uploadedFilenames.push(response.data.file.savedName);
        } else if (response.data && response.data.filename) {
          uploadedFilenames.push(response.data.filename);
        } else if (response.data && response.data.url) {
          uploadedFilenames.push(response.data.url.split('/').pop());
        } else {
          uploadedFilenames.push(`image_${Date.now()}.jpg`);
        }
      }
      return [...(formData.imageUrl || []), ...uploadedFilenames];

    } catch (error) {
      console.error("Rasm yuklanmadi:", error);
      if (error.response?.status === 401) {
        setErrorMessage('Kirish rad etildi. Token eskirgan.');
      } else {
        setErrorMessage('Rasm yuklanmadi. Qayta urinib ko\'ring.');
      }
      return null;
    } finally {
      setUploadingImages(false);
    }
  };

  const validateForm = () => {
    const requiredFields = ['name', 'price', 'category', 'code', 'sku', 'package_code'];
    const missingFields = requiredFields.filter(field => {
      const value = formData[field];
      return value === undefined || value === null || value.toString().trim() === '';
    });

    if (missingFields.length > 0) {
      setErrorMessage(`Quyidagi maydonlarni to'ldiring: ${missingFields.join(', ')}`);
      return false;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setErrorMessage("Narx 0 dan katta bo'lishi kerak");
      return false;
    }

    if (formData.quantity && Number(formData.quantity) < 0) {
      setErrorMessage("Miqdor 0 dan kichik bo'lishi mumkin emas");
      return false;
    }

    if (formData.salePercentage &&
      (Number(formData.salePercentage) < 0 || Number(formData.salePercentage) > 100)) {
      setErrorMessage("Chegirma foizi 0 dan 100 gacha bo'lishi kerak");
      return false;
    }

    if (formData.vat_percent && Number(formData.vat_percent) < 0) {
      setErrorMessage("QQS foizi 0 dan kichik bo'lishi mumkin emas");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      let uploadedImageUrls = [];
      if (selectedFiles.length > 0) {
        uploadedImageUrls = await uploadImagesToServer();
        if (uploadedImageUrls === null) {
          setLoading(false);
          return;
        }
      } else if (productToEdit && formData.imageUrl.length > 0) {
        uploadedImageUrls = formData.imageUrl;
      }

      const dataToSend = {
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        category: formData.category.trim(),
        company: formData.company.trim() || "",
        description: formData.description.trim() || "",
        code: formData.code.trim(),
        package_code: formData.package_code.trim(),
        imageUrl: uploadedImageUrls,
        price: parseFloat(formData.price) || 0,
        deliveryDays: parseInt(formData.deliveryDays, 10) || 0,
        salePercentage: parseInt(formData.salePercentage, 10) || 0,
        quantity: parseInt(formData.quantity, 10) || 1,
        vat_percent: parseFloat(formData.vat_percent) || 0,
      };

      console.log("Yuborilayotgan ma'lumot:", dataToSend);

      let response;
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (productToEdit) {
        const productId = productToEdit._id;
        response = await axios.put(
          `https://app.dentago.uz/api/product/${productId}`,
          dataToSend,
          config
        );
        setSuccessMessage('Mahsulot muvaffaqiyatli yangilandi!');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        response = await axios.post(
          'https://app.dentago.uz/api/product',
          dataToSend,
          config
        );
        setSuccessMessage('Mahsulot muvaffaqiyatli qo\'shildi!');

        setFormData({
          name: '',
          sku: '',
          imageUrl: [],
          category: '',
          company: '',
          price: '',
          description: '',
          deliveryDays: '',
          salePercentage: '',
          quantity: '',
          code: '',
          vat_percent: 0,
          package_code: '',
        });
        setSelectedFiles([]);
        setPreviewImages([]);
      }

      console.log("Server javobi:", response.data);

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error("Ma'lumot yuborishda xato:", error);

      let errorMsg = 'Xatolik yuz berdi. Qayta urinib ko\'ring.';

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);

        if (error.response.status === 401) {
          errorMsg = 'Kirish rad etildi. Token eskirgan yoki noto\'g\'ri.';
        } else if (error.response.status === 400) {
          errorMsg = 'Noto\'g\'ri so\'rov. Ma\'lumotlarni tekshiring.';
        } else if (error.response.status === 409) {
          errorMsg = 'Bu kod yoki SKU bilan mahsulot allaqachon mavjud.';
        } else if (error.response.status === 500) {
          errorMsg = 'Server xatosi. Iltimos, keyinroq urinib ko\'ring.';
        } else {
          errorMsg = error.response.data?.message ||
            error.response.data?.error ||
            `Server xatosi: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMsg = 'Serverga ulanib bo\'lmadi. Internet aloqasini tekshiring.';
      } else {
        errorMsg = error.message || 'Noma\'lum xatolik';
      }

      setErrorMessage(errorMsg);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 sm:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Дашбоард
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            {productToEdit ? 'Товарни таҳрирлаш' : 'Янги товар қўшиш'}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {(loading || uploadingImages) && (
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-md flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
              <p>
                {uploadingImages
                  ? `Rasmlar yuklanmoqda... (${selectedFiles.length} ta)`
                  : "Saqlanmoqda..."}
              </p>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md" role="alert">
              <p className="font-medium">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
              <p className="font-medium">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Товар номи
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block text-black w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Mahsulot nomini kiriting"
              />
            </div>

            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                Артикул
              </label>
              <input
                type="text"
                name="sku"
                id="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                className="mt-1 block text-black w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Mahsulot artikuli"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Нарх
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="mt-1 block text-black w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Количество
              </label>
              <input
                type="number"
                name="quantity"
                id="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                className="mt-1 block text-black w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="1"
              />
            </div>

            <div>
              <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-1">
                Расмлар
              </label>
              <div className="flex items-center gap-4">
                <label className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 transition">
                  Fayl tanlash
                  <input
                    type="file"
                    name="imageFile"
                    id="imageFile"
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="hidden text-black"
                  />
                </label>
                <span className="text-gray-500 text-sm">
                  {selectedFiles.length > 0 ? `${selectedFiles.length} ta fayl tanlandi` : 'Fayl tanlanmadi'}
                </span>
              </div>

              {previewImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Олдиндан кўриш:</p>
                  <div className="flex flex-wrap gap-4">
                    {previewImages.map((imgUrl, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imgUrl}
                          alt={`Tanlangan rasm ${index + 1}`}
                          className="w-32 h-32 object-cover rounded-md shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="deliveryDays" className="block text-sm font-medium text-gray-700 mb-1">
                Етказиб бериш кунлари
              </label>
              <input
                type="number"
                name="deliveryDays"
                id="deliveryDays"
                value={formData.deliveryDays}
                onChange={handleChange}
                min="0"
                className="mt-1 block text-black w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="salePercentage" className="block text-sm font-medium text-gray-700 mb-1">
                Чегирма фоизи (%)
              </label>
              <input
                type="number"
                name="salePercentage"
                id="salePercentage"
                value={formData.salePercentage}
                onChange={handleChange}
                min="0"
                max="100"
                className="mt-1 block text-black w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Категория
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 text-black block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="">Категорияни танланг</option>
                {categories.map((cat) => (
                  <option className='text-black' key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Компания/Бренд
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="mt-1 block w-full text-black px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Kompaniya nomi"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Код
              </label>
              <select
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="mt-1 block text-black w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="">Кодни танланг</option>
                {codeOptions.map((item, index) => (
                  <option className='text-black' key={index} value={item.code}>
                    {item.code} - {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="vat_percent" className="block text-sm font-medium text-gray-700 mb-1">
                НДС (%)
              </label>
              <input
                type="number"
                id="vat_percent"
                name="vat_percent"
                value={formData.vat_percent}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0"
                className="mt-1 block w-full text-black px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>

            <div>
              <label htmlFor="package_code" className="block text-sm font-medium text-gray-700 mb-1">
                Код упаковки
              </label>
              <input
                type="text"
                id="package_code"
                name="package_code"
                value={formData.package_code}
                onChange={handleChange}
                required
                className="mt-1 block w-full text-black px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Qadoqlash kodi"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Тавсиф
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full text-black px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Mahsulot tavsifi..."
              ></textarea>
            </div>

            <div className="md:col-span-2 text-right">
              <button
                type="submit"
                disabled={loading || uploadingImages}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? 'Юкланмоқда...'
                  : uploadingImages
                    ? 'Rasmlar yuklanmoqda...'
                    : productToEdit
                      ? 'Ўзгаришларни сақлаш'
                      : 'Товарни сақлаш'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;
