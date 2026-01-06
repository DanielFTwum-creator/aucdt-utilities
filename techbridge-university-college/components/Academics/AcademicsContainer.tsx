
import React, { useMemo } from 'react';
import FacultyDirectory from './FacultyDirectory.tsx';
import FacultyProfile from './FacultyProfile.tsx';
import AcademicCalendar from './AcademicCalendar.tsx';
import AcademicsOverview from './AcademicsOverview.tsx';
import Timetable from './Timetable.tsx';
import { FACULTY_DATA } from '../../constants.ts';

interface AcademicsContainerProps {
  subRoute: string;
}

/**
 * AcademicsContainer handles internal routing for the Academics section.
 * It expects subRoute to be a normalized path string like 'academics/faculty'.
 */
const AcademicsContainer: React.FC<AcademicsContainerProps> = ({ subRoute }) => {
  const { subSection, slug } = useMemo(() => {
    if (!subRoute) return { subSection: '', slug: '' };
    
    // Split segments and filter out empty strings
    const parts = subRoute.split('/').filter(Boolean);
    
    // Standardize: Look for the segment following 'academics'
    const academicsIndex = parts.indexOf('academics');
    const actualParts = academicsIndex !== -1 ? parts.slice(academicsIndex + 1) : parts;

    return {
      subSection: actualParts[0] || '',
      slug: actualParts[1] || ''
    };
  }, [subRoute]);

  const renderContent = () => {
    // Explicit route mapping to prevent fall-through blanks
    if (subSection === 'faculty') {
      if (slug) return <FacultyProfile slug={slug} />;
      return <FacultyDirectory />;
    }
    
    if (subSection === 'calendar') {
      return <AcademicCalendar />;
    }
    
    if (subSection === 'timetable') {
      return <Timetable />;
    }

    // Default to Overview if subSection is empty or unrecognized
    return <AcademicsOverview />;
  };

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
    <div className="bg-white dark:bg-tuc-dark min-h-screen text-left">
      <nav className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-3 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <ol className="flex text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <li><a href="#/" className="hover:text-tuc-maroon transition-colors">Home</a></li>
            <li className="mx-3 opacity-30">/</li>
            <li><a href="#/academics" className={!subSection ? "text-tuc-gold" : "hover:text-tuc-maroon transition-colors"}>Academics</a></li>
            {subSection && (
              <>
                <li className="mx-3 opacity-30">/</li>
                <li>
                  <a href={`#/academics/${subSection}`} className={!slug ? "text-tuc-gold" : "hover:text-tuc-maroon transition-colors"}>
                    {getBreadcrumbName(subSection)}
                  </a>
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
      <div className="animate-fade-in-up">{renderContent()}</div>
    </div>
  );
};

export default AcademicsContainer;
