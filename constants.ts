

// FIX: Import React to resolve 'React' namespace error.
import React from 'react';
import { Landmark, UserCircle, Goal, Baby, GraduationCap, School, Library, Building, Trophy, FileText, Users, Sparkles, Briefcase } from 'lucide-react';

export interface NavLink {
  name: string;
  path?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  subMenu?: NavLink[];
}

export const NAV_LINKS: NavLink[] = [
  { name: 'Home', path: '/' },
  { 
    name: 'About Us', 
    subMenu: [
      { 
        name: 'Founder Trustee', 
        path: '/about/founder-trustee',
        description: "Meet the visionary behind our institution.",
        icon: Landmark
      },
      { 
        name: 'Principal', 
        path: '/about/principal',
        description: "A message from our school's leader.",
        icon: UserCircle
      },
      { 
        name: 'Mission & Vision', 
        path: '/about/mission-vision',
        description: "The principles that guide our journey.",
        icon: Goal
      },
    ]
  },
  { 
    name: 'Academics',
    subMenu: [
      { 
        name: 'Foundational Years', 
        path: '/academics/foundational-years',
        description: "Nurturing the youngest minds for a bright start.",
        icon: Baby
      },
      { 
        name: 'Primary School', 
        path: '/academics/primary',
        description: "Building strong foundations for future learning.",
        icon: GraduationCap
      },
      { 
        name: 'Middle School', 
        path: '/academics/middle-school',
        description: "Fostering critical thinking and exploration.",
        icon: School
      },
      { 
        name: 'Secondary School', 
        path: '/academics/secondary',
        description: "Preparing students for board examinations.",
        icon: Library
      },
      { 
        name: 'ISC (Grade 11 & 12)', 
        path: '/academics/isc',
        description: "Advanced programs for higher secondary students.",
        icon: Library
      },
      { 
        name: 'Cocurricular & Extracurricular', 
        path: '/academics/cocurricular-extracurricular',
        description: "Activities beyond the classroom for holistic growth.",
        icon: Sparkles
      },
    ]
  },
  {
    name: 'More',
    subMenu: [
      { 
        name: 'Admission Process', 
        path: '/admission',
        description: "Your guide to becoming part of our family.",
        icon: FileText
      },
      { 
        name: 'Infrastructure & Facilities', 
        path: '/infrastructure',
        description: "Explore our state-of-the-art campus.",
        icon: Building
      },
      { 
        name: 'Awards & Achievements', 
        path: '/awards',
        description: "Celebrating the success of our students.",
        icon: Trophy
      },
      {
        name: 'Alumni Network',
        path: '/alumni',
        description: "Our pride, our legacy. See where they are now.",
        icon: Briefcase
      },
      { 
        name: 'Testimonials', 
        path: '/testimonials',
        description: "Hear what our parents and learners say.",
        icon: Users
      },
    ]
  },
  { name: 'Contact Us', path: '/contact' },
];

export const HERO_BACKGROUND_IMAGES = [
  "https://lh3.googleusercontent.com/pw/AP1GczNsoul585yfLdNLiET016DDBQj5wXZYYH2wXybYFYmlkz2Jdt9U5eTxKr0bC_xxqmVQWUr0mdYxVwu78mYSN-j9mXe0oT_nphhewV-ygGLfhPz9RfNbO6jPxApwMcpVPJrQ4Wfs3vhYtAtA6Ovbr9ds=w1386-h924-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPv0vouTdxMrvNGzpzLyaowLgT_fZ1Mqca6szYXmrfqDJTTrIrx6OKXukM2o1MaI-QEGsknTY3zrphaNRoZe-UKolwwWTPyvF0tmqiBm9NxY9ees5xS1PjF4UeIqJeAgGoLhHo4Ftdq9OmPkApW33uT=w1386-h924-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPZvMKsyIQy3xyUazciNEKqk2amLL8P8G4rXMQBP5ZQsAOku0pzSBSXMTuTjQmHkqfVajPodK2kF7nkCtXUxxYq9gYdabTOEgHCLLoQHkfxpqvLa70PJE0JlADY42JX8rPznVxQzN_pV7R9gqbTum9i=w1386-h924-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMO3KlFmNBIRGhBiTZQLKqTB5e92T_1-W1dFH9V__pvf2Kv6D793qFaDjMZ-XhCRzjHqFc633tKwT2LKfPfgCVgKmY3lNsdNxQDJcpzDIMeH5Z3BR9afrO1NXc59Hf8403ejBBQ9ydmQAvSIhOS_nXQ=w1386-h924-s-no-gm?authuser=1",
  "https://lh3.googleusercontent.com/pw/AP1GczPX1KuRWwRdgGrElv3xr337AjE4xc61C_SuXewjazBqk2tpjj4kQA_uG6jgrMCHqp1E081s5lWxyWWTBqicjMW_VBP9QJ5avZ0iIFVGvWawRR7PxRfdb3X9XR_a0z6_m1yivKoyHPkUbbAckai9hFbI=w1386-h924-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOqckKV5E-1gr3ELDvZC0rV6ki0qcRuMpDdCLKxLvDE5wVs1jSI3YE4JIaaQrZOcBvVsKFOUoWBGDICdrTRUcxxVpwnUMVGJ89sFHGyEeA6n6LK94WPf8hS5qLuPxBpMlzLdxeVQ6fFT1I9XlIUrn7N=w1386-h924-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNYyxLNcLqV7GQGEJZvGxbaIr7hxlem4CDkxmqAfa-eC7IEgHNsVqHxGLoFabpli7CUPYy_0nmpk273kOSWCm5MJ15HhRHy8e8n6yEWKIifxoy7UldCDBadau7smHS1ELF7iO4e6dPZ-eTyvvXrdwCe=w1386-h924-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczM5qxTGl5wsfz2TuTq-aLD6cbYWlbTuA4zIemunwSF94IK1Ebu9bt1Hpj4iFz4drHD2aKRGnccaIawZKCQ0twZBAXivEaFAi1xOYvm6FvTuZoThpl6uykaQDXRoElqEllsuTbFokfEpGEF95e2eyrcB=w1386-h924-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPepFaEBbclfqaToKwOcGEgc07ceHNaTrJVlGM3O0GQB6yHP-YkBkN_VSH6HR_aoyxjgVHQ8D2K_oX6g2EQ8lcnfHjH1xK2HL8DDqHGaTwaJt61ffkgUW0IGcYVwtmUKjtN_a8eTgRnHdp1q5nGXbZx=w1386-h924-s-no-gm?authuser=0",
];

export const HERO_SLIDES = [
  {
    imageUrl: HERO_BACKGROUND_IMAGES[0],
    quote: "Igniting Minds, Shaping Futures.",
    subQuote: "Your child's journey to excellence begins here."
  },
  {
    imageUrl: HERO_BACKGROUND_IMAGES[1],
    quote: "Fostering the Leaders of Tomorrow, Today.",
    subQuote: "Our curriculum builds character, confidence, and vision."
  },
  {
    imageUrl: HERO_BACKGROUND_IMAGES[2],
    quote: "More Than Education, It's an Investment in Their Future.",
    subQuote: "We provide the tools for lifelong success."
  },
  {
    imageUrl: HERO_BACKGROUND_IMAGES[3],
    quote: "A Nurturing Environment for Curiosity to Flourish.",
    subQuote: "A safe, supportive space for students to explore and grow."
  },
  {
    imageUrl: HERO_BACKGROUND_IMAGES[4],
    quote: "Excellence Through Endeavour: Our Mission in Action.",
    subQuote: "We inspire a lifelong passion for achievement in every field."
  },
  {
    imageUrl: HERO_BACKGROUND_IMAGES[5],
    quote: "State-of-the-Art Facilities for a World-Class Education.",
    subQuote: "Modern labs, digital classrooms, and expansive play areas await."
  },
  {
    imageUrl: HERO_BACKGROUND_IMAGES[6],
    quote: "Shaping Mind, Body, and Soul for Holistic Development.",
    subQuote: "Our vision is to develop well-rounded, capable individuals."
  },
  {
    imageUrl: HERO_BACKGROUND_IMAGES[7],
    quote: "From Foundational Years to Future Ready.",
    subQuote: "A complete academic journey from Montessori to ISC."
  },
  {
    imageUrl: HERO_BACKGROUND_IMAGES[8],
    quote: "Become a part of the proud Omkar family.",
    subQuote: "Discover a community that celebrates every student."
  },
];