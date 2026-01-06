
import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Loader2, ImageOff } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  category: string;
  link: string;
}

const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const data: NewsItem[] = [
          {
            id: 1,
            title: "TUC Matriculates Fresh Students for 2025/2026 Academic Year",
            date: "October 15, 2025",
            excerpt: "The University College held its 8th Matriculation ceremony to welcome the new cohort of creative minds into the university community.",
            image: "https://aucdt.edu.gh/wp-content/uploads/2022/11/MATRICULATION-2022-1.jpg",
            category: "Events",
            link: "#"
          },
          {
            id: 2,
            title: "Fashion Department Stuns at Accra Fashion Week",
            date: "September 28, 2025",
            excerpt: "Final year students showcased their avant-garde collections, receiving standing ovations from industry leaders and fashion enthusiasts alike.",
            image: "https://aucdt.edu.gh/wp-content/uploads/2022/06/aucdt-fashion3.jpg",
            category: "Achievement",
            link: "#"
          },
          {
            id: 3,
            title: "New Design Computing Lab Commissioned",
            date: "August 10, 2025",
            excerpt: "To bolster our commitment to digital excellence, a state-of-the-art lab has been opened for the Design Computing and AI department.",
            image: "https://aucdt.edu.gh/wp-content/uploads/2023/04/Digital-Media-and-Communication-Design-Banner.jpg",
            category: "Campus Update",
            link: "#"
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
    e.currentTarget.nextElementSibling?.classList.remove('hidden');
  };

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
           <h2 className="text-3xl md:text-4xl font-bold text-tuc-maroon mb-4">Latest News & Updates</h2>
           <div className="w-24 h-1.5 bg-tuc-gold mx-auto rounded-full"></div>
           <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
             Keep up with the latest happenings, student achievements, and events at Techbridge University College.
           </p>
        </div>

        {loading ? (
           <div className="flex flex-col justify-center items-center h-64 w-full">
             <Loader2 className="w-12 h-12 text-tuc-maroon animate-spin mb-4" />
             <p className="text-gray-500 font-medium">Loading News Feed...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <article 
                key={item.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col border border-gray-100"
              >
                <div className="relative h-56 overflow-hidden bg-gray-200">
                   <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    onError={handleImageError}
                   />
                   <div className="absolute inset-0 hidden flex items-center justify-center bg-gray-100 text-gray-400">
                     <ImageOff size={48} />
                   </div>
                   
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                   <span className="absolute top-4 left-4 bg-tuc-gold text-tuc-maroon text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md z-10">
                     {item.category}
                   </span>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                   <div className="flex items-center text-gray-500 text-xs font-medium mb-3 uppercase tracking-wider">
                     <Calendar size={14} className="mr-1.5 text-tuc-gold" />
                     {item.date}
                   </div>
                   
                   <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-tuc-maroon transition-colors line-clamp-2 leading-tight">
                     <a href={item.link}>{item.title}</a>
                   </h3>
                   
                   <p className="text-gray-600 mb-6 line-clamp-3 flex-1 text-sm leading-relaxed">
                     {item.excerpt}
                   </p>
                   
                   <a 
                    href={item.link} 
                    className="inline-flex items-center text-tuc-maroon font-bold text-sm hover:text-tuc-gold transition-colors mt-auto group/link"
                   >
                     Read Full Story 
                     <ArrowRight size={16} className="ml-2 transform group-hover/link:translate-x-1 transition-transform" />
                   </a>
                </div>
              </article>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
            <a 
                href="https://aucdt.edu.gh/newsroom/" 
                className="inline-block border-2 border-tuc-maroon text-tuc-maroon px-8 py-3 rounded font-bold hover:bg-tuc-maroon hover:text-white transition-all duration-300 uppercase tracking-wider text-sm shadow-sm hover:shadow-md"
            >
                View All News
            </a>
        </div>
      </div>
    </section>
  );
};

export default NewsFeed;
