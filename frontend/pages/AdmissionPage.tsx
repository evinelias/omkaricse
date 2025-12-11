import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import { CalendarDays, BadgeCheck, MapPin, Users, Camera } from 'lucide-react';
import PageSEO from '../components/ui/PageSEO';
import AnimateOnScroll from '../components/ui/AnimateOnScroll';
import { usePopup } from '../contexts/PopupContext';

const AdmissionStep: React.FC<{ number: number; title: string; isLast?: boolean }> = ({ number, title, isLast = false }) => (
  <div className="relative flex items-start">
    <div className="flex-shrink-0 flex flex-col items-center">
      <div className="bg-blue-600 text-white rounded-full h-12 w-12 flex items-center justify-center font-bold text-xl z-10">
        {number}
      </div>
      {!isLast && <div className="w-0.5 h-16 bg-blue-200 dark:bg-slate-600 mt-2"></div>}
    </div>
    <div className="ml-6 mt-2">
      <h4 className="text-xl font-semibold text-slate-800 dark:text-white">{title}</h4>
    </div>
  </div>
);

const DocumentItem: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => (
  <div className="bg-slate-100/50 dark:bg-slate-700/50 backdrop-blur-sm p-4 rounded-lg flex items-center shadow-sm transition-all duration-300 hover:shadow-md hover:bg-blue-50/50 dark:hover:bg-slate-700/80">
    <div className="flex-shrink-0 text-blue-600 dark:text-blue-400 mr-4">
      {icon}
    </div>
    <p className="text-slate-700 dark:text-slate-300 font-medium text-sm">{title}</p>
  </div>
);

const documents = [
  { title: "Proof of Date of Birth (Birth Certificate or Transfer Certificate)", icon: <CalendarDays className="w-7 h-7" strokeWidth={1.5} /> },
  { title: "Aadhar card of the student", icon: <BadgeCheck className="w-7 h-7" strokeWidth={1.5} /> },
  { title: "Proof of current address", icon: <MapPin className="w-7 h-7" strokeWidth={1.5} /> },
  { title: "Proof of Identity for both parents", icon: <Users className="w-7 h-7" strokeWidth={1.5} /> },
  { title: "2 recent passport-size photographs (student & each parent)", icon: <Camera className="w-7 h-7" strokeWidth={1.5} /> },
]

const AdmissionPage: React.FC = () => {
  const { openPopup } = usePopup();

  return (
    <div>
      <PageSEO
        title="Admission Process - Omkar International School | Best School in Dombivli"
        description="Find all the information you need about the admission process, age criteria, and required documents to join the OIS family, the best school in Dombivli."
      />
      <PageHeader
        title="Admission Process"
        subtitle="Join the OIS Family"
        imageUrl="/images/admission-1.png"
      />
      <div className="container mx-auto px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          <AnimateOnScroll animation="slide-in-from-left">
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-8 lg:p-12 rounded-xl shadow-xl">
              <h3 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-8">Admission Procedure</h3>
              <div className="space-y-0">
                <AdmissionStep number={1} title="Personal Visit & Enquiry" />
                <AdmissionStep number={2} title="Fill Enquiry Form" />
                <AdmissionStep number={3} title="Campus Visit" />
                <AdmissionStep number={4} title="Interactive Session with Student" />
                <AdmissionStep number={5} title="Complete Admission Formalities" />
                <AdmissionStep number={6} title="Submit Documentation" isLast />
              </div>
              <div className="mt-12 text-center">
                <button
                  onClick={openPopup}
                  className="inline-block bg-amber-500 text-slate-900 font-bold py-3 px-10 rounded-full hover:bg-amber-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Start Your Application
                </button>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="slide-in-from-right" delay={200}>
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-8 lg:p-12 rounded-xl shadow-xl space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Important Information</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">1. Period of Admission</h4>
                    <p className="text-slate-600 dark:text-slate-400">Registration forms are available at the school office from June to March each year.</p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">2. Age Criteria</h4>
                    <p className="text-slate-600 dark:text-slate-400"><strong className="font-medium">For 1st Std:</strong> Minimum age of 6 years as of June 1st of the admission year.</p>
                    <p className="text-slate-600 dark:text-slate-400"><strong className="font-medium">Other Classes:</strong> Age limits are calculated based on the criteria for Std I.</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">3. Documents Required</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {documents.map((doc, index) => (
                    <AnimateOnScroll key={index} delay={index * 100} duration={500}>
                      <DocumentItem title={doc.title} icon={doc.icon} />
                    </AnimateOnScroll>
                  ))}
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </div>
  );
};

export default AdmissionPage;