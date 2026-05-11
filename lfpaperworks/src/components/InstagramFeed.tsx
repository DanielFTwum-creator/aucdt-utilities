import React from 'react';
import { Instagram, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

const InstagramFeed: React.FC = () => {
  // Mock Instagram data
  const posts = [
    { id: '1', url: 'https://picsum.photos/seed/ig1/600/600', likes: 124 },
    { id: '2', url: 'https://picsum.photos/seed/ig2/600/600', likes: 89 },
    { id: '3', url: 'https://picsum.photos/seed/ig3/600/600', likes: 256 },
    { id: '4', url: 'https://picsum.photos/seed/ig4/600/600', likes: 112 },
    { id: '5', url: 'https://picsum.photos/seed/ig5/600/600', likes: 178 },
    { id: '6', url: 'https://picsum.photos/seed/ig6/600/600', likes: 94 },
  ];

  return (
    <section className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <span className="label-caps text-tuc-gold mb-4 block">Social Feed</span>
            <h2 className="text-4xl md:text-5xl editorial-heading">Connect With Us</h2>
          </div>
          <a 
            href="https://instagram.com/techbridgegh" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-brand-stone hover:text-tuc-gold transition-colors"
          >
            <Instagram className="w-5 h-5" />
            <span className="label-caps">@techbridgegh</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {posts.map((post, index) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-square overflow-hidden bg-brand-leaf"
            >
              <img 
                src={post.url} 
                alt={`Instagram post ${post.id}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-midnight/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-white flex items-center space-x-2">
                  <Instagram className="w-5 h-5" />
                  <span className="text-sm font-bold">{post.likes}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
