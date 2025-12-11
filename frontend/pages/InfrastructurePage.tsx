
import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import { MonitorSmartphone, UtensilsCrossed, Library, Swords, Bus, Beaker, Leaf, Atom, Laptop, Bot } from 'lucide-react';
import PageSEO from '../components/ui/PageSEO';
import AnimateOnScroll from '../components/ui/AnimateOnScroll';

interface Facility {
    title: string;
    imageUrl: string;
    icon: React.ElementType;
    description: string;
}

interface Lab {
    title: string;
    imageUrl: string;
    icon: React.ElementType;
    description: string;
    color: string;
}

const facilitiesTop: Facility[] = [
    {
        title: "Digital Classrooms",
        imageUrl: "/images/infra-1.jpg",
        icon: MonitorSmartphone,
        description: "Immersive learning with smart interactive whiteboards and HD projectors. We foster active participation and digital literacy."
    },
    {
        title: "Library",
        imageUrl: "/images/infra-2.jpg",
        icon: Library,
        description: "A sanctuary of knowledge featuring classic literature, encyclopedias, and digital resources nurturing a lifelong love for reading."
    },
];

const facilitiesBottom: Facility[] = [
    {
        title: "Spacious Playground",
        imageUrl: "/images/infra-3.jpg",
        icon: Swords,
        description: "Lush green acres featuring cricket pitches, basketball courts, and play areas. We develop teamwork and sportsmanship."
    },
    {
        title: "Transport Services",
        imageUrl: "/images/infrastructure-1.jpeg",
        icon: Bus,
        description: "Safe, air-conditioned buses with experienced drivers and on-board staff ensuring a secure daily commute."
    },
    {
        title: "Canteen Facility",
        imageUrl: "/images/infra-4.jpg",
        icon: UtensilsCrossed,
        description: "A vibrant hub serving nutritious, hygienic meals. Ideally spaced for students to socialize and recharge."
    },
];

const labs: Lab[] = [
    {
        title: "Chemistry Laboratory",
        imageUrl: "/images/infra-5.jpg",
        icon: Beaker,
        description: "Safe, modern apparatus for insightful chemical analysis.",
        color: "text-purple-500"
    },
    {
        title: "Physics Laboratory",
        imageUrl: "/images/infra-6.jpg",
        icon: Atom,
        description: "Bringing theoretical laws to life through mechanics and optics.",
        color: "text-blue-500"
    },
    {
        title: "Biology Laboratory",
        imageUrl: "/images/infra-7.jpg",
        icon: Leaf,
        description: "High-quality microscopes to explore the wonders of the living world.",
        color: "text-green-500"
    },
    {
        title: "Computer Laboratory",
        imageUrl: "/images/infra-8.jpg",
        icon: Laptop,
        description: "Advanced systems to nurture coding skills and digital fluency.",
        color: "text-amber-500"
    },
    {
        title: "Robotics Laboratory",
        imageUrl: "/images/infra-9.jpg",
        icon: Bot,
        description: "Fostering engineering skills through hands-on robot building.",
        color: "text-red-500"
    },
];

const FacilityCard: React.FC<{ facility: Facility, index: number }> = ({ facility, index }) => {
    const { title, imageUrl, icon: Icon, description } = facility;
    const isReversed = index % 2 !== 0;

    return (
        <div className="py-12 lg:py-16 px-4 sm:px-6 overflow-hidden">
            <AnimateOnScroll
                animation={isReversed ? 'slide-in-from-right' : 'slide-in-from-left'}
                duration={800}
                className="max-w-7xl mx-auto"
            >
                <div className="group flex flex-col lg:flex-row bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-2xl transition-all duration-500">

                    {/* Image Section */}
                    <div className={`lg:w-1/2 relative min-h-[300px] lg:min-h-[450px] overflow-hidden ${isReversed ? 'lg:order-last' : ''}`}>
                        <img
                            src={imageUrl}
                            alt={title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-none"></div>
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                        <div className="flex items-center mb-6">
                            <div className="p-4 bg-amber-100 dark:bg-slate-700/50 rounded-2xl mr-5 shadow-inner transform group-hover:rotate-6 transition-transform duration-300">
                                <Icon className="w-8 h-8 text-amber-600 dark:text-amber-400" strokeWidth={1.5} />
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white tracking-tight">{title}</h2>
                        </div>

                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            </AnimateOnScroll>
        </div>
    );
};

const LabCard: React.FC<{ lab: Lab, index: number }> = ({ lab, index }) => {
    return (
        <AnimateOnScroll delay={index * 100} className="h-full">
            <div className="group relative h-96 rounded-[2rem] overflow-hidden shadow-xl cursor-pointer border border-slate-100 dark:border-slate-700 hover:shadow-2xl transition-all duration-500">
                {/* Background Image */}
                <img
                    src={lab.imageUrl}
                    alt={lab.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end transform transition-transform duration-300">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <div className={`mb-4 inline-flex p-3 rounded-xl bg-white/10 backdrop-blur-md ${lab.color} shadow-lg`}>
                            <lab.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">{lab.title}</h3>
                        <p className="text-slate-200 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 line-clamp-4 leading-relaxed">
                            {lab.description}
                        </p>
                    </div>
                </div>
            </div>
        </AnimateOnScroll>
    );
}

const InfrastructurePage: React.FC = () => {
    return (
        <div>
            <PageSEO
                title="Infrastructure & Facilities - OIS | Best School in Dombivli"
                description="Explore the state-of-the-art infrastructure and facilities at Omkar International School, including digital classrooms, labs, and playgrounds."
            />
            <PageHeader
                title="Infrastructure & Facilities"
                subtitle="Creating a World-Class Learning Environment"
                imageUrl="/images/hero-6.jpg"
            />

            <div className="bg-slate-50/50 dark:bg-transparent pb-20">
                {/* Part 1: Digital Classrooms & Library */}
                {facilitiesTop.map((facility, index) => (
                    <FacilityCard key={facility.title} facility={facility} index={index} />
                ))}

                {/* Part 2: Laboratories (Scientific Excellence) - Position 3 */}
                <section className="py-16 px-4 sm:px-6 relative">
                    <div className="absolute inset-0 bg-slate-100/50 dark:bg-slate-800/30 -skew-y-3 transform origin-left scale-110 z-0"></div>
                    <div className="max-w-7xl mx-auto relative z-10">
                        <AnimateOnScroll className="text-center mb-16">
                            <div className="inline-block p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 mb-4">
                                <Beaker className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-4">Scientific Excellence</h2>
                            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                                Explore our modern laboratories designed to spark curiosity and foster innovation.
                            </p>
                        </AnimateOnScroll>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {labs.map((lab, index) => (
                                <LabCard key={lab.title} lab={lab} index={index} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Part 3: Playground, Transport, Canteen */}
                {facilitiesBottom.map((facility, index) => (
                    // Start index at 0 (even) so Playground is Left-aligned, creating a fresh rhythm after the Labs section
                    <FacilityCard key={facility.title} facility={facility} index={index} />
                ))}
            </div>
        </div>
    );
};

export default InfrastructurePage;
