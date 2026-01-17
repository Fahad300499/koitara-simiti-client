import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { auth } from '../../firebase/firebase.config'; 
import { onAuthStateChanged } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router'; 
import useRole from '../../hooks/useRole';
import { FaSearch, FaUserEdit, FaMoneyCheckAlt, FaPhoneAlt, FaIdBadge, FaUsers } from 'react-icons/fa';

const Member = () => {
    const { role } = useRole();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const [search, setSearch] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    
    const itemsPerPage = 12;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const { data: { result: members = [], count = 0 } = {}, isLoading } = useQuery({
        queryKey: ['members', currentPage, search],
        queryFn: async () => {
            const res = await axios(`https://koitara-simiti-2.onrender.com/members?page=${currentPage}&size=${itemsPerPage}&search=${search}`);
            return res.data;
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (updatedData) => {
            const res = await axios.patch(`https://koitara-simiti-2.onrender.com/members/${updatedData._id}`, updatedData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['members']);
            setSelectedMember(null);
            setIsEditing(false);
            Swal.fire({ title: "সফল!", text: "তথ্য আপডেট হয়েছে।", icon: "success", timer: 1500, showConfirmButton: false });
        }
    });

    const handleCardClick = (member) => {
        if (user) {
            setSelectedMember(member);
        } else {
            Swal.fire({
                title: "লগইন প্রয়োজন",
                text: "বিস্তারিত দেখতে লগইন করুন।",
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "লগইন",
                confirmButtonColor: '#10b981'
            }).then((result) => {
                if (result.isConfirmed) navigate('/login', { state: { from: location } });
            });
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (role === 'admin') return Swal.fire("দুঃখিত", "অ্যাডমিন টাকা জমা দিতে পারেন না", "error");

        const form = e.target;
        const month = form.month.value;
        const amount = Number(form.amount.value);
        const memberId = selectedMember._id.toString(); 

        try {
            const checkRes = await axios.get(`https://koitara-simiti-2.onrender.com/payments/check`, { params: { memberId, month } });
            if (checkRes.data.exists) {
                return Swal.fire("দুঃখিত!", `${selectedMember.name}-এর ${month} মাসের টাকা জমা আছে।`, "warning");
            }

            const paymentData = {
                memberId, memberName: selectedMember.name, amount, month,
                date: new Date().toISOString().split('T')[0],
                collectedBy: user?.email
            };

            const res = await axios.post('https://koitara-simiti-2.onrender.com/payments', paymentData);
            if (res.data.insertedId) {
                Swal.fire("সফল!", "টাকা জমা হয়েছে।", "success");
                setShowPaymentForm(false);
                setSelectedMember(null);
                queryClient.invalidateQueries(['payments']);
            }
        } catch (error) {
            Swal.fire("ভুল", "সার্ভার এরর!", "error");
        }
    };

    const pages = [...Array(Math.ceil(count / itemsPerPage)).keys()];

    return (
        <div className='min-h-screen bg-gray-50 pb-20 font-hind'>
            {/* হেডার সেকশন */}
            <div className='bg-white shadow-sm border-b mb-10'>
                <div className='container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-6'>
                    <div>
                        <h1 className='text-3xl font-black text-slate-800 flex items-center gap-3'>
                            <span className='p-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-200'>
                                <FaUsers />
                            </span>
                            সমিতির সদস্যবৃন্দ
                        </h1>
                        <p className='text-slate-500 mt-2 ml-1'>মোট সদস্য সংখ্যা: <span className='font-bold text-emerald-600'>{count} জন</span></p>
                    </div>

                    <div className='w-full max-w-md relative group'>
                        <input
                            type="text"
                            placeholder="নাম দিয়ে খুঁজুন..."
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(0); }}
                            className='w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50/50 outline-none transition-all shadow-sm group-hover:shadow-md'
                        />
                        <FaSearch className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors' size={20} />
                    </div>
                </div>
            </div>

            {/* মেম্বার গ্রিড */}
            <div className='container mx-auto px-4'>
                {isLoading ? (
                    <div className='flex justify-center py-20'><span className="loading loading-spinner loading-lg text-emerald-500"></span></div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                        {members.map(member => (
                            <div
                                key={member._id}
                                onClick={() => handleCardClick(member)}
                                className="group bg-white rounded-[2rem] overflow-hidden border border-gray-300 hover:border-emerald-200 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-100/50 cursor-pointer relative"
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                        <span className="text-white font-bold bg-emerald-500 px-4 py-2 rounded-full text-sm">বিস্তারিত দেখুন</span>
                                    </div>
                                </div>
                                <div className="p-6 text-center">
                                    <h2 className="text-xl font-bold text-slate-800 truncate">{member.name}</h2>
                                    <div className="flex justify-center gap-4 mt-3 text-sm text-slate-500">
                                        <span className='bg-gray-50 px-3 py-1 rounded-lg border border-gray-100'>ID: {member.idNo}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* পেজিনেশন */}
                {pages.length > 1 && (
                    <div className='flex justify-center items-center mt-16 gap-3'>
                        {pages.map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-12 h-12 rounded-xl font-bold transition-all ${currentPage === page ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 scale-110' : 'bg-white text-slate-600 hover:bg-emerald-50 border border-gray-100'}`}
                            >
                                {page + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* মডাল ডিজাইন */}
            {user && selectedMember && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        {/* মডাল হেডার */}
                        <div className='relative h-32 bg-gradient-to-r from-emerald-500 to-teal-600'>
                            <button className="absolute top-5 right-5 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors z-10" onClick={() => { setSelectedMember(null); setIsEditing(false); setShowPaymentForm(false); }}>✕</button>
                            <div className='absolute -bottom-12 left-1/2 -translate-x-1/2'>
                                <img className='w-32 h-32 rounded-[2rem] object-cover border-8 border-white shadow-xl' src={selectedMember.image} alt="" />
                            </div>
                        </div>

                        <div className="pt-16 p-8">
                            {!isEditing && !showPaymentForm ? (
                                <div className="space-y-6">
                                    <div className='text-center'>
                                        <h2 className='text-2xl font-black text-slate-800'>{selectedMember.name}</h2>
                                        <p className='text-emerald-600 font-bold'>সদস্য প্রোফাইল</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className='flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100'>
                                            <FaIdBadge className='text-emerald-500' />
                                            <div><p className='text-xs text-slate-400 uppercase font-bold'>সদস্য আইডি</p><p className='font-bold text-slate-700'>{selectedMember.idNo}</p></div>
                                        </div>
                                        <div className='flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100'>
                                            <FaPhoneAlt className='text-emerald-500' />
                                            <div><p className='text-xs text-slate-400 uppercase font-bold'>মোবাইল নম্বর</p><p className='font-bold text-slate-700'>{selectedMember.mobile}</p></div>
                                        </div>
                                        <div className='flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100'>
                                            <FaUsers className='text-emerald-500' />
                                            <div><p className='text-xs text-slate-400 uppercase font-bold'>অংশগ্রহন সংখ্যা</p><p className='font-bold text-slate-700'>{selectedMember.participantsCount}</p></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-8">
                                        <button
                                            disabled={role === 'admin'}
                                            onClick={() => setShowPaymentForm(true)}
                                            className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all shadow-lg ${role === 'admin' ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200"}`}
                                        >
                                            <FaMoneyCheckAlt /> টাকা জমা
                                        </button>
                                        <button
                                            onClick={() => { setFormData(selectedMember); setIsEditing(true); }}
                                            className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all"
                                        >
                                            <FaUserEdit /> এডিট
                                        </button>
                                    </div>
                                </div>
                            ) : showPaymentForm ? (
                                <form onSubmit={handlePaymentSubmit} className="space-y-5">
                                    <h2 className="text-xl font-black text-center text-slate-800 mb-6">মাসিক পেমেন্ট এন্ট্রি</h2>
                                    <div className='space-y-4'>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-500 mb-2">মাসের নাম</label>
                                            <select name="month" required className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-blue-500 outline-none transition-all">
                                                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-500 mb-2">টাকার পরিমাণ</label>
                                            <input type="number" name="amount" placeholder="৫০০" required className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-blue-500 outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100">নিশ্চিত করুন</button>
                                        <button type="button" onClick={() => setShowPaymentForm(false)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold">পিছনে</button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(formData); }} className="space-y-4">
                                    <h2 className="text-xl font-black text-center text-slate-800 mb-6">তথ্য পরিবর্তন</h2>
                                    <div className='grid gap-4'>
                                        <input name="name" defaultValue={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-emerald-500 outline-none" placeholder="নাম" />
                                        <input name="mobile" defaultValue={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-emerald-500 outline-none" placeholder="মোবাইল" />
                                        <input name="participantsCount" defaultValue={formData.participantsCount} onChange={(e) => setFormData({...formData, participantsCount: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-emerald-500 outline-none" placeholder="অংশগ্রহন সংখ্যা" />
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button type="submit" className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100">আপডেট করুন</button>
                                        <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold">বাতিল</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Member;