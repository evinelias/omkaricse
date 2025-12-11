import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { PopupProvider } from './contexts/PopupContext';
import Layout from './components/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy Load Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const AdmissionPage = lazy(() => import('./pages/AdmissionPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const MissionVisionPage = lazy(() => import('./pages/about/MissionVisionPage'));
const PrincipalPage = lazy(() => import('./pages/about/PrincipalPage'));
const FounderTrusteePage = lazy(() => import('./pages/about/FounderTrusteePage'));
const AwardsPage = lazy(() => import('./pages/AwardsPage'));
const InfrastructurePage = lazy(() => import('./pages/InfrastructurePage'));
const FoundationalYearsPage = lazy(() => import('./pages/academics/FoundationalYearsPage'));
const PrimaryPage = lazy(() => import('./pages/academics/PrimaryPage'));
const SecondaryPage = lazy(() => import('./pages/academics/SecondaryPage'));
const MiddleSchoolPage = lazy(() => import('./pages/academics/MiddleSchoolPage'));
const ISCPage = lazy(() => import('./pages/academics/ISCPage'));
const CoCurricularPage = lazy(() => import('./pages/academics/CoCurricularPage'));
const AlumniPage = lazy(() => import('./pages/AlumniPage'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  // Check for theme preference on mount to prevent flash
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemTheme)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <ThemeProvider>
      <PopupProvider>
        <Router>
          <ScrollToTop />
          <Layout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admission" element={<AdmissionPage />} />
                {/* Keep /admissions as alias if needed, but primary is /admission */}
                <Route path="/admissions" element={<AdmissionPage />} />

                <Route path="/contact" element={<ContactPage />} />
                <Route path="/testimonials" element={<TestimonialsPage />} />
                <Route path="/alumni" element={<AlumniPage />} />

                <Route path="/about/mission-vision" element={<MissionVisionPage />} />
                <Route path="/about/principal" element={<PrincipalPage />} />
                <Route path="/about/founder-trustee" element={<FounderTrusteePage />} />
                <Route path="/awards" element={<AwardsPage />} />
                <Route path="/infrastructure" element={<InfrastructurePage />} />

                <Route path="/academics/foundational-years" element={<FoundationalYearsPage />} />
                <Route path="/academics/primary" element={<PrimaryPage />} />
                <Route path="/academics/middle-school" element={<MiddleSchoolPage />} />
                <Route path="/academics/secondary" element={<SecondaryPage />} />
                <Route path="/academics/isc" element={<ISCPage />} />
                <Route path="/academics/cocurricular-extracurricular" element={<CoCurricularPage />} />

                {/* Legacy path support */}
                <Route path="/academics/foundational" element={<FoundationalYearsPage />} />
                <Route path="/academics/middle" element={<MiddleSchoolPage />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </PopupProvider>
    </ThemeProvider>
  );
};

export default App;