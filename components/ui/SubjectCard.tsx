import React from 'react';

type CardColor = 'blue' | 'amber' | 'green' | 'purple';

interface SubjectCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color?: CardColor;
  style?: React.CSSProperties;
}

const colorMap = {
  blue: {
    glow: 'from-blue-500 to-cyan-500',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  amber: {
    glow: 'from-amber-500 to-yellow-500',
    icon: 'text-amber-600 dark:text-amber-400',
  },
  green: {
    glow: 'from-green-500 to-emerald-500',
    icon: 'text-green-600 dark:text-green-400',
  },
  purple: {
    glow: 'from-purple-500 to-violet-500',
    icon: 'text-purple-600 dark:text-purple-400',
  },
};

const SubjectCard: React.FC<SubjectCardProps> = ({ icon: Icon, title, description, color = 'blue', style }) => {
  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <div
      className="group relative h-full rounded-xl p-0.5 transform-style-3d transition-transform duration-500 hover:scale-105"
      style={{ perspective: '1000px', ...style }}
    >
      {/* Glow Effect */}
      <div className={`absolute -inset-2 bg-gradient-to-br ${selectedColor.glow} rounded-xl blur-lg opacity-0 group-hover:opacity-20 dark:group-hover:opacity-40 transition-opacity duration-500`}></div>

      {/* Card Content */}
      <div
        className="relative h-full bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-6 flex flex-col items-center text-center transform transition-transform duration-500 group-hover:[transform:rotateX(5deg)_rotateY(-5deg)]"
      >
        <div className={`mb-4 ${selectedColor.icon}`}>
          <Icon className="w-14 h-14" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 flex-grow">{description}</p>
      </div>
    </div>
  );
};

export default SubjectCard;