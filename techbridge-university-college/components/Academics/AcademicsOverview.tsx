
import React from 'react';
import { BookOpen, Users, Calendar, Award } from 'lucide-react';

const AcademicsOverview: React.FC = () => {
  const academicCards = [
    { 
      icon: <BookOpen className="text-tuc-gold" size={32} />, 
      title: 'Programmes', 
      link: '#/academics', 
      desc: 'Degrees in AI, Fashion, Media, and Jewellery.' 
    },
    { 
      icon: <Users className="text-tuc-gold" size={32} />, 
      title: 'Faculty', 
      link: '#/academics/faculty', 
      desc: 'Expert scholars and industrial practitioners.' 
    },
    { 
      icon: <Calendar className="text-tuc-gold" size={32} />, 
      title: 'Calendar', 
      link: '#/academics/calendar', 
      desc: 'Key institutional dates and semesters.' 
    },
    { 
      icon: <Award className="text-tuc-gold" size={32} />, 
      title: 'Quality', 
      link: '#/about/accreditation', 
      desc: 'Our commitment to GTEC standards.' 
    }
  ];

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 font-sans text-left">
      <div className="mb-20 max-w-4xl">
        <span className="text-tuc-gold font-black uppercase tracking-[0.3em] text-xs">Academic Excellence</span>
        <h1 className="text-5xl md:text-7xl font-black text-tuc-maroon dark:text-white mt-4 mb-8 tracking-tighter uppercase leading-tight">
          Building the Future of Education
        </h1>
        <p className="text-xl text-tuc-slate dark:text-gray-400 leading-relaxed font-medium">
          Techbridge University College offers a transformative learning experience that bridges creative intelligence with industrial mastery. Explore our academic ecosystem below.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {academicCards.map((box, i) => (
          <a 
            key={i} 
            href={box.link} 
            className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700 group flex flex-col items-start text-left"
          >
            <div className="mb-6 transform group-hover:scale-110 transition-transform">
              {box.icon}
            </div>
            <h3 className="text-xl font-black text-tuc-maroon dark:text-white mb-4 uppercase tracking-tighter">
              {box.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              {box.desc}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AcademicsOverview;
