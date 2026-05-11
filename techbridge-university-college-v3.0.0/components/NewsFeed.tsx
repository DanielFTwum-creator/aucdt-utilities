
import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Loader2, ImageOff, X, Share2 } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  category: string;
  link: string;
  content?: React.ReactNode;
}

const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Simulate a network request for the news feed
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const data: NewsItem[] = [
          {
            id: 7,
            title: "AUCDT on Blackboard: A Conversation with AI",
            date: "Feb 10, 2025",
            excerpt: "Explore an engaging AI interaction with Gemini Advanced 2.0 Pro as it generates a custom blackboard image with AUCDT branding.",
            image: "https://aucdt.edu.gh/wp-content/uploads/2025/02/AUCDT-on-Blackboard.jpg",
            category: "Technology",
            link: "https://aucdt.edu.gh/newsroom/",
            content: (
              <div className="space-y-6 text-gray-800 dark:text-gray-200">
                <p className="font-bold text-lg text-tuc-forest dark:text-tuc-gold">
                  Exploring Generative AI in Branding
                </p>
                <p>
                  My chats with Gemini Advanced 2.0 Pro get very interesting every day. Below is a transcript of a session exploring the generation of branded assets.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl border-l-4 border-tuc-gold">
                  <p className="font-bold text-xs uppercase tracking-widest mb-2 text-tuc-forest dark:text-tuc-gold">Prompt</p>
                  <p className="italic text-sm">
                    "A clear image of a blackboard with a clean dark green surface and the word '#aucdt' written precisely and legibly in the centre with bold white chalk letters, with bokeh effects in the background that seem to spell 'aucdt'."
                  </p>
                </div>
                
                <p>
                  Gemini responded with the following generation:
                </p>
                
                <div className="rounded-xl overflow-hidden shadow-lg my-6 border border-gray-200 dark:border-gray-700">
                   <img 
                    src="https://aucdt.edu.gh/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-10-at-13.29.20.jpeg" 
                    alt="First AI Generation of Blackboard" 
                    className="w-full h-auto object-cover"
                   />
                </div>

                <p>
                  <strong>User:</strong> "That’s very nice – you are back to generating images."
                </p>
                <p>
                  <strong>Gemini:</strong> "Thank you. I'm glad to be back to generating images for you. I'm still learning and improving, but I'm happy to help you create the images you need."
                </p>

                <p>
                  We then discussed the prompt ID scheme for quality assurance.
                </p>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl text-sm font-mono space-y-2">
                   <p><strong>ID:</strong> 20241204-blackboard-aucdt-bokeh</p>
                   <p><strong>Timestamp:</strong> 20241204</p>
                   <p><strong>Full Prompt:</strong> A clear image of a blackboard with a clean dark green surface and the word '#aucdt' written precisely and legibly in the center...</p>
                </div>

                <p>
                  To refine the result, I requested a modification to align with institutional identity: <em>"The black board border is in AUCDT branding colors."</em>
                </p>

                <div className="rounded-xl overflow-hidden shadow-lg my-6 border border-gray-200 dark:border-gray-700">
                   <img 
                    src="https://aucdt.edu.gh/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-10-at-13.29.46.jpeg" 
                    alt="Refined AI Generation with Branding Colors" 
                    className="w-full h-auto object-cover"
                   />
                </div>
                
                <p>
                  This interaction demonstrates the capability of modern AI tools like Gemini to understand nuanced branding requirements and iterative feedback.
                </p>
              </div>
            )
          },
          {
            id: 6,
            title: "AUCDT Launches New Learning Management System",
            date: "March 4, 2025",
            excerpt: "AsanSka University College of Design and Technology officially launched its new Learning Management System (LMS), marking a new era of digital transformation.",
            image: "https://aucdt.edu.gh/wp-content/uploads/2025/03/Agbosu-presenting-at-the-AUCDT-LMS.webp",
            category: "Technology",
            link: "https://aucdt.edu.gh/newsroom/",
            content: (
              <div className="space-y-6 text-gray-800 dark:text-gray-200">
                <p className="font-bold text-lg text-tuc-forest dark:text-tuc-gold">
                  AUCDT Launches New Learning Management System
                </p>
                <p>
                  AsanSka University College of Design and Technology (AUCDT) on the 25th of February, 2025 officially launched its new Learning Management System (LMS), a significant step forward in enhancing digital learning and teaching experiences. The presentation was led by Mr. Bright Senanu Agbosu from the IT Unit, who provided an insightful and practical demonstration of the platform’s features and functionalities.
                </p>
                <p>
                  The AUCDT LMS, built on the Moodle framework, is designed to provide a flexible, scalable, and interactive learning environment that supports blended learning, online assessments, and collaboration. With its user-friendly interface and mobile accessibility, the platform enables lecturers to manage courses efficiently and students to access learning materials anytime, anywhere.
                </p>
                <div className="rounded-xl overflow-hidden shadow-lg my-6">
                   <img 
                    src="https://aucdt.edu.gh/wp-content/uploads/2025/03/aucdtlmslaunch19.webp" 
                    alt="Mr. Bright Senanu Agbosu presenting during the launch of the AUCDT LMS" 
                    className="w-full h-auto object-cover"
                   />
                </div>
                <p>
                  The launch event saw the presence of esteemed members of the AUCDT community, including Prof. Emmanuel Amankwah Asante (President), Dr. Joseph A. A. Sackey (Vice President), Heads of Departments (HODs), and the academic staff. Mr. Daniel Twum, Head of IT, played a pivotal role in spearheading the project, ensuring a seamless implementation and robust system.
                </p>
                <p>
                  The session focused on navigating the LMS, highlighting its benefits in streamlining academic activities, improving access to course materials, and facilitating seamless communication between lecturers and students.
                </p>
                <div className="rounded-xl overflow-hidden shadow-lg my-6">
                   <img 
                    src="https://aucdt.edu.gh/wp-content/uploads/2025/03/Agbosu-presenting-at-the-AUCDT-LMS.webp" 
                    alt="Mr. Bright Senanu Agbosu presenting" 
                    className="w-full h-auto object-cover"
                   />
                </div>
                <p>
                  During the presentation, Mr. Agbosu guided attendees through the system's user interface, demonstrating how to create and manage courses, upload assignments, track student progress, and utilize interactive tools to boost engagement. He emphasized how the LMS aligns with AUCDT’s commitment to adopting modern educational technologies to support effective teaching and learning.
                </p>
                <p>
                  The President of AUCDT expressed enthusiasm about the introduction of the LMS, noting that it marks a new era of academic excellence and digital transformation at AUCDT. The Vice President and HODs echoed this sentiment, highlighting the importance of the platform in fostering a collaborative and resourceful learning environment.
                </p>
                <div className="rounded-xl overflow-hidden shadow-lg my-6">
                   <img 
                    src="https://aucdt.edu.gh/wp-content/uploads/2025/03/AUCDT-LMS-Banner-DP.jpg" 
                    alt="AUCDT LMS Banner" 
                    className="w-full h-auto object-cover"
                   />
                </div>
                <p>
                  The launch concluded with a Q&A session, where staff members shared feedback and sought clarifications on specific LMS features. The IT Unit assured continuous support and training to ensure a smooth transition to the new system.
                </p>
                <p>
                  Overall, the introduction of the new LMS is expected to enhance productivity, streamline academic workflows, and ultimately contribute to the university's vision of producing highly skilled and innovative graduates.
                </p>
                <p className="font-black italic text-tuc-gold">
                  Staff and students of AUCDT can access the Learning Management System by clicking <a href="https://lms.aucdt.edu.gh" target="_blank" rel="noopener noreferrer" className="underline hover:text-tuc-forest">here</a>.
                </p>
              </div>
            )
          },
          {
            id: 5,
            title: "9th Matriculation Ceremony Held for Fresh Students",
            date: "January 30, 2026",
            excerpt: "Techbridge University College formally welcomed the newest cohort of creative minds during the 9th Matriculation Ceremony at the Oyibi Campus.",
            image: "https://aucdt.edu.gh/tuc/tucmatriculation.jpg",
            category: "Events",
            link: "https://aucdt.edu.gh/newsroom/",
            content: (
              <div className="space-y-6 text-gray-800 dark:text-gray-200">
                <p className="font-bold text-lg text-tuc-forest dark:text-tuc-gold">
                  Welcome to the Techbridge Family!
                </p>
                <p>
                  On Friday, January 30, 2026, Techbridge University College (TUC) held its 9th Matriculation Ceremony to formally admit fresh students into our various Bachelor of Technology and Bachelor of Arts programmes for the 2026 academic year.
                </p>
                <div className="rounded-xl overflow-hidden shadow-lg my-6">
                   <img 
                    src="https://aucdt.edu.gh/tuc/tucmatriculation.jpg" 
                    alt="Matriculation Oath" 
                    className="w-full h-auto object-cover"
                   />
                </div>
                <p>
                  The colorful event, held at the Oyibi Campus, was presided over by the President of the University College. In his address, he charged the new students to embrace the institution's core pillars of <strong>Creative Intelligence</strong> and <strong>Technical Excellence</strong>.
                </p>
                <p>
                  "You are entering an institution that believes in the power of design to build nations," the President remarked. "Here, you will not just learn theories; you will solve real-world industrial problems. I urge you to take full advantage of our workshops, labs, and the mentorship of our experienced faculty."
                </p>
                <p>
                  The matriculants swore the oath of allegiance, pledging to abide by the rules and regulations of the University College. The ceremony was witnessed by the Governing Council, Faculty Members, and proud parents.
                </p>
                <p className="font-black italic text-tuc-gold">
                  Congratulations to the Class of 2026!
                </p>
              </div>
            )
          },
          {
            id: 4,
            title: "AsanSka University College Wins Innovative Fashion School of the Year!",
            date: "January 7, 2025",
            excerpt: "The Fashion Design Department of AsanSka University College of Design and Technology (AUCDT) has been honored as the Innovative Fashion School of the Year at the prestigious Ghana Tertiary Fashion Awards 2024!",
            image: "https://aucdt.edu.gh/wp-content/uploads/2025/01/Innovative-Fashion-School-of-the-Year-2024.jpg",
            category: "Achievement",
            link: "https://aucdt.edu.gh/newsroom/",
            content: (
              <div className="space-y-6 text-gray-800 dark:text-gray-200">
                <p className="font-bold text-lg text-tuc-forest dark:text-tuc-gold">
                  AsanSka University College of Design and Technology Wins Innovative Fashion School of the Year!
                </p>
                <p>
                  We are proud to announce that the Fashion Design Department of AsanSka University College of Design and Technology (AUCDT) has been honored as the Innovative Fashion School of the Year at the prestigious Ghana Tertiary Fashion Awards 2024!
                </p>
                <div className="rounded-xl overflow-hidden shadow-lg my-6">
                   <img 
                    src="https://aucdt.edu.gh/wp-content/uploads/2025/01/Innovative-Fashion-School-of-the-Year-2024.jpg" 
                    alt="Award Ceremony" 
                    className="w-full h-auto object-cover"
                   />
                </div>
                <p>
                  This remarkable achievement reflects our commitment to pushing boundaries in fashion education, fostering creativity, and equipping our students with cutting-edge skills to excel in the ever-evolving fashion industry.
                </p>
                <p>
                  We dedicate this award to our talented students, dedicated faculty, and supportive community who have worked tirelessly to make AUCDT a beacon of innovation in fashion design. Together, we continue to redefine the future of fashion education in Ghana and beyond.
                </p>
                <p className="font-black italic text-tuc-gold">
                  Here’s to many more milestones ahead!
                </p>
              </div>
            )
          },
          {
            id: 2,
            title: "Fashion Department Stuns at Accra Fashion Week",
            date: "September 28, 2025",
            excerpt: "Final year students showcased their avant-garde collections, receiving standing ovations from industry leaders and fashion enthusiasts alike.",
            image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop",
            category: "Achievement",
            link: "https://aucdt.edu.gh/newsroom/",
            content: (
              <div className="space-y-6 text-gray-800 dark:text-gray-200">
                <p className="font-bold text-lg text-tuc-forest dark:text-tuc-gold">Fashion Department Stuns at Accra Fashion Week</p>
                <p>Final year students from the Fashion Design Technology department showcased their avant-garde collections at the recent Accra Fashion Week, receiving standing ovations from industry leaders and fashion enthusiasts alike.</p>
                <div className="rounded-xl overflow-hidden shadow-lg my-6">
                   <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop" alt="Fashion Show" className="w-full h-auto object-cover" />
                </div>
                <p>The collection, titled "Afro-Futurism: Roots & Wings", combined traditional Ghanaian textiles with modern structural designs.</p>
              </div>
            )
          },
          {
            id: 3,
            title: "New Design Computing Lab Commissioned",
            date: "August 10, 2025",
            excerpt: "To bolster our commitment to digital excellence, a state-of-the-art lab has been opened for the Design Computing and AI department.",
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop",
            category: "Campus Update",
            link: "https://aucdt.edu.gh/newsroom/",
            content: (
              <div className="space-y-6 text-gray-800 dark:text-gray-200">
                <p className="font-bold text-lg text-tuc-forest dark:text-tuc-gold">New Design Computing Lab Commissioned</p>
                <p>To bolster our commitment to digital excellence, a state-of-the-art lab has been opened for the Design Computing and AI department.</p>
                <div className="rounded-xl overflow-hidden shadow-lg my-6">
                   <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop" alt="Computer Lab" className="w-full h-auto object-cover" />
                </div>
                <p>Equipped with high-performance workstations and the latest rendering software, this facility will enable students to push the boundaries of 3D modeling and simulation.</p>
              </div>
            )
          }
        ];
        
        setNews(data);
      } catch (error) {
        console.error("Failed to fetch news data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedArticle]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
    const fallback = e.currentTarget.parentElement?.querySelector('.image-fallback');
    if (fallback) {
      fallback.classList.remove('hidden');
    }
  };

  const handleReadMore = (e: React.MouseEvent, item: NewsItem) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedArticle(item);
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/40 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
           <h2 className="text-3xl md:text-4xl font-black text-tuc-forest dark:text-white mb-4 uppercase tracking-tighter">Latest News & Updates</h2>
           <div className="w-24 h-1.5 bg-tuc-gold mx-auto rounded-full"></div>
           <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
             Keep up with the latest happenings, student achievements, and events at Techbridge University College.
           </p>
        </div>

        {loading ? (
           <div className="flex flex-col justify-center items-center h-64 w-full">
             <Loader2 className="w-12 h-12 text-tuc-forest dark:text-tuc-gold animate-spin mb-4" />
             <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Syncing Feed...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <article 
                key={item.id} 
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col border border-gray-100 dark:border-gray-700 hover:-translate-y-1"
              >
                <div className="relative h-60 overflow-hidden bg-gray-100 dark:bg-gray-900">
                   <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    onError={handleImageError}
                   />
                   <div className="image-fallback absolute inset-0 hidden flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-300 dark:text-gray-700">
                     <ImageOff size={48} className="mb-2" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Image Unavailable</span>
                   </div>
                   
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                   <span className="absolute top-6 left-6 bg-tuc-gold text-tuc-forest text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl z-10">
                     {item.category}
                   </span>
                </div>

                <div className="p-8 flex-1 flex flex-col text-left">
                   <div className="flex items-center text-gray-400 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                     <Calendar size={14} className="mr-2 text-tuc-gold" />
                     {item.date}
                   </div>
                   
                   <h3 className="text-xl font-black text-gray-800 dark:text-white mb-4 group-hover:text-tuc-forest dark:group-hover:text-tuc-gold transition-colors line-clamp-2 leading-tight uppercase tracking-tight">
                     <button 
                       type="button"
                       onClick={(e) => handleReadMore(e, item)} 
                       className="text-left focus:outline-none focus:underline focus:ring-2 focus:ring-tuc-gold rounded"
                       aria-label={`Read full story: ${item.title}`}
                       title={`Read full story: ${item.title}`}
                     >
                       {item.title}
                     </button>
                   </h3>
                   
                   <p className="text-gray-600 dark:text-gray-400 mb-8 line-clamp-3 flex-1 text-sm leading-relaxed font-medium">
                     {item.excerpt}
                   </p>
                   
                   <button
                    type="button" 
                    onClick={(e) => handleReadMore(e, item)}
                    className="inline-flex items-center text-tuc-forest dark:text-tuc-gold font-black text-xs uppercase tracking-widest hover:text-tuc-gold dark:hover:text-white transition-colors mt-auto group/link text-left focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded p-1 -ml-1"
                    aria-label={`Read full story: ${item.title}`}
                    title={`Read full story: ${item.title}`}
                   >
                     Read Full Story 
                     <ArrowRight size={18} className="ml-3 transform group-hover/link:translate-x-2 transition-transform" />
                   </button>
                </div>
              </article>
            ))}
          </div>
        )}
        
        <div className="text-center mt-16">
            <a 
                href="https://aucdt.edu.gh/newsroom/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border-2 border-tuc-forest dark:border-tuc-gold text-tuc-forest dark:text-tuc-gold px-12 py-4 rounded-full font-black hover:bg-tuc-forest hover:text-white dark:hover:bg-tuc-gold dark:hover:text-tuc-forest transition-all duration-300 uppercase tracking-[0.2em] text-xs shadow-xl focus:outline-none focus:ring-4 focus:ring-tuc-forest dark:focus:ring-tuc-gold"
                aria-label="Explore the full Newsroom on the main website"
                title="Explore Newsroom"
            >
                Explore Newsroom <ArrowRight size={16} />
            </a>
        </div>
      </div>

      {/* Full Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-tuc-forest/90 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedArticle(null)}></div>
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-scale-up">
            
            {/* Modal Header Image */}
            <div className="relative h-64 sm:h-80 md:h-96 w-full">
              <img 
                src={selectedArticle.image} 
                alt={selectedArticle.title} 
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 right-6 p-3 bg-white/20 hover:bg-white text-white hover:text-tuc-forest rounded-full backdrop-blur-md transition-all shadow-lg focus:outline-none focus:ring-4 focus:ring-white"
                aria-label="Close article modal"
                title="Close article"
              >
                <X size={24} />
              </button>
              <div className="absolute bottom-0 left-0 p-8 sm:p-12 w-full">
                <span className="inline-block bg-tuc-gold text-tuc-forest text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] mb-4 shadow-lg">
                  {selectedArticle.category}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight shadow-black drop-shadow-lg">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center text-gray-300 text-xs font-bold mt-4 uppercase tracking-widest gap-6">
                  <span className="flex items-center"><Calendar size={14} className="mr-2 text-tuc-gold" /> {selectedArticle.date}</span>
                  <button className="flex items-center hover:text-white transition-colors"><Share2 size={14} className="mr-2" /> Share</button>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 sm:p-12 md:p-16">
              <div className="prose dark:prose-invert max-w-none font-medium leading-relaxed">
                {selectedArticle.content || (
                  <div className="flex flex-col items-center justify-center py-4">
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">{selectedArticle.excerpt}</p>
                    <a 
                      href={selectedArticle.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 bg-tuc-forest text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-tuc-gold hover:text-tuc-forest transition-all"
                    >
                      Read Full Article on Website <ArrowRight size={14} />
                    </a>
                  </div>
                )}
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Techbridge University College</span>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-tuc-forest dark:text-tuc-gold rounded-full font-black text-xs uppercase tracking-widest hover:bg-tuc-forest hover:text-white transition-all focus:outline-none focus:ring-4 focus:ring-tuc-forest dark:focus:ring-tuc-gold"
                  aria-label="Close article modal"
                  title="Close article"
                >
                  Close Article
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

export default NewsFeed;
