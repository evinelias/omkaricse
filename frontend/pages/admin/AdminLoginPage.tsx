import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../api';
import { Lock, ArrowLeft } from 'lucide-react';
import PageSEO from '../../components/ui/PageSEO';
import { Link } from 'react-router-dom';

const AdminLoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStage, setLoadingStage] = useState(''); // 'authenticating' | 'prefetching'
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    React.useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            // Optional: verify token validity with backend here if strictly needed,
            // but for speed (as requested), we redirect immediately.
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        setError('');
        setLoadingStage('authenticating');

        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('adminToken', response.data.token);

            setLoadingStage('prefetching');

            // Prefetch dashboard data to save loading time
            // We await these so the data is ready/loading before navigation
            await Promise.all([
                queryClient.prefetchQuery({
                    queryKey: ['leads'],
                    queryFn: async () => {
                        const res = await api.get('/leads');
                        return res.data;
                    },
                    staleTime: 1000 * 60, // Consider valid for 1 min
                }),
                queryClient.prefetchQuery({
                    queryKey: ['settings'],
                    queryFn: async () => {
                        const res = await api.get('/settings');
                        return res.data;
                    },
                    staleTime: 1000 * 60,
                }),
                queryClient.prefetchQuery({
                    queryKey: ['emailStats'],
                    queryFn: async () => {
                        const res = await api.get('/settings/email-stats');
                        return res.data;
                    },
                    staleTime: 1000 * 60,
                })
            ]);

            navigate('/admin/dashboard');
        } catch (err) {
            setError('Invalid credentials');
            setIsLoading(false);
            setLoadingStage('');
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <PageSEO title="Admin Login | OIS" description="Secure Admin Access" />

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-200/20 dark:bg-amber-500/10 rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <Link
                to="/"
                className="absolute top-8 left-8 z-20 flex items-center px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full border border-white/20 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-500 transition-all duration-300 shadow-sm hover:shadow-md"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
            </Link>

            <div className="relative z-10 w-full max-w-md p-4">
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/50 dark:border-slate-700 shadow-2xl rounded-3xl p-8 sm:p-10 transition-all duration-300 hover:shadow-amber-500/10 dark:hover:shadow-amber-900/10">
                    <div className="text-center mb-8">
                        <div className="mx-auto h-16 w-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                            {isLoading ? (
                                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <Lock className="h-8 w-8 text-white" />
                            )}
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                            {isLoading ? 'Accessing Secure Area...' : 'Welcome Back'}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {isLoading && loadingStage === 'prefetching'
                                ? 'Preparing your dashboard...'
                                : isLoading
                                    ? 'Verifying credentials...'
                                    : 'Enter your credentials to access the admin dashboard.'}
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        disabled={isLoading}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        disabled={isLoading}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 flex items-center justify-center space-x-2 animate-pulse">
                                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r transition-all duration-200 ${isLoading
                                ? 'from-slate-400 to-slate-500 cursor-not-allowed'
                                : 'from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 hover:-translate-y-0.5 hover:shadow-amber-500/20'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500`}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {loadingStage === 'prefetching' ? 'Preparing Dashboard...' : 'Authenticating...'}
                                </span>
                            ) : (
                                'Sign In to Dashboard'
                            )}
                        </button>
                    </form>
                </div>
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                        &copy; {new Date().getFullYear()} Omkar International School. all rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );

};

export default AdminLoginPage;
