import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import { Trophy } from 'lucide-react';
import PageSEO from '../components/ui/PageSEO';
import AnimateOnScroll from '../components/ui/AnimateOnScroll';

const AchievementItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-6 rounded-xl shadow-lg flex items-start transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="flex-shrink-0 text-amber-500 mr-4 mt-1">
            <Trophy className="w-8 h-8" />
        </div>
        <p className="text-slate-700 dark:text-slate-300 text-lg">{children}</p>
    </div>
);

const achievements = [
    "MAST. RUDRA PATIL (Grade 7) - GOLD MEDAL in CISCE Rifle Shooting, selected for Nationals.",
    "MAST. SHAURYA V.S (Grade 7) - BRONZE MEDAL in National Karate Competition.",
    "MAST. AARAV CHAUDHARY (Grade 8) - Selected for AISM National Swimming Competition 2023.",
    "MAST. ANVEET NENE - 3RD PLACE in CISCE Badminton, selected for National Competition.",
    "MS. NIDHI KULKARNI (Grade 8) - FIRST PLACE in CISCE National Carrom (2nd consecutive time).",
    "MS. SACHI KULKARNI (Grade 8) - Competed in Maharashtra State U-12 Chess Championship.",
    "MS. SAINIHITHA (Grade 7) - Represented Maharashtra in National School Chess Tournament.",
    "MS. TANISHKA DALVI - Represented in International Ice Skating Competition in Chandigarh.",
    "OMKAR INTERNATIONAL SCHOOL - 3RD PLACE in CISCE Yoga Competition.",
];

const AwardsPage: React.FC = () => {
    return (
        <div>
            <PageSEO
                title="Awards & Achievements - OIS | Best School in Dombivli"
                description="Celebrate the numerous awards and achievements of our students at Omkar International School, a testament to our status as the best school in Dombivli."
            />
            <PageHeader
                title="Awards & Achievements"
                subtitle="Celebrating the Hard Work and Vision of Our Proud Omkarians"
                imageUrl="/images/award-1.jpg"
            />
            <div className="py-20 lg:py-28">
                <div className="container mx-auto px-6">
                    <AnimateOnScroll className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white">All Over the Top</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-3xl mx-auto">
                            Omkar International School stands proudly as a beacon of educational excellence. Our relentless pursuit of excellence has earned us recognition as a distinguished institution, consistently ranked among the best in Dombivli.
                        </p>
                    </AnimateOnScroll>

                    <div className="max-w-4xl mx-auto">
                        <AnimateOnScroll>
                            <h3 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-8 text-center">Our Student Champions</h3>
                        </AnimateOnScroll>
                        <div className="space-y-6">
                            {achievements.map((item, index) => (
                                <AnimateOnScroll key={index} delay={index * 100}>
                                    <AchievementItem>{item}</AchievementItem>
                                </AnimateOnScroll>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AwardsPage;