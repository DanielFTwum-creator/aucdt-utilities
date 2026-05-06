import React from 'react';
import { FileText, BookOpen, Globe, CheckCircle, Calendar, CreditCard } from 'lucide-react';
import { QuickLinkItem } from '../types';

const links: QuickLinkItem[] = [
  {
    title: "2025/26 Admissions List",
    description: "Check 2025/2026 admission status here...",
    icon: <CheckCircle size={32} />,
    linkText: "Check Details",
    linkHref: "#",
    colorClass: "text-green-600"
  },
  {
    title: "2025/2026 Programmes",
    description: "Check the programmes available for the 2025/2026 Admissions Application.",
    icon: <BookOpen size={32} />,
    linkText: "View Programmes",
    linkHref: "#",
    colorClass: "text-blue-600"
  },
  {
    title: "Admission Portal",
    description: "Access the Application Portal for the 2025/2026 Admissions.",
    icon: <Globe size={32} />,
    linkText: "Access Portal",
    linkHref: "#",
    colorClass: "text-purple-600"
  },
  {
    title: "Admission Notice",
    description: "Important notices regarding the 2024/25 admission process.",
    icon: <FileText size={32} />,
    linkText: "Read Notice",
    linkHref: "#",
    colorClass: "text-red-600"
  }
];

const secondaryLinks: QuickLinkItem[] = [
    {
        title: "Academic Calendar",
        description: "List of important Dates, Activities & Breaks",
        icon: <Calendar size={24} />,
        linkText: "View Calendar",
        linkHref: "#",
        colorClass: "bg-secondary/10 text-secondary-dark"
    },
    {
        title: "Fees Schedule",
        description: "Approved fees for 2024/2025 academic year",
        icon: <CreditCard size={24} />,
        linkText: "Check Fees",
        linkHref: "#",
        colorClass: "bg-primary/10 text-primary"
    }
];

const QuickAccess: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50 relative -mt-10 z-20 rounded-t-3xl">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Primary Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {links.map((link, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-primary transform hover:-translate-y-1 duration-300">
                    <div className={`mb-4 ${link.colorClass}`}>
                        {link.icon}
                    </div>
                    <h3 className="text-xl font-bold text-primary-dark mb-2">{link.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{link.description}</p>
                    <a href={link.linkHref} className="text-primary font-semibold text-sm hover:text-secondary transition-colors flex items-center gap-1">
                        {link.linkText} <span aria-hidden="true">&rarr;</span>
                    </a>
                </div>
            ))}
        </div>

        {/* Secondary Info Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {secondaryLinks.map((item, idx) => (
                 <div key={idx} className="bg-white rounded-xl p-6 shadow-md flex items-start gap-4">
                     <div className={`p-3 rounded-full ${item.colorClass}`}>
                        {item.icon}
                     </div>
                     <div>
                         <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                         <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                         <a href={item.linkHref} className="text-sm font-bold text-primary hover:underline">
                             {item.linkText}
                         </a>
                     </div>
                 </div>
             ))}
        </div>

      </div>
    </section>
  );
};

export default QuickAccess;