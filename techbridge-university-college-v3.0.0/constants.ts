import { NavItem, SlideData, ProgrammeCardData, FacultyMember, NewsItem } from './types.ts';

export const COLOR_TOKENS = {
  primary: '#1A5C38',      // Deep Forest
  primaryDark: '#0F3D24',  // Midnight Forest
  primaryLight: '#E8F5EE', // Leaf Mist
  accent: '#D4A017',       // Kente Gold
  bg: '#F5F3EE',           // Warm Ivory
  text: '#1C1C1A',         // Charcoal
  textMuted: '#5F5E5A',    // Stone
  border: '#D3D1C7',       // Linen
  maroon: '#630F12',       // Institutional Maroon
  ink: '#1A1209',          // Deep Ink
  cream: '#F5F0E8',        // Editorial Cream
  silver: '#8A8A8A',       // Subdued Metadata
};

export const ADMIN_CONFIG = {
  password: process.env.ADMIN_PASSWORD || 'admin123',
  maxLoginAttempts: 3,
  lockoutTimeMs: 30000,
};

export const LOGO_URL = "https://techbridge.edu.gh/static/TUC_LOGO_1.png";

export const SOCIAL_LINKS = {
  facebook: 'https://web.facebook.com/aucdtedugh?_rdc=1&_rdr',
  twitter: 'https://twitter.com/aucdtedugh',
  instagram: 'https://www.instagram.com/aucdtedugh/',
  tiktok: 'https://www.tiktok.com/@aucdt.edu.gh',
  linkedin: 'https://www.linkedin.com/company/aucdtedugh',
  youtube: 'https://www.youtube.com/channel/UC7ih9u2yzUyj1_KnYZnHnmw'
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', labelKey: 'nav.home_label', href: '/' },
  {
    label: 'About TUC',
    labelKey: 'nav.about_label',
    href: '/about/message',
    children: [
      { label: 'Message from the President', labelKey: 'nav.message_president', href: '/about/message' },
      { label: 'Our Story', labelKey: 'nav.our_story', href: '/about/story' },
      { label: 'Leadership', labelKey: 'nav.leadership', href: '/about/leadership' },
      { label: 'Vision & Mission', labelKey: 'nav.vision_mission', href: '/about/vision' },
      { label: 'Governing Council', labelKey: 'nav.governing_council', href: '/about/council' },
    ]
  },
  {
    label: 'Academics',
    labelKey: 'nav.academics_label',
    href: '/academics',
    children: [
      { label: 'Academics Overview', labelKey: 'nav.academics_overview', href: '/academics' },
      { label: 'Faculty', labelKey: 'nav.faculty', href: '/academics/faculty' },
      { label: 'Academic Calendar', labelKey: 'nav.academic_calendar', href: '/academics/calendar' },
      { label: 'Timetable', labelKey: 'nav.timetable', href: '/academics/timetable' },
      { label: 'AUCDT LMS', labelKey: 'nav.lms', href: 'https://portal.aucdt.edu.gh/admissions/#/home' }
    ]
  },
  { label: 'Admissions', labelKey: 'nav.admissions_label', href: 'https://portal.aucdt.edu.gh/admissions/#/home' },
  {
    label: 'Newsroom',
    labelKey: 'nav.newsroom_label',
    href: '/news-feed',
    children: [
      { label: 'Newsfeed', labelKey: 'nav.newsfeed', href: '/news-feed' },
      { label: 'Resources', labelKey: 'nav.resources_label', href: '/resources' },
    ]
  },
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 101,
    title: "Techbridge Wins Fashion School of the Year 2025!",
    date: "December 12, 2025",
    excerpt: "TUC secures the ultimate accolade at the Ghana Tertiary Fashion Awards, with Ms. Victoria Honu named Fashion Educator of the Year.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/01/Innovative-Fashion-School-of-the-Year-2024.jpg",
    category: "Major Achievement",
    link: "https://aucdt.edu.gh/newsroom/"
  },
  {
    id: 247911,
    title: "AUCDT National Service Recruitment 2025/2026",
    date: "Aug 25, 2025",
    excerpt: "AsanSka University College of Design and Technology is recruiting for National Service Personnel for the 2025/2026 service year. Join us to build your career in Marketing, Administration & IT.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/08/AUCDT-National-Service-Recruitment-400x250.jpeg",
    category: "Recruitment",
    link: "https://aucdt.edu.gh/aucdt-national-service-recruitment-2025-2026/"
  },
  {
    id: 247861,
    title: "AUCDT Opens Admissions for 2025/26 Academic Year",
    date: "May 26, 2025",
    excerpt: "Admissions are now open for the 2025/2026 academic year. Apply now to join the premier design technology university in Ghana. Offering BTech and BA programmes.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/05/AUCDT-Opens-Admission-400x250.jpeg",
    category: "Admissions",
    link: "https://aucdt.edu.gh/aucdt-opens-admissions-for-2025-26-academic-year/"
  },
  {
    id: 247778,
    title: "AUCDT Launches New Learning Management System",
    date: "Mar 4, 2025",
    excerpt: "A significant step forward in enhancing digital learning and teaching experiences with the new LMS built on the Moodle framework, providing a flexible and interactive environment.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/03/Agbosu-presenting-at-the-AUCDT-LMS-400x250.webp",
    category: "Technology",
    link: "https://aucdt.edu.gh/aucdt-launches-new-learning-management-system/"
  },
  {
    id: 248001,
    title: "Estate Officer Position Available",
    date: "Apr 2025",
    excerpt: "AsanSka University College of Design and Technology is in search of a qualified professional to fill the role of Estate Officer to manage campus facilities.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/04/estate-officer-1080x675.jpg",
    category: "Job Opening",
    link: "https://aucdt.edu.gh/estate-officer/"
  },
  {
    id: 248002,
    title: "Library Assistant Position",
    date: "Apr 2025",
    excerpt: "We are seeking a dedicated and detail-oriented Library Assistant to support the effective operation of our academic library and student research.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/04/library-assistant-1080x675.jpg",
    category: "Job Opening",
    link: "https://aucdt.edu.gh/library-assistant-position/"
  },
  {
    id: 248003,
    title: "AUCDT on Blackboard: A Conversation with AI",
    date: "Feb 2025",
    excerpt: "Exploring the integration of Artificial Intelligence in modern education systems and the future of digital learning platforms at TUC.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/02/AUCDT-on-Blackboard-1080x675.jpg",
    category: "Technology",
    link: "https://aucdt.edu.gh/aucdt-on-blackboard-a-conversation-with-ai/"
  },
  {
    id: 248004,
    title: "Building a Better RAG: The DeepSeek Blueprint",
    date: "Feb 2025",
    excerpt: "A technical deep dive into Retrieval-Augmented Generation and how DeepSeek architectures are influencing our AI curriculum.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/02/building-a-responseive-RAG-1080x675.jpg",
    category: "Research",
    link: "https://aucdt.edu.gh/building-a-better-rag-the-deepseek-blueprint/"
  },
  {
    id: 247584,
    title: "AsanSka University College Wins Innovative Fashion School of the Year!",
    date: "Jan 7, 2025",
    excerpt: "The Fashion Design Technology Department has been honoured as the Innovative Fashion School of the Year at the prestigious Ghana Tertiary Fashion Awards.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/01/Innovative-Fashion-School-of-the-Year-Website-400x250.jpg",
    category: "Achievement",
    link: "https://aucdt.edu.gh/asanska-university-college-wins-innovative-fashion-school-of-the-year/"
  },
  {
    id: 247577,
    title: "Akosua Osei Sasu wins the National Jewellery Competition Award",
    date: "Jan 7, 2025",
    excerpt: "Celebrating the exceptional talent of our Jewellery Design student, Akosua Osei Sasu, for winning the top national prize.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/01/Akosua-Sasu-Award-Website-400x250.jpg",
    category: "Student Success",
    link: "https://aucdt.edu.gh/akosua-osei-sasu-wins-the-national-jewellery-competition-award/"
  },
  {
    id: 248005,
    title: "Administrative Officer",
    date: "Jan 2025",
    excerpt: "Administrative Officer role available for AUCDT TVET Programme. Join our administrative team to support vocational training excellence.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/01/administrative-officer-1080x675.jpg",
    category: "Job Opening",
    link: "https://aucdt.edu.gh/administrative-officer/"
  },
  {
    id: 248006,
    title: "Dean of Academic Affairs",
    date: "Jan 2025",
    excerpt: "Leadership position open for Dean of Academic Affairs to oversee curriculum development and academic standards.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/01/dean-of-academic-affairs-1080x675.jpg",
    category: "Job Opening",
    link: "https://aucdt.edu.gh/dean-of-academic-affairs/"
  },
  {
    id: 247557,
    title: "Nurudeen Issah: Student Fashion Designer of the Year 2024",
    date: "Dec 2, 2024",
    excerpt: "We are happy to announce that our very own Nurudeen Issah has been awarded Student Fashion Designer of the Year 2024.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2024/12/Issah-Nurudeen-Student-Fashion-Designer-of-the-Year-2024-Website-400x250.jpg",
    category: "Student Success",
    link: "https://aucdt.edu.gh/nurudeen-issah-student-fashion-designer-of-the-year-2024/"
  }
];

export const COUNCIL_DATA = [
  {
    name: 'Prof. Rudith King',
    role: 'Chairperson of Governing Council',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2020/01/Prof-Rudith-King.jpg'
  },
  {
    name: 'Prof. Daniel Obeng-Ofori',
    role: 'Vice-Chair of Governing Council',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2020/08/Prof-Obeng.jpg'
  },
  {
    name: 'Dr. Emmanuel A. Asante',
    role: 'President',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2022/07/Prof-Asante-Cream-bg.jpg'
  },
  {
    name: 'Dr. Joseph A. A. Sackey',
    role: 'Vice President',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2024/12/Dr-J-A-A-Sackey-Profile-Picture.jpg'
  },
  {
    name: 'Dr. Patrique de Graft-Yankson',
    role: 'Member (UEW Representative)',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2020/01/DeGraft.jpg'
  },
  {
    name: 'Ms. Doris A. Bramson',
    role: 'Member',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2020/01/Doris-Bramson.jpg'
  },
  {
    name: 'Dr. Kafui K. Agyeman',
    role: 'Member',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2020/01/Dr-Agyeman.jpg'
  },
  {
    name: 'Mr. Emmanuel Botwe',
    role: 'Member',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2020/01/Mr-Emmanuel-Botwe.jpg'
  },
  {
    name: 'Dr. Andrew Richard Owusu Addo',
    role: 'Member',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2021/07/Dr-Andrew-R-O-Addo-1.jpg'
  },
  {
    name: 'Mr. Daniel Twum',
    role: 'Head of Department, ICT',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2022/03/Daniel-Twum.jpg'
  },
  {
    name: 'Mr. Thomas Owusu',
    role: 'Senior and Junior Member Representative',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgMUbstva1ZUl2W6VKZpqc219rOkfcNyBe5A&s'
  },
  {
    name: 'Mr. Daniel Yesueflem Adzande',
    role: 'Student Representative',
    image: 'https://scontent.facc6-1.fna.fbcdn.net/v/t39.30808-6/516078572_1304975058299438_2324766102852693068_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=mG-ipsoFkp4Q7kNvwGP2iRV&_nc_oc=AdmQOjnzgfB4f20hySTk628BjAFWgNcTmTgCnWZD8nuuGgNlgsmwWCD64izkrxpvWS0&_nc_zt=23&_nc_ht=scontent.facc6-1.fna&_nc_gid=YQG5iH1iVZLGaZmRwZexuA&oh=00_AfvMhRPzbnwIBbc4kqEdmVrycozfDFxBC1_85cH43Az7Xg&oe=69969147'
  }
];

export const FACULTY_DATA: FacultyMember[] = [
  {
    id: 'f1',
    name: 'Dr. Andrew R. O. Addo',
    slug: 'andrew-richard-owusu-addo',
    title: 'Head of Department',
    department: 'Jewellery Design',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2021/07/Dr-Andrew-R-O-Addo-1.jpg',
    email: 'a.owusuaddo@tuc.edu.gh',
    education: ['Ph.D. Jewellery Tech', 'M.Tech Jewellery Design', 'B.A. Fine Art'],
    researchInterests: ['Industrial Casting', 'Gemology', 'Precious Metal Alloys', 'Jewellery Fabrication History'],
    bio: 'Dr. Addo leads our Jewellery Design department with a focus on industrial engineering and precision manufacturing in the luxury goods sector.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/andrew-richard-owusu-addo/'
  },
  {
    id: 'f2',
    name: 'Selete K. D. Ofori',
    slug: 'selete-k-d-ofori',
    title: 'Lecturer',
    department: 'Jewellery Design',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2024/03/Mr-Selete-Ofori.jpg',
    email: 's.ofori@tuc.edu.gh',
    education: ['M.A. Design', 'B.A. Metal Art'],
    researchInterests: ['Contemporary Metal Arts', 'Sustainable Jewellery', 'Adinkra Symbolism in Design'],
    bio: 'Specialising in contemporary metal arts and gemstone settings, Selete bridges traditional craftsmanship with modern design aesthetics.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/selete-k-d-ofori/'
  },
  {
    id: 'f3',
    name: 'Dr. Kwame Baah Owusu Panin',
    slug: 'kwame-baah-owusu-panin',
    title: 'Lecturer',
    department: 'Jewellery Design',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2024/03/Kwame-Baah-Owusu-Panin.jpg',
    email: 'k.panin@tuc.edu.gh',
    education: ['M.Phil Design', 'B.Tech Jewellery'],
    researchInterests: ['3D Printing in Jewellery', 'CAD/CAM Technologies', 'Mass Production Systems'],
    bio: 'An expert in manufacturing processes and industrial design for high-end jewellery collections.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/kwame-baah-owusu-panin/'
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
    researchInterests: ['Materials Science', 'Alloy Development', 'Industrial Metallurgy'],
    bio: 'Researches materials engineering in the context of precious metals and alloy development for industrial applications.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/kwabena-asomaning/'
  },
  {
    id: 'f19',
    name: 'Nutifafa Korsi Fiadzormor',
    slug: 'nutifafa-korsi-fiadzormor',
    title: 'Lecturer',
    department: 'Jewellery Design',
    image: 'https://picsum.photos/400/500?random=19',
    email: 'n.fiadzormor@techbridge.edu.gh',
    education: ['M.Tech. Jewellery'],
    researchInterests: ['Gemology', 'Traditional Jewellery', 'Precious Metal Casting'],
    bio: 'Expert in gemology, precious metal casting, and traditional Ghanaian jewellery techniques.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/nutifafa-korsi-fiadzormor/'
  },
  {
    id: 'f5',
    name: 'Robert Bunkangsang Buchag',
    slug: 'robert-bunkangsang-buchag',
    title: 'Head of Department',
    department: 'Digital Media',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2022/03/Robert-Buchag.jpg',
    email: 'robert.buchag@tuc.edu.gh',
    education: ['M.Phil Communication', 'B.F.A. Media'],
    researchInterests: ['Interactive Storytelling', 'Digital Communication Strategies', 'New Media Ethics'],
    bio: 'Leading the DMCD department towards interactive storytelling and disruptive digital communication strategies.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/robert-bunkangsang-buchag/'
  },
  {
    id: 'f6',
    name: 'Samuel Nii Lante Wellington',
    slug: 'samuel-nii-lante-wellington',
    title: 'Lecturer',
    department: 'Digital Media',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2022/02/Samuel-Nii-Lante-Wellington.jpg',
    email: 's.wellington@tuc.edu.gh',
    education: ['M.A. Arts', 'B.Sc. IT'],
    researchInterests: ['Digital Cinematography', 'Visual Effects', 'Film Production Workflows'],
    bio: 'Specialist in cinematography and digital image processing with deep industry roots in Ghanaian media.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/samuel-nii-lante-wellington/'
  },
  {
    id: 'f7',
    name: 'Selasi Ahiabu',
    slug: 'selasi-ahiabu',
    title: 'Lecturer',
    department: 'Digital Media',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2023/03/Selasi-Ahiabu-DMCD.jpg',
    email: 's.ahiabu@tuc.edu.gh',
    education: ['M.Sc. Software Engineering', 'B.Sc. Computer Science'],
    researchInterests: ['UX/UI Design', 'Web Technologies', 'Streaming Architectures'],
    bio: 'Focuses on the technical backend of digital media, including streaming technologies and UX architectures.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/selasi-ahiabu/'
  },
  {
    id: 'f8',
    name: 'Bright Senanu Agbosu',
    slug: 'bright-senanu-agbosu',
    title: 'Lecturer',
    department: 'Digital Media',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2020/11/Bright-Senanu-Agbosu.jpg',
    email: 'b.agbosu@tuc.edu.gh',
    education: ['M.A. Media Arts'],
    researchInterests: ['Motion Graphics', 'Animation', 'Instructional Design'],
    bio: 'Instructional media designer focused on high-fidelity motion graphics and animation for commercial sectors.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/bright-senanu-agbosu/'
  },
  {
    id: 'f16',
    name: 'Michael Obeng',
    slug: 'michael-obeng',
    title: 'Lecturer',
    department: 'Digital Media',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2022/07/Michael.jpg',
    email: 'micheal.obeng@tuc.edu.gh',
    education: ['M.F.A. Sound Design'],
    researchInterests: ['Audio Engineering', 'Acoustic Environments', 'Soundscapes'],
    bio: 'Expert in digital sound engineering, audio post-production, and immersive acoustic environments.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/michael-obeng/'
  },
  {
    id: 'f17',
    name: 'Isaac N. Ofori',
    slug: 'isaac-ofori',
    title: 'Technical Instructor',
    department: 'Digital Media',
    image: 'https://techbridge.edu.gh/static/staff/isaac_ofori.jpg',
    email: 'isaac.ofori@techbridge.edu.gh',
    education: ['M.Sc. Industrial Design'],
    researchInterests: ['Multimedia Production', 'Broadcasting Technology'],
    bio: 'Expert in digital sound engineering, audio post-production, and immersive acoustic environments.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/isaac-ofori/'
  },
  {
    id: 'f9',
    name: 'Aaron Adjacodjoe',
    slug: 'aaron-adjacodjoe',
    title: 'Head of Department',
    department: 'Product Design',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2023/11/Aaron-ADJACODJOE.jpg',
    email: 'a.adjacodjoe@tuc.edu.gh',
    education: ['Ph.D. Visual Communication', 'M.A. Design'],
    researchInterests: ['Product Lifecycle Management', 'Human-Centric Design', 'Design Thinking'],
    bio: 'Leading innovations in product lifecycle management and human-centric design frameworks.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/aaron-adjacodjoe/'
  },
  {
    id: 'f10',
    name: 'William Daitey',
    slug: 'william-daitey',
    title: 'Lecturer',
    department: 'Product Design',
    image: 'https://techbridge.edu.gh/static/staff/william_daitey.jpg',
    email: 'william.daitey@tuc.edu.gh',
    education: ['M.A. Communications'],
    researchInterests: ['Design Ethics', 'Industrial Relations', 'Professional Practice'],
    bio: 'Expert in professional ethics and industrial relations within the design sector.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/william-daitey/'
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
    researchInterests: ['Additive Manufacturing', '3D Prototyping', 'CAD Modeling'],
    bio: 'Specialist in 3D modeling and additive manufacturing for product prototyping.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/agyenim-boateng/'
  },
  {
    id: 'f18',
    name: 'Bright Agbotse',
    slug: 'bright-agbotse',
    title: 'Technical Instructor',
    department: 'Product Design',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2021/07/Mr-Bright-Agbotse.jpg',
    email: 'b.agbotse@tuc.edu.gh',
    education: ['M.A. Fashion Technology'],
    researchInterests: ['Textile Science', 'Apparel Manufacturing', 'Garment Construction'],
    bio: 'Focuses on advanced garment construction, textile science, and apparel manufacturing technology.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/bright-agbotse/'
  },
  {
    id: 'f12',
    name: 'Victoria Abra Honu',
    slug: 'victoria-abra-honu',
    title: 'Programme Coordinator',
    department: 'Fashion Design Technology',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2024/01/Victoria-Abra-Honu.jpg',
    email: 'victoria.honu@techbridge.edu.gh',
    education: ['M.Sc. Textiles'],
    researchInterests: ['Sustainable Textiles', 'Tie-Dye Techniques', 'Fashion Innovation'],
    bio: 'Specialist in tie-dye techniques and sustainable textile production in the modern fashion landscape.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/victoria-abra-honu/'
  },
  {
    id: 'f14',
    name: 'Mary Eddy Takyi',
    slug: 'mary-eddy-takyi',
    title: 'Lecturer',
    department: 'Fashion Design Technology',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2023/11/Mary-Eddy-Takyi-Fashion-Design.jpg',
    email: 'm.takyi@techbridge.edu.gh',
    education: ['M.Sc. Fashion Design'],
    researchInterests: ['Pattern Design', 'Garment Construction', 'Industrial Manufacturing'],
    bio: 'Specialist in pattern design and precision garment construction for industrial manufacturing.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/mary-eddy-takyi/'
  },
  {
    id: 'f13',
    name: 'Florence Kushitor',
    slug: 'florence-kushitor',
    title: 'Lecturer',
    department: 'Fashion Design Technology',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2023/04/Mrs-Florence-Kushitor.jpg',
    email: 'f.kushitor@techbridge.edu.gh',
    education: ['M.Sc. Textiles'],
    researchInterests: ['Contemporary Textile Design', 'Heritage Fashion', 'Textile Arts'],
    bio: 'Expert in traditional and contemporary textile design, focusing on the intersection of heritage and high-fashion.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/florence-kushitor/'
  },
  {
    id: 'f15',
    name: 'Doris Boakyewaa',
    slug: 'doris-boakyewaa',
    title: 'Lecturer',
    department: 'Fashion Design Technology',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2023/01/Doris-Boakyewaa.jpg',
    email: 'd.boakyewaa@techbridge.edu.gh',
    education: ['M.Sc. Fashion Design'],
    researchInterests: ['Structural Design', 'Pattern Cutting', 'Technical Fashion'],
    bio: 'Instructional lead for pattern cutting and structural design, bringing decades of technical mastery to the classroom.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/doris-boakyewaa/'
  },
  {
    id: 'f20',
    name: 'Daniel Morrison',
    slug: 'daniel-morrison',
    title: 'Part-Time Lecturer',
    department: 'Fashion Design Technology',
    image: 'https://picsum.photos/400/500?random=20',
    email: 'daniel.morrison@techbridge.edu.gh',
    education: ['B.A. Industrial Art'],
    researchInterests: ['Fashion Technology', 'Industrial Art', 'Design Education'],
    bio: 'Academic staff member in the Department of Fashion Design Technology.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/daniel-morrison/'
  }
];

export const HERO_SLIDES: SlideData[] = [
  {
    id: 1,
    title: "Experience TUC from Above",
    titleKey: "hero.title1",
    subtitle: "Pioneering the Future of Industrial Education",
    subtitleKey: "hero.subtitle1",
    image: "https://aucdt.edu.gh/wp-content/uploads/2023/04/Banner-A.jpg",
    video: "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-beautiful-university-campus-4008-large.mp4",
    ctaLink: "https://portal.aucdt.edu.gh/admissions/#/home",
    ctaText: "Apply for 2026",
    ctaTextKey: "hero.cta1",
    overlayColor: "bg-tuc-ink/40"
  },
  {
    id: 2,
    title: "Ghana Tertiary Fashion Awards 2025",
    titleKey: "hero.title2",
    subtitle: "Fashion School of the Year",
    subtitleKey: "hero.subtitle2",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/01/Innovative-Fashion-School-of-the-Year-2024.jpg",
    ctaLink: "/news-feed",
    ctaText: "View Achievement",
    ctaTextKey: "hero.cta2",
    overlayColor: "bg-black/50",
    hideText: true
  },
  {
    id: 3,
    title: "Creative Intelligence",
    titleKey: "hero.title3",
    subtitle: "Where Design Thinking Meets Technical Mastery",
    subtitleKey: "hero.subtitle3",
    image: "https://aucdt.edu.gh/img/bg.jpg",
    video: "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-beautiful-university-campus-4008-large.mp4",
    ctaLink: "/academics",
    ctaText: "View Programmes",
    ctaTextKey: "hero.cta3",
    overlayColor: "bg-tuc-ink/40"
  },
  {
    id: 4,
    title: "Department of",
    titleKey: "hero.title4",
    subtitle: "Product Design",
    subtitleKey: "hero.subtitle4",
    image: "https://aucdt.edu.gh/wp-content/uploads/2020/08/Product-Design-material-test.jpg",
    ctaLink: "/academics",
    ctaText: "Explore Department",
    ctaTextKey: "hero.cta4",
    overlayColor: "bg-black/50"
  },
  {
    id: 5,
    title: "Department of",
    titleKey: "hero.title5",
    subtitle: "Jewellery Design",
    subtitleKey: "hero.subtitle5",
    image: "https://aucdt.edu.gh/wp-content/uploads/2022/09/Student-ring-design.jpg",
    ctaLink: "/academics",
    ctaText: "Explore Department",
    ctaTextKey: "hero.cta5",
    overlayColor: "bg-black/50"
  },
  {
    id: 6,
    title: "Department of",
    titleKey: "hero.title6",
    subtitle: "Digital Media and Communication Design",
    subtitleKey: "hero.subtitle6",
    image: "https://aucdt.edu.gh/wp-content/uploads/2023/04/Digital-Media-and-Communication-Design-Banner.jpg",
    video: "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-beautiful-university-campus-4008-large.mp4",
    ctaLink: "/academics",
    ctaText: "Explore Department",
    ctaTextKey: "hero.cta6",
    overlayColor: "bg-black/50"
  },
  {
    id: 7,
    title: "Welcome to the Department of",
    titleKey: "hero.title7",
    subtitle: "Fashion Design Technology",
    subtitleKey: "hero.subtitle7",
    image: "https://aucdt.edu.gh/wp-content/uploads/2022/06/aucdt-fashion3.jpg",
    ctaLink: "/academics",
    ctaText: "Explore Department",
    ctaTextKey: "hero.cta7",
    overlayColor: "bg-black/50"
  }
];

export const PROGRAMMES: ProgrammeCardData[] = [
  {
    id: 1,
    title: "Digital Media & Communication",
    description: "Master the art of interactive storytelling and disruptive digital communication strategies in a rapidly evolving landscape.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2023/04/Digital-Media-and-Communication-Design-Banner.jpg",
    badge: "B.Tech DMCD",
    link: "/academics"
  },
  {
    id: 2,
    title: "Product Design & Entrepreneurship",
    description: "Bridge the gap between creativity and commerce. Learn to design products that solve real-world problems and lead ventures.",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1600&auto=format&fit=crop",
    badge: "B.A. PDE",
    link: "/academics"
  },
  {
    id: 3,
    title: "Fashion Design Technology",
    description: "Innovate the fashion industry through technical excellence, sustainable practices, and creative leadership.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2022/06/aucdt-fashion3.jpg",
    badge: "B.Tech FDT",
    link: "/academics"
  },
  {
    id: 4,
    title: "Jewellery Design Technology",
    description: "Precision manufacturing meets luxury design. Become a master of precious metal arts and contemporary adornment.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2020/08/lecturer-with-student.jpg",
    badge: "B.A. JDT",
    link: "/academics"
  }
];
