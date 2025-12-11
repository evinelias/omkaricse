import React from 'react';
import PageHeader from '../../components/ui/PageHeader';
import PageSEO from '../../components/ui/PageSEO';
import AnimateOnScroll from '../../components/ui/AnimateOnScroll';
import SubjectCard from '../../components/ui/SubjectCard';
import { 
    Users, Shield, Trophy, Dumbbell, Music, Grid3x3, Crown, Aperture, Footprints, Move, Bot, PersonStanding, Theater, ShieldCheck 
} from 'lucide-react';

const ExtracurricularCard: React.FC<{
    icon: React.ElementType;
    title: string;
    description: string;
    color: 'blue' | 'amber' | 'green' | 'purple' | 'red';
}> = ({ icon: Icon, title, description, color }) => {
    const colorClasses = {
        blue: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500' },
        amber: { bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500' },
        green: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-600 dark:text-green-400', border: 'border-green-500' },
        purple: { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500' },
        red: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-600 dark:text-red-400', border: 'border-red-500' },
    };
    const selectedColor = colorClasses[color];

    return (
        <div className={`relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-8 rounded-2xl shadow-xl overflow-hidden h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-l-8 ${selectedColor.border}`}>
            <div className="flex items-start gap-6">
                <div className={`flex-shrink-0 p-4 ${selectedColor.bg} rounded-full`}>
                    <Icon className={`w-10 h-10 ${selectedColor.text}`} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">{title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

const extracurriculars = [
    { title: "Student Council", icon: Users, color: 'blue' as const, description: "A platform for students to voice their opinions, develop leadership skills, and organize school events, fostering a sense of responsibility and community." },
    { title: "House System", icon: Shield, color: 'amber' as const, description: "Fostering camaraderie and healthy competition, our four houses (Ruby, Sapphire, Emerald, Topaz) compete in various events, building team spirit and identity." },
    { title: "Competitions", icon: Trophy, color: 'green' as const, description: "We encourage participation in a wide range of inter-house and inter-school competitions, from debates and quizzes to science fairs, celebrating talent and hard work." },
    { title: "Sports", icon: Dumbbell, color: 'purple' as const, description: "Promoting physical fitness and sportsmanship, our extensive sports program includes training and competitions in various indoor and outdoor games." },
    { title: "School Band", icon: Music, color: 'red' as const, description: "The heart of our school's cultural events, the school band provides a platform for musically talented students to perform and showcase their skills." },
];

const cocurriculars = [
    { name: "Rubik's Cube", icon: Grid3x3, description: "Enhances problem-solving, spatial reasoning, and memory skills." },
    { name: "Chess", icon: Crown, description: "Develops strategic thinking, foresight, and concentration." },
    { name: "Football", icon: Aperture, description: "Promotes teamwork, physical endurance, and discipline." },
    { name: "Athletics", icon: Footprints, description: "Builds stamina, speed, and a spirit of individual perseverance." },
    { name: "Gymnastics", icon: Move, description: "Improves flexibility, balance, strength, and coordination." },
    { name: "Robotics", icon: Bot, description: "Fosters innovation, coding skills, and a passion for technology." },
    { name: "Dance", icon: PersonStanding, description: "Encourages creative expression, rhythm, and cultural appreciation." },
    { name: "Drama", icon: Theater, description: "Builds confidence, public speaking skills, and emotional intelligence." },
    { name: "Music", icon: Music, description: "Nurtures artistic talent in vocal or instrumental music." },
    { name: "Judo", icon: ShieldCheck, description: "Instills discipline, self-defense skills, and respect." },
];

const cardColors = ['blue', 'amber', 'green', 'purple'] as const;

const CoCurricularPage: React.FC = () => {
  return (
    <div>
      <PageSEO 
        title="Cocurricular & Extracurricular - OIS | Best School in Dombivli"
        description="Explore a wide range of activities beyond academics at Omkar International School. From student council and sports to robotics and arts, we foster holistic development."
      />
      <PageHeader 
        title="Beyond the Classroom" 
        subtitle="Nurturing Talents, Building Futures"
      />
      <div className="container mx-auto px-6 py-20 lg:py-28">
        
        {/* Extracurricular Section */}
        <section className="mb-28">
            <AnimateOnScroll className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white">Extracurricular Activities</h2>
                <p className="text-xl text-slate-500 dark:text-slate-400 mt-4 max-w-3xl mx-auto">
                    Building leaders, team players, and well-rounded individuals through structured programs that extend learning beyond academic subjects.
                </p>
            </AnimateOnScroll>
            <div className="max-w-5xl mx-auto grid grid-cols-1 gap-10">
                {extracurriculars.map((activity, index) => (
                    <AnimateOnScroll key={activity.title} delay={index * 150} animation={index % 2 === 0 ? 'slide-in-from-left' : 'slide-in-from-right'}>
                        <ExtracurricularCard 
                            title={activity.title}
                            icon={activity.icon}
                            description={activity.description}
                            color={activity.color}
                        />
                    </AnimateOnScroll>
                ))}
            </div>
        </section>

        {/* Cocurricular Section */}
        <section>
            <AnimateOnScroll className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white">Cocurricular Activities</h2>
                <p className="text-xl text-slate-500 dark:text-slate-400 mt-4 max-w-3xl mx-auto">
                    Nurturing passions and developing specialized skills. These activities complement the curriculum and allow students to explore their interests in depth.
                </p>
            </AnimateOnScroll>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {cocurriculars.map((activity, index) => (
                    <AnimateOnScroll key={activity.name} delay={index * 75} duration={500}>
                        <SubjectCard 
                            title={activity.name} 
                            icon={activity.icon}
                            description={activity.description}
                            color={cardColors[index % cardColors.length]}
                        />
                    </AnimateOnScroll>
                ))}
            </div>
        </section>

      </div>
    </div>
  );
};

export default CoCurricularPage;