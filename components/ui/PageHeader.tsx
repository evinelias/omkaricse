import React from 'react';
import { HERO_BACKGROUND_IMAGES } from '../../constants';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  imageUrl?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, imageUrl }) => {
  const finalImageUrl = imageUrl || HERO_BACKGROUND_IMAGES[Math.floor(Math.random() * HERO_BACKGROUND_IMAGES.length)];
  return (
    <div className="relative">
      <div
        className="relative h-64 md:h-80 flex items-center justify-center text-white overflow-hidden"
      >
        <div className="absolute inset-0">
            <img src={finalImageUrl} alt={title} className="w-full h-full object-cover bg-zoom" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/40 to-slate-900/20 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/40"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight animate-fade-in-down" style={{animationDelay: '0.2s'}}>{title}</h1>
          <p className="mt-2 md:mt-4 text-lg md:text-xl text-amber-300 animate-fade-in-down" style={{animationDelay: '0.4s'}}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;