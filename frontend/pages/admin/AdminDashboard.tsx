import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [activeTab, setActiveTab] = useState<'leads' | 'email' | 'users' | 'activity'>('leads');
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
