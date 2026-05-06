import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#fdfcf8]">
      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center space-x-2 mb-6">
            <span className="h-px w-8 bg-orange-500"></span>
            <span className="text-orange-600 font-medium tracking-wider text-sm uppercase">Creative Portfolio</span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] font-bold text-gray-900 mb-6">
            Make Clarity & <br />
            <span className="italic font-light text-gray-600">Simplicity</span> Priorities.
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-md leading-relaxed">
            We blend art and technology to convey ideas through typography, imagery, and color for branding, advertising, and digital media.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a
              href="#contact"
              className="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all group"
            >
              Start a Project
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center px-8 py-4 border border-gray-200 text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-all"
            >
              View Services
            </a>
          </div>

          <div className="mt-12 flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">
                   {i}
                 </div>
               ))}
            </div>
            <p>Trusted by 50+ happy clients</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
            <img 
              src="https://muniratu.dmcd.in/wp-content/uploads/2026/02/glow-1.jpg-1.jpg" 
              alt="Creative Portrait" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <p className="font-serif italic text-2xl">"Design is the silent ambassador of your brand."</p>
            </div>
          </div>
          
          {/* Floating Badge */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs hidden md:block"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl">
                4+
              </div>
              <div>
                <p className="font-bold text-gray-900">Services</p>
                <p className="text-xs text-gray-500">Photography, Design, Editing & Web</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
