import React from 'react';
import PageHeader from '../../components/ui/PageHeader';
import { Goal, Eye, ShieldCheck, Lightbulb, Globe } from 'lucide-react';
import PageSEO from '../../components/ui/PageSEO';
import AnimateOnScroll from '../../components/ui/AnimateOnScroll';

const ValueCard: React.FC<{ imageUrl: string; title: string; children: React.ReactNode }> = ({ imageUrl, title, children }) => (
    <div className="group bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-t-4 border-transparent hover:border-amber-500 h-full text-center">
        <div className="flex justify-center items-center mb-6">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-110 ring-4 ring-white/50 dark:ring-slate-700/50">
                <img src={imageUrl} alt={`${title} icon`} className="w-full h-full object-cover" />
            </div>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400">{children}</p>
    </div>
);

const ActionCard: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 h-full">
        <div className="flex items-center mb-4">
             <div className="bg-blue-100 dark:bg-slate-700 p-3 rounded-full mr-4">
                <Icon className="w-8 h-8 text-blue-500 dark:text-blue-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h3>
        </div>
        <p className="text-slate-600 dark:text-slate-400">{children}</p>
    </div>
);

interface PieChartProps {
  percentage: number;
  valueText: string;
  labelText: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
}

const PieChart: React.FC<PieChartProps> = ({
  percentage,
  valueText,
  labelText,
  color = '#3b82f6',
  size = 160,
  strokeWidth = 15,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
      // This will trigger the animation when the component becomes visible
      const animation = requestAnimationFrame(() => setProgress(percentage));
      return () => cancelAnimationFrame(animation);
  }, [percentage]);
  
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            className="text-slate-200 dark:text-slate-700"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white">
                {valueText}
            </span>
        </div>
      </div>
      <p className="mt-4 text-center font-semibold text-slate-600 dark:text-slate-400 max-w-[200px]">
          {labelText}
      </p>
    </div>
  );
};

const MissionVisionPage: React.FC = () => {
    const coreValues = [
        {
            imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczNCZjDOymk6_FI7GjssWeawJGwP3ihyTud5_cUEwBZoUZnLea4zeZTVp3OkvHFuCqdJ5GwDZJueCs3vKLRwtyRH1zFNWzqZ_pulfG2ReFl_csYyoRW-ZRJfD5RJmd0M6RNLae9CMeE__7aaiBLcNtTu=w1386-h924-s-no-gm?authuser=1",
            title: "Integrity",
            description: "We champion honesty and strong moral principles, creating a community built on trust, fairness, and transparency in all actions."
        },
        {
            imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczO5s0US5DHbCgoYEVxqWsO8HJSo24nwEypjHIkajwCeJqXeDG6ZlU_E7mu5LYIawY4wyF2hcGhSwcNSJuv0g5LH02hjCBOQrh8RQhlx6lqyyBCxqWcowJlQt6XT8WEWWPS7uQQ4Fd0Izt64Y7M-S8vt=w1386-h924-s-no-gm?authuser=1",
            title: "Excellence",
            description: "Our community is driven by a relentless pursuit of the highest standards, fostering a culture of quality, diligence, and achievement in all endeavors."
        },
        {
            imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczOUDUlqUkPd0sTVat54HHD_pgC82xb9Y3ypx5uJlc02jbNRIzaNWKD3iWggTZvemRIW7OZFLjS-fdrAftDH1eN_VlSNKSRg-ahu0SKq4icjmNwcf_I6YlO3U-DdYbzK0vkoFGJipJzvxPsWLUjbNYwk=w1386-h924-s-no-gm?authuser=1",
            title: "Respect",
            description: "We cultivate an inclusive environment where every individual is valued, differences are celebrated, and every voice is heard with dignity."
        },
        {
            imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczP5HBGfKq7A1CLPbhAIqv-cVa60pCuV4lKInR5wR6sirPpKmG-6tctxyYc7lb0zbaSXtzc_Ui8X0A_-HBPi65zV7XhGywnZPsKKA8vUUZ0Q_OC2zTqRNeqnJ5binet5UMjucPPuKme3SObr3tXcoLZv=w1386-h924-s-no-gm?authuser=1",
            title: "Innovation",
            description: "We embrace curiosity and creative thinking, empowering students with modern teaching methods to solve future challenges."
        }
    ];

  return (
    <div>
      <PageSEO 
        title="Mission & Vision - Omkar International School | Best School in Dombivli"
        description="Explore the mission, vision, and core values that guide Omkar International School, the best school in Dombivli, towards educational excellence."
      />
      <PageHeader 
        title="Mission & Vision" 
        subtitle="Our Guiding Principles for a Brighter Future"
      />
      
      {/* Our Core Pillars */}
      <section className="py-20 lg:py-28">
          <div className="container mx-auto px-6">
              <AnimateOnScroll className="text-center mb-16">
                  <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white">Our Core Pillars</h2>
                  <p className="text-xl text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto">The twin forces that define our purpose and drive our journey towards educational excellence.</p>
              </AnimateOnScroll>

              <div className="grid lg:grid-cols-2 gap-10 items-stretch">
                  {/* Mission Card */}
                  <AnimateOnScroll animation="slide-in-from-left">
                      <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-8 lg:p-10 rounded-2xl shadow-xl h-full flex flex-col">
                          <div className="flex flex-col items-center text-center">
                              <div className="p-5 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-slate-700 dark:to-slate-600 mb-4">
                                  <Goal className="w-14 h-14 text-blue-600 dark:text-blue-400" strokeWidth={2}/>
                              </div>
                              <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">Our Mission</h3>
                              <p className="text-lg font-semibold text-slate-500 dark:text-slate-400 tracking-wide mb-6">EXCELLENCE THROUGH ENDEAVOUR</p>
                          </div>
                          <div className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-10 items-start flex-grow place-content-center">
                                <PieChart
                                    percentage={100}
                                    valueText="100%"
                                    labelText="Pass Result Percentage of Students"
                                    color="#22c55e" // green-500
                                />
                                <PieChart
                                    percentage={25} // (72/289) * 100 ≈ 25
                                    valueText="72/289"
                                    labelText="Students Awarded Merit Certificate by CISCE"
                                    color="#f59e0b" // amber-500
                                />
                          </div>
                      </div>
                  </AnimateOnScroll>

                  {/* Vision Card */}
                  <AnimateOnScroll animation="slide-in-from-right">
                       <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-8 lg:p-10 rounded-2xl shadow-xl h-full flex flex-col">
                          <div className="flex flex-col items-center text-center">
                              <div className="p-5 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-slate-700 dark:to-slate-600 mb-4">
                                   <Eye className="w-14 h-14 text-amber-600 dark:text-amber-400" strokeWidth={2} />
                              </div>
                              <h3 className="text-3xl font-bold text-amber-600 dark:text-amber-400">Our Vision</h3>
                              <p className="text-lg font-semibold text-slate-500 dark:text-slate-400 tracking-wide mb-6">SHAPING MIND-BODY-SOUL</p>
                          </div>
                           <div className="mt-6 flex-grow flex items-center justify-center">
                               <img 
                                   src="https://lh3.googleusercontent.com/pw/AP1GczPxhM-1APZXHk4gmpxZxTrZajQeoi0V6Xmwl39Q1kyiwnhsFZsBls3l1GSP3HHgbZSIdlDo6A9n2Yy02cjmSOowkEF1xtrYIqfKlC-MhnkW46DOfbdWQLKjgX6f5eBPcQfIvoprKzWbhPDtErwj7JeT=w1248-h832-s-no-gm?authuser=0"
                                   alt="Our Vision - Shaping Mind, Body, and Soul"
                                   className="rounded-lg shadow-md w-full"
                                />
                           </div>
                      </div>
                  </AnimateOnScroll>
              </div>
          </div>
      </section>

       {/* Core Values Section */}
       <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <AnimateOnScroll className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white">Our Core Values</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto">The fundamental beliefs that anchor our institution and guide our every action.</p>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {coreValues.map((value, index) => (
              <AnimateOnScroll key={value.title} delay={index * 150}>
                  <ValueCard title={value.title} imageUrl={value.imageUrl}>
                      {value.description}
                  </ValueCard>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
       </section>
       
       {/* Philosophy in Action */}
        <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
            <AnimateOnScroll className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white">Our Philosophy in Action</h2>
                <p className="text-xl text-slate-500 dark:text-slate-400 mt-4 max-w-3xl mx-auto">We don't just teach values, we live them. Here’s how our mission and vision come to life every day at Omkar International School.</p>
            </AnimateOnScroll>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                <AnimateOnScroll>
                    <ActionCard icon={Globe} title="Nurturing Global Citizens">
                        Through cultural exchange programs, Model UN simulations, and a diverse curriculum, we prepare students to thrive in an interconnected world with empathy and understanding.
                    </ActionCard>
                </AnimateOnScroll>
                <AnimateOnScroll delay={150}>
                    <ActionCard icon={Lightbulb} title="Fostering Innovation">
                        Our state-of-the-art labs, coding clubs, and project-based learning methodologies encourage students to think creatively, experiment boldly, and solve real-world problems.
                    </ActionCard>
                </AnimateOnScroll>
                <AnimateOnScroll delay={300}>
                    <ActionCard icon={ShieldCheck} title="Building Character">
                        Community service initiatives, leadership training programs, and value education are woven into the fabric of school life to build strong moral character and integrity.
                    </ActionCard>
                </AnimateOnScroll>
            </div>
        </div>
        </section>
    </div>
  );
};

export default MissionVisionPage;