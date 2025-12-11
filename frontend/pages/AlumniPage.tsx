import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import PageSEO from '../components/ui/PageSEO';
import AnimateOnScroll from '../components/ui/AnimateOnScroll';
import { Briefcase, Calendar, GraduationCap, Quote, Building2 } from 'lucide-react';

interface Alumni {
    id: number;
    name: string;
    yearOfPassing: string;
    designation: string;
    organization: string;
    imageUrl: string;
    writeup: string;
}

const alumniData: Alumni[] = [
    {
        id: 1,
        name: "Aarav Patel",
        yearOfPassing: "2015",
        designation: "Senior Software Engineer",
        organization: "Google, London",
        imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
        writeup: "Omkar International School laid the bedrock of my analytical thinking. The coding clubs and math olympiads in middle school sparked a passion that turned into my career. I owe my confidence to the teachers who never gave up on me."
    },
    {
        id: 2,
        name: "Dr. Isha Sharma",
        yearOfPassing: "2014",
        designation: "Cardiologist",
        organization: "Apollo Hospitals, Mumbai",
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
        writeup: "The science labs at OIS were where I first looked through a microscope and fell in love with biology. The holistic education here didn't just make me a doctor; it taught me empathy and service, which are the core of my practice today."
    },
    {
        id: 3,
        name: "Vikram Malhotra",
        yearOfPassing: "2016",
        designation: "Investment Banker",
        organization: "J.P. Morgan, Singapore",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
        writeup: "The commerce stream at OIS provided me with a world-class foundation in economics. The leadership opportunities in the Student Council helped me develop the soft skills necessary to navigate the high-pressure world of finance."
    },
    {
        id: 4,
        name: "Riya Desai",
        yearOfPassing: "2017",
        designation: "Sustainable Architect",
        organization: "Zaha Hadid Architects, London",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
        writeup: "Art classes at Omkar were my sanctuary. The school encouraged creativity alongside academics. Today, as I design sustainable urban spaces, I carry the values of environmental responsibility I learned in my geography and EVS classes."
    },
    {
        id: 5,
        name: "Aditya Singh",
        yearOfPassing: "2018",
        designation: "Founder & CEO",
        organization: "TechStream Solutions",
        imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
        writeup: "OIS taught me that failure is just a stepping stone. The support during my formative years gave me the courage to take risks and start my own venture right after college. Proud to be an Omkarian!"
    },
    {
        id: 6,
        name: "Neha Gupta",
        yearOfPassing: "2015",
        designation: "Research Scientist",
        organization: "ISRO, Bangalore",
        imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
        writeup: "From the physics lab to ISRO, it has been an incredible journey. The rigorous academic environment pushed me to question, explore, and innovate. My teachers were my first mentors who believed in my dreams of reaching the stars."
    }
];

const AlumniCard: React.FC<{ alumni: Alumni }> = ({ alumni }) => (
    <div className="group relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden h-full flex flex-col">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        
        <div className="p-6 flex flex-col h-full">
            <div className="flex items-start justify-between mb-6">
                <div className="relative">
                    <img 
                        src={alumni.imageUrl} 
                        alt={alumni.name} 
                        className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-md"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {alumni.yearOfPassing}
                    </div>
                </div>
                <div className="bg-blue-100 dark:bg-slate-700 p-2 rounded-full">
                    <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{alumni.name}</h3>
                <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm mb-1">
                    <Briefcase className="w-4 h-4 mr-2 text-amber-500" />
                    <span className="font-medium">{alumni.designation}</span>
                </div>
                <div className="flex items-center text-slate-500 dark:text-slate-500 text-sm">
                    <Building2 className="w-4 h-4 mr-2" />
                    <span>{alumni.organization}</span>
                </div>
            </div>

            <div className="mt-auto relative bg-slate-50/50 dark:bg-slate-700/30 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                <Quote className="absolute top-2 left-2 w-6 h-6 text-slate-200 dark:text-slate-600 -z-10 transform -scale-x-100" />
                <p className="text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed relative z-10">
                    "{alumni.writeup}"
                </p>
            </div>
        </div>
    </div>
);

const AlumniPage: React.FC = () => {
    return (
        <div>
            <PageSEO 
                title="Alumni Network - OIS | Best School in Dombivli"
                description="Meet the distinguished alumni of Omkar International School. Discover the success stories of our former students across the globe."
            />
            <PageHeader 
                title="Alumni Network" 
                subtitle="Our Pride, Our Legacy"
                imageUrl="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
            />
            
            <div className="container mx-auto px-6 py-20 lg:py-28">
                <AnimateOnScroll className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white">Where Are They Now?</h2>
                    <p className="text-xl text-slate-500 dark:text-slate-400 mt-4 max-w-3xl mx-auto">
                        From leading global tech giants to saving lives in hospitals, our alumni are making a difference everywhere. We are proud of the values and excellence they carry forward.
                    </p>
                </AnimateOnScroll>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {alumniData.map((person, index) => (
                        <AnimateOnScroll key={person.id} delay={index * 100} duration={600}>
                            <AlumniCard alumni={person} />
                        </AnimateOnScroll>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <AnimateOnScroll>
                        <div className="bg-blue-600/10 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-8 rounded-2xl max-w-4xl mx-auto">
                            <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">Are you an OIS Alumnus?</h3>
                            <p className="text-slate-700 dark:text-slate-300 mb-6">
                                We would love to hear your story and add you to our growing network. Stay connected, mentor current students, and be a part of our legacy.
                            </p>
                            <a 
                                href="https://chat.whatsapp.com/ESlWpg5mel017JJvhF0dAR" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                            >
                                Reconnect With Us
                            </a>
                        </div>
                    </AnimateOnScroll>
                </div>
            </div>
        </div>
    );
};

export default AlumniPage;