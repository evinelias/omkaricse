import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { createPortal } from 'react-dom';
import { Table, Search, Download, Trash2, Copy, BarChart2, Users, PlusCircle, Phone, CheckCircle, XCircle, MessageSquare, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Lead, User } from '../../../types';

interface LeadsTabProps {
    currentUser: User | null;
}

const LeadsTab: React.FC<LeadsTabProps> = ({ currentUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [remarksLead, setRemarksLead] = useState<Lead | null>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Queries
    const { data: leads = [], isLoading: isLoadingLeads } = useQuery({
        queryKey: ['leads'],
        queryFn: async () => {
            try {
                const response = await api.get('/leads');
                return response.data;
            } catch (error) {
                navigate('/admin/login');
                throw error;
            }
        },
    });



    // Notifications Logic could be here, but simpler to keep in main Dashboard or use a custom hook. 
    // We'll skip Moving notification logic for now to keep it simple, or move it if the user wants. 
    // The user asked to refactor pages, implying UI mainly. I'll leave Notification logic in Main Layout for now as it's global.

    // Derived Stats
    const stats = useMemo(() => ({
        total: leads.length,
        new: leads.filter((l: Lead) => l.status === 'NEW').length,
        contacted: leads.filter((l: Lead) => l.status === 'CONTACTED').length,
        qualified: leads.filter((l: Lead) => l.status === 'QUALIFIED').length,
        unqualified: leads.filter((l: Lead) => l.status === 'UNQUALIFIED').length,
    }), [leads]);

    // Filter Leads
    const filteredLeads = useMemo(() => {
        const lowerTerm = searchTerm.toLowerCase();
        return leads.filter((lead: Lead) => {
            const matchesSearch =
                lead.name.toLowerCase().includes(lowerTerm) ||
                lead.email.toLowerCase().includes(lowerTerm) ||
                lead.phone.includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [leads, searchTerm, statusFilter]);

    // Mutations
    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number; status: string }) => {
            await api.put(`/leads/status/${id}`, { status });
            return { id, status };
        },
        onMutate: async ({ id, status }) => {
            await queryClient.cancelQueries({ queryKey: ['leads'] });
            const previousLeads = queryClient.getQueryData<Lead[]>(['leads']);
            queryClient.setQueryData<Lead[]>(['leads'], (old) =>
                old?.map(l => l.id === id ? { ...l, status } : l) || []
            );
            return { previousLeads };
        },
        onError: (err, newTodo, context) => {
            queryClient.setQueryData(['leads'], context?.previousLeads);
            toast.error("Failed to update status");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
        },
        onSuccess: (data) => {
            toast.success(`Status updated to ${data.status}`);
            if (selectedLead && selectedLead.id === data.id) {
                setSelectedLead(prev => prev ? { ...prev, status: data.status } : null);
            }
        },
    });

    const deleteLeadMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/leads/${id}`);
            return id;
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['leads'] });
            const previousLeads = queryClient.getQueryData<Lead[]>(['leads']);
            queryClient.setQueryData<Lead[]>(['leads'], (old) =>
                old?.filter(l => l.id !== id) || []
            );
            return { previousLeads };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(['leads'], context?.previousLeads);
            toast.error('Failed to delete lead');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
        },
        onSuccess: () => {
            toast.success('Lead deleted successfully');
            setSelectedLead(null);
        }
    });

    const addRemarkMutation = useMutation({
        mutationFn: ({ id, remark }: { id: number, remark: string }) => api.post(`/leads/${id}/remarks`, { remark }),
        onSuccess: () => {
            toast.success("Remark added");
            queryClient.invalidateQueries({ queryKey: ['remarks', remarksLead?.id] });
            queryClient.invalidateQueries({ queryKey: ['leads'] });
        },
        onError: () => toast.error("Failed to add remark")
    });

    const deleteRemarkMutation = useMutation({
        mutationFn: (remarkId: number) => api.delete(`/leads/remarks/${remarkId}`),
        onSuccess: () => {
            toast.success("Remark deleted");
            queryClient.invalidateQueries({ queryKey: ['remarks', remarksLead?.id] });
            queryClient.invalidateQueries({ queryKey: ['leads'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to delete remark");
        }
    });

    const { data: remarks = [] } = useQuery({
        queryKey: ['remarks', remarksLead?.id],
        queryFn: () => api.get(`/leads/${remarksLead?.id}/remarks`).then(r => r.data),
        enabled: !!remarksLead
    });

    const handleStatusChange = (id: number, newStatus: string) => {
        updateStatusMutation.mutate({ id, status: newStatus });
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this lead?")) {
            deleteLeadMutation.mutate(id);
        }
    };

    const handleCopy = (lead: Lead) => {
        // ... Copy logic
        const text = `
Lead Details:
Name: ${lead.name}
Student: ${lead.studentName || 'N/A'}
Phone: ${lead.phone}
Email: ${lead.email}
Interest: ${lead.grade || 'N/A'}
Message: ${lead.message}
Source: ${lead.source}
Date: ${new Date(lead.createdAt).toLocaleDateString()}
      `.trim();
        navigator.clipboard.writeText(text);
        toast.success('Lead details copied to clipboard!');
    };

    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(leads);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Leads');
        XLSX.writeFile(wb, 'OIS_Leads.xlsx');
    };

    return (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4 px-4 sm:px-0">
                <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm opacity-80">Total Leads</p>
                        <h3 className="text-3xl font-bold">{stats.total}</h3>
                    </div>
                    <div className="absolute right-2 bottom-2 bg-white/20 p-2 rounded-lg"><Users className="w-6 h-6 text-white" /></div>
                </div>
                <div className="bg-sky-500 text-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm opacity-80">New Leads</p>
                        <h3 className="text-3xl font-bold">{stats.new}</h3>
                    </div>
                    <div className="absolute right-2 bottom-2 bg-white/20 p-2 rounded-lg"><PlusCircle className="w-6 h-6 text-white" /></div>
                </div>
                <div className="bg-amber-500 text-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm opacity-80">Contacted</p>
                        <h3 className="text-3xl font-bold">{stats.contacted}</h3>
                    </div>
                    <div className="absolute right-2 bottom-2 bg-white/20 p-2 rounded-lg"><Phone className="w-6 h-6 text-white" /></div>
                </div>
                <div className="bg-emerald-500 text-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm opacity-80">Qualified</p>
                        <h3 className="text-3xl font-bold">{stats.qualified}</h3>
                    </div>
                    <div className="absolute right-2 bottom-2 bg-white/20 p-2 rounded-lg"><CheckCircle className="w-6 h-6 text-white" /></div>
                </div>
                <div className="bg-red-500 text-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm opacity-80">Unqualified</p>
                        <h3 className="text-3xl font-bold">{stats.unqualified}</h3>
                    </div>
                    <div className="absolute right-2 bottom-2 bg-white/20 p-2 rounded-lg"><XCircle className="w-6 h-6 text-white" /></div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
                <div>
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search leads..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                        </div>
                        <select
                            className="py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none"
                            onChange={(e) => setStatusFilter(e.target.value)}
                            value={statusFilter}
                        >
                            <option value="all">All Statuses</option>
                            <option value="NEW">New</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="QUALIFIED">Qualified</option>
                            <option value="UNQUALIFIED">Unqualified</option>
                        </select>
                        <button
                            onClick={handleExport}
                            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export to Excel</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        {/* Desktop Table */}
                        <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Parent Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Student Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Grade</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Contact Info</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Remarks</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                        {filteredLeads.map((lead) => {
                                            let rowClass = "hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group border-l-4";
                                            switch (lead.status) {
                                                case 'CONTACTED':
                                                    rowClass += " bg-amber-50/50 dark:bg-amber-900/10 border-amber-400";
                                                    break;
                                                case 'QUALIFIED':
                                                    rowClass += " bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-400";
                                                    break;
                                                case 'UNQUALIFIED':
                                                    rowClass += " bg-red-50/50 dark:bg-red-900/10 border-red-400";
                                                    break;
                                                case 'NEW':
                                                default:
                                                    rowClass += " bg-sky-50/50 dark:bg-sky-900/10 border-sky-500";
                                                    break;
                                            }

                                            return (
                                                <tr key={lead.id} className={rowClass}>
                                                    <td className="px-6 py-4 align-top">
                                                        <div className="text-sm font-bold text-slate-900 dark:text-white break-words min-w-[120px]">{lead.name}</div>
                                                        <div className="mt-1 flex flex-col gap-0.5">
                                                            <span className={`text-xs font-bold uppercase tracking-wider ${lead.status === 'NEW' ? 'text-sky-600 dark:text-sky-400' :
                                                                lead.status === 'CONTACTED' ? 'text-amber-600 dark:text-amber-400' :
                                                                    lead.status === 'QUALIFIED' ? 'text-emerald-600 dark:text-emerald-400' :
                                                                        lead.status === 'UNQUALIFIED' ? 'text-red-600 dark:text-red-400' :
                                                                            'text-slate-500'
                                                                }`}>
                                                                {lead.status}
                                                            </span>
                                                            {lead.lastModifiedBy && (
                                                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                                                    By {lead.lastModifiedBy}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 align-top">
                                                        <div className="text-sm text-slate-900 dark:text-white break-words min-w-[120px]">{lead.studentName || '-'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 align-top">
                                                        <div className="text-sm text-slate-900 dark:text-white min-w-[80px]">{lead.grade || 'N/A'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 align-top">
                                                        <div className="text-sm text-slate-600 dark:text-slate-300 flex flex-col break-all min-w-[150px]">
                                                            <span>{lead.email}</span>
                                                            <span className="text-slate-400 text-xs">{lead.phone}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 align-top min-w-[110px]">
                                                        <div className="font-medium text-slate-900 dark:text-white">{new Date(lead.createdAt).toLocaleDateString()}</div>
                                                        <div className="text-xs text-slate-400">{new Date(lead.createdAt).toLocaleTimeString()}</div>
                                                    </td>
                                                    <td className="px-6 py-4 align-top">
                                                        <button
                                                            onClick={() => setRemarksLead(lead)}
                                                            className="inline-flex items-center gap-2 p-2.5 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium bg-indigo-50/50 hover:bg-indigo-100 dark:bg-indigo-900/10 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                                                            title="View Remarks"
                                                        >
                                                            <MessageSquare className="w-5 h-5 flex-shrink-0" />
                                                            {(lead as any)._count?.remarks > 0 ? (
                                                                <span className="font-bold">{(lead as any)._count.remarks}</span>
                                                            ) : (
                                                                <span className="text-xs">Add</span>
                                                            )}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm font-medium align-top whitespace-nowrap">
                                                        <button
                                                            onClick={() => setSelectedLead(lead)}
                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded shadow-sm border border-indigo-200 dark:border-indigo-800 transition-all hover:shadow-md"
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile/Tablet Card View */}
                        <div className="lg:hidden space-y-4">
                            {filteredLeads.map((lead) => {
                                let cardClass = "bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border-l-4 transition-all active:scale-[0.99] relative overflow-hidden";
                                let statusColor = "";
                                let statusLabel = "";

                                switch (lead.status) {
                                    case 'CONTACTED':
                                        cardClass += " border-amber-400";
                                        statusColor = "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400";
                                        statusLabel = "Contacted";
                                        break;
                                    case 'QUALIFIED':
                                        cardClass += " border-emerald-400";
                                        statusColor = "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400";
                                        statusLabel = "Qualified";
                                        break;
                                    case 'UNQUALIFIED':
                                        cardClass += " border-red-400";
                                        statusColor = "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400";
                                        statusLabel = "Unqualified";
                                        break;
                                    case 'NEW':
                                    default:
                                        cardClass += " border-sky-500";
                                        statusColor = "text-sky-600 bg-sky-50 dark:bg-sky-900/20 dark:text-sky-400";
                                        statusLabel = "New";
                                        break;
                                }

                                return (
                                    <div key={lead.id} className={cardClass}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="pr-2">
                                                {lead.studentName && <h4 className="font-bold text-slate-900 dark:text-white text-lg">{lead.studentName}</h4>}
                                                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{lead.name}</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap ${statusColor}`}>
                                                    {statusLabel}
                                                </span>
                                                {lead.lastModifiedBy && (
                                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                                                        By: {lead.lastModifiedBy}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-4 space-y-2">
                                            <a href={`mailto:${lead.email}`} className="flex items-center text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-700 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-700 p-3 rounded-lg transition-all group shadow-sm">
                                                <div className="bg-white dark:bg-slate-800 p-1.5 rounded-md mr-3 text-slate-400 group-hover:text-indigo-500 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                <span className="truncate font-medium">{lead.email}</span>
                                            </a>
                                            <a href={`tel:${lead.phone}`} className="flex items-center text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-700 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-700 p-3 rounded-lg transition-all group shadow-sm">
                                                <div className="bg-white dark:bg-slate-800 p-1.5 rounded-md mr-3 text-slate-400 group-hover:text-indigo-500 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                                                    <Phone className="w-4 h-4" />
                                                </div>
                                                <span className="truncate font-medium">{lead.phone}</span>
                                            </a>

                                            {/* Latest Remark Preview */}
                                            {(lead as any).remarks?.[0] && (
                                                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-700/50 text-sm">
                                                    <div className="flex items-center gap-2 mb-1 justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <MessageSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                                            <span className="font-bold text-amber-800 dark:text-amber-200 text-xs">Latest Remark</span>
                                                        </div>
                                                        <span className="text-[10px] text-amber-700 dark:text-amber-300 opacity-75">
                                                            {(lead as any).remarks[0].admin?.name ? `by ${(lead as any).remarks[0].admin.name}` : ''}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-800 dark:text-slate-200 line-clamp-2 italic">"{(lead as any).remarks[0].remark}"</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 mt-auto">
                                            <button
                                                onClick={() => setSelectedLead(lead)}
                                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                            >
                                                View Details
                                            </button>

                                            <button
                                                onClick={() => setRemarksLead(lead)}
                                                className="bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 p-2.5 rounded-lg transition-all border border-slate-200 dark:border-slate-600 flex items-center gap-2"
                                                title="View Remarks"
                                            >
                                                <MessageSquare className="w-5 h-5" />
                                                {(lead as any)._count?.remarks > 0 && (
                                                    <span className="text-xs font-bold">{(lead as any)._count.remarks}</span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lead Details Modal */}
            {selectedLead && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:justify-between md:items-center bg-slate-50 dark:bg-slate-700/50 flex-shrink-0 gap-4">

                            {/* Title & Mobile Close Row */}
                            <div className="flex justify-between items-center w-full md:w-auto">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate mr-2">Lead Details</h3>

                                {/* Mobile Close Button (Top Right) */}
                                <button
                                    onClick={() => setSelectedLead(null)}
                                    className="md:hidden p-3 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors"
                                    title="Close"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Actions Row */}
                            <div className="flex items-center justify-between md:justify-end space-x-2 w-full md:w-auto">
                                <select
                                    className="flex-grow md:flex-grow-0 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                    value={selectedLead.status}
                                    onChange={(e) => {
                                        handleStatusChange(selectedLead.id, e.target.value);
                                        setSelectedLead({ ...selectedLead, status: e.target.value });
                                    }}
                                >
                                    <option value="NEW">New</option>
                                    <option value="CONTACTED">Contacted</option>
                                    <option value="QUALIFIED">Qualified</option>
                                    <option value="UNQUALIFIED">Unqualified</option>
                                </select>

                                <div className="flex items-center gap-3 pl-2">
                                    <button
                                        onClick={() => handleCopy(selectedLead)}
                                        className="p-3 text-slate-500 hover:text-indigo-600 bg-white hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm transition-all active:scale-95"
                                        title="Copy details"
                                    >
                                        <Copy className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedLead.id)}
                                        className="p-3 text-red-600 bg-white hover:bg-red-50 dark:bg-slate-700 dark:hover:bg-red-900/20 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm transition-all active:scale-95 ml-2"
                                        title="Delete Lead"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>

                                    {/* Desktop Close Button (Hidden on Mobile) */}
                                    <div className="hidden md:block h-8 w-px bg-slate-300 dark:bg-slate-600 mx-2"></div>
                                    <button
                                        onClick={() => setSelectedLead(null)}
                                        className="hidden md:block p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                        title="Close"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[80vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Full Name (Parent)</label>
                                    <div className="text-base font-medium text-slate-900 dark:text-white">{selectedLead.name}</div>
                                </div>
                                {/* ... (Rest of content) */}
                                <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Student Name</label>
                                    <div className="text-base font-medium text-slate-900 dark:text-white">{selectedLead.studentName || 'Not Provided'}</div>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Email</label>
                                    <div className="text-base font-medium text-slate-900 dark:text-white break-all">{selectedLead.email}</div>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Phone</label>
                                    <div className="text-base font-medium text-slate-900 dark:text-white">{selectedLead.phone}</div>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Inquiry Type</label>
                                    <div className="text-base font-medium text-slate-900 dark:text-white">{selectedLead.inquiryType || 'General'}</div>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Grade Interest</label>
                                    <div className="text-base font-medium text-slate-900 dark:text-white">{selectedLead.grade || 'N/A'}</div>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Source</label>
                                    <div className="text-base font-medium text-slate-900 dark:text-white capitalize">{selectedLead.source?.replace('_', ' ') || 'Unknown'}</div>
                                </div>
                            </div>

                            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Message / Description</label>
                                <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{selectedLead.message}</div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Remarks Modal */}
            {remarksLead && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Remarks for {remarksLead.name}</h3>
                            <button onClick={() => setRemarksLead(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 flex flex-col h-[60vh]">
                            {/* List */}
                            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                                {remarks.length === 0 ? (
                                    <p className="text-center text-slate-500 italic mt-10">No remarks yet.</p>
                                ) : (
                                    remarks.map((r: any) => (
                                        <div key={r.id} className="bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{r.admin?.name || 'Admin'}</span>
                                                    <span className="text-[10px] text-slate-400">{new Date(r.createdAt).toLocaleString()}</span>
                                                </div>
                                                {(currentUser?.role === 'SUPER_ADMIN' || currentUser?.id === r.adminId) && (
                                                    <button
                                                        onClick={() => deleteRemarkMutation.mutate(r.id)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                        title="Delete Remark"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap text-left">{r.remark}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                            {/* Input */}
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.target as HTMLFormElement;
                                const input = form.elements.namedItem('remark') as HTMLInputElement;
                                if (input.value.trim()) {
                                    addRemarkMutation.mutate({ id: remarksLead.id, remark: input.value });
                                    input.value = '';
                                }
                            }} className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
                                <div className="flex gap-2">
                                    <input
                                        name="remark"
                                        placeholder="Add a remark..."
                                        className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 p-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                        autoComplete="off"
                                    />
                                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                        Send
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default LeadsTab;
