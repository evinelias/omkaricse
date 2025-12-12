import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import PageSEO from '../../components/ui/PageSEO';
import { LogOut, Table, Settings, Download, Search, Trash2, Copy, Mail, CheckCircle, XCircle, BarChart2, Users, PlusCircle, Phone } from 'lucide-react';
import ThemeSwitcher from '../../components/ui/ThemeSwitcher';
import * as XLSX from 'xlsx';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Lead {
  id: number;
  name: string;
  studentName?: string;
  email: string;
  phone: string;
  source: string;
  inquiryType?: string;
  message: string;
  grade: string;
  city: string;
  status: string;
  createdAt: string;
}

interface EmailSettings {
  receiverEmail: string;
  isEnabled: boolean;
}

interface EmailStats {
  total: number;
  success: number;
  failed: number;
  successRate: number;
}

interface EmailLog {
  id: number;
  recipient: string;
  subject: string;
  status: string;
  error?: string;
  sentAt: string;
}


const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leads' | 'email'>('leads');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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
    // Auto-refresh every 5s for real-time feel
    refetchInterval: 5000,
  });

  // Notification Logic
  const [hasPermission, setHasPermission] = useState(Notification.permission === 'granted');
  const previousLeadCountRef = React.useRef(leads.length);

  useEffect(() => {
    // If it's the first load (0 -> N), don't notify. 
    // Just sync the ref if it's wildly different, or initialize it.
    if (previousLeadCountRef.current === 0 && leads.length > 0) {
      previousLeadCountRef.current = leads.length;
      return;
    }

    if (leads.length > previousLeadCountRef.current) {
      const newCount = leads.length - previousLeadCountRef.current;
      // Trigger Notification
      if (Notification.permission === 'granted') {
        try {
          // Find the newest lead
          const newestLead = leads.reduce((prev: Lead, current: Lead) =>
            (new Date(prev.createdAt) > new Date(current.createdAt)) ? prev : current
            , leads[0]); // Default to first if needed, logic holds for non-empty

          new Notification(`New Lead Received!`, {
            body: `${newestLead?.name} - ${newestLead?.grade || 'General Inquiry'}`,
            icon: '/favicon.ico', // Use favicon or custom icon
            tag: 'new-lead' // Prevents notification spam stacking
          });
          // Also play a subtle sound if desired, for now just notification
        } catch (e) {
          console.error("Notification failed", e);
        }
      }
      previousLeadCountRef.current = leads.length;
    } else if (leads.length < previousLeadCountRef.current) {
      // Handle deletion case (don't notify, just sync)
      previousLeadCountRef.current = leads.length;
    }
  }, [leads]);

  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    setHasPermission(permission === 'granted');
    if (permission === 'granted') {
      toast.success("Notifications enabled!");
      new Notification("OIS Admin", { body: "You will now be notified of new leads." });
    }
  };

  const { data: settings = { receiverEmail: '', isEnabled: true } } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await api.get('/settings');
      return response.data || { receiverEmail: '', isEnabled: true };
    },
  });

  const { data: emailData } = useQuery({
    queryKey: ['emailStats'],
    queryFn: async () => {
      const response = await api.get('/settings/email-stats');
      return response.data;
    },
  });

  const emailStats = emailData?.stats || null;
  const emailLogs = emailData?.logs || [];

  // Filter Leads
  const filteredLeads = React.useMemo(() => {
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

  // Derived Stats
  const stats = React.useMemo(() => ({
    total: leads.length,
    new: leads.filter((l: Lead) => l.status === 'NEW').length,
    contacted: leads.filter((l: Lead) => l.status === 'CONTACTED').length,
    qualified: leads.filter((l: Lead) => l.status === 'QUALIFIED').length,
    unqualified: leads.filter((l: Lead) => l.status === 'UNQUALIFIED').length,
  }), [leads]);

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

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: EmailSettings) => {
      await api.put('/settings', newSettings);
      return newSettings;
    },
    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey: ['settings'] });
      const previousSettings = queryClient.getQueryData<EmailSettings>(['settings']);
      queryClient.setQueryData<EmailSettings>(['settings'], newSettings);
      return { previousSettings };
    },
    onError: (err, newSettings, context) => {
      queryClient.setQueryData(['settings'], context?.previousSettings);
      toast.error("Failed to update settings");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onSuccess: () => {
      toast.success("Settings saved!");
    }
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



  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(leads);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    XLSX.writeFile(wb, 'OIS_Leads.xlsx');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/settings', settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <PageSEO title="Admin Dashboard | OIS" description="Manage leads and settings." />
      <Toaster position="top-right" />

      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-800 shadow-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-amber-600 dark:text-amber-500">OIS Admin</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Notification prompt banner if needed, or just a small icon */}
      {!hasPermission && Notification.permission !== 'denied' && (
        <div className="bg-amber-100 dark:bg-amber-900/30 px-4 py-2 text-center text-sm text-amber-800 dark:text-amber-200">
          <span className="mr-2">Enable desktop notifications to get instant lead alerts.</span>
          <button onClick={requestNotificationPermission} className="underline font-bold hover:text-amber-900 dark:hover:text-amber-100">
            Enable Now
          </button>
        </div>
      )}

      {/* Reduced py-6 to py-2 here */}
      <div className="max-w-7xl mx-auto pt-0 pb-6 px-0 sm:px-6 lg:px-8">

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-0">
          <button
            onClick={() => setActiveTab('leads')}
            className={`py-2 px-4 flex items-center space-x-2 border-b-2 font-medium transition-colors ${activeTab === 'leads'
              ? 'border-amber-500 text-amber-600 dark:text-amber-500'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
          >
            <Table className="w-5 h-5" />
            <span>Leads</span>
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`py-2 px-4 flex items-center space-x-2 border-b-2 font-medium transition-colors ${activeTab === 'email'
              ? 'border-amber-500 text-amber-600 dark:text-amber-500'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
          >
            <Mail className="w-5 h-5" />
            <span>Email</span>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'leads' ? (
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


                    <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                      {/* Desktop Table: Hidden on mobile/tablet, visible on large screens+ */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                          <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Student Name</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Parent Name</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Grade</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Contact Info</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Message</th>
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
                                    <div className="text-sm font-bold text-slate-900 dark:text-white break-words min-w-[120px]">{lead.studentName || '-'}</div>
                                  </td>
                                  <td className="px-6 py-4 align-top">
                                    <div className="text-sm text-slate-900 dark:text-white break-words min-w-[120px]">{lead.name}</div>
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
                                  <td className="px-6 py-4 align-top min-w-[200px]">
                                    {lead.message ? (
                                      <div className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 hover:line-clamp-none transition-all cursor-pointer break-words" title={lead.message}>
                                        {lead.message}
                                      </div>
                                    ) : (
                                      <span className="text-xs text-slate-400 italic">No message</span>
                                    )}
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

                    {/* Mobile/Tablet Card View: Visible on screens < lg */}
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
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap ${statusColor}`}>
                                {statusLabel}
                              </span>
                            </div>

                            <div className="mb-4 space-y-2">
                              <a href={`mailto:${lead.email}`} className="flex items-center text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-700 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-700 p-3 rounded-lg transition-all group shadow-sm">
                                <div className="bg-white dark:bg-slate-800 p-1.5 rounded-md mr-3 text-slate-400 group-hover:text-indigo-500 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <span className="truncate font-medium">{lead.email}</span>
                              </a>
                              <a href={`tel:${lead.phone}`} className="flex items-center text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-700 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-700 p-3 rounded-lg transition-all group shadow-sm">
                                <div className="bg-white dark:bg-slate-800 p-1.5 rounded-md mr-3 text-slate-400 group-hover:text-indigo-500 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                </div>
                                <span className="break-all font-medium">{lead.phone}</span>
                              </a>
                            </div>

                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 mb-4 bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                              <div className="flex-1">
                                <span className="block text-xs text-slate-400 uppercase font-bold mb-0.5">Grade</span>
                                <span className="font-semibold block truncate">{lead.grade || 'N/A'}</span>
                              </div>
                              <div className="w-px h-8 bg-slate-200 dark:bg-slate-600 mx-3"></div>
                              <div className="flex-1 text-right">
                                <span className="block text-xs text-slate-400 uppercase font-bold mb-0.5">Date</span>
                                <span className="font-semibold block truncate">{new Date(lead.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                              <button
                                onClick={() => setSelectedLead(lead)}
                                className="w-full flex items-center justify-center py-3 px-4 text-indigo-600 hover:text-white hover:bg-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-300 dark:hover:text-white dark:hover:bg-indigo-600 border border-indigo-200 dark:border-indigo-800 rounded-lg transition-all font-semibold text-sm shadow-sm"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {filteredLeads.length === 0 && (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                          No leads found matching your criteria.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8">

              {/* Email Stats Cards */}
              {emailStats && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white px-4 sm:px-0">Email Statistics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 px-4 sm:px-0">
                    <div className="bg-blue-600 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="text-sm opacity-80 mb-1">Total Emails</div>
                        <div className="text-3xl font-bold">{emailStats.total}</div>
                        <div className="text-xs mt-2 opacity-70">↗ Real-time data</div>
                      </div>
                      <div className="absolute right-4 bottom-4 bg-white/20 p-2 rounded-lg">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="bg-emerald-500 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="text-sm opacity-80 mb-1">Successful</div>
                        <div className="text-3xl font-bold">{emailStats.success}</div>
                        <div className="text-xs mt-2 opacity-70">✓ Delivery rate</div>
                      </div>
                      <div className="absolute right-4 bottom-4 bg-white/20 p-2 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="bg-red-500 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="text-sm opacity-80 mb-1">Failed</div>
                        <div className="text-3xl font-bold">{emailStats.failed}</div>
                        <div className="text-xs mt-2 opacity-70">✕ Delivery failures</div>
                      </div>
                      <div className="absolute right-4 bottom-4 bg-white/20 p-2 rounded-lg">
                        <XCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="bg-violet-600 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="text-sm opacity-80 mb-1">Success Rate</div>
                        <div className="text-3xl font-bold">{emailStats.successRate}%</div>
                        <div className="text-xs mt-2 opacity-70">↗ Performance metric</div>
                      </div>
                      <div className="absolute right-4 bottom-4 bg-white/20 p-2 rounded-lg">
                        <BarChart2 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-transparent dark:bg-transparent sm:bg-white sm:dark:bg-slate-800 rounded-none sm:rounded-xl shadow-none sm:shadow-sm p-0 sm:p-6 border-none sm:border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 px-4 sm:px-0">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Admin Recipients</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage who receives new lead notifications.</p>
                  </div>
                  <button
                    onClick={async () => {
                      const recipients = settings.receiverEmail.split(',').filter(e => e.trim());
                      if (recipients.length === 0) {
                        toast.error("Please add at least one recipient first.");
                        return;
                      }

                      const toastId = toast.loading(`Sending test email to ${recipients.length} recipient(s)...`);
                      try {
                        await api.post('/settings/test-email');
                        toast.success("Test email sent successfully! Please check your inbox.", { id: toastId });
                      } catch (err) {
                        console.error('Test email error:', err);
                        toast.error("Failed to send test email. Please check server logs.", { id: toastId });
                      }
                    }}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Test Email</span>
                  </button>
                </div>

                {/* Add New Recipient */}
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-none sm:rounded-xl border-y sm:border border-indigo-100 dark:border-indigo-800 mb-8">
                  <h4 className="flex items-center text-sm font-bold text-indigo-700 dark:text-indigo-300 mb-4">
                    <span className="mr-2 text-lg">+</span> Add New Recipient
                  </h4>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const input = form.elements.namedItem('newEmail') as HTMLInputElement;
                      const email = input.value.trim();
                      if (email) {
                        const currentEmails = settings.receiverEmail.split(',').map(e => e.trim()).filter(e => e);
                        if (!currentEmails.includes(email)) {
                          const newReceiverEmail = [...currentEmails, email].join(',');
                          updateSettingsMutation.mutate({ ...settings, receiverEmail: newReceiverEmail });
                          input.value = '';
                        } else {
                          toast.error("Email already exists in list.");
                        }
                      }
                    }}
                    className="space-y-3"
                  >
                    <input
                      name="newEmail"
                      type="email"
                      placeholder="Enter email address"
                      required
                      className="w-full border border-indigo-200 dark:border-indigo-700 rounded-lg py-3 px-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
                    />
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors shadow-sm"
                    >
                      Add Recipient
                    </button>
                  </form>
                </div>

                {/* Current Recipients List */}
                <div>
                  <h4 className="flex items-center text-sm font-semibold text-slate-600 dark:text-slate-400 mb-4 px-4 sm:px-0">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Current Recipients ({settings.receiverEmail.split(',').filter(e => e.trim()).length})
                  </h4>
                  <div className="space-y-3">
                    {settings.receiverEmail.split(',').map(e => e.trim()).filter(e => e).map((email, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-none sm:rounded-xl border-b sm:border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                            {email.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900 dark:text-white">{email.split('@')[0]}</span>
                            <span className="text-xs text-slate-500">@{email.split('@')[1]}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const newEmails = settings.receiverEmail.split(',').map(e => e.trim()).filter(e => e !== email).join(',');
                            updateSettingsMutation.mutate({ ...settings, receiverEmail: newEmails });
                          }}
                          className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 bg-red-50/50 dark:bg-transparent border border-red-100 dark:border-red-900/30 rounded-lg transition-colors opacity-80 hover:opacity-100"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {settings.receiverEmail.split(',').filter(e => e.trim()).length === 0 && (
                      <div className="text-center py-8 text-slate-400 italic bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
                        No recipients configured. Add one above.
                      </div>
                    )}
                  </div>
                </div>


              </div>

              {/* Email Logs (Moved here) */}
              {emailLogs.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-none sm:rounded-xl shadow-none sm:shadow-sm border-y sm:border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex justify-between items-center">
                    <h3 className="text-md font-medium text-slate-900 dark:text-white">Email Logs</h3>
                    <span className="text-xs text-slate-500">Recent activity</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {emailLogs.map((log) => (
                      <div key={log.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors gap-2 sm:gap-0">
                        <div className="flex items-center space-x-3 w-full sm:w-auto overflow-hidden">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${log.status === 'SUCCESS' ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{log.subject}</div>
                            <div className="text-xs text-slate-500 truncate">To: {log.recipient} • {new Date(log.sentAt).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="pl-5 sm:pl-0">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${log.status === 'SUCCESS'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                            {log.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
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
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
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
                    {/* ... (Rest of content is same, just need to close portal) */}
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
