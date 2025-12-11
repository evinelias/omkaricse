

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
  "/images/hero-1.jpg",
  "/images/hero-2.jpg",
  "/images/hero-3.jpg",
  "/images/hero-4.jpg",
  "/images/hero-5.jpg",
  "/images/hero-6.jpg",
  "/images/hero-7.jpg",
  "/images/hero-8.jpg",
  "/images/hero-9.jpg",
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