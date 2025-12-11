
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
    imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczOR88HWch1LpXBu9QXV6nAW_AFcEK1zE8OL6hGWARlxN3R5wUVkfWxCQgw8Zz3kTLfZTEeVOfCPbfucCFaOrpIJjDWPqcRECO5MWrQRNz11rPJUICwzLXktXNeSTnhqzh8DASl7v-fdegeCHfjdAEBW=w1386-h924-s-no-gm?authuser=1",
    icon: MonitorSmartphone,
    description: "Immersive learning with smart interactive whiteboards and HD projectors. We foster active participation and digital literacy."
  },
  { 
    title: "Library", 
    imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczM43GpDp1ypIG5V-WhgaIt37QVXHoxTD02JVQ2ni9LvoFWdpNTZE_vinrv-5J_s8dSPu3WwxKrCJBRJu9YgKWAoQOtBUyGTguAeZDB4kUqlWYylrv-XoeHJA7l5u3PEucVzPOuH0sF68F0m5RNZla35=w1386-h924-s-no-gm?authuser=1",
    icon: Library,
    description: "A sanctuary of knowledge featuring classic literature, encyclopedias, and digital resources nurturing a lifelong love for reading."
  },
];

const facilitiesBottom: Facility[] = [
  { 
    title: "Spacious Playground", 
    imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczPcJIYdj45SDzlSbJTd4IievZBR_xonyE7G3MoxDaNlhSkM7cU1W-3JanjIlmGgwjg6ITUKKSSj1JTil_nu0J74i-SAUxaXqOBGTQtGnHmKFGXRx4rdwXB-SVWYEH5_Dp-Ll60k6MjCbQ4ATzqle1Gl=w1646-h924-s-no-gm?authuser=0",
    icon: Swords,
    description: "Lush green acres featuring cricket pitches, basketball courts, and play areas. We develop teamwork and sportsmanship."
  },
  { 
    title: "Transport Services", 
    imageUrl: "https://www.omkarcbse.in/wp-content/uploads/2024/01/t2.jpeg",
    icon: Bus,
    description: "Safe, air-conditioned buses with experienced drivers and on-board staff ensuring a secure daily commute."
  },
  { 
    title: "Canteen Facility", 
    imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczPv3dG5Bcid8aJc65Ix0ccdlSJ_gsqDVEmBs3hpGpRNTg2gx1LYZpNPEJ4IWQL7xftW-XnhBk78rUHmZH8KFclga8x1NHxB7U2A4GLt0EvD8spfqSVRo_nAKbKE9YVz9ZT41kRo-0EXsdQ-P70efC43=w1386-h924-s-no-gm?authuser=1",
    icon: UtensilsCrossed,
    description: "A vibrant hub serving nutritious, hygienic meals. Ideally spaced for students to socialize and recharge."
  },
];

const labs: Lab[] = [
    {
        title: "Chemistry Laboratory",
        imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczOy2ydpkMUCyV1he2zMISymDf2AyOH7zQFYZAAYg9CPiyhcFAfjoMia92kL5HB3bhgWg6AI2f_MkWiRySjmBM9Vq_r7tb1dwYkqCnRgjT2LZYDs18wZfSC0if_SdT-aW-cGTJS3zRjHWPIPqirQDDfO=w1386-h924-s-no-gm?authuser=1",
        icon: Beaker,
        description: "Safe, modern apparatus for insightful chemical analysis.",
        color: "text-purple-500"
    },
    {
        title: "Physics Laboratory",
        imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczO5SZ6WCkw9Oc8yByG_hDbGKvbZGn9zZ-YF67G3dbwOEB8tRHOdyLJS-RKMUwav1_1fm-z9wwXcmgiFW30dNuyO9HJ-idC7w0eGvBVI5NtQJs7E55IWYmsOJ1_9Zd4rBtHQGJWpynKclZy4T1wdrc6r=w1386-h924-s-no-gm?authuser=1",
        icon: Atom,
        description: "Bringing theoretical laws to life through mechanics and optics.",
        color: "text-blue-500"
    },
    {
        title: "Biology Laboratory",
        imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczMKSmS7Yv4CTkTe88IBOgg_HeVF8jGh80nUpHbJal323mAyoR13TjKnUjLXoKAIyHlSOwj8j2i-2Y1dll2S09UXuNka9lfY6HIj5ADIQP1F99ctIfDZl_QOxnhQWGRJw25jVSW6eA6VFN9GDht1a9Jy=w1386-h924-s-no-gm?authuser=1",
        icon: Leaf,
        description: "High-quality microscopes to explore the wonders of the living world.",
        color: "text-green-500"
    },
    {
        title: "Computer Laboratory",
        imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczPLNVXM42TMYgm2o1yLVnUzRQF9HB-eQ4f8N82TRqOa2VTHIZqasUhJPEMUdtjNe_R41PELYDyBe69f5dxY-UL7HHwnwnX3DBkV_ORdjiQQtXhnlCt0_r23zhQ66zeeA6UY6SE4dahq_6qSybuHAovB=w1386-h924-s-no-gm?authuser=1",
        icon: Laptop,
        description: "Advanced systems to nurture coding skills and digital fluency.",
        color: "text-amber-500"
    },
     {
        title: "Robotics Laboratory",
        imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczOUX4gtXJ5Uk1IhZqoD5wStph4CpOH31zC_9PAB-VeyODyFTqT0Y7IW1ouq58fWcFm5N0lXf1m5RdgtMby08D9UvzS8IZ76TaJ3RZ8jTBK8TUulFb8bGnon9i3L8H--cMr1jtoiyXGNt4wJ6OpH3U4H=w1386-h924-s-no-gm?authuser=1",
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
        imageUrl="https://lh3.googleusercontent.com/pw/AP1GczOqckKV5E-1gr3ELDvZC0rV6ki0qcRuMpDdCLKxLvDE5wVs1jSI3YE4JIaaQrZOcBvVsKFOUoWBGDICdrTRUcxxVpwnUMVGJ89sFHGyEeA6n6LK94WPf8hS5qLuPxBpMlzLdxeVQ6fFT1I9XlIUrn7N=w1386-h924-s-no-gm?authuser=0"
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
