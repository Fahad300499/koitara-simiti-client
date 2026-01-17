import React, { useState } from 'react';
import { motion } from 'framer-motion';
import logo from '../../../public/logo.png';
import { Link } from 'react-router'; 
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import { AiOutlineMenu } from 'react-icons/ai';
import useRole from '../../hooks/useRole';

const Banner = () => {
    const { user, logOut } = useAuth();
    console.log(user)
    const {role} = useRole()
    const [isOpen, setIsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logOut();
            setIsUserMenuOpen(false); // মেনু বন্ধ করুন
            Swal.fire({
                title: "Logged Out!",
                text: "আপনি সফলভাবে লগআউট করেছেন।",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='text-center my-10 px-4 font-hind'>
            
{/* লোগো এবং হেডার সেকশন */}
<div className='relative py-12 px-6 rounded-3xl bg-white/30 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden'>
    
    {/* Background Decorative Elements (Optional) */}
    <div className="absolute top-0 left-0 w-20 h-20 bg-red-400/10 rounded-full -translate-x-10 -translate-y-10 blur-2xl"></div>
    <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-400/10 rounded-full translate-x-10 translate-y-10 blur-2xl"></div>

    <div className='flex flex-col md:flex-row justify-center items-center gap-10 relative z-10'>
        
        {/* বাম পাশের লোগো */}
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="relative"
        >
            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
            <img
                className="w-32 h-32 md:w-44 md:h-44 object-contain rounded-full shadow-2xl border-4 border-white relative"
                src={logo}
                alt="Logo"
            />
        </motion.div>

        {/* টেক্সট সেকশন */}
        <div className="text-center space-y-2">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-orange-600 drop-shadow-sm leading-tight'
            >
                কৈতরা যুব সমবায় সমিতি
            </motion.h1>
            
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='text-lg md:text-2xl font-semibold text-green-700 tracking-[0.2em] uppercase italic'
            >
                Koitara Jubo Somobai Somiti
            </motion.h2>

            <div className="flex items-center justify-center gap-2 mt-6">
                <div className="h-1.5 w-12 bg-red-500 rounded-full"></div>
                <div className="h-1.5 w-24 bg-gradient-to-r from-red-500 to-green-500 rounded-full"></div>
                <div className="h-1.5 w-12 bg-green-500 rounded-full"></div>
            </div>
        </div>

        {/* ডান পাশের লোগো (Desktop Only) */}
        <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="hidden md:block relative"
        >
            <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
            <img
                className="w-44 h-44 object-contain rounded-full shadow-2xl border-4 border-white relative"
                src={logo}
                alt="Logo"
            />
        </motion.div>
    </div>

    {/* ওয়েলকাম এবং বাটন সেকশন */}
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className='mt-12 text-center'
    >
        <div className="inline-block p-1 rounded-2xl bg-gray-100/50 backdrop-blur-sm border border-gray-200">
            <h3 className='text-lg md:text-xl px-6 py-3 text-gray-700 font-medium flex flex-wrap items-center justify-center gap-2'>
                <span>Welcome To Our Family.</span>
                <button 
                    onClick={() => setIsOpen(true)} 
                    className='relative group overflow-hidden bg-green-600 text-white px-5 py-2 rounded-xl font-bold transition-all duration-300 hover:bg-green-700 hover:shadow-lg hover:-translate-y-1'
                >
                    <span className='relative z-10'>সমিতি সম্পর্কে জানুন</span>
                    <span className='absolute bottom-0 left-0 w-full h-0 bg-white/20 transition-all duration-300 group-hover:h-full'></span>
                </button>
            </h3>
        </div>
    </motion.div>
</div>
            {/* গ্রিন বার সেকশন (এখান থেকে overflow-hidden সরানো হয়েছে) */}
            <div className='flex flex-col md:flex-row justify-between items-center bg-green-600 mt-10 rounded-lg shadow-inner min-h-[80px] relative px-4'>
                
                {/* স্ক্রলিং টেক্সট ডিভ (শুধুমাত্র এখানে overflow-hidden থাকবে) */}
                <div className="flex-1 overflow-hidden py-4">
                    <motion.div
                        animate={{ x: ["100%", "-100%"] }}
                        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                        className="whitespace-nowrap"
                    >
                        <h1 className='text-white font-bold text-xl md:text-2xl inline-block'>
                            {user ? `স্বাগতম, ${user.displayName || 'সদস্য'}!` : "সম্পূর্ণ এক্সেস পেতে এখনই লগইন করুন।"} 
                            &nbsp; | &nbsp; কৈতরা যুব সমবায় সমিতির পক্ষ থেকে আপনাকে অভিনন্দন।  
                        </h1>
                    </motion.div>
                </div>

                {/* প্রোফাইল ড্রপডাউন */}
                <div className='py-4 md:py-0 flex justify-center items-center'>
                    <div className='relative'>
                        {user ? (
                            <div className="relative">
                                <div 
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className='flex items-center gap-3 p-1 pr-3 border border-white/30 rounded-full cursor-pointer hover:shadow-lg transition-all bg-white/10 text-white'
                                >
                                    <div className='p-2'>
                                        <AiOutlineMenu className="text-white" />
                                    </div>
                                    <img 
                                        src={user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"} 
                                        alt="User" 
                                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                    />
                                </div>

                                {/* ড্রপডাউন মেনু - z-index এবং absolute পজিশন ঠিক করা হয়েছে */}
                                {isUserMenuOpen && (
                                    <div className='absolute right-0 top-full mt-3 z-[1000] w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 text-left'>
                                        <div className='px-4 py-3 bg-gray-50 border-b border-gray-100 mb-2'>
                                            <p className='text-xs text-gray-400 uppercase font-bold'>Logged in as</p>
                                            <p className='text-sm font-semibold text-green-600 capitalize'>{role || 'Member'}</p>
                                            <p className='text-[10px] text-gray-500 truncate'>{user?.email}</p>
                                        </div>
                                        
                                        <Link 
                                            to='/dashboard' 
                                            className='block px-4 py-2 hover:bg-green-50 text-gray-700 transition font-medium'
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        
                                        <button
                                            onClick={handleLogout}
                                            className='w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 transition font-medium'
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link 
                                className='bg-white text-green-600 px-8 py-2 rounded-full font-bold text-lg hover:bg-gray-100 shadow-md transition-all' 
                                to="/login"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* মডাল সেকশন */}
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
    <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-w-lg w-full relative overflow-hidden"
    >
        {/* উপরের কালার স্ট্রিপ */}
        <div className="h-2 w-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-600"></div>

        {/* ক্লোজ বাটন */}
        <button 
            onClick={() => setIsOpen(false)} 
            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 transition-all duration-300 z-10"
        >
            <span className="text-2xl leading-none">&times;</span>
        </button>

        <div className="p-8 md:p-10">
            {/* হেডার সেকশন */}
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-green-100 p-3 rounded-2xl">
                    <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">
                    সমিতি সম্পর্কে <span className="text-green-600">জানুন</span>
                </h2>
            </div>

            {/* তথ্য সেকশন */}
            <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
                <p className="bg-gray-50 p-4 rounded-xl border-l-4 border-green-500">
                    আমাদের সমিতি একটি একতাবদ্ধ যুব সংগঠন। আমাদের মূল লক্ষ্য হলো সঞ্চয় ও পারস্পরিক সহযোগিতার মাধ্যমে নিজেদের স্বাবলম্বী করে তোলা।
                </p>
                
                <div className="flex items-start gap-3">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
                    <p>২০২৫ সালের <span className="font-bold text-gray-800">০১লা মে</span> থেকে আমরা কৈতরা এলাকার যুবকদের নিয়ে এই পথচলা শুরু করি।</p>
                </div>

                <div className="bg-green-600 text-white p-5 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300 flex items-center justify-between">
                    <div>
                        <p className="text-green-100 text-sm uppercase tracking-wider font-semibold">মোট সদস্য সংখ্যা</p>
                        <p className="text-3xl font-black">৫৫ জন</p>
                    </div>
                    <div className="opacity-20">
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                    </div>

                    
                </div>
            </div>

            {/* ক্লোজ বাটন */}
            <button 
                onClick={() => setIsOpen(false)} 
                className="mt-10 w-full group relative flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-bold transition-all duration-300 hover:bg-red-600 active:scale-95 shadow-xl"
            >
                <span>ঠিক আছে, বুঝেছি</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </button>
        </div>
    </motion.div>
</div>
            )}
        </div>
    );
};

export default Banner;