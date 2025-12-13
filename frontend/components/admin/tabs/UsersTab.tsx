import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../../api';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';
import { Users, XCircle, Eye, EyeOff, Edit, Trash2, Key } from 'lucide-react';
import { User } from '../../../types';

interface UsersTabProps {
    currentUser: User | null;
}

const UsersTab: React.FC<UsersTabProps> = ({ currentUser }) => {
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<User | null>(null);
    const [resettingPasswordUser, setResettingPasswordUser] = useState<User | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [newUserPermissions, setNewUserPermissions] = useState<string[]>([]);
    const [editingPermissions, setEditingPermissions] = useState<string[]>([]);

    // Available permissions for new users
    const AVAILABLE_PERMISSIONS = [
        { id: 'LEADS', label: 'Leads' },
        { id: 'EMAIL', label: 'Email' },
        { id: 'USERS', label: 'Admins' },
        { id: 'ACTIVITY', label: 'Activity' }
    ];

    // Sync editingPermissions
    useEffect(() => {
        if (editingAdmin) {
            setEditingPermissions(editingAdmin.permissions || []);
        }
    }, [editingAdmin]);

    // Reset new user permissions when opening modal
    useEffect(() => {
        if (isAddUserModalOpen) {
            setNewUserPermissions([]);
        }
    }, [isAddUserModalOpen]);

    // Queries
    const { data: users = [], refetch: refetchUsers } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await api.get('/users');
            return response.data;
        },
        enabled: currentUser?.role === 'SUPER_ADMIN',

    });

    // Mutations
    const createUserMutation = useMutation({
        mutationFn: (newUser: any) => api.post('/users', newUser),
        onSuccess: () => {
            toast.success("Admin added successfully");
            setIsAddUserModalOpen(false);
            refetchUsers();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to add admin");
        }
    });

    const updateUserMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: any }) => api.put(`/users/${id}`, data),
        onSuccess: () => {
            toast.success("Admin updated successfully");
            setEditingAdmin(null);
            refetchUsers();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to update admin");
        }
    });

    const resetPasswordMutation = useMutation({
        mutationFn: ({ id, password }: any) => api.put(`/users/${id}/reset-password`, { password }),
        onSuccess: () => {
            toast.success("Password reset successfully");
            setResettingPasswordUser(null);
            setShowPassword(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to reset password");
        }
    });

    const deleteUserMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/users/${id}`),
        onSuccess: () => {
            toast.success("Admin deleted successfully");
            refetchUsers();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to delete admin");
        }
    });

    return (
        <>
            <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50">
                    <h2 className="text-lg font-medium text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-500" />
                        Admin Users
                    </h2>
                    <button
                        onClick={() => setIsAddUserModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Add New Admin
                    </button>
                </div>
                <div className="overflow-x-auto">
                    {/* PC View - Table */}
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 hidden md:table">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Permissions</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {users.map((user: User) => (
                                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                                            {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Standard Admin'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {user.role === 'SUPER_ADMIN' ? (
                                                <span className="text-xs text-slate-500 italic">All Permissions</span>
                                            ) : (
                                                user.permissions?.map(p => (
                                                    <span key={p} className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                                        {p}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setResettingPasswordUser(user)}
                                                className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300 p-1"
                                                title="Reset Password"
                                            >
                                                <Key className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setEditingAdmin(user)}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1"
                                                title="Edit User"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            {user.id !== currentUser?.id && (
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
                                                            deleteUserMutation.mutate(user.id);
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile View - Cards */}
                    <div className="md:hidden space-y-4 p-4 bg-slate-50 dark:bg-slate-900/50">
                        {users.map((user: User) => (
                            <div key={user.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{user.name}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                                        {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Standard Admin'}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Permissions</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {user.role === 'SUPER_ADMIN' ? (
                                            <span className="text-xs text-slate-500 italic">All Permissions</span>
                                        ) : user.permissions && user.permissions.length > 0 ? (
                                            user.permissions.map(p => (
                                                <span key={p} className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                                    {p}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">No specific permissions</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                                    <button
                                        onClick={() => setResettingPasswordUser(user)}
                                        className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800/50"
                                    >
                                        <Key className="w-3.5 h-3.5" /> Reset
                                    </button>
                                    <button
                                        onClick={() => setEditingAdmin(user)}
                                        className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800/50"
                                    >
                                        <Edit className="w-3.5 h-3.5" /> Edit
                                    </button>
                                    {user.id !== currentUser?.id && (
                                        <button
                                            onClick={() => {
                                                if (confirm(`Are you sure you want to delete ${user.name}?`)) {
                                                    deleteUserMutation.mutate(user.id);
                                                }
                                            }}
                                            className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800/50"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            {isAddUserModalOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New User</h3>
                            <button onClick={() => setIsAddUserModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target as HTMLFormElement);

                            createUserMutation.mutate({
                                name: formData.get('name'),
                                email: formData.get('email'),
                                password: formData.get('password'),
                                role: 'USER', // Always create as standard USER
                                permissions: newUserPermissions
                            });
                        }} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                                <input name="name" required className="w-full rounded-lg border border-slate-300 dark:border-slate-600 p-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                <input name="email" type="email" required className="w-full rounded-lg border border-slate-300 dark:border-slate-600 p-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                                <input name="password" type="password" required className="w-full rounded-lg border border-slate-300 dark:border-slate-600 p-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Access Permissions</label>
                                <div className="flex flex-wrap gap-2">
                                    {AVAILABLE_PERMISSIONS.map(perm => {
                                        const isSelected = newUserPermissions.includes(perm.id);
                                        return (
                                            <button
                                                key={perm.id}
                                                type="button"
                                                onClick={() => {
                                                    if (isSelected) setNewUserPermissions(prev => prev.filter(p => p !== perm.id));
                                                    else setNewUserPermissions(prev => [...prev, perm.id]);
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${isSelected
                                                    ? 'bg-green-100 text-green-700 border-green-500 dark:bg-green-900/30 dark:text-green-400 dark:border-green-500'
                                                    : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                                                    }`}
                                            >
                                                {perm.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="px-4 py-2 text-slate-600 hover:text-slate-800 mr-2">Cancel</button>
                                <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* Reset Password Modal */}
            {resettingPasswordUser && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reset Password</h3>
                            <button onClick={() => setResettingPasswordUser(null)} className="text-slate-400 hover:text-slate-600">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target as HTMLFormElement);
                            resetPasswordMutation.mutate({
                                id: resettingPasswordUser.id,
                                password: formData.get('password')
                            });
                        }} className="p-6 space-y-4">
                            <p className="text-sm text-slate-500">
                                Resetting password for <strong>{resettingPasswordUser.name}</strong> ({resettingPasswordUser.email}).
                            </p>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 p-2.5 pr-10 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button type="button" onClick={() => setResettingPasswordUser(null)} className="px-4 py-2 text-slate-600 hover:text-slate-800 mr-2">Cancel</button>
                                <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium">Reset Password</button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* Edit Admin Modal */}
            {editingAdmin && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Admin</h3>
                            <button onClick={() => setEditingAdmin(null)} className="text-slate-400 hover:text-slate-600">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target as HTMLFormElement);

                            updateUserMutation.mutate({
                                id: editingAdmin.id,
                                data: {
                                    name: formData.get('name'),
                                    // Email usually not editable
                                    permissions: editingPermissions,
                                    role: editingAdmin.role
                                }
                            });
                        }} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                                <input name="name" defaultValue={editingAdmin.name} required className="w-full rounded-lg border border-slate-300 dark:border-slate-600 p-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                <input name="email" type="email" defaultValue={editingAdmin.email} disabled className="w-full rounded-lg border border-slate-300 dark:border-slate-600 p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Access Permissions</label>
                                <div className="flex flex-wrap gap-2">
                                    {AVAILABLE_PERMISSIONS.map(perm => {
                                        const isSelected = editingPermissions.includes(perm.id);
                                        return (
                                            <button
                                                key={perm.id}
                                                type="button"
                                                onClick={() => {
                                                    if (isSelected) setEditingPermissions(prev => prev.filter(p => p !== perm.id));
                                                    else setEditingPermissions(prev => [...prev, perm.id]);
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${isSelected
                                                    ? 'bg-green-100 text-green-700 border-green-500 dark:bg-green-900/30 dark:text-green-400 dark:border-green-500'
                                                    : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                                                    }`}
                                            >
                                                {perm.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button type="button" onClick={() => setEditingAdmin(null)} className="px-4 py-2 text-slate-600 hover:text-slate-800 mr-2">Cancel</button>
                                <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default UsersTab;
