import React from 'react';

const programmes = [
  {
    badge: "Degree",
    title: "BA Product Design & Entrepreneurship",
    description: "This Four (4) Academic year programme together with basic entrepreneurship courses and the necessary principles of design will equip our youth with the needed skills leading to self-employment.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    link: "#"
  },
  {
    badge: "Degree",
    title: "BTech Digital Media and Communication Design",
    description: "A four year programme which exposes students to courses related to Graphic Design, Photography, digital media, web design, motion graphics etc.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    link: "#"
  },
  {
    badge: "Degree",
    title: "BTech Fashion Design Technology",
    description: "Our four year BTech Fashion Design Technology programme aims at providing you with the skills necessary to further your career as a fashion designer.",
    image: "https://images.unsplash.com/photo-1537832816519-689ad163238b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    link: "#"
  },
  {
    badge: "Degree",
    title: "BA Jewellery Design Technology",
    description: "A four year degree programme aimed at equipping students with knowledge, philosophies and resources requisite for intellectual inquiry into Jewellery Design.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    link: "#"
  },
  {
    badge: "Certificate",
    title: "Certificate in Bench Jewellery",
    description: "This course seeks to train students to acquire the prerequisite hands-on-skills in Jewellery Design for them to become professional Bench Jewellers after ONE ACADEMIC YEAR.",
    image: "https://images.unsplash.com/photo-1617038224538-276365d638b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    link: "#"
  },
  {
    badge: "Certificate",
    title: "Short Courses",
    description: "Experience the Best in Design Education: Short Courses in Digital Media, Fashion, and Jewelry Design at Techbridge University College.",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    link: "#"
  }
];

const Programmes: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-tuc-green inline-block relative pb-2">
            Our Programmes
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-tuc-gold"></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programmes.map((prog, index) => (
            <div key={index} className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
              <div className="relative h-48 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundImage: `url(${prog.image})` }}
                ></div>
                <div className="absolute top-4 right-4 bg-tuc-gold text-tuc-maroon text-xs font-bold px-3 py-1 rounded uppercase">
                  {prog.badge}
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{prog.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 flex-grow leading-relaxed">
                  {prog.description}
                </p>
                <a 
                  href={prog.link} 
                  className="inline-block border border-tuc-green text-tuc-green dark:text-green-400 dark:border-green-400 text-center py-2 rounded hover:bg-tuc-green hover:text-white dark:hover:bg-green-400 dark:hover:text-gray-900 transition-all duration-300 text-sm font-medium uppercase"
                >
                  Read More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programmes;