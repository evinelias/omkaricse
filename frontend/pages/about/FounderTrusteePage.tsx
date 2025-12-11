import React from 'react';
import PageHeader from '../../components/ui/PageHeader';
import { Link } from 'react-router-dom';
import { Star, Users, Lightbulb, ShieldCheck, ArrowRight } from 'lucide-react';
import PageSEO from '../../components/ui/PageSEO';
import AnimateOnScroll from '../../components/ui/AnimateOnScroll';

const PrincipleCard: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
  <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-8 rounded-2xl text-center shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 border-t-4 border-amber-400 h-full">
    <div className="flex justify-center items-center mb-5">
      <div className="bg-amber-100 dark:bg-slate-700 p-4 rounded-full">
        <Icon className="w-9 h-9 text-amber-500 dark:text-amber-400" strokeWidth={1.5} />
      </div>
    </div>
    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 text-sm">{children}</p>
  </div>
);


const FounderTrusteePage: React.FC = () => {
  return (
    <div>
      <PageSEO
        title="Founder Trustee - Omkar International School | Best School in Dombivli"
        description="Learn about the inspiring journey and vision of Mrs. Darshana Divakar Samant, Founder Trustee of Omkar International School, the best school in Dombivli."
      />
      <PageHeader
        title="From the Founder Trustee"
        subtitle="MRS. DARSHANA DIVAKAR SAMANT"
        imageUrl="/images/founder.jpg"
      />
      <div className="container mx-auto px-6 py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          <div className="lg:w-1/3 lg:sticky top-28">
            <AnimateOnScroll animation="slide-in-from-left">
              <img
                src="/images/founder.jpg"
                alt="MRS. DARSHANA DIVAKAR SAMANT"
                className="rounded-xl shadow-2xl w-full"
              />
              <div className="mt-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Mrs. Darshana D. Samant</h2>
                <p className="text-lg text-amber-600 dark:text-amber-400 font-semibold mt-1">50+ Years of Experience in Education</p>
              </div>
            </AnimateOnScroll>
          </div>
          <AnimateOnScroll animation="slide-in-from-right" delay={200} className="lg:w-2/3">
            <blockquote className="text-2xl italic text-slate-700 dark:text-slate-300 border-l-4 border-amber-400 dark:border-amber-500 pl-6 mb-10">
              “An investment in knowledge pays the best interest.”
            </blockquote>
            <div className="prose prose-lg max-w-none text-slate-600 dark:text-slate-400 dark:prose-invert prose-p:text-slate-600 dark:prose-p:text-slate-400 space-y-6">
              <p>Our Omkar Educational Trust, established in 1985, laid the foundation for several educational institutes. With over 50+ years of experience in the field of Education, my guiding principle has been abided by over the last 35+ years of our existence.</p>

              <h3 className="!text-slate-800 dark:!text-white !font-bold !text-2xl !mt-12">Our Guiding Principle</h3>
              <p>In spite of a modest beginning, we are continuously enhancing our efforts with a single-minded objective: “Excellence in every field”. At Omkar Educational Trust, our endeavour is to ensure that each of our students is proficient in the three towers of excellence – Academics, Sports, and Culture.</p>

              <h3 className="!text-slate-800 dark:!text-white !font-bold !text-2xl !mt-12">Our Academic Philosophy</h3>
              <p>We have diligently developed our academic philosophy by laying great emphasis on the pursuit of knowledge, its application, and the skills to help in its dissemination. Our underlying philosophy is to create new benchmarks by incorporating new initiatives in education through modern and innovative teaching and learning methodologies.</p>

              <h3 className="!text-slate-800 dark:!text-white !font-bold !text-2xl !mt-12">Our Incessant Pursuit</h3>
              <p>Omkar knows no bounds in knowledge and realizes the margin fades forever and ever as it moves. But within its boundaries, the disseminated knowledge embodies the spirit of inquiry, research, and quality. Our search is incessant, our service is ceaseless, and our perseverance untiring. Imparting right knowledge, enhancing wisdom, and creating distinctive individuals is our pursuit.</p>

              <h3 className="!text-slate-800 dark:!text-white !font-bold !text-2xl !mt-12">Core Values and Vision</h3>
              <p>Today we stand at the threshold of a new era – an era empowered by the ‘knowledge economy’. Even as we prepare to ride the waves of change, our foundations are built on solid rock, firmly anchored on strong life principles. Omkar prides itself not only in being an institution imparting life’s latest know-how but also in instilling core human values.</p>
            </div>
            <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
              <p className="font-semibold text-xl text-slate-700 dark:text-slate-300 font-serif italic">May God bless you,</p>
              <p className="font-bold text-2xl text-slate-800 dark:text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Mrs. Darshana D. Samant</p>
              <p className="text-md text-slate-500 dark:text-slate-400">Founder Trustee</p>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Guiding Tenets Section */}
        <div className="mt-28">
          <AnimateOnScroll className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white">Our Guiding Tenets</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto">The foundational pillars that have guided our educational journey for over 35 years.</p>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            <AnimateOnScroll delay={0}><PrincipleCard title="Excellence in Every Field" icon={Star}>A single-minded objective to achieve the highest standards in academics, sports, and cultural activities.</PrincipleCard></AnimateOnScroll>
            <AnimateOnScroll delay={150}><PrincipleCard title="Holistic Development" icon={Users}>Ensuring every student is proficient in the three towers of excellence: Academics, Sports, and Culture.</PrincipleCard></AnimateOnScroll>
            <AnimateOnScroll delay={300}><PrincipleCard title="Innovative Spirit" icon={Lightbulb}>Creating new benchmarks in education through modern, innovative teaching and learning methodologies.</PrincipleCard></AnimateOnScroll>
            <AnimateOnScroll delay={450}><PrincipleCard title="Instilling Core Values" icon={ShieldCheck}>Firmly anchoring our students in strong life principles and core human values for a balanced life.</PrincipleCard></AnimateOnScroll>
          </div>
        </div>

        {/* Explore Further CTA */}
        <div className="mt-28">
          <AnimateOnScroll>
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-10 rounded-2xl shadow-xl text-center">
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Discover Our Legacy</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">Learn more about the leadership and vision that shape our school's unique identity.</p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link to="/about/principal" className="w-full sm:w-auto flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 duration-300 shadow-md">
                  Message from the Principal
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/about/mission-vision" className="w-full sm:w-auto flex items-center justify-center bg-slate-200/50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 font-bold py-3 px-6 rounded-full hover:bg-slate-300/50 dark:hover:bg-slate-600/50 transition-all transform hover:scale-105 duration-300 shadow-md">
                  Our Mission & Vision
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </div>
  );
};

export default FounderTrusteePage;