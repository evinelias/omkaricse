import React from 'react';
import PageHeader from '../../components/ui/PageHeader';
import {
    Baseline, Atom, Beaker, Calculator, Dna, Laptop, Dumbbell, Mountain, Library, AreaChart, Store, BriefcaseBusiness, Palette, ScrollText, Globe2, Users, BrainCircuit
} from 'lucide-react';
import PageSEO from '../../components/ui/PageSEO';

const scienceData = {
    bgIcon: Atom,
    compulsory: [{ name: "English", icon: Baseline }, { name: "Physics", icon: Atom }, { name: "Chemistry", icon: Beaker }],
    optional: [
        { name: "Mathematics", icon: Calculator }, 
        { name: "Biology", icon: Dna }, 
        { name: "Environment Science", icon: Mountain }, 
        { name: "Computer Science", icon: Laptop }, 
        { name: "Artificial Intelligence", icon: BrainCircuit },
        { name: "Physical Education", icon: Dumbbell }
    ]
};
const commerceData = {
    bgIcon: Store,
    compulsory: [{ name: "English", icon: Baseline }, { name: "Accounts", icon: Library }, { name: "Economics", icon: AreaChart }],
    optional: [
        { name: "Mathematics", icon: Calculator }, 
        { name: "Commerce", icon: Store }, 
        { name: "Business Studies", icon: BriefcaseBusiness }, 
        { name: "Computer Science", icon: Laptop }, 
        { name: "Artificial Intelligence", icon: BrainCircuit },
        { name: "Physical Education", icon: Dumbbell },
        { name: "Art", icon: Palette }
    ]
};
const humanitiesData = {
    bgIcon: Users,
    compulsory: [{ name: "English", icon: Baseline }, { name: "Economics", icon: AreaChart }],
    optional: [
        { name: "Environment Science", icon: Mountain }, 
        { name: "Mathematics", icon: Calculator }, 
        { name: "History", icon: ScrollText }, 
        { name: "Geography", icon: Globe2 }, 
        { name: "Commerce", icon: Store }, 
        { name: "Computer Science", icon: Laptop }, 
        { name: "Artificial Intelligence", icon: BrainCircuit },
        { name: "Physical Education", icon: Dumbbell },
        { name: "Art", icon: Palette }
    ]
};

interface Subject { 
    name: string; 
    icon: React.ComponentType<{ className?: string, strokeWidth?: string }>; 
}

const colorClasses: { [key: string]: string } = {
    blue: "text-blue-500 dark:text-blue-400",
    green: "text-green-500 dark:text-green-400",
    purple: "text-purple-500 dark:text-purple-400",
};

const IconListItem: React.FC<Subject & { color: string }> = ({ name, icon: Icon, color }) => (
    <li className="flex items-center text-slate-600 dark:text-slate-400">
        <Icon className={`${colorClasses[color] || colorClasses.blue} w-5 h-5 mr-3 flex-shrink-0`} strokeWidth="1.5" />
        <span>{name}</span>
    </li>
);

const StreamCard: React.FC<{ title: string; compulsory: Subject[]; optional: Subject[], optionalCount: number, color: string; colorName: string, bgIcon: React.ElementType }> = ({ title, compulsory, optional, optionalCount, color, colorName, bgIcon: BgIcon }) => (
    <div className="relative group bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 rounded-xl shadow-lg transform hover:scale-[1.03] transition-transform duration-300 flex flex-col overflow-hidden">
        <BgIcon className="absolute -right-4 -bottom-4 h-40 w-40 text-slate-100 dark:text-slate-700/50 transition-transform duration-500 group-hover:rotate-6" strokeWidth={1} />
        <div className={`relative p-6 bg-gradient-to-br ${color} text-white rounded-t-xl z-10`}>
            <h3 className="text-2xl font-bold text-center">{title}</h3>
        </div>
        <div className="relative p-6 flex-grow z-10">
            <div>
                <h4 className="font-semibold text-slate-800 dark:text-white mb-3">Compulsory Subjects</h4>
                <ul className="space-y-2 mb-6">
                    {compulsory.map(s => <IconListItem key={s.name} name={s.name} icon={s.icon} color={colorName} />)}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-slate-800 dark:text-white mb-3">Optional Subjects <span className="font-normal text-sm">(Choose {optionalCount})</span></h4>
                <ul className="space-y-2">
                    {optional.map(s => <IconListItem key={s.name} name={s.name} icon={s.icon} color={colorName} />)}
                </ul>
            </div>
        </div>
    </div>
);

const ISCPage: React.FC = () => {
    return (
        <div>
            <PageSEO 
              title="ISC Programme (Higher Secondary) - OIS | Best School in Dombivli"
              description="Discover the Science, Commerce, and Humanities streams in our ISC (Higher Secondary) programme at Omkar International School, the best school in Dombivli."
            />
            <PageHeader 
                title="ISC Programme" 
                subtitle="ISC (Grade 11 & 12)"
                imageUrl="https://lh3.googleusercontent.com/pw/AP1GczPEbnpNuIOZvHbhqXLHzj3B8z2EFGbwWJd0u1_XToYG0pj92H3wfFZoX8yRIn4PQtZ2U_JKAEubLyoV5obm1ceN6cbLBAAMFYn7eT3uFtFt8O84n98Nc7VaDKj3-Xhvr6shqrSnhYQVOwURlwSKmPdF=w1386-h924-s-no-gm?authuser=1"
            />
            <div className="container mx-auto px-6 py-20 lg:py-28">
                <div className="max-w-6xl mx-auto">
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 text-center max-w-4xl mx-auto">
                        The Indian School Certificate (ISC) is an intellectually stimulating curriculum with value-based experiences, relevant for future vocational, professional, and university academic programs.
                    </p>

                    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-8 lg:p-10 rounded-xl shadow-md mb-16 border-l-4 border-amber-500">
                        <h3 className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white mb-4">Aims of the ISC Section</h3>
                        <ul className="list-disc list-inside space-y-3 text-slate-700 dark:text-slate-300 text-lg">
                            <li>To provide students with value-based and quality teaching-learning experiences.</li>
                            <li>To align learning outcomes with future vocational and professional requirements.</li>
                            <li>To provide opportunities for participation in co-curricular and extra-curricular activities.</li>
                            <li>To inculcate universal, secular, social, environmental and humanitarian values.</li>
                            <li>To develop social responsibilities through SUPW and community service.</li>
                        </ul>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-10">
                        <StreamCard 
                            title="Science"
                            compulsory={scienceData.compulsory}
                            optional={scienceData.optional}
                            optionalCount={2}
                            color="from-blue-600 to-blue-800"
                            colorName="blue"
                            bgIcon={scienceData.bgIcon}
                        />
                         <StreamCard 
                            title="Commerce"
                            compulsory={commerceData.compulsory}
                            optional={commerceData.optional}
                            optionalCount={2}
                            color="from-green-600 to-green-800"
                            colorName="green"
                            bgIcon={commerceData.bgIcon}
                        />
                         <StreamCard 
                            title="Humanities"
                            compulsory={humanitiesData.compulsory}
                            optional={humanitiesData.optional}
                            optionalCount={3}
                            color="from-purple-600 to-purple-800"
                            colorName="purple"
                            bgIcon={humanitiesData.bgIcon}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ISCPage;