import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api';
import toast from 'react-hot-toast';
import { Mail, Settings, BarChart2, CheckCircle, XCircle, Trash2, Plus } from 'lucide-react';
import { EmailSettings, EmailStats, EmailLog } from '../../../types';

const EmailTab: React.FC = () => {
    const queryClient = useQueryClient();
    const [recipientInput, setRecipientInput] = useState('');
    const [recipients, setRecipients] = useState<string[]>([]);

    const { data: settingsData } = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const response = await api.get('/settings');
            return response.data;
        },

    });

    const { data: emailData } = useQuery({
        queryKey: ['emailStats'],
        queryFn: async () => {
            const response = await api.get('/settings/email-stats');
            return response.data;
        },

    });

    // Initialize state from fetched data & Force Enable
    useEffect(() => {
        if (settingsData) {
            if (settingsData.receiverEmails) {
                setRecipients(settingsData.receiverEmails);
            } else if (settingsData.receiverEmail) {
                setRecipients([settingsData.receiverEmail]);
            }

            // "Always On" enforcement: if fetched data says disabled, enable it silently
            if (settingsData.isEnabled === false) {
                updateSettingsMutation.mutate({ isEnabled: true });
            }
        }
    }, [settingsData]);


    const emailStats: EmailStats | null = emailData?.stats || null;
    const emailLogs: EmailLog[] = emailData?.logs || [];

    const updateSettingsMutation = useMutation({
        mutationFn: async (newSettings: Partial<EmailSettings>) => {
            await api.put('/settings', newSettings);
            return newSettings;
        },
        onMutate: async (newSettings) => {
            await queryClient.cancelQueries({ queryKey: ['settings'] });
            const previousSettings = queryClient.getQueryData<EmailSettings>(['settings']);
            if (previousSettings) {
                queryClient.setQueryData<EmailSettings>(['settings'], {
                    ...previousSettings,
                    ...newSettings
                });
            }
            return { previousSettings };
        },
        onError: (err, newSettings, context) => {
            queryClient.setQueryData(['settings'], context?.previousSettings);
            toast.error("Failed to update settings");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['settings'] });
        },
        onSuccess: (data) => {
            // Only toast if it was a user action (recipient change), not the auto-enable
            if (data.receiverEmails) {
                toast.success("Recipients updated");
            }
        }
    });

    const handleAddRecipient = (e: React.FormEvent) => {
        e.preventDefault();
        if (recipientInput && !recipients.includes(recipientInput)) {
            const newRecipients = [...recipients, recipientInput];
            setRecipients(newRecipients);
            updateSettingsMutation.mutate({ receiverEmails: newRecipients });
            setRecipientInput('');
        } else if (recipients.includes(recipientInput)) {
            toast.error("Recipient already exists");
        }
    };

    const handleRemoveRecipient = (emailToRemove: string) => {
        const newRecipients = recipients.filter(email => email !== emailToRemove);
        setRecipients(newRecipients);
        updateSettingsMutation.mutate({ receiverEmails: newRecipients });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Email Configuration */}
            <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-indigo-500" />
                    Admin Recipients
                </h2>

                <div className="space-y-6">
                    {/* Add Recipient Form */}
                    <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-xl p-5">
                        <label className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-3 block">
                            Add New Recipient
                        </label>
                        <form onSubmit={handleAddRecipient} className="flex gap-2">
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={recipientInput}
                                onChange={(e) => setRecipientInput(e.target.value)}
                                className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 p-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors flex-shrink-0"
                                title="Add"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </form>
                    </div>

                    {/* Recipient List */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Recipients</span>
                            <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-0.5 rounded-full font-bold">
                                {recipients.length}
                            </span>
                        </div>

                        {recipients.length === 0 ? (
                            <p className="text-sm text-slate-400 italic text-center py-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                                No recipients added.
                            </p>
                        ) : (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                {recipients.map((email) => (
                                    <div key={email} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 rounded-lg group">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm text-slate-700 dark:text-slate-200 font-medium truncate">
                                                {email}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveRecipient(email)}
                                            className="text-slate-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                            title="Remove"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Stats */}
            <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-indigo-500" />
                    Email Performance
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Sent</p>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{emailStats?.total || 0}</div>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <p className="text-sm text-green-600 dark:text-green-400 mb-1">Successful</p>
                        <div className="text-2xl font-bold text-green-700 dark:text-green-300">{emailStats?.success || 0}</div>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                        <p className="text-sm text-red-600 dark:text-red-400 mb-1">Failed</p>
                        <div className="text-2xl font-bold text-red-700 dark:text-red-300">{emailStats?.failed || 0}</div>
                    </div>
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-1">Success Rate</p>
                        <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{emailStats?.successRate || 0}%</div>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                        Automatic Lead Notifications are Active.
                    </p>
                </div>
            </div>

            {/* Bottom Row: Logs */}
            <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-medium text-slate-900 dark:text-white flex items-center gap-2">
                        <Mail className="w-5 h-5 text-indigo-500" />
                        Recent Logs
                    </h2>
                </div>
                <div className="overflow-x-auto max-h-[400px]">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700/50 sticky top-0 bg-opacity-95 backdrop-blur-sm z-10">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Recipient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Time</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {emailLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {log.status === 'SUCCESS' || log.status === 'SENT' ? (
                                            <span className="flex items-center text-green-600 dark:text-green-400 text-xs font-bold uppercase">
                                                <CheckCircle className="w-4 h-4 mr-1.5" /> Sent
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-red-600 dark:text-red-400 text-xs font-bold uppercase" title={log.error}>
                                                <XCircle className="w-4 h-4 mr-1.5" /> Failed
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">{log.recipient ? log.recipient.slice(0, 30) + (log.recipient.length > 30 ? '...' : '') : 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 max-w-xs truncate" title={log.subject}>{log.subject}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                        {new Date(log.sentAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmailTab;
