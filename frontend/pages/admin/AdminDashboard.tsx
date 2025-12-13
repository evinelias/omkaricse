import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import PageSEO from '../../components/ui/PageSEO';
import { LogOut, Table, Mail, Users, Activity } from 'lucide-react';
import ThemeSwitcher from '../../components/ui/ThemeSwitcher';
import toast, { Toaster } from 'react-hot-toast';
import LeadsTab from '../../components/admin/tabs/LeadsTab';
import EmailTab from '../../components/admin/tabs/EmailTab';
import UsersTab from '../../components/admin/tabs/UsersTab';
import ActivityTab from '../../components/admin/tabs/ActivityTab';
import { User } from '../../types';

const AdminDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as 'leads' | 'email' | 'users' | 'activity') || 'leads';

  const setActiveTab = (tab: 'leads' | 'email' | 'users' | 'activity') => {
    setSearchParams({ tab });
  };

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser({
          id: payload.id,
          email: payload.email,
          name: payload.name || 'Admin',
          role: payload.role || 'USER',
          permissions: payload.permissions || [],
          isFrozen: false,
          createdAt: ''
        });
      } catch (e) {
        // Invalid token
      }
    }
  }, []);

  // SSE Real-time Updates
  const queryClient = useQueryClient();
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    console.log('🔌 Connecting to SSE...', `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/events`);
    const eventSource = new EventSource(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/events?token=${token}`);

    eventSource.onopen = () => {
      console.log('✅ SSE Connected Successfully');
      setSseStatus('CONNECTED');
    };

    eventSource.onerror = (err) => {
      console.error('❌ SSE Connection Error:', err);
      setSseStatus('DISCONNECTED');
    };

    eventSource.onmessage = (e) => {
      // Ping/Keep-alive messages might land here if not named
      console.log('📩 SSE Raw Message:', e.data);
    };

    eventSource.addEventListener('new_lead', async (e: MessageEvent) => {
      console.log('🚀 SSE Event: new_lead', e.data);
      const data = JSON.parse(e.data);
      if (Notification.permission === 'granted') {
        try {
          const registration = await navigator.serviceWorker.ready;
          registration.showNotification('New Lead Received! 🚀', {
            body: `From: ${data.name}`,
            icon: '/favicon.ico',
            data: { url: `${window.location.origin}/admin/dashboard?tab=leads` }
          });
        } catch (err) {
          console.error('PWA Notification Error:', err);
          new Notification('New Lead Received! 🚀', {
            body: `From: ${data.name}`,
            icon: '/favicon.ico'
          });
        }
      }
      toast.success('New Lead Received! 🚀');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    });

    eventSource.addEventListener('new_activity', async (e: MessageEvent) => {
      console.log('🛡️ SSE Event: new_activity', e.data);
      const data = JSON.parse(e.data);
      console.log('⚡ SSE Activity Received:', data);

      // Fix: Don't notify if I am the one who did the action
      const myEmail = localStorage.getItem('adminToken') ? JSON.parse(atob(localStorage.getItem('adminToken')!.split('.')[1])).email : '';

      if (data.admin?.email !== myEmail) {
        if (Notification.permission === 'granted') {
          try {
            const registration = await navigator.serviceWorker.ready;
            registration.showNotification('New Activity Logged 🛡️', {
              body: `${data.admin?.name || 'Admin'}: ${data.action}`,
              icon: '/favicon.ico',
              data: { url: `${window.location.origin}/admin/dashboard?tab=activity` }
            });
          } catch (err) {
            console.error('PWA Notification Error:', err);
            new Notification('New Activity Logged 🛡️', {
              body: `${data.admin?.name || 'Admin'}: ${data.action}`,
              icon: '/favicon.ico'
            });
          }
        }
      }
      queryClient.invalidateQueries({ queryKey: ['activity'] });
    });

    eventSource.addEventListener('user_update', () => {
      console.log('🔄 SSE Event: user_update');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Admin List Updated 🔄');
    });

    eventSource.addEventListener('settings_update', () => {
      console.log('⚙️ SSE Event: settings_update');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    });

    return () => {
      console.log('🔌 Closing SSE Connection');
      eventSource.close();
    };
  }, [queryClient]);

  /* Swipe Navigation Logic */
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      const tabs: ('leads' | 'email' | 'users' | 'activity')[] = ['leads'];
      if (currentUser?.role === 'SUPER_ADMIN' || currentUser?.permissions?.includes('EMAIL')) tabs.push('email');
      if (currentUser?.role === 'SUPER_ADMIN' || currentUser?.permissions?.includes('USERS')) tabs.push('users');
      if (currentUser?.role === 'SUPER_ADMIN' || currentUser?.permissions?.includes('ACTIVITY')) tabs.push('activity');

      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;
      if (isLeftSwipe) {
        // Swipe Left -> Next Tab
        nextIndex = Math.min(currentIndex + 1, tabs.length - 1);
      }
      if (isRightSwipe) {
        // Swipe Right -> Prev Tab
        nextIndex = Math.max(currentIndex - 1, 0);
      }

      if (nextIndex !== currentIndex) setActiveTab(tabs[nextIndex]);
    }
  };

  /* Notification Logic */
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    Notification.permission
  );
  const [sseStatus, setSseStatus] = useState<'CONNECTING' | 'CONNECTED' | 'DISCONNECTED'>('CONNECTING');

  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
      toast.success('Notifications enabled!');
      try {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification('OIS Admin', { body: 'Notifications are now active.' });
      } catch (e) {
        new Notification('OIS Admin', { body: 'Notifications are now active.' });
      }
    }
  };

  const testNotification = async () => {
    if (Notification.permission === 'granted') {
      try {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification('Test Notification 🔔', { body: 'System is working via Service Worker!' });
        toast.success('Test Notification Sent');
      } catch (e) {
        new Notification('Test Notification 🔔', { body: 'System is working via Standard API!' });
        toast.success('Test Notification Sent (Standard)');
      }
    } else {
      toast.error('Permission not granted');
      requestNotificationPermission();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
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
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 mr-2">
                <div className={`w-2.5 h-2.5 rounded-full ${sseStatus === 'CONNECTED' ? 'bg-green-500' : 'bg-red-500'} ${sseStatus === 'CONNECTED' ? '' : 'animate-pulse'}`} title={`System Status: ${sseStatus}`} />
                <span className="text-[10px] uppercase font-bold text-slate-400 hidden sm:inline-block">{sseStatus}</span>
                <button onClick={testNotification} className="text-[10px] border border-slate-200 dark:border-slate-700 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  🔔 Test
                </button>
              </div>
              {currentUser && (
                <div className="flex flex-col items-end mr-1">
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:inline-block leading-tight">
                    {currentUser.role}
                  </span>
                </div>
              )}
              <ThemeSwitcher />
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className="max-w-7xl mx-auto pt-0 pb-6 px-0 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)]" // Enforce min-height to make swipe area easier to hit if content is short
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >

        {/* Notification Banner */}
        {notificationPermission === 'default' && (
          <div className="mb-4 mt-6 mx-4 sm:mx-0 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-indigo-100 dark:bg-indigo-800/50 rounded-lg text-indigo-600 dark:text-indigo-300">
                <Mail className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Enable Real-Time Alerts</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Get notified instantly when new leads arrive.</p>
              </div>
            </div>
            <button
              onClick={requestNotificationPermission}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm whitespace-nowrap ml-4"
            >
              Enable
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('leads')}
            className={`py-2 px-4 flex items-center space-x-2 border-b-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'leads'
              ? 'border-amber-500 text-amber-600 dark:text-amber-500'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
          >
            <Table className="w-5 h-5" />
            <span>Leads</span>
          </button>

          {(currentUser?.role === 'SUPER_ADMIN' || currentUser?.permissions?.includes('EMAIL')) && (
            <button
              onClick={() => setActiveTab('email')}
              className={`py-2 px-4 flex items-center space-x-2 border-b-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'email'
                ? 'border-amber-500 text-amber-600 dark:text-amber-500'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
            >
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </button>
          )}

          {(currentUser?.role === 'SUPER_ADMIN' || currentUser?.permissions?.includes('USERS')) && (
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-4 flex items-center space-x-2 border-b-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'users'
                ? 'border-amber-500 text-amber-600 dark:text-amber-500'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
            >
              <Users className="w-5 h-5" />
              <span>Admins</span>
            </button>
          )}

          {(currentUser?.role === 'SUPER_ADMIN' || currentUser?.permissions?.includes('ACTIVITY')) && (
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-2 px-4 flex items-center space-x-2 border-b-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'activity'
                ? 'border-amber-500 text-amber-600 dark:text-amber-500'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
            >
              <Activity className="w-5 h-5" />
              <span>Activity</span>
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'leads' && <LeadsTab currentUser={currentUser} />}
          {activeTab === 'email' && <EmailTab />}
          {activeTab === 'users' && <UsersTab currentUser={currentUser} />}
          {activeTab === 'activity' && <ActivityTab currentUser={currentUser} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
