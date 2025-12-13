import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api';
import { Activity, Shield } from 'lucide-react';
import { ActivityLogItem, User } from '../../../types';

interface ActivityTabProps {
    currentUser: User | null;
}

const ActivityTab: React.FC<ActivityTabProps> = ({ currentUser }) => {
    const [activityPage, setActivityPage] = useState(1);

    const { data: activityData } = useQuery({
        queryKey: ['activity', activityPage],
        queryFn: async () => {
            const response = await api.get(`/activity?page=${activityPage}&limit=50&_t=${Date.now()}`);
            return response.data as { data: ActivityLogItem[], pagination: any };
        },
        enabled: currentUser?.role === 'SUPER_ADMIN' || currentUser?.permissions?.includes('ACTIVITY'),

    });



    const activityLogs = activityData?.data || [];
    const activityPagination = activityData?.pagination || { totalPages: 1, page: 1 };

    return (
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    System Activity Log
                </h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 hidden md:table">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Admin</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Details</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {activityLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="px-6 py-4 whitespace-nowrap align-top">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{log.admin?.name || 'System'}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{log.admin?.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap align-top">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 align-top whitespace-pre-wrap max-w-sm">
                                    {log.details}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 align-top">
                                    {new Date(log.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Mobile View - Cards */}
                <div className="md:hidden space-y-4 p-4 bg-slate-50 dark:bg-slate-900/50">
                    {activityLogs.map((log) => (
                        <div key={log.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">{log.admin?.name || 'System'}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">{log.admin?.email}</div>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                    {log.action}
                                </span>
                            </div>

                            <div className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg border border-slate-100 dark:border-slate-700 mb-3">
                                {log.details}
                            </div>

                            <div className="text-right text-xs text-slate-400 dark:text-slate-500">
                                {new Date(log.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/30">
                <button
                    disabled={activityPage === 1}
                    onClick={() => setActivityPage(p => p - 1)}
                    className="px-3 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 disabled:opacity-50 text-slate-700 dark:text-slate-300"
                >
                    Previous
                </button>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                    Page {activityPage} of {activityPagination.totalPages}
                </span>
                <button
                    disabled={activityPage === activityPagination.totalPages}
                    onClick={() => setActivityPage(p => p + 1)}
                    className="px-3 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 disabled:opacity-50 text-slate-700 dark:text-slate-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ActivityTab;
