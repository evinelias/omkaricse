import React from 'react';
import { Link } from 'react-router-dom';
import PageSEO from '../components/ui/PageSEO';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] text-center">
      <PageSEO 
        title="404: Page Not Found - OIS | Best School in Dombivli"
        description="The page you are looking for could not be found. Please return to the homepage of Omkar International School, the best school in Dombivli."
      />
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-9xl font-extrabold text-blue-300 dark:text-blue-500/50">404</h1>
        <h2 className="text-4xl font-bold text-slate-800 dark:text-white mt-2">Page Not Found</h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 mt-4 max-w-lg mx-auto">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <Link 
          to="/" 
          className="mt-10 inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;