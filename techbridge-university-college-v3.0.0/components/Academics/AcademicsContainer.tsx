
import React, { useMemo } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import FacultyDirectory from './FacultyDirectory.tsx';
import FacultyProfile from './FacultyProfile.tsx';
import AcademicCalendar from './AcademicCalendar.tsx';
import AcademicsOverview from './AcademicsOverview.tsx';
import Timetable from './Timetable.tsx';
import { FACULTY_DATA } from '../../constants.ts';

interface AcademicsContainerProps {
  subRoute: string;
}

const AcademicsContainer: React.FC<AcademicsContainerProps> = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const subSection = pathParts[1] || '';
  const slug = pathParts[2] || '';

  const getBreadcrumbName = (str: string) => {
    if (!str) return '';
    const member = FACULTY_DATA.find(f => f.slug === str);
    if (member) return member.name;
    if (str === 'faculty') return 'Faculty Directory';
    if (str === 'calendar') return 'Academic Calendar';
    if (str === 'timetable') return 'Lecture Timetables';
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
  };

  return (
    <div className="bg-white dark:bg-tuc-midnight min-h-screen text-left">
      <nav className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-3 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <ol className="flex text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <li>
              <Link 
                to="/" 
                className="hover:text-tuc-forest transition-colors focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded px-1"
                aria-label="Return to Home page"
                title="Go to Home"
              >
                Home
              </Link>
            </li>
            <li className="mx-3 opacity-30">/</li>
            <li>
              <Link 
                to="/academics" 
                className={`${!subSection ? "text-tuc-gold" : "hover:text-tuc-forest transition-colors"} focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded px-1`}
                aria-label="Go to Academics overview"
                title="Academics Overview"
              >
                Academics
              </Link>
            </li>
            {subSection && (
              <>
                <li className="mx-3 opacity-30">/</li>
                <li>
                  <Link 
                    to={`/academics/${subSection}`} 
                    className={`${!slug ? "text-tuc-gold" : "hover:text-tuc-forest transition-colors"} focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded px-1`}
                    aria-label={`Go to ${getBreadcrumbName(subSection)}`}
                    title={getBreadcrumbName(subSection)}
                  >
                    {getBreadcrumbName(subSection)}
                  </Link>
                </li>
              </>
            )}
            {slug && (
              <>
                <li className="mx-3 opacity-30">/</li>
                <li className="text-tuc-gold truncate max-w-[200px]">{getBreadcrumbName(slug)}</li>
              </>
            )}
          </ol>
        </div>
      </nav>
      <div className="animate-fade-in-up">
        <Routes>
          <Route path="/" element={<AcademicsOverview />} />
          <Route path="faculty" element={<FacultyDirectory />} />
          <Route path="faculty/:slug" element={<FacultyProfile slug={slug} />} />
          <Route path="calendar" element={<AcademicCalendar />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="*" element={<AcademicsOverview />} />
        </Routes>
      </div>
    </div>
  );
};

export default AcademicsContainer;
