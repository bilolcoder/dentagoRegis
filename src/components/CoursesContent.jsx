import React, { useState } from 'react';
import { Plus, MessageSquare, CreditCard, User, Star, Send, X, Trash2, BookOpen } from 'lucide-react';
import { useData } from '../context/DataProvider';
import Modal from './common/Modal';
import { Link } from 'react-router-dom';

const CoursesContent = () => {
    const { data, updateData, t } = useData();
    const courses = data.courses || [];

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const [courseForm, setCourseForm] = useState({
        name: '',
        teacher: '',
        price: '',
        image: ''
    });

    const [commentText, setCommentText] = useState({});

    const handleAddCourse = () => {
        if (!courseForm.name || !courseForm.teacher || !courseForm.price) return;

        const newCourse = {
            id: Date.now(),
            ...courseForm,
            comments: []
        };

        updateData('courses', newCourse, 'ADD');
        setIsAddModalOpen(false);
        setCourseForm({ name: '', teacher: '', price: '', image: '' });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCourseForm(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBuyClick = (course) => {
        setSelectedCourse(course);
        setIsPaymentModalOpen(true);
    };

    const handleAddComment = (courseId) => {
        if (!commentText[courseId]) return;

        const newComment = {
            id: Date.now(),
            user: "Siz",
            text: commentText[courseId],
            date: new Date().toISOString().split('T')[0]
        };

        const course = courses.find(c => c.id === courseId);
        const updatedCourse = {
            ...course,
            comments: [...(course.comments || []), newComment]
        };

        updateData('courses', updatedCourse, 'UPDATE');
        setCommentText(prev => ({ ...prev, [courseId]: '' }));
    };

    const handleDeleteCourse = (id) => {
        if (window.confirm(t('confirm_delete'))) {
            updateData('courses', { id }, 'DELETE');
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8 bg-white dark:bg-slate-950 min-h-full">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    {/* <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                        {t('courses_title')}
                    </h1> */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('dental_courses')}</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 uppercase tracking-widest text-xs"
                >
                    <Plus className="w-5 h-5" />
                    {t('add_course')}
                </button>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.length > 0 ? courses.map((course) => (
                    <div
                        key={course.id}
                        className="group flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-blue-50 dark:border-blue-900/10 shadow-2xl shadow-blue-500/5 transition-all hover:-translate-y-2 hover:shadow-blue-500/10"
                    >
                        {/* Course Image */}
                        <div className="relative h-56 overflow-hidden">
                            <img
                                src={course.image || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80"}
                                alt={course.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <h3 className="text-xl font-black text-white leading-tight uppercase tracking-tight">{course.name}</h3>
                            </div>
                            <button
                                onClick={() => handleDeleteCourse(course.id)}
                                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-red-500/80 text-white rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Course Info */}
                        <div className="p-6 flex-1 flex flex-col space-y-4">
                            <div className="flex items-center justify-between text-slate-400">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <User className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider">{course.teacher}</span>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-xs font-black">4.9</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xl font-black text-blue-600 dark:text-blue-500 tracking-tighter">{course.price}</span>
                                <button
                                    onClick={() => handleBuyClick(course)}
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-widest"
                                >
                                    <CreditCard className="w-4 h-4" />
                                    {t('buy_now')}
                                </button>
                            </div>

                            {/* Comments Section */}
                            <div className="pt-4 border-t border-blue-50 dark:border-blue-900/10 space-y-4">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{t('comments')}</span>
                                </div>

                                <div className="max-h-32 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-blue-500">
                                    {course.comments && course.comments.map(comment => (
                                        <div key={comment.id} className="bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-2xl">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">{comment.user}</span>
                                                <span className="text-[9px] font-bold text-slate-400">{comment.date}</span>
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{comment.text}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Write Comment */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder={t('write_comment')}
                                        value={commentText[course.id] || ''}
                                        onChange={(e) => setCommentText(prev => ({ ...prev, [course.id]: e.target.value }))}
                                        className="flex-1 px-4 py-2 bg-blue-50/30 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/10 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none placeholder:text-slate-400"
                                    />
                                    <button
                                        onClick={() => handleAddComment(course.id)}
                                        className="p-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 active:scale-90 transition-all"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 space-y-4">
                        <BookOpen className="w-16 h-16 opacity-20" />
                        <p className="text-lg font-bold italic">{t('no_courses')}</p>
                    </div>
                )}
            </div>

            {/* Add Course Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title={t('add_course')}
                footer={
                    <button
                        onClick={handleAddCourse}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all uppercase tracking-widest text-sm"
                    >
                        {t('add')}
                    </button>
                }
            >
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t('course_name')}</label>
                        <input
                            type="text"
                            value={courseForm.name}
                            onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                            className="w-full px-5 py-3.5 bg-blue-50/30 dark:bg-slate-800 border border-blue-100 dark:border-blue-900/20 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t('teacher_name')}</label>
                        <input
                            type="text"
                            value={courseForm.teacher}
                            onChange={(e) => setCourseForm({ ...courseForm, teacher: e.target.value })}
                            className="w-full px-5 py-3.5 bg-blue-50/30 dark:bg-slate-800 border border-blue-100 dark:border-blue-900/20 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t('course_price')}</label>
                        <input
                            type="text"
                            value={courseForm.price}
                            onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                            placeholder="1 500 000 so'm"
                            className="w-full px-5 py-3.5 bg-blue-50/30 dark:bg-slate-800 border border-blue-100 dark:border-blue-900/20 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t('course_image')}</label>
                        <div className="relative group/upload">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="course-image-upload"
                            />
                            <label
                                htmlFor="course-image-upload"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-100 dark:border-blue-900/30 rounded-2xl bg-blue-50/20 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all cursor-pointer overflow-hidden"
                            >
                                {courseForm.image ? (
                                    <div className="relative w-full h-full">
                                        <img src={courseForm.image} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-all flex items-center justify-center">
                                            <p className="text-white text-[10px] font-black uppercase tracking-widest">Almashtirish</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Plus className="w-8 h-8 text-blue-400 mb-2" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rasm tanlang</p>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Payment Modal Simulation */}
            <Modal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                title={t('payment_modal_title')}
            >
                <div className="text-center space-y-8">
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] inline-block">
                        <CreditCard className="w-16 h-16 text-blue-600 mx-auto" />
                    </div>

                    <div>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-4">
                            {selectedCourse?.name}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
                            {t('payment_description')}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 border border-blue-100 dark:border-blue-900/20 rounded-3xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all cursor-pointer group">
                            <div className="h-8 w-12 bg-slate-100 dark:bg-slate-800 rounded-md mx-auto mb-3 flex items-center justify-center font-black text-[10px] text-slate-400">VISA</div>
                            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Karta orqali</span>
                        </div>
                        <div className="p-5 border border-blue-100 dark:border-blue-900/20 rounded-3xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all cursor-pointer group">
                            <div className="h-8 w-12 bg-slate-100 dark:bg-slate-800 rounded-md mx-auto mb-3 flex items-center justify-center font-black text-[10px] text-slate-400 italic">Click</div>
                            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Click / Payme</span>
                        </div>
                    </div>

                    <div className="bg-blue-600/5 dark:bg-blue-500/5 p-4 rounded-2xl text-[10px] font-bold text-blue-600 dark:text-blue-400 italic">
                        * Bu qism demo rejimida ishlamoqda
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CoursesContent;
