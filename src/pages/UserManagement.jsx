import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ShieldCheck, UserCog, Ban } from 'lucide-react';

const UserManagement = () => {
    const queryClient = useQueryClient();

    // ১. সব ইউজারদের ডাটা নিয়ে আসা
    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axios.get('https://koitara-simiti-2.onrender.com/users');
            return res.data;
        }
    });

    // ২. রোল পরিবর্তন করার মিউটেশন
    const roleMutation = useMutation({
        mutationFn: async ({ id, newRole }) => {
            const res = await axios.patch(`https://koitara-simiti-2.onrender.com/users/role/${id}`, { role: newRole });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            Swal.fire("Updated!", "User role has been updated.", "success");
        }
    });

    if (isLoading) return <p className="text-center p-10">Loading users...</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
                <UserCog className="text-blue-600" /> User Management
            </h2>
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
                <table className="table w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th>User Info</th>
                            <th>Current Role</th>
                            <th>Actions (Change Role)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                <td>
                                    <div className="font-bold">{user.name}</div>
                                    <div className="text-sm opacity-50">{user.email}</div>
                                </td>
                                <td>
                                    <span className={`badge badge-sm font-semibold p-3 ${
                                        user.role === 'admin' ? 'badge-primary' : 
                                        user.role === 'creator' ? 'badge-secondary' : 'badge-ghost'
                                    }`}>
                                        {user.role.toUpperCase()}
                                    </span>
                                </td>
                                <td className="flex gap-2">
                                    {/* Make Creator Button */}
                                    <button 
                                        onClick={() => roleMutation.mutate({ id: user._id, newRole: 'creator' })}
                                        disabled={user.role === 'creator' || user.role === 'admin'}
                                        className="btn btn-sm btn-outline btn-secondary"
                                    >
                                        Make Creator
                                    </button>

                                    {/* Make Admin Button */}
                                    <button 
                                        onClick={() => roleMutation.mutate({ id: user._id, newRole: 'admin' })}
                                        disabled={user.role === 'admin'}
                                        className="btn btn-sm btn-outline btn-primary"
                                    >
                                        Make Admin
                                    </button>

                                    {/* Block/Make User Button */}
                                    <button 
                                        onClick={() => roleMutation.mutate({ id: user._id, newRole: 'user' })}
                                        disabled={user.role === 'user'}
                                        className="btn btn-sm btn-ghost text-red-500"
                                    >
                                        <Ban size={16} className="mr-1" /> Demote to User
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;