import React from 'react';
import PageHeader from '../../components/ui/PageHeader';
import SubjectCard from '../../components/ui/SubjectCard';
import {
    Baseline, BookOpen, Calculator, Atom, Beaker, Leaf, Laptop, Languages, HeartHandshake, Music, Palette, ScrollText, Globe2, BrainCircuit, Target, Lightbulb, DraftingCompass, FlaskConical, Dumbbell
} from 'lucide-react';
import PageSEO from '../../components/ui/PageSEO';
import AnimateOnScroll from '../../components/ui/AnimateOnScroll';

const subjects = [
    { name: "English Language", icon: Baseline, description: "Advanced grammar, persuasive writing, and public speaking skills." },
    { name: "Literature in English", icon: BookOpen, description: "Critical analysis of diverse literary genres and authorial styles." },
    { name: "Hindi", icon: Languages, description: "Deepening linguistic skills through advanced literature and creative writing." },
    { name: "Marathi", icon: Languages, description: "Furthering appreciation of regional literature and cultural nuances." },
    { name: "Physics", icon: Atom, description: "Understanding the fundamental principles of motion, energy, and the universe." },
    { name: "Chemistry", icon: Beaker, description: "Investigating matter, its properties, and chemical reactions." },
    { name: "Biology", icon: Leaf, description: "Studying life processes, ecosystems, and the intricacies of living organisms." },
    { name: "Mathematics", icon: Calculator, description: "Exploring algebra, geometry, and advanced problem-solving techniques." },
    { name: "History", icon: ScrollText, description: "In-depth study of world events and their impact on modern society." },
    { name: "Geography", icon: Globe2, description: "Analyzing physical and human geography on a global scale." },
    { name: "Computer", icon: Laptop, description: "Introduction to programming logic and advanced application software." },
    { name: "Value Education", icon: HeartHandshake, description: "Developing empathy, integrity, and a strong moral compass." },
    { name: "Physical Education", icon: Dumbbell, description: "Encouraging advanced physical fitness, strategic sports skills, and leadership." },
    { name: "Music", icon: Music, description: "Advanced instrumental or vocal training and music theory." },
    { name: "Art", icon: Palette, description: "Refining artistic techniques and exploring different mediums of expression." },
];

// FIX: Use 'as const' to ensure cardColors elements are typed as literals, not generic strings.
const cardColors = ['blue', 'amber', 'green', 'purple'] as const;

const clubs = ["Art Club", "Craft Club", "Language Club", "Tech Club", "Science Club", "Maths Club", "G.K Club", "Life Skill Club", "Physical Fitness Club", "Financial Literacy Club"];

const methodologyData = [
    {
        number: 1,
        title: 'Empathise',
        description: 'Develop a deep understanding of the challenges and needs of others.',
        icon: HeartHandshake,
        color: 'blue'
    },
    {
        number: 2,
        title: 'Define',
        description: 'Clearly articulate the problem you want to solve.',
        icon: Target,
        color: 'amber'
    },
    {
        number: 3,
        title: 'Ideate',
        description: 'Brainstorm creative solutions and challenge assumptions.',
        icon: Lightbulb,
        color: 'green'
    },
    {
        number: 4,
        title: 'Prototype',
        description: 'Build real, tactile representations for a range of your ideas.',
        icon: DraftingCompass,
        color: 'purple'
    },
    {
        number: 5,
        title: 'Test',
        description: 'Gather feedback on your prototypes to refine your solutions.',
        icon: FlaskConical,
        color: 'red'
    },
];

const MethodologyStep: React.FC<{
    number: number;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    isLast?: boolean;
}> = ({ number, title, description, icon: Icon, color, isLast = false }) => {
    const colorClasses: { [key: string]: { bg: string, text: string, border: string } } = {
        blue: { bg: 'bg-blue-100/50 dark:bg-slate-700/50 backdrop-blur-sm', text: 'text-blue-600 dark:text-blue-300', border: 'border-blue-200 dark:border-slate-600' },
        amber: { bg: 'bg-amber-100/50 dark:bg-slate-700/50 backdrop-blur-sm', text: 'text-amber-600 dark:text-amber-300', border: 'border-amber-200 dark:border-slate-600' },
        green: { bg: 'bg-green-100/50 dark:bg-slate-700/50 backdrop-blur-sm', text: 'text-green-600 dark:text-green-300', border: 'border-green-200 dark:border-slate-600' },
        purple: { bg: 'bg-purple-100/50 dark:bg-slate-700/50 backdrop-blur-sm', text: 'text-purple-600 dark:text-purple-300', border: 'border-purple-200 dark:border-slate-600' },
        red: { bg: 'bg-red-100/50 dark:bg-slate-700/50 backdrop-blur-sm', text: 'text-red-600 dark:text-red-300', border: 'border-red-200 dark:border-slate-600' },
    };
    const selectedColor = colorClasses[color] || colorClasses.blue;

    return (
        <div className="relative flex items-start">
            <div className="flex-shrink-0 flex flex-col items-center mr-6">
                <div className={`${selectedColor.bg} ${selectedColor.text} rounded-full h-20 w-20 flex flex-col items-center justify-center font-bold text-2xl z-10 ring-8 ring-transparent`}>
                    <Icon className="w-8 h-8 mb-1" />
                </div>
                {!isLast && <div className={`w-0.5 h-24 ${selectedColor.border}`}></div>}
            </div>
            <div className="ml-4 mt-6">
                <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{number}. {title}</h4>
                <p className="text-slate-600 dark:text-slate-400">{description}</p>
            </div>
        </div>
    );
};

const MiddleSchoolPage: React.FC = () => {
    return (
        <div>
            <PageSEO
                title="Middle School Program (Grade VI-VIII) - OIS | Best School in Dombivli"
                description="Explore the middle school curriculum for grades VI to VIII at Omkar International School, designed to foster critical thinking. Join the best school in Dombivli."
            />
            <PageHeader
                title="Middle School"
                subtitle="Preparatory Stage | Grade VI to Grade VIII"
                imageUrl="/images/middle-bg.jpg"
            />
            <div className="container mx-auto px-6 py-20 lg:py-28">
                <div className="max-w-6xl mx-auto">
                    <AnimateOnScroll>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-16 text-center max-w-4xl mx-auto">
                            Middle school is the opportune time to expand students’ horizons and plant the seeds for critical thinking skills and content knowledge that will propel them to success through high school and beyond.
                        </p>
                    </AnimateOnScroll>

                    <div className="my-20">
                        <AnimateOnScroll className="text-center mb-12">
                            <h3 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">Our 5-Stage Methodology</h3>
                            <p className="text-lg text-slate-500 dark:text-slate-400 mt-3 max-w-3xl mx-auto">We utilize the renowned design thinking process to foster innovation and problem-solving:</p>
                        </AnimateOnScroll>
                        <div className="max-w-xl mx-auto">
                            {methodologyData.map((step, index) => (
                                <AnimateOnScroll key={step.number} delay={index * 200}>
                                    <MethodologyStep
                                        number={step.number}
                                        title={step.title}
                                        description={step.description}
                                        icon={step.icon}
                                        color={step.color}
                                        isLast={index === methodologyData.length - 1}
                                    />
                                </AnimateOnScroll>
                            ))}
                        </div>
                    </div>

                    <div className="my-20">
                        <AnimateOnScroll>
                            <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-10 text-center">Our Programmes & Clubs</h3>
                        </AnimateOnScroll>
                        <div className="flex flex-wrap justify-center items-center gap-4">
                            {clubs.map((club, index) => (
                                <AnimateOnScroll key={club} delay={index * 75} duration={500}>
                                    <div className="bg-blue-100/50 dark:bg-blue-900/50 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 py-3 px-6 rounded-full text-center text-blue-800 dark:text-blue-300 font-semibold transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-blue-200/50 dark:hover:bg-blue-900/80">
                                        {club}
                                    </div>
                                </AnimateOnScroll>
                            ))}
                        </div>
                    </div>

                    <div className="mt-20">
                        <AnimateOnScroll>
                            <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-12 text-center">Subjects Offered</h3>
                        </AnimateOnScroll>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {subjects.map((subject, index) => (
                                <AnimateOnScroll key={subject.name} delay={index * 75} duration={500}>
                                    <SubjectCard
                                        title={subject.name}
                                        icon={subject.icon}
                                        description={subject.description}
                                        color={cardColors[index % cardColors.length]}
                                    />
                                </AnimateOnScroll>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiddleSchoolPage;