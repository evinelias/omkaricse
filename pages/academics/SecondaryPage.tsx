import React from 'react';
import PageHeader from '../../components/ui/PageHeader';
import { BookOpen, ScrollText, Globe2, Languages, Calculator, FlaskConical, AreaChart, Store, Home, Dumbbell, Laptop, Palette, Check, Star, Plus } from 'lucide-react';
import PageSEO from '../../components/ui/PageSEO';
import AnimateOnScroll from '../../components/ui/AnimateOnScroll';

const colorClasses: { [key: string]: string } = {
  blue: 'text-blue-500 dark:text-blue-400',
  amber: 'text-amber-500 dark:text-amber-400',
  green: 'text-green-500 dark:text-green-400',
};

const SubjectItem: React.FC<{ name: string; icon: React.ReactNode; color: string }> = ({ name, icon, color }) => (
    <li className="flex items-center text-slate-600 dark:text-slate-400 py-1.5">
        <span className={`${colorClasses[color]} mr-3`}>{icon}</span>
        <span>{name}</span>
    </li>
);

const SubjectGroup: React.FC<{ title: string; rule: string; ruleIcon: React.ElementType; subjects: {name: string, icon: React.ReactNode}[]; color: string }> = ({ title, rule, ruleIcon: RuleIcon, subjects, color }) => {
    
    const borderClasses: { [key: string]: string } = {
        blue: 'bg-blue-600 dark:bg-blue-700',
        amber: 'bg-amber-600 dark:bg-amber-700',
        green: 'bg-green-600 dark:bg-green-700',
    };

    return (
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 rounded-xl shadow-lg flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full">
            <div className={`p-5 ${borderClasses[color]}`}>
                 <h4 className="text-xl font-bold text-white mb-1">{title}</h4>
                 <div className="flex items-center space-x-2 bg-black/20 rounded-full px-3 py-1 text-white text-sm font-semibold max-w-max">
                    <RuleIcon className="w-4 h-4" />
                    <span>{rule}</span>
                 </div>
            </div>
            <div className="p-6 flex-grow">
                <ul className="space-y-3">
                    {subjects.map(subject => (
                        <SubjectItem key={subject.name} name={subject.name} icon={subject.icon} color={color} />
                    ))}
                </ul>
            </div>
        </div>
    );
};

const ICONS = {
    book: <BookOpen className="w-5 h-5" strokeWidth={2} />,
    history: <ScrollText className="w-5 h-5" strokeWidth={2} />,
    globe: <Globe2 className="w-5 h-5" strokeWidth={2} />,
    lang: <Languages className="w-5 h-5" strokeWidth={2} />,
    math: <Calculator className="w-5 h-5" strokeWidth={2} />,
    science: <FlaskConical className="w-5 h-5" strokeWidth={2} />,
    economics: <AreaChart className="w-5 h-5" strokeWidth={2} />,
    commerce: <Store className="w-5 h-5" strokeWidth={2} />,
    home: <Home className="w-5 h-5" strokeWidth={2} />,
    pe: <Dumbbell className="w-5 h-5" strokeWidth={2} />,
    computer: <Laptop className="w-5 h-5" strokeWidth={2} />,
    art: <Palette className="w-5 h-5" strokeWidth={2} />,
};

const subjectsData = {
    group1: [
        { name: "English Language", icon: ICONS.book },
        { name: "Literature in English", icon: ICONS.book },
        { name: "Second Language", icon: ICONS.lang },
        { name: "History & Civics", icon: ICONS.history },
        { name: "Geography", icon: ICONS.globe },
    ],
    group2: [
        { name: "Science (Phy, Chem, Bio)", icon: ICONS.science },
        { name: "Mathematics", icon: ICONS.math },
        { name: "Economics", icon: ICONS.economics },
        { name: "Commercial Studies", icon: ICONS.commerce },
    ],
    group3: [
        { name: "Computer Application", icon: ICONS.computer },
        { name: "Home Science", icon: ICONS.home },
        { name: "Physical Education", icon: ICONS.pe },
        { name: "Art I & III", icon: ICONS.art },
    ],
}

const SecondaryPage: React.FC = () => {
    return (
        <div>
            <PageSEO 
              title="Secondary School (ICSE) - OIS | Best School in Dombivli"
              description="Preparing students for the ICSE board examinations with a comprehensive curriculum at Omkar International School, the best school in Dombivli."
            />
            <PageHeader
                title="Secondary School"
                subtitle="Preparatory Stage | Grade IX to Grade X"
                imageUrl="https://lh3.googleusercontent.com/pw/AP1GczO6Rsp6Vg8sCkYQwTPypRA3cg0LBGTq0Bdhp8dxGK1s8QK013y24FahgVaJzJ5TpEWm4s2f37AAi2i7mRorvyxSC5FM_0XHdX9yZT8vdGaFiWepSrkrYZzK7nEjrwC1wRm1ufu7BhCJAZX3SRmk0ksr=w1386-h924-s-no-gm?authuser=1"
            />
            <div className="container mx-auto px-6 py-20 lg:py-28">
                <div className="max-w-6xl mx-auto">
                    <AnimateOnScroll>
                        <blockquote className="text-center text-xl italic text-slate-700 dark:text-slate-300 mb-16">
                          “Success comes to those who work hard and stay, with those who don’t rest on the laurels of the past.”
                        </blockquote>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-16 text-center max-w-4xl mx-auto">
                           We provide a stimulating, safe, and supportive environment where all our students can aim for success. Through interdisciplinary education and a focus on social responsibility, we aim to make every student a role model for society.
                        </p>
                    </AnimateOnScroll>

                    <div className="mt-20">
                        <AnimateOnScroll>
                            <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-12 text-center">Subjects Offered</h3>
                        </AnimateOnScroll>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
                            <AnimateOnScroll delay={0}>
                                <SubjectGroup title="Group I" rule="All 5 are Compulsory" ruleIcon={Check} subjects={subjectsData.group1} color="blue" />
                            </AnimateOnScroll>
                            <AnimateOnScroll delay={150}>
                                <SubjectGroup title="Group II" rule="Choose any 2" ruleIcon={Star} subjects={subjectsData.group2} color="amber" />
                            </AnimateOnScroll>
                            <AnimateOnScroll delay={300}>
                                <SubjectGroup title="Group III" rule="Choose any 1" ruleIcon={Plus} subjects={subjectsData.group3} color="green" />
                            </AnimateOnScroll>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecondaryPage;