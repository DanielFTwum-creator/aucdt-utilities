import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "I can't recommend Temilola creatives enough! The pricing was very reasonable, and she really went the extra mile.",
    author: "Ann",
    role: "Business Owner"
  },
  {
    quote: "My logo brought my business to life. I didn't want generic clip art, I wanted something that spoke to my clients.",
    author: "John",
    role: "Entrepreneur"
  },
  {
    quote: "Since the website went live, I've had 3 contact forms come through. It started generating work within a couple of days!",
    author: "Manuel",
    role: "Marketing Director"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Client Stories</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 relative"
            >
              <Quote className="absolute top-8 right-8 text-white/10 w-12 h-12" />
              <div className="flex space-x-1 mb-6 text-orange-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">"{item.quote}"</p>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center font-bold text-white">
                  {item.author[0]}
                </div>
                <div>
                  <h4 className="font-bold">{item.author}</h4>
                  <p className="text-sm text-gray-400">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
