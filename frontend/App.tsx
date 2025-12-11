import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import FounderTrusteePage from './pages/about/FounderTrusteePage';
import PrincipalPage from './pages/about/PrincipalPage';
import MissionVisionPage from './pages/about/MissionVisionPage';
import FoundationalYearsPage from './pages/academics/FoundationalYearsPage';
import PrimaryPage from './pages/academics/PrimaryPage';
import MiddleSchoolPage from './pages/academics/MiddleSchoolPage';
import SecondaryPage from './pages/academics/SecondaryPage';
import ISCPage from './pages/academics/ISCPage';
import CoCurricularPage from './pages/academics/CoCurricularPage';
import InfrastructurePage from './pages/InfrastructurePage';
import AwardsPage from './pages/AwardsPage';
import AdmissionPage from './pages/AdmissionPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ContactPage from './pages/ContactPage';
import AlumniPage from './pages/AlumniPage';
import NotFoundPage from './pages/NotFoundPage';
import { ThemeProvider } from './contexts/ThemeContext';
import ScrollToTop from './components/ui/ScrollToTop';
import { PopupProvider } from './contexts/PopupContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <PopupProvider>
        <HashRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/about/founder-trustee" element={<FounderTrusteePage />} />
              <Route path="/about/principal" element={<PrincipalPage />} />
              <Route path="/about/mission-vision" element={<MissionVisionPage />} />
              <Route path="/academics/foundational-years" element={<FoundationalYearsPage />} />
              <Route path="/academics/primary" element={<PrimaryPage />} />
              <Route path="/academics/middle-school" element={<MiddleSchoolPage />} />
              <Route path="/academics/secondary" element={<SecondaryPage />} />
              <Route path="/academics/isc" element={<ISCPage />} />
              <Route path="/academics/cocurricular-extracurricular" element={<CoCurricularPage />} />
              <Route path="/infrastructure" element={<InfrastructurePage />} />
              <Route path="/awards" element={<AwardsPage />} />
              <Route path="/admission" element={<AdmissionPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/alumni" element={<AlumniPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </PopupProvider>
    </ThemeProvider>
  );
};

export default App;