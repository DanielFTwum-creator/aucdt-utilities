import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { NewsItem } from '../types';

const newsData: NewsItem[] = [
  {
    id: 1,
    title: "CKT-UTAS University Hospital Collaborates with FDA",
    excerpt: "In a bid to enhance medication safety and promote public health, the CKT-UTAS University Hospital has partnered with...",
    date: "November 10, 2025",
    imageUrl: "https://picsum.photos/400/300?random=20",
    category: "News"
  },
  {
    id: 2,
    title: "Prof. Akazili Elevated to Serve on AfHEA Board",
    excerpt: "The C. K. Tedam University of Technology and Applied Sciences (CKT-UTAS) proudly congratulates Prof. James on his appointment...",
    date: "November 8, 2025",
    imageUrl: "https://picsum.photos/400/300?random=21",
    category: "Achievement"
  },
  {
    id: 3,
    title: "October is Breast Cancer Awareness Month",
    excerpt: "🎗 October is Breast Cancer Awareness Month! The CKT-University Hospital is offering free breast screening to the community...",
    date: "October 22, 2025",
    imageUrl: "https://picsum.photos/400/300?random=22",
    category: "Announcement"
  }
];

const News: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
            <div>
                <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-2">News & Updates</h2>
                <div className="h-1 w-20 bg-secondary"></div>
            </div>
            <a href="#top" className="hidden md:flex items-center text-primary font-bold hover:text-secondary transition-colors mt-4 md:mt-0">
                View More News <ArrowRight size={18} className="ml-1" />
            </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsData.map((item) => (
                <article key={item.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                    <div className="relative h-48 overflow-hidden">
                        <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4 bg-secondary text-primary-dark text-xs font-bold px-3 py-1 rounded-full">
                            {item.category}
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center text-gray-500 text-xs mb-3">
                            <Calendar size={14} className="mr-1" />
                            {item.date}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                            <a href="#top">{item.title}</a>
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {item.excerpt}
                        </p>
                        <a href="#top" className="inline-flex items-center text-primary font-semibold text-sm hover:underline">
                            Read More <ArrowRight size={14} className="ml-1" />
                        </a>
                    </div>
                </article>
            ))}
        </div>

        <div className="mt-8 text-center md:hidden">
            <a href="#top" className="inline-block bg-white border border-primary text-primary font-bold py-3 px-8 rounded hover:bg-primary hover:text-white transition-colors">
                View More News
            </a>
        </div>
      </div>
    </section>
  );
};

export default News;