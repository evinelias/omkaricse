import React from 'react';
import PageHeader from '../../components/ui/PageHeader';
import {
    Star,
    Baseline, BookOpen, Calculator, FlaskConical, Globe, Laptop, Languages, Theater, Music, Paintbrush, ClipboardCheck, Dumbbell, HeartHandshake, Lightbulb
} from 'lucide-react';
import PageSEO from '../../components/ui/PageSEO';
import AnimateOnScroll from '../../components/ui/AnimateOnScroll';
import ShapeMatchGame from '../../components/games/ShapeMatchGame';
import SubjectCard from '../../components/ui/SubjectCard';

const features = [
    { title: "Good Values", imageUrl: "/images/foundation-1.jpg", description: "Through stories and group activities, we teach kindness, sharing, and respect, laying the foundation for empathetic individuals." },
    { title: "Cognitive Skills", imageUrl: "/images/foundation-2.jpg", description: "Our puzzles, sorting games, and memory challenges are designed to boost problem-solving abilities and sharpen young minds." },
    { title: "Team Spirit", imageUrl: "/images/foundation-3.jpg", description: "Collaborative projects and group play encourage children to work together, communicate, and build strong, positive friendships." },
    { title: "Innovative Learning", imageUrl: "/images/foundation-4.jpg", description: "We use smart boards, educational apps, and interactive toys to make learning a modern, engaging, and multi-sensory adventure." },
    { title: "Inquisitive Minds", imageUrl: "/images/foundation-5.jpg", description: "We foster curiosity by encouraging questions, hands-on experiments, and exploration, turning every child into a lifelong learner." },
    { title: "Fun Experiences", imageUrl: "/images/foundation-6.jpg", description: "Learning is a joyful journey! From music and dance to art and outdoor play, we ensure every day is filled with laughter and happy memories." },
];

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

const cardColors = ['blue', 'amber', 'green', 'purple'] as const;

const FloatingShapes: React.FC = () => (
    <div className="absolute inset-0 z-0 overflow-hidden opacity-70 dark:opacity-40">
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-blue-300 rounded-full animate-[float_8s_ease-in-out_infinite]" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-2/3 right-1/4 w-20 h-20 bg-yellow-300 rounded-lg animate-[float_10s_ease-in-out_infinite]" style={{ animationDelay: '-2s', transform: 'rotate(45deg)' }}></div>
        <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-green-300 rounded-full animate-[float_9s_ease-in-out_infinite]" style={{ animationDelay: '-4s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-red-300 rounded-xl animate-[float_12s_ease-in-out_infinite]" style={{ animationDelay: '-1s' }}></div>
        <div className="absolute bottom-1/4 left-10 w-10 h-10 bg-purple-300 rounded-full animate-[float_7s_ease-in-out_infinite]" style={{ animationDelay: '-3s' }}></div>
        <div className="absolute bottom-1/3 right-10 w-14 h-14 bg-pink-300 rounded-lg animate-[float_11s_ease-in-out_infinite]" style={{ animationDelay: '-5s', transform: 'rotate(25deg)' }}></div>
    </div>
);

const cardBackColors = [
    "bg-gradient-to-br from-blue-400 to-purple-500",
    "bg-gradient-to-br from-green-400 to-teal-500",
    "bg-gradient-to-br from-yellow-400 to-orange-500",
    "bg-gradient-to-br from-pink-400 to-red-500",
    "bg-gradient-to-br from-indigo-400 to-cyan-500",
    "bg-gradient-to-br from-rose-400 to-fuchsia-500",
];

const FlipCard: React.FC<{ feature: typeof features[number]; index: number; }> = ({ feature, index }) => {
    const { title, imageUrl, description } = feature;
    const bgColor = cardBackColors[index % cardBackColors.length];
    return (
        <div className="group [perspective:1000px] aspect-[4/5] h-full w-full">
            <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] md:group-hover:[transform:rotateY(180deg)]">
                {/* Front of the card */}
                <div className="absolute w-full h-full [backface-visibility:hidden] rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 shadow-lg flex flex-col overflow-hidden">
                    <div className="relative flex-grow">
                        <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <h3 className="absolute bottom-0 left-0 p-4 text-xl font-bold text-white text-shadow-md">{title}</h3>
                    </div>
                </div>
                {/* Back of the card */}
                <div className={`absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl ${bgColor} p-6 flex flex-col justify-center items-center text-center shadow-lg text-white`}>
                    <h3 className="text-2xl font-bold mb-3">{title}</h3>
                    <p className="text-sm">{description}</p>
                </div>
            </div>
        </div>
    );
};

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

const FoundationalYearsPage: React.FC = () => {
    return (
        <div className="relative overflow-hidden">
            <PageSEO
                title="Foundational Years Program - OIS | Best School in Dombivli"
                description="Discover our play-based curriculum for the foundational years at Omkar International School. A world of wonder and learning awaits at the best school in Dombivli."
            />
            <PageHeader
                title="Foundational Years"
                subtitle="Preparatory Stage | Montessori I to Grade II"
                imageUrl="/images/foundation-bg.jpg"
            />
            <FloatingShapes />
            <div className="relative z-10 container mx-auto px-6 py-20 lg:py-28">
                <div className="max-w-5xl mx-auto">
                    <AnimateOnScroll className="text-center mb-20">
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white mb-4 tracking-tight">
                            Montessori I to III: Where Fun and Learning Come to Play
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                            Our play-based curriculum, aligned with the latest NEP policies, creates a magical environment for your child's holistic development. We turn curiosity into confidence!
                        </p>
                    </AnimateOnScroll>

                    <AnimateOnScroll>
                        <div className="relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-8 lg:p-12 rounded-3xl shadow-2xl">
                            <div className="text-center mb-12">
                                <Star className="w-12 h-12 text-yellow-400 mx-auto mb-2 animate-pulse" />
                                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Our Recipe for Happy Learners</h3>
                                <p className="text-slate-600 dark:text-slate-300">A visual guide to how we help every child shine!</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
                                {features.map((feature, index) => (
                                    <AnimateOnScroll key={index} delay={index * 120} duration={600}>
                                        <FlipCard feature={feature} index={index} />
                                    </AnimateOnScroll>
                                ))}
                            </div>
                        </div>
                    </AnimateOnScroll>

                    {/* Interactive Game Section */}
                    <AnimateOnScroll className="mt-28">
                        <div className="relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-8 lg:p-12 rounded-3xl shadow-2xl overflow-hidden">
                            <div className="text-center mb-8">
                                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Let's Play a Game!</h3>
                                <p className="text-slate-600 dark:text-slate-300">A fun activity for our little visitors.</p>
                            </div>
                            <ShapeMatchGame />
                        </div>
                    </AnimateOnScroll>

                    {/* Grades 1 & 2 Section */}
                    <div className="mt-28">
                        <AnimateOnScroll className="text-center mb-16">
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white mb-4 tracking-tight">
                                Grades I & II: Building Strong Foundations
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                                Continuing the journey from Montessori, Grades I and II solidify the foundational skills that prepare students for the academic rigors of primary school. Our curriculum is designed to be engaging and comprehensive, ensuring a seamless transition and fostering a love for structured learning.
                            </p>
                        </AnimateOnScroll>
                        <div className="grid md:grid-cols-2 gap-10 my-16">
                            <AnimateOnScroll animation="slide-in-from-left">
                                <InfoCard
                                    icon={Lightbulb}
                                    title="Teaching Methodology"
                                    content="Our teaching methodology for Grades I & II builds upon the play-based approach with more structured learning activities. We utilize interactive smart boards, group projects, and hands-on experiments to make core concepts in language, math, and science both understandable and exciting."
                                    tags={["Interactive Learning", "Structured Activities", "Experiential Learning", "Holistic Growth"]}
                                    color="blue"
                                />
                            </AnimateOnScroll>
                            <AnimateOnScroll animation="slide-in-from-right">
                                <InfoCard
                                    icon={ClipboardCheck}
                                    title="Curriculum"
                                    content="The curriculum is thoughtfully crafted to develop literacy, numeracy, and critical thinking. We introduce a diverse range of subjects, from core academics to arts and physical education, ensuring a balanced and well-rounded educational experience that nurtures every aspect of a child's development."
                                    tags={["Balanced Curriculum", "Literacy & Numeracy", "Critical Thinking", "Co-curricular Activities"]}
                                    color="amber"
                                />
                            </AnimateOnScroll>
                        </div>
                        <div className="mt-20">
                            <AnimateOnScroll>
                                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-12 text-center">Subjects Offered for Grades I & II</h3>
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
        </div>
    );
};

export default FoundationalYearsPage;