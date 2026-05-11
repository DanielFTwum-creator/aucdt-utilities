import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

const benefits = [
  { title: "Establish Brand Identity", desc: "Create a cohesive look that builds trust." },
  { title: "Time & Stress Reduction", desc: "Let us handle the creative heavy lifting." },
  { title: "High-Quality Visuals", desc: "Professional grade assets for all media." },
  { title: "Enhanced ROI", desc: "Design that drives real business results." }
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 mb-4">
              <span className="h-px w-8 bg-orange-500"></span>
              <span className="text-orange-600 font-medium tracking-wider text-sm uppercase">About Us</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why Choose Us?</h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              We don't just design; we solve business problems through visual communication. Our approach is rooted in strategy and executed with artistry. We believe that good design is good business.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900">{benefit.title}</h3>
                    <p className="text-sm text-gray-500">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
            <img 
              src="https://muniratu.dmcd.in/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-18-at-10.52.30-AM.jpeg" 
              alt="Muniratu" 
              className="relative rounded-2xl shadow-2xl w-full max-w-md mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-500"
            />
            
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl hidden md:block">
              <p className="font-serif italic text-lg text-gray-900">"Creativity is intelligence having fun."</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
