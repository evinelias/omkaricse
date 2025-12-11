import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import PageSEO from '../components/ui/PageSEO';
import AnimateOnScroll from '../components/ui/AnimateOnScroll';

interface Testimonial {
  name: string;
  relation: string;
  grade: string;
  quote: string;
  imageUrl: string;
}

const testimonials: Testimonial[] = [
    {
        name: "Parents of Divy Vora",
        relation: "Parents of Divy Vora",
        grade: "Grade 5",
        quote: "We are happy to say that our child Divy Vora is studying in Omkar International School Grade 5th C. The school played a pivotal role in my ward’s academic and personal growth. They provided a nurturing environment that encouraged both academic excellence and personal development through various extracurricular activities. The school’s approach to holistic development helped my child to become a confident and well-rounded individual.",
        imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczMKPvwY5dk3TET-4p1qm_lSgw6zixg0kFudFRyI9BLpvpyi-IWY5v53Wp5Oj5LWCvd2SL_906YuyHiSBihu0ouoh340z1LEugZFw4Djwj8sD_WfZ_oesv9FJP9nlsjpO9PSVFCBeaK9UQV7CgUKHNkW2g=w692-h914-s-no-gm",
    },
    {
        name: "Parent of Arnav",
        relation: "Parent of Arnav",
        grade: "Grade 8",
        quote: "We are glad to say that our Son, Arnav is studying in Grade 8th at Omkar International School. We are grateful to Omkar International School for it’s nurturing environment and dedicated teachers, Their balanced focus on academics and extracurricular activities has greatly contributed to our child’s overall growth and confidence.",
        imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczPULxFEoEiPsqUwp8yiB1Vq5f7idTx4MTOQ7Nf21r3JuvlaWNXBVargmhrpz4vGF-7SW72V5AdrwqB5P-P3Du9-u7AIc4VVg8_gAnMgz_zEY87PMavxjO_JmBhop0nk7fotIPH3oMYmzBG_5AIs6gkExQ=w845-h914-s-no-gm",
    },
    {
        name: "Parent of Durva",
        relation: "Parent of Durva",
        grade: "Grade 8",
        quote: "My daughter is studying in Grade 8th C, Omkar International School and I wish to express my deep gratitude for Omkar International School’s crucial role in my daughter, Durva’s life. This school is more than an academic setting for us; it is a sanctuary of support that has expertly navigated the inevitable highs and lows of her years. Their non-punitive approach during my child’s hard times fostered deep resilience, teaching her that setbacks are stepping blocks. Non-failures. Thank you for all this, she is not only equipped with knowledge but with life lessons also.",
        imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczPHOmcrB0PQjUTzRxw7Tpyg1BXy8gEIf27NQjJSCxJG-jsgjShzJEamkXvaRXJmkpjnmL2JDER9G_CIO03zTcl0Kp3AHo8VY54I8BqfMcpydmZPeQvIwuJw8-UoO_gfH7d4J4-875navsPb-3SG8G0opg=w768-h914-s-no-gm",
    },
    {
        name: "Mrs.Prachi.C. Lokande",
        relation: "Parent of Kriva Chinmay Lokande",
        grade: "Mont III",
        quote: "Omkar Caterpillar Kidz ICSE is one of the best schools in Dombivli. There is a great bonding between teachers and children... My child has emerged as a confident, resilient and a curious learner. Great school!",
        imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczPYyYgC5Ujw_bcsLdSymANdlsY2JE4Ys3H4MkOczmuZC9XZmuXBaQ6FraZjgEOWy0ZDQUtYbPS13AC8XEy4upph58pIeNT7bp81AqEaG5pkK-lgz5b7sNitPTtyV9cri6uaM2OiB812W9L9ArQWZbEBYQ=w659-h913-s-no-gm",
    },
    {
        name: "Mrs. Sukanya Iyer",
        relation: "Parent of Mrs. Tanshikka Iyer and Ms.Tasvikka Iyer",
        grade: "Grade 1",
        quote: "Putting my two daughters’ education in the caring hands of Omkar Caterpillar Kidz ICSE has not only given me peace of mind, but also has nurtured hope within me... A team of dedicated and hard-working teachers ensure that learning of the children are fun-filled and joyful.",
        imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczMMshp2K1J2IrW4Uz8Yr6zKQTJaSNut1Lw2CAaCHdCaH0OkgCuD56LEZ_ExJWH2hEQnCGHd36TUzE54lqJAe-0XLmS4GD_b-KKeypivDqDCW2hdx8UqsRI3NneBZ3_Lv2B-fdHR5J_25S9YeLvs0EVfGA=w702-h527-s-no-gm",
    },
    {
        name: "Dr. Poornima Harshal Dhake",
        relation: "Parent of Mst.Advik Harshal Dhake",
        grade: "Grade 2",
        quote: "What I liked the most about our Omkar school is they emphasize a lot about celebrations of various cultural activities. It is very important for our kids to learn about our cultural heritage. Teachers always focus on multiple revisions and individual attention to kids.",
        imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczO1ii6OjZLk9bnV-94L0-O5tL_FhFWE59a-roUlNHYq8b8uBuNNz1wDmArAVjwA4oGyFZ86kRwYmtVJbnZbidPCa_bFvU8BwHhQe0AN5LLcssAsR7s08c0J4EjvPo3-ChHlfvALVLUvJX_XTWEC0zeDww=w702-h678-s-no-gm",
    },
    {
        name: "Mrs. Jeenal Sujit Meisheri",
        relation: "Parent of Nirved Meisheri",
        grade: "Grade 2",
        quote: "This comprehensive approach nurtures well rounded individuals fostering creativity, emotional intelligence and a deep appreciation for the world around them. We are really grateful to be a part of this renowned institution which offers a remarkable educational journey.",
        imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczOUhL6GyKsUycK9tiExBr222czgB6WLPxUBDZqmeacFc3-2gkqctqkoWQtNngvxJDBv3kQ5VOco5OaSU71Ponhct6cW8O2lwoX7gcYQk3tsiFPZgdM1J30otmtzTpRT1LOkDXGhEu34EWOjYhvQ5DVVrA=w702-h468-s-no-gm",
    },
    {
        name: "Mrs. Ankita Bharambay",
        relation: "Parent of Aarav & Reyansh Bharambay",
        grade: "Grade 3 & Mont III",
        quote: "It was the best decision we have taken for our child’s education and over-all development. The school has provided our kids with a structured and positive environment. The teachers are knowledgeable and they encourage children to step out of their comfort zone.",
        imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczNewNZ7t8ecMLjmrB0fQJYCBeB61xFiFJc8Ag0HnNDhJB5Bau0Xl57uK3xr__maD-R9KUTrSB0QoXYo5douJNNdNWA6uGBn00I7_Zr0kWlgEhwwLexhwdP4J7LpRMufrL6l3ynZ5yqGnNP9qfQYlj7BPw=w585-h913-s-no-gm",
    },
    {
        name: "Mr. Sandeep Menon",
        relation: "Parent of Mrs. Sanav S Menon",
        grade: "Grade 4",
        quote: "We are so happy and feel blessed that our son studies in one of the most prestigious and esteemed schools in Dombivli city... The teachers here are very dedicated and focuses on each and every kid in the class. For us school is more than an educational institution; it is like a second family.",
        imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczOdlK6n4qyOR3qwMsoJ2ZrxA6Ec5_DO5BW9IxecEZGR741cUJmmq07sci23haYKhJOd3qPJZ3mU_u6AyQSa1ykOCv6UqEco1CFc9tFSPKuTVLDfpiJLJ-9RriFjhQK2dlLbqw4O1N7A2x3RVq1t5OKK2g=w702-h471-s-no-gm",
    },
    {
        name: "Dr.Vijay & Dr.Vijetha Chinchole",
        relation: "Parent of Ishaan Chinchole",
        grade: "Grade 5",
        quote: "I have seen improvement, development, and progress in my son’s overall schooling. He has participated in many competitions which has made him confident. We were worried about his studies, but it gets completed within his school timing itself through repetition.",
        imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczMigrnpeJDPy5XDa9eLDYwoD_msMp48So9xe1CN0E67Y7MQ6ZvpL_v021n9m-b5FTeOS2HpHSnx76G4qt_PO4ITKpqFqKYLw9EOEuMvr-RRzSn870hj_oA5x8OqcDdomqD-qXXW1zSjgXiDGogEeSvsmg=w203-h203-s-no-gm",
    },
    {
        name: "Mona Vaibhav Rumde",
        relation: "Parent of Vivaan Vaibhav Rumde",
        grade: "Grade 6",
        quote: "Omkar International School provides the requisite infrastructure and a comprehensive curriculum along with a team of proficient teachers. These were the exact attributes we were looking for... The accolades and achievements of the school truly manifest that they are definitely preparing each child to step into a brighter future.",
        imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczMhx9SIGm5pmr6XF8cxP6O2eOnnmfKKXkHU1dNzQW7wZvMYhwDQGo2cW7-KW1gwLBKPS6jXqXyPEiKincLQI2MCt9LkL7rUtNKDpxgtgiNfZ5_tjUJ2M0l1qFV8VF-v5zx7ysQtmcWmprqlA7bYQZVALw=w251-h179-s-no-gm",
    },
    {
        name: "Antaryami Padhiari",
        relation: "Parent of Smriti Padhiari",
        grade: "Grade 7",
        quote: "Omkar International School is an outstanding educational institution that offers an exceptional learning experience to students. The school has received high praise from both its students and parents. The faculty is highly experienced and qualified, dedicated to providing a world-class education.",
        imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczNEQSI4oM2cN54j2mnlIPjwXLI_iR1v5vnAUdHE734d0pRDK1CA2WRNW6R2vw0ZOtpAgYpIqrFZWGGKknUNrQ6FDBLpM5zFczZ8W7-8NZVzeGgLoAAExVsQuxfC9xJ8prwa_DjvOAVLq7voh8kRw3QckQ=w211-h159-s-no-gm",
    },
    {
        name: "Dr.Gauri Mahajan",
        relation: "Parent of Meera Mahajan",
        grade: "Grade 10",
        quote: "School is the second home for a child. According to me, OMKAR INTERNATIONAL SCHOOL, is the best school my daughter could have been in. It not only gives the best education, but provides the best environment for the overall development of a child.",
        imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczOYP-GMk3-Ln65H9zgoPR4BumMhmcu3rGbKBhnHuJ38PQ8HQeXk6xHlyMvuSgXTrB4q4JFjZ76uWzjoGxjwRUf7_5YZqm3jAr2esUNWZJTVRDsST-Z3e_Wui1QExm-Q5K-pDa0MdwQioohp-_G5vb1O0w=w702-h468-s-no-gm",
    },
    {
        name: "Parent of Manasvi Datar",
        relation: "Parent of Manasvi Datar",
        grade: "Grade 10",
        quote: "We have watched Manasvi grow from a pre-schooler to a teenager in Omkar International School. The school has helped in shaping her talents not just academically but also in dance and cultural activities. Thank you Omkar International School.",
        imageUrl: "https://www.omkaricse.in/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-25-at-3.37.37-PM.jpeg",
    },
];

const TestimonialCard: React.FC<{ testimonial: Testimonial; imageLeft?: boolean }> = ({ testimonial, imageLeft = false }) => (
    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        <img 
            src={testimonial.imageUrl} 
            alt={testimonial.name} 
            className={`w-full md:w-1/3 h-64 md:h-auto object-cover ${imageLeft ? 'md:order-first' : 'md:order-last'}`} 
        />
        <div className={`p-8 flex flex-col justify-center relative md:w-2/3 ${imageLeft ? 'md:order-last' : 'md:order-first'}`}>
            <div className="absolute top-6 left-8 text-7xl text-slate-200/50 dark:text-slate-700/50 font-serif z-0">“</div>
            <blockquote className="text-slate-600 dark:text-slate-300 italic mb-4 z-10 relative text-lg">
                {testimonial.quote}
            </blockquote>
            <cite className="not-italic text-right mt-4 z-10 relative">
                <p className="font-bold text-slate-800 dark:text-white text-lg">{testimonial.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.relation} ({testimonial.grade})</p>
            </cite>
        </div>
    </div>
);


const TestimonialsPage: React.FC = () => {
  return (
    <div>
      <PageSEO 
        title="Testimonials - Omkar International School | Best School in Dombivli"
        description="Read what parents and learners say about their experience at Omkar International School. See why we are considered the best school in Dombivli."
      />
      <PageHeader 
        title="Testimonials" 
        subtitle="Reviews from our Parents & Learners"
      />
      <div className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <div className="space-y-16">
            {testimonials.map((testimonial, index) => (
               <AnimateOnScroll 
                  key={index} 
                  animation={index % 2 === 0 ? 'slide-in-from-left' : 'slide-in-from-right'}
                  threshold={0.2}
                >
                  <TestimonialCard testimonial={testimonial} imageLeft={index % 2 === 0} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;