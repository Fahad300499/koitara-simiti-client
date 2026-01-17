import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaCheck, FaTimes, FaHistory, FaMoneyBillWave } from 'react-icons/fa'; // কিছু আইকন যোগ করা হয়েছে
import useAuth from '../hooks/useAuth';

const ApprovePayment = () => {
    const {user} = useAuth();
    const queryClient = useQueryClient();

    const { data: payments = [], isLoading } = useQuery({
        queryKey: ['adminAllPayments'],
        queryFn: async () => {
            const res = await axios.get('https://koitara-simiti-2.onrender.com/admin/all-payments');
            return res.data;
        }
    });

    const mutation = useMutation({
        mutationFn: async ({ id, status }) => {
            const res = await axios.patch(`https://koitara-simiti-2.onrender.com/payments/status/${id}`, { status });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['adminAllPayments']);
            Swal.fire({
                title: "সফল!",
                text: "পেমেন্ট স্ট্যাটাস আপডেট হয়েছে।",
                icon: "success",
                confirmButtonColor: '#10b981'
            });
        },
        onError: () => {
            Swal.fire("ভুল!", "আপডেট করা সম্ভব হয়নি।", "error");
        }
    });

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <span className="loading loading-ring loading-lg text-emerald-500"></span>
        </div>
    );

    return (
        <div className="p-4 md:p-10 bg-slate-50 min-h-screen">
            {/* হেডার সেকশন */}
            <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                        <FaMoneyBillWave className="text-emerald-500" />
                        পেমেন্ট ম্যানেজমেন্ট
                    </h2>
                    <p className="text-slate-500 mt-1">সদস্যদের মাসিক জমার তালিকা ও অনুমোদন</p>
                </div>
                <div className="stats shadow bg-emerald-50 text-emerald-700">
                    <div className="stat py-2 px-4">
                        <div className="stat-title text-emerald-600 font-medium">মোট পেমেন্ট করেছেন</div>
                        <div className="stat-value text-2xl text-center">{payments.length} জন</div>
                    </div>
                </div>
            </div>

            {/* টেবিল কার্ড */}
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        {/* টেবিল হেড */}
                        <thead className="bg-slate-800 text-white uppercase text-xs">
                            <tr>
                                <th className="py-5 pl-8 text-xl">সদস্যের তথ্য</th>
                                <th className='text-xl'>মাস ও তারিখ</th>
                                <th className='text-xl'>পরিমাণ</th>
                                <th className='text-xl'>স্ট্যাটাস</th>
                                <th className="text-center text-xl">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {payments.map((payment) => (
                                <tr key={payment._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="pl-8 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="avatar placeholder">
                                                <div className="bg-emerald-100 text-emerald-700 rounded-full w-10">
                                                    <img src={user?.photoURL} alt="" srcset="" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-700">{payment.memberName}</div>
                                                <div className="text-xs text-slate-400">ID: {payment.memberId?.slice(-6)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-medium text-slate-600">{payment.month}</div>
                                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                            <FaHistory /> {payment.date || 'N/A'}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="text-lg font-bold text-emerald-600">{payment.amount} ৳</span>
                                    </td>
                                    <td>
                                        <div className={`badge badge-md gap-2 font-bold py-3 px-4 ${
                                            payment.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' : 
                                            payment.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' : 
                                            'bg-amber-100 text-amber-700 border-amber-200'
                                        }`}>
                                            <span className={`w-2 h-2 rounded-full animate-pulse ${
                                                payment.status === 'approved' ? 'bg-green-500' : 
                                                payment.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'
                                            }`}></span>
                                            {payment.status === 'pending' ? 'পেন্ডিং' : payment.status === 'approved' ? 'অনুমোদিত' : 'বাতিল'}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <div className="flex justify-center gap-2">
                                            {/* Approve Button */}
                                            <button 
                                                disabled={payment.status === 'approved'}
                                                onClick={() => mutation.mutate({ id: payment._id, status: 'approved' })}
                                                className={`btn btn-sm btn-circle btn-success text-white shadow-md hover:scale-110 transition-transform ${payment.status === 'approved' ? 'btn-disabled opacity-30' : ''}`}
                                                title="Approve"
                                            >
                                                <FaCheck size={12} />
                                            </button>

                                            {/* Reject Button */}
                                            <button 
                                                disabled={payment.status === 'rejected'}
                                                onClick={() => mutation.mutate({ id: payment._id, status: 'rejected' })}
                                                className={`btn btn-sm btn-circle btn-error text-white shadow-md hover:scale-110 transition-transform ${payment.status === 'rejected' ? 'btn-disabled opacity-30' : ''}`}
                                                title="Reject"
                                            >
                                                <FaTimes size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {payments.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-slate-300 text-6xl mb-4 flex justify-center"><FaMoneyBillWave /></div>
                        <p className="text-slate-500 font-medium">বর্তমানে কোনো পেমেন্ট রেকর্ড নেই।</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApprovePayment;