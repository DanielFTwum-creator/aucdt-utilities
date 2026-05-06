import { motion } from 'motion/react';

const projects = [
  {
    src: 'https://muniratu.dmcd.in/wp-content/uploads/2026/02/Ezekiel-ai-01-1-791x1024.jpg',
    title: 'Ezekiel AI',
    category: 'Branding'
  },
  {
    src: 'https://muniratu.dmcd.in/wp-content/uploads/2026/02/lolamoon-tracing-1-ai-01-1024x724.jpg',
    title: 'Lola Moon',
    category: 'Illustration'
  },
  {
    src: 'https://muniratu.dmcd.in/wp-content/uploads/2026/02/liquor-flyer-722x1024.jpg',
    title: 'Liquor Promo',
    category: 'Marketing'
  },
  {
    src: 'https://muniratu.dmcd.in/wp-content/uploads/2026/02/midsem--724x1024.jpg',
    title: 'Midsem Event',
    category: 'Event Design'
  }
];

export default function Portfolio() {
  return (
    <section id="projects" className="py-24 bg-[#fdfcf8]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">Selected Works</h2>
            <p className="text-gray-600">A showcase of our recent creative endeavors.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative rounded-2xl overflow-hidden ${index % 2 === 0 ? 'md:aspect-[3/4]' : 'md:aspect-[4/3]'} bg-gray-100`}
            >
              <img 
                src={project.src} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-orange-400 text-sm font-medium tracking-wider uppercase">{project.category}</span>
                  <h3 className="text-3xl font-serif text-white mt-2">{project.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
