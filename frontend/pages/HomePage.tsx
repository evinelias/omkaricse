import React from 'react';
import { Link } from 'react-router-dom';
import { Goal, Building2, UsersRound, CalendarCheck2, GraduationCap, Users, Baby, School, Library, Send, MapPin, Flag, Building, Cpu, Rocket, BrainCircuit, Globe, Sparkles } from 'lucide-react';
import PageSEO from '../components/ui/PageSEO';
import AnimateOnScroll from '../components/ui/AnimateOnScroll';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import HeroSlideshow from '../components/ui/HeroSlideshow';
import { usePopup } from '../contexts/PopupContext';
import { useTheme } from '../contexts/ThemeContext';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; borderColor: string }> = ({ icon, title, children, borderColor }) => (
  <div className={`bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-8 rounded-xl shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300 border-t-4 ${borderColor} h-full`}>
    <div className="flex justify-center items-center mb-5 text-4xl text-slate-700 dark:text-slate-300">
      {icon}
    </div>
    <h3 className="text-2xl font-semibold text-slate-800 dark:text-white mb-3">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400">{children}</p>
  </div>
);

const programColorMap = {
  red: {
    glow: 'from-red-500 to-pink-500',
    icon: 'text-red-500',
  },
  yellow: {
    glow: 'from-yellow-500 to-amber-500',
    icon: 'text-yellow-500',
  },
  green: {
    glow: 'from-green-500 to-emerald-500',
    icon: 'text-green-500',
  },
  blue: {
    glow: 'from-blue-500 to-cyan-500',
    icon: 'text-blue-500',
  },
  purple: {
    glow: 'from-purple-500 to-violet-500',
    icon: 'text-purple-500',
  },
};

const programs = [
  { title: 'Foundational Years', icon: Baby, path: '/academics/foundational-years', color: 'red' as const },
  { title: 'Primary', icon: GraduationCap, path: '/academics/primary', color: 'yellow' as const },
  { title: 'Middle School', icon: School, path: '/academics/middle-school', color: 'green' as const },
  { title: 'Secondary', icon: Library, path: '/academics/secondary', color: 'blue' as const },
  { title: 'ISC Programme', icon: Library, path: '/academics/isc', color: 'purple' as const },
];

const timelineEvents = [
  {
    icon: Flag,
    color: 'text-red-500 dark:text-red-400',
    year: '1986: The Founding Vision',
    description: 'Omkar Educational Trust was established with a singular vision: to provide excellence in every field and nurture future generations.'
  },
  {
    icon: Building,
    color: 'text-amber-500 dark:text-amber-400',
    year: '40+ Years: Building a Foundation',
    description: 'Decades of dedication have allowed us to build a foundation of trust, academic rigor, and a nurturing environment for holistic development.'
  },
  {
    icon: Cpu,
    color: 'text-green-500 dark:text-green-400',
    year: 'Today: A Beacon of Modern Education',
    description: 'We integrate cutting-edge technology and innovative teaching methodologies to prepare students for the challenges of the modern world.'
  },
  {
    icon: Rocket,
    color: 'text-blue-500 dark:text-blue-400',
    year: 'Tomorrow: Nurturing Future Leaders',
    description: 'Our focus remains on shaping innovators, critical thinkers, and compassionate global citizens who will lead the world of tomorrow.'
  },
];

const futureFocusItems = [
  {
    icon: BrainCircuit,
    title: 'Critical Thinkers',
    description: 'Fostering inquiry, curiosity, and analytical skills to help students navigate a complex and ever-changing world with confidence.'
  },
  {
    icon: Globe,
    title: 'Global Citizens',
    description: 'Instilling values of empathy, respect, and social responsibility to create compassionate individuals ready to contribute to society.'
  },
  {
    icon: Sparkles,
    title: 'Lifelong Learners',
    description: 'Cultivating a deep-seated passion for knowledge and discovery that extends far beyond the classroom walls.'
  }
];

const HomePage: React.FC = () => {
  const { openPopup } = usePopup();
  const { theme } = useTheme();

  return (
    <div>
      <PageSEO
        title="Omkar International School | Best School in Dombivli"
        description="Omkar International School, the best school in Dombivli, offers excellence in education from foundational years to ISC. Explore our academic programs, state-of-the-art facilities, and nurturing environment."
      />
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden text-white flex items-center justify-center">
        <HeroSlideshow />
      </div>

      {/* Principal's Welcome */}
      <section className="py-20 lg:py-28 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-8 lg:p-12 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            <AnimateOnScroll animation="slide-in-from-left" className="lg:w-1/3">
              <img src="/images/principal.jpg" alt="Principal Mrs. Archana Parulekar" className="rounded-xl shadow-2xl w-full" />
            </AnimateOnScroll>
            <AnimateOnScroll animation="slide-in-from-right" delay={200} className="lg:w-2/3">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-4">A Warm Welcome from Our Principal</h2>
              <blockquote className="text-xl italic text-slate-600 dark:text-slate-400 border-l-4 border-amber-400 pl-4 mb-6">
                “If your actions inspire others to dream more, learn more, do more and become more, you are a leader.”
              </blockquote>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                As the Principal, I am honoured to be part of an institution where every day is an opportunity to learn and discover. We are a community of learners, committed to providing quality education in a nurturing environment that grooms the latent talent of every student.
              </p>
              <cite className="not-italic font-semibold text-slate-800 dark:text-white">
                Mrs. Archana Parulekar, Principal
              </cite>
              <Link to="/about/principal" className="block mt-6 text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Read Her Full Message →
              </Link>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* A Legacy of Excellence Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <AnimateOnScroll className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white">A Legacy of Excellence</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 mt-4 max-w-3xl mx-auto">Tracing our journey from a humble beginning to a beacon of modern education.</p>
          </AnimateOnScroll>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-6 top-0 h-full w-0.5 bg-slate-200 dark:bg-slate-700" aria-hidden="true"></div>
            {timelineEvents.map((event, index) => (
              <AnimateOnScroll key={index} animation="slide-in-from-right" className="mb-16 last:mb-0">
                <div className="relative pl-16">
                  <div className="absolute left-6 top-1 -translate-x-1/2 w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-800">
                    <event.icon className={`w-5 h-5 ${event.color}`} />
                  </div>
                  <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600 hover:-translate-y-1">
                    <h3 className={`text-2xl font-bold ${event.color}`}>{event.year}</h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">{event.description}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Programs at a Glance */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <AnimateOnScroll className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white">Academic Programs at a Glance</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 mt-4">A structured pathway to success, from foundational learning to advanced studies.</p>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {programs.map((program, index) => {
              const selectedColor = programColorMap[program.color];
              return (
                <AnimateOnScroll key={program.title} delay={index * 120} duration={600}>
                  <Link to={program.path} className="block h-full">
                    <div
                      className="group relative h-full rounded-xl p-0.5 transform-style-3d transition-transform duration-500 hover:scale-105"
                      style={{ perspective: '1000px' }}
                    >
                      {/* Glow Effect */}
                      <div className={`absolute -inset-2 bg-gradient-to-br ${selectedColor.glow} rounded-xl blur-lg opacity-0 group-hover:opacity-20 dark:group-hover:opacity-40 transition-opacity duration-500`}></div>

                      {/* Card Content */}
                      <div
                        className="relative h-full bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-8 flex flex-col items-center justify-center text-center transform transition-transform duration-500 group-hover:[transform:rotateX(5deg)_rotateY(-5deg)]"
                      >
                        <div className={`flex justify-center items-center mb-5 text-5xl ${selectedColor.icon}`}>
                          {<program.icon strokeWidth={1.5} />}
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-white">{program.title}</h3>
                      </div>
                    </div>
                  </Link>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shaping the Leaders of Tomorrow Section */}
      <section
        className="py-20 lg:py-28 parallax-bg"
        style={{
          backgroundImage: "url('/images/home-bg-1.jpg')"
        }}
      >
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-white/50'}`}></div>
        <div className="container mx-auto px-6 relative z-10">
          <AnimateOnScroll className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white">Shaping the Leaders of Tomorrow</h2>
            <p className="text-xl text-blue-600 dark:text-amber-300 mt-4 max-w-3xl mx-auto">Beyond academics, we build character, creativity, and a passion for lifelong learning.</p>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-3 gap-8">
            {futureFocusItems.map((item, index) => (
              <AnimateOnScroll key={item.title} delay={index * 150}>
                <div className="group bg-white/50 dark:bg-white/10 backdrop-blur-md p-8 rounded-xl text-center border border-slate-300/50 dark:border-white/20 h-full flex flex-col items-center transition-all duration-300 hover:bg-white/80 dark:hover:bg-white/20 hover:border-blue-500/50 dark:hover:border-amber-300/50 hover:-translate-y-2">
                  <div className="bg-blue-500/10 dark:bg-amber-400/10 p-4 rounded-full border border-blue-500/20 dark:border-amber-400/30 transition-transform duration-300 group-hover:scale-110">
                    <item.icon className="w-10 h-10 text-blue-600 dark:text-amber-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-5 mb-2">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300">{item.description}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* What makes us different Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <AnimateOnScroll className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white">What Makes Us Different</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 mt-4">Our Core Features for a Brighter Future</p>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimateOnScroll delay={0}>
              <FeatureCard title="Holistic Development" borderColor="border-blue-500" icon={<Goal className="h-12 w-12 text-blue-500" strokeWidth={1.5} />}>
                We prioritize nurturing not only academic excellence but also fostering character, creativity, and leadership to prepare students for life.
              </FeatureCard>
            </AnimateOnScroll>
            <AnimateOnScroll delay={150}>
              <FeatureCard title="State-of-the-Art Facilities" borderColor="border-amber-500" icon={<Building2 className="h-12 w-12 text-amber-500" strokeWidth={1.5} />}>
                Our school boasts modern facilities, including smart classrooms and sports amenities, providing a conducive environment for learning.
              </FeatureCard>
            </AnimateOnScroll>
            <AnimateOnScroll delay={300}>
              <FeatureCard title="Experienced Faculty" borderColor="border-blue-500" icon={<UsersRound className="h-12 w-12 text-blue-500" strokeWidth={1.5} />}>
                Our dedicated educators provide personalized attention and mentorship to help each student reach their full potential.
              </FeatureCard>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Numbers Speak Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-amber-400 to-amber-600 dark:bg-none dark:bg-blue-700/50 dark:backdrop-blur-md dark:border-t dark:border-b dark:border-white/10">
        <div className="container mx-auto px-6">
          <AnimateOnScroll className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">Numbers That Speak</h2>
            <p className="text-xl mt-4 text-amber-100 dark:text-amber-300">Quantifying Our Commitment to Excellence</p>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <AnimateOnScroll className="flex flex-col items-center">
              <CalendarCheck2 className="w-16 h-16 mb-4 text-white dark:text-amber-300" strokeWidth={1.5} />
              <AnimatedNumber value={40} suffix="+" className="text-6xl font-extrabold text-white dark:text-amber-400" />
              <p className="text-2xl font-semibold mt-2 text-white">Successful Years</p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={150} className="flex flex-col items-center">
              <GraduationCap className="w-16 h-16 mb-4 text-white dark:text-amber-300" strokeWidth={1.5} />
              <AnimatedNumber value={500} suffix="+" className="text-6xl font-extrabold text-white dark:text-amber-400" />
              <p className="text-2xl font-semibold mt-2 text-white">Educators</p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={300} className="flex flex-col items-center">
              <Users className="w-16 h-16 mb-4 text-white dark:text-amber-300" strokeWidth={1.5} />
              <AnimatedNumber value={4000} suffix="+" className="text-6xl font-extrabold text-white dark:text-amber-400" />
              <p className="text-2xl font-semibold mt-2 text-white">Students</p>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="py-20 lg:py-28 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/images/home-bg-2.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-900/50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <AnimateOnScroll>
            <div className="bg-white/10 dark:bg-slate-800/20 backdrop-blur-md border border-white/20 dark:border-slate-700/50 text-white rounded-2xl shadow-2xl p-10 lg:p-16 text-center">
              <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 text-white">Ready to Join Our Family?</h2>
              <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">Take the next step in your child's educational journey. We invite you to learn more about our community and our campus.</p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button onClick={openPopup} className="w-full sm:w-auto flex items-center justify-center bg-amber-400 text-slate-900 font-bold py-3 px-8 rounded-full hover:bg-amber-300 transition-all transform hover:scale-105 duration-300 shadow-lg">
                  <Send className="w-5 h-5 mr-2" />
                  Enquire Now
                </button>
                <Link to="/contact" className="w-full sm:w-auto flex items-center justify-center bg-white/20 text-white font-bold py-3 px-8 rounded-full hover:bg-white/30 transition-all transform hover:scale-105 duration-300 shadow-lg">
                  <MapPin className="w-5 h-5 mr-2" />
                  Visit Our Campus
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
};

export default HomePage;