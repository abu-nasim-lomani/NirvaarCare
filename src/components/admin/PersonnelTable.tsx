"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Loader2, User, UserPlus, FileEdit, X } from "lucide-react";

type PersonnelUser = {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    created_at: string;
    role: string;
};

export default function PersonnelTable({ roleName }: { roleName: "caregiver" | "doctor" | "partner" }) {
    const [users, setUsers] = useState<PersonnelUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    // Form States
    const [formData, setFormData] = useState({ id: "", full_name: "", phone: "", email: "", password: "" });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/personnel?role=${roleName}`);
            const data = await res.json();
            if (res.ok) setUsers(data.personnel || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [roleName]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError("");

        try {
            const res = await fetch("/api/admin/personnel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, role: roleName })
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || "Failed to create user");
            
            setIsAddModalOpen(false);
            setFormData({ id: "", full_name: "", phone: "", email: "", password: "" });
            fetchUsers();
            
        } catch (err: any) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError("");

        try {
            const res = await fetch(`/api/admin/personnel/${formData.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: formData.full_name,
                    phone: formData.phone,
                    ...(formData.password ? { password: formData.password } : {})
                })
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || "Failed to update user");
            
            setIsEditModalOpen(false);
            setFormData({ id: "", full_name: "", phone: "", email: "", password: "" });
            fetchUsers();
            
        } catch (err: any) {
            setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to permanently delete access for ${name}?`)) return;
        
        try {
            const res = await fetch(`/api/admin/personnel/${id}`, { method: "DELETE" });
            if (res.ok) {
                setUsers(users.filter(u => u.id !== id));
            } else {
                const data = await res.json();
                alert(`Error: ${data.error}`);
            }
        } catch (err) {
            alert("Network error processing deletion");
        }
    };

    const openEdit = (user: PersonnelUser) => {
        setFormData({ id: user.id, full_name: user.full_name, email: user.email, phone: user.phone, password: "" });
        setIsEditModalOpen(true);
    };

    const formatRole = (r: string) => r.charAt(0).toUpperCase() + r.slice(1);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder={`Search ${formatRole(roleName)}s...`} 
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
                <button 
                    onClick={() => { setFormData({ id: "", full_name: "", phone: "", email: "", password: "" }); setIsAddModalOpen(true); }}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors whitespace-nowrap shadow-sm shadow-emerald-600/20"
                >
                    <Plus size={18} /> Add {formatRole(roleName)}
                </button>
            </div>

            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                        <Loader2 className="animate-spin mb-4 text-emerald-500" size={32} />
                        <p>Loading records...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="h-[400px] flex flex-col justify-center items-center text-center p-6">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <User size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No {formatRole(roleName)}s Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm">You haven't setup any accounts for this role yet. Click the button above to add one.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800 text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Added On</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center font-bold text-sm tracking-widest shrink-0">
                                                    {user.full_name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm">{user.full_name}</p>
                                                    <div className="flex items-center mt-1">
                                                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5 shrink-0"></span>
                                                        <p className="text-xs text-gray-500 font-medium">{formatRole(roleName)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.email}</p>
                                            {user.phone && <p className="text-xs text-gray-500 mt-1">{user.phone}</p>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(user)} className="p-2 text-gray-400 hover:text-blue-500 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(user.id, user.full_name)} className="p-2 text-gray-400 hover:text-red-500 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Overlay shared logic */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {isAddModalOpen ? <UserPlus className="text-emerald-500" /> : <FileEdit className="text-emerald-500" />}
                                {isAddModalOpen ? `Add New ${formatRole(roleName)}` : `Edit ${formatRole(roleName)}`}
                            </h3>
                            <button 
                                onClick={() => isAddModalOpen ? setIsAddModalOpen(false) : setIsEditModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={isAddModalOpen ? handleCreate : handleUpdate} className="p-6 space-y-4">
                            {formError && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl">
                                    {formError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                <input required type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                            </div>
                            
                            {isAddModalOpen && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number (Optional)</label>
                                <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {isAddModalOpen ? 'Account Password' : 'New Password (leave blank to keep current)'}
                                </label>
                                <input required={isAddModalOpen} type="text" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => isAddModalOpen ? setIsAddModalOpen(false) : setIsEditModalOpen(false)} className="px-5 py-2.5 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button disabled={submitting} type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2">
                                    {submitting && <Loader2 className="animate-spin" size={16} />}
                                    {isAddModalOpen ? 'Create Account' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
