import React from 'react';
import PageHeader from '../../components/ui/PageHeader';
import { Link } from 'react-router-dom';
import { CheckCircle, GraduationCap, Users, HeartHandshake, ArrowRight } from 'lucide-react';
import PageSEO from '../../components/ui/PageSEO';
import AnimateOnScroll from '../../components/ui/AnimateOnScroll';

const PhilosophyCard: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
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


const PrincipalPage: React.FC = () => {
  return (
    <div>
      <PageSEO 
        title="Principal's Message - Omkar International School | Best School in Dombivli"
        description="Read a warm welcome from Mrs. Archana Parulekar, Principal of Omkar International School. Discover our educational philosophy at the best school in Dombivli."
      />
      <PageHeader 
        title="From the Principal's Desk" 
        subtitle="MRS. ARCHANA PARULEKAR"
        imageUrl="https://lh3.googleusercontent.com/pw/AP1GczMFDY2vDwGV945VVc1SROcAjeCS9H8RPfGW9WM_guEbfjO42AX3okvt9utb0PQkw6X9jGlueYlb_Z38n_G-I175Bfwqgfwmbth2_gfIDiWgZt76mBE3i7WQLgVia09n_lmtmwOs3Yyds0U2sC9cvwts=w1386-h924-s-no-gm?authuser=0"
      />
      <div className="container mx-auto px-6 py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          <div className="lg:w-1/3 lg:sticky top-28">
            <AnimateOnScroll animation="slide-in-from-left">
              <img 
                src="https://lh3.googleusercontent.com/pw/AP1GczMFDY2vDwGV945VVc1SROcAjeCS9H8RPfGW9WM_guEbfjO42AX3okvt9utb0PQkw6X9jGlueYlb_Z38n_G-I175Bfwqgfwmbth2_gfIDiWgZt76mBE3i7WQLgVia09n_lmtmwOs3Yyds0U2sC9cvwts=w1386-h924-s-no-gm?authuser=0" 
                alt="MRS. ARCHANA PARULEKAR" 
                className="rounded-xl shadow-2xl w-full"
              />
              <div className="mt-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-6 rounded-lg shadow-lg">
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Mrs. Archana Parulekar</h2>
                  <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mt-1">Principal, Omkar International School</p>
               </div>
            </AnimateOnScroll>
          </div>
          <AnimateOnScroll animation="slide-in-from-right" delay={200} className="lg:w-2/3">
            <blockquote className="text-2xl italic text-slate-700 dark:text-slate-300 border-l-4 border-amber-400 dark:border-amber-500 pl-6 mb-10">
             “If your actions inspire others to dream more, learn more, do more and become more, you are a leader.”
            </blockquote>
            <div className="prose prose-lg max-w-none text-slate-600 dark:text-slate-400 dark:prose-invert prose-p:text-slate-600 dark:prose-p:text-slate-400 space-y-6">
              <p>As the Principal of the school, I feel honoured and privileged to be part of an educational institution where every stakeholder is a learner and every day is an opportunity to learn and discover. We look at ourselves as a community of learners, where everyone learns including our teachers, parents & staff.</p>
              
              <h3 className="!text-slate-800 dark:!text-white !font-bold !text-2xl !mt-12">Our Educational Philosophy</h3>
              <p>‘Education plays a key role’ in the overall development of society. The role of education is definitely not limited to giving and grasping knowledge and theory. The true goal of education transcends much beyond just awarding degrees and certificates to students. We are committed to:</p>
              <ul className="space-y-2 !my-4">
                  <li className="flex items-start"><CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" /><span>Providing quality education in a nurturing environment.</span></li>
                  <li className="flex items-start"><CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" /><span>Grooming the latent talent of every student, turning them into capable global citizens.</span></li>
                  <li className="flex items-start"><CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" /><span>Fostering a holistic development that balances academics with co-curricular exploration.</span></li>
              </ul>

              <h3 className="!text-slate-800 dark:!text-white !font-bold !text-2xl !mt-12">Embracing the National Education Policy (NEP)</h3>
              <p>We are proud to align our curriculum and teaching methodologies with the progressive vision of the National Education Policy 2020. Our commitment is to foster an educational environment that is flexible, multidisciplinary, and geared towards bringing out the unique capabilities of each student. We implement the NEP's core principles by focusing on:</p>
              <ul className="space-y-2 !my-4">
                  <li className="flex items-start"><CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" /><span><strong>Conceptual Understanding:</strong> Moving away from rote learning to promote deep, experiential, and inquiry-based learning.</span></li>
                  <li className="flex items-start"><CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" /><span><strong>Skill Development:</strong> Integrating vocational skills and digital literacy to prepare students for the demands of the 21st century.</span></li>
                  <li className="flex items-start"><CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" /><span><strong>Holistic Assessment:</strong> Utilizing a 360-degree, multidimensional report card that tracks progress in cognitive, affective, and psychomotor domains.</span></li>
              </ul>

              <h3 className="!text-slate-800 dark:!text-white !font-bold !text-2xl !mt-12">A Partnership with Parents</h3>
              <p>We believe that a child's education is a collaborative effort between the school and home. We encourage open communication and value your partnership in this incredible journey. Together, we can provide the supportive and enriching environment our students need to thrive.</p>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="font-semibold text-xl text-slate-700 dark:text-slate-300 font-serif italic">Sincerely,</p>
                <p className="font-bold text-2xl text-slate-800 dark:text-white" style={{fontFamily: "'Poppins', sans-serif"}}>Mrs. Archana Parulekar</p>
                <p className="text-md text-slate-500 dark:text-slate-400">Principal</p>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Leadership Philosophy Section */}
        <div className="mt-28">
            <AnimateOnScroll className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white">My Leadership Philosophy</h2>
                <p className="text-xl text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto">Guiding principles that shape our school's culture and success.</p>
            </AnimateOnScroll>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                <AnimateOnScroll delay={0}><PhilosophyCard title="Student-Centric Approach" icon={GraduationCap}>Every decision is made with the students' best interests at heart, ensuring a nurturing and inspiring learning environment.</PhilosophyCard></AnimateOnScroll>
                <AnimateOnScroll delay={150}><PhilosophyCard title="Empowering Educators" icon={Users}>We foster a culture of professional growth and collaboration, empowering our teachers to be innovative and effective mentors.</PhilosophyCard></AnimateOnScroll>
                <AnimateOnScroll delay={300}><PhilosophyCard title="Parent Partnership" icon={HeartHandshake}>Building a strong, communicative bridge between school and home is vital for student success and well-being.</PhilosophyCard></AnimateOnScroll>
            </div>
        </div>

        {/* Explore Further CTA */}
        <div className="mt-28">
            <AnimateOnScroll>
              <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-10 rounded-2xl shadow-xl text-center">
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Explore Further</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">Discover more about the values and opportunities that define Omkar International School.</p>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                      <Link to="/about/mission-vision" className="w-full sm:w-auto flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 duration-300 shadow-md">
                          Our Mission & Vision
                          <ArrowRight className="w-5 h-5 ml-2"/>
                      </Link>
                      <Link to="/admission" className="w-full sm:w-auto flex items-center justify-center bg-slate-200/50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 font-bold py-3 px-6 rounded-full hover:bg-slate-300/50 dark:hover:bg-slate-600/50 transition-all transform hover:scale-105 duration-300 shadow-md">
                          Admission Process
                      </Link>
                  </div>
              </div>
            </AnimateOnScroll>
        </div>
      </div>
    </div>
  );
};

export default PrincipalPage;