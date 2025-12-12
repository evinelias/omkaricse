import React, { useEffect, useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import PageSEO from '../../components/ui/PageSEO';
import { LogOut, Table, Settings, Download, Search, Trash2, Copy } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'leads' | 'settings'>('leads');
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
            <div className="flex items-center">
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

      {/* Reduced py-6 to py-2 here */}
      <div className="max-w-7xl mx-auto pt-0 pb-6 sm:px-6 lg:px-8">

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-slate-200 dark:border-slate-700">
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
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-4 flex items-center space-x-2 border-b-2 font-medium transition-colors ${activeTab === 'settings'
              ? 'border-amber-500 text-amber-600 dark:text-amber-500'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'leads' ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-sm opacity-80">Total Leads</p>
                    <h3 className="text-3xl font-bold">{stats.total}</h3>
                  </div>
                  <div className="absolute right-2 bottom-2 opacity-20"><Table className="w-8 h-8" /></div>
                </div>
                <div className="bg-sky-500 text-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-sm opacity-80">New Leads</p>
                    <h3 className="text-3xl font-bold">{stats.new}</h3>
                  </div>
                  <div className="absolute right-2 bottom-2 opacity-20 flex font-bold text-3xl">+</div>
                </div>
                <div className="bg-amber-500 text-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-sm opacity-80">Contacted</p>
                    <h3 className="text-3xl font-bold">{stats.contacted}</h3>
                  </div>
                </div>
                <div className="bg-emerald-500 text-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-sm opacity-80">Qualified</p>
                    <h3 className="text-3xl font-bold">{stats.qualified}</h3>
                  </div>
                  <div className="absolute right-2 bottom-2 opacity-20">✓</div>
                </div>
                <div className="bg-red-500 text-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-sm opacity-80">Unqualified</p>
                    <h3 className="text-3xl font-bold">{stats.unqualified}</h3>
                  </div>
                  <div className="absolute right-2 bottom-2 opacity-20">✕</div>
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
                              {/* Removed whitespace-nowrap and added min-w/break-words everywhere */}
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
                                  // Increased padding to px-4 py-2
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
              </div>
            </>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8">

              {/* Email Stats Cards */}
              {emailStats && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">Email Statistics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-600 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="text-sm opacity-80 mb-1">Total Emails</div>
                        <div className="text-3xl font-bold">{emailStats.total}</div>
                        <div className="text-xs mt-2 opacity-70">↗ Real-time data</div>
                      </div>
                      <div className="absolute right-4 bottom-4 opacity-20 bg-white p-2 rounded-lg">
                        <div className="w-6 h-6">✉</div>
                      </div>
                    </div>

                    <div className="bg-emerald-500 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="text-sm opacity-80 mb-1">Successful</div>
                        <div className="text-3xl font-bold">{emailStats.success}</div>
                        <div className="text-xs mt-2 opacity-70">✓ Delivery rate</div>
                      </div>
                      <div className="absolute right-4 bottom-4 opacity-20 bg-white p-2 rounded-lg">
                        <div className="w-6 h-6">✓</div>
                      </div>
                    </div>

                    <div className="bg-red-500 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="text-sm opacity-80 mb-1">Failed</div>
                        <div className="text-3xl font-bold">{emailStats.failed}</div>
                        <div className="text-xs mt-2 opacity-70">✕ Delivery failures</div>
                      </div>
                      <div className="absolute right-4 bottom-4 opacity-20 bg-white p-2 rounded-lg">
                        <div className="w-6 h-6">✕</div>
                      </div>
                    </div>

                    <div className="bg-violet-600 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="text-sm opacity-80 mb-1">Success Rate</div>
                        <div className="text-3xl font-bold">{emailStats.successRate}%</div>
                        <div className="text-xs mt-2 opacity-70">↗ Performance metric</div>
                      </div>
                      <div className="absolute right-4 bottom-4 opacity-20 bg-white p-2 rounded-lg">
                        <div className="w-6 h-6">📊</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Admin Recipients</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage who receives new lead notifications.</p>
                  </div>
                  <button
                    onClick={async () => {
                      if (!settings.isEnabled) {
                        toast.error("Enable notifications first to test.");
                        return;
                      }
                      const toastId = toast.loading("Sending test email...");
                      try {
                        await api.post('/settings/test-email');
                        toast.success("Test email sent!", { id: toastId });
                      } catch (err) {
                        toast.error("Failed to send test email.", { id: toastId });
                      }
                    }}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <span>Send Test Email</span>
                  </button>
                </div>

                {/* Add New Recipient */}
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800 mb-8">
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
                  <h4 className="flex items-center text-sm font-semibold text-slate-600 dark:text-slate-400 mb-4">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Current Recipients ({settings.receiverEmail.split(',').filter(e => e.trim()).length})
                  </h4>
                  <div className="space-y-3">
                    {settings.receiverEmail.split(',').map(e => e.trim()).filter(e => e).map((email, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group">
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

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center">
                  <input
                    id="isEnabled"
                    type="checkbox"
                    checked={settings.isEnabled}
                    onChange={(e) => {
                      const newState = { ...settings, isEnabled: e.target.checked };
                      updateSettingsMutation.mutate(newState);
                    }}
                    className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-slate-300 rounded cursor-pointer"
                  />
                  <label htmlFor="isEnabled" className="ml-3 block text-sm font-medium text-slate-900 dark:text-white cursor-pointer select-none">
                    Enable Email Notifications
                  </label>
                </div>
              </div>

              {/* Email Logs (Moved here) */}
              {emailLogs.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex justify-between items-center">
                    <h3 className="text-md font-medium text-slate-900 dark:text-white">Email Logs</h3>
                    <span className="text-xs text-slate-500">Recent activity</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {emailLogs.map((log) => (
                      <div key={log.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${log.status === 'SUCCESS' ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-xs">{log.subject}</div>
                            <div className="text-xs text-slate-500">To: {log.recipient} • {new Date(log.sentAt).toLocaleString()}</div>
                          </div>
                        </div>
                        <div>
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
          {selectedLead && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Lead Details</h3>
                  <div className="flex items-center space-x-3">
                    <select
                      className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
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
                    <div className="h-6 w-px bg-slate-300 dark:bg-slate-600 mx-2"></div>
                    <button
                      onClick={() => handleCopy(selectedLead)}
                      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20 rounded-lg transition-colors group relative"
                      title="Copy details"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(selectedLead.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group relative"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedLead(null)}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title="Close"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
                <div className="p-6 overflow-y-auto max-h-[80vh]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Full Name (Parent)</label>
                      <div className="text-base font-medium text-slate-900 dark:text-white">{selectedLead.name}</div>
                    </div>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
