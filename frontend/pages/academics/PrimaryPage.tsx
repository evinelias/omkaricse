import React from 'react';
import PageHeader from '../../components/ui/PageHeader';
import SubjectCard from '../../components/ui/SubjectCard';
import {
    Baseline, BookOpen, HeartHandshake, Calculator, FlaskConical, Globe, Laptop, Languages, Theater, Music, Paintbrush, Lightbulb, ClipboardCheck, Dumbbell
} from 'lucide-react';
import PageSEO from '../../components/ui/PageSEO';
import AnimateOnScroll from '../../components/ui/AnimateOnScroll';

const subjects = [
    { name: "English Language", icon: Baseline, description: "Mastery of grammar, composition, and effective communication skills." },
    { name: "Literature in English", icon: BookOpen, description: "Exploring classic and contemporary texts to foster a lifelong love for reading." },
    { name: "Hindi", icon: Languages, description: "Enhancing proficiency in the national language through literature and conversation." },
    { name: "Marathi", icon: Languages, description: "Cultivating skills in the regional language, connecting students to local culture." },
    { name: "Science", icon: FlaskConical, description: "Fostering curiosity about the natural world through observation and experiments." },
    { name: "Mathematics", icon: Calculator, description: "Building a strong foundation in numerical ability and logical reasoning." },
    { name: "Social Studies", icon: Globe, description: "Understanding history, geography, and civics to appreciate our world." },
    { name: "Computer", icon: Laptop, description: "Developing digital literacy and essential tech skills for the modern age." },
    { name: "Value Education", icon: HeartHandshake, description: "Instilling core ethical and moral values to shape responsible citizens." },
    { name: "Physical Education", icon: Dumbbell, description: "Promoting physical fitness, teamwork, and a healthy lifestyle through sports and activities." },
    { name: "Drama", icon: Theater, description: "Building confidence and creative expression through performance arts." },
    { name: "Music", icon: Music, description: "Exploring rhythm, melody, and harmony to nurture artistic talents." },
    { name: "Art and Craft", icon: Paintbrush, description: "Unleashing creativity and imagination through visual arts and hands-on projects." },
];

// FIX: Use 'as const' to ensure cardColors elements are typed as literals, not generic strings.
const cardColors = ['blue', 'amber', 'green', 'purple'] as const;

const InfoCard: React.FC<{ icon: React.ElementType, title: string, content: string, tags: string[], color: string }> = ({ icon: Icon, title, content, tags, color }) => {
    const colorClasses = {
        blue: {
            bg: 'bg-blue-100 dark:bg-blue-900/50',
            text: 'text-blue-600 dark:text-blue-400',
            tagBg: 'bg-blue-50 dark:bg-blue-900/30',
            tagText: 'text-blue-700 dark:text-blue-300'
        },
        amber: {
            bg: 'bg-amber-100 dark:bg-amber-900/50',
            text: 'text-amber-600 dark:text-amber-400',
            tagBg: 'bg-amber-50 dark:bg-amber-900/30',
            tagText: 'text-amber-700 dark:text-amber-300'
        }
    }
    const selectedColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

    return (
        <div className="relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-8 rounded-2xl shadow-xl overflow-hidden h-full">
            <div className="absolute inset-0 bg-[url('/images/bg-subtle.png')] opacity-5 dark:opacity-20"></div>
            <div className="relative z-10">
                <div className="flex items-center mb-6">
                    <div className={`p-3 ${selectedColor.bg} rounded-lg mr-4`}>
                        <Icon className={`w-8 h-8 ${selectedColor.text}`} />
                    </div>
                    <h3 className={`text-3xl font-bold ${selectedColor.text}`}>{title}</h3>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                    {content}
                </p>
                <div className="flex flex-wrap gap-3">
                    {tags.map(tag => (
                        <span key={tag} className={`${selectedColor.tagBg} ${selectedColor.tagText} font-semibold px-3 py-1.5 rounded-full text-sm`}>{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}

const PrimaryPage: React.FC = () => {
    return (
        <div>
            <PageSEO
                title="Primary Academics (Grade III-V) - OIS | Best School in Dombivli"
                description="Learn about the CISCE primary programme for grades III to V at Omkar International School, focusing on holistic development. We are the best school in Dombivli."
            />
            <PageHeader
                title="Primary School"
                subtitle="Preparatory Stage | Grade III to Grade V"
                imageUrl="/images/primary-bg.jpg"
            />
            <div className="container mx-auto px-6 py-20 lg:py-28">
                <div className="max-w-6xl mx-auto">
                    <AnimateOnScroll>
                        <blockquote className="text-center text-2xl italic text-slate-700 dark:text-slate-300 mb-16">
                            “Education is the most powerful weapon which you can use to change the world.”
                            <cite className="block text-right text-lg not-italic mt-2 font-semibold">- Nelson Mandela</cite>
                        </blockquote>

                        <p className="text-lg text-slate-600 dark:text-slate-400 text-center max-w-4xl mx-auto mb-16">
                            The formative years are crucial for developing interest and curiosity. Our aim is to create a conducive atmosphere for each child to evolve by providing the right opportunities to relate to people, things, and ideas around them.
                        </p>
                    </AnimateOnScroll>
                    <div className="grid md:grid-cols-2 gap-10 my-16">
                        <AnimateOnScroll animation="slide-in-from-left">
                            <InfoCard
                                icon={Lightbulb}
                                title="Teaching Methodology"
                                content="We use a constructivist approach where knowledge is gained through experience. Modern methods encourage active participation in our IFP-equipped classrooms."
                                tags={["Flipped Learning", "Project-Based Learning", "Gamification", "Active Participation"]}
                                color="blue"
                            />
                        </AnimateOnScroll>
                        <AnimateOnScroll animation="slide-in-from-right">
                            <InfoCard
                                icon={ClipboardCheck}
                                title="Curriculum"
                                content="We integrate core subjects with Music, Art, PE, Dance, and Drama for a holistic foundation, using varied assessments to facilitate overall growth."
                                tags={["Holistic Foundation", "Formative Assessment", "Summative Assessment", "Classroom Observation"]}
                                color="amber"
                            />
                        </AnimateOnScroll>
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

export default PrimaryPage;