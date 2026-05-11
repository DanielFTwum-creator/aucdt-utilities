import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Monitor, PenTool, Image as ImageIcon } from 'lucide-react';

const services = [
  {
    title: 'Photographer',
    category: 'Photography',
    description: 'Capturing moments with precision and artistic flair. From portraits to events, we make memories last.',
    icon: Camera,
    image: 'https://muniratu.dmcd.in/wp-content/uploads/2026/02/pinterest-wallpaper-colors-brightwallpaper-followme-likeme-wonderfull-❤️.jpg'
  },
  {
    title: 'Website Designer',
    category: 'Web Design',
    description: 'Building responsive, high-converting websites that tell your brand story and engage your audience.',
    icon: Monitor,
    image: 'https://muniratu.dmcd.in/wp-content/uploads/2026/02/Healthy-Bakery-Organic-Vegan-Friendly-Landing-Page-Design.jpg'
  },
  {
    title: 'Graphic Design',
    category: 'Graphic Design',
    description: 'Logos, brochures, banners, and brand identity systems that stand out in a crowded marketplace.',
    icon: PenTool,
    image: 'https://muniratu.dmcd.in/wp-content/uploads/2026/02/brochure-logo-banner-graphic-designing-service-306-1.jpg'
  },
  {
    title: 'Photo Editing',
    category: 'Photo Editing',
    description: 'Professional retouching and manipulation to enhance your visuals and bring your creative vision to life.',
    icon: ImageIcon,
    image: 'https://muniratu.dmcd.in/wp-content/uploads/2026/02/AI-man-colour.jpg'
  }
];

const categories = ['All', 'Photography', 'Web Design', 'Graphic Design', 'Photo Editing'];

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredServices = activeCategory === 'All' 
    ? services 
    : services.filter(service => service.category === activeCategory);

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive creative solutions tailored to elevate your brand presence.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gray-900 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredServices.map((service) => (
              <motion.div
                layout
                key={service.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer"
              >
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4 text-white">
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
