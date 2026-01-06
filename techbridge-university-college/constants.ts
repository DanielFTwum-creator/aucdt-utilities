
import { NavItem, SlideData, ProgrammeCardData, FacultyMember } from './types.ts';

export const ADMIN_CONFIG = {
  password: process.env.ADMIN_PASSWORD || 'admin123',
  maxLoginAttempts: 3,
  lockoutTimeMs: 30000,
};

export const LOGO_URL = "https://aucdt.edu.gh/tuc/TECHBRIDGE-UNIVERSITY-COLLEGE-LOGO-02012026-2114.png";

export const SOCIAL_LINKS = {
  facebook: 'https://web.facebook.com/aucdtedugh?_rdc=1&_rdr',
  twitter: 'https://twitter.com/aucdtedugh',
  instagram: 'https://www.instagram.com/aucdtedugh/',
  tiktok: 'https://www.tiktok.com/@aucdt.edu.gh',
  linkedin: 'https://www.linkedin.com/company/aucdtedugh',
  youtube: 'https://www.youtube.com/channel/UC7ih9u2yzUyj1_KnYZnHnmw'
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#/' },
  { 
    label: 'About TUC', 
    href: '#/about/story',
    children: [
      { label: 'Our Story', href: '#/about/story' },
      { label: 'Leadership', href: '#/about/leadership' },
      { label: 'Vision & Mission', href: '#/about/vision' },
      { label: 'The Rebrand', href: '#/about/rebrand' },
      { label: 'Governing Council', href: '#/about/council' },
      { label: 'Accreditation', href: '#/about/accreditation' },
    ]
  },
  { 
    label: 'Academics', 
    href: '#/academics',
    children: [
      { label: 'Academics Overview', href: '#/academics' },
      { label: 'Faculty', href: '#/academics/faculty' },
      { label: 'Students', href: '#/academics/students' },
      { label: 'Academic Calendar', href: '#/academics/calendar' },
      { label: 'Timetable', href: '#/academics/timetable' },
      { label: 'AUCDT LMS', href: 'https://portal.aucdt.edu.gh/admissions/#/home' }
    ]
  },
  { label: 'Admissions', href: 'https://portal.aucdt.edu.gh/admissions/#/home' },
  { label: 'Research', href: '#/research' },
  { label: 'News', href: '#/news-feed' },
];

export const FACULTY_DATA: FacultyMember[] = [
  {
    id: 'f1',
    name: 'Dr. Andrew R. O. Addo',
    slug: 'andrew-richard-owusu-addo',
    title: 'Head of Department',
    department: 'Jewellery Design',
    image: 'https://picsum.photos/400/500?random=1',
    email: 'a.owusuaddo@tuc.edu.gh',
    education: ['Ph.D. Jewellery Tech', 'M.Tech Jewellery Design', 'B.A. Fine Art'],
    bio: 'Dr. Addo leads our Jewellery Design department with a focus on industrial engineering and precision manufacturing in the luxury goods sector.'
  },
  {
    id: 'f2',
    name: 'Selete K. D. Ofori',
    slug: 'selete-k-d-ofori',
    title: 'Lecturer',
    department: 'Jewellery Design',
    image: 'https://picsum.photos/400/500?random=2',
    email: 's.ofori@tuc.edu.gh',
    education: ['M.A. Design', 'B.A. Metal Art'],
    bio: 'Specialising in contemporary metal arts and gemstone settings, Selete bridges traditional craftsmanship with modern design aesthetics.'
  },
  {
    id: 'f3',
    name: 'Kwame Baah Owusu Panin',
    slug: 'kwame-baah-owusu-panin',
    title: 'Lecturer',
    department: 'Jewellery Design',
    image: 'https://picsum.photos/400/500?random=3',
    email: 'k.panin@tuc.edu.gh',
    education: ['M.Phil Design', 'B.Tech Jewellery'],
    bio: 'An expert in manufacturing processes and industrial design for high-end jewellery collections.'
  },
  {
    id: 'f4',
    name: 'Kwabena Asomaning',
    slug: 'kwabena-asomaning',
    title: 'Lecturer',
    department: 'Jewellery Design',
    image: 'https://picsum.photos/400/500?random=4',
    email: 'k.asomaning@tuc.edu.gh',
    education: ['M.Sc. Engineering', 'B.A. Design'],
    bio: 'Researches materials engineering in the context of precious metals and alloy development for industrial applications.'
  },
  {
    id: 'f5',
    name: 'Robert Bunkangsang Buchag',
    slug: 'robert-bunkangsang-buchag',
    title: 'Head of Department',
    department: 'Digital Media',
    image: 'https://picsum.photos/400/500?random=5',
    email: 'r.buchag@tuc.edu.gh',
    education: ['M.Phil Communication', 'B.F.A. Media'],
    bio: 'Leading the DMCD department towards interactive storytelling and disruptive digital communication strategies.'
  },
  {
    id: 'f6',
    name: 'Samuel Nii Lante Wellington',
    slug: 'samuel-nii-lante-wellington',
    title: 'Technical Instructor',
    department: 'Digital Media',
    image: 'https://picsum.photos/400/500?random=6',
    email: 's.wellington@tuc.edu.gh',
    education: ['M.A. Arts', 'B.Sc. IT'],
    bio: 'Specialist in cinematography and digital image processing with deep industry roots in Ghanaian media.'
  },
  {
    id: 'f7',
    name: 'Selasi Ahiabu',
    slug: 'selasi-ahiabu',
    title: 'Technical Instructor',
    department: 'Digital Media',
    image: 'https://picsum.photos/400/500?random=7',
    email: 's.ahiabu@tuc.edu.gh',
    education: ['M.Sc. Software Engineering', 'B.Sc. Computer Science'],
    bio: 'Focuses on the technical backend of digital media, including streaming technologies and UX architectures.'
  },
  {
    id: 'f8',
    name: 'Bright Senanu Agbosu',
    slug: 'bright-senanu-agbosu',
    title: 'Lecturer',
    department: 'Digital Media',
    image: 'https://picsum.photos/400/500?random=8',
    email: 'b.agbosu@tuc.edu.gh',
    education: ['M.A. Media Arts'],
    bio: 'Instructional media designer focused on high-fidelity motion graphics and animation for commercial sectors.'
  },
  {
    id: 'f9',
    name: 'Aaron Adjacodjoe',
    slug: 'aaron-adjacodjoe',
    title: 'Head of Department',
    department: 'Product Design',
    image: 'https://picsum.photos/400/500?random=9',
    email: 'a.adjacodjoe@tuc.edu.gh',
    education: ['Ph.D. Visual Communication', 'M.A. Design'],
    bio: 'Leading innovations in product lifecycle management and human-centric design frameworks.'
  },
  {
    id: 'f10',
    name: 'William Daitey',
    slug: 'william-daitey',
    title: 'Lecturer',
    department: 'Product Design',
    image: 'https://picsum.photos/400/500?random=10',
    email: 'w.daitey@tuc.edu.gh',
    education: ['M.A. Communications'],
    bio: 'Expert in professional ethics and industrial relations within the design sector.'
  },
  {
    id: 'f11',
    name: 'Agyenim Boateng',
    slug: 'agyenim-boateng',
    title: 'Part-Time Lecturer',
    department: 'Product Design',
    image: 'https://picsum.photos/400/500?random=11',
    email: 'a.boateng@tuc.edu.gh',
    education: ['M.Sc. IT'],
    bio: 'Specialist in 3D modeling and additive manufacturing for product prototyping.'
  }
];

export const HERO_SLIDES: SlideData[] = [
  {
    id: 1,
    title: "Design and Build a Nation!",
    subtitle: "Pioneering the Future of Industrial Education",
    image: "https://aucdt.edu.gh/wp-content/uploads/2023/04/Banner-A.jpg",
    video: "https://aucdt.edu.gh/videos/aucdt_video_backgrond.mp4",
    ctaLink: "https://portal.aucdt.edu.gh/admissions/#/home",
    ctaText: "Apply for 2026"
  },
  {
    id: 2,
    title: "Creative Intelligence",
    subtitle: "Where Design Thinking Meets Technical Mastery",
    image: "https://aucdt.edu.gh/wp-content/uploads/2023/04/Banner-B.jpg",
    ctaLink: "#/academics",
    ctaText: "View Programmes"
  }
];

export const PROGRAMMES: ProgrammeCardData[] = [
  {
    id: 1,
    title: "Digital Media & Communication",
    description: "Master the art of interactive storytelling and disruptive digital communication strategies in a rapidly evolving landscape.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2023/04/Digital-Media-and-Communication-Design-Banner.jpg",
    badge: "B.Tech DMCD",
    link: "#/academics"
  },
  {
    id: 2,
    title: "Product Design & Entrepreneurship",
    description: "Bridge the gap between creativity and commerce. Learn to design products that solve real-world problems and lead ventures.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2023/04/Product-Design-and-Entrepreneurship.jpg",
    badge: "B.A. PDE",
    link: "#/academics"
  },
  {
    id: 3,
    title: "Fashion Design Technology",
    description: "Innovate the fashion industry through technical excellence, sustainable practices, and creative leadership.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2022/06/aucdt-fashion3.jpg",
    badge: "B.Tech FDT",
    link: "#/academics"
  },
  {
    id: 4,
    title: "Jewellery Design Technology",
    description: "Precision manufacturing meets luxury design. Become a master of precious metal arts and contemporary adornment.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2021/04/Jewellery-Design-Technology.jpg",
    badge: "B.A. JDT",
    link: "#/academics"
  }
];
